SET NAMES utf8mb4;

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for admin_user
-- ----------------------------
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `user_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
  `real_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '真实姓名',
  `password` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户密码',
  `mobile` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态(0-停用,1-可用)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for app_version
-- ----------------------------
DROP TABLE IF EXISTS `app_version`;
CREATE TABLE `app_version` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `app` tinyint(1) unsigned NOT NULL,
  `type` tinyint(1) NOT NULL,
  `version` varchar(20) NOT NULL,
  `url` varchar(200) NOT NULL,
  `force_update` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `remark` varchar(400) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for car_info
-- ----------------------------
DROP TABLE IF EXISTS `car_info`;
CREATE TABLE `car_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `vin` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商品车VIN码',
  `make_id` int(10) DEFAULT NULL COMMENT '品牌ID',
  `make_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '品牌名称',
  `model_id` int(10) DEFAULT NULL COMMENT '型号ID',
  `model_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '型号名称',
  `pro_date` datetime DEFAULT NULL COMMENT '商品车生产日期',
  `colour` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '颜色',
  `engine_num` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '发动机号',
  `remark` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=238 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for car_make
-- ----------------------------
DROP TABLE IF EXISTS `car_make`;
CREATE TABLE `car_make` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `make_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商品车品牌名称',
  `make_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态(0-停用,1-可用)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for car_model
-- ----------------------------
DROP TABLE IF EXISTS `car_model`;
CREATE TABLE `car_model` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `make_id` int(10) NOT NULL COMMENT '商品车品牌ID',
  `model_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '型号名称',
  `model_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态(0-停用,1-可用)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for car_storage_rel
-- ----------------------------
DROP TABLE IF EXISTS `car_storage_rel`;
CREATE TABLE `car_storage_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `car_id` int(10) NOT NULL COMMENT '商品车ID',
  `storage_id` int(10) NOT NULL COMMENT '仓库ID',
  `storage_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '仓库名称',
  `enter_time` datetime DEFAULT NULL COMMENT '入库时间',
  `plan_out_time` datetime DEFAULT NULL COMMENT '计划出库时间',
  `real_out_time` datetime DEFAULT NULL COMMENT '实际出库时间',
  `rel_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '车辆出入状态(1-入库,2-出库)',
  `active` tinyint(1) NOT NULL DEFAULT '1' COMMENT '默认为1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=304 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for city_info
-- ----------------------------
DROP TABLE IF EXISTS `city_info`;
CREATE TABLE `city_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `city_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '城市名称',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for company_info
-- ----------------------------
DROP TABLE IF EXISTS `company_info`;
CREATE TABLE `company_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `company_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公司名称',
  `operate_type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '所属类型(1-自营,2-承包,3-供方,4-外协)',
  `cooperation_time` datetime DEFAULT NULL,
  `contacts` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tel` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '电话',
  `city_id` int(10) NOT NULL COMMENT '城市ID',
  `remark` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for date_base
-- ----------------------------
DROP TABLE IF EXISTS `date_base`;
CREATE TABLE `date_base` (
  `id` int(4) NOT NULL,
  `day` int(4) NOT NULL,
  `week` int(4) NOT NULL,
  `month` int(4) NOT NULL,
  `year` int(4) NOT NULL,
  `y_month` int(4) NOT NULL,
  `y_week` int(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for drive_info
-- ----------------------------
DROP TABLE IF EXISTS `drive_info`;
CREATE TABLE `drive_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `drive_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '司机姓名',
  `gender` char(1) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1' COMMENT '性别',
  `id_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '身份证号码',
  `tel` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '电话',
  `company_id` int(10) NOT NULL COMMENT '所属公司ID',
  `drive_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '司机状态(0-停用,1-可用)',
  `license_level` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '驾驶证级别',
  `license_date` datetime DEFAULT NULL COMMENT '驾驶证到期日期',
  `drive_image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '司机照片',
  `license_image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '驾驶证照片',
  `remark` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for storage_info
-- ----------------------------
DROP TABLE IF EXISTS `storage_info`;
CREATE TABLE `storage_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `storage_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '仓库名称',
  `row` int(10) NOT NULL COMMENT '排位',
  `col` int(10) NOT NULL COMMENT '道位',
  `storage_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '仓库状态(0-停用,1-可用)',
  `remark` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for storage_parking
-- ----------------------------
DROP TABLE IF EXISTS `storage_parking`;
CREATE TABLE `storage_parking` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `storage_id` int(10) NOT NULL COMMENT '仓库ID',
  `row` int(10) NOT NULL COMMENT '排位',
  `col` int(10) NOT NULL COMMENT '道位',
  `car_id` int(10) NOT NULL DEFAULT '0' COMMENT '商品车ID',
  `rel_id` int(10) NOT NULL DEFAULT '0' COMMENT '道位ID',
  `parking_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '车位状态(0-停用,1-可用)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14588 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for storage_stat_date
-- ----------------------------
DROP TABLE IF EXISTS `storage_stat_date`;
CREATE TABLE `storage_stat_date` (
  `date_id` int(11) NOT NULL,
  `storage_id` int(11) NOT NULL,
  `imports` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '今日入库',
  `exports` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '今日出库',
  `balance` int(11) NOT NULL DEFAULT '0' COMMENT '今日剩余',
  PRIMARY KEY (`date_id`,`storage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for truck_brand
-- ----------------------------
DROP TABLE IF EXISTS `truck_brand`;
CREATE TABLE `truck_brand` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `brand_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '品牌名称',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for truck_info
-- ----------------------------
DROP TABLE IF EXISTS `truck_info`;
CREATE TABLE `truck_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `truck_num` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '车牌号或挂车号',
  `brand_id` int(10) DEFAULT NULL COMMENT '品牌ID',
  `truck_tel` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '随车电话',
  `the_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '车辆识别代码(头车/挂车车架号)',
  `drive_id` int(10) DEFAULT '0' COMMENT '主驾ID',
  `copilot` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '副驾',
  `company_id` int(10) DEFAULT NULL COMMENT '所属公司ID',
  `truck_type` tinyint(1) DEFAULT '1' COMMENT '车辆类型(1-车头,2-挂车)',
  `rel_id` int(10) DEFAULT '0' COMMENT '车辆关联ID(默认为0)',
  `truck_status` tinyint(1) DEFAULT '1' COMMENT '车辆状态(0-停用,1-可用,2-维修)',
  `number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '板车位数',
  `driving_image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '行驶证照片',
  `operation_image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '营运证照片',
  `remark` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `mobile` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
  `real_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '真实姓名',
  `password` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户密码',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '用户类型(1-车管部,2-仓储部,3-调度部,4-国贸部)',
  `gender` char(1) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1' COMMENT '性别',
  `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态(0-停用,1-可用)',
  `last_login_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最后登录时间',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;