/**
 * Created by zwl on 2018/5/21.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var loanRepaymentDAO = require('../dao/LoanRepaymentDAO.js');
var loanDAO = require('../dao/LoanDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('LoanRepayment.js');

function createLoanRepayment(req,res,next){
    var params = req.params ;
    var repaymentId = 0;
    Seq().seq(function(){
        var that = this;
        loanDAO.getLoan({loanId:params.loanId},function(error,rows){
            if (error) {
                logger.error(' getLoan ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length==1&&rows[0].loan_status >= sysConst.LOAN_STATUS.loan){
                    that();
                }else{
                    logger.warn(' getLoan ' + 'failed');
                    resUtil.resetFailedRes(res," 还未放款，无法进行还款 ");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        loanRepaymentDAO.addLoanRepayment(params,function(error,result){
            if (error) {
                logger.error(' createLoanRepayment ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createLoanRepayment ' + 'success');
                    repaymentId = result.insertId;
                }else{
                    logger.warn(' createLoanRepayment ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.loanStatus=sysConst.LOAN_STATUS.repayment;
        loanDAO.updateLoanStatus(params,function(err,result){
            if (err) {
                logger.error(' updateLoanStatus ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateLoanStatus ' + 'success');
                }else{
                    logger.warn(' updateLoanStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createLoanRepayment ' + 'success');
        resUtil.resetCreateRes(res,{insertId:repaymentId},null);
        return next();
    })

}

function queryLoanRepayment(req,res,next){
    var params = req.params ;
    loanRepaymentDAO.getLoanRepayment(params,function(error,result){
        if (error) {
            logger.error(' queryLoanRepayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoanRepayment ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateLoanRepayment(req,res,next){
    var params = req.params;
    loanRepaymentDAO.updateLoanRepayment(params,function(error,result){
        if (error) {
            logger.error(' updateLoanRepayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateLoanRepayment ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateLoanRepaymentStatus(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    params.repaymentEndDate = myDate;
    loanRepaymentDAO.updateLoanRepaymentStatus(params,function(error,result){
        if (error) {
            logger.error(' updateLoanRepaymentStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateLoanRepaymentStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getLoanRepaymentCsv(req,res,next){
    var csvString = "";
    var header = "贷出还款编号" + ',' + "委托方" + ',' + "贷出编号" + ','+ "还款金额" + ','+ "利率(%)"+ ','+ "计息天数"+ ','+ "利息" + ','+ "手续费" + ',' + "还款时间"
        + ',' + "状态" + ',' + "备注";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    loanRepaymentDAO.getLoanRepayment(params,function(error,rows){
        if (error) {
            logger.error(' getLoanRepayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;
                parkObj.shortName = rows[i].short_name;
                parkObj.loanId = rows[i].loan_id;
                parkObj.repaymentMoney = rows[i].repayment_money;
                parkObj.rate = rows[i].rate;
                parkObj.dayCount = rows[i].day_count;
                parkObj.interestMoney = rows[i].interest_money;
                parkObj.fee = rows[i].fee;
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
                csvString = csvString+parkObj.id+","+parkObj.shortName+","+parkObj.loanId+","+parkObj.repaymentMoney+","+parkObj.rate+","+parkObj.dayCount
                    +","+parkObj.interestMoney+","+parkObj.fee+","+parkObj.createdOn +","+parkObj.repaymentStatus+","+parkObj.remark + '\r\n';
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
    createLoanRepayment : createLoanRepayment,
    queryLoanRepayment : queryLoanRepayment,
    updateLoanRepayment : updateLoanRepayment,
    updateLoanRepaymentStatus : updateLoanRepaymentStatus,
    getLoanRepaymentCsv : getLoanRepaymentCsv
}