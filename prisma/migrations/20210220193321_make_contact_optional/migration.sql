/*
  Warnings:

  - You are about to drop the `caution` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateTable
CREATE TABLE `Caution` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contact` VARCHAR(191) NOT NULL DEFAULT '',
    `content` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- DropTable
DROP TABLE `caution`;
