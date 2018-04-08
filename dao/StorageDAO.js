/**
 * Created by zwl on 2017/4/11.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageDAO.js');

function addStorage(params,callback){
    var query = " insert into storage_info (storage_name,remark) values (? , ?) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.storageName;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addStorage ');
        return callback(error,rows);
    });
}

function getStorage(params,callback) {
    var query = " select s.*,count(sa.id) as area_count,if(isnull(sum(sa.col*sa.row*lot)),0,sum(sa.col*sa.row*lot)) as total_seats from storage_info s " +
        " left join storage_area sa on s.id = sa.storage_id where s.id is not null ";
    var paramsArray=[],i=0;
    if(params.storageId){
        paramsArray[i++] = params.storageId;
        query = query + " and s.id = ? ";
    }
    if(params.storageName){
        paramsArray[i++] = params.storageName;
        query = query + " and s.storage_name = ? ";
    }
    if(params.storageStatus){
        paramsArray[i] = params.storageStatus;
        query = query + " and s.storage_status = ? ";
    }
    query = query + ' group by s.id ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorage ');
        return callback(error,rows);
    });
}

function getStorageDate(params,callback) {
    var query = " select s.id,s.storage_name,s.storage_status,if(isnull(sum(sa.col*sa.row*lot)),0,sum(sa.col*sa.row*lot)) as total_seats,d.* " +
        " from storage_info s left join storage_area sa on s.id = sa.storage_id " +
        " left join storage_stat_date d on s.id = d.storage_id where s.id is not null ";
    var paramsArray=[],i=0;
    if(params.storageId){
        paramsArray[i++] = params.storageId;
        query = query + " and s.id = ? ";
    }
    if(params.storageName){
        paramsArray[i++] = params.storageName;
        query = query + " and s.storage_name = ? ";
    }
    if(params.dateStart){
        paramsArray[i++] = params.dateStart;
        query = query + " and d.date_id >= ? ";
    }
    if(params.dateEnd){
        paramsArray[i++] = params.dateEnd;
        query = query + " and d.date_id <= ? ";
    }
    if(params.dateStartMonth){
        paramsArray[i++] = params.dateStartMonth;
        query = query + " and date_format(d.date_id,'%Y%m') >= ? ";
    }
    if(params.dateEndMonth){
        paramsArray[i] = params.dateEndMonth;
        query = query + " and date_format(d.date_id,'%Y%m') <= ? ";
    }
    query = query + ' group by s.id,d.date_id ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorageDate ');
        return callback(error,rows);
    });
}

function getStorageCount(params,callback) {
    var query = " select sum(d.imports) as sumImports,sum(d.exports) as sumExports,sum(d.balance) as sumBalance from storage_info s " +
        " left join storage_stat_date d on s.id = d.storage_id where s.id is not null ";
    var paramsArray=[],i=0;
    if(params.storageId){
        paramsArray[i++] = params.storageId;
        query = query + " and s.id = ? ";
    }
    if(params.dateStart){
        paramsArray[i++] = params.dateStart;
        query = query + " and d.date_id >= ? ";
    }
    if(params.dateEnd){
        paramsArray[i] = params.dateEnd;
        query = query + " and d.date_id <= ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorageCount ');
        return callback(error,rows);
    });
}

function getStorageTotalMonth(params,callback) {
    var query = " select db.y_month,sum(d.imports) as total_imports,sum(d.exports) as total_exports,sum(d.balance) as total_balance " +
        " from storage_stat_date d left join  date_base db on d.date_id = db.id " +
        " left join storage_info s on d.storage_id = s.id where d.date_id is not null ";
    var paramsArray=[],i=0;
    if(params.year){
        paramsArray[i++] = params.year;
        query = query + " and db.year = ? ";
    }
    if(params.storageId){
        paramsArray[i++] = params.storageId;
        query = query + " and d.storage_id = ? ";
    }
    query = query + ' group by db.y_month ';
    query = query + ' order by db.y_month desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorageTotalMonth ');
        return callback(error,rows);
    });
}

function getStorageTotalDay(params,callback) {
    var query = " select d.date_id,sum(d.imports) as total_imports,sum(d.exports) as total_exports,sum(d.balance) as total_balance " +
        " from storage_stat_date d left join date_base db on d.date_id = db.id " +
        " left join storage_info s on d.storage_id = s.id where d.date_id is not null ";
    var paramsArray=[],i=0;
    if(params.year){
        paramsArray[i++] = params.year;
        query = query + " and db.year = ? ";
    }
    if(params.month){
        paramsArray[i++] = params.month;
        query = query + " and db.month = ? ";
    }
    if(params.storageId){
        paramsArray[i++] = params.storageId;
        query = query + " and d.storage_id = ? ";
    }
    query = query + ' group by d.date_id ';
    query = query + ' order by d.date_id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorageTotalDay ');
        return callback(error,rows);
    });
}

function updateStorage(params,callback){
    var query = " update storage_info set storage_name = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.storageName;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.storageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateStorage ');
        return callback(error,rows);
    });
}

function updateStorageStatus(params,callback){
    var query = " update storage_info set storage_status = ? where id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.storageStatus;
    paramsArray[i] = params.storageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateStorageStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addStorage : addStorage,
    getStorage : getStorage,
    getStorageDate : getStorageDate,
    getStorageCount : getStorageCount,
    getStorageTotalMonth : getStorageTotalMonth,
    getStorageTotalDay : getStorageTotalDay,
    updateStorage : updateStorage,
    updateStorageStatus : updateStorageStatus
}