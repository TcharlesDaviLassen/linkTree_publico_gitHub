-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "investido" REAL NOT NULL,
    "taxaAnual" REAL NOT NULL,
    "tempoInvestimento" INTEGER NOT NULL,
    "tipoInvestimento" TEXT NOT NULL,
    "retornoMensal" REAL NOT NULL,
    "retornoAnual" REAL NOT NULL,
    "impostoRenda" REAL NOT NULL,
    "descontoB3" REAL NOT NULL,
    "rendimentoTempoInvestido" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
