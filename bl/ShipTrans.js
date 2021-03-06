/**
 * Created by zwl on 2018/4/20.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var shipTransDAO = require('../dao/ShipTransDAO.js');
var shipTransCarRelDAO = require('../dao/ShipTransCarRelDAO.js');
var sysRecordDAO = require('../dao/SysRecordDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('ShipTrans.js');

function createShipTrans(req,res,next){
    var params = req.params ;
    shipTransDAO.addShipTrans(params,function(error,result){
        if (error) {
            logger.error(' createShipTrans ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createShipTrans ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryShipTrans(req,res,next){
    var params = req.params ;
    shipTransDAO.getShipTrans(params,function(error,result){
        if (error) {
            logger.error(' queryShipTrans ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryShipTrans ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateShipTrans(req,res,next){
    var params = req.params ;
    shipTransDAO.updateShipTrans(params,function(error,result){
        if (error) {
            logger.error(' updateShipTrans ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateShipTrans ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateShipTransStatus(req,res,next){
    var params = req.params ;
    var carIds = [] ;
    var vins = [] ;
    Seq().seq(function(){
        var that = this;
        shipTransCarRelDAO.getShipTransCarRel({shipTransId	:params.shipTransId	},function(error,rows){
            if (error) {
                logger.error(' getShipTransCarRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length>0){
                        for(var i = 0 ; i < rows.length; i++){
                            carIds[i] = rows[i].car_id;
                            vins[i] = rows[i].vin;
                            console.log(carIds,vins);
                        }
                    that();
                }else{
                    logger.warn(' getShipTransCarRel ' + 'failed');
                    that();
                }
            }
        })
    }).seq(function() {
        var that = this;
        var rowArray = [];
        if(params.shipTransStatus==2){
            rowArray.length = carIds.length;
            rowArray.length = vins.length;
            Seq(rowArray).seqEach(function (rowObj, i) {
                var that = this;
                var subParams = {
                    userId: params.userId,
                    userType: req.headers['user-type'] || 9,
                    username: req.headers['user-name'] || 'admin',
                    content: " 海运发出 编号 " + params.shipTransId,
                    op: 32,
                    carId: carIds[i],
                    vin: vins[i],
                    row: i + 1,
                }
                sysRecordDAO.addRecord(req, subParams, function (err, result) {
                    if (err) {
                        logger.error('saveCarRecord ' + err.stack);
                    } else {
                        if (result && result.insertId > 0) {
                            logger.info(' saveCarRecord ' + 'success');
                        } else {
                            logger.warn(' saveCarRecord ' + 'failed');
                        }
                        that(null, i);
                    }
                })
            }).seq(function () {
                that();
            })
    }else{
            rowArray.length = carIds.length;
            rowArray.length = vins.length;
            Seq(rowArray).seqEach(function (rowObj, i) {
                var that = this;
                var subParams = {
                    userId: params.userId,
                    userType: req.headers['user-type'] || 9,
                    username: req.headers['user-name'] || 'admin',
                    content: " 海运到达 编号 " + params.shipTransId,
                    op: 33,
                    carId: carIds[i],
                    vin: vins[i],
                    row: i + 1,
                }
                sysRecordDAO.addRecord(req, subParams, function (err, result) {
                    if (err) {
                        logger.error('saveCarRecord ' + err.stack);
                    } else {
                        if (result && result.insertId > 0) {
                            logger.info(' saveCarRecord ' + 'success');
                        } else {
                            logger.warn(' saveCarRecord ' + 'failed');
                        }
                        that(null, i);
                    }
                })
            }).seq(function () {
                that();
            })
        }
    }).seq(function(){
        var myDate = new Date();
        var strDate = moment(myDate).format('YYYYMMDD');
        if(params.shipTransStatus==2){
            params.startDateId = parseInt(strDate);
            params.actualStartDate = myDate;
            shipTransDAO.updateShipTransStatusStart(params,function(error,result){
                if (error) {
                    logger.error(' updateShipTransStatus ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    logger.info(' updateShipTransStatus ' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        }else{
            params.endDateId = parseInt(strDate);
            params.actualEndDate = myDate;
            shipTransDAO.updateShipTransStatusEnd(params,function(error,result){
                if (error) {
                    logger.error(' updateShipTransStatus ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    logger.info(' updateShipTransStatus ' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        }
    })
}

function getShipTransCsv(req,res,next){
    var csvString = "";
    var header = "海运编号" + ',' + "始发港口" + ',' + "目的港口" + ','+ "船公司" + ','+ "船名"+ ','+ "货柜" + ','+ "装载数" + ',' + "预计开船日期" + ',' + "预计到港日期"
        + ',' + "实际开船日期" + ',' + "实际到港日期" + ','+ "是否分单" + ','+ "运送状态" + ','+ "生成时间" + ','+ "备注"
        + ','+ "VIN"+ ','+ "制造商"+ ','+ "型号"+ ','+ "车辆年份"+ ','+ "车价(美元)"+ ','+ "委托方"+ ','+ "运费(美元)"+ ','+ "订单状态";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    shipTransDAO.getShipTrans(params,function(error,rows){
        if (error) {
            logger.error(' getShipTrans ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){

                parkObj.id = rows[i].id;
                parkObj.startPortName = rows[i].start_port_name;
                parkObj.endPortName = rows[i].end_port_name;
                parkObj.shipCompanyName = rows[i].ship_company_name;
                parkObj.shipName = rows[i].ship_name;
                parkObj.container = rows[i].container;
                parkObj.shipTransCount = rows[i].ship_trans_count;
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
                if(rows[i].part_status == 1){
                    parkObj.partStatus = "否";
                }else{
                    parkObj.partStatus = "是";
                }
                if(rows[i].ship_trans_status == 1){
                    parkObj.shipTransStatus = "待出发";
                }else if(rows[i].ship_trans_status == 2){
                    parkObj.shipTransStatus = "已出发";
                }else{
                    parkObj.shipTransStatus = "已到达";
                }
                parkObj.createdOn = new Date(rows[i].created_on).toLocaleDateString();
                if(rows[i].remark == null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark;
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
                if(rows[i].pro_date == null){
                    parkObj.proDate = "";
                }else{
                    parkObj.proDate = rows[i].pro_date;
                }
                if(rows[i].valuation == null){
                    parkObj.valuation = "";
                }else{
                    parkObj.valuation = rows[i].valuation;
                }
                if(rows[i].short_name == null){
                    parkObj.shortName = "";
                }else{
                    parkObj.shortName = rows[i].short_name;
                }
                if(rows[i].total_fee == null){
                    parkObj.totalFee = "";
                }else{
                    parkObj.totalFee = rows[i].total_fee;
                }
                if(rows[i].order_status == 1){
                    parkObj.orderStatus = "未支付";
                }else{
                    parkObj.orderStatus = "已支付";
                }
                csvString = csvString+parkObj.id+","+parkObj.startPortName+","+parkObj.endPortName+","+parkObj.shipCompanyName+","+parkObj.shipName
                    +","+parkObj.container+","+parkObj.shipTransCount+","+parkObj.startShipDate+","+parkObj.endShipDate +","+parkObj.actualStartDate
                    +","+parkObj.actualEndDate +","+parkObj.partStatus+","+parkObj.shipTransStatus+","+parkObj.createdOn+","+parkObj.remark
                    +","+parkObj.vin+","+parkObj.makeName+","+parkObj.modelName+","+parkObj.proDate +","+parkObj.valuation+","+parkObj.shortName
                    +","+parkObj.totalFee+","+parkObj.orderStatus+ '\r\n';
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

function queryShipTransStatDate(req,res,next){
    var params = req.params ;
    shipTransDAO.getShipTransStatDate(params,function(error,result){
        if (error) {
            logger.error(' queryShipTransStatDate ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryShipTransStatDate ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryShipTransCount(req,res,next){
    var params = req.params ;
    shipTransDAO.getShipTransCount(params,function(error,result){
        if (error) {
            logger.error(' queryShipTransCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryShipTransCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryShipTransMonthStat(req,res,next){
    var params = req.params ;
    shipTransDAO.getShipTransMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryShipTransMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryShipTransMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryShipTransDayStat(req,res,next){
    var params = req.params ;
    shipTransDAO.getShipTransDayStat(params,function(error,result){
        if (error) {
            logger.error(' queryShipTransDayStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryShipTransDayStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createShipTrans : createShipTrans,
    queryShipTrans : queryShipTrans,
    updateShipTrans : updateShipTrans,
    updateShipTransStatus : updateShipTransStatus,
    getShipTransCsv : getShipTransCsv,
    queryShipTransStatDate : queryShipTransStatDate,
    queryShipTransCount : queryShipTransCount,
    queryShipTransMonthStat : queryShipTransMonthStat,
    queryShipTransDayStat : queryShipTransDayStat
}