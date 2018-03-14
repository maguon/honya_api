/**
 * Created by zwl on 2017/4/13.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageParkingDAO.js');

function addStorageParking(params,callback){
    var query = " insert into storage_parking (storage_id,row,col) values (? , ? , ?) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.storageId;
    paramsArray[i++]=params.row;
    paramsArray[i]=params.col;
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
        paramsArray[i] = params.storageName;
        query = query + " and s.storage_name = ? ";
    }
    query = query + ' order by p.id ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorageParking ');
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

module.exports ={
    addStorageParking : addStorageParking,
    getStorageParking : getStorageParking,
    updateStorageParking : updateStorageParking,
    updateStorageParkingMove : updateStorageParkingMove,
    updateStorageParkingOut : updateStorageParkingOut
}
