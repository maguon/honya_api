/**
 * Created by zwl on 2018/7/3.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var loanIntoRepaymentDAO = require('../dao/LoanIntoRepaymentDAO.js');
var loanIntoDAO = require('../dao/LoanIntoDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('LoanIntoRepayment.js');

function createLoanIntoRepayment(req,res,next){
    var params = req.params ;
    var repaymentId = 0;
    Seq().seq(function(){
        var that = this;
        loanIntoDAO.getLoanInto({loanIntoId:params.loanIntoId},function(error,rows){
            if (error) {
                logger.error(' getLoanInto ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length==1&&rows[0].loan_into_status >= sysConst.LOAN_INTO_STATUS.loan_into){
                    that();
                }else{
                    logger.warn(' getLoanInto ' + 'failed');
                    resUtil.resetFailedRes(res," 还未放款，无法进行还款 ");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        loanIntoRepaymentDAO.addLoanIntoRepayment(params,function(error,result){
            if (error) {
                logger.error(' createLoanIntoRepayment ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createLoanIntoRepayment ' + 'success');
                    repaymentId = result.insertId;
                }else{
                    logger.warn(' createLoanIntoRepayment ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.loanIntoStatus=sysConst.LOAN_INTO_STATUS.repayment;
        loanIntoDAO.updateLoanIntoStatus(params,function(err,result){
            if (err) {
                logger.error(' updateLoanIntoStatus ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateLoanIntoStatus ' + 'success');
                }else{
                    logger.warn(' updateLoanIntoStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createLoanIntoRepayment ' + 'success');
        resUtil.resetCreateRes(res,{insertId:repaymentId},null);
        return next();
    })
}

function queryLoanIntoRepayment(req,res,next){
    var params = req.params ;
    loanIntoRepaymentDAO.getLoanIntoRepayment(params,function(error,result){
        if (error) {
            logger.error(' queryLoanIntoRepayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoanIntoRepayment ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateLoanIntoRepayment(req,res,next){
    var params = req.params;
    loanIntoRepaymentDAO.updateLoanIntoRepayment(params,function(error,result){
        if (error) {
            logger.error(' updateLoanIntoRepayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateLoanIntoRepayment ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateLoanIntoRepaymentStatus(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    params.repaymentEndDate = myDate;
    loanIntoRepaymentDAO.updateLoanIntoRepaymentStatus(params,function(error,result){
        if (error) {
            logger.error(' updateLoanIntoRepaymentStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateLoanIntoRepaymentStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getLoanIntoRepaymentCsv(req,res,next){
    var csvString = "";
    var header = "贷入还款编号" + ',' + "贷入公司" + ',' + "贷入编号" + ','+ "归还本金" + ','+ "利率(%)"+ ','+ "计息天数"+ ','+ "利息" + ','+ "手续费" + ',' + "实际还款金额"
        + ',' + "还款时间"+ ',' + "状态" + ',' + "备注";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    loanIntoRepaymentDAO.getLoanIntoRepayment(params,function(error,rows){
        if (error) {
            logger.error(' getLoanIntoRepayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;
                parkObj.companyName = rows[i].company_name;
                parkObj.loanIntoId = rows[i].loan_into_id;
                parkObj.repaymentMoney = rows[i].repayment_money;
                parkObj.rate = rows[i].rate;
                parkObj.dayCount = rows[i].day_count;
                parkObj.interestMoney = rows[i].interest_money;
                parkObj.fee = rows[i].fee;
                parkObj.repaymentTotalMoney = rows[i].repayment_total_money;
                parkObj.createdOn = new Date(rows[i].created_on).toLocaleDateString();
                if(rows[i].repayment_status == 1){
                    parkObj.repaymentStatus = "未完结";
                }else{
                    parkObj.repaymentStatus = "已完结";
                }
                if(rows[i].remark == null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark;
                }
                csvString = csvString+parkObj.id+","+parkObj.companyName+","+parkObj.loanIntoId+","+parkObj.repaymentMoney+","+parkObj.rate+","+parkObj.dayCount
                    +","+parkObj.interestMoney+","+parkObj.fee+","+parkObj.repaymentTotalMoney+","+parkObj.createdOn +","+parkObj.repaymentStatus+","+parkObj.remark + '\r\n';
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
    createLoanIntoRepayment : createLoanIntoRepayment,
    queryLoanIntoRepayment : queryLoanIntoRepayment,
    updateLoanIntoRepayment : updateLoanIntoRepayment,
    updateLoanIntoRepaymentStatus : updateLoanIntoRepaymentStatus,
    getLoanIntoRepaymentCsv : getLoanIntoRepaymentCsv
}