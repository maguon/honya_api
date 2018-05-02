-- ----------------------------
-- Table structure for port_info
-- ----------------------------
DROP TABLE IF EXISTS `port_info`;
CREATE TABLE `port_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `port_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '港口名称',
  `country_id` int(10) DEFAULT NULL COMMENT '国家ID',
  `address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '详细地址',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for ship_company_info
-- ----------------------------
DROP TABLE IF EXISTS `ship_company_info`;
CREATE TABLE `ship_company_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ship_company_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '船务公司名称',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for country_info
-- ----------------------------
DROP TABLE IF EXISTS `country_info`;
CREATE TABLE `country_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `country_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '国家ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for storage_order
-- ----------------------------
DROP TABLE IF EXISTS `storage_order`;
CREATE TABLE `storage_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `car_storage_rel_id` int(10) NOT NULL DEFAULT '0' COMMENT '出入库ID',
  `car_id` int(10) NOT NULL DEFAULT '0' COMMENT '商品车ID',
  `day_count` int(10) DEFAULT '0' COMMENT '天数',
  `hour_count` int(10) DEFAULT '0' COMMENT '小时数',
  `plan_fee` decimal(10,2) DEFAULT '0.00' COMMENT '计划支付费用',
  `actual_fee` decimal(10,2) DEFAULT '0.00' COMMENT '实际支付费用',
  `order_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '订单状态(1-未支付,2-已支付)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for order_payment
-- ----------------------------
DROP TABLE IF EXISTS `order_payment`;
CREATE TABLE `order_payment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entrust_id` int(10) NOT NULL DEFAULT '0' COMMENT '委托方ID',
  `payment_type` tinyint(1) NOT NULL COMMENT '支付类型(1-支票,2-电汇)',
  `number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '票号',
  `payment_money` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '支付金额',
  `payment_user_id` int(10) NOT NULL DEFAULT '0' COMMENT '操作人',
  `payment_end_date` datetime DEFAULT NULL COMMENT '支付完结时间',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `payment_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '支付状态(1-未完结,2-已完结)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for order_payment_rel
-- ----------------------------
DROP TABLE IF EXISTS `order_payment_rel`;
CREATE TABLE `order_payment_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `storage_order_id` int(10) NOT NULL COMMENT '仓储订单ID',
  `order_payment_id` int(10) NOT NULL COMMENT '仓储订单支付ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `storage_order_id` (`storage_order_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for ship_trans_car_rel
-- ----------------------------
DROP TABLE IF EXISTS `ship_trans_car_rel`;
CREATE TABLE `ship_trans_car_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ship_trans_id` int(10) NOT NULL DEFAULT '0' COMMENT '海运ID',
  `car_id` int(10) NOT NULL DEFAULT '0' COMMENT '商品车ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `car_id` (`car_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for ship_trans_info
-- ----------------------------
DROP TABLE IF EXISTS `ship_trans_info`;
CREATE TABLE `ship_trans_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_port_id` int(10) NOT NULL COMMENT '始发港口ID',
  `start_port_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '始发港口名称',
  `end_port_id` int(10) NOT NULL COMMENT '目的港口ID',
  `end_port_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '目的港口名称',
  `start_ship_date` datetime DEFAULT NULL COMMENT '开船日期',
  `end_ship_date` datetime DEFAULT NULL COMMENT '开船日期',
  `ship_company_id` int(10) NOT NULL COMMENT '船公司ID',
  `ship_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '船名',
  `container` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '货柜',
  `booking` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '预订',
  `tab` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '封签',
  `ship_trans_count` int(11) DEFAULT '0' COMMENT '海运数',
  `part_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否分单(1-否,2-是)',
  `ship_trans_user_id` int(10) NOT NULL DEFAULT '0' COMMENT '操作员',
  `ship_trans_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '海运状态(1-待出发,2-已出发,3-已到达)',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `start_date_id` int(4) DEFAULT NULL COMMENT '出发统计时间',
  `end_date_id` int(4) DEFAULT NULL COMMENT '到达统计时间',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for ship_trans_order
-- ----------------------------
DROP TABLE IF EXISTS `ship_trans_order`;
CREATE TABLE `ship_trans_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ship_trans_id` int(10) NOT NULL DEFAULT '0' COMMENT '海运ID',
  `car_id` int(10) NOT NULL DEFAULT '0' COMMENT '商品车ID',
  `entrust_id` int(10) NOT NULL DEFAULT '0' COMMENT '委托方ID',
  `ship_trans_fee` decimal(10,2) DEFAULT '0.00' COMMENT '海运费用',
  `order_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '订单状态(1-未支付,2-已支付)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `car_id` (`car_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for ship_trans_stat_date
-- ----------------------------
DROP TABLE IF EXISTS `ship_trans_stat_date`;
CREATE TABLE `ship_trans_stat_date` (
  `date_id` int(11) NOT NULL,
  `booking` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '今日订舱数',
  `exports` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '今日发出数',
  `arrive` int(11) NOT NULL DEFAULT '0' COMMENT '今日到达数',
  PRIMARY KEY (`date_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- ----------------------------
-- 2018-04-25 更新
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_ship_trans_stat_update`;
DELIMITER ;;
CREATE TRIGGER `trg_ship_trans_stat` AFTER UPDATE ON `ship_trans_info` FOR EACH ROW BEGIN
IF (old.ship_trans_status <>2 and new.ship_trans_status=2)THEN
update ship_trans_stat_date set exports=(select sum(ship_trans_count)from ship_trans_info where ship_trans_status = 2)
where date_id=DATE_FORMAT(CURRENT_DATE(),'%Y%m%d');
END IF;
IF (old.ship_trans_status <>3 and new.ship_trans_status=3)THEN
update ship_trans_stat_date set arrive=(select sum(ship_trans_count)from ship_trans_info where ship_trans_status = 3)
where date_id=DATE_FORMAT(CURRENT_DATE(),'%Y%m%d');
END IF;
END
;;
DELIMITER ;

DROP TRIGGER IF EXISTS `trg_ship_trans_stat_new`;
DELIMITER ;;
CREATE TRIGGER `trg_ship_trans_stat` AFTER INSERT ON `ship_trans_info` FOR EACH ROW BEGIN
update ship_trans_stat_date set booking=booking+1
where date_id=DATE_FORMAT(CURRENT_DATE(),'%Y%m%d');
END
;;
DELIMITER ;
-- ----------------------------
-- 2018-04-25 更新
-- ----------------------------
ALTER TABLE `storage_order`
MODIFY COLUMN `storage_order_user_id`  int(10) NOT NULL DEFAULT 0 COMMENT '订单操作员' AFTER `order_status`;
-- ----------------------------
-- Table structure for ship_trans_order_payment_rel
-- ----------------------------
DROP TABLE IF EXISTS `ship_trans_order_payment_rel`;
CREATE TABLE `ship_trans_order_payment_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ship_trans_order_id` int(10) NOT NULL DEFAULT '0' COMMENT '海运订单ID',
  `order_payment_id` int(10) NOT NULL DEFAULT '0' COMMENT '订单支付ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `ship_trans_order_id` (`ship_trans_order_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2018-04-28 更新
-- ----------------------------
ALTER TABLE `order_payment`
ADD COLUMN `date_id`  int(4) NULL DEFAULT NULL COMMENT '支付完结统计时间' AFTER `payment_user_id`;