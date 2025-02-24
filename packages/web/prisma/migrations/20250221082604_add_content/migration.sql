-- AlterTable
ALTER TABLE "Cookbook" ADD COLUMN     "content" JSONB NOT NULL DEFAULT '{ "foods": [], "tool": [], "steps": [] }';
