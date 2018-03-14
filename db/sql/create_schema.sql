CREATE SCHEMA `honya_base` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'honya'@'%' IDENTIFIED BY 'honya_base';

GRANT ALL privileges ON log_base.* TO 'honya'@'%'IDENTIFIED BY 'honya_base';