/**
 * Created by zwl on 2018/5/18.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('FinancialCreditDAO.js');

function addFinancialCredit(params,callback){
    var query = " insert into financial_credit_info (credit_number,entrust_id,credit_money,actual_money,plan_return_date,actual_return_date," +
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
        logger.debug(' addFinancialCredit ');
        return callback(error,rows);
    });
}

function getFinancialCredit(params,callback) {
    var query = " select fc.*,e.entrust_type,e.short_name from financial_credit_info fc " +
        " left join entrust_info e on fc.entrust_id = e.id " +
        " where fc.id is not null ";
    var paramsArray=[],i=0;
    if(params.financialCreditId){
        paramsArray[i++] = params.financialCreditId;
        query = query + " and fc.id = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and fc.entrust_id = ? ";
    }
    if(params.creditStatus){
        paramsArray[i++] = params.creditStatus;
        query = query + " and fc.credit_status = ? ";
    }
    if(params.planReturnDateStart){
        paramsArray[i++] = params.planReturnDateStart +" 00:00:00";
        query = query + " and fc.plan_return_date >= ? ";
    }
    if(params.planReturnDateEnd){
        paramsArray[i++] = params.planReturnDateEnd +" 23:59:59";
        query = query + " and fc.plan_return_date <= ? ";
    }
    if(params.actualReturnDateStart){
        paramsArray[i++] = params.actualReturnDateStart +" 00:00:00";
        query = query + " and fc.actual_return_date >= ? ";
    }
    if(params.actualReturnDateEnd){
        paramsArray[i++] = params.actualReturnDateEnd +" 23:59:59";
        query = query + " and fc.actual_return_date <= ? ";
    }
    query = query + " group by fc.id ";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getFinancialCredit ');
        return callback(error,rows);
    });
}


module.exports ={
    addFinancialCredit : addFinancialCredit,
    getFinancialCredit : getFinancialCredit
}
