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
  `payment_type` tinyint(1) NOT NULL COMMENT '支付类型(1-电汇,2-支票)',
  `number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '票号',
  `payment_money` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '支付金额',
  `payment_user_id` int(10) NOT NULL DEFAULT '0' COMMENT '操作人',
  `payment_end_date` datetime DEFAULT NULL COMMENT '支付完结时间',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `payment_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '支付状态(1-已支付,2-已完结)',
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
-- 2018-04-20 更新
-- ----------------------------
ALTER TABLE `car_info`
ADD COLUMN `payment_status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '支付状态(1-未支付,2-已支付)' AFTER `remark`;