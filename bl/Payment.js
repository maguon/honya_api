/**
 * Created by zwl on 2018/4/12.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var paymentDAO = require('../dao/PaymentDAO.js');
var orderPaymentRelDAO = require('../dao/PaymentStorageOrderRelDAO.js');
var storageOrderDAO = require('../dao/StorageOrderDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('Payment.js');

function createPayment(req,res,next){
    var params = req.params ;
    var paymentId = 0;
    Seq().seq(function(){
        var that = this;
        paymentDAO.addPayment(params,function(error,result){
            if (error) {
                logger.error(' createPayment ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createPayment ' + 'success');
                    paymentId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create payment failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        var storageOrderIds = params.storageOrderIds;
        var rowArray = [] ;
        rowArray.length= storageOrderIds.length;
        Seq(rowArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                paymentId : paymentId,
                storageOrderId : storageOrderIds[i],
                row : i+1,
            }
            orderPaymentRelDAO.addPaymentStorageOrderRel(subParams,function(err,result){
                if (err) {
                    if(err.message.indexOf("Duplicate") > 0) {
                        resUtil.resetFailedRes(res, "订单已经被关联，操作失败");
                        return next();
                    } else{
                        logger.error(' createPaymentStorageOrderRel ' + err.message);
                        throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    }
                } else {
                    if(result&&result.insertId>0){
                        logger.info(' createPaymentStorageOrderRel ' + 'success');
                    }else{
                        logger.warn(' createPaymentStorageOrderRel ' + 'failed');
                    }
                    that(null,i);
                }
            })
        }).seq(function(){
            that();
        })
    }).seq(function () {
        var that = this;
        var storageOrderIds = params.storageOrderIds;
        var rowArray = [] ;
        rowArray.length= storageOrderIds.length;
        Seq(rowArray).seqEach(function (rowObj, i) {
            var that = this;
            var subParams = {
                orderStatus : sysConst.ORDER_STATUS.payment,
                storageOrderId : storageOrderIds[i],
                row: i + 1,
            }
            storageOrderDAO.updateStorageOrderStatus(subParams,function (err,result) {
                if (err) {
                    logger.error('updateStorageOrderStatus ' + err.stack);
                } else {
                    if(result&&result.affectedRows>0){
                        logger.info(' updateStorageOrderStatus ' + 'success');
                    }else{
                        logger.warn(' updateStorageOrderStatus ' + 'failed');
                    }
                    that(null, i);
                }
            })
        }).seq(function () {
            that();
        })
    }).seq(function(){
        logger.info(' createPayment ' + 'success');
        resUtil.resetCreateRes(res,{insertId:paymentId},null);
        return next();
    })
}

function createPaymentOrder(req,res,next){
    var params = req.params ;
    paymentDAO.addPayment(params,function(error,result){
        if (error) {
            logger.error(' createPaymentOrder ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createPaymentOrder ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryPayment(req,res,next){
    var params = req.params ;
    paymentDAO.getPayment(params,function(error,result){
        if (error) {
            logger.error(' queryPayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryPayment ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updatePayment(req,res,next){
    var params = req.params ;
    paymentDAO.updatePayment(params,function(error,result){
        if (error) {
            logger.error(' updatePayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updatePayment ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updatePaymentStatus(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    params.paymentEndDate = myDate;
    paymentDAO.updatePaymentStatus(params,function(error,result){
        if (error) {
            logger.error(' updatePaymentStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updatePaymentStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function queryPaymentCount(req,res,next){
    var params = req.params ;
    paymentDAO.getPaymentCount(params,function(error,result){
        if (error) {
            logger.error(' queryPaymentCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryPaymentCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function getPaymentCsv(req,res,next){
    var csvString = "";
    var header = "支付编号" + ',' + "委托方" + ',' + "委托方性质" + ',' + "支付金额(美元)" + ','+ "支付方式" + ','+ "票号"+ ','+ "支付时间" + ','+ "支付状态" + ','+ "完结时间"
                             + ','+ "操作人" + ','+ "备注";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    paymentDAO.getPayment(params,function(error,rows){
        if (error) {
            logger.error(' getPayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){

                parkObj.id = rows[i].id;
                parkObj.shortName = rows[i].short_name;
                if(rows[i].entrust_type == 1){
                    parkObj.entrustType = "个人";
                }else{
                    parkObj.entrustType = "企业";
                }
                parkObj.paymentMoney = rows[i].payment_money;
                if(rows[i].payment_type == 1){
                    parkObj.paymentType = "支票";
                }else{
                    parkObj.paymentType = "电汇";
                }
                parkObj.number = rows[i].number;
                if(rows[i].created_on == null){
                    parkObj.createdOn = "";
                }else{
                    parkObj.createdOn = new Date(rows[i].created_on).toLocaleDateString();
                }
                if(rows[i].payment_status == 1){
                    parkObj.paymentStatus = "未完结";
                }else{
                    parkObj.paymentStatus = "已完结";
                }
                if(rows[i].payment_end_date == null){
                    parkObj.paymentEndDate = "";
                }else{
                    parkObj.paymentEndDate = new Date(rows[i].payment_end_date).toLocaleDateString();
                }
                parkObj.paymentUserName = rows[i].payment_user_name;
                parkObj.remark = rows[i].remark;
                csvString = csvString+parkObj.id+","+parkObj.shortName+","+parkObj.entrustType+","+parkObj.paymentMoney+","+parkObj.paymentType
                    +","+parkObj.number+","+parkObj.createdOn+","+parkObj.paymentStatus+","+parkObj.paymentEndDate+","+parkObj.paymentUserName
                    +","+parkObj.remark+ '\r\n';
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
    createPayment : createPayment,
    createPaymentOrder : createPaymentOrder,
    queryPayment : queryPayment,
    updatePayment : updatePayment,
    updatePaymentStatus : updatePaymentStatus,
    queryPaymentCount : queryPaymentCount,
    getPaymentCsv : getPaymentCsv
}
