-- ----------------------------
-- Table structure for port_info
-- ----------------------------
DROP TABLE IF EXISTS `port_info`;
CREATE TABLE `port_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `port_name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '港口名称',
  `country_name` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '国家',
  `address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '详细地址',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;