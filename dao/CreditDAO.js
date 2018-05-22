/**
 * Created by zwl on 2018/5/18.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CreditDAO.js');

function addCredit(params,callback){
    var query = " insert into credit_info (credit_number,entrust_id,credit_money,actual_money,plan_return_date,actual_return_date," +
        "receive_card_date,documents_date,documents_send_date,documents_receive_date,actual_remit_date,invoice_number,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.creditNumber;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.creditMoney;
    paramsArray[i++]=params.actualMoney;
    paramsArray[i++]=params.planReturnDate;
    paramsArray[i++]=params.actualReturnDate;
    paramsArray[i++]=params.receiveCardDate;
    paramsArray[i++]=params.documentsDate;
    paramsArray[i++]=params.documentsSendDate;
    paramsArray[i++]=params.documentsReceiveDate;
    paramsArray[i++]=params.actualRemitDate;
    paramsArray[i++]=params.invoiceNumber;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCredit ');
        return callback(error,rows);
    });
}

function getCredit(params,callback) {
    var query = " select c.*,e.entrust_type,e.short_name,lrcr.repayment_id from credit_info c " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join loan_rep_credit_rel lrcr on c.id = lrcr.credit_id " +
        " where c.id is not null ";
    var paramsArray=[],i=0;
    if(params.creditId){
        paramsArray[i++] = params.creditId;
        query = query + " and c.id = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and c.entrust_id = ? ";
    }
    if(params.creditStatus){
        paramsArray[i++] = params.creditStatus;
        query = query + " and c.credit_status = ? ";
    }
    if(params.planReturnDateStart){
        paramsArray[i++] = params.planReturnDateStart +" 00:00:00";
        query = query + " and c.plan_return_date >= ? ";
    }
    if(params.planReturnDateEnd){
        paramsArray[i++] = params.planReturnDateEnd +" 23:59:59";
        query = query + " and c.plan_return_date <= ? ";
    }
    if(params.actualReturnDateStart){
        paramsArray[i++] = params.actualReturnDateStart +" 00:00:00";
        query = query + " and c.actual_return_date >= ? ";
    }
    if(params.actualReturnDateEnd){
        paramsArray[i++] = params.actualReturnDateEnd +" 23:59:59";
        query = query + " and c.actual_return_date <= ? ";
    }
    query = query + " group by c.id ";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCredit ');
        return callback(error,rows);
    });
}

function updateCredit(params,callback){
    var query = " update credit_info set credit_number = ? , entrust_id = ? , credit_money = ? , actual_money = ? , " +
        " plan_return_date = ? , actual_return_date = ? , receive_card_date = ? , documents_date = ? , documents_send_date = ? , " +
        " documents_receive_date = ? , actual_remit_date = ? , invoice_number = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.creditNumber;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.creditMoney;
    paramsArray[i++]=params.actualMoney;
    paramsArray[i++]=params.planReturnDate;
    paramsArray[i++]=params.actualReturnDate;
    paramsArray[i++]=params.receiveCardDate;
    paramsArray[i++]=params.documentsDate;
    paramsArray[i++]=params.documentsSendDate;
    paramsArray[i++]=params.documentsReceiveDate;
    paramsArray[i++]=params.actualRemitDate;
    paramsArray[i++]=params.invoiceNumber;
    paramsArray[i++]=params.remark;
    paramsArray[i++]=params.creditId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCredit ');
        return callback(error,rows);
    });
}

function updateCreditStatus(params,callback){
    var query = " update credit_info set credit_end_date = ? , credit_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.creditEndDate;
    paramsArray[i++]=params.creditStatus;
    paramsArray[i]=params.creditId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCreditStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addCredit : addCredit,
    getCredit : getCredit,
    updateCredit : updateCredit,
    updateCreditStatus : updateCreditStatus
}
