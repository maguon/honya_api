-- ----------------------------
-- 2018-05-07 更新
-- ----------------------------
ALTER TABLE `car_info`
ADD COLUMN `purchase_type`  tinyint(1) NULL DEFAULT 0 COMMENT '商品车采购类型(0-仓储车,1-金融车)' AFTER `mso_status`;
-- ----------------------------
-- 2018-05-16 更新
-- ----------------------------
ALTER TABLE `entrust_info`
ADD COLUMN `email`  varchar(50) NULL DEFAULT NULL COMMENT '邮箱' AFTER `tel`;

ALTER TABLE `ship_trans_info`
ADD COLUMN `actual_start_date`  datetime NULL DEFAULT NULL COMMENT '实际开船日期' AFTER `start_date_id`,
ADD COLUMN `actual_end_date`  datetime NULL DEFAULT NULL COMMENT '实际到港日期' AFTER `end_date_id`;
-- ----------------------------
-- 2018-05-21 更新
-- ----------------------------
ALTER TABLE `car_storage_rel`
ADD COLUMN `mortgage_status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '抵押状态(1-未抵押,2-抵押)' AFTER `rel_status`;
-- ----------------------------
-- Table structure for credit_car_rel
-- ----------------------------
DROP TABLE IF EXISTS `credit_car_rel`;
CREATE TABLE `credit_car_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `credit_id` int(10) NOT NULL DEFAULT '0' COMMENT '信用证ID',
  `car_id` int(10) NOT NULL DEFAULT '0' COMMENT '商品车ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `car_id` (`car_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for credit_info
-- ----------------------------
DROP TABLE IF EXISTS `credit_info`;
CREATE TABLE `credit_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `credit_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '信用证编号',
  `entrust_id` int(10) DEFAULT '0' COMMENT '委托方ID',
  `credit_money` decimal(10,2) DEFAULT '0.00' COMMENT '信用证金额',
  `actual_money` decimal(10,2) DEFAULT '0.00' COMMENT '实际到款金额',
  `plan_return_date` date DEFAULT NULL COMMENT '预计回款日期',
  `actual_return_date` date DEFAULT NULL COMMENT '实际回款日期',
  `receive_card_date` date DEFAULT NULL COMMENT '接证日期',
  `documents_date` date DEFAULT NULL COMMENT '交单日期',
  `documents_send_date` date DEFAULT NULL COMMENT '文件发出日期',
  `documents_receive_date` date DEFAULT NULL COMMENT '开户行文件接收日期',
  `actual_remit_date` date DEFAULT NULL COMMENT '实际汇款日期',
  `invoice_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '发票号码',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `credit_end_date` datetime DEFAULT NULL COMMENT '信用证完结时间',
  `credit_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '信用证状态(1-未完结,2-已完结)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for loan_buy_car_rel
-- ----------------------------
DROP TABLE IF EXISTS `loan_buy_car_rel`;
CREATE TABLE `loan_buy_car_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `loan_id` int(10) NOT NULL DEFAULT '0' COMMENT '贷款ID',
  `car_id` int(10) NOT NULL DEFAULT '0' COMMENT '商品车ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `car_id` (`car_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for loan_info
-- ----------------------------
DROP TABLE IF EXISTS `loan_info`;
CREATE TABLE `loan_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entrust_id` int(10) DEFAULT '0' COMMENT '委托方ID',
  `deposit` decimal(10,2) DEFAULT '0.00' COMMENT '定金',
  `loan_money` decimal(10,2) DEFAULT '0.00' COMMENT '贷款金额',
  `not_repayment_money` decimal(10,2) DEFAULT '0.00' COMMENT '未还金额',
  `mortgage_car_count` int(10) DEFAULT '0' COMMENT '抵押车数量',
  `buy_car_count` int(10) DEFAULT '0' COMMENT '购买车数量',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `last_repayment_date` date DEFAULT NULL COMMENT '最后还款时间',
  `start_date_id` int(4) DEFAULT NULL COMMENT '贷款起始统计时间',
  `loan_start_date` datetime DEFAULT NULL COMMENT '贷款起始时间',
  `end_date_id` int(4) DEFAULT NULL COMMENT '贷款完结统计时间',
  `loan_end_date` datetime DEFAULT NULL COMMENT '贷款完结时间',
  `loan_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '贷款状态(1-未贷,2-已贷,3-还款中,4-已完结)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for loan_mortgage_car_rel
-- ----------------------------
DROP TABLE IF EXISTS `loan_mortgage_car_rel`;
CREATE TABLE `loan_mortgage_car_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `loan_id` int(10) NOT NULL DEFAULT '0' COMMENT '贷款ID',
  `car_id` int(10) NOT NULL DEFAULT '0' COMMENT '商品车ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `car_id` (`car_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for loan_rep_credit_rel
