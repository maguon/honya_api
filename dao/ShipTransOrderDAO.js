/**
 * Created by zwl on 2018/4/20.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ShipTransOrderDAO.js');

function addShipTransOrder(params,callback){
    var query = " insert into ship_trans_order (ship_trans_id,car_id,entrust_id) values ( ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shipTransId;
    paramsArray[i++]=params.carId;
    paramsArray[i++]=params.entrustId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addShipTransOrder ');
        return callback(error,rows);
    });
}

function getShipTransOrder(params,callback) {
    var query = " select sto.*,c.vin,c.make_name,c.model_name,c.pro_date,c.colour,c.valuation,e.short_name, " +
        " st.id as ship_trans_id,st.ship_trans_status,st.start_port_id,st.start_port_name,st.end_port_id,st.end_port_name," +
        " st.start_ship_date,st.end_ship_date,st.actual_start_date,st.actual_end_date,st.ship_company_id,sc.ship_company_name,st.ship_name, " +
        " st.container,st.booking,st.tab,st.part_status,st.remark,u.real_name as ship_trans_user_name,st.created_on as ship_trans_created_date " +
        " from ship_trans_order sto " +
        " left join car_info c on sto.car_id = c.id " +
        " left join entrust_info e on sto.entrust_id = e.id " +
        " left join ship_trans_info st on sto.ship_trans_id = st.id " +
        " left join ship_company_info sc on st.ship_company_id = sc.id " +
        " left join user_info u on st.ship_trans_user_id = u.uid " +
        " where sto.id is not null ";
    var paramsArray=[],i=0;
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.vinCode){
        query = query + " and c.vin like '%"+params.vinCode+"%'";
    }
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and c.make_id = ? ";
    }
    if(params.modelId){
        paramsArray[i++] = params.modelId;
        query = query + " and c.model_id = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and sto.entrust_id = ? ";
    }
    if(params.shortName){
        paramsArray[i++] = params.shortName;
        query = query + " and e.short_name = ? ";
    }
    if(params.shipTransOrderId){
        paramsArray[i++] = params.shipTransOrderId;
        query = query + " and sto.id = ? ";
    }
    if(params.orderStatus){
        paramsArray[i++] = params.orderStatus;
        query = query + " and sto.order_status = ? ";
    }
    if(params.shipTransId){
        paramsArray[i++] = params.shipTransId;
        query = query + " and st.id = ? ";
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
    if(params.endShipDateStart){
        paramsArray[i++] = params.endShipDateStart +" 00:00:00";
        query = query + " and  st.end_ship_date  >= ? ";
    }
    if(params.endShipDateEnd){
        paramsArray[i++] = params.endShipDateEnd +" 23:59:59";
        query = query + " and st.end_ship_date  <= ? ";
    }
    if(params.booking){
        paramsArray[i++] = params.booking;
        query = query + " and st.booking = ? ";
    }
    if(params.shipTransStatus){
        paramsArray[i++] = params.shipTransStatus;
        query = query + " and st.ship_trans_status = ? ";
    }
    if(params.actualStartDateStart){
        paramsArray[i++] = params.actualStartDateStart +" 00:00:00";
        query = query + " and  st.actual_start_date  >= ? ";
    }
    if(params.actualStartDateEnd){
        paramsArray[i++] = params.actualStartDateEnd +" 23:59:59";
        query = query + " and st.actual_start_date  <= ? ";
    }
    if(params.actualEndDateStart){
        paramsArray[i++] = params.actualEndDateStart +" 00:00:00";
        query = query + " and  st.actual_end_date  >= ? ";
    }
    if(params.actualEndDateEnd){
        paramsArray[i++] = params.actualEndDateEnd +" 23:59:59";
        query = query + " and st.actual_end_date  <= ? ";
    }
    if(params.invoiceStatus){
        paramsArray[i++] = params.invoiceStatus;
        query = query + " and sto.invoice_status = ? ";
    }
    query = query + ' group by sto.id ';
    query = query + ' order by sto.id desc ';
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

function getShipTransOrderBase(params,callback) {
    var query = " select sto.* from ship_trans_order sto where sto.id is not null ";
    var paramsArray=[],i=0;
    if(params.shipTransOrderId){
        paramsArray[i++] = params.shipTransOrderId;
        query = query + " and sto.id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getShipTransOrderBase ');
        return callback(error,rows);
    });
}

function getInvoiceShipTransOrderList(params,callback) {
    var query = " select sto.*,c.vin,st.booking,stofr.pay_type,stofr.qty,stofr.pay_money,stofr.remark " +
        " from ship_trans_order sto " +
        " left join ship_trans_order_fee_rel stofr on sto.id = stofr.ship_trans_order_id " +
        " left join car_info c on sto.car_id = c.id " +
        " left join ship_trans_info st on sto.ship_trans_id = st.id " +
        " left join invoice_ship_order_rel isor on sto.id = isor.ship_trans_order_id " +
        " where sto.id is not null and stofr.pay_type is not null ";
    var paramsArray=[],i=0;
    if(params.invoiceId){
        paramsArray[i++] = params.invoiceId;
        query = query + " and isor.invoice_id = ? ";
    }
    query = query + ' order by sto.id ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getShipTransOrderList ');
        return callback(error,rows);
    });
}

function updateShipTransOrderFee(params,callback){
    var query = " update ship_trans_order set total_fee = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.totalFee;
    paramsArray[i]=params.shipTransOrderId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateShipTransOrderFee ');
        return callback(error,rows);
    });
}

function updateShipTransOrderFeePlus(params,callback){
    var query = " update ship_trans_order set total_fee = total_fee + ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.payMoney;
    paramsArray[i]=params.shipTransOrderId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateShipTransOrderFeePlus ');
        return callback(error,rows);
    });
}

function updateShipTransOrderFeeReduce(params,callback){
    var query = " update ship_trans_order set total_fee = total_fee - ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.payMoney;
    paramsArray[i]=params.shipTransOrderId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateShipTransOrderFeeReduce ');
        return callback(error,rows);
    });
}

function updateShipTransOrderStatus(params,callback){
    var query = " update ship_trans_order set order_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.orderStatus;
    paramsArray[i]=params.shipTransOrderId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateShipTransOrderStatus ');
        return callback(error,rows);
    });
}

function updateShipTransOrderInvoiceStatus(params,callback){
    var query = " update ship_trans_order set invoice_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.invoiceStatus;
    paramsArray[i]=params.shipTransOrderId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateShipTransOrderInvoiceStatus ');
        return callback(error,rows);
    });
}

function deleteShipTransOrder(params,callback){
    var query = " delete from ship_trans_order where ship_trans_id = ? and car_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shipTransId;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteShipTransOrder ');
        return callback(error,rows);
    });
}

function getShipTransOrderCount(params,callback) {
    var query = " select count(id) as order_count , sum(total_fee) as total_fee from ship_trans_order where id is not null ";
    var paramsArray=[],i=0;
    if(params.orderStatus){
        paramsArray[i++] = params.orderStatus;
        query = query + " and order_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getShipTransOrderCount ');
        return callback(error,rows);
    });
}


module.exports ={
    addShipTransOrder : addShipTransOrder,
    getShipTransOrder : getShipTransOrder,
    getShipTransOrderBase : getShipTransOrderBase,
    getInvoiceShipTransOrderList : getInvoiceShipTransOrderList,
    updateShipTransOrderFee : updateShipTransOrderFee,
    updateShipTransOrderFeePlus : updateShipTransOrderFeePlus,
    updateShipTransOrderFeeReduce : updateShipTransOrderFeeReduce,
    updateShipTransOrderStatus : updateShipTransOrderStatus,
    updateShipTransOrderInvoiceStatus : updateShipTransOrderInvoiceStatus,
    deleteShipTransOrder : deleteShipTransOrder,
    getShipTransOrderCount : getShipTransOrderCount
}