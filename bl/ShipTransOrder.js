/**
 * Created by zwl on 2018/4/20.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var shipTransOrderDAO = require('../dao/ShipTransOrderDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ShipTransOrder.js');

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

function queryInvoiceShipTransOrderList(req,res,next){
    var params = req.params ;
    shipTransOrderDAO.getInvoiceShipTransOrderList(params,function(error,result){
        if (error) {
            logger.error(' queryInvoiceShipTransOrderList ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryInvoiceShipTransOrderList ' + 'success');
            resUtil.resetQueryRes(res,result,null);
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
        + ','+ "始发港口"+ ','+ "目的港口" + ','+ "货柜"+ ',' + "预计开船日期" + ',' + "预计到港日期"+ ',' + "实际开船日期" + ',' + "实际到港日期"
        + ','+ "委托方" + ','+ "支付状态";
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
                    parkObj.proDate = rows[i].pro_date;
                }
                parkObj.valuation = rows[i].valuation;
                parkObj.shipCompanyName = rows[i].ship_company_name;
                parkObj.shipName = rows[i].ship_name;
                parkObj.startPortName = rows[i].start_port_name;
                parkObj.endPortName = rows[i].end_port_name;
                parkObj.container = rows[i].container;
                if(rows[i].start_ship_date == null){
                    parkObj.startShipDate = "";
                }else{
                    parkObj.startShipDate = new Date(rows[i].start_ship_date).toLocaleDateString();
                }
                if(rows[i].end_ship_date == null){
                    parkObj.endShipDate = "";
                }else{
                    parkObj.endShipDate = new Date(rows[i].end_ship_date).toLocaleDateString();
                }
                if(rows[i].actual_start_date == null){
                    parkObj.actualStartDate = "";
                }else{
                    parkObj.actualStartDate = new Date(rows[i].actual_start_date).toLocaleDateString();
                }
                if(rows[i].actual_end_date == null){
                    parkObj.actualEndDate = "";
                }else{
                    parkObj.actualEndDate = new Date(rows[i].actual_end_date).toLocaleDateString();
                }
                parkObj.shortName = rows[i].short_name;
                if(rows[i].order_status == 1){
                    parkObj.orderStatus = "未支付";
                }else{
                    parkObj.orderStatus = "已支付";
                }
                csvString = csvString+parkObj.id+","+parkObj.vin+","+parkObj.makeName+","+parkObj.modelName+","+parkObj.proDate
                    +","+parkObj.valuation+","+parkObj.shipCompanyName+","+parkObj.shipName+","+parkObj.startPortName+","+parkObj.endPortName
                    +","+parkObj.container+","+parkObj.startShipDate+","+parkObj.endShipDate+","+parkObj.actualStartDate+","+parkObj.actualEndDate
                    +","+parkObj.shortName+","+parkObj.orderStatus+ '\r\n';
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

function queryShipTransOrderCount(req,res,next){
    var params = req.params ;
    shipTransOrderDAO.getShipTransOrderCount(params,function(error,result){
        if (error) {
            logger.error(' queryShipTransOrderCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryShipTransOrderCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryShipTransOrder : queryShipTransOrder,
    queryInvoiceShipTransOrderList : queryInvoiceShipTransOrderList,
    updateShipTransOrderStatus : updateShipTransOrderStatus,
    getShipTransOrderCsv : getShipTransOrderCsv,
    queryShipTransOrderCount : queryShipTransOrderCount
}