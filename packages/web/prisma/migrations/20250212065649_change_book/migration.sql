/*
  Warnings:

  - You are about to drop the `_CookbookItemToFood` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `foodId` to the `CookbookItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CookbookItemToFood" DROP CONSTRAINT "_CookbookItemToFood_A_fkey";

-- DropForeignKey
ALTER TABLE "_CookbookItemToFood" DROP CONSTRAINT "_CookbookItemToFood_B_fkey";

-- AlterTable
ALTER TABLE "CookbookItem" ADD COLUMN     "foodId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_CookbookItemToFood";

-- AddForeignKey
ALTER TABLE "CookbookItem" ADD CONSTRAINT "CookbookItem_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
