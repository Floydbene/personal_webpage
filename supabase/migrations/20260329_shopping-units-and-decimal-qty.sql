-- Add unit column and convert quantity to decimal for shopping items
ALTER TABLE shopping_items ADD COLUMN unit text;
ALTER TABLE shopping_items ALTER COLUMN quantity TYPE numeric(10,2);
