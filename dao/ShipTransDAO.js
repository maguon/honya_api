/**
 * Created by zwl on 2018/4/20.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ShipTransDAO.js');

function addShipTrans(params,callback){
    var query = " insert into ship_trans_info (start_port_id,start_port_name,end_port_id,end_port_name,start_ship_date,end_ship_date," +
        " ship_company_id,ship_name,container,booking,tab,ship_trans_count,part_status,start_ship_user_id,remark) " +
        " values ( ? , ? , ? , ? , ? , ? ,? , ? , ? , ? , ? , ? , ? , ? , ? )";
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
    paramsArray[i++]=params.shipTransCount;
    paramsArray[i++]=params.partStatus;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addShipTrans ');
        return callback(error,rows);
    });
}

function getShipTrans(params,callback) {
    var query = " select st.*,sc.ship_company_name,u.real_name as start_ship_user_name,sum(sto.ship_trans_fee) as ship_trans_fee " +
        " from ship_trans_info st " +
        " left join ship_trans_order sto on st.id = sto.ship_trans_id " +
        " left join ship_company_info sc on st.ship_company_id = sc.id " +
        " left join user_info u on st.start_ship_user_id = u.uid " +
        " where st.id is not null ";
    var paramsArray=[],i=0;
    if(params.shipTransId){
        paramsArray[i++] = params.shipTransId;
        query = query + " and st.id = ? ";
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
    if(params.shipTransStatus){
        paramsArray[i++] = params.shipTransStatus;
        query = query + " and st.ship_trans_status = ? ";
    }
    query = query + ' group by st.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getShipTrans ');
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
    getShipTrans : getShipTrans,
    addShipTrans : addShipTrans,
    updateShipTrans : updateShipTrans
}