-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema new_schema
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema new_schema
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `new_schema` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci ;
USE `new_schema` ;

-- -----------------------------------------------------
-- Table `new_schema`.`accounttype`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`accounttype` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `type_name` VARCHAR(20) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `type_name` (`type_name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`country`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`country` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `country_name` VARCHAR(60) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `country_name` (`country_name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`city`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`city` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `city_name` VARCHAR(100) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `country_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK_city_country` (`country_id` ASC) VISIBLE,
  CONSTRAINT `FK_city_country`
    FOREIGN KEY (`country_id`)
    REFERENCES `new_schema`.`country` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 83
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`sector`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`sector` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sector_name` VARCHAR(100) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `sector_name` (`sector_name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`company`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`company` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_name` VARCHAR(100) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `sector_id` INT UNSIGNED NOT NULL,
  `is_internship` TINYINT(1) NOT NULL DEFAULT '0',
  `rating` TINYINT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `company_name` (`company_name` ASC) VISIBLE,
  INDEX `FK_company_sector` (`sector_id` ASC) VISIBLE,
  CONSTRAINT `FK_company_sector`
    FOREIGN KEY (`sector_id`)
    REFERENCES `new_schema`.`sector` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 11302
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`degreetype`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`degreetype` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `degree_type_name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `degree_name` (`degree_type_name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`educationinstitute`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`educationinstitute` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `edu_inst_name` VARCHAR(100) NOT NULL,
  `city_id` INT UNSIGNED NULL DEFAULT NULL,
  `is_erasmus` TINYINT(1) NULL DEFAULT '0',
  `rating` TINYINT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `inst_name` (`edu_inst_name` ASC) VISIBLE,
  INDEX `FK_educationInstitute_city` (`city_id` ASC) VISIBLE,
  CONSTRAINT `FK_educationInstitute_city`
    FOREIGN KEY (`city_id`)
    REFERENCES `new_schema`.`city` (`id`)
    ON DELETE SET NULL)
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `bilkent_id` INT UNSIGNED NOT NULL,
  `first_name` VARCHAR(100) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `nee` VARCHAR(100) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT '',
  `last_name` VARCHAR(100) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `gender` TINYINT(1) NOT NULL,
  `is_retired` TINYINT(1) NULL DEFAULT '0',
  `is_active` TINYINT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `bilkent_id` (`bilkent_id` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`educationrecord`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`educationrecord` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `edu_inst_id` INT UNSIGNED NOT NULL,
  `degree_type_id` INT UNSIGNED NOT NULL,
  `name_of_program` VARCHAR(100) NOT NULL,
  `start_date` DATE NULL DEFAULT NULL,
  `end_date` DATE NULL DEFAULT NULL,
  `education_description` MEDIUMTEXT NULL DEFAULT NULL,
  `visibility` TINYINT(1) NULL DEFAULT '1',
  `is_current` TINYINT(1) NOT NULL DEFAULT '0',
  `record_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `FK_educationRecord_users` (`user_id` ASC) VISIBLE,
  INDEX `FK_educationRecord_educationInstitute` (`edu_inst_id` ASC) VISIBLE,
  INDEX `FK_educationRecord_degreeType` (`degree_type_id` ASC) VISIBLE,
  CONSTRAINT `FK_educationRecord_degreeType`
    FOREIGN KEY (`degree_type_id`)
    REFERENCES `new_schema`.`degreetype` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_educationRecord_educationInstitute`
    FOREIGN KEY (`edu_inst_id`)
    REFERENCES `new_schema`.`educationinstitute` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_educationRecord_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 30
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`erasmusrecord`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`erasmusrecord` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `edu_inst_id` INT UNSIGNED NOT NULL,
  `semester` VARCHAR(20) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `rating` FLOAT NULL DEFAULT NULL,
  `opinion` MEDIUMTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT NULL,
  `visibility` TINYINT(1) NULL DEFAULT '1',
  `record_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `FK_erasmusRecord_users` (`user_id` ASC) VISIBLE,
  INDEX `FK_erasmusRecord_educationInstitute` (`edu_inst_id` ASC) VISIBLE,
  CONSTRAINT `FK_erasmusRecord_educationInstitute`
    FOREIGN KEY (`edu_inst_id`)
    REFERENCES `new_schema`.`educationinstitute` (`id`),
  CONSTRAINT `FK_erasmusRecord_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`exam`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`exam` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `exam_name` VARCHAR(50) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `exam_name` (`exam_name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`graduationproject`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`graduationproject` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `graduation_project_name` VARCHAR(50) NOT NULL,
  `team_number` TINYINT NOT NULL,
  `product_name` VARCHAR(50) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT NULL,
  `project_year` INT NULL DEFAULT NULL,
  `semester` VARCHAR(20) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `project_description` MEDIUMTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT NULL,
  `advisor_id` INT UNSIGNED NOT NULL,
  `project_type` VARCHAR(20) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `team_pic` VARCHAR(50) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT 'defaultproject',
  `poster_pic` VARCHAR(50) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT 'defaultproject',
  `company_id` INT UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `project_title` (`graduation_project_name` ASC) VISIBLE,
  INDEX `FK_graduationProject_company` (`company_id` ASC) VISIBLE,
  CONSTRAINT `FK_graduationProject_advisor`
    FOREIGN KEY (`id`)
    REFERENCES `new_schema`.`users` (`id`),
  CONSTRAINT `FK_graduationProject_company`
    FOREIGN KEY (`company_id`)
    REFERENCES `new_schema`.`company` (`id`)
    ON DELETE SET NULL)
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`highschool`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`highschool` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `high_school_name` VARCHAR(256) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `city_id` INT UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `high_school_name` (`high_school_name` ASC) VISIBLE,
  INDEX `FK_highSchool_city` (`city_id` ASC) VISIBLE,
  CONSTRAINT `FK_highSchool_city`
    FOREIGN KEY (`city_id`)
    REFERENCES `new_schema`.`city` (`id`)
    ON DELETE SET NULL)
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`internshiprecord`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`internshiprecord` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `company_id` INT UNSIGNED NOT NULL,
  `semester` VARCHAR(10) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `department` VARCHAR(50) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NULL DEFAULT NULL,
  `rating` FLOAT NULL DEFAULT NULL,
  `opinion` MEDIUMTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT NULL,
  `visibility` TINYINT(1) NULL DEFAULT '1',
  `record_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `FK_internshipRecord_users` (`user_id` ASC) VISIBLE,
  INDEX `FK_internshipRecord_company` (`company_id` ASC) VISIBLE,
  CONSTRAINT `FK_internshipRecord_company`
    FOREIGN KEY (`company_id`)
    REFERENCES `new_schema`.`company` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_internshipRecord_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`module`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`module` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `module_name` VARCHAR(50) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `is_active` TINYINT NOT NULL DEFAULT '1',
  `is_user_addable` TINYINT NOT NULL DEFAULT '-1',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `module_name` (`module_name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`worktype`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`worktype` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `work_type_name` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `type_name` (`work_type_name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`workrecord`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`workrecord` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `company_id` INT UNSIGNED NULL DEFAULT NULL,
  `work_type_id` INT UNSIGNED NOT NULL,
  `department` VARCHAR(100) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT NULL,
  `position` VARCHAR(100) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT NULL,
  `work_description` MEDIUMTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT NULL,
  `city_id` INT UNSIGNED NULL DEFAULT NULL,
  `country_id` INT UNSIGNED NULL DEFAULT NULL,
  `start_date` DATE NULL DEFAULT NULL,
  `end_date` DATE NULL DEFAULT NULL,
  `visibility` TINYINT(1) NULL DEFAULT '1',
  `is_current` TINYINT(1) NOT NULL DEFAULT '0',
  `record_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `FK_workRecord_workType` (`work_type_id` ASC) VISIBLE,
  INDEX `FK_workRecord_users` (`user_id` ASC) VISIBLE,
  INDEX `FK_workRecord_company` (`company_id` ASC) VISIBLE,
  INDEX `FK_workRecord_city` (`city_id` ASC) VISIBLE,
  CONSTRAINT `FK_workRecord_city`
    FOREIGN KEY (`city_id`)
    REFERENCES `new_schema`.`city` (`id`)
    ON DELETE SET NULL,
  CONSTRAINT `FK_workRecord_company`
    FOREIGN KEY (`company_id`)
    REFERENCES `new_schema`.`company` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_workRecord_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_workRecord_workType`
    FOREIGN KEY (`work_type_id`)
    REFERENCES `new_schema`.`worktype` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 129
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`request`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`request` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `description` MEDIUMTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `work_record_id` INT UNSIGNED NULL DEFAULT NULL,
  `education_record_id` INT UNSIGNED NULL DEFAULT NULL,
  `request_date` DATETIME NULL DEFAULT NULL,
  `is_closed` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `FK_request_users` (`user_id` ASC) VISIBLE,
  INDEX `FK_request_workRecord` (`work_record_id` ASC) VISIBLE,
  INDEX `FK_request_educationRecord` (`education_record_id` ASC) VISIBLE,
  CONSTRAINT `FK_request_educationRecord`
    FOREIGN KEY (`education_record_id`)
    REFERENCES `new_schema`.`educationrecord` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_request_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_request_workRecord`
    FOREIGN KEY (`work_record_id`)
    REFERENCES `new_schema`.`workrecord` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`skilltype`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`skilltype` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `skill_type_name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `type_name` (`skill_type_name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`skill`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`skill` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `skill_name` VARCHAR(50) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `skill_type_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `skill_name` (`skill_name` ASC) VISIBLE,
  INDEX `FK_skill_skillType` (`skill_type_id` ASC) VISIBLE,
  CONSTRAINT `FK_skill_skillType`
    FOREIGN KEY (`skill_type_id`)
    REFERENCES `new_schema`.`skilltype` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 12
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`socialmedia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`socialmedia` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `social_media_name` VARCHAR(50) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `base_link` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `social_media_name` (`social_media_name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`studentsociety`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`studentsociety` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `society_name` VARCHAR(256) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `description` MEDIUMTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `society_name` (`society_name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`useraccounttype`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`useraccounttype` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `type_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK_userAccountType_users` (`user_id` ASC) VISIBLE,
  INDEX `FK_userAccountType_accountType` (`type_id` ASC) VISIBLE,
  CONSTRAINT `FK_userAccountType_accountType`
    FOREIGN KEY (`type_id`)
    REFERENCES `new_schema`.`accounttype` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_userAccountType_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`usercareerobjective`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`usercareerobjective` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `career_objective` MEDIUMTEXT NOT NULL,
  `visibility` TINYINT(1) NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FK_userCareerObjective_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 39
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`usercertificate`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`usercertificate` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `certificate_name` VARCHAR(256) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `issuing_authority` VARCHAR(100) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `visibility` TINYINT(1) NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `FK_userCertificate_users` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FK_userCertificate_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 53
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`usercredential`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`usercredential` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `hashed` VARCHAR(256) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `is_admin_auth` TINYINT(1) NOT NULL DEFAULT '0',
  `username` VARCHAR(20) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK_userCredential_users` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FK_userCredential_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`useremail`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`useremail` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `email_address` VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `visibility` TINYINT(1) NULL DEFAULT '1',
  `is_default` TINYINT(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_address` (`email_address` ASC) VISIBLE,
  INDEX `FK_userEmail_users` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FK_userEmail_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 44
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`userexam`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`userexam` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `exam_id` INT UNSIGNED NOT NULL,
  `grade` VARCHAR(10) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `exam_date` DATE NULL DEFAULT NULL,
  `visibility` TINYINT(1) NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `FK_userExam_users` (`user_id` ASC) VISIBLE,
  INDEX `FK_userExam_exam` (`exam_id` ASC) VISIBLE,
  CONSTRAINT `FK_userExam_exam`
    FOREIGN KEY (`exam_id`)
    REFERENCES `new_schema`.`exam` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_userExam_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 80
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`usergraduationproject`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`usergraduationproject` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `graduation_project_id` INT UNSIGNED NOT NULL,
  `graduation_project_description` MEDIUMTEXT NULL DEFAULT NULL,
  `visibility` TINYINT(1) NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`userhighschool`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`userhighschool` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `high_school_id` INT UNSIGNED NOT NULL,
  `visibility` TINYINT(1) NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `FK_userHighSchool_users` (`user_id` ASC) VISIBLE,
  INDEX `FK_userHighSchool_highSchool` (`high_school_id` ASC) VISIBLE,
  CONSTRAINT `FK_userHighSchool_highSchool`
    FOREIGN KEY (`high_school_id`)
    REFERENCES `new_schema`.`highschool` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_userHighSchool_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 94
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`userlocation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`userlocation` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `city_id` INT UNSIGNED NULL DEFAULT NULL,
  `country_id` INT UNSIGNED NOT NULL,
  `visibility` TINYINT(1) NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FK_userLocation_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 22
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`userlog`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`userlog` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NULL DEFAULT NULL,
  `log_time` DATETIME NOT NULL,
  `transaction_type` VARCHAR(20) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `target_table` VARCHAR(10) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK_userLog_users` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FK_userLog_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`userphone`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`userphone` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `phone_number` VARCHAR(30) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT NULL,
  `visibility` TINYINT(1) NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `FK_userPhone_users` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FK_userPhone_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 27
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`userprofilepicture`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`userprofilepicture` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `profile_picture` VARCHAR(256) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL DEFAULT _utf8mb4'defaultuser',
  `visibility` TINYINT(1) NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FK_userProfilePicture_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`userproject`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`userproject` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `project_name` VARCHAR(45) NOT NULL,
  `project_description` MEDIUMTEXT NULL DEFAULT NULL,
  `visibility` TINYINT(1) NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 59
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`userskill`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`userskill` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `skill_id` INT UNSIGNED NOT NULL,
  `skill_level` TINYINT NULL DEFAULT NULL,
  `visibility` TINYINT(1) NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `FK_userSkill_users` (`user_id` ASC) VISIBLE,
  INDEX `FK_userSKill_skill` (`skill_id` ASC) VISIBLE,
  CONSTRAINT `FK_userSKill_skill`
    FOREIGN KEY (`skill_id`)
    REFERENCES `new_schema`.`skill` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_userSkill_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 390
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`usersocialmedia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`usersocialmedia` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `social_media_id` INT UNSIGNED NOT NULL,
  `link` VARCHAR(256) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NOT NULL,
  `visibility` TINYINT(1) NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `FK_userSocialMedia_users` (`user_id` ASC) VISIBLE,
  INDEX `FK_userSocialMedia_socialMedia` (`social_media_id` ASC) VISIBLE,
  CONSTRAINT `FK_userSocialMedia_socialMedia`
    FOREIGN KEY (`social_media_id`)
    REFERENCES `new_schema`.`socialmedia` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_userSocialMedia_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 24
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`userstudentsociety`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`userstudentsociety` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `society_id` INT UNSIGNED NOT NULL,
  `activity_status` TINYINT(1) NOT NULL,
  `visibility` TINYINT(1) NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `FK_userStudentSociety_users` (`user_id` ASC) VISIBLE,
  INDEX `FK_userStudentSociety_studentSociety` (`society_id` ASC) VISIBLE,
  CONSTRAINT `FK_userStudentSociety_studentSociety`
    FOREIGN KEY (`society_id`)
    REFERENCES `new_schema`.`studentsociety` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_userStudentSociety_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 98
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`userwantsector`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new_schema`.`userwantsector` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `sector_id` INT UNSIGNED NOT NULL,
  `visibility` TINYINT(1) NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `FK_userSector_users` (`user_id` ASC) VISIBLE,
  INDEX `FK_userSector_sector` (`sector_id` ASC) VISIBLE,
  CONSTRAINT `FK_userSector_sector`
    FOREIGN KEY (`sector_id`)
    REFERENCES `new_schema`.`sector` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_userSector_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 47
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
