-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roleId" TEXT NOT NULL DEFAULT 'user_role_id';

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
