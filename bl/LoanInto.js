/**
 * Created by zwl on 2018/7/2.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var loanIntoDAO = require('../dao/LoanIntoDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('LoanInto.js');

function createLoanInto(req,res,next){
    var params = req.params ;
    loanIntoDAO.addLoanInto(params,function(error,result){
        if (error) {
            logger.error(' createLoanInto ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createLoanInto ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryLoanInto(req,res,next){
    var params = req.params ;
    loanIntoDAO.getLoanInto(params,function(error,result){
        if (error) {
            logger.error(' queryLoanInto ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoanInto ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryLoanIntoNotCount(req,res,next){
    var params = req.params ;
    loanIntoDAO.getLoanIntoNotCount(params,function(error,result){
        if (error) {
            logger.error(' queryLoanIntoNotCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoanIntoNotCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryLoanIntoStatDate(req,res,next){
    var params = req.params ;
    loanIntoDAO.getLoanIntoStatDate(params,function(error,result){
        if (error) {
            logger.error(' queryLoanIntoStatDate ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoanIntoStatDate ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateLoanInto(req,res,next){
    var params = req.params ;
    loanIntoDAO.updateLoanInto(params,function(error,result){
        if (error) {
            logger.error(' updateLoanInto ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateLoanInto ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateLoanIntoStatus(req,res,next){
    var params = req.params;
    var loanIntoMoney = 0;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    Seq().seq(function(){
        var that = this;
        loanIntoDAO.getLoanInto({loanIntoId:params.loanIntoId},function(error,rows){
            if (error) {
                logger.error(' getLoanInto ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length>0&&rows[0].loan_into_status == sysConst.LOAN_INTO_STATUS.not_loan_into){
                    loanIntoMoney = rows[0].loan_into_money;
                    that();
                }else{
                    that();
                }
            }
        })
    }).seq(function () {
        if(params.loanIntoStatus==sysConst.LOAN_INTO_STATUS.loan_into){
            params.notRepaymentMoney = loanIntoMoney;
            params.startDateId = parseInt(strDate);
            params.loanIntoStartDate = myDate;
        }
        if(params.loanIntoStatus==sysConst.LOAN_INTO_STATUS.completed){
            params.endDateId = parseInt(strDate);
            params.loanIntoEndDate = myDate;
        }
        loanIntoDAO.updateLoanIntoStatus(params,function(error,result){
            if (error) {
                logger.error(' updateLoanIntoStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateLoanIntoStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function getLoanIntoCsv(req,res,next){
    var csvString = "";
    var header = "贷入编号" + ',' + "贷入公司" + ',' + "贷入金额" + ','+ "贷入时间" + ','+ "已还总金额"+ ','+ "未还本金" + ','+ "完结时间" + ',' + "状态" + ',' + "备注";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    loanIntoDAO.getLoanInto(params,function(error,rows){
        if (error) {
            logger.error(' getLoan ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;
                parkObj.companyName = rows[i].company_name;
                parkObj.loanIntoMoney = rows[i].loan_into_money;
                if(rows[i].loan_into_start_date == null){
                    parkObj.loanIntStartDate = "";
                }else{
                    parkObj.loanIntStartDate = new Date(rows[i].loan_into_start_date).toLocaleDateString();
                }
                if(rows[i].repayment_total_money == null){
                    parkObj.repaymentTotalMoney = "";
                }else{
                    parkObj.repaymentTotalMoney = rows[i].repayment_total_money;
                }
                parkObj.notRepaymentMoney = rows[i].not_repayment_money;
                if(rows[i].loan_into_end_date == null){
                    parkObj.loanIntoEndDate = "";
                }else{
                    parkObj.loanIntoEndDate = new Date(rows[i].loan_into_end_date).toLocaleDateString();
                }
                if(rows[i].loan_into_status == 1){
                    parkObj.loanIntoStatus = "未贷";
                }else if(rows[i].loan_into_status == 2){
                    parkObj.loanIntoStatus = "已贷";
                }else if(rows[i].loan_into_status == 3){
                    parkObj.loanIntoStatus = "还款中";
                }else{
                    parkObj.loanIntoStatus = "完结";
                }
                if(rows[i].remark == null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark.replace(/[\r\n]/g, '');
                }
                csvString = csvString+parkObj.id+","+parkObj.companyName+","+parkObj.loanIntoMoney+","+parkObj.loanIntStartDate+","+parkObj.repaymentTotalMoney
                    +","+parkObj.notRepaymentMoney+","+parkObj.loanIntoEndDate+","+parkObj.loanIntoStatus+","+parkObj.remark + '\r\n';
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
    createLoanInto : createLoanInto,
    queryLoanInto : queryLoanInto,
    queryLoanIntoNotCount : queryLoanIntoNotCount,
    queryLoanIntoStatDate : queryLoanIntoStatDate,
    updateLoanInto : updateLoanInto,
    updateLoanIntoStatus : updateLoanIntoStatus,
    getLoanIntoCsv : getLoanIntoCsv
}