import mysql, { } from "mysql2"
import dotenv from "dotenv"
dotenv.config();


export const sql_con = mysql.createConnection({
    host: process.env.HOST || '127.0.0.1',
    user: 'root',
    password: process.env.DBPWD,
    database: process.env.SHEMA
})



/*

CREATE DATABASE okphone default CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users(
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    sns_id VARCHAR(50) UNIQUE,
    password VARCHAR(150),
    phone VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(50),
    rate VARCHAR(5) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    connected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    refresh_token TEXT
);

// 요금제 그룹 (통신사 / 구간 (상위 / 하위 / 키즈 / 어르신 등))
통신사 / 그룹명 / 통신방식 / 문구

CREATE TABLE plan_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carrier VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    network_type VARCHAR(100) NOT NULL,
    info VARCHAR(255),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_plan_groups_carrier_network UNIQUE (carrier, network_type, name),
    CONSTRAINT uq_plan_groups_sort_order UNIQUE (sort_order)
);

>> uq_plan_groups_carrier_network UNIQUE 묶음 수정! 3개로 묶여 있으면 상관 없음~

ALTER TABLE plan_groups
DROP INDEX uq_plan_groups_carrier_network;

ALTER TABLE plan_groups
ADD CONSTRAINT uq_plan_groups_carrier_network_name
UNIQUE (carrier, network_type, name);



ALTER TABLE plan_groups
ADD CONSTRAINT uq_plan_groups_sort_order UNIQUE (sort_order);

DELIMITER $$

CREATE TRIGGER trg_plan_groups_sort_order
BEFORE INSERT ON plan_groups
FOR EACH ROW
BEGIN
    IF NEW.sort_order IS NULL OR NEW.sort_order = 0 THEN
        SET NEW.sort_order = (
            SELECT COALESCE(MAX(sort_order), 0) + 1
            FROM plan_groups
        );
    END IF;
END$$

DELIMITER ;


// 요금제 정보
CREATE TABLE plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price INT NOT NULL,
    voice VARCHAR(50),
    usedata VARCHAR(50),
    sms VARCHAR(50),
    benefits TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_plan_group FOREIGN KEY (group_id) REFERENCES plan_groups(id) ON DELETE CASCADE,
    CONSTRAINT uq_plans_group_name UNIQUE (group_id, name)
);

ALTER TABLE plans CHANGE COLUMN data usedata VARCHAR(50);

DELIMITER $$

CREATE TRIGGER trg_plans_sort_order
BEFORE INSERT ON plans
FOR EACH ROW
BEGIN
    IF NEW.sort_order IS NULL OR NEW.sort_order = 0 THEN
        SET NEW.sort_order = (
            SELECT COALESCE(MAX(sort_order), 0) + 1
            FROM plans
        );
    END IF;
END$$

DELIMITER ;

// 상품 그룹

아이폰 / 갤럭시 이따위 >> 이게 메뉴가 될 예정

CREATE TABLE product_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  img_url VARCHAR(255),
  description TEXT,
  sort_order INT DEFAULT 0,
  CONSTRAINT uq_product_groups_name UNIQUE (name)
);

ALTER TABLE product_groups ADD COLUMN img_url VARCHAR(255) AFTER name;


DELIMITER $$

CREATE TRIGGER trg_product_groups_sort_order
BEFORE INSERT ON product_groups
FOR EACH ROW
BEGIN
    IF NEW.sort_order IS NULL OR NEW.sort_order = 0 THEN
        SET NEW.sort_order = (
            SELECT COALESCE(MAX(sort_order), 0) + 1
            FROM product_groups
        );
    END IF;
END$$

DELIMITER ;


// 상품

SKT 샘플!!!!

skt_msrp VARCHAR(255),              -- 출고가
skt_storages VARCHAR(255),          -- "256,512"
skt_plans VARCHAR(255),             -- "101,102"
skt_public_subsidy VARCHAR(255),    -- 공시지원금(기본)

-- 신규(NEW)
skt_new_public_extra VARCHAR(255),      -- 신규 공시 추가지원
skt_new_select_extra VARCHAR(255),      -- 신규 선택약정 추가지원
skt_new_discount VARCHAR(255),          -- 신규 할인

-- 번호이동(MNP)
skt_mnp_public_extra VARCHAR(255),      -- 번이 공시 추가지원
skt_mnp_select_extra VARCHAR(255),      -- 번이 선택약정 추가지원
skt_mnp_discount VARCHAR(255),          -- 번이 할인

-- 기기변경(CHG)
skt_chg_public_extra VARCHAR(255),      -- 기변 공시 추가지원
skt_chg_select_extra VARCHAR(255),      -- 기변 선택약정 추가지원
skt_chg_discount VARCHAR(255),          -- 기변 할인

-----------------

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plans_group_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  img_url VARCHAR(255),
  use_carrier BOOLEAN DEFAULT TRUE,

  skt_msrp VARCHAR(255),
  skt_storages VARCHAR(255),
  skt_plans VARCHAR(255),
  skt_public_subsidy VARCHAR(255), 
  skt_new_public_extra VARCHAR(255),
  skt_new_select_extra VARCHAR(255),
  skt_new_discount VARCHAR(255),
  skt_mnp_public_extra VARCHAR(255),
  skt_mnp_select_extra VARCHAR(255),
  skt_mnp_discount VARCHAR(255),
  skt_chg_public_extra VARCHAR(255),
  skt_chg_select_extra VARCHAR(255),
  skt_chg_discount VARCHAR(255),

  kt_msrp VARCHAR(255),
  kt_storages VARCHAR(255),
  kt_plans VARCHAR(255),
  kt_public_subsidy VARCHAR(255), 
  kt_new_public_extra VARCHAR(255),
  kt_new_select_extra VARCHAR(255),
  kt_new_discount VARCHAR(255),
  kt_mnp_public_extra VARCHAR(255),
  kt_mnp_select_extra VARCHAR(255),
  kt_mnp_discount VARCHAR(255),
  kt_chg_public_extra VARCHAR(255),
  kt_chg_select_extra VARCHAR(255),
  kt_chg_discount VARCHAR(255),

  lgu_msrp VARCHAR(255),
  lgu_storages VARCHAR(255),
  lgu_plans VARCHAR(255),
  lgu_public_subsidy VARCHAR(255), 
  lgu_new_public_extra VARCHAR(255),
  lgu_new_select_extra VARCHAR(255),
  lgu_new_discount VARCHAR(255),
  lgu_mnp_public_extra VARCHAR(255),
  lgu_mnp_select_extra VARCHAR(255),
  lgu_mnp_discount VARCHAR(255),
  lgu_chg_public_extra VARCHAR(255),
  lgu_chg_select_extra VARCHAR(255),
  lgu_chg_discount VARCHAR(255),

  sort_order INT DEFAULT 0,
  description LONGTEXT,
  colors VARCHAR(255),
  color_codes VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT uq_products_plans_group_id_name UNIQUE (plans_group_id, name)
);

ALTER TABLE products ADD COLUMN img_url VARCHAR(255) AFTER name;

DELIMITER $$

CREATE TRIGGER trg_products_sort_order
BEFORE INSERT ON products
FOR EACH ROW
BEGIN
    IF NEW.sort_order IS NULL OR NEW.sort_order = 0 THEN
        SET NEW.sort_order = (
            SELECT COALESCE(MAX(sort_order), 0) + 1
            FROM products
        );
    END IF;
END$$

DELIMITER ;


// 후기 테이블
CREATE TABLE product_reviews (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  product_id   INT NOT NULL,
  user_id      INT NOT NULL,
  title        VARCHAR(150),
  content      TEXT NOT NULL,
  rating       TINYINT NOT NULL,
  is_hidden    TINYINT(1) DEFAULT 0,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_reviews_product   (product_id),
  INDEX idx_reviews_user      (user_id),
  INDEX idx_reviews_created   (created_at),
  INDEX idx_reviews_visible   (is_hidden, product_id)
);



CREATE TABLE product_qna (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  product_id        INT NULL,
  question_user_id  INT NOT NULL,
  question_content  TEXT NOT NULL,
  question_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  answer_user_id    INT NULL,
  answer_content    TEXT NULL,
  answer_at         DATETIME NULL,
  status ENUM('WAITING','ANSWERED') DEFAULT 'WAITING',
  is_private TINYINT(1) DEFAULT 0,
  INDEX idx_qna_prod_status_created (product_id, status, question_at),
  INDEX idx_qna_question_user (question_user_id, question_at),
  INDEX idx_qna_answer_user (answer_user_id, answer_at)
);


*/