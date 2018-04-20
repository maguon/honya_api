/**
 * Created by zwl on 2018/4/20.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ShipTransOrderDAO.js');

function addShipTransOrder(params,callback){
    var query = " insert into ship_trans_order (ship_trans_id,order_user_id,remark) values ( ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shipTransId;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addShipTransOrder ');
        return callback(error,rows);
    });
}

function getShipTransOrder(params,callback) {
    var query = " select sto.*,u.real_name as order_user_name,st.start_port_id,st.start_port_name,st.end_port_id,st.end_port_name, " +
        " st.start_ship_date,st.end_ship_date,st.ship_company_id,sc.ship_company_name,st.ship_name,st.container,st.booking,st.tab,st.part_status," +
        " count(stcr.id) as load_car_count,sum(stcr.ship_trans_fee) as ship_trans_fee from ship_trans_order sto " +
        " left join ship_trans_info st on sto.ship_trans_id = st.id " +
        " left join ship_trans_car_rel stcr on st.id = stcr.ship_trans_id " +
        " left join ship_company_info sc on st.ship_company_id = sc.id " +
        " left join user_info u on sto.order_user_id = u.uid " +
        " where sto.id is not null ";
    var paramsArray=[],i=0;
    if(params.shipTransOrderId){
        paramsArray[i++] = params.shipTransOrderId;
        query = query + " and sto.id = ? ";
    }
    if(params.startPortId){
        paramsArray[i++] = params.startPortId;
        query = query + " and st.start_port_id = ? ";
    }
    if(params.endPortId){
        paramsArray[i++] = params.endPortId;
        query = query + " and st.end_port_id = ? ";
    }
    if(params.startShipDateStart){
        paramsArray[i++] = params.startShipDateStart +" 00:00:00";
        query = query + " and  st.start_ship_date  >= ? ";
    }
    if(params.startShipDateEnd){
        paramsArray[i++] = params.startShipDateEnd +" 23:59:59";
        query = query + " and st.start_ship_date  <= ? ";
    }
    if(params.shipCompanyId){
        paramsArray[i++] = params.shipCompanyId;
        query = query + " and st.ship_company_id = ? ";
    }
    if(params.shipName){
        paramsArray[i++] = params.shipName;
        query = query + " and st.ship_name = ? ";
    }
    if(params.endShipDateStart){
        paramsArray[i++] = params.endShipDateStart +" 00:00:00";
        query = query + " and  st.end_ship_date  >= ? ";
    }
    if(params.endShipDateEnd){
        paramsArray[i++] = params.endShipDateEnd +" 23:59:59";
        query = query + " and st.end_ship_date  <= ? ";
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
    if(params.orderStatus){
        paramsArray[i++] = params.orderStatus;
        query = query + " and sto.order_status = ? ";
    }
    query = query + ' group by sto.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getShipTransOrder ');
        return callback(error,rows);
    });
}


module.exports ={
    addShipTransOrder : addShipTransOrder,
    getShipTransOrder : getShipTransOrder
}