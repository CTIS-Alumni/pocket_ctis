CREATE DATABASE  IF NOT EXISTS `pocketctisschema` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pocketctisschema`;
-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: pocketctisschema
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounttype`
--

DROP TABLE IF EXISTS `accounttype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounttype` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type_name` varchar(20) COLLATE utf8mb3_turkish_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type_name` (`type_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounttype`
--

LOCK TABLES `accounttype` WRITE;
/*!40000 ALTER TABLE `accounttype` DISABLE KEYS */;
INSERT INTO `accounttype` VALUES (4,'admin'),(2,'alumni'),(3,'instructor'),(1,'student');
/*!40000 ALTER TABLE `accounttype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `city` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `city_name` varchar(100) COLLATE utf8mb3_turkish_ci NOT NULL,
  `country_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_city_country` (`country_id`),
  CONSTRAINT `FK_city_country` FOREIGN KEY (`country_id`) REFERENCES `country` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city`
--

LOCK TABLES `city` WRITE;
/*!40000 ALTER TABLE `city` DISABLE KEYS */;
INSERT INTO `city` VALUES (1,'ADANA',1),(2,'ADIYAMAN',1),(3,'AFYONKARAHİSAR',1),(4,'AĞRI',1),(5,'AMASYA',1),(6,'ANKARA',1),(7,'ANTALYA',1),(8,'ARTVİN',1),(9,'AYDIN',1),(10,'BALIKESİR',1),(11,'BİLECİK',1),(12,'BİNGÖL',1),(13,'BİTLİS',1),(14,'BOLU',1),(15,'BURDUR',1),(16,'BURSA',1),(17,'ÇANAKKALE',1),(18,'ÇANKIRI',1),(19,'ÇORUM',1),(20,'DENİZLİ',1),(21,'DİYARBAKIR',1),(22,'EDİRNE',1),(23,'ELAZIĞ',1),(24,'ERZİNCAN',1),(25,'ERZURUM',1),(26,'ESKİŞEHİR',1),(27,'GAZİANTEP',1),(28,'GİRESUN',1),(29,'GÜMÜŞHANE',1),(30,'HAKKARİ',1),(31,'HATAY',1),(32,'ISPARTA',1),(33,'MERSİN(İÇEL)',1),(34,'İSTANBUL',1),(35,'İZMİR',1),(36,'KARS',1),(37,'KASTAMONU',1),(38,'KAYSERİ',1),(39,'KIRKLARELİ',1),(40,'KIRŞEHİR',1),(41,'KOCAELİ',1),(42,'KONYA',1),(43,'KÜTAHYA',1),(44,'MALATYA',1),(45,'MANİSA',1),(46,'KAHRAMANMARAŞ',1),(47,'MARDİN',1),(48,'MUĞLA',1),(49,'MUŞ',1),(50,'NEVŞEHİR',1),(51,'NİĞDE',1),(52,'ORDU',1),(53,'RİZE',1),(54,'SAKARYA',1),(55,'SAMSUN',1),(56,'SİİRT',1),(57,'SİNOP',1),(58,'SİVAS',1),(59,'TEKİRDAĞ',1),(60,'TOKAT',1),(61,'TRABZON',1),(62,'TUNCELİ',1),(63,'ŞANLIURFA',1),(64,'UŞAK',1),(65,'VAN',1),(66,'YOZGAT',1),(67,'ZONGULDAK',1),(68,'AKSARAY',1),(69,'BAYBURT',1),(70,'KARAMAN',1),(71,'KIRIKKALE',1),(72,'BATMAN',1),(73,'ŞIRNAK',1),(74,'BARTIN',1),(75,'ARDAHAN',1),(76,'IĞDIR',1),(77,'YALOVA',1),(78,'KARABÜK',1),(79,'KİLİS',1),(80,'OSMANİYE',1),(81,'DÜZCE',1),(82,'BERLIN',2);
/*!40000 ALTER TABLE `city` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `company_name` varchar(100) COLLATE utf8mb3_turkish_ci NOT NULL,
  `sector_id` int unsigned NOT NULL,
  `is_internship` tinyint(1) NOT NULL DEFAULT '0',
  `rating` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `company_name` (`company_name`),
  KEY `FK_company_sector` (`sector_id`),
  CONSTRAINT `FK_company_sector` FOREIGN KEY (`sector_id`) REFERENCES `sector` (`id`) ON DELETE CASCADE,
  CONSTRAINT `CHK_is_internship` CHECK (((`is_internship` = true) or ((`is_internship` = false) and (`rating` = NULL))))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES (1,'Amazon',3,1,NULL),(2,'İş Bankası',1,0,NULL),(3,'Hacettepe',2,0,NULL),(4,'Arçelik',6,1,NULL),(5,'Dyson',2,0,4);
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `country` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `country_name` varchar(60) COLLATE utf8mb3_turkish_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `country_name` (`country_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `country`
--

LOCK TABLES `country` WRITE;
/*!40000 ALTER TABLE `country` DISABLE KEYS */;
INSERT INTO `country` VALUES (2,'Germany'),(1,'Turkey');
/*!40000 ALTER TABLE `country` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `degreetype`
--

DROP TABLE IF EXISTS `degreetype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `degreetype` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `degree_name` varchar(50) COLLATE utf8mb3_turkish_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `degree_name` (`degree_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `degreetype`
--

LOCK TABLES `degreetype` WRITE;
/*!40000 ALTER TABLE `degreetype` DISABLE KEYS */;
INSERT INTO `degreetype` VALUES (2,'BSc'),(4,'MA'),(1,'MSc'),(3,'PhD');
/*!40000 ALTER TABLE `degreetype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `educationinstitute`
--

DROP TABLE IF EXISTS `educationinstitute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `educationinstitute` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `inst_name` varchar(100) COLLATE utf8mb3_turkish_ci NOT NULL,
  `city_id` int unsigned DEFAULT NULL,
  `is_erasmus` tinyint(1) DEFAULT '0',
  `rating` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `inst_name` (`inst_name`),
  KEY `FK_educationInstitute_city` (`city_id`),
  CONSTRAINT `FK_educationInstitute_city` FOREIGN KEY (`city_id`) REFERENCES `city` (`id`) ON DELETE SET NULL,
  CONSTRAINT `CHK_is_erasmus` CHECK (((`is_erasmus` = true) or ((`is_erasmus` = false) and (`rating` = NULL))))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `educationinstitute`
--

LOCK TABLES `educationinstitute` WRITE;
/*!40000 ALTER TABLE `educationinstitute` DISABLE KEYS */;
INSERT INTO `educationinstitute` VALUES (1,'Bilkent',6,0,NULL),(2,'Some Uni',11,0,NULL),(3,'OMU',55,0,NULL),(4,'ITU',34,0,NULL),(5,'Koç University',NULL,0,NULL),(6,'Frankfurt University',NULL,1,NULL),(8,'Berlin University',82,1,NULL);
/*!40000 ALTER TABLE `educationinstitute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `educationrecord`
--

DROP TABLE IF EXISTS `educationrecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `educationrecord` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `edu_inst_id` int unsigned NOT NULL,
  `degree_type_id` int unsigned NOT NULL,
  `name_of_program` varchar(100) COLLATE utf8mb3_turkish_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `visibility` tinyint(1) DEFAULT '1',
  `is_current` tinyint(1) NOT NULL DEFAULT '0',
  `record_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_educationRecord_users` (`user_id`),
  KEY `FK_educationRecord_educationInstitute` (`edu_inst_id`),
  KEY `FK_educationRecord_degreeType` (`degree_type_id`),
  CONSTRAINT `FK_educationRecord_degreeType` FOREIGN KEY (`degree_type_id`) REFERENCES `degreetype` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_educationRecord_educationInstitute` FOREIGN KEY (`edu_inst_id`) REFERENCES `educationinstitute` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_educationRecord_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `educationrecord`
--

LOCK TABLES `educationrecord` WRITE;
/*!40000 ALTER TABLE `educationrecord` DISABLE KEYS */;
INSERT INTO `educationrecord` VALUES (1,3,4,1,'Computer Engineering','2020-08-01','2021-05-30',1,0,'2022-12-10 21:13:01'),(2,3,4,3,'Some PhD Program','2021-06-01',NULL,1,1,'2022-12-10 21:13:01'),(3,1,4,1,'Data Science',NULL,NULL,1,0,'2022-12-10 21:13:01'),(4,1,2,1,'Cyber Security',NULL,'2020-12-01',1,0,'2022-12-11 11:55:49'),(5,2,1,3,'Economics',NULL,NULL,0,1,'2022-12-11 13:09:44'),(6,5,5,3,'Physics',NULL,NULL,1,0,'2022-12-11 20:26:36');
/*!40000 ALTER TABLE `educationrecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `erasmusrecord`
--

DROP TABLE IF EXISTS `erasmusrecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `erasmusrecord` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `edu_inst_id` int unsigned NOT NULL,
  `semester` varchar(20) COLLATE utf8mb3_turkish_ci NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `rating` tinyint DEFAULT NULL,
  `opinion` text COLLATE utf8mb3_turkish_ci,
  `visibility` tinyint(1) DEFAULT '1',
  `record_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_erasmusRecord_users` (`user_id`),
  KEY `FK_erasmusRecord_educationInstitute` (`edu_inst_id`),
  CONSTRAINT `FK_erasmusRecord_educationInstitute` FOREIGN KEY (`edu_inst_id`) REFERENCES `educationinstitute` (`id`),
  CONSTRAINT `FK_erasmusRecord_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `erasmusrecord`
--

LOCK TABLES `erasmusrecord` WRITE;
/*!40000 ALTER TABLE `erasmusrecord` DISABLE KEYS */;
INSERT INTO `erasmusrecord` VALUES (1,1,2,'Spring','2021-01-06 00:00:00','2021-06-12 00:00:00',4,'i dont have an opinion',1,'2022-12-11 23:15:44'),(2,2,3,'Fall','2021-08-04 00:00:00','2021-12-26 00:00:00',5,'cool',1,'2022-12-11 23:16:21');
/*!40000 ALTER TABLE `erasmusrecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam`
--

DROP TABLE IF EXISTS `exam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `exam_name` varchar(50) COLLATE utf8mb3_turkish_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `exam_name` (`exam_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam`
--

LOCK TABLES `exam` WRITE;
/*!40000 ALTER TABLE `exam` DISABLE KEYS */;
INSERT INTO `exam` VALUES (3,'ABET'),(4,'GRE'),(2,'IELTS'),(1,'TOEFL'),(5,'YKS');
/*!40000 ALTER TABLE `exam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `graduationproject`
--

DROP TABLE IF EXISTS `graduationproject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `graduationproject` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `project_name` varchar(50) COLLATE utf8mb3_turkish_ci NOT NULL,
  `team_number` tinyint NOT NULL,
  `product_name` varchar(50) COLLATE utf8mb3_turkish_ci DEFAULT NULL,
  `project_year` int DEFAULT NULL,
  `semester` varchar(20) COLLATE utf8mb3_turkish_ci NOT NULL,
  `project_description` text COLLATE utf8mb3_turkish_ci,
  `advisor` varchar(100) COLLATE utf8mb3_turkish_ci NOT NULL,
  `project_type` varchar(20) COLLATE utf8mb3_turkish_ci NOT NULL,
  `team_pic` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci DEFAULT 'defaultproject',
  `poster_pic` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci DEFAULT 'defaultproject',
  `company_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_title` (`project_name`),
  KEY `FK_graduationProject_company` (`company_id`),
  CONSTRAINT `FK_graduationProject_company` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `graduationproject`
--

LOCK TABLES `graduationproject` WRITE;
/*!40000 ALTER TABLE `graduationproject` DISABLE KEYS */;
INSERT INTO `graduationproject` VALUES (1,'PocketCtis',0,'',2023,'spring','A very good web app','Burcu Liman','company','defaultproject','defaultproject',NULL),(2,'Educational Project Name',0,'',2021,'spring','temp description here','Serkan Genç','instructor','defaultproject','defaultproject',NULL),(3,'Some Project',0,'',2020,'fall','temp temp temp temp','Burcu Liman','student','defaultproject','defaultproject',NULL),(6,'temp project',2,'idk',2022,'fal','idk idk idk','Duygu Hoca','company','defaulproject','defaulproject',2);
/*!40000 ALTER TABLE `graduationproject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `highschool`
--

DROP TABLE IF EXISTS `highschool`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `highschool` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `high_school_name` varchar(256) COLLATE utf8mb3_turkish_ci NOT NULL,
  `city_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `high_school_name` (`high_school_name`),
  KEY `FK_highSchool_city` (`city_id`),
  CONSTRAINT `FK_highSchool_city` FOREIGN KEY (`city_id`) REFERENCES `city` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `highschool`
--

LOCK TABLES `highschool` WRITE;
/*!40000 ALTER TABLE `highschool` DISABLE KEYS */;
INSERT INTO `highschool` VALUES (1,'Samsun Anadolu Lisesi',55),(2,'Samsun Garip Zeycan',55),(4,'Gazi Lisesi',6);
/*!40000 ALTER TABLE `highschool` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `internshiprecord`
--

DROP TABLE IF EXISTS `internshiprecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `internshiprecord` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `company_id` int unsigned NOT NULL,
  `semester` varchar(10) COLLATE utf8mb3_turkish_ci NOT NULL,
  `department` varchar(50) COLLATE utf8mb3_turkish_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `rating` tinyint DEFAULT NULL,
  `opinion` text COLLATE utf8mb3_turkish_ci,
  `visibility` tinyint(1) DEFAULT '1',
  `record_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_internshipRecord_users` (`user_id`),
  KEY `FK_internshipRecord_company` (`company_id`),
  CONSTRAINT `FK_internshipRecord_company` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_internshipRecord_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `internshiprecord`
--

LOCK TABLES `internshiprecord` WRITE;
/*!40000 ALTER TABLE `internshiprecord` DISABLE KEYS */;
INSERT INTO `internshiprecord` VALUES (1,1,1,'Summer','SW Development','2020-05-06','2020-06-06',5,'here are some opinions',1,'2022-12-10 21:57:04'),(2,1,2,'Semester','SW Development','2021-01-01','2021-04-30',5,'',1,'2022-12-10 21:58:20'),(3,3,1,'Summer','A Department','2020-05-01','2020-06-23',NULL,NULL,1,'2022-12-10 21:59:09'),(4,2,3,'summer','QA','2020-06-01','2020-07-08',3,'bad',0,'2022-12-11 13:06:04'),(5,5,2,'fall','some','2022-01-01','2021-12-12',NULL,NULL,1,'2022-12-13 10:36:30');
/*!40000 ALTER TABLE `internshiprecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `module` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `module_name` varchar(50) COLLATE utf8mb3_turkish_ci NOT NULL,
  `is_active` tinyint NOT NULL DEFAULT '1',
  `is_user_addable` tinyint NOT NULL DEFAULT '-1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `module_name` (`module_name`),
  CONSTRAINT `CHK_is_active` CHECK (((`is_active` >= 1) and (`is_active` <= 4))),
  CONSTRAINT `CHK_is_user_addable` CHECK (((`is_user_addable` >= -(1)) and (`is_user_addable` <= 1) and (((`is_active` > 1) and (`is_user_addable` < 1)) or (`is_active` = 1))))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `module`
--

LOCK TABLES `module` WRITE;
/*!40000 ALTER TABLE `module` DISABLE KEYS */;
/*!40000 ALTER TABLE `module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `request`
--

DROP TABLE IF EXISTS `request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `request` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `description` text COLLATE utf8mb3_turkish_ci NOT NULL,
  `work_record_id` int unsigned DEFAULT NULL,
  `education_record_id` int unsigned DEFAULT NULL,
  `request_date` datetime DEFAULT NULL,
  `is_closed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_request_users` (`user_id`),
  KEY `FK_request_workRecord` (`work_record_id`),
  KEY `FK_request_educationRecord` (`education_record_id`),
  CONSTRAINT `FK_request_educationRecord` FOREIGN KEY (`education_record_id`) REFERENCES `educationrecord` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_request_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_request_workRecord` FOREIGN KEY (`work_record_id`) REFERENCES `workrecord` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `request`
--

LOCK TABLES `request` WRITE;
/*!40000 ALTER TABLE `request` DISABLE KEYS */;
/*!40000 ALTER TABLE `request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sector`
--

DROP TABLE IF EXISTS `sector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sector` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `sector_name` varchar(100) COLLATE utf8mb3_turkish_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sector_name` (`sector_name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sector`
--

LOCK TABLES `sector` WRITE;
/*!40000 ALTER TABLE `sector` DISABLE KEYS */;
INSERT INTO `sector` VALUES (1,'Banking'),(4,'Construction'),(5,'Defense'),(2,'Education'),(6,'Electronic'),(3,'Technology');
/*!40000 ALTER TABLE `sector` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skill`
--

DROP TABLE IF EXISTS `skill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skill` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `skill_name` varchar(50) COLLATE utf8mb3_turkish_ci NOT NULL,
  `skill_type_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `skill_name` (`skill_name`),
  KEY `FK_skill_skillType` (`skill_type_id`),
  CONSTRAINT `FK_skill_skillType` FOREIGN KEY (`skill_type_id`) REFERENCES `skilltype` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skill`
--

LOCK TABLES `skill` WRITE;
/*!40000 ALTER TABLE `skill` DISABLE KEYS */;
INSERT INTO `skill` VALUES (1,'English',1),(2,'German',1),(3,'Russian',1),(4,'Japanase',1),(5,'C++',2),(6,'C',2),(7,'C#',2),(8,'Java',2),(9,'JavaScript',2);
/*!40000 ALTER TABLE `skill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skilltype`
--

DROP TABLE IF EXISTS `skilltype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skilltype` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type_name` varchar(50) COLLATE utf8mb3_turkish_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type_name` (`type_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skilltype`
--

LOCK TABLES `skilltype` WRITE;
/*!40000 ALTER TABLE `skilltype` DISABLE KEYS */;
INSERT INTO `skilltype` VALUES (2,'Programming Language'),(1,'Toolss');
/*!40000 ALTER TABLE `skilltype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `socialmedia`
--

DROP TABLE IF EXISTS `socialmedia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `socialmedia` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `social_media_name` varchar(50) COLLATE utf8mb3_turkish_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `social_media_name` (`social_media_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `socialmedia`
--

LOCK TABLES `socialmedia` WRITE;
/*!40000 ALTER TABLE `socialmedia` DISABLE KEYS */;
INSERT INTO `socialmedia` VALUES (1,'Facebook'),(4,'Github'),(2,'Linkedin'),(3,'Twitter'),(5,'Youtube');
/*!40000 ALTER TABLE `socialmedia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentsociety`
--

DROP TABLE IF EXISTS `studentsociety`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentsociety` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `society_name` varchar(256) COLLATE utf8mb3_turkish_ci NOT NULL,
  `description` text COLLATE utf8mb3_turkish_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `society_name` (`society_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentsociety`
--

LOCK TABLES `studentsociety` WRITE;
/*!40000 ALTER TABLE `studentsociety` DISABLE KEYS */;
INSERT INTO `studentsociety` VALUES (1,'Tea Club','some stuff idk'),(2,'Gaming Club','We like to play games'),(3,'Art Club','Doing art and being creative'),(4,'Cinema','We watch movies every friday');
/*!40000 ALTER TABLE `studentsociety` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `useraccounttype`
--

DROP TABLE IF EXISTS `useraccounttype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `useraccounttype` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `type_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_userAccountType_users` (`user_id`),
  KEY `FK_userAccountType_accountType` (`type_id`),
  CONSTRAINT `FK_userAccountType_accountType` FOREIGN KEY (`type_id`) REFERENCES `accounttype` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_userAccountType_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `useraccounttype`
--

LOCK TABLES `useraccounttype` WRITE;
/*!40000 ALTER TABLE `useraccounttype` DISABLE KEYS */;
INSERT INTO `useraccounttype` VALUES (1,1,2),(2,2,1),(3,3,1),(4,4,2),(5,5,4),(6,5,2),(7,5,3),(8,6,1),(9,7,2);
/*!40000 ALTER TABLE `useraccounttype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usercareerobjective`
--

DROP TABLE IF EXISTS `usercareerobjective`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usercareerobjective` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `career_objective` text COLLATE utf8mb3_turkish_ci,
  `visibility` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `FK_userCareerObjective_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usercareerobjective`
--

LOCK TABLES `usercareerobjective` WRITE;
/*!40000 ALTER TABLE `usercareerobjective` DISABLE KEYS */;
INSERT INTO `usercareerobjective` VALUES (4,1,'something',0);
/*!40000 ALTER TABLE `usercareerobjective` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usercertificate`
--

DROP TABLE IF EXISTS `usercertificate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usercertificate` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `certificate_name` varchar(256) COLLATE utf8mb3_turkish_ci NOT NULL,
  `issuing_authority` varchar(100) COLLATE utf8mb3_turkish_ci NOT NULL,
  `visibility` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `FK_userCertificate_users` (`user_id`),
  CONSTRAINT `FK_userCertificate_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usercertificate`
--

LOCK TABLES `usercertificate` WRITE;
/*!40000 ALTER TABLE `usercertificate` DISABLE KEYS */;
INSERT INTO `usercertificate` VALUES (2,3,'Good Person','God',0),(4,3,'Database Professional','Oracle',1),(5,3,'Honor Student','Bilkent',1),(10,1,'Cool Certificate','Some Company',0);
/*!40000 ALTER TABLE `usercertificate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usercredential`
--

DROP TABLE IF EXISTS `usercredential`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usercredential` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `salt` varchar(256) COLLATE utf8mb3_turkish_ci NOT NULL,
  `hashed` varchar(256) COLLATE utf8mb3_turkish_ci NOT NULL,
  `is_admin_auth` tinyint(1) NOT NULL DEFAULT '0',
  `username` varchar(20) COLLATE utf8mb3_turkish_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `salt` (`salt`),
  KEY `FK_userCredential_users` (`user_id`),
  CONSTRAINT `FK_userCredential_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usercredential`
--

LOCK TABLES `usercredential` WRITE;
/*!40000 ALTER TABLE `usercredential` DISABLE KEYS */;
INSERT INTO `usercredential` VALUES (1,1,'a','a',0,'tempusername');
/*!40000 ALTER TABLE `usercredential` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `useremail`
--

DROP TABLE IF EXISTS `useremail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `useremail` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `email_address` varchar(255) COLLATE utf8mb3_turkish_ci NOT NULL,
  `visibility` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_address` (`email_address`),
  KEY `FK_userEmail_users` (`user_id`),
  CONSTRAINT `FK_userEmail_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `useremail`
--

LOCK TABLES `useremail` WRITE;
/*!40000 ALTER TABLE `useremail` DISABLE KEYS */;
INSERT INTO `useremail` VALUES (1,1,'myaddress@homtail.com',1),(2,1,'my@homtail.com',1),(3,1,'hi@hotmail.com',0),(4,3,'temp@mail.com',1),(5,3,'temtemptempp@gmail.com',1),(7,3,'somethi',1);
/*!40000 ALTER TABLE `useremail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userexam`
--

DROP TABLE IF EXISTS `userexam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userexam` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `exam_id` int unsigned NOT NULL,
  `grade` varchar(10) COLLATE utf8mb3_turkish_ci NOT NULL,
  `visibility` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `FK_userExam_users` (`user_id`),
  KEY `FK_userExam_exam` (`exam_id`),
  CONSTRAINT `FK_userExam_exam` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_userExam_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userexam`
--

LOCK TABLES `userexam` WRITE;
/*!40000 ALTER TABLE `userexam` DISABLE KEYS */;
INSERT INTO `userexam` VALUES (1,3,1,'100',1),(2,3,3,'90',1),(3,3,4,'340',0),(5,1,2,'60',1),(6,1,1,'1',1);
/*!40000 ALTER TABLE `userexam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userhighschool`
--

DROP TABLE IF EXISTS `userhighschool`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userhighschool` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `high_school_id` int unsigned NOT NULL,
  `visibility` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `FK_userHighSchool_users` (`user_id`),
  KEY `FK_userHighSchool_highSchool` (`high_school_id`),
  CONSTRAINT `FK_userHighSchool_highSchool` FOREIGN KEY (`high_school_id`) REFERENCES `highschool` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_userHighSchool_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userhighschool`
--

LOCK TABLES `userhighschool` WRITE;
/*!40000 ALTER TABLE `userhighschool` DISABLE KEYS */;
INSERT INTO `userhighschool` VALUES (2,2,2,1),(3,4,1,0),(4,3,1,0);
/*!40000 ALTER TABLE `userhighschool` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userlocation`
--

DROP TABLE IF EXISTS `userlocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userlocation` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `city_id` int unsigned NOT NULL,
  `visibility` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `FK_userLocation_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userlocation`
--

LOCK TABLES `userlocation` WRITE;
/*!40000 ALTER TABLE `userlocation` DISABLE KEYS */;
INSERT INTO `userlocation` VALUES (1,1,55,1),(3,2,6,1),(7,3,1,0);
/*!40000 ALTER TABLE `userlocation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userlog`
--

DROP TABLE IF EXISTS `userlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userlog` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `log_time` datetime NOT NULL,
  `transaction_type` varchar(20) COLLATE utf8mb3_turkish_ci NOT NULL,
  `target_table` varchar(10) COLLATE utf8mb3_turkish_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_userLog_users` (`user_id`),
  CONSTRAINT `FK_userLog_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userlog`
--

LOCK TABLES `userlog` WRITE;
/*!40000 ALTER TABLE `userlog` DISABLE KEYS */;
/*!40000 ALTER TABLE `userlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userphone`
--

DROP TABLE IF EXISTS `userphone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userphone` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `phone_number` varchar(30) COLLATE utf8mb3_turkish_ci DEFAULT NULL,
  `visibility` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `FK_userPhone_users` (`user_id`),
  CONSTRAINT `FK_userPhone_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userphone`
--

LOCK TABLES `userphone` WRITE;
/*!40000 ALTER TABLE `userphone` DISABLE KEYS */;
INSERT INTO `userphone` VALUES (2,1,'0532 234 7824',1),(3,1,'05424 25 2345',0),(4,1,'2434624',0),(5,1,'2434624',1);
/*!40000 ALTER TABLE `userphone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userprofilepicture`
--

DROP TABLE IF EXISTS `userprofilepicture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userprofilepicture` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `profile_picture` varchar(256) COLLATE utf8mb3_turkish_ci NOT NULL DEFAULT (_utf8mb4'defaultuser'),
  `visibility` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `FK_userProfilePicture_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userprofilepicture`
--

LOCK TABLES `userprofilepicture` WRITE;
/*!40000 ALTER TABLE `userprofilepicture` DISABLE KEYS */;
INSERT INTO `userprofilepicture` VALUES (1,1,'aaaaaaa',1),(2,2,'defaultuser',0),(3,3,'defaultuser',1),(4,4,'defaultuser',0),(5,5,'defaultuser',1),(6,6,'defaultuser',1),(7,7,'defaultuser',1);
/*!40000 ALTER TABLE `userprofilepicture` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `bilkent_id` int unsigned NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb3_turkish_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb3_turkish_ci NOT NULL,
  `gender` tinyint(1) NOT NULL,
  `is_retired` tinyint(1) DEFAULT '0',
  `graduation_project_id` int unsigned DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `nee` varchar(100) COLLATE utf8mb3_turkish_ci DEFAULT NULL,
  `profile_completion` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `bilkent_id` (`bilkent_id`),
  KEY `FK_users_graduationProject` (`graduation_project_id`),
  CONSTRAINT `FK_users_graduationProject` FOREIGN KEY (`graduation_project_id`) REFERENCES `graduationproject` (`id`) ON DELETE SET NULL,
  CONSTRAINT `CHK_is_female` CHECK ((((`gender` = 0) and (`nee` = NULL)) or (`gender` = 1)))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,2143343,'İpek','Günaltay',1,0,1,1,NULL,0),(2,2193432,'Kürşat','Deniz',0,0,3,1,NULL,0),(3,214345,'Sıla','Yapıcı',1,0,1,1,NULL,0),(4,215454,'Ali','Davut',0,0,2,1,NULL,0),(5,1232,'Burcu','Liman',1,0,NULL,1,'Özdoğru',0),(6,2343233,'Sena','Çilekçi',1,0,NULL,1,'Fırat',0),(7,23433,'Beril','Çilekçi',1,0,NULL,1,NULL,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userskill`
--

DROP TABLE IF EXISTS `userskill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userskill` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `skill_id` int unsigned NOT NULL,
  `skill_level` tinyint DEFAULT NULL,
  `visibility` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `FK_userSkill_users` (`user_id`),
  KEY `FK_userSKill_skill` (`skill_id`),
  CONSTRAINT `FK_userSKill_skill` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_userSkill_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userskill`
--

LOCK TABLES `userskill` WRITE;
/*!40000 ALTER TABLE `userskill` DISABLE KEYS */;
INSERT INTO `userskill` VALUES (1,1,1,5,1),(2,1,2,4,1),(4,3,2,3,1),(5,3,3,1,1),(6,1,6,5,1),(7,1,7,3,1),(9,3,5,5,0);
/*!40000 ALTER TABLE `userskill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usersocialmedia`
--

DROP TABLE IF EXISTS `usersocialmedia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usersocialmedia` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `social_media_id` int unsigned NOT NULL,
  `link` varchar(256) COLLATE utf8mb3_turkish_ci NOT NULL,
  `visibility` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `FK_userSocialMedia_users` (`user_id`),
  KEY `FK_userSocialMedia_socialMedia` (`social_media_id`),
  CONSTRAINT `FK_userSocialMedia_socialMedia` FOREIGN KEY (`social_media_id`) REFERENCES `socialmedia` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_userSocialMedia_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersocialmedia`
--

LOCK TABLES `usersocialmedia` WRITE;
/*!40000 ALTER TABLE `usersocialmedia` DISABLE KEYS */;
INSERT INTO `usersocialmedia` VALUES (1,1,1,'something.com',1),(2,1,2,'asdasd.com',0),(3,2,3,'mmbd.com',1);
/*!40000 ALTER TABLE `usersocialmedia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userstudentsociety`
--

DROP TABLE IF EXISTS `userstudentsociety`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userstudentsociety` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `society_id` int unsigned NOT NULL,
  `activity_status` tinyint(1) NOT NULL,
  `visibility` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `FK_userStudentSociety_users` (`user_id`),
  KEY `FK_userStudentSociety_studentSociety` (`society_id`),
  CONSTRAINT `FK_userStudentSociety_studentSociety` FOREIGN KEY (`society_id`) REFERENCES `studentsociety` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_userStudentSociety_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userstudentsociety`
--

LOCK TABLES `userstudentsociety` WRITE;
/*!40000 ALTER TABLE `userstudentsociety` DISABLE KEYS */;
INSERT INTO `userstudentsociety` VALUES (1,1,2,1,1),(2,3,2,1,0),(3,1,1,0,1),(4,3,1,1,0),(5,3,4,0,1),(6,4,3,1,1);
/*!40000 ALTER TABLE `userstudentsociety` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userwantsector`
--

DROP TABLE IF EXISTS `userwantsector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userwantsector` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `sector_id` int unsigned NOT NULL,
  `visibility` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `FK_userSector_users` (`user_id`),
  KEY `FK_userSector_sector` (`sector_id`),
  CONSTRAINT `FK_userSector_sector` FOREIGN KEY (`sector_id`) REFERENCES `sector` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_userSector_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userwantsector`
--

LOCK TABLES `userwantsector` WRITE;
/*!40000 ALTER TABLE `userwantsector` DISABLE KEYS */;
INSERT INTO `userwantsector` VALUES (1,1,1,1),(2,1,2,1),(3,2,3,0),(4,2,1,1);
/*!40000 ALTER TABLE `userwantsector` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workrecord`
--

DROP TABLE IF EXISTS `workrecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workrecord` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `company_id` int unsigned DEFAULT NULL,
  `work_type_id` int unsigned NOT NULL,
  `department` varchar(100) COLLATE utf8mb3_turkish_ci DEFAULT NULL,
  `position` varchar(100) COLLATE utf8mb3_turkish_ci DEFAULT NULL,
  `work_description` text COLLATE utf8mb3_turkish_ci,
  `city_id` int unsigned DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `visibility` tinyint(1) DEFAULT '1',
  `is_current` tinyint(1) NOT NULL DEFAULT '0',
  `record_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_workRecord_workType` (`work_type_id`),
  KEY `FK_workRecord_users` (`user_id`),
  KEY `FK_workRecord_company` (`company_id`),
  KEY `FK_workRecord_city` (`city_id`),
  CONSTRAINT `FK_workRecord_city` FOREIGN KEY (`city_id`) REFERENCES `city` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_workRecord_company` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_workRecord_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_workRecord_workType` FOREIGN KEY (`work_type_id`) REFERENCES `worktype` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workrecord`
--

LOCK TABLES `workrecord` WRITE;
/*!40000 ALTER TABLE `workrecord` DISABLE KEYS */;
INSERT INTO `workrecord` VALUES (1,1,1,2,'Software Development','Tester',NULL,6,NULL,'2022-12-10',1,0,'2022-12-10 17:45:45'),(2,1,2,1,'QA','Developer',NULL,6,'2020-06-03','2021-10-24',1,0,'2022-12-10 17:50:08'),(3,3,NULL,3,NULL,NULL,'i develop games as hobby',NULL,NULL,NULL,0,1,'2022-12-11 12:58:46'),(4,4,1,1,NULL,NULL,NULL,NULL,NULL,NULL,1,1,'2022-12-11 15:12:21'),(5,5,4,1,'Software Development','Senior Developer','I work at Arçelik',NULL,'2012-04-01',NULL,1,1,'2022-12-11 19:20:49');
/*!40000 ALTER TABLE `workrecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `worktype`
--

DROP TABLE IF EXISTS `worktype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `worktype` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type_name` varchar(20) COLLATE utf8mb3_turkish_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type_name` (`type_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `worktype`
--

LOCK TABLES `worktype` WRITE;
/*!40000 ALTER TABLE `worktype` DISABLE KEYS */;
INSERT INTO `worktype` VALUES (3,'Freelance'),(1,'Full Time'),(2,'Part Time');
/*!40000 ALTER TABLE `worktype` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-13 11:02:54
