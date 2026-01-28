-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'NGO_STAFF', 'FIELD_TEAM');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."StudentStatus" AS ENUM ('ACTIVE', 'DROPOUT', 'RETURNED', 'AT_RISK');

-- CreateEnum
CREATE TYPE "public"."DonationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'ALLOCATED', 'USED');

-- CreateEnum
CREATE TYPE "public"."VisitType" AS ENUM ('INITIAL', 'REGULAR', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "public"."InteractionType" AS ENUM ('INTERVIEW', 'PHONE_CALL', 'HOME_VISIT');

-- CreateEnum
CREATE TYPE "public"."ProgramStatus" AS ENUM ('ENROLLED', 'COMPLETED', 'DROPPED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('USER_ALERT', 'DONOR_ALERT');

-- CreateEnum
CREATE TYPE "public"."ExpenseTargetType" AS ENUM ('STUDENT', 'SCHOOL', 'VENDOR');

-- CreateEnum
CREATE TYPE "public"."CriteriaType" AS ENUM ('NUMBER', 'PERCENT', 'BOOLEAN', 'ENUM');

-- CreateEnum
CREATE TYPE "public"."Direction" AS ENUM ('HIGHER_BETTER', 'LOWER_BETTER');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "organizationId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nationalNumber" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Guardian" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "relationToStudent" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nationalNumber" TEXT NOT NULL,

    CONSTRAINT "Guardian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."School" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "address" TEXT,
    "locationId" INTEGER,
    "capacity" INTEGER,
    "contactInfo" TEXT,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Donor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nationalNumber" TEXT NOT NULL,
    "phone" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DonationPurpose" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DonationPurpose_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Donation" (
    "id" SERIAL NOT NULL,
    "donorId" INTEGER NOT NULL,
    "studentId" INTEGER,
    "purposeId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "remainingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'SYP',
    "status" "public"."DonationStatus" NOT NULL,
    "paymentMethod" TEXT,
    "transactionReference" TEXT,
    "donationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DropoutReason" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "DropoutReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Student" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "nationalNumber" TEXT NOT NULL,
    "nationality" TEXT,
    "photoUrl" TEXT,
    "educationLevel" TEXT,
    "educationGapYears" INTEGER,
    "lastGradeCompleted" TEXT,
    "literacyLevel" TEXT,
    "mainLanguage" TEXT NOT NULL,
    "acquiredLanguage" TEXT,
    "LanguageneedIt" TEXT,
    "familySize" INTEGER,
    "monthlyIncome" DOUBLE PRECISION,
    "incomeSource" TEXT,
    "housingStatus" TEXT,
    "hasDisability" BOOLEAN NOT NULL DEFAULT false,
    "disabilityType" TEXT,
    "supportNeeds" TEXT,
    "status" "public"."StudentStatus" NOT NULL,
    "dropoutReasonId" INTEGER,
    "locationId" INTEGER,
    "guardianId" INTEGER,
    "schoolId" INTEGER,
    "riskLevel" TEXT,
    "lastEvaluationAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FollowUpVisit" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL,
    "visitType" "public"."VisitType" NOT NULL,
    "notes" TEXT,
    "guardianPresent" BOOLEAN NOT NULL DEFAULT false,
    "guardianId" INTEGER,
    "interactionType" "public"."InteractionType",
    "noteForGuardian" TEXT,
    "studentStatusAssessment" TEXT,
    "recommendations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FollowUpVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Document" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SupportProgram" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudentProgram" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "program_id" INTEGER NOT NULL,
    "enrollment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."ProgramStatus" NOT NULL DEFAULT 'ENROLLED',
    "completion_date" TIMESTAMP(3),

    CONSTRAINT "StudentProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ActivityLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "donorId" INTEGER,
    "type" "public"."NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DeviceToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "donorId" INTEGER,
    "token" TEXT NOT NULL,
    "deviceType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeviceToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Expense" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER,
    "schoolId" INTEGER,
    "targetType" "public"."ExpenseTargetType" NOT NULL,
    "purposeId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'SYP',
    "paymentMethod" TEXT,
    "description" TEXT,
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DonationExpenseAllocation" (
    "id" SERIAL NOT NULL,
    "donationId" INTEGER NOT NULL,
    "expenseId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DonationExpenseAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."password_resets" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Criteria" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."CriteriaType" NOT NULL,
    "direction" "public"."Direction" NOT NULL,
    "minValue" DOUBLE PRECISION,
    "maxValue" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sourceField" TEXT,

    CONSTRAINT "Criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudentCriterion" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "criteriaId" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentCriterion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Classification" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "totalScore" DOUBLE PRECISION NOT NULL,
    "label" TEXT NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Classification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Guardian_nationalNumber_key" ON "public"."Guardian"("nationalNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_email_key" ON "public"."Donor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_nationalNumber_key" ON "public"."Student"("nationalNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceToken_token_key" ON "public"."DeviceToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "DonationExpenseAllocation_donationId_expenseId_key" ON "public"."DonationExpenseAllocation"("donationId", "expenseId");

-- CreateIndex
CREATE UNIQUE INDEX "Criteria_key_key" ON "public"."Criteria"("key");

-- CreateIndex
CREATE UNIQUE INDEX "StudentCriterion_studentId_criteriaId_key" ON "public"."StudentCriterion"("studentId", "criteriaId");

-- CreateIndex
CREATE UNIQUE INDEX "Classification_studentId_key" ON "public"."Classification"("studentId");

-- AddForeignKey
ALTER TABLE "public"."School" ADD CONSTRAINT "School_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "public"."Donor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Donation" ADD CONSTRAINT "Donation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Donation" ADD CONSTRAINT "Donation_purposeId_fkey" FOREIGN KEY ("purposeId") REFERENCES "public"."DonationPurpose"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_dropoutReasonId_fkey" FOREIGN KEY ("dropoutReasonId") REFERENCES "public"."DropoutReason"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "public"."Guardian"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FollowUpVisit" ADD CONSTRAINT "FollowUpVisit_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "public"."Guardian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FollowUpVisit" ADD CONSTRAINT "FollowUpVisit_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FollowUpVisit" ADD CONSTRAINT "FollowUpVisit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Document" ADD CONSTRAINT "Document_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentProgram" ADD CONSTRAINT "StudentProgram_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentProgram" ADD CONSTRAINT "StudentProgram_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."SupportProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "public"."Donor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeviceToken" ADD CONSTRAINT "DeviceToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeviceToken" ADD CONSTRAINT "DeviceToken_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "public"."Donor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Expense" ADD CONSTRAINT "Expense_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Expense" ADD CONSTRAINT "Expense_purposeId_fkey" FOREIGN KEY ("purposeId") REFERENCES "public"."DonationPurpose"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Expense" ADD CONSTRAINT "Expense_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DonationExpenseAllocation" ADD CONSTRAINT "DonationExpenseAllocation_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "public"."Donation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DonationExpenseAllocation" ADD CONSTRAINT "DonationExpenseAllocation_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "public"."Expense"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentCriterion" ADD CONSTRAINT "StudentCriterion_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentCriterion" ADD CONSTRAINT "StudentCriterion_criteriaId_fkey" FOREIGN KEY ("criteriaId") REFERENCES "public"."Criteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Classification" ADD CONSTRAINT "Classification_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
