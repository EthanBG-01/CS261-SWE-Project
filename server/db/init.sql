CREATE DATABASE userEvent;
use userEvent;

CREATE TABLE Users (
  userID INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(40) NOT NULL,
  email VARCHAR(40) NOT NULL,
  passwordHash CHAR(100) NOT NULL,
  passwordSalt CHAR(100) NOT NULL,
  PRIMARY KEY(userID)
);
CREATE TABLE Events (
	eventID INT NOT NULL AUTO_INCREMENT,
	eventCode INT NOT NULL,
	eventName VARCHAR(40) NOT NULL,
	hostName VARCHAR(40) NOT NULL,
	description VARCHAR(1000) NOT NULL,
	eventType VARCHAR(40) NOT NULL,
	startDate DATE NOT NULL,
	endDate DATE NOT NULL,
	startTime TIME NOT NULL,
	endTime TIME NOT NULL,
	parentID INT,
	PRIMARY KEY(eventID)
);

CREATE TABLE UserEvents (
	userID INT NOT NULL,
	eventID INT NOT NULL,
	userType VARCHAR(40) NOT NULL,
	PRIMARY KEY (userID, eventID),
	FOREIGN KEY (userID) REFERENCES Users(userID),
	FOREIGN KEY (eventID) REFERENCES Events(eventID)
);

-- Obviously, we don't want to store passwords in plain-text!

-- INSERT INTO Users
--   (userID, personName, email, personPassword, userType)
-- VALUES
--   (1, 'John Smith', 'John@gmail.com', 'test123', 'host'),
--   (2, 'David Jones', 'David@gmail.com', 'test123', 'attendee');
