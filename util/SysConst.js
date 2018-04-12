/**
 * Created by zwl on 2018/4/8.
 */

var USER_TYPE  ={
    admin : 99,  //系统管理员
    storage_op : 21, //仓储部操作员
    storage_admin : 29//仓储部管理员
};
var ORDER_STATUS  ={ //仓储订单状态
    not_payment : 1,  //未支付
    payment : 2, //已支付
};


module.exports = {
    USER_TYPE : USER_TYPE,
    ORDER_STATUS : ORDER_STATUS
}
