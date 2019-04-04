/**
 * Created by zwl on 2018/5/18.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var loanDAO = require('../dao/LoanDAO.js');
var loanMortgageCarRelDAO = require('../dao/LoanMortgageCarRelDAO.js');
var carStorageRelDAO = require('../dao/CarStorageRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('Loan.js');

function createLoan(req,res,next){
    var params = req.params ;
    params.notRepaymentMoney = params.loanMoney;
    loanDAO.addLoan(params,function(error,result){
        if (error) {
            logger.error(' createLoan ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createLoan ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryLoan(req,res,next){
    var params = req.params ;
    loanDAO.getLoan(params,function(error,result){
        if (error) {
            logger.error(' queryLoan ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoan ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryLoanNotCount(req,res,next){
    var params = req.params ;
    loanDAO.getLoanNotCount(params,function(error,result){
        if (error) {
            logger.error(' queryLoanNotCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoanNotCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryLoanStatDate(req,res,next){
    var params = req.params ;
    loanDAO.getLoanStatDate(params,function(error,result){
        if (error) {
            logger.error(' queryLoanStatDate ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoanStatDate ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateLoan(req,res,next){
    var params = req.params ;
    params.notRepaymentMoney = params.loanMoney;
    loanDAO.updateLoan(params,function(error,result){
        if (error) {
            logger.error(' updateLoan ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateLoan ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateLoanStatus(req,res,next){
    var params = req.params;
    var newMortgageCarFlag  = true;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    var carIds = [] ;
    Seq().seq(function(){
        var that = this;
        if(params.loanStatus==sysConst.LOAN_STATUS.loan){
            params.startDateId = parseInt(strDate);
            params.loanStartDate = myDate;
            loanDAO.updateLoanStatus(params,function(error,result){
                if (error) {
                    logger.error(' updateLoanStatus ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    logger.info(' updateLoanStatus ' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        }else{
            that();
        }
    }).seq(function(){
        var that = this;
        if(params.loanStatus==sysConst.LOAN_STATUS.completed){
            params.endDateId = parseInt(strDate);
            params.loanEndDate = myDate;
            loanDAO.updateLoanStatus(params,function(error,result){
                if (error) {
                    logger.error(' updateLoanStatus ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if(result&&result.affectedRows>0){
                        logger.info(' updateLoanStatus ' + 'success');
                        that();
                    }else{
                        logger.warn(' updateLoanStatus ' + 'failed');
                        resUtil.resetFailedRes(res," 操作状态失败 ");
                        return next();
                    }
                }
            })
        }else{
            logger.warn(' updateLoanStatus ' + 'failed');
            resUtil.resetFailedRes(res," 操作状态错误 ");
            return next();
        }
    }).seq(function(){
        var that = this;
        loanMortgageCarRelDAO.getLoanMortgageCarRel({loanId:params.loanId},function(error,rows){
            if (error) {
                logger.error(' getLoanMortgageCarRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length>0){
                    for(var i = 0 ; i < rows.length; i++){
                        carIds[i] = rows[i].car_id;
                        console.log(carIds);
                    }
                    that();
                }else{
                    logger.warn(' getLoanMortgageCarRel ' + 'failed');
                    newMortgageCarFlag = false;
                    that();
                }
            }
        })
    }).seq(function() {
        var that = this;
        if(newMortgageCarFlag) {
        var rowArray = [];
            rowArray.length = carIds.length;
            Seq(rowArray).seqEach(function (rowObj, i) {
                var that = this;
                var subParams = {
                    mortgageStatus : 1,
                    carId: carIds[i],
                    row: i + 1,
                }
                carStorageRelDAO.updateMortgageStatus(subParams,function (err,result) {
                    if (err) {
                        logger.error('updateMortgageStatus ' + err.stack);
                    } else {
                        if(result&&result.affectedRows>0){
                            logger.info(' updateMortgageStatus ' + 'success');
                        }else{
                            logger.warn(' updateMortgageStatus ' + 'failed');
                        }
                        that(null, i);
                    }
                })
            }).seq(function () {
                that();
            })
        }else{
            that();
        }
    }).seq(function() {
        var that = this;
        if(newMortgageCarFlag) {
            loanMortgageCarRelDAO.deleteLoanMortgageCarRelAll({loanId: params.loanId}, function (error, result) {
                if (error) {
                    logger.error(' removeLoanMortgageCarRelAll ' + error.message);
                    throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if (result && result.affectedRows > 0) {
                        logger.info(' removeLoanMortgageCarRelAll ' + 'success');
                    } else {
                        logger.warn(' removeLoanMortgageCarRelAll ' + 'failed');
                    }
                    that();
                }
            })
        }else{
            that();
        }
    }).seq(function(){
            loanDAO.updateMortgageCarCount(params,function(error,result){
                if (error) {
                    logger.error(' updateMortgageCarCount ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    logger.info(' updateMortgageCarCount ' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
    })
}

function getLoanCsv(req,res,next){
    var csvString = "";
    var header = "贷出编号" + ',' + "委托方" + ',' + "抵押车辆" + ','+ "抵押车值" + ','+ "合同编号" + ','+ "定金"
        + ','+ "购买车辆数" + ','+ "贷出金额" + ',' + "贷出时间" + ',' + "未还金额" + ','+ "完结时间" + ','+ "状态"+ ','+ "备注";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    loanDAO.getLoan(params,function(error,rows){
        if (error) {
            logger.error(' getLoan ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;
                parkObj.shortName = rows[i].short_name;
                parkObj.mortgageCarCount = rows[i].mortgage_car_count;
                if(rows[i].mortgage_valuation == null){
                    parkObj.mortgageValuation = "";
                }else{
                    parkObj.mortgageValuation = rows[i].mortgage_valuation;
                }
                parkObj.contractNum = rows[i].contract_num;
                parkObj.deposit = rows[i].deposit;
                parkObj.buyCarCount = rows[i].buy_car_count;
                parkObj.loanMoney = rows[i].loan_money;
                if(rows[i].loan_start_date == null){
                    parkObj.loanStartDate = "";
                }else{
                    parkObj.loanStartDate = new Date(rows[i].loan_start_date).toLocaleDateString();
                }
                parkObj.notRepaymentMoney = rows[i].not_repayment_money;
                if(rows[i].loan_end_date == null){
                    parkObj.loanEndDate = "";
                }else{
                    parkObj.loanEndDate = new Date(rows[i].loan_end_date).toLocaleDateString();
                }
                if(rows[i].loan_status == 1){
                    parkObj.loanStatus = "未贷";
                }else if(rows[i].loan_status == 2){
                    parkObj.loanStatus = "已贷";
                }else if(rows[i].loan_status == 3){
                    parkObj.loanStatus = "还款中";
                }else{
                    parkObj.loanStatus = "完结";
                }
                if(rows[i].remark == null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark.replace(/[\r\n]/g, '');
                }
                csvString = csvString+parkObj.id+","+parkObj.shortName+","+parkObj.mortgageCarCount+","+parkObj.mortgageValuation+","+parkObj.contractNum
                    +","+parkObj.deposit +","+parkObj.buyCarCount+","+parkObj.loanMoney+","+parkObj.loanStartDate+","+parkObj.notRepaymentMoney +","+parkObj.loanEndDate
                    +","+parkObj.loanStatus+","+parkObj.remark + '\r\n';
            }
            var csvBuffer = new Buffer(csvString,'utf8');
            res.set('content-type', 'application/csv');
            res.set('charset', 'utf8');
            res.set('content-length', csvBuffer.length);
            res.writeHead(200);
            res.write(csvBuffer);//TODO
            res.end();
            return next(false);
        }
    })
}


module.exports = {
    createLoan : createLoan,
    queryLoan : queryLoan,
    queryLoanNotCount : queryLoanNotCount,
    queryLoanStatDate : queryLoanStatDate,
    updateLoan : updateLoan,
    updateLoanStatus : updateLoanStatus,
    getLoanCsv : getLoanCsv
}