/**
 * Created by zwl on 2018/4/20.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ShipTransCarRelDAO.js');

function addShipTransCarRel(params,callback){
    var query = " insert into ship_trans_car_rel (ship_trans_id,car_id) values ( ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shipTransId;
    paramsArray[i++]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addShipTransCarRel ');
        return callback(error,rows);
    });
}

function getShipTransCarRel(params,callback) {
    var query = " select c.vin,c.make_name,c.model_name,c.pro_date,c.valuation,c.purchase_type, " +
        " st.start_port_id,st.start_port_name,st.end_port_id,st.end_port_name,st.start_ship_date,st.end_ship_date, " +
        " st.actual_start_date,st.actual_end_date,sc.ship_company_name, " +
        " st.ship_name,st.container,st.booking,st.tab,st.ship_trans_user_id,u.real_name as ship_trans_user_name,st.part_status,st.remark, " +
        " sto.id as ship_trans_order_id,sto.ship_trans_id,sto.car_id,sto.entrust_id,e.short_name,sto.ship_trans_fee,sto.order_status " +
        " from ship_trans_order sto " +
        " left join car_info c on sto.car_id = c.id " +
        " left join entrust_info e on sto.entrust_id = e.id " +
        " left join ship_trans_info st on sto.ship_trans_id = st.id " +
        " left join ship_company_info sc on st.ship_company_id = sc.id" +
        " left join user_info u on st.ship_trans_user_id = u.uid " +
        " where sto.id is not null ";
    var paramsArray=[],i=0;
    if(params.shipTransId){
        paramsArray[i++] = params.shipTransId;
        query = query + " and sto.ship_trans_id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.vinCode){
        query = query + " and c.vin like '%"+params.vinCode+"%'";
    }
    if(params.startPortId){
        paramsArray[i++] = params.startPortId;
        query = query + " and st.start_port_id = ? ";
    }
    if(params.endPortId){
        paramsArray[i++] = params.endPortId;
        query = query + " and st.end_port_id = ? ";
    }
    if(params.orderStatus){
        paramsArray[i++] = params.orderStatus;
        query = query + " and sto.order_status = ? ";
    }
    if(params.startShipDateStart){
        paramsArray[i++] = params.startShipDateStart +" 00:00:00";
        query = query + " and  st.start_ship_date  >= ? ";
    }
    if(params.startShipDateEnd){
        paramsArray[i++] = params.startShipDateEnd +" 23:59:59";
        query = query + " and st.start_ship_date  <= ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and c.entrust_id = ? ";
    }
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and c.make_id = ? ";
    }
    if(params.modelId){
        paramsArray[i++] = params.modelId;
        query = query + " and c.model_id = ? ";
    }
    if(params.endShipDateStart){
        paramsArray[i++] = params.endShipDateStart +" 00:00:00";
        query = query + " and  st.end_ship_date  >= ? ";
    }
    if(params.endShipDateEnd){
        paramsArray[i++] = params.endShipDateEnd +" 23:59:59";
        query = query + " and st.end_ship_date  <= ? ";
    }
    if(params.shipCompanyId){
        paramsArray[i++] = params.shipCompanyId;
        query = query + " and st.ship_company_id = ? ";
    }
    if(params.shipName){
        paramsArray[i++] = params.shipName;
        query = query + " and st.ship_name = ? ";
    }
    if(params.container){
        paramsArray[i++] = params.container;
        query = query + " and st.container = ? ";
    }
    if(params.booking){
        paramsArray[i++] = params.booking;
        query = query + " and st.booking = ? ";
    }
    if(params.tab){
        paramsArray[i++] = params.tab;
        query = query + " and st.tab = ? ";
    }
    if(params.carId){
        paramsArray[i++] = params.carId;
        query = query + " and sto.car_id = ? ";
    }
    query = query + ' group by sto.id ';
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
