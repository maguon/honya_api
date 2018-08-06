/**
 * Created by zwl on 2018/4/8.
 */

var USER_TYPE  ={
    admin : 99,  //系统管理员
    storage_op : 21, //仓储部操作员
    storage_admin : 29,//仓储部管理员
    dispatch_op : 31, //调度部操作员
    dispatch_admin : 39, //调度部管理员
    trade_op : 41,          //国贸部操作员
    trade_admin : 49    //国贸部管理员
};
var ORDER_STATUS  ={ //订单状态
    not_payment : 1,  //未支付
    payment : 2 //已支付
};
var PAYMENT_STATUS  ={ //订单支付状态
    payment : 1, //已支付
    completed : 2   //已完结
};
var PAYMENT_TYPE  ={ //支付类型
    cheque : 1, //支票
    remittance : 2   //电汇
};
var FEE_MONEY  ={ //仓储计费金额
    five : 5
};
var SHIP_TRANS_STATUS  ={ //订单支付状态
    no_start : 1, //待出发
    start : 2,   //已出发
    arrive : 3  //到达
};
var COUNTRY_TYPE ={
    usa : 1,    //美国
    china : 2   //中国

};
var RECORD_OP_TYPE  ={
    car_import : 11,    //商品车入库
    car_moving : 12,    //商品车移位
    car_export : 13,    //商品车出库
    car_key_import : 21,    //钥匙存放
    ship_trans_create : 31, //海运创建
    ship_trans_start : 32,  //海运出发
    ship_trans_arrive : 33, //海运到达
    ship_trans_cancel : 34  //海运取消
};
var MORTGAGE_STATUS  ={ //抵押状态
    not_mortgage : 1,  //未抵押
    mortgage : 2 //抵押
};
var LOAN_STATUS  ={ //贷出状态
    not_loan : 1,  //未贷
    loan : 2, //已贷
    repayment : 3,  //还款中
    completed : 4   //完结
};
var LOAN_INTO_STATUS  ={ //贷入状态
    not_loan_into : 1,  //未贷入
    loan_into : 2, //已贷入
    repayment : 3,  //还款中
    completed : 4   //完结
};
var INVOICE_STATUS  ={ //发票状态
    not_grant : 1,  //未开票
    grant : 2 //已开票
};
var PAY_TYPE  ={ //付费项目类别
    fee : 1,  //运费
    Amendment_fee : 2, //Amendment fee
    pier_pass : 3, //pier pass fee
    hmm_miscellaneous_fee : 4,//hmm miscellaneous fee
    OB_EXAM_fee : 5, //O/B EXAM fee
    GATEOUT_FEE : 6, //退柜GATEOUT_FEE
    STORAGE_FEE : 7, //退柜STORAGE_FEE
    CHASSIS_FEE : 8, //退柜CHASSIS_FEE
    RUN_FEE : 9, //退柜RUN_FEE
    UNLOADING_FEE : 10, //退柜UNLOADING_FEE
    COD : 11 //COD
};


module.exports = {
    USER_TYPE : USER_TYPE,
    ORDER_STATUS : ORDER_STATUS,
    PAYMENT_STATUS : PAYMENT_STATUS,
    PAYMENT_TYPE : PAYMENT_TYPE,
    FEE_MONEY : FEE_MONEY,
    SHIP_TRANS_STATUS : SHIP_TRANS_STATUS,
    COUNTRY_TYPE : COUNTRY_TYPE,
    RECORD_OP_TYPE : RECORD_OP_TYPE,
    MORTGAGE_STATUS : MORTGAGE_STATUS,
    LOAN_STATUS : LOAN_STATUS,
    LOAN_INTO_STATUS : LOAN_INTO_STATUS,
    INVOICE_STATUS : INVOICE_STATUS,
    PAY_TYPE : PAY_TYPE
}
