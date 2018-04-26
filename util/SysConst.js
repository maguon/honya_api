/**
 * Created by zwl on 2018/4/8.
 */

var USER_TYPE  ={
    admin : 99,  //系统管理员
    storage_op : 21, //仓储部操作员
    storage_admin : 29//仓储部管理员
};
var ORDER_STATUS  ={ //订单状态
    not_payment : 1,  //未支付
    payment : 2, //已支付
};
var PAYMENT_STATUS  ={ //订单支付状态
    payment : 1, //已支付
    completed : 2   //已完结
};
var FEE_MONEY  ={ //仓储计费金额
    five : 5,
};
var SHIP_TRANS_STATUS  ={ //订单支付状态
    no_start : 1, //待出发
    start : 2,   //已出发
    arrive : 3
};

module.exports = {
    USER_TYPE : USER_TYPE,
    ORDER_STATUS : ORDER_STATUS,
    PAYMENT_STATUS : PAYMENT_STATUS,
    FEE_MONEY : FEE_MONEY,
    SHIP_TRANS_STATUS : SHIP_TRANS_STATUS
}
