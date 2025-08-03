-- Fix photo_url column length to accommodate presigned URLs
-- Run this SQL script directly in your MySQL database

ALTER TABLE profiles MODIFY COLUMN photo_url VARCHAR(1000);

-- Verify the change
DESCRIBE profiles; 