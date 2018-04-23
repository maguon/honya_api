/**
 * Created by zwl on 2018/4/20.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ShipTransCarRelDAO.js');

function addShipTransCarRel(params,callback){
    var query = " insert into ship_trans_car_rel (ship_trans_id,car_id,ship_trans_fee) values ( ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shipTransId;
    paramsArray[i++]=params.carId;
    paramsArray[i++]=params.shipTransFee;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addShipTransCarRel ');
        return callback(error,rows);
    });
}

function getShipTransCarRel(params,callback) {
    var query = " select stcr.*,c.vin,c.make_name,c.pro_date,c.valuation,c.entrust_id,e.short_name from ship_trans_car_rel stcr " +
        " left join car_info c on stcr.car_id = c.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " where stcr.id is not null ";
    var paramsArray=[],i=0;
    if(params.shipTransId){
        paramsArray[i++] = params.shipTransId;
        query = query + " and stcr.ship_trans_id = ? ";
    }
    query = query + ' order by stcr.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getShipTransCarRel ');
        return callback(error,rows);
    });
}

function deleteShipTransCarRel(params,callback){
    var query = " delete from ship_trans_car_rel where ship_trans_id = ? and car_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shipTransId;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteShipTransCarRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addShipTransCarRel : addShipTransCarRel,
    getShipTransCarRel : getShipTransCarRel,
    deleteShipTransCarRel : deleteShipTransCarRel
}
