/**
 * Created by zwl on 2018/4/12.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var storageOrderDAO = require('../dao/StorageOrderDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageOrder.js');

function queryStorageOrder(req,res,next){
    var params = req.params ;
    storageOrderDAO.getStorageOrder(params,function(error,result){
        if (error) {
            logger.error(' queryStorageOrder ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageOrder ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateStorageOrderActualFee(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        storageOrderDAO.getStorageOrder(params,function(error,rows){
            if (error) {
                logger.error(' getStorageOrder ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length >0&&rows[0].payment_status == sysConst.PAYMENT_STATUS.completed){
                    logger.warn(' getStorageOrder ' + 'failed');
                    resUtil.resetFailedRes(res," 订单支付已完结，不能进行修改 ");
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function () {
        storageOrderDAO.updateStorageOrderActualFee(params,function(error,result){
            if (error) {
                logger.error(' updateStorageOrderActualFee ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateStorageOrderActualFee ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function updateStorageOrderStatus(req,res,next){
    var params = req.params ;
    storageOrderDAO.updateStorageOrderStatus(params,function(error,result){
        if (error) {
            logger.error(' updateStorageOrderStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateStorageOrderStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function queryStorageOrderCount(req,res,next){
    var params = req.params ;
    storageOrderDAO.getStorageOrderCount(params,function(error,result){
        if (error) {
            logger.error(' queryStorageOrderCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageOrderCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function getStorageOrderCsv(req,res,next){
    var csvString = "";
    var header = "订单编号" + ',' + "VIN" + ',' + "制造商" + ','+ "型号" + ','+ "委托方"+ ','+ "入库时间" + ','+ "出库时间" + ','+ "合计天数"
        + ','+ "预计支付"+ ','+ "实际应付" + ','+ "订单状态";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    storageOrderDAO.getStorageOrder(params,function(error,rows){
        if (error) {
            logger.error(' getShipTransOrder ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){

                parkObj.id = rows[i].id;
                parkObj.vin = rows[i].vin;
                parkObj.makeName = rows[i].make_name;
                parkObj.modelName = rows[i].model_name;
                parkObj.shortName = rows[i].short_name;
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
                parkObj.dayCount = rows[i].day_count;
                parkObj.planFee = rows[i].plan_fee;
                parkObj.actualFee = rows[i].actual_fee;
                if(rows[i].order_status == 1){
                    parkObj.orderStatus = "未支付";
                }else{
                    parkObj.orderStatus = "已支付";
                }
                csvString = csvString+parkObj.id+","+parkObj.vin+","+parkObj.makeName+","+parkObj.modelName+","+parkObj.shortName
                    +","+parkObj.enterTime+","+parkObj.realOutTime+","+parkObj.dayCount+","+parkObj.planFee+","+parkObj.actualFee
                    +","+parkObj.orderStatus+ '\r\n';
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
    queryStorageOrder : queryStorageOrder,
    updateStorageOrderActualFee : updateStorageOrderActualFee,
    updateStorageOrderStatus : updateStorageOrderStatus,
    queryStorageOrderCount : queryStorageOrderCount,
    getStorageOrderCsv : getStorageOrderCsv
}
