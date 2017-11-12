SET NAMES UTF8;
DROP DATABASE IF EXISTS ulift;

CREATE DATABASE ulift CHARSET=UTF8;

USE ulift;

/*用户表*/
CREATE TABLE user(
    userId INT PRIMARY KEY AUTO_INCREMENT,
    phone VARCHAR(11),
    upwd VARCHAR(16),
    nickName VARCHAR(16),
    sex VARCHAR(1),/*M-男 F-女*/
    age VARCHAR(3),
    edu VARCHAR(16),
    job VARCHAR(16)
);
INSERT INTO user VALUES
(NULL,'13542688975','123456','Mia','F','20','本科','工程师'),
(NULL,'18625736253','123456','Mark','M','20','本科','工程师');
