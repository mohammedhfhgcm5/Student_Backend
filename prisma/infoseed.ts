import { PrismaClient, Role, Gender, StudentStatus, DonationStatus, VisitType, InteractionType, ProgramStatus, NotificationType, ExpenseTargetType, CriteriaType, Direction } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (optional - comment out in production)
  await prisma.$transaction([
    prisma.classification.deleteMany(),
    prisma.studentCriterion.deleteMany(),
    prisma.criteria.deleteMany(),
    prisma.passwordReset.deleteMany(),
    prisma.donationExpenseAllocation.deleteMany(),
    prisma.expense.deleteMany(),
    prisma.deviceToken.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.activityLog.deleteMany(),
    prisma.studentProgram.deleteMany(),
    prisma.supportProgram.deleteMany(),
    prisma.document.deleteMany(),
    prisma.followUpVisit.deleteMany(),
    prisma.donation.deleteMany(),
    prisma.student.deleteMany(),
    prisma.dropoutReason.deleteMany(),
    prisma.donationPurpose.deleteMany(),
    prisma.donor.deleteMany(),
    prisma.school.deleteMany(),
    prisma.location.deleteMany(),
    prisma.guardian.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log('✅ Cleared existing data');

  // 1. Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.create({
    data: {
      fullName: 'Admin User',
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      role: Role.ADMIN,
      nationalNumber: '1234567890',
      isActive: true,
    },
  });

  const ngoStaff = await prisma.user.create({
    data: {
      fullName: 'Sarah Johnson',
      email: 'sarah@ngo.com',
      passwordHash: hashedPassword,
      role: Role.NGO_STAFF,
      nationalNumber: '2345678901',
      isActive: true,
    },
  });

  const fieldTeam = await prisma.user.create({
    data: {
      fullName: 'Ahmed Hassan',
      email: 'ahmed@field.com',
      passwordHash: hashedPassword,
      role: Role.FIELD_TEAM,
      nationalNumber: '3456789012',
      isActive: true,
    },
  });

  console.log('✅ Created users');

  // 2. Create Locations
  const damascus = await prisma.location.create({
    data: { name: 'Damascus City', region: 'Damascus' },
  });

  const aleppo = await prisma.location.create({
    data: { name: 'Aleppo City', region: 'Aleppo' },
  });

  const homs = await prisma.location.create({
    data: { name: 'Homs City', region: 'Homs' },
  });

  console.log('✅ Created locations');

  // 3. Create Schools
  const school1 = await prisma.school.create({
    data: {
      name: 'Al-Noor Primary School',
      region: 'Damascus',
      address: '123 Main Street, Damascus',
      locationId: damascus.id,
      capacity: 500,
      contactInfo: '+963-11-1234567',
    },
  });

  const school2 = await prisma.school.create({
    data: {
      name: 'Al-Amal Secondary School',
      region: 'Aleppo',
      address: '456 Education Ave, Aleppo',
      locationId: aleppo.id,
      capacity: 800,
      contactInfo: '+963-21-7654321',
    },
  });

  const school3 = await prisma.school.create({
    data: {
      name: 'Hope Academy',
      region: 'Homs',
      address: '789 Knowledge Road, Homs',
      locationId: homs.id,
      capacity: 600,
      contactInfo: '+963-31-9876543',
    },
  });

  console.log('✅ Created schools');

  // 4. Create Guardians
  const guardian1 = await prisma.guardian.create({
    data: {
      fullName: 'Fatima Al-Ahmad',
      phone: '+963-944-123456',
      relationToStudent: 'Mother',
      nationalNumber: '4567890123',
      notes: 'Very cooperative and supportive',
    },
  });

  const guardian2 = await prisma.guardian.create({
    data: {
      fullName: 'Mohammad Al-Salem',
      phone: '+963-955-234567',
      relationToStudent: 'Father',
      nationalNumber: '5678901234',
      notes: 'Works long hours, prefers evening contact',
    },
  });

  const guardian3 = await prisma.guardian.create({
    data: {
      fullName: 'Layla Ibrahim',
      phone: '+963-966-345678',
      relationToStudent: 'Aunt',
      nationalNumber: '6789012345',
      notes: 'Legal guardian after parents passed away',
    },
  });

  console.log('✅ Created guardians');

  // 5. Create Dropout Reasons
  const financialReason = await prisma.dropoutReason.create({
    data: {
      description: 'Financial difficulties',
      category: 'Economic',
    },
  });

  const familyReason = await prisma.dropoutReason.create({
    data: {
      description: 'Family responsibilities',
      category: 'Social',
    },
  });

  const healthReason = await prisma.dropoutReason.create({
    data: {
      description: 'Health issues',
      category: 'Medical',
    },
  });

  console.log('✅ Created dropout reasons');

  // 6. Create Students
  const student1 = await prisma.student.create({
    data: {
      fullName: 'Yara Al-Hassan',
      dateOfBirth: new Date('2012-03-15'),
      gender: Gender.FEMALE,
      nationalNumber: '7890123456',
      nationality: 'Syrian',
      educationLevel: 'Primary',
      educationGapYears: 1,
      lastGradeCompleted: 'Grade 4',
      literacyLevel: 'Good',
      mainLanguage: 'Arabic',
      acquiredLanguage: 'English',
      familySize: 6,
      monthlyIncome: 300,
      incomeSource: 'Day labor',
      housingStatus: 'Rental',
      hasDisability: false,
      status: StudentStatus.ACTIVE,
      locationId: damascus.id,
      guardianId: guardian1.id,
      schoolId: school1.id,
      riskLevel: 'Low',
      lastEvaluationAt: new Date(),
      notes: 'Excellent student, very motivated',
    },
  });

  const student2 = await prisma.student.create({
    data: {
      fullName: 'Omar Al-Khaled',
      dateOfBirth: new Date('2010-07-22'),
      gender: Gender.MALE,
      nationalNumber: '8901234567',
      nationality: 'Syrian',
      educationLevel: 'Secondary',
      educationGapYears: 2,
      lastGradeCompleted: 'Grade 7',
      literacyLevel: 'Medium',
      mainLanguage: 'Arabic',
      familySize: 5,
      monthlyIncome: 200,
      incomeSource: 'Small business',
      housingStatus: 'Camp',
      hasDisability: false,
      status: StudentStatus.DROPOUT,
      dropoutReasonId: financialReason.id,
      locationId: aleppo.id,
      guardianId: guardian2.id,
      schoolId: school2.id,
      riskLevel: 'High',
      lastEvaluationAt: new Date(),
      notes: 'Needs urgent financial support',
    },
  });

  const student3 = await prisma.student.create({
    data: {
      fullName: 'Leila Mahmoud',
      dateOfBirth: new Date('2011-11-05'),
      gender: Gender.FEMALE,
      nationalNumber: '9012345678',
      nationality: 'Syrian',
      educationLevel: 'Primary',
      educationGapYears: 0,
      lastGradeCompleted: 'Grade 5',
      literacyLevel: 'Good',
      mainLanguage: 'Arabic',
      acquiredLanguage: 'French',
      familySize: 4,
      monthlyIncome: 400,
      incomeSource: 'NGO support',
      housingStatus: 'Owned',
      hasDisability: true,
      disabilityType: 'Hearing impairment',
      supportNeeds: 'Hearing aids and special education',
      status: StudentStatus.RETURNED,
      dropoutReasonId: healthReason.id,
      locationId: homs.id,
      guardianId: guardian3.id,
      schoolId: school3.id,
      riskLevel: 'Medium',
      lastEvaluationAt: new Date(),
      notes: 'Recently returned to school, needs monitoring',
    },
  });

  console.log('✅ Created students');

  // 7. Create Donors
  const donor1 = await prisma.donor.create({
    data: {
      name: 'John Smith',
      email: 'john@donors.com',
      passwordHash: hashedPassword,
      nationalNumber: '1122334455',
      phone: '+1-555-0123',
      isAnonymous: false,
      verified: true,
    },
  });

  const donor2 = await prisma.donor.create({
    data: {
      name: 'Anonymous Donor',
      email: 'anonymous@donors.com',
      passwordHash: hashedPassword,
      nationalNumber: '2233445566',
      isAnonymous: true,
      verified: true,
    },
  });

  const donor3 = await prisma.donor.create({
    data: {
      name: 'Emma Wilson',
      email: 'emma@donors.com',
      passwordHash: hashedPassword,
      nationalNumber: '3344556677',
      phone: '+1-555-0456',
      isAnonymous: false,
      verified: true,
    },
  });

  console.log('✅ Created donors');

  // 8. Create Donation Purposes
  const educationPurpose = await prisma.donationPurpose.create({
    data: {
      name: 'Education Support',
      description: 'School fees, books, and supplies',
      isActive: true,
    },
  });

  const healthPurpose = await prisma.donationPurpose.create({
    data: {
      name: 'Healthcare',
      description: 'Medical expenses and health insurance',
      isActive: true,
    },
  });

  const nutritionPurpose = await prisma.donationPurpose.create({
    data: {
      name: 'Nutrition Program',
      description: 'Food packages and meal programs',
      isActive: true,
    },
  });

  console.log('✅ Created donation purposes');

  // 9. Create Donations
  const donation1 = await prisma.donation.create({
    data: {
      donorId: donor1.id,
      studentId: student1.id,
      purposeId: educationPurpose.id,
      amount: 500,
      currency: 'USD',
      status: DonationStatus.CONFIRMED,
      paymentMethod: 'Credit Card',
      transactionReference: 'TXN-001-2025',
    },
  });

  const donation2 = await prisma.donation.create({
    data: {
      donorId: donor2.id,
      studentId: student2.id,
      purposeId: educationPurpose.id,
      amount: 1000,
      currency: 'USD',
      status: DonationStatus.ALLOCATED,
      paymentMethod: 'Bank Transfer',
      transactionReference: 'TXN-002-2025',
    },
  });

  const donation3 = await prisma.donation.create({
    data: {
      donorId: donor3.id,
      studentId: student3.id,
      purposeId: healthPurpose.id,
      amount: 300,
      currency: 'USD',
      status: DonationStatus.USED,
      paymentMethod: 'PayPal',
      transactionReference: 'TXN-003-2025',
    },
  });

  console.log('✅ Created donations');

  // 10. Create Support Programs
  const literacy = await prisma.supportProgram.create({
    data: {
      name: 'Literacy Enhancement Program',
      description: 'Intensive reading and writing support',
      duration: '6 months',
      is_active: true,
    },
  });

  const vocational = await prisma.supportProgram.create({
    data: {
      name: 'Vocational Training',
      description: 'Skills training for older students',
      duration: '1 year',
      is_active: true,
    },
  });

  const psychosocial = await prisma.supportProgram.create({
    data: {
      name: 'Psychosocial Support',
      description: 'Mental health and counseling services',
      duration: '3 months',
      is_active: true,
    },
  });

  console.log('✅ Created support programs');

  // 11. Create Student Programs
  await prisma.studentProgram.create({
    data: {
      student_id: student1.id,
      program_id: literacy.id,
      status: ProgramStatus.ENROLLED,
    },
  });

  await prisma.studentProgram.create({
    data: {
      student_id: student2.id,
      program_id: vocational.id,
      status: ProgramStatus.DROPPED,
    },
  });

  await prisma.studentProgram.create({
    data: {
      student_id: student3.id,
      program_id: psychosocial.id,
      status: ProgramStatus.COMPLETED,
      completion_date: new Date('2024-12-15'),
    },
  });

  console.log('✅ Created student programs');

  // 12. Create Follow-up Visits
  await prisma.followUpVisit.create({
    data: {
      studentId: student1.id,
      userId: fieldTeam.id,
      guardianId: guardian1.id,
      visitDate: new Date('2025-01-15'),
      visitType: VisitType.REGULAR,
      guardianPresent: true,
      interactionType: InteractionType.HOME_VISIT,
      notes: 'Student is doing well academically. Family is cooperative.',
      noteForGuardian: 'Please ensure regular attendance',
      studentStatusAssessment: 'Good progress',
      recommendations: 'Continue current support level',
    },
  });

  await prisma.followUpVisit.create({
    data: {
      studentId: student2.id,
      userId: fieldTeam.id,
      guardianId: guardian2.id,
      visitDate: new Date('2025-01-20'),
      visitType: VisitType.EMERGENCY,
      guardianPresent: true,
      interactionType: InteractionType.PHONE_CALL,
      notes: 'Urgent financial crisis. Student may drop out again.',
      noteForGuardian: 'Financial support needed immediately',
      studentStatusAssessment: 'At high risk',
      recommendations: 'Provide emergency financial assistance',
    },
  });

  console.log('✅ Created follow-up visits');

  // 13. Create Documents
  await prisma.document.create({
    data: {
      studentId: student1.id,
      filePath: '/uploads/documents/yara_birth_certificate.pdf',
      fileType: 'application/pdf',
    },
  });

  await prisma.document.create({
    data: {
      studentId: student2.id,
      filePath: '/uploads/documents/omar_school_records.pdf',
      fileType: 'application/pdf',
    },
  });

  console.log('✅ Created documents');

  // 14. Create Expenses
  const expense1 = await prisma.expense.create({
    data: {
      studentId: student1.id,
      targetType: ExpenseTargetType.STUDENT,
      purposeId: educationPurpose.id,
      amount: 250,
      currency: 'USD',
      paymentMethod: 'Cash',
      description: 'School supplies and uniform',
      receiptUrl: '/uploads/receipts/receipt_001.jpg',
      createdById: ngoStaff.id,
    },
  });

  const expense2 = await prisma.expense.create({
    data: {
      studentId: student2.id,
      targetType: ExpenseTargetType.STUDENT,
      purposeId: educationPurpose.id,
      amount: 500,
      currency: 'USD',
      paymentMethod: 'Bank Transfer',
      description: 'Tuition fees and textbooks',
      createdById:2
    
    },
  });

  console.log('✅ Created expenses');

  // 15. Create Donation-Expense Allocations
  await prisma.donationExpenseAllocation.create({
    data: {
      donationId: donation1.id,
      expenseId: expense1.id,
      amount: 250,
    },
  });

  await prisma.donationExpenseAllocation.create({
    data: {
      donationId: donation2.id,
      expenseId: expense2.id,
      amount: 500,
    },
  });

  console.log('✅ Created donation-expense allocations');

  // 16. Create Notifications
  await prisma.notification.create({
    data: {
      userId: admin.id,
      type: NotificationType.USER_ALERT,
      title: 'New Student Enrollment',
      message: 'A new student has been enrolled in the system',
      is_read: false,
    },
  });

  await prisma.notification.create({
    data: {
      donorId: donor1.id,
      type: NotificationType.DONOR_ALERT,
      title: 'Donation Received',
      message: 'Your donation of $500 has been successfully processed',
      link: '/donations/1',
      is_read: false,
    },
  });

  console.log('✅ Created notifications');

  // 17. Create Device Tokens
  await prisma.deviceToken.create({
    data: {
      userId: admin.id,
      token: 'fcm_token_admin_web_12345',
      deviceType: 'WEB',
    },
  });

  await prisma.deviceToken.create({
    data: {
      donorId: donor1.id,
      token: 'fcm_token_donor1_ios_67890',
      deviceType: 'IOS',
    },
  });

  console.log('✅ Created device tokens');

  // 18. Create Activity Logs
  await prisma.activityLog.create({
    data: {
      userId: admin.id,
      action: 'CREATE_STUDENT',
      description: 'Created new student record for Yara Al-Hassan',
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: ngoStaff.id,
      action: 'UPDATE_DONATION',
      description: 'Updated donation status to ALLOCATED',
    },
  });

  console.log('✅ Created activity logs');

  // 19. Create Criteria
  const incomeCriteria = await prisma.criteria.create({
    data: {
      key: 'monthly_income',
      name: 'Monthly Family Income',
      type: CriteriaType.NUMBER,
      direction: Direction.LOWER_BETTER,
      minValue: 0,
      maxValue: 1000,
      weight: 2.0,
      sourceField: 'monthlyIncome',
    },
  });

  const educationGapCriteria = await prisma.criteria.create({
    data: {
      key: 'education_gap',
      name: 'Years Out of School',
      type: CriteriaType.NUMBER,
      direction: Direction.LOWER_BETTER,
      minValue: 0,
      maxValue: 5,
      weight: 1.5,
      sourceField: 'educationGapYears',
    },
  });

  const disabilityCriteria = await prisma.criteria.create({
    data: {
      key: 'has_disability',
      name: 'Has Disability',
      type: CriteriaType.BOOLEAN,
      direction: Direction.HIGHER_BETTER,
      weight: 1.8,
      sourceField: 'hasDisability',
    },
  });

  console.log('✅ Created criteria');

  // 20. Create Student Criteria Values
  await prisma.studentCriterion.create({
    data: {
      studentId: student1.id,
      criteriaId: incomeCriteria.id,
      value: 300,
    },
  });

  await prisma.studentCriterion.create({
    data: {
      studentId: student1.id,
      criteriaId: educationGapCriteria.id,
      value: 1,
    },
  });

  await prisma.studentCriterion.create({
    data: {
      studentId: student2.id,
      criteriaId: incomeCriteria.id,
      value: 200,
    },
  });

  await prisma.studentCriterion.create({
    data: {
      studentId: student2.id,
      criteriaId: educationGapCriteria.id,
      value: 2,
    },
  });

  await prisma.studentCriterion.create({
    data: {
      studentId: student3.id,
      criteriaId: disabilityCriteria.id,
      value: 1, // Boolean: 1 = true
    },
  });

  console.log('✅ Created student criteria values');

  // 21. Create Classifications
  await prisma.classification.create({
    data: {
      studentId: student1.id,
      totalScore: 65.5,
      label: 'Medium',
    },
  });

  await prisma.classification.create({
    data: {
      studentId: student2.id,
      totalScore: 85.2,
      label: 'High',
    },
  });

  await prisma.classification.create({
    data: {
      studentId: student3.id,
      totalScore: 72.8,
      label: 'Medium',
    },
  });

  console.log('✅ Created classifications');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });