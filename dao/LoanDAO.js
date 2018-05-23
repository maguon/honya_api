/**
 * Created by zwl on 2018/5/18.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanDAO.js');

function addLoan(params,callback){
    var query = " insert into loan_info (entrust_id,deposit,loan_money,remark) values ( ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.deposit;
    paramsArray[i++]=params.loanMoney;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addLoan ');
        return callback(error,rows);
    });
}

function getLoan(params,callback) {
    var query = " select l.*,e.entrust_type,e.short_name,sum(c.valuation) as mortgage_valuation from loan_info l " +
        " left join entrust_info e on l.entrust_id = e.id " +
        " left join loan_mortgage_car_rel lmc on l.id = lmc.loan_id " +
        " left join car_info c on lmc.car_id = c.id " +
        " where l.id is not null ";
    var paramsArray=[],i=0;
    if(params.loanId){
        paramsArray[i++] = params.loanId;
        query = query + " and l.id = ? ";
    }
    if(params.entrustType){
        paramsArray[i++] = params.entrustType;
        query = query + " and e.entrust_type = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and l.entrust_id = ? ";
    }
    if(params.loanStatus){
        paramsArray[i++] = params.loanStatus;
        query = query + " and l.loan_status = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and l.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and l.created_on <= ? ";
    }
    if(params.loanEndDateStart){
        paramsArray[i++] = params.loanEndDateStart +" 00:00:00";
        query = query + " and l.loan_end_date >= ? ";
    }
    if(params.loanEndDateEnd){
        paramsArray[i++] = params.loanEndDateEnd +" 23:59:59";
        query = query + " and l.loan_end_date <= ? ";
    }
    query = query + " group by l.id ";
    query = query + " order by l.id desc ";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getLoan ');
        return callback(error,rows);
    });
}

function updateLoan(params,callback){
    var query = " update loan_info set deposit = ? , loan_money = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.deposit;
    paramsArray[i++]=params.loanMoney;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.loanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateLoan ');
        return callback(error,rows);
    });
}

function updateMortgageCarCountPlus(params,callback){
    var query = " update loan_info set mortgage_car_count = mortgage_car_count +1 where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i]=params.loanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateMortgageCarCountPlus ');
        return callback(error,rows);
    });
}

function updateMortgageCarCountMinus(params,callback){
    var query = " update loan_info set mortgage_car_count = mortgage_car_count -1 where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i]=params.loanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateMortgageCarCountMinus ');
        return callback(error,rows);
    });
}

function updateBuyCarCountPlus(params,callback){
    var query = " update loan_info set buy_car_count = buy_car_count +1 where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i]=params.loanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateBuyCarCountPlus ');
        return callback(error,rows);
    });
}

function updateBuyCarCountMinus(params,callback){
    var query = " update loan_info set buy_car_count = buy_car_count -1 where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i]=params.loanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateBuyCarCountMinus ');
        return callback(error,rows);
    });
}


module.exports ={
    addLoan : addLoan,
    getLoan : getLoan,
    updateLoan : updateLoan,
    updateMortgageCarCountPlus : updateMortgageCarCountPlus,
    updateMortgageCarCountMinus : updateMortgageCarCountMinus,
    updateBuyCarCountPlus : updateBuyCarCountPlus,
    updateBuyCarCountMinus : updateBuyCarCountMinus
}