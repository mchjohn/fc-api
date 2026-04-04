/*
  Warnings:

  - Added the required column `type` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_category_id_fkey";

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "type" "transaction_type" NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "category_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
