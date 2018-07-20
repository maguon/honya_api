/**
 * Created by zwl on 2018/7/20.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ShipTransOrderFeeRelDAO.js');

function addShipTransOrderFeeRel(params,callback){
    var query = " insert into ship_trans_order_fee_rel (ship_trans_order_id,pay_type,pay_money) values ( ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shipTransOrderId;
    paramsArray[i++]=params.payType;
    paramsArray[i]=params.payMoney;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addShipTransOrderFeeRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addShipTransOrderFeeRel : addShipTransOrderFeeRel
}