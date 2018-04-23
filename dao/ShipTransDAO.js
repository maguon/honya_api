/**
 * Created by zwl on 2018/4/20.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ShipTransDAO.js');

function addShipTrans(params,callback){
    var query = " insert into ship_trans_info (start_port_id,start_port_name,end_port_id,end_port_name,start_ship_date,end_ship_date," +
        " ship_company_id,ship_name,container,booking,tab,part_status,remark) values ( ? , ? , ? , ? , ? , ? ,? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.startPortId;
    paramsArray[i++]=params.startPortName;
    paramsArray[i++]=params.endPortId;
    paramsArray[i++]=params.endPortName;
    paramsArray[i++]=params.startShipDate;
    paramsArray[i++]=params.endShipDate;
    paramsArray[i++]=params.shipCompanyId;
    paramsArray[i++]=params.shipName;
    paramsArray[i++]=params.container;
    paramsArray[i++]=params.booking;
    paramsArray[i++]=params.tab;
    paramsArray[i++]=params.partStatus;
    paramsArray[i++]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addShipTrans ');
        return callback(error,rows);
    });
}

function updateShipTrans(params,callback){
    var query = " update ship_trans_info set start_port_id = ? , start_port_name = ? , end_port_id = ? , end_port_name = ? , start_ship_date = ? , end_ship_date = ? , " +
        "ship_company_id = ? , ship_name = ? , container = ? , booking = ? , tab = ? , part_status = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.startPortId;
    paramsArray[i++]=params.startPortName;
    paramsArray[i++]=params.endPortId;
    paramsArray[i++]=params.endPortName;
    paramsArray[i++]=params.startShipDate;
    paramsArray[i++]=params.endShipDate;
    paramsArray[i++]=params.shipCompanyId;
    paramsArray[i++]=params.shipName;
    paramsArray[i++]=params.container;
    paramsArray[i++]=params.booking;
    paramsArray[i++]=params.tab;
    paramsArray[i++]=params.partStatus;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.shipTransId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateShipTrans ');
        return callback(error,rows);
    });
}


module.exports ={
    addShipTrans : addShipTrans,
    updateShipTrans : updateShipTrans
}