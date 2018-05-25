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


module.exports = {
    createLoan : createLoan,
    queryLoan : queryLoan,
    updateLoan : updateLoan,
    updateLoanStatus : updateLoanStatus
}