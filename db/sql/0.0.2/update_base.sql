-- ----------------------------
-- 2018-03-27 更新
-- ----------------------------
ALTER TABLE `app_version`
ADD COLUMN `version_number`  int(4) NULL AFTER `version`,
ADD COLUMN `floor_version_number`  int(4) NULL COMMENT '支持最低版本号' AFTER `version_number`;
-- ----------------------------
-- Table structure for entrust_info
-- ----------------------------
DROP TABLE IF EXISTS `entrust_info`;
CREATE TABLE `entrust_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `short_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '委托方简称',
  `entrust_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '委托方名称',
  `entrust_type` tinyint(1) DEFAULT NULL COMMENT '委托方性质(1-个人,2-企业)',
  `contacts_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '联系人名称',
  `tel` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '联系电话',
  `address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '详细地址',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for car_key
-- ----------------------------
DROP TABLE IF EXISTS `car_key`;
CREATE TABLE `car_key` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '钥匙柜名称',
  `key_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '钥匙柜状态(0-停用,1-可用)',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;