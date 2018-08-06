/**
 * Created by zwl on 2018/7/20.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ShipTransOrderFeeRelDAO.js');

function addShipTransOrderFeeRel(params,callback){
    var query = " insert into ship_trans_order_fee_rel (ship_trans_order_id,pay_type,qty,pay_money,remark) values ( ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shipTransOrderId;
    paramsArray[i++]=params.payType;
    paramsArray[i++]=params.qty;
    paramsArray[i++]=params.payMoney;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addShipTransOrderFeeRel ');
        return callback(error,rows);
    });
}

function getShipTransOrderFeeRel(params,callback) {
    var query = " select stofr.*,sto.order_status,sto.total_fee from ship_trans_order_fee_rel stofr " +
        " left join ship_trans_order sto on stofr.ship_trans_order_id = sto.id " +
        " where stofr.id is not null ";
    var paramsArray=[],i=0;
    if(params.shipTransOrderId){
        paramsArray[i++] = params.shipTransOrderId;
        query = query + " and stofr.ship_trans_order_id = ? ";
    }
    if(params.shipTransOrderFeeRelId){
        paramsArray[i++] = params.shipTransOrderFeeRelId;
        query = query + " and stofr.id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getShipTransOrderFeeRel ');
        return callback(error,rows);
    });
}

function updateShipTransOrderFeeRel(params,callback){
    var query = " update ship_trans_order_fee_rel set pay_type = ? , qty = ? , pay_money = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.payType;
    paramsArray[i++]=params.qty;
    paramsArray[i++]=params.payMoney;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.shipTransOrderFeeRelId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateShipTransOrderFeeRel ');
        return callback(error,rows);
    });
}

function deleteShipTransOrderFeeRel(params,callback){
    var query = " delete from ship_trans_order_fee_rel where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i]=params.shipTransOrderFeeRelId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteShipTransOrderFeeRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addShipTransOrderFeeRel : addShipTransOrderFeeRel,
    getShipTransOrderFeeRel: getShipTransOrderFeeRel,
    updateShipTransOrderFeeRel : updateShipTransOrderFeeRel,
    deleteShipTransOrderFeeRel : deleteShipTransOrderFeeRel
}