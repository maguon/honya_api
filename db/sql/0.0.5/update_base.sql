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
-- ----------------------------
-- Table structure for ship_trans_order_fee_rel
-- ----------------------------
DROP TABLE IF EXISTS `ship_trans_order_fee_rel`;
CREATE TABLE `ship_trans_order_fee_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ship_trans_order_id` int(10) NOT NULL DEFAULT '0' COMMENT '海运订单ID',
  `pay_type` tinyint(10) NOT NULL DEFAULT '1' COMMENT '付费项目种类',
  `pay_money` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '付费金额',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for loan_into_buy_car_rel
-- ----------------------------
DROP TABLE IF EXISTS `loan_into_buy_car_rel`;
CREATE TABLE `loan_into_buy_car_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `loan_into_id` int(10) NOT NULL DEFAULT '0' COMMENT '贷入ID',
  `car_id` int(10) NOT NULL DEFAULT '0' COMMENT '商品车ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `car_id` (`car_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2018-08-06 更新
-- ----------------------------
ALTER TABLE `ship_trans_order_fee_rel`
ADD COLUMN `qty`  int(10) NULL DEFAULT 0 AFTER `pay_type`,
ADD COLUMN `remark`  varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL AFTER `pay_money`;
-- ----------------------------
-- 2018-08-24 更新
-- ----------------------------
ALTER TABLE `invoice_info`
DROP COLUMN `invoice_num`;
alter table invoice_info AUTO_INCREMENT=1000;
-- ----------------------------
-- 2019-03-28 更新
-- ----------------------------
ALTER TABLE `credit_info`
ADD COLUMN `receive_card_money`  decimal(10,2) NULL DEFAULT 0 COMMENT '接证行金额' AFTER `credit_money`,
ADD COLUMN `express_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '快递费' AFTER `receive_card_money`,
ADD COLUMN `inform_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '通知费' AFTER `express_fee`,
ADD COLUMN `update_inform_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '修改通知费' AFTER `inform_fee`,
ADD COLUMN `proce_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '手续费' AFTER `update_inform_fee`,
ADD COLUMN `leave_shore_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '离岸汇款手续费' AFTER `proce_fee`,
ADD COLUMN `us_receipts_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '美国收款手续费' AFTER `leave_shore_fee`,
ADD COLUMN `us_remit_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '美国汇款手续费' AFTER `us_receipts_fee`,
ADD COLUMN `difference_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '借还款金额差额' AFTER `actual_money`;
-- ----------------------------
-- 2019-04-01 更新
-- ----------------------------
ALTER TABLE `loan_rep_credit_rel`
DROP INDEX `credit_id`;
ALTER TABLE `loan_rep_credit_rel`
ADD UNIQUE INDEX `credit_id` (`repayment_id`, `credit_id`) USING BTREE ;
-- ----------------------------
-- 2019-04-04 更新
-- ----------------------------
ALTER TABLE `loan_info`
ADD COLUMN `contract_num`  varchar(50) NULL COMMENT '合同编号' AFTER `entrust_id`;
-- ----------------------------
-- 2019-04-04 更新
-- ----------------------------
ALTER TABLE `credit_car_rel`
ADD COLUMN `lc_handling_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '手续费' AFTER `car_id`,
ADD COLUMN `bank_services_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '银行服务费' AFTER `lc_handling_fee`;
-- ----------------------------
-- 2019-04-08 更新
-- ----------------------------
ALTER TABLE `credit_car_rel`
ADD COLUMN `repayment_id`  int(10) NULL DEFAULT 0 COMMENT '还款ID' AFTER `bank_services_fee`;
