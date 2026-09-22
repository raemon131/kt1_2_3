CREATE USER IF NOT EXISTS 'sampleuser1'@'localhost' IDENTIFIED BY 'oranges';
USE `blog-app`;
GRANT INSERT,UPDATE,DELETE,SELECT ON posts TO 'sampleuser1'@'localhost' IDENTIFIED BY 'oranges'; 