-- ----------------------------
DROP TABLE IF EXISTS `loan_rep_credit_rel`;
CREATE TABLE `loan_rep_credit_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `repayment_id` int(10) NOT NULL DEFAULT '0' COMMENT '还款ID',
  `credit_id` int(10) NOT NULL DEFAULT '0' COMMENT '信用证ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `credit_id` (`credit_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for payment_loan_rep_rel
-- ----------------------------
DROP TABLE IF EXISTS `payment_loan_rep_rel`;
CREATE TABLE `payment_loan_rep_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `repayment_id` int(10) NOT NULL DEFAULT '0' COMMENT '还款ID',
  `payment_id` int(10) NOT NULL DEFAULT '0' COMMENT '其他支付ID',
  `this_payment_money` decimal(10,2) DEFAULT '0.00' COMMENT '本次支付金额',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`repayment_id`,`payment_id`),
  UNIQUE KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for loan_repayment
-- ----------------------------
DROP TABLE IF EXISTS `loan_repayment`;
CREATE TABLE `loan_repayment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `loan_id` int(10) NOT NULL DEFAULT '0' COMMENT '贷款ID',
  `repayment_money` decimal(10,2) DEFAULT '0.00' COMMENT '还款金额',
  `rate` decimal(10,4) DEFAULT '0.0000' COMMENT '利率',
  `create_interest_money` decimal(10,2) DEFAULT '0.00' COMMENT '产生利息金额',
  `day_count` int(10) DEFAULT '0' COMMENT '产生利息天数',
  `interest_money` decimal(10,2) DEFAULT '0.00' COMMENT '利息金额',
  `fee` decimal(10,2) DEFAULT '0.00' COMMENT '手续费',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `repayment_end_date` datetime DEFAULT NULL COMMENT '还款完结时间',
  `repayment_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '还款状态(1-未完结,2-已完结)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2018-05-28 更新
-- ----------------------------
rename table order_payment to payment_info;
rename table order_payment_rel to payment_storage_order_rel;
rename table ship_trans_order_payment_rel to payment_ship_order_rel;

ALTER TABLE `payment_ship_order_rel`
CHANGE COLUMN `order_payment_id` `payment_id`  int(10) NOT NULL DEFAULT 0 COMMENT '订单支付ID' AFTER `ship_trans_order_id`;
ALTER TABLE `payment_storage_order_rel`
CHANGE COLUMN `order_payment_id` `payment_id`  int(10) NOT NULL DEFAULT 0 COMMENT '订单支付ID' AFTER `storage_order_id`;
-- ----------------------------
-- 2018-06-01 更新
-- ----------------------------
ALTER TABLE `car_info`
ADD COLUMN `pro_date_id`  int(4) NULL DEFAULT NULL COMMENT '商品车生产日期' AFTER `pro_date`;
update car_info set pro_date_id = DATE_FORMAT(pro_date,'%Y');
alter table car_info drop column pro_date;
ALTER TABLE `car_info`
CHANGE COLUMN `pro_date_id` `pro_date`  int(4) NULL DEFAULT NULL COMMENT '商品车生产日期' AFTER `model_name`;
-- ----------------------------
-- Table structure for loan_company_info
-- ----------------------------
DROP TABLE IF EXISTS `loan_company_info`;
CREATE TABLE `loan_company_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公司名称',
  `base_money` decimal(10,2) DEFAULT '0.00' COMMENT '基础金额',
  `contacts` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '联系人',
  `tel` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '电话',
  `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `company_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '贷入公司状态(0-不可用,1-可用)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2018-06-11 更新
