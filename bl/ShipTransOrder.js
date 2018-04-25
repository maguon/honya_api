/**
 * Created by zwl on 2018/4/20.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var shipTransDAO = require('../dao/ShipTransDAO.js');
var shipTransOrderDAO = require('../dao/ShipTransOrderDAO.js');
var shipTransCarRelDAO = require('../dao/ShipTransCarRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ShipTransOrder.js');

function createShipTransOrder(req,res,next){
    var params = req.params ;
    var shipTransId = 0;
    var shipTransOrderId = 0;
    Seq().seq(function(){
        var that = this;
        if(params.carIds.length==0){
            logger.warn(' createShipTransOrder ' + 'failed');
            resUtil.resetFailedRes(res," 未关联VIN码，保存失败 ");
            return next();
        }
        shipTransDAO.addShipTrans(params,function(error,result){
            if (error) {
                logger.error(' createShipTrans ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createShipTrans ' + 'success');
                    shipTransId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create shipTrans failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        params.shipTransId = shipTransId;
        shipTransOrderDAO.addShipTransOrder(params,function(error,result){
            if (error) {
                logger.error(' createShipTransOrder ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createShipTransOrder ' + 'success');
                    shipTransOrderId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create shipTransOrder failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        var carIds = params.carIds;
        var shipTransFees = params.shipTransFees;
        var rowArray = [] ;
        rowArray.length= carIds.length;
        rowArray.length= shipTransFees.length;
        Seq(rowArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                shipTransId : shipTransId,
                carId : carIds[i],
                shipTransFee : shipTransFees[i],
                row : i+1,
            }
            shipTransCarRelDAO.addShipTransCarRel(subParams,function(err,result){
                if (err) {
                    if(err.message.indexOf("Duplicate") > 0) {
                        resUtil.resetFailedRes(res, "商品车已经被关联，操作失败");
                        return next();
                    } else{
                        logger.error(' createShipTransOrder ' + err.message);
                        throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    }
                } else {
                    if(result&&result.insertId>0){
                        logger.info(' createShipTransOrder ' + 'success');
                    }else{
                        logger.warn(' createShipTransOrder ' + 'failed');
                    }
                    that(null,i);
                }
            })
        }).seq(function(){
            that();
        })
    }).seq(function(){
        logger.info(' createShipTransOrder ' + 'success');
        resUtil.resetCreateRes(res,{insertId:shipTransOrderId},null);
        return next();
    })
}

function queryShipTransOrder(req,res,next){
    var params = req.params ;
    shipTransOrderDAO.getShipTransOrder(params,function(error,result){
        if (error) {
            logger.error(' queryShipTransOrder ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryShipTransOrder ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateShipTransOrderFee(req,res,next){
    var params = req.params ;
    shipTransOrderDAO.updateShipTransOrderFee(params,function(error,result){
        if (error) {
            logger.error(' updateShipTransOrderFee ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateShipTransOrderFee ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateShipTransOrderStatus(req,res,next){
    var params = req.params ;
    shipTransOrderDAO.updateShipTransOrderStatus(params,function(error,result){
        if (error) {
            logger.error(' updateShipTransOrderStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateShipTransOrderStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getShipTransOrderCsv(req,res,next){
    var csvString = "";
    var header = "订单编号" + ',' + "VIN" + ',' + "制造商" + ','+ "型号" + ','+ "车辆年份"+ ','+ "车价(美元)" + ','+ "船公司" + ','+ "船名"
        + ','+ "始发港口"+ ','+ "目的港口" + ','+ "货柜"+ ',' + "开船日期" + ',' + "到港日期" + ','+ "委托方" + ','+ "支付状态";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    shipTransOrderDAO.getShipTransOrder(params,function(error,rows){
        if (error) {
            logger.error(' getShipTransOrder ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){

                parkObj.id = rows[i].id;
                parkObj.vin = rows[i].vin;
                parkObj.makeName = rows[i].make_name;
                parkObj.modelName = rows[i].model_name;
                if(rows[i].pro_date == null){
                    parkObj.proDate = "";
                }else{
                    parkObj.proDate = new Date(rows[i].pro_date).toLocaleDateString();
                }
                parkObj.valuation = rows[i].valuation;
                parkObj.shipCompanyName = rows[i].ship_company_name;
                parkObj.shipName = rows[i].ship_name;
                parkObj.startPortName = rows[i].start_port_name;
                parkObj.endPortName = rows[i].end_port_name;
                parkObj.container = rows[i].container;
                parkObj.startShipDate = new Date(rows[i].start_ship_date).toLocaleDateString();
                parkObj.endShipDate = new Date(rows[i].end_ship_date).toLocaleDateString();
                parkObj.shortName = rows[i].short_name;
                if(rows[i].order_status == 1){
                    parkObj.orderStatus = "未支付";
                }else{
                    parkObj.orderStatus = "已支付";
                }
                csvString = csvString+parkObj.id+","+parkObj.vin+","+parkObj.makeName+","+parkObj.modelName+","+parkObj.proDate
                    +","+parkObj.valuation+","+parkObj.shipCompanyName+","+parkObj.shipName+","+parkObj.startPortName+","+parkObj.endPortName
                    +","+parkObj.container+","+parkObj.startShipDate+","+parkObj.endShipDate+","+parkObj.shortName+","+parkObj.orderStatus+ '\r\n';
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
    createShipTransOrder : createShipTransOrder,
    queryShipTransOrder : queryShipTransOrder,
    updateShipTransOrderFee : updateShipTransOrderFee,
    updateShipTransOrderStatus : updateShipTransOrderStatus,
    getShipTransOrderCsv : getShipTransOrderCsv
}