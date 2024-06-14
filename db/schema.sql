-- Dumping database structure for endurancedatabase
CREATE DATABASE IF NOT EXISTS `endurancedatabase` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `endurancedatabase`;

-- Dumping structure for table endurancedatabase.notifier_settings
CREATE TABLE IF NOT EXISTS `notifier_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Type` enum('email','ntfy','discord') NOT NULL,
  `settings` json NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table endurancedatabase.watched_classes
CREATE TABLE IF NOT EXISTS `watched_classes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `venue_id` varchar(50) NOT NULL DEFAULT '',
  `class_id` varchar(50) NOT NULL DEFAULT '',
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `notifier_settings_id` int DEFAULT NULL,
  `start_datetime` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `notifier_settings_id` (`notifier_settings_id`),
  CONSTRAINT `watched_classes_ibfk_1` FOREIGN KEY (`notifier_settings_id`) REFERENCES `notifier_settings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
