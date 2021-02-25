CREATE DATABASE userEvent CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
use userEvent;

CREATE TABLE Users (
  userID INT NOT NULL AUTO_INCREMENT,
  personName VARCHAR(40) NOT NULL,
  email VARCHAR(40) NOT NULL,
  passwordHash CHAR(100) NOT NULL,
  passwordSalt CHAR(100) NOT NULL,
  PRIMARY KEY(userID)
);

-- Obviously, we don't want to store passwords in plain-text!

-- INSERT INTO Users
--   (userID, personName, email, personPassword, userType)
-- VALUES
--   (1, 'John Smith', 'John@gmail.com', 'test123', 'host'),
--   (2, 'David Jones', 'David@gmail.com', 'test123', 'attendee');
