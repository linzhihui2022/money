/*
  Warnings:

  - The primary key for the `TaskImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `TaskImage` table. All the data in the column will be lost.
  - Added the required column `key` to the `TaskImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaskImage" DROP CONSTRAINT "TaskImage_pkey",
DROP COLUMN "id",
ADD COLUMN     "key" UUID NOT NULL,
ADD CONSTRAINT "TaskImage_pkey" PRIMARY KEY ("key");
