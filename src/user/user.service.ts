import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private activityLogService: ActivityLogService,
  ) {}



  async create(createDto: CreateUserDto) {
    // hash password
   
    try {
      const user = await this.prisma.user.create({
        data: {
          fullName: createDto.fullName,
          nationalNumber: createDto.nationalNumber,
          role: createDto.role,
          email: createDto.email,
          passwordHash: createDto.password,
        },
      });

      // create a simple activity log: user created (logged against the created user)
      await this.activityLogService.create({
        userId: user.id,
        action: 'CREATE_USER',
        description: `User ${user.email} created`,
      } as any); // cast because schema lacks description; remove cast if you add the field

      // return safe shape (exclude password) by selecting fields explicitly
      const safe = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          fullName: true,
          nationalNumber: true,
          role: true,
          email: true,
        },
      });

      return safe;
    } catch (e: any) {
      // Unique constraint errors handling (Postgres)
      if (e.code === 'P2002') {
        // Prisma unique constraint error
        throw new ConflictException('Email or nationalNumber already exists');
      }
      throw e;
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        fullName: true,
        nationalNumber: true,
        role: true,
        email: true,
        isActive: true,
        activityLogs: {
          select: { id: true, action: true, created_at: true ,description: true,},
          orderBy: { created_at: 'desc' },
        },
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        nationalNumber: true,
        role: true,
        email: true,
        createdAt:true,
        activityLogs: {
          select: { id: true, action: true, created_at: true },
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const data: any = { ...dto };

    

    try {
      const updated = await this.prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          fullName: true,
          nationalNumber: true,
          role: true,
          email: true,
        },
      });

       const changes: string[] = [];
    for (const key of Object.keys(dto)) {
      // نتجنب الحقول الحساسة
      if (key === 'password') {
        changes.push(`${key}: [HIDDEN]`);
        continue;
      }
   
      const newVal = (updated as any)[key];
      
        changes.push(`${key}:  ➝ '${newVal} `);
    }

    const description = changes.length
      ? `Updated user ${updated.email}. Changes: ${changes.join(', ')}`
      : `Updated user ${updated.email}, but no values changed`;

    // ✅ سجل النشاط
    await this.activityLogService.create({
      userId: id,
      action: 'UPDATE_USER',
      description,
    } as any);


      return updated;
    } catch (e: any) {
      if (e.code === 'P2025') {
        // Record not found
        throw new NotFoundException('User not found');
      }
      throw e;
    }
  }

  async remove(id: number) {
    try {
      const deleted = await this.prisma.user.delete({
        where: { id },
        select: { id: true, fullName: true, email: true },
      });

      // You might want to log who performed delete; here we attach to deleted user id
      await this.activityLogService.create({
        userId: deleted.id,
        action: 'DELETE_USER',
        description: `Deleted user ${deleted.email}`,
      } as any);

      return deleted;
    } catch (e: any) {
      if (e.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw e;
    }
  }


  async getOneUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

   async findActivityLogs(userId: number) {
    return this.prisma.activityLog.findMany({
      where: { userId },
      orderBy: { created_at: 'desc' },
    });
  }
}
