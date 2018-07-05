/**
 * Created by zwl on 2018/6/4.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanIntoCompanyDAO.js');

function addLoanIntoCompany(params,callback){
    var query = " insert into loan_into_company_info (company_name,base_money,contacts,tel,email,remark) values ( ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.companyName;
    paramsArray[i++]=params.baseMoney;
    paramsArray[i++]=params.contacts;
    paramsArray[i++]=params.tel;
    paramsArray[i++]=params.email;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addLoanIntoCompany ');
        return callback(error,rows);
    });
}

function getLoanIntoCompany(params,callback) {
    var query = " select * from loan_into_company_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.loanIntoCompanyId){
        paramsArray[i++] = params.loanIntoCompanyId;
        query = query + " and id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getLoanIntoCompany ');
        return callback(error,rows);
    });
}

function getLoanIntoCompanyTotalMoney(params,callback) {
    var query = " select sum(lic.base_money) as company_total_money  from loan_into_company_info lic where lic.id is not null ";
    var paramsArray=[],i=0;
    if(params.companyStatus){
        paramsArray[i++] = params.companyStatus;
        query = query + " and lic.company_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getLoanIntoCompanyTotalMoney ');
        return callback(error,rows);
    });
}

function updateLoanIntoCompany(params,callback){
    var query = " update loan_into_company_info set company_name = ? , base_money = ? , contacts = ? , tel = ? , email = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.companyName;
    paramsArray[i++]=params.baseMoney;
    paramsArray[i++]=params.contacts;
    paramsArray[i++]=params.tel;
    paramsArray[i++]=params.email;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.loanIntoCompanyId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateLoanIntoCompany ');
        return callback(error,rows);
    });
}

function updateLoanIntoCompanyStatus(params,callback){
    var query = " update loan_into_company_info set company_status = ? where id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.companyStatus;
    paramsArray[i] = params.loanIntoCompanyId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateLoanIntoCompanyStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addLoanIntoCompany : addLoanIntoCompany,
    getLoanIntoCompany : getLoanIntoCompany,
    getLoanIntoCompanyTotalMoney : getLoanIntoCompanyTotalMoney,
    updateLoanIntoCompany : updateLoanIntoCompany,
    updateLoanIntoCompanyStatus : updateLoanIntoCompanyStatus
}
