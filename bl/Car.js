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
var logger = serverLogger.createLogger('Car.js');

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
    var header = "VIN码" + ',' + "品牌" + ',' + "型号" + ','+ "生产日期" + ','+ "颜色" + ','+ "发动机号" + ','+ "委托方" + ','+ "是否MOS" + ','+ "车辆估值(美元)"
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
                parkObj.makeName = rows[i].make_name;
                parkObj.modelName = rows[i].model_name;
                if(rows[i].pro_date == null){
                    parkObj.proDate = "";
                }else{
                    parkObj.proDate = new Date(rows[i].pro_date).toLocaleDateString();
                }
                parkObj.colour = rows[i].colour;
                parkObj.engineNum = rows[i].engine_num;
                parkObj.entrustName = rows[i].entrust_name;
                if(rows[i].mos_status == 1){
                    parkObj.mosStatus = "是";
                }else{
                    parkObj.mosStatus = "否";
                }
                parkObj.valuation = rows[i].valuation;
                if(rows[i].enter_time == null){
                    parkObj.enterTime = "";
                }else{
                    parkObj.enterTime = new Date(rows[i].enter_time).toLocaleDateString();
                }
                parkObj.storageName = rows[i].storage_name;
                parkObj.areaName = rows[i].area_name;
                parkObj.rc = rows[i].row+"行"+rows[i].col+"列";
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
                    +parkObj.entrustName+","+parkObj.mosStatus+","+parkObj.valuation+","+parkObj.enterTime+","+parkObj.storageName+","+parkObj.areaName+","
                    +parkObj.rc+"," +parkObj.planOutTime+","+parkObj.realOutTime+","+parkObj.relStatus+ '\r\n';
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
    queryCar : queryCar,
    updateCar : updateCar,
    updateCarVin : updateCarVin,
    getCarCsv : getCarCsv
}
