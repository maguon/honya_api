/**
 * Created by zwl on 2017/4/13.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarDAO.js');

function addCar(params,callback){
    var query = " insert into car_info (vin,make_id,make_name,model_id,model_name,pro_date,colour,engine_num," +
        "entrust_id,valuation,mso_status,purchase_type,remark,created_date_id) values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.makeName;
    paramsArray[i++]=params.modelId;
    paramsArray[i++]=params.modelName;
    paramsArray[i++]=params.proDate;
    paramsArray[i++]=params.colour;
    paramsArray[i++]=params.engineNum;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.valuation;
    paramsArray[i++]=params.msoStatus;
    paramsArray[i++]=params.purchaseType;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.createdDateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCar ');
        return callback(error,rows);
    });
}

function getCar(params,callback) {
    var query = " select c.*,e.short_name,e.entrust_name,e.entrust_type," +
        " p.id as p_id,p.storage_id,p.area_id,sa.area_name,p.row,p.col,p.lot,p.parking_status, " +
        " r.id as r_id,r.storage_name,r.enter_time,r.plan_out_time,r.real_out_time,r.rel_status,r.mortgage_status, " +
        " ckp.id as car_key_position_id,ckc.key_cabinet_name,ckca.area_name as car_key_cabinet_area, " +
        " ckp.row as car_key_position_row,ckp.col as car_key_position_col, " +
        " st.id as ship_trans_id,st.start_port_name,st.end_port_name,st.start_ship_date,st.end_ship_date, " +
        " sc.ship_company_name,st.ship_name,st.container,st.booking,st.tab,st.ship_trans_status,st.remark as ship_trans_remark " +
        " from car_info c left join storage_parking p on c.id = p.car_id " +
        " left join car_storage_rel r on c.id = r.car_id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join car_key_position ckp on c.id = ckp.car_id " +
        " left join car_key_cabinet_info ckc on ckp.car_key_cabinet_id = ckc.id " +
        " left join car_key_cabinet_area ckca on ckp.car_key_cabinet_area_id = ckca.id " +
        " left join storage_area sa on p.area_id = sa.id " +
        " left join ship_trans_car_rel stcr on c.id = stcr.car_id " +
        " left join ship_trans_info st on stcr.ship_trans_id = st.id " +
        " left join ship_company_info sc on st.ship_company_id = sc.id " +
        " where c.id is not null ";
    var paramsArray=[],i=0;
    if(params.carId){
        paramsArray[i++] = params.carId;
        query = query + " and c.id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
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
        query = query + " and c.entrust_id = ? ";
    }
    if(params.msoStatus){
        paramsArray[i++] = params.msoStatus;
        query = query + " and c.mso_status = ? ";
    }
    if(params.enterStart){
        paramsArray[i++] = params.enterStart +" 00:00:00";
        query = query + " and  r.enter_time  >= ? ";
    }
    if(params.enterEnd){
        paramsArray[i++] = params.enterEnd +" 23:59:59";
        query = query + " and r.enter_time  <= ? ";
    }
    if(params.planStart){
        paramsArray[i++] = params.planStart;
        query = query + " and r.plan_out_time >= ? ";
    }
    if(params.planEnd){
        paramsArray[i++] = params.planEnd;
        query = query + " and r.plan_out_time <= ? ";
    }
    if(params.realStart){
        paramsArray[i++] = params.realStart +" 00:00:00";
        query = query + " and r.real_out_time >= ? ";
    }
    if(params.realEnd){
        paramsArray[i++] = params.realEnd +" 23:59:59";
        query = query + " and r.real_out_time <= ? ";
    }
    if(params.relStatus){
        paramsArray[i++] = params.relStatus;
        query = query + " and r.rel_status = ? ";
    }
    if(params.active){
        paramsArray[i++] = params.active;
        query = query + " and r.active = ? ";
    }
    if(params.storageId){
        paramsArray[i++] = params.storageId;
        query = query + " and p.storage_id = ? ";
    }
    if(params.vinCode){
        query = query + " and c.vin like '%"+params.vinCode+"%'";
    }
    if(params.shipTransStatus){
        paramsArray[i++] = params.shipTransStatus;
        query = query + " and st.ship_trans_status = ? ";
    }
    if(params.shipCompanyId){
        paramsArray[i++] = params.shipCompanyId;
        query = query + " and st.ship_company_id = ? ";
    }
    if(params.container){
        paramsArray[i++] = params.container;
        query = query + " and st.container = ? ";
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
    query = query + '  order by c.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCar ');
        return callback(error,rows);
    });
}

function getCarBase(params,callback) {
    var query = " select c.*,e.short_name,e.entrust_name,e.entrust_type, " +
        " p.id as p_id,p.storage_id,p.area_id,p.row,p.col,p.lot,p.parking_status, " +
        " r.id as r_id,r.storage_name,r.enter_time,r.plan_out_time,r.real_out_time,r.rel_status, " +
        " ckp.id as car_key_position_id " +
        " from car_info c left join storage_parking p on c.id = p.car_id " +
        " left join car_storage_rel r on c.id = r.car_id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join car_key_position ckp on c.id = ckp.car_id where c.id is not null ";
    var paramsArray=[],i=0;
    if(params.carId){
        paramsArray[i++] = params.carId;
        query = query + " and c.id = ? ";
    }
    if(params.vin){
        paramsArray[i] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.active){
        paramsArray[i++] = params.active;
        query = query + " and r.active = ? ";
    }
    query = query + '  order by r.id desc ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarBase ');
        return callback(error,rows);
    });
}

function getCarList(params,callback) {
    var query = " select c.*,e.short_name,e.entrust_type from car_info c " +
        " left join entrust_info e on c.entrust_id = e.id where c.id is not null ";
    var paramsArray=[],i=0;
    if(params.carId){
        paramsArray[i++] = params.carId;
        query = query + " and c.id = ? ";
    }
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
        query = query + " and c.entrust_id = ? ";
    }
    if(params.purchaseType){
        paramsArray[i++] = params.purchaseType;
        query = query + " and c.purchase_type = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and  c.created_on  >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and c.created_on  <= ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarList ');
        return callback(error,rows);
    });
}

function updateCar(params,callback){
    var query = " update car_info set vin = ? , make_id = ? , make_name = ? , model_id = ? , model_name = ? ," +
        " pro_date = ? , colour = ? , engine_num = ? , entrust_id = ? , valuation = ? , mso_status = ? , purchase_type = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.makeName;
    paramsArray[i++]=params.modelId;
    paramsArray[i++]=params.modelName;
    paramsArray[i++]=params.proDate;
    paramsArray[i++]=params.colour;
    paramsArray[i++]=params.engineNum;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.valuation;
    paramsArray[i++]=params.msoStatus;
    paramsArray[i++]=params.purchaseType;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCar ');
        return callback(error,rows);
    });
}

function updateCarVin(params,callback){
    var query = " update car_info set vin = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCarVin ');
        return callback(error,rows);
    });
}


module.exports ={
    addCar : addCar,
    getCar : getCar,
    getCarBase : getCarBase,
    getCarList : getCarList,
    updateCar : updateCar,
    updateCarVin : updateCarVin
}