-- Task 1: Insert a new record into the account table
INSERT INTO account (first_name, last_name, email, password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Task 2: Modify the Tony Stark record to change the account_type to 'Admin'
UPDATE account
SET account_type = 'Admin'
WHERE email = 'tony@starkent.com';

-- Task 3: Delete the Tony Stark record from the database
DELETE FROM account
WHERE email = 'tony@starkent.com';

-- Task 4: Modify the "GM Hummer" record to replace "small interiors" with "a huge interior"
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE make = 'GM' AND model = 'Hummer';

-- Task 5: Use an INNER JOIN to select the make and model fields from the inventory table and classification name field from the classification table for items in the 'Sport' category
SELECT i.make, i.model, c.classification_name
FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- Task 6: Update all records in the inventory table to add '/vehicles' to the middle of the file path for inv_image and inv_thumbnail
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
