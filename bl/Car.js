/**
 * Created by zwl on 2017/4/13.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var carDAO = require('../dao/CarDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('Car.js');

function createCar(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        carDAO.getCarList({vin:params.vin},function(error,rows){
            if (error) {
                logger.error(' getCarList ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0){
                    logger.warn(' getCarList ' +params.vin+ sysMsg.CUST_CREATE_EXISTING);
                    resUtil.resetFailedRes(res,sysMsg.CUST_CREATE_EXISTING);
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        if(params.purchaseType==null){
            params.purchaseType = 0;
        }
        var myDate = new Date();
        var strDate = moment(myDate).format('YYYYMMDD');
        params.createdDateId = parseInt(strDate);
        carDAO.addCar(params,function(error,result){
            if (error) {
                logger.error(' createCar ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' createCar ' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryCar(req,res,next){
    var params = req.params ;
    carDAO.getCar(params,function(error,result){
        if (error) {
            logger.error(' queryCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCar ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryCarList(req,res,next){
    var params = req.params ;
    carDAO.getCarList(params,function(error,result){
        if (error) {
            logger.error(' queryCarList ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarList ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryCarStorageCount(req,res,next){
    var params = req.params ;
    carDAO.getCarStorageCount(params,function(error,result){
        if (error) {
            logger.error(' queryCarStorageCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarStorageCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryCarMortgageStatusCount(req,res,next){
    var params = req.params ;
    carDAO.getCarMortgageStatusCount(params,function(error,result){
        if (error) {
            logger.error(' queryCarMortgageStatusCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarMortgageStatusCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryCarPurchaseCount(req,res,next){
    var params = req.params ;
    carDAO.getCarPurchaseCount(params,function(error,result){
        if (error) {
            logger.error(' queryCarPurchaseCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarPurchaseCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCar(req,res,next){
    var params = req.params ;
    carDAO.updateCar(params,function(error,result){
        if (error) {
            logger.error(' updateCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCar ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateCarValuationMso(req,res,next){
    var params = req.params ;
    carDAO.updateCarValuationMso(params,function(error,result){
        if (error) {
            logger.error(' updateCarValuationMso ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCarValuationMso ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateCarVin(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        carDAO.getCarBase({vin:params.vin},function(error,rows){
            if (error) {
                logger.error(' getCarBase ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0){
                    logger.warn(' getCarBase ' +params.vin+ sysMsg.CUST_CREATE_EXISTING);
                    resUtil.resetFailedRes(res,sysMsg.CUST_CREATE_EXISTING);
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function () {
        carDAO.updateCarVin(params,function(error,result){
            if (error) {
                logger.error(' updateCarVin ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateCarVin ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function getCarCsv(req,res,next){
    var csvString = "";
    var header = "VIN" + ',' + "制造商" + ',' + "型号" + ','+ "年份" + ','+ "颜色" + ','+ "发动机号" + ','+ "委托方" + ','+ "是否MSO" + ','+ "车辆估值(美元)"
        + ','+ "入库时间"+ ','+ "所在仓库" + ','+ "存放区域" + ','+ "存放位置" + ','+ "计划出库时间" + ',' + "实际出库时间" + ',' + "车辆状态";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    carDAO.getCar(params,function(error,rows){
        if (error) {
            logger.error(' getCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.vin = rows[i].vin;
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
                if(rows[i].colour == null){
                    parkObj.colour = "";
                }else if(rows[i].colour == "FFFFFF"){
                    parkObj.colour = "白色";
                }else if(rows[i].colour == "000000"){
                    parkObj.colour = "黑色";
                }else if(rows[i].colour == "ECECEC"){
                    parkObj.colour = "银色";
                }else if(rows[i].colour == "EDB756"){
                    parkObj.colour = "金色";
                }else if(rows[i].colour == "D0011B"){
                    parkObj.colour = "红色";
                }else if(rows[i].colour == "0B7DD5"){
                    parkObj.colour = "蓝色";
                }else if(rows[i].colour == "9B9B9B"){
                    parkObj.colour = "灰色";
                }else if(rows[i].colour == "7C24AB"){
                    parkObj.colour = "紫色";
                }else if(rows[i].colour == "FF6600"){
                    parkObj.colour = "桔色";
                }else if(rows[i].colour == "FFCC00"){
                    parkObj.colour = "黄色";
                }else if(rows[i].colour == "39A23F"){
                    parkObj.colour = "绿色";
                }else if(rows[i].colour == "794A21"){
                    parkObj.colour = "棕色";
                }else if(rows[i].colour == "FF9CC3"){
                    parkObj.colour = "粉色";
                }else{
                    parkObj.colour = "其他";
                }
                if(rows[i].engine_num == null){
                    parkObj.engineNum = "";
                }else{
                    parkObj.engineNum = rows[i].engine_num;
                }
                parkObj.shortName = rows[i].short_name;
                if(rows[i].mso_status == 1){
                    parkObj.msoStatus = "是";
                }else{
                    parkObj.msoStatus = "否";
                }
                if(rows[i].valuation == null){
                    parkObj.valuation = "";
                }else{
                    parkObj.valuation = rows[i].valuation;
                }
                if(rows[i].enter_time == null){
                    parkObj.enterTime = "";
                }else{
                    parkObj.enterTime = new Date(rows[i].enter_time).toLocaleDateString();
                }
                if(rows[i].storage_name == null){
                    parkObj.storageName = "";
                }else{
                    parkObj.storageName = rows[i].storage_name;
                }
                if(rows[i].area_name == null){
                    parkObj.areaName = "";
                }else{
                    parkObj.areaName = rows[i].area_name;
                }
                if(rows[i].row == null){
                    parkObj.rcl = "";
                }else{
                    parkObj.rcl = rows[i].row+"行"+rows[i].col+"列"+rows[i].lot+"单元";
                }
                if(rows[i].plan_out_time == null){
                    parkObj.planOutTime = "";
                }else{
                    parkObj.planOutTime = new Date(rows[i].plan_out_time).toLocaleDateString();
                }
                if(rows[i].real_out_time == null){
                    parkObj.realOutTime = "";
                }else{
                    parkObj.realOutTime = new Date(rows[i].real_out_time).toLocaleDateString();
                }
                if(rows[i].rel_status == 1){
                    parkObj.relStatus = "在库";
                }else{
                    parkObj.relStatus = "出库";
                }
                csvString = csvString+parkObj.vin+","+parkObj.makeName+","+parkObj.modelName+","+parkObj.proDate+","+parkObj.colour+","+parkObj.engineNum+","
                    +parkObj.shortName+","+parkObj.msoStatus+","+parkObj.valuation+","+parkObj.enterTime+","+parkObj.storageName+","+parkObj.areaName+","
                    +parkObj.rcl+"," +parkObj.planOutTime+","+parkObj.realOutTime+","+parkObj.relStatus+ '\r\n';
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

function getCarListCsv(req,res,next){
    var csvString = "";
    var header = "VIN" + ',' + "制造商" + ',' + "型号" + ','+ "年份" + ','+ "颜色" + ','+ "发动机号" + ','+ "委托方" + ','+ "是否MSO" + ','+ "车辆估值(美元)"
        + ','+ "金融车辆"+ ','+ "录入时间" + ','+ "备注";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    carDAO.getCarList(params,function(error,rows){
        if (error) {
            logger.error(' getCarList ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.vin = rows[i].vin;
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
                if(rows[i].colour == null){
                    parkObj.colour = "";
                }else if(rows[i].colour == "FFFFFF"){
                    parkObj.colour = "白色";
                }else if(rows[i].colour == "000000"){
                    parkObj.colour = "黑色";
                }else if(rows[i].colour == "ECECEC"){
                    parkObj.colour = "银色";
                }else if(rows[i].colour == "EDB756"){
                    parkObj.colour = "金色";
                }else if(rows[i].colour == "D0011B"){
                    parkObj.colour = "红色";
                }else if(rows[i].colour == "0B7DD5"){
                    parkObj.colour = "蓝色";
                }else if(rows[i].colour == "9B9B9B"){
                    parkObj.colour = "灰色";
                }else if(rows[i].colour == "7C24AB"){
                    parkObj.colour = "紫色";
                }else if(rows[i].colour == "FF6600"){
                    parkObj.colour = "桔色";
                }else if(rows[i].colour == "FFCC00"){
                    parkObj.colour = "黄色";
                }else if(rows[i].colour == "39A23F"){
                    parkObj.colour = "绿色";
                }else if(rows[i].colour == "794A21"){
                    parkObj.colour = "棕色";
                }else if(rows[i].colour == "FF9CC3"){
                    parkObj.colour = "粉色";
                }else{
                    parkObj.colour = "其他";
                }
                if(rows[i].engine_num == null){
                    parkObj.engineNum = "";
                }else{
                    parkObj.engineNum = rows[i].engine_num;
                }
                parkObj.shortName = rows[i].short_name;
                if(rows[i].mso_status == 1){
                    parkObj.msoStatus = "是";
                }else{
                    parkObj.msoStatus = "否";
                }
                if(rows[i].valuation == null){
                    parkObj.valuation = "";
                }else{
                    parkObj.valuation = rows[i].valuation;
                }
                if(rows[i].purchase_type == 1){
                    parkObj.purchaseType = "是";
                }else{
                    parkObj.purchaseType = "否";
                }
                if(rows[i].created_on == null){
                    parkObj.createdOn = "";
                }else{
                    parkObj.createdOn = new Date(rows[i].created_on).toLocaleDateString();
                }
                if(rows[i].remark == null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark;
                }
                csvString = csvString+parkObj.vin+","+parkObj.makeName+","+parkObj.modelName+","+parkObj.proDate+","+parkObj.colour+","+parkObj.engineNum+","
                    +parkObj.shortName+","+parkObj.msoStatus+","+parkObj.valuation+"," +parkObj.purchaseType+","+parkObj.createdOn+","+parkObj.remark+ '\r\n';
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

function getCarStorageShipTransCsv(req,res,next){
    var csvString = "";
    var header = "VIN" + ',' + "制造商" + ',' + "型号" + ','+ "年份" + ','+ "颜色" + ','+ "发动机号" + ','+ "委托方" + ','+ "是否MSO" + ','+ "车辆估值(美元)"
        + ','+ "入库时间"+ ','+ "所在仓库" + ','+ "存放区域" + ','+ "存放位置" + ','+ "计划出库时间" + ',' + "实际出库时间" + ',' + "车辆状态"
        + ','+ "海运编号"+ ','+ "始发港口" + ','+ "目的港口" + ','+ "开船日期" + ','+ "到港日期" + ',' + "船公司" + ',' + "船名"
        + ','+ "货柜"+ ','+ "booking" + ','+ "封签" + ','+ "海运状态" + ','+ "订舱备注";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    carDAO.getCar(params,function(error,rows){
        if (error) {
            logger.error(' getCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.vin = rows[i].vin;
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
                if(rows[i].colour == null){
                    parkObj.colour = "";
                }else if(rows[i].colour == "FFFFFF"){
                    parkObj.colour = "白色";
                }else if(rows[i].colour == "000000"){
                    parkObj.colour = "黑色";
                }else if(rows[i].colour == "ECECEC"){
                    parkObj.colour = "银色";
                }else if(rows[i].colour == "EDB756"){
                    parkObj.colour = "金色";
                }else if(rows[i].colour == "D0011B"){
                    parkObj.colour = "红色";
                }else if(rows[i].colour == "0B7DD5"){
                    parkObj.colour = "蓝色";
                }else if(rows[i].colour == "9B9B9B"){
                    parkObj.colour = "灰色";
                }else if(rows[i].colour == "7C24AB"){
                    parkObj.colour = "紫色";
                }else if(rows[i].colour == "FF6600"){
                    parkObj.colour = "桔色";
                }else if(rows[i].colour == "FFCC00"){
                    parkObj.colour = "黄色";
                }else if(rows[i].colour == "39A23F"){
                    parkObj.colour = "绿色";
                }else if(rows[i].colour == "794A21"){
                    parkObj.colour = "棕色";
                }else if(rows[i].colour == "FF9CC3"){
                    parkObj.colour = "粉色";
                }else{
                    parkObj.colour = "其他";
                }
                if(rows[i].engine_num == null){
                    parkObj.engineNum = "";
                }else{
                    parkObj.engineNum = rows[i].engine_num;
                }
                parkObj.shortName = rows[i].short_name;
                if(rows[i].mso_status == 1){
                    parkObj.msoStatus = "是";
                }else{
                    parkObj.msoStatus = "否";
                }
                if(rows[i].valuation == null){
                    parkObj.valuation = "";
                }else{
                    parkObj.valuation = rows[i].valuation;
                }
                if(rows[i].enter_time == null){
                    parkObj.enterTime = "";
                }else{
                    parkObj.enterTime = new Date(rows[i].enter_time).toLocaleDateString();
                }
                if(rows[i].storage_name == null){
                    parkObj.storageName = "";
                }else{
                    parkObj.storageName = rows[i].storage_name;
                }
                if(rows[i].area_name == null){
                    parkObj.areaName = "";
                }else{
                    parkObj.areaName = rows[i].area_name;
                }
                if(rows[i].row == null){
                    parkObj.rcl = "";
                }else{
                    parkObj.rcl = rows[i].row+"行"+rows[i].col+"列"+rows[i].lot+"单元";
                }
                if(rows[i].plan_out_time == null){
                    parkObj.planOutTime = "";
                }else{
                    parkObj.planOutTime = new Date(rows[i].plan_out_time).toLocaleDateString();
                }
                if(rows[i].real_out_time == null){
                    parkObj.realOutTime = "";
                }else{
                    parkObj.realOutTime = new Date(rows[i].real_out_time).toLocaleDateString();
                }
                if(rows[i].rel_status == 1){
                    parkObj.relStatus = "在库";
                }else{
                    parkObj.relStatus = "出库";
                }
                if(rows[i].ship_trans_id == null){
                    parkObj.shipTransId = "";
                }else{
                    parkObj.shipTransId = rows[i].ship_trans_id;
                }
                if(rows[i].start_port_name == null){
                    parkObj.startPortName = "";
                }else{
                    parkObj.startPortName = rows[i].start_port_name;
                }
                if(rows[i].end_port_name == null){
                    parkObj.endPortName = "";
                }else{
                    parkObj.endPortName = rows[i].end_port_name;
                }
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
                if(rows[i].ship_company_name == null){
                    parkObj.shipCompanyName = "";
                }else{
                    parkObj.shipCompanyName = rows[i].ship_company_name;
                }
                if(rows[i].ship_name == null){
                    parkObj.shipName = "";
                }else{
                    parkObj.shipName = rows[i].ship_name;
                }
                if(rows[i].container == null){
                    parkObj.container = "";
                }else{
                    parkObj.container = rows[i].container;
                }
                if(rows[i].booking == null){
                    parkObj.booking = "";
                }else{
                    parkObj.booking = rows[i].booking;
                }
                if(rows[i].tab == null){
                    parkObj.tab = "";
                }else{
                    parkObj.tab = rows[i].tab;
                }
                if(rows[i].ship_trans_status == 1){
                    parkObj.shipTransStatus = "待出发";
                }else if(rows[i].ship_trans_status == 2){
                    parkObj.shipTransStatus = "已出发";
                }else if(rows[i].ship_trans_status == 3){
                    parkObj.shipTransStatus = "已到达";
                }else{
                    parkObj.shipTransStatus = "";
                }
                if(rows[i].ship_trans_remark == null){
                    parkObj.shipTransRemark = "";
                }else{
                    parkObj.shipTransRemark = rows[i].ship_trans_remark;
                }
                csvString = csvString+parkObj.vin+","+parkObj.makeName+","+parkObj.modelName+","+parkObj.proDate+","+parkObj.colour+","+parkObj.engineNum+","
                    +parkObj.shortName+","+parkObj.msoStatus+","+parkObj.valuation+","+parkObj.enterTime+","+parkObj.storageName+","+parkObj.areaName+","
                    +parkObj.rcl+"," +parkObj.planOutTime+","+parkObj.realOutTime+","+parkObj.relStatus+","
                    +parkObj.shipTransId+","+parkObj.startPortName+","+parkObj.endPortName+","+parkObj.startShipDate+","+parkObj.endShipDate+","
                    +parkObj.shipCompanyName+","+parkObj.shipName+","+parkObj.container+","+parkObj.booking+","+parkObj.tab+","+parkObj.shipTransStatus+","
                    +parkObj.shipTransRemark+ '\r\n';
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

function queryCarEntrustStat(req,res,next){
    var params = req.params ;
    carDAO.getCarEntrustStat(params,function(error,result){
        if (error) {
            logger.error(' queryCarEntrustStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarEntrustStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createCar : createCar,
    queryCar : queryCar,
    queryCarList : queryCarList,
    queryCarStorageCount : queryCarStorageCount,
    queryCarMortgageStatusCount : queryCarMortgageStatusCount,
    queryCarPurchaseCount : queryCarPurchaseCount,
    updateCar : updateCar,
    updateCarValuationMso : updateCarValuationMso,
    updateCarVin : updateCarVin,
    getCarCsv : getCarCsv,
    getCarListCsv : getCarListCsv,
    getCarStorageShipTransCsv : getCarStorageShipTransCsv,
    queryCarEntrustStat : queryCarEntrustStat
}
