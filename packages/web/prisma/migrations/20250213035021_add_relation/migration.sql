-- DropForeignKey
ALTER TABLE "CookbookItem" DROP CONSTRAINT "CookbookItem_cookbookId_fkey";

-- DropForeignKey
ALTER TABLE "CookbookItem" DROP CONSTRAINT "CookbookItem_foodId_fkey";

-- AddForeignKey
ALTER TABLE "CookbookItem" ADD CONSTRAINT "CookbookItem_cookbookId_fkey" FOREIGN KEY ("cookbookId") REFERENCES "Cookbook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CookbookItem" ADD CONSTRAINT "CookbookItem_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;
