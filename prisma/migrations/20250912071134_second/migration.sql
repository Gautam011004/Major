-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "batch" INTEGER,
ADD COLUMN     "university" TEXT,
ADD COLUMN     "usertype" TEXT NOT NULL DEFAULT 'student';
