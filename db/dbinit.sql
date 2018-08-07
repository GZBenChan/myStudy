CREATE TABLE `article` (
  `articleID` int(11) NOT NULL AUTO_INCREMENT,
  `articleTitle` varchar(100) NOT NULL,
  `articleAuthor` varchar(20) NOT NULL,
  `articleContent` longtext NOT NULL,
  `articleTime` date NOT NULL,
  `articleClick` int(11) DEFAULT '0',
  PRIMARY KEY (`articleID`),
  UNIQUE KEY `articleTitle` (`articleTitle`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
CREATE TABLE `author` (
  `authorID` int(11) NOT NULL AUTO_INCREMENT,
  `authorName` varchar(20) NOT NULL,
  `authorPassword` varchar(32) NOT NULL,
  PRIMARY KEY (`authorID`),
  UNIQUE KEY `authorName` (`authorName`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
CREATE TABLE `todos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task` varchar(200),
  `date` datetime DEFAULT NULL,
  `complete` tinyint(1) DEFAULT NULL,
  `uid` varchar(100) DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
INSERT INTO `author` VALUES (1,'nodejs','671a0da0ba061c98de801409dbc57d7e');