-- ----------------------------
-- Table structure for invoice_info
-- ----------------------------
DROP TABLE IF EXISTS `invoice_info`;
CREATE TABLE `invoice_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `invoice_num` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '发票编号',
  `invoice_money` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '发票金额',
  `entrust_id` int(10) NOT NULL DEFAULT '0' COMMENT '委托方ID',
  `invoice_user_id` int(10) NOT NULL DEFAULT '0' COMMENT '操作人',
  `date_id` int(4) DEFAULT NULL COMMENT '发放统计时间',
  `grant_date` datetime DEFAULT NULL COMMENT '发放时间',
  `invoice_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态(1-未发,2-已发)',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_num` (`invoice_num`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for invoice_loan_rep_rel
-- ----------------------------
DROP TABLE IF EXISTS `invoice_loan_rep_rel`;
CREATE TABLE `invoice_loan_rep_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `repayment_id` int(10) NOT NULL DEFAULT '0' COMMENT '还款ID',
  `invoice_id` int(10) NOT NULL DEFAULT '0' COMMENT '发票ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `repayment_id` (`repayment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for invoice_ship_order_rel
-- ----------------------------
DROP TABLE IF EXISTS `invoice_ship_order_rel`;
CREATE TABLE `invoice_ship_order_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ship_trans_order_id` int(10) NOT NULL DEFAULT '0' COMMENT '海运订单ID',
  `invoice_id` int(10) NOT NULL DEFAULT '0' COMMENT '订单支付ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `ship_trans_order_id` (`ship_trans_order_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for invoice_storage_order_rel
-- ----------------------------
DROP TABLE IF EXISTS `invoice_storage_order_rel`;
CREATE TABLE `invoice_storage_order_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `storage_order_id` int(10) NOT NULL DEFAULT '0' COMMENT '仓储订单ID',
  `invoice_id` int(10) NOT NULL DEFAULT '0' COMMENT '发票ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `storage_order_id` (`storage_order_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2018-07-18 更新
-- ----------------------------
ALTER TABLE `storage_order`
ADD COLUMN `invoice_status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '发票状态(1-未发放,2-已发放)' AFTER `order_status`;
ALTER TABLE `ship_trans_order`
ADD COLUMN `invoice_status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '发票状态(1-未发放,2-已发放)' AFTER `order_status`;
ALTER TABLE `loan_repayment`
ADD COLUMN `invoice_status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '发票状态(1-未发放,2-已发放)' AFTER `repayment_status`;
-- ----------------------------
-- 2018-07-20 更新
-- ----------------------------
ALTER TABLE `ship_trans_order`
CHANGE COLUMN `ship_trans_fee` `total_fee`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '合计费用' AFTER `entrust_id`;