import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateCriteriaDto } from "./dto/create-criteria.dto";
import { Criteria } from "@prisma/client";

@Injectable()
export class ScoringService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCriteriaDto) {
    if (dto.minValue !== undefined && dto.maxValue !== undefined) {
      if (dto.minValue >= dto.maxValue) {
        throw new BadRequestException("minValue must be less than maxValue");
      }
    }

    return this.prisma.criteria.create({
      data: {
        key: dto.key,
        name: dto.name,
        type: dto.type,
        direction: dto.direction,
        minValue: dto.minValue,
        maxValue: dto.maxValue,
        weight: dto.weight ?? 1,
        sourceField: dto.sourceField
        
      },
    });
  }

  async findAll() {
    return this.prisma.criteria.findMany({
      orderBy: { id: "asc" },
    });
  }


  async deleteOne(id: number) {
  const criteria = await this.prisma.criteria.findUnique({
    where: { id },
  });

  if (!criteria) {
    throw new NotFoundException(`Criteria with id ${id} not found`);
  }

  return this.prisma.criteria.delete({
    where: { id },
  });
}


  
async computeStudentScore(studentId: number) {
  // جلب بيانات الطالب الكاملة مع المعايير
  const student = await this.prisma.student.findUnique({
    where: { id: studentId },
    include: {
      studentCriteria: {
        include: {
          criteria: true,
        },
      },
    },
  });

  if (!student) {
    throw new Error('Student not found');
  }

  // جلب جميع المعايير
  const allCriteria = await this.prisma.criteria.findMany();

  // إنشاء مصفوفة تحتوي على جميع القيم (محسوبة أو مخزنة)
  const criteriaValues = await Promise.all(
    allCriteria.map(async (criteria) => {
      // البحث عن القيمة المخزنة
      const storedValue = student.studentCriteria.find(
        (sc) => sc.criteriaId === criteria.id
      );

      // إذا كانت القيمة مخزنة، نستخدمها
      if (storedValue) {
        return {
          value: storedValue.value,
          criteria,
        };
      }

      // إذا لم تكن مخزنة وكان هناك sourceField، نحسبها من بيانات الطالب
      if (criteria.sourceField) {
        const computedValue = this.computeCriteriaValueFromStudent(
          criteria,
          student
        );
        
        // حفظ القيمة المحسوبة في قاعدة البيانات (اختياري)
        await this.prisma.studentCriterion.upsert({
          where: {
            studentId_criteriaId: {
              studentId,
              criteriaId: criteria.id,
            },
          },
          create: {
            studentId,
            criteriaId: criteria.id,
            value: computedValue,
          },
          update: {
            value: computedValue,
          },
        });

        return {
          value: computedValue,
          criteria,
        };
      }

      // إذا لا يوجد sourceField ولا قيمة مخزنة، نستخدم 0
      return {
        value: 0,
        criteria,
      };
    })
  );

  if (!criteriaValues.length) {
    return {
      totalScore: 0,
      label: "UNASSESSED",
      breakdown: [],
    };
  }

  let totalWeight = 0;
  let weightedSum = 0;

  const breakdown = criteriaValues.map((item) => {
    const {
      value,
      criteria: { minValue, maxValue, direction, weight, key, name },
    } = item;

    let normalized = 0;

    // Normalize
    if (minValue !== null && maxValue !== null && maxValue > minValue) {
      normalized = (value - minValue) / (maxValue - minValue);
    } else {
      // fallback (assume 0–100)
      normalized = value / 100;
    }

    // Reverse if LOWER is better
    if (direction === "LOWER_BETTER") {
      normalized = 1 - normalized;
    }

    // Clamp
    normalized = Math.min(Math.max(normalized, 0), 1);

    const weightValue = weight ?? 1;
    const contribution = normalized * weightValue;

    totalWeight += weightValue;
    weightedSum += contribution;

    return {
      criteria: key,
      name,
      rawValue: value,
      normalized: Number(normalized.toFixed(3)),
      weight: weightValue,
      contribution: Number(contribution.toFixed(3)),
    };
  });

  const score = totalWeight > 0
    ? Math.round((weightedSum / totalWeight) * 100)
    : 0;

  const label =
    score >= 80 ? "CRITICAL" :
    score >= 60 ? "HIGH" :
    score >= 40 ? "MEDIUM" :
    "LOW";

  return {
    studentId,
    totalScore: score,
    label,
    breakdown,
  };
}

// دالة مساعدة لحساب القيمة من بيانات الطالب
private computeCriteriaValueFromStudent(criteria: Criteria, student: any): number {
  const fieldName = criteria.sourceField;
  
  if (!fieldName) {
    return 0;
  }

  // الوصول إلى الحقل في بيانات الطالب
  const fieldValue = student[fieldName];
  
  if (fieldValue === null || fieldValue === undefined) {
    return 0;
  }

  // تحويل القيمة إلى رقم
  switch (criteria.type) {
    case 'BOOLEAN':
      return fieldValue ? 1 : 0;
    
    case 'NUMBER':
      return Number(fieldValue) || 0;
    
    case 'ENUM':
      // يمكنك إضافة منطق خاص للـ ENUM هنا
      return this.mapEnumToNumber(fieldValue);
    
    default:
      return Number(fieldValue) || 0;
  }
}

// دالة مساعدة لتحويل الـ ENUM إلى رقم
private mapEnumToNumber(enumValue: string): number {
  // يمكنك تخصيص هذا المنطق بناءً على احتياجاتك
  const mapping: Record<string, number> = {
    'ضعيف': 0,
    'متوسط': 50,
    'جيد': 100,
    'ابتدائي': 30,
    'اعدادي': 60,
    'ثانوي': 100,
  };
  
  return mapping[enumValue] || 0;
}



async recalculateAllStudentsScores() {
  // جلب جميع الطلاب مع معاييرهم
  const students = await this.prisma.student.findMany({
    include: {
      studentCriteria: true,
    },
  });

  // جلب جميع المعايير
  const allCriteria = await this.prisma.criteria.findMany();

  const results: {
    studentId: number;
    score: number;
    label: string;
  }[] = [];

  for (const student of students) {
    // حساب النتيجة مع المعالجة التلقائية للقيم الناقصة
    const result = await this.computeStudentScore(student.id);

    // تحديث التصنيف
    await this.prisma.classification.upsert({
      where: { studentId: student.id },
      create: {
        studentId: student.id,
        totalScore: result.totalScore,
        label: result.label,
        computedAt: new Date(),
      },
      update: {
        totalScore: result.totalScore,
        label: result.label,
        computedAt: new Date(),
      },
    });

    results.push({
      studentId: student.id,
      score: result.totalScore,
      label: result.label,
    });
  }

  return {
    totalStudents: results.length,
    updated: results,
  };
}


}
