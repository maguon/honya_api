/**
 * Created by zwl on 2018/5/18.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('FinancialLoanDAO.js');

function addFinancialLoan(params,callback){
    var query = " insert into financial_loan_info (entrust_id,deposit,loan_money,remark) values ( ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.deposit;
    paramsArray[i++]=params.loanMoney;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addFinancialLoan ');
        return callback(error,rows);
    });
}

function getFinancialLoan(params,callback) {
    var query = " select fl.*,e.entrust_type,e.short_name from financial_loan_info fl " +
        " left join entrust_info e on fl.entrust_id = e.id " +
        " where fl.id is not null ";
    var paramsArray=[],i=0;
    if(params.financialLoanId){
        paramsArray[i++] = params.financialLoanId;
        query = query + " and fl.id = ? ";
    }
    if(params.entrustType){
        paramsArray[i++] = params.entrustType;
        query = query + " and e.entrust_type = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and fl.entrust_id = ? ";
    }
    if(params.loanStatus){
        paramsArray[i++] = params.loanStatus;
        query = query + " and fl.loan_status = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and fl.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and fl.created_on <= ? ";
    }
    if(params.loanEndDateStart){
        paramsArray[i++] = params.loanEndDateStart +" 00:00:00";
        query = query + " and fl.loan_end_date >= ? ";
    }
    if(params.loanEndDateEnd){
        paramsArray[i++] = params.loanEndDateEnd +" 23:59:59";
        query = query + " and fl.loan_end_date <= ? ";
    }
    query = query + " group by fl.id ";
    query = query + " order by fl.id desc ";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getFinancialLoan ');
        return callback(error,rows);
    });
}

function updateMortgageCarCountPlus(params,callback){
    var query = " update financial_loan_info set mortgage_car_count = mortgage_car_count +1 where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i]=params.financialLoanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateMortgageCarCountPlus ');
        return callback(error,rows);
    });
}

function updateMortgageCarCountMinus(params,callback){
    var query = " update financial_loan_info set mortgage_car_count = mortgage_car_count -1 where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i]=params.financialLoanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateMortgageCarCountMinus ');
        return callback(error,rows);
    });
}


module.exports ={
    addFinancialLoan : addFinancialLoan,
    getFinancialLoan : getFinancialLoan,
    updateMortgageCarCountPlus : updateMortgageCarCountPlus,
    updateMortgageCarCountMinus : updateMortgageCarCountMinus
}
