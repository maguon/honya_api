/**
 * Created by zwl on 2018/5/18.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CreditDAO.js');

function addCredit(params,callback){
    var query = " insert into credit_info (credit_number,entrust_id,credit_money," +
        " receive_card_money,express_fee,inform_fee,update_inform_fee,proce_fee,leave_shore_fee,us_receipts_fee,us_remit_fee," +
        " actual_money,difference_fee,plan_return_date,actual_return_date," +
        " receive_card_date,documents_date,documents_send_date,documents_receive_date,actual_remit_date,invoice_number,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.creditNumber;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.creditMoney;
    paramsArray[i++]=params.receiveCardMoney;
    paramsArray[i++]=params.expressFee;
    paramsArray[i++]=params.informFee;
    paramsArray[i++]=params.updateInformFee;
    paramsArray[i++]=params.proceFee;
    paramsArray[i++]=params.leaveShoreFee;
    paramsArray[i++]=params.usReceiptsFee;
    paramsArray[i++]=params.usRemitFee;
    paramsArray[i++]=params.actualMoney;
    paramsArray[i++]=params.differenceFee;
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
    var query = " select ct.*,e.entrust_type,e.short_name " +
        " from credit_info ct " +
        " left join entrust_info e on ct.entrust_id = e.id " ;
    var paramsArray=[],i=0;
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " inner join credit_car_rel ccr on ct.id = ccr.credit_id " +
            " inner join car_info c on ccr.car_id = c.id and c.vin = ? ";
    }
    if(params.repaymentId){
        paramsArray[i++] = params.repaymentId;
        query = query + " inner join loan_rep_credit_rel lrcr on ct.id = lrcr.credit_id and lrcr.repayment_id = ? ";
    }
    query = query + " where ct.id is not null ";

    if(params.creditId){
        paramsArray[i++] = params.creditId;
        query = query + " and ct.id = ? ";
    }
    if(params.creditNumber){
        paramsArray[i++] = params.creditNumber;
        query = query + " and ct.credit_number = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and ct.entrust_id = ? ";
    }
    if(params.creditStatus){
        paramsArray[i++] = params.creditStatus;
        query = query + " and ct.credit_status = ? ";
    }
    if(params.planReturnDateStart){
        paramsArray[i++] = params.planReturnDateStart +" 00:00:00";
        query = query + " and ct.plan_return_date >= ? ";
    }
    if(params.planReturnDateEnd){
        paramsArray[i++] = params.planReturnDateEnd +" 23:59:59";
        query = query + " and ct.plan_return_date <= ? ";
    }
    if(params.actualReturnDateStart){
        paramsArray[i++] = params.actualReturnDateStart +" 00:00:00";
        query = query + " and ct.actual_return_date >= ? ";
    }
    if(params.actualReturnDateEnd){
        paramsArray[i++] = params.actualReturnDateEnd +" 23:59:59";
        query = query + " and ct.actual_return_date <= ? ";
    }
    query = query + " order by ct.id desc ";
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

function getCreditBase(params,callback) {
    var query = " select ct.*,e.entrust_type,e.short_name " +
        " from credit_info ct " +
        " left join entrust_info e on ct.entrust_id = e.id " +
        " left join credit_car_rel ccr on ct.id = ccr.credit_id " +
        " inner join loan_buy_car_rel lbcr on ccr.car_id = lbcr.car_id " +
        " where ct.id is not null " ;
    var paramsArray=[],i=0;
    if(params.creditId){
        paramsArray[i++] = params.creditId;
        query = query + " and ct.id = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and ct.entrust_id = ? ";
    }
    if(params.creditStatus){
        paramsArray[i++] = params.creditStatus;
        query = query + " and ct.credit_status = ? ";
    }
    if(params.loanId){
        paramsArray[i++] = params.loanId;
        query = query + " and lbcr.loan_id = ? ";
    }
    query = query + " group by ct.id ";
    query = query + " order by ct.id desc ";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCreditBase ');
        return callback(error,rows);
    });
}

function getCreditRepMoney(params,callback) {
    var query = " select sum(ct.actual_money) credit_rep_money from credit_info ct " +
        " left join loan_rep_credit_rel lrcr on ct.id = lrcr.credit_id " +
        " where ct.id is not null ";
    var paramsArray=[],i=0;
    if(params.repaymentId){
        paramsArray[i++] = params.repaymentId;
        query = query + " and lrcr.repayment_id= ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCreditRepMoney ');
        return callback(error,rows);
    });
}

function updateCredit(params,callback){
    var query = " update credit_info set credit_number = ? , entrust_id = ? , credit_money = ? , " +
        " receive_card_money = ? , express_fee = ? , inform_fee = ? , update_inform_fee = ? , proce_fee = ? , " +
        " leave_shore_fee = ? , us_receipts_fee = ? , us_remit_fee = ? , actual_money = ? , difference_fee = ? , " +
        " plan_return_date = ? , actual_return_date = ? , receive_card_date = ? , documents_date = ? , documents_send_date = ? , " +
        " documents_receive_date = ? , actual_remit_date = ? , invoice_number = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.creditNumber;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.creditMoney;
    paramsArray[i++]=params.receiveCardMoney;
    paramsArray[i++]=params.expressFee;
    paramsArray[i++]=params.informFee;
    paramsArray[i++]=params.updateInformFee;
    paramsArray[i++]=params.proceFee;
    paramsArray[i++]=params.leaveShoreFee;
    paramsArray[i++]=params.usReceiptsFee;
    paramsArray[i++]=params.usRemitFee;
    paramsArray[i++]=params.actualMoney;
    paramsArray[i++]=params.differenceFee;
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
    getCreditBase : getCreditBase,
    getCreditRepMoney : getCreditRepMoney,
    updateCredit : updateCredit,
    updateCreditStatus : updateCreditStatus
}
