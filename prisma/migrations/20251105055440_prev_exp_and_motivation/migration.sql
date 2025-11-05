/*
  Warnings:

  - Added the required column `previousExperience` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whyJoin` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Application" ADD COLUMN     "previousExperience" TEXT NOT NULL,
ADD COLUMN     "whyJoin" TEXT NOT NULL;
