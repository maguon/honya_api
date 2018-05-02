/**
 * Created by zwl on 2018/3/28.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('EntrustDAO.js');

function addEntrust(params,callback){
    var query = " insert into entrust_info (short_name,entrust_name,entrust_type,contacts_name,tel,address,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shortName;
    paramsArray[i++]=params.entrustName;
    paramsArray[i++]=params.entrustType;
    paramsArray[i++]=params.contactsName;
    paramsArray[i++]=params.tel;
    paramsArray[i++]=params.address;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addEntrust ');
        return callback(error,rows);
    });
}

function getEntrust(params,callback) {
    var query = " select * from entrust_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and id = ? ";
    }
    if(params.entrustType){
        paramsArray[i++] = params.entrustType;
        query = query + " and entrust_type = ? ";
    }
    if(params.shortName){
        paramsArray[i++] = params.shortName;
        query = query + " and short_name = ? ";
    }
    if(params.entrustName){
        paramsArray[i++] = params.entrustName;
        query = query + " and entrust_name = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getEntrust ');
        return callback(error,rows);
    });
}

function getEntrustBase(params,callback) {
    var query = " select e.*,count(case when r.rel_status = 1 and r.active = 1 then c.id end) as car_count, " +
        " if(isnull(sum(case when r.rel_status = 1 and r.active = 1 then c.valuation end)),0,sum(case when r.rel_status = 1 and r.active = 1 then c.valuation end)) as valuation, " +
        " count(case when c.mso_status = 1 and r.active = 1 then c.id end) as not_mso_count, " +
        " if(isnull(sum(case when c.mso_status = 1 and r.active = 1 then c.valuation end)),0,sum(case when c.mso_status = 1 and r.active = 1 then c.valuation end)) as not_mso_valuation " +
        " from entrust_info e " +
        " left join car_info c on e.id = c.entrust_id " +
        " left join car_storage_rel r on c.id = r.car_id " +
        " where e.id is not null ";
    var paramsArray=[],i=0;
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and e.id = ? ";
    }
    if(params.entrustType){
        paramsArray[i++] = params.entrustType;
        query = query + " and e.entrust_type = ? ";
    }
    if(params.shortName){
        paramsArray[i++] = params.shortName;
        query = query + " and e.short_name = ? ";
    }
    if(params.entrustName){
        paramsArray[i++] = params.entrustName;
        query = query + " and e.entrust_name = ? ";
    }
    if(params.contactsName){
        paramsArray[i++] = params.contactsName;
        query = query + " and e.contacts_name = ? ";
    }
    if(params.tel){
        paramsArray[i++] = params.tel;
        query = query + " and e.tel = ? ";
    }
    query = query + " group by e.id  ";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getEntrustBase ');
        return callback(error,rows);
    });
}

function updateEntrust(params,callback){
    var query = " update entrust_info set short_name = ?,entrust_name = ?,entrust_type = ?,contacts_name = ?,tel = ?,address = ?,remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shortName;
    paramsArray[i++]=params.entrustName;
    paramsArray[i++]=params.entrustType;
    paramsArray[i++]=params.contactsName;
    paramsArray[i++]=params.tel;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.entrustId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateEntrust ');
        return callback(error,rows);
    });
}

function getEntrustCount(params,callback) {
    var query = " select e.entrust_type,count(e.id)entrust_count from entrust_info e where e.id is not null ";
    var paramsArray=[],i=0;
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and e.id = ? ";
    }
    query = query + ' group by e.entrust_type ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getEntrustCount ');
        return callback(error,rows);
    });
}


module.exports ={
    addEntrust : addEntrust,
    getEntrust : getEntrust,
    getEntrustBase : getEntrustBase,
    updateEntrust : updateEntrust,
    getEntrustCount : getEntrustCount
}