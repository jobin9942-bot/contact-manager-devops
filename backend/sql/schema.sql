CREATE DATABASE IF NOT EXISTS contact_manager
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE contact_manager;

CREATE TABLE IF NOT EXISTS contacts (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NULL,
  email VARCHAR(254) NULL,
  phone VARCHAR(40) NULL,
  company VARCHAR(150) NULL,
  job_title VARCHAR(150) NULL,
  address TEXT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_contacts_created (created_at),
  INDEX idx_contacts_name (last_name, first_name),
  INDEX idx_contacts_email (email),
  INDEX idx_contacts_phone (phone),
  INDEX idx_contacts_company (company)
) ENGINE=InnoDB;
