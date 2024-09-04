-- DropIndex
DROP INDEX `CartItem_cartId_garmentId_fabricId_key` ON `cartitem`;

-- CreateIndex
CREATE INDEX `CartItem_cartId_garmentId_fabricId_idx` ON `CartItem`(`cartId`, `garmentId`, `fabricId`);
