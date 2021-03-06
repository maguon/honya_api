/**
 * Created by zwl on 2017/4/13.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarStorageRelDAO.js');

function addCarStorageRel(params,callback){
    var query = " insert into car_storage_rel (car_id,storage_id,storage_name,enter_time,plan_out_time,import_date_id) " +
        " values ( ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.carId;
    paramsArray[i++]=params.storageId;
    paramsArray[i++]=params.storageName;
    paramsArray[i++]=params.enterTime;
    paramsArray[i++]=params.planOutTime;
    paramsArray[i]=params.importDateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCarStorageRel ');
        return callback(error,rows);
    });
}

function getCarStorageRel(params,callback) {
    var query = " select r.*,sum(TIMESTAMPDIFF(DAY,date_format(enter_time,'%Y-%m-%d'),date_format(real_out_time,'%Y-%m-%d'))+1)as day_count, " +
        " TIMESTAMPDIFF(HOUR,r.enter_time,r.real_out_time) as hour_count from car_storage_rel r " +
        " left join storage_parking p on r.car_id = p.car_id where r.id is not null ";
    var paramsArray=[],i=0;
    if(params.relId){
        paramsArray[i++] = params.relId;
        query = query + " and r.id = ? ";
    }
    if(params.storageId){
        paramsArray[i++] = params.storageId;
        query = query + " and r.storage_id = ? ";
    }
    if(params.carId){
        paramsArray[i++] = params.carId;
        query = query + " and r.car_id = ? ";
    }
    if(params.relStatus){
        paramsArray[i++] = params.relStatus;
        query = query + " and r.rel_status = ? ";
    }
    query = query + " group by r.id ";
    query = query + " order by r.id ";
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarStorageRel ');
        return callback(error,rows);
    });
}

function updateRelStatus(params,callback){
    var query = " update car_storage_rel set real_out_time = ? , export_date_id = ? , rel_status = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.realOutTime;
    paramsArray[i++] = params.exportDateId;
    paramsArray[i++] = params.relStatus;
    paramsArray[i] = params.relId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateRelStatus ');
        return callback(error,rows);
    });
}

function updateRelPlanOutTime(params,callback){
    var query = " update car_storage_rel set plan_out_time = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.planOutTime;
    paramsArray[i] = params.relId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateRelPlanOutTime ');
        return callback(error,rows);
    });
}

function updateRelActive(params,callback){
    var query = " update car_storage_rel set active = 0 where car_id = ? and id != ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.carId;
    paramsArray[i] = params.relId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateRelActive ');
        return callback(error,rows);
    });
}

function updateMortgageStatus(params,callback){
    var query = " update car_storage_rel set mortgage_status = ? where car_id = ? and rel_status = 1 ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.mortgageStatus;
    paramsArray[i] = params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateMortgageStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addCarStorageRel : addCarStorageRel,
    getCarStorageRel : getCarStorageRel,
    updateRelStatus : updateRelStatus,
    updateRelPlanOutTime : updateRelPlanOutTime,
    updateRelActive : updateRelActive,
    updateMortgageStatus : updateMortgageStatus
}