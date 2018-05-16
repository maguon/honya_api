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