-- ----------------------------
ALTER TABLE `ship_trans_car_rel`
ADD PRIMARY KEY (`ship_trans_id`, `car_id`),
DROP INDEX `car_id`;
ALTER TABLE `ship_trans_order`
ADD PRIMARY KEY (`ship_trans_id`, `car_id`),
DROP INDEX `car_id`;
-- ----------------------------
-- 2018-06-14 更新
-- ----------------------------
ALTER TABLE `loan_repayment`
MODIFY COLUMN `rate`  decimal(10,6) NULL DEFAULT 0.000000 COMMENT '利率' AFTER `repayment_money`;
-- ----------------------------
-- 2018-07-02 更新
-- ----------------------------
alter table loan_company_info rename loan_into_company_info;
-- ----------------------------
-- Table structure for loan_into_info
-- ----------------------------
DROP TABLE IF EXISTS `loan_into_info`;
CREATE TABLE `loan_into_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `loan_into_company_id` int(10) NOT NULL COMMENT '贷入公司ID',
  `loan_into_money` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '贷入金额',
  `not_repayment_money` decimal(10,2) DEFAULT '0.00' COMMENT '未还金额',
  `start_date_id` int(4) DEFAULT NULL COMMENT '贷入起始统计时间',
  `loan_into_start_date` datetime DEFAULT NULL COMMENT '贷入起始时间',
  `end_date_id` int(4) DEFAULT NULL COMMENT '贷入完结统计时间',
  `loan_into_end_date` datetime DEFAULT NULL COMMENT '贷入完结时间',
  `last_repayment_date` date DEFAULT NULL COMMENT '最后还款时间',
  `loan_into_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '贷入状态(1-未贷入,2-已贷入,3-还款中,4-已完结)',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for loan_into_repayment
-- ----------------------------
DROP TABLE IF EXISTS `loan_into_repayment`;
CREATE TABLE `loan_into_repayment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `loan_into_id` int(10) NOT NULL DEFAULT '0' COMMENT '贷入ID',
  `repayment_money` decimal(10,2) DEFAULT '0.00' COMMENT '还款金额',
  `rate` decimal(10,6) DEFAULT '0.000000' COMMENT '利率',
  `day_count` int(10) DEFAULT '0' COMMENT '产生利息天数',
  `interest_money` decimal(10,2) DEFAULT '0.00' COMMENT '利息金额',
  `fee` decimal(10,2) DEFAULT '0.00' COMMENT '手续费',
  `repayment_total_money` decimal(10,2) DEFAULT '0.00' COMMENT '还款总金额',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `repayment_end_date` datetime DEFAULT NULL COMMENT '还款完结时间',
  `repayment_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '还款状态(1-未完结,2-已完结)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for loan_into_stat_date
