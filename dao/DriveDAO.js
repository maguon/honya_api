/**
 * Created by zwl on 2017/3/15.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveDAO.js');

function addDrive(params,callback){
    var query = " insert into drive_info (drive_name,gender,id_number,tel,company_id,license_level,license_date,drive_image,license_image,remark) " +
        " values( ? , ? , ? , ? , ? , ? , ? , ? , ? , ?) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.gender;
    paramsArray[i++]=params.idNumber;
    paramsArray[i++]=params.tel;
    paramsArray[i++]=params.companyId;
    paramsArray[i++]=params.licenseLevel;
    paramsArray[i++]=params.licenseDate;
    paramsArray[i++]=params.driveImage;
    paramsArray[i++]=params.licenseImage;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug( ' addDrive ');
        return callback(error,rows);
    })
}

function getDrive(params,callback) {
    var query = " select d.*,c.company_name,c.operate_type,t.truck_num " +
        " from drive_info d left join company_info c on d.company_id = c.id " +
        " left join truck_info t on d.id = t.drive_id where d.id is not null";
    var paramsArray=[],i=0;
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and d.id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
    }
    if(params.companyName){
        paramsArray[i++] = params.companyName;
        query = query + " and c.company_name = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and c.operate_type = ? ";
    }
    if(params.driveStatus){
        paramsArray[i++] = params.driveStatus;
        query = query + " and d.drive_status = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDrive ');
        return callback(error,rows);
    });
}

function getDriveCount(params,callback) {
    var query = " select count(d.id) as driveCount from drive_info d left join company_info c on d.company_id = c.id where d.id is not null ";
    var paramsArray=[],i=0;
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and c.id= ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveCount ');
        return callback(error,rows);
    });
}

function updateDrive(params,callback){
    var query = " update drive_info set drive_name = ? , gender = ? , id_number = ? , " +
        " tel = ? , company_id = ? , license_level = ? , license_date = ? , drive_image = ? , " +
        " license_image = ? , remark= ?  where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.gender;
    paramsArray[i++]=params.idNumber;
    paramsArray[i++]=params.tel;
    paramsArray[i++]=params.companyId;
    paramsArray[i++]=params.licenseLevel;
    paramsArray[i++]=params.licenseDate;
    paramsArray[i++]=params.driveImage;
    paramsArray[i++]=params.licenseImage;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.driveId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDrive ');
        return callback(error,rows);
    });
}

function updateDriveStatus(params,callback){
    var query = " update drive_info set drive_status = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.driveStatus;
    paramsArray[i] = params.driveId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addDrive : addDrive,
    getDrive : getDrive,
    getDriveCount :getDriveCount,
    updateDrive : updateDrive,
    updateDriveStatus : updateDriveStatus
}