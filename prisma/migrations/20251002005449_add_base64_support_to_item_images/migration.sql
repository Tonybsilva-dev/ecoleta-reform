/*
  Warnings:

  - You are about to drop the column `category` on the `materials` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('SALE', 'DONATION', 'COLLECTION');

-- AlterTable
ALTER TABLE "public"."item_images" ADD COLUMN     "base64" TEXT,
ALTER COLUMN "url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."items" ADD COLUMN     "transactionType" "public"."TransactionType" NOT NULL DEFAULT 'DONATION';

-- AlterTable
ALTER TABLE "public"."materials" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT;

-- CreateTable
CREATE TABLE "public"."material_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "material_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "material_categories_name_key" ON "public"."material_categories"("name");

-- AddForeignKey
ALTER TABLE "public"."materials" ADD CONSTRAINT "materials_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."material_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
