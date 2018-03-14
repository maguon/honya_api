/**
 * Created by zwl on 2017/3/14.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckDAO.js');

function addTruck(params,callback){
    var query = "insert into truck_info (truck_num,brand_id,truck_tel,the_code,drive_id,copilot,company_id, " +
        " truck_type,rel_id,truck_status,number,driving_image,operation_image,remark) " +
        " values (? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?)";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckNum;
    paramsArray[i++]=params.brandId;
    paramsArray[i++]=params.truckTel;
    paramsArray[i++]=params.theCode;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.copilot;
    paramsArray[i++]=params.companyId;
    paramsArray[i++]=params.truckType;
    paramsArray[i++]=params.relId;
    paramsArray[i++]=params.truckStatus;
    paramsArray[i++]=params.number;
    paramsArray[i++]=params.drivingImage;
    paramsArray[i++]=params.operationImage;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug( ' addTruck ');
        return callback(error,rows);
    })
}

function getTruck(params,callback) {
    var query = " select h.*,t.id as trail_id,t.truck_num as trail_num,t.number as trail_number," +
        " b.id as b_id,b.brand_name,d.id as d_id,d.drive_name,c.id as c_id,c.company_name,c.operate_type " +
        " from truck_info h left join truck_info t on h.rel_id = t.id " +
        " left join truck_brand b on h.brand_id = b.id  " +
        " left join drive_info d on h.drive_id = d.id  " +
        " left join company_info c on h.company_id = c.id where h.id is not null ";
    var paramsArray=[],i=0;
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and h.id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and h.truck_num = ? ";
    }
    if(params.brandId){
        paramsArray[i++] = params.brandId;
        query = query + " and h.brand_id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and h.drive_id = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and h.company_id = ? ";
    }
    if(params.truckType){
        paramsArray[i++] = params.truckType;
        query = query + " and h.truck_type = ? ";
    }
    if(params.truckStatus){
        paramsArray[i++] = params.truckStatus;
        query = query + " and h.truck_status = ? ";
    }
    if(params.number){
        paramsArray[i++] = params.number;
        query = query + " and h.number = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and c.operate_type = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruck ');
        return callback(error,rows);
    });
}

function getFirstCount(params,callback) {
    var query = " select count(t.id) as firstCount from truck_info t left join company_info c on t.company_id = c.id " +
        " where t.truck_type = 1 and t.id is not null ";
    var paramsArray=[],i=0;
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and c.id= ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getFirstCount ');
        return callback(error,rows);
    });
}

function getTrailerCount(params,callback) {
    var query = " select count(t.id) as firstCount from truck_info t left join company_info c on t.company_id = c.id " +
        " where t.truck_type = 2 and t.id is not null ";
    var paramsArray=[],i=0;
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and c.id= ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTrailerCount ');
        return callback(error,rows);
    });
}

function updateTruck(params,callback){
    var query = " update truck_info set truck_num = ? ,brand_id = ? ,truck_tel = ? ," +
        " the_code = ? ,drive_id = ? ,copilot = ? ,company_id = ? ,truck_type = ? ,rel_id = ? ," +
        " truck_status = ? ,number = ? ,driving_image = ? ,operation_image = ? ,remark = ?  where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckNum;
    paramsArray[i++]=params.brandId;
    paramsArray[i++]=params.truckTel;
    paramsArray[i++]=params.theCode;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.copilot;
    paramsArray[i++]=params.companyId;
    paramsArray[i++]=params.truckType;
    paramsArray[i++]=params.relId;
    paramsArray[i++]=params.truckStatus;
    paramsArray[i++]=params.number;
    paramsArray[i++]=params.drivingImage;
    paramsArray[i++]=params.operationImage;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.truckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruck ');
        return callback(error,rows);
    });
}

function updateTruckDriveRel(params,callback){
    var query = " update truck_info set drive_id = 0 ,copilot = null where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i]=params.truckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckDriveRel ');
        return callback(error,rows);
    });
}

function updateTruckStatus(params,callback){
    var query = " update truck_info set truck_status = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.truckStatus;
    paramsArray[i] = params.truckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addTruck : addTruck,
    getTruck : getTruck,
    getFirstCount : getFirstCount,
    getTrailerCount : getTrailerCount,
    updateTruck : updateTruck,
    updateTruckDriveRel : updateTruckDriveRel,
    updateTruckStatus : updateTruckStatus
}