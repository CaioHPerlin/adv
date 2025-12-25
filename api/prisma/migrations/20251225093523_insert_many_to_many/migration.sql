/*
  Warnings:

  - You are about to drop the column `responsibleUserId` on the `Case` table. All the data in the column will be lost.
  - Added the required column `createdByUserId` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "UserCase" (
    "userId" INTEGER NOT NULL,
    "caseId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "caseId"),
    CONSTRAINT "UserCase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserCase_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Case" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "court" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "distributionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdByUserId" INTEGER NOT NULL,
    CONSTRAINT "Case_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Case" ("clientName", "court", "createdAt", "description", "distributionDate", "id", "number", "updatedAt") SELECT "clientName", "court", "createdAt", "description", "distributionDate", "id", "number", "updatedAt" FROM "Case";
DROP TABLE "Case";
ALTER TABLE "new_Case" RENAME TO "Case";
CREATE UNIQUE INDEX "Case_number_key" ON "Case"("number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
