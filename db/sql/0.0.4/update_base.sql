-- ----------------------------
-- 2018-05-07 更新
-- ----------------------------
ALTER TABLE `car_info`
ADD COLUMN `purchase_type`  tinyint(1) NULL DEFAULT 0 COMMENT '商品车采购类型(1-仓储车,2-金融车)' AFTER `mso_status`;