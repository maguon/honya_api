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


module.exports ={
    addShipTransCarRel : addShipTransCarRel
}
