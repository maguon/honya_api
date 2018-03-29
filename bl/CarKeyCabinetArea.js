/**
 * Created by zwl on 2018/3/29.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var carKeyCabinetAreaDAO = require('../dao/CarKeyCabinetAreaDAO.js');
var carKeyPositionDAO = require('../dao/CarKeyPositionDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarKeyCabinetArea.js');

function createCarKeyCabinetArea(req,res,next){
    var params = req.params ;
    var areaId = 0;
    Seq().seq(function(){
        var that = this;
        carKeyCabinetAreaDAO.addCarKeyCabinetArea(params,function(error,result){
            if (error) {
                logger.error(' createCarKeyCabinetArea ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createCarKeyCabinetArea ' + 'success');
                    areaId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create carKeyCabinetArea failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        var rowArray = [] ,colArray=[];
        rowArray.length= params.row;
        colArray.length= params.col;
        Seq(rowArray).seqEach(function(rowObj,i){
            var that = this;
            Seq(colArray).seqEach(function(colObj,j){
                var that = this;
                var subParams ={
                    carKeyCabinetId : params.carKeyCabinetId,
                    areaId : areaId,
                    row : i+1,
                    col : j+1,
                }
                carKeyPositionDAO.addCarKeyPosition(subParams,function(err,result){
                    if (err) {
                        logger.error(' createCarKeyPosition ' + err.message);
                        throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else {
                        if(result&&result.insertId>0){
                            logger.info(' createCarKey position ' + 'success');
                        }else{
                            logger.warn(' createCarKey position ' + 'failed');
                        }
                        that(null,j);
                    }
                })
            }).seq(function(){
                that(null,i);
            })
        }).seq(function(){
            that();
        })

    }).seq(function(){
        logger.info(' createCarKeyCabinetArea ' + 'success');
        resUtil.resetCreateRes(res,{insertId:areaId},null);
        return next();
    })

}

function queryCarKeyCabinetArea(req,res,next){
    var params = req.params ;
    carKeyCabinetAreaDAO.getCarKeyCabinetArea(params,function(error,result){
        if (error) {
            logger.error(' queryCarKeyCabinetArea ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarKeyCabinetArea ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCarKeyCabinetArea(req,res,next){
    var params = req.params ;
    carKeyCabinetAreaDAO.updateCarKeyCabinetArea(params,function(error,result){
        if (error) {
            logger.error(' updateCarKeyCabinetArea ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCarKeyCabinetArea ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createCarKeyCabinetArea : createCarKeyCabinetArea,
    queryCarKeyCabinetArea : queryCarKeyCabinetArea,
    updateCarKeyCabinetArea : updateCarKeyCabinetArea
}