-- ----------------------------
DROP TABLE IF EXISTS `loan_into_stat_date`;
CREATE TABLE `loan_into_stat_date` (
  `date_id` int(11) NOT NULL,
  `loan_into_count` int(11) NOT NULL DEFAULT '0' COMMENT '贷入数',
  `loan_into_money` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '贷入金额',
  `repayment_count` int(11) NOT NULL DEFAULT '0' COMMENT '还款数',
  `repayment_money` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '还款金额',
  PRIMARY KEY (`date_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2018-07-05 更新
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_loan_into_stat_update`;
DELIMITER ;;
CREATE TRIGGER `trg_loan_into_stat_update` AFTER UPDATE ON `loan_into_info` FOR EACH ROW BEGIN
IF (old.loan_into_status <>2 and new.loan_into_status=2)THEN
update loan_into_stat_date set loan_into_count = loan_into_count+1,loan_into_money= loan_into_money +(select loan_into_money from loan_into_info where loan_into_status = 2 and id=new.id)
where date_id=DATE_FORMAT(CURRENT_DATE(),'%Y%m%d');
END IF;
END
;;
DELIMITER ;
-- ----------------------------
-- Table structure for loan_stat_date
-- ----------------------------
DROP TABLE IF EXISTS `loan_stat_date`;
CREATE TABLE `loan_stat_date` (
  `date_id` int(11) NOT NULL,
  `loan_count` int(11) NOT NULL DEFAULT '0' COMMENT '贷出数',
  `loan_money` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '贷出金额',
  `repayment_count` int(11) NOT NULL DEFAULT '0' COMMENT '还款数',
  `repayment_money` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '还款金额',
  PRIMARY KEY (`date_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2018-07-05 更新
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_loan_stat_update`;
DELIMITER ;;
CREATE TRIGGER `trg_loan_stat_update` AFTER UPDATE ON `loan_info` FOR EACH ROW BEGIN
IF (old.loan_status <>2 and new.loan_status=2)THEN
update loan_stat_date set loan_count = loan_count+1,loan_money= loan_money +(select loan_money from loan_info where loan_status = 2 and id=new.id)
where date_id=DATE_FORMAT(CURRENT_DATE(),'%Y%m%d');
END IF;
END
;;
DELIMITER ;
-- ----------------------------
-- 2018-07-10 更新
-- ----------------------------
DROP TRIGGER IF EXISTS `loan_repayment_update`;
DELIMITER ;;
CREATE TRIGGER `loan_repayment_update` AFTER UPDATE ON `loan_repayment` FOR EACH ROW BEGIN
IF (old.repayment_money <>new.repayment_money)THEN
update loan_info set last_repayment_date = CURRENT_DATE(),not_repayment_money = not_repayment_money -(new.repayment_money-old.repayment_money) where id=new.loan_id;
END IF;
IF (old.repayment_status <>2 and new.repayment_status=2)THEN
update loan_stat_date set repayment_count = repayment_count+1,repayment_money= repayment_money +(select repayment_money from loan_repayment where repayment_status = 2 and id=new.id)
where date_id=DATE_FORMAT(CURRENT_DATE(),'%Y%m%d');
END IF;
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `loan_repayment_new`;
DELIMITER ;;
CREATE TRIGGER `loan_repayment_new` AFTER INSERT ON `loan_repayment` FOR EACH ROW BEGIN
update loan_info set last_repayment_date = CURRENT_DATE(),not_repayment_money= not_repayment_money - new.repayment_money where id=new.loan_id;
END
;;
DELIMITER ;
-- ----------------------------
-- 2018-07-10 更新
-- ----------------------------
DROP TRIGGER IF EXISTS `loan_into_repayment_update`;
DELIMITER ;;
CREATE TRIGGER `loan_into_repayment_update` AFTER UPDATE ON `loan_into_repayment` FOR EACH ROW BEGIN
IF (old.repayment_money <>new.repayment_money)THEN
update loan_into_info set last_repayment_date = CURRENT_DATE(),not_repayment_money = not_repayment_money -(new.repayment_money-old.repayment_money) where id=new.loan_into_id;
END IF;
IF (old.repayment_status <>2 and new.repayment_status=2)THEN
update loan_into_stat_date set repayment_count = repayment_count+1,repayment_money= repayment_money +(select repayment_money from loan_into_repayment where repayment_status = 2 and id=new.id)
where date_id=DATE_FORMAT(CURRENT_DATE(),'%Y%m%d');
END IF;
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `loan_into_repayment_new`;
DELIMITER ;;
CREATE TRIGGER `loan_into_repayment_new` AFTER INSERT ON `loan_into_repayment` FOR EACH ROW BEGIN
update loan_into_info set last_repayment_date = CURRENT_DATE(),not_repayment_money= not_repayment_money - new.repayment_money where id=new.loan_into_id;
END
;;
DELIMITER ;
