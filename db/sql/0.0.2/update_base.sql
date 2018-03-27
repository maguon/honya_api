-- ----------------------------
-- 2018-03-27 更新
-- ----------------------------
ALTER TABLE `app_version`
ADD COLUMN `version_number`  int(4) NULL AFTER `version`,
ADD COLUMN `floor_version_number`  int(4) NULL COMMENT '支持最低版本号' AFTER `version_number`;