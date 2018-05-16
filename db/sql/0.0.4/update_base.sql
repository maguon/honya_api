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