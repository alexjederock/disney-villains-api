CREATE DATABASE villain;

CREATE USER 'villians'@'localhost' IDENTIFIED WITH mysql_native_password BY 'catfish';

GRANT ALL ON villain.* TO 'villains'@'localhost';

USE villain

CREATE TABLE villains (
  name VARCHAR(255),
  movie VARCHAR(255),
  slug VARCHAR(255),
  createdAt DATETIME DEFAULT NOW(),
  updatedAt DATETIME DEFAULT NOW() ON UPDATE NOW(),
  deletedAt DATETIME
);