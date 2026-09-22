-- --------------------------------------------------------
-- Verkkotietokone:              127.0.0.1
-- Palvelinversio:               10.11.0-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Versio:              11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for blog-app
CREATE DATABASE IF NOT EXISTS `blog-app` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `blog-app`;

-- Dumping structure for taulu blog-app.posts
CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `body` text NOT NULL,
  `created_at` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

-- Dumping data for table blog-app.posts: ~6 rows (suunnilleen)
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` (`id`, `title`, `body`, `created_at`) VALUES
	(1, 'Post one', 'This is the body if post one', '2022-11-24'),
	(2, 'Second post', 'This is 2. post', '2022-11-24'),
	(3, 'Third post', '3. post test', '2022-11-28');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
