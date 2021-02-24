CREATE DATABASE userEvent;
use userEvent;

CREATE TABLE Users (
  ID INT,
  Name VARCHAR(40),
  Email VARCHAR(40),
  Password VARCHAR(20)
);

-- Obviously, we don't want to store passwords in plain-text!

INSERT INTO Users
  (ID, Name, Email, Password)
VALUES
  (1, 'John Smith', 'John@gmail.com', 'test123'),
  (2, 'David Jones', 'David@gmail.com', 'test123');