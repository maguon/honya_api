/**
 * Created by zwl on 2018/5/18.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanDAO.js');

function addLoan(params,callback){
    var query = " insert into loan_info (entrust_id,contract_num,deposit,loan_money,not_repayment_money,remark) " +
        " values ( ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.contractNum;
    paramsArray[i++]=params.deposit;
    paramsArray[i++]=params.loanMoney;
    paramsArray[i++]=params.notRepaymentMoney;
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
    if(params.loanStatusArr){
        query = query + " and l.loan_status in ("+params.loanStatusArr + ") "
    }
    if(params.loanStartDateStart){
        paramsArray[i++] = params.loanStartDateStart +" 00:00:00";
        query = query + " and l.loan_start_date >= ? ";
    }
    if(params.loanStartDateEnd){
        paramsArray[i++] = params.loanStartDateEnd +" 23:59:59";
        query = query + " and l.loan_start_date <= ? ";
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

function getLoanList(params,callback) {
    var query = " select l.*,e.short_name,c.vin,c.make_name,c.model_name,c.valuation, " +
        " ci.credit_number,ccr.lc_handling_fee,ccr.bank_services_fee,ccr.valuation_fee, " +
        " so.id as storage_order_id,csr.enter_time,csr.real_out_time,so.day_count,so.actual_fee, " +
        " sto.id as ship_trans_order_id,sto.total_fee " +
        " from loan_info l " +
        " left join entrust_info e on l.entrust_id = e.id " +
        " left join loan_buy_car_rel lbcr on l.id = lbcr.loan_id " +
        " left join car_info c on lbcr.car_id = c.id " +
        " left join credit_car_rel ccr on lbcr.car_id = ccr.car_id " +
        " left join credit_info ci on ccr.credit_id = ci.id " +
        " left join storage_order so on lbcr.car_id = so.car_id " +
        " left join car_storage_rel csr on so.car_storage_rel_id = csr.id " +
        " left join ship_trans_order sto on lbcr.car_id = sto.car_id " +
        " left join ship_trans_info st on sto.ship_trans_id = st.id " +
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
    if(params.loanStatusArr){
        query = query + " and l.loan_status in ("+params.loanStatusArr + ") "
    }
    if(params.loanStartDateStart){
        paramsArray[i++] = params.loanStartDateStart +" 00:00:00";
        query = query + " and l.loan_start_date >= ? ";
    }
    if(params.loanStartDateEnd){
        paramsArray[i++] = params.loanStartDateEnd +" 23:59:59";
        query = query + " and l.loan_start_date <= ? ";
    }
    if(params.loanEndDateStart){
        paramsArray[i++] = params.loanEndDateStart +" 00:00:00";
        query = query + " and l.loan_end_date >= ? ";
    }
    if(params.loanEndDateEnd){
        paramsArray[i++] = params.loanEndDateEnd +" 23:59:59";
        query = query + " and l.loan_end_date <= ? ";
    }
    query = query + " order by l.id desc ";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getLoanList ');
        return callback(error,rows);
    });
}

function getLoanNotCount(params,callback) {
    var query = " select sum(l.not_repayment_money) as not_repayment_money,count(l.id) as loan_count " +
        " from loan_info l where l.id is not null ";
    var paramsArray=[],i=0;
    if(params.loanStatusArr){
        query = query + " and l.loan_status in ("+params.loanStatusArr + ") "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getLoanNotCount ');
        return callback(error,rows);
    });
}

function getLoanStatDate(params,callback) {
    var query = " select * from loan_stat_date where date_id is not null ";
    var paramsArray=[],i=0;
    if(params.yearMonth){
        paramsArray[i++] = params.yearMonth;
        query = query + " and date_format(date_id,'%Y%m') = ? ";
    }
    if(params.yearMonthStart){
        paramsArray[i++] = params.yearMonthStart;
        query = query + " and date_format(date_id,'%Y%m') >= ? ";
    }
    if(params.yearMonthEnd){
        paramsArray[i] = params.yearMonthEnd;
        query = query + " and date_format(date_id,'%Y%m') <= ? ";
    }
    if(params.dateStart){
        paramsArray[i++] = params.dateStart;
        query = query + " and date_id >= ? ";
    }
    if(params.dateEnd){
        paramsArray[i++] = params.dateEnd;
        query = query + " and date_id <= ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getLoanStatDate ');
        return callback(error,rows);
    });
}

function updateLoan(params,callback){
    var query = " update loan_info set contract_num = ? , deposit = ? , loan_money = ? , not_repayment_money = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.contractNum;
    paramsArray[i++]=params.deposit;
    paramsArray[i++]=params.loanMoney;
    paramsArray[i++]=params.notRepaymentMoney;
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

function updateMortgageCarCount(params,callback){
    var query = " update loan_info set mortgage_car_count = 0 where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i]=params.loanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateMortgageCarCount ');
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

function updateLoanStatus(params,callback){
    if(params.loanStatus==2){
        var query = " update loan_info set start_date_id = ? , loan_start_date = ? , loan_status = ? where id = ? " ;
    }else if(params.loanStatus==4){
        var query = " update loan_info set end_date_id = ? , loan_end_date = ? , loan_status = ? where id = ? " ;
    }else{
        var query = " update loan_info set loan_status = ? where id = ? " ;
    }
    var paramsArray=[],i=0;
    if(params.loanStartDate){
        paramsArray[i++] = params.startDateId;
        paramsArray[i++] = params.loanStartDate;
    }
    if(params.loanEndDate){
        paramsArray[i++] = params.endDateId;
        paramsArray[i++] = params.loanEndDate;
    }
    paramsArray[i++]=params.loanStatus;
    paramsArray[i]=params.loanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateLoanStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addLoan : addLoan,
    getLoan : getLoan,
    getLoanList : getLoanList,
    getLoanNotCount : getLoanNotCount,
    getLoanStatDate : getLoanStatDate,
    updateLoan : updateLoan,
    updateMortgageCarCountPlus : updateMortgageCarCountPlus,
    updateMortgageCarCountMinus : updateMortgageCarCountMinus,
    updateMortgageCarCount : updateMortgageCarCount,
    updateBuyCarCountPlus : updateBuyCarCountPlus,
    updateBuyCarCountMinus : updateBuyCarCountMinus,
    updateLoanStatus : updateLoanStatus
}
