/**
 * Created by zwl on 2017/4/13.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageParkingDAO.js');

function addStorageParking(params,callback){
    var query = " insert into storage_parking (storage_id,area_id,row,col,lot) values (? , ? , ? , ? , ?) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.storageId;
    paramsArray[i++]=params.areaId;
    paramsArray[i++]=params.row;
    paramsArray[i++]=params.col;
    paramsArray[i]=params.lot;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addStorageParking ');
        return callback(error,rows);
    });
}

function getStorageParking(params,callback) {
    var query = " select p.*,c.vin,s.storage_name, " +
        " r.enter_time,r.plan_out_time,r.real_out_time,r.rel_status " +
        " from storage_parking p left join storage_info s on p.storage_id = s.id " +
        " left join car_storage_rel r on p.rel_id = r.id " +
        " left join car_info c on p.car_id = c.id where p.id is not null ";
    var paramsArray=[],i=0;
    if(params.parkingId){
        paramsArray[i++] = params.parkingId;
        query = query + " and p.id = ? ";
    }
    if(params.storageId){
        paramsArray[i++] = params.storageId;
        query = query + " and s.id = ? ";
    }
    if(params.storageName){
        paramsArray[i++] = params.storageName;
        query = query + " and s.storage_name = ? ";
    }
    if(params.areaId){
        paramsArray[i++] = params.areaId;
        query = query + " and area_id = ? ";
    }
    query = query + ' order by p.id ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorageParking ');
        return callback(error,rows);
    });
}

function getStorageParkingBase(params,callback) {
    var query = " select * from storage_parking where car_id >0 and id is not null ";
    var paramsArray=[],i=0;
    if(params.parkingId){
        paramsArray[i++] = params.parkingId;
        query = query + " and id = ? ";
    }
    if(params.storageId){
        paramsArray[i++] = params.storageId;
        query = query + " and storage_id = ? ";
    }
    if(params.areaId){
        paramsArray[i++] = params.areaId;
        query = query + " and area_id = ? ";
    }

    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorageParkingBase ');
        return callback(error,rows);
    });
}

function getStorageParkingBalanceCount(params,callback) {
    var query = " select count(sp.id) as parking_balance_count from storage_parking sp where sp.car_id = 0 and sp.id is not null ";
    var paramsArray=[],i=0;
    if(params.storageId){
        paramsArray[i++] = params.storageId;
        query = query + " and sp.storage_id = ? ";
    }
    if(params.areaId){
        paramsArray[i++] = params.areaId;
        query = query + " and sp.area_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorageParkingBalanceCount ');
        return callback(error,rows);
    });
}

function updateStorageParking(params,callback){
    var query = " update storage_parking set car_id = ? , rel_id = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.carId;
    paramsArray[i++]=params.relId;
    paramsArray[i]=params.parkingId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateStorageParking ');
        return callback(error,rows);
    });
}

function updateStorageParkingMove(params,callback){
    var query = " update storage_parking set car_id= 0 , rel_id = 0 where id = ? and storage_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.parkingId;
    paramsArray[i]=params.storageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateStorageParkingMove ');
        return callback(error,rows);
    });
}

function updateStorageParkingOut(params,callback){
    var query = " update storage_parking set car_id= 0 , rel_id = 0 where id = ? and storage_id= ? and car_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.parkingId;
    paramsArray[i++]=params.storageId;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateStorageParkingOut ');
        return callback(error,rows);
    });
}

function getStorageMakeStat (params,callback){
    var query = " select count(car_id) car_count ,cm.id,cm.make_name " +
        " from storage_parking sp left join car_info ci on sp.car_id = ci.id  " +
        " left join car_make cm on ci.make_id = cm.id " +
        " where storage_id = ? group by cm.id " ;
    var paramsArray=[],i=0;
    paramsArray[i]=params.storageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorageMakeStat ');
        return callback(error,rows);
    });
}


module.exports ={
    addStorageParking : addStorageParking,
    getStorageParking : getStorageParking,
    getStorageParkingBase : getStorageParkingBase,
    getStorageParkingBalanceCount : getStorageParkingBalanceCount,
    updateStorageParking : updateStorageParking,
    updateStorageParkingMove : updateStorageParkingMove,
    updateStorageParkingOut : updateStorageParkingOut,
    getStorageMakeStat : getStorageMakeStat
}
