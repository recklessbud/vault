-- CreateTable
CREATE TABLE "shareVaultItem" (
    "id" TEXT NOT NULL,
    "vaultItemId" TEXT NOT NULL,
    "shareWithId" TEXT NOT NULL,
    "sharedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shareVaultItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shareVaultItem" ADD CONSTRAINT "shareVaultItem_vaultItemId_fkey" FOREIGN KEY ("vaultItemId") REFERENCES "VaultItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shareVaultItem" ADD CONSTRAINT "shareVaultItem_shareWithId_fkey" FOREIGN KEY ("shareWithId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shareVaultItem" ADD CONSTRAINT "shareVaultItem_sharedById_fkey" FOREIGN KEY ("sharedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
