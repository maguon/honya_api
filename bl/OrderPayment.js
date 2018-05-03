/**
 * Created by zwl on 2018/4/12.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var orderPaymentDAO = require('../dao/OrderPaymentDAO.js');
var orderPaymentRelDAO = require('../dao/OrderPaymentRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('OrderPayment.js');

function createPayment(req,res,next){
    var params = req.params ;
    var orderPaymentId = 0;
    Seq().seq(function(){
        var that = this;
        orderPaymentDAO.addOrderPayment(params,function(error,result){
            if (error) {
                logger.error(' createPayment ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createPayment ' + 'success');
                    orderPaymentId = result.insertId;
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
                orderPaymentId : orderPaymentId,
                storageOrderId : storageOrderIds[i],
                row : i+1,
            }
            orderPaymentRelDAO.addOrderPaymentRel(subParams,function(err,result){
                if (err) {
                    if(err.message.indexOf("Duplicate") > 0) {
                        resUtil.resetFailedRes(res, "订单已经被关联，操作失败");
                        return next();
                    } else{
                        logger.error(' createOrderPaymentRel ' + err.message);
                        throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    }
                } else {
                    if(result&&result.insertId>0){
                        logger.info(' createOrderPaymentRel ' + 'success');
                    }else{
                        logger.warn(' createOrderPaymentRel ' + 'failed');
                    }
                    that(null,i);
                }
            })
        }).seq(function(){
            that();
        })
    }).seq(function(){
        logger.info(' createOrderPaymentRel ' + 'success');
        resUtil.resetCreateRes(res,{insertId:orderPaymentId},null);
        return next();
    })
}

function createOrderPayment(req,res,next){
    var params = req.params ;
    orderPaymentDAO.addOrderPayment(params,function(error,result){
        if (error) {
            logger.error(' createOrderPayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createOrderPayment ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryOrderPayment(req,res,next){
    var params = req.params ;
    orderPaymentDAO.getOrderPayment(params,function(error,result){
        if (error) {
            logger.error(' queryOrderPayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryOrderPayment ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateOrderPayment(req,res,next){
    var params = req.params ;
    orderPaymentDAO.updateOrderPayment(params,function(error,result){
        if (error) {
            logger.error(' updateOrderPayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateOrderPayment ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateOrderPaymentStatus(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    params.paymentEndDate = myDate;
    orderPaymentDAO.updateOrderPaymentStatus(params,function(error,result){
        if (error) {
            logger.error(' updateOrderPaymentStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateOrderPaymentStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function queryOrderPaymentCount(req,res,next){
    var params = req.params ;
    orderPaymentDAO.getOrderPaymentCount(params,function(error,result){
        if (error) {
            logger.error(' queryOrderPaymentCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryOrderPaymentCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function getOrderPaymentCsv(req,res,next){
    var csvString = "";
    var header = "支付编号" + ',' + "委托方" + ',' + "委托方性质" + ',' + "支付金额(美元)" + ','+ "支付方式" + ','+ "票号"+ ','+ "支付时间" + ','+ "支付状态" + ','+ "完结时间"
                             + ','+ "操作人" + ','+ "备注";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    orderPaymentDAO.getOrderPayment(params,function(error,rows){
        if (error) {
            logger.error(' getOrderPayment ' + error.message);
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
    createOrderPayment : createOrderPayment,
    queryOrderPayment : queryOrderPayment,
    updateOrderPayment : updateOrderPayment,
    updateOrderPaymentStatus : updateOrderPaymentStatus,
    queryOrderPaymentCount : queryOrderPaymentCount,
    getOrderPaymentCsv : getOrderPaymentCsv
}
