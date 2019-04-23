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
    var header = "贷出编号" + ',' + "委托方" + ','+ "合同编号" + ','+ "定金" + ','+ "购买车辆数" + ','+
        "贷出金额" + ',' + "贷出时间" + ',' + "未还金额" + ','+ "完结时间" + ','+ "状态"+ ','+ "备注" + ','+
        "VIN" + ',' + "品牌" + ',' + "型号" + ','+ "估值" + ','+ "信用证编号"+ ','+ "手续费" + ','+ "银行服务费" + ',' +
        "仓储订单编号" + ',' + "入库时间" + ','+ "出库时间" + ','+ "合计天数"+ ','+ "实际应付" + ','+ "海运订单编号" + ',' + "海运费用";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    loanDAO.getLoanList(params,function(error,rows){
        if (error) {
            logger.error(' getLoanList ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;
                parkObj.shortName = rows[i].short_name;
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
                if(rows[i].vin == null){
                    parkObj.vin = "";
                }else{
                    parkObj.vin = rows[i].vin;
                }
                if(rows[i].make_name == null){
                    parkObj.makeName = "";
                }else{
                    parkObj.makeName = rows[i].make_name;
                }
                if(rows[i].model_name == null){
                    parkObj.modelName = "";
                }else{
                    parkObj.modelName = rows[i].model_name;
                }
                if(rows[i].valuation == null){
                    parkObj.valuation = "";
                }else{
                    parkObj.valuation = rows[i].valuation;
                }
                if(rows[i].credit_number == null){
                    parkObj.creditNumber = "";
                }else{
                    parkObj.creditNumber = rows[i].credit_number;
                }
                if(rows[i].lc_handling_fee == null){
                    parkObj.lcHandlingFee = "";
                }else{
                    parkObj.lcHandlingFee = rows[i].lc_handling_fee;
                }
                if(rows[i].bank_services_fee == null){
                    parkObj.bankServicesFee = "";
                }else{
                    parkObj.bankServicesFee = rows[i].bank_services_fee;
                }
                if(rows[i].storage_order_id == null){
                    parkObj.storageOrderId = "";
                }else{
                    parkObj.storageOrderId = rows[i].storage_order_id;
                }
                if(rows[i].enter_time == null){
                    parkObj.enterTime = "";
                }else{
                    parkObj.enterTime = new Date(rows[i].enter_time).toLocaleDateString();
                }
                if(rows[i].real_out_time == null){
                    parkObj.realOutTime = "";
                }else{
                    parkObj.realOutTime = new Date(rows[i].real_out_time).toLocaleDateString();
                }
                if(rows[i].day_count == null){
                    parkObj.dayCount = "";
                }else{
                    parkObj.dayCount = rows[i].day_count;
                }
                if(rows[i].actual_fee == null){
                    parkObj.actualFee = "";
                }else{
                    parkObj.actualFee = rows[i].actual_fee;
                }
                if(rows[i].ship_trans_order_id == null){
                    parkObj.shipTransOrderId = "";
                }else{
                    parkObj.shipTransOrderId = rows[i].ship_trans_order_id;
                }
                if(rows[i].total_fee == null){
                    parkObj.totalFee = "";
                }else{
                    parkObj.totalFee = rows[i].total_fee;
                }
                csvString = csvString+parkObj.id+","+parkObj.shortName+","+parkObj.contractNum+","+parkObj.deposit +","+parkObj.buyCarCount+","+
                    parkObj.loanMoney+","+parkObj.loanStartDate+","+parkObj.notRepaymentMoney +","+parkObj.loanEndDate+","+parkObj.loanStatus+","+parkObj.remark+","+
                    parkObj.vin+","+parkObj.makeName+","+parkObj.modelName +","+parkObj.valuation+","+parkObj.creditNumber+","+parkObj.lcHandlingFee+","+ parkObj.bankServicesFee+","+
                    parkObj.storageOrderId+","+parkObj.enterTime +","+parkObj.realOutTime+","+parkObj.dayCount+","+parkObj.actualFee+","+parkObj.shipTransOrderId+","+parkObj.totalFee+ '\r\n';
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