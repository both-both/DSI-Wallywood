/*
  Warnings:

  - You are about to drop the `genrePosterRels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "genrePosterRels";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_genreToposter" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_genreToposter_A_fkey" FOREIGN KEY ("A") REFERENCES "genres" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_genreToposter_B_fkey" FOREIGN KEY ("B") REFERENCES "posters" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_genreToposter_AB_unique" ON "_genreToposter"("A", "B");

-- CreateIndex
CREATE INDEX "_genreToposter_B_index" ON "_genreToposter"("B");
