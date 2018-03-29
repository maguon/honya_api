/**
 * Created by zwl on 2018/3/29.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var carKeyAreaDAO = require('../dao/CarKeyAreaDAO.js');
var carKeyPositionDAO = require('../dao/CarKeyPositionDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarKeyArea.js');

function createCarKeyArea(req,res,next){
    var params = req.params ;
    var areaId = 0;
    Seq().seq(function(){
        var that = this;
        carKeyAreaDAO.addCarKeyArea(params,function(error,result){
            if (error) {
                logger.error(' createCarKeyArea ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createCarKeyArea ' + 'success');
                    areaId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create CarKeyArea failed");
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
                    carKeyId : params.carKeyId,
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
        logger.info(' createCarKeyArea ' + 'success');
        resUtil.resetCreateRes(res,{insertId:areaId},null);
        return next();
    })

}

function queryCarKeyArea(req,res,next){
    var params = req.params ;
    carKeyAreaDAO.getCarKeyArea(params,function(error,result){
        if (error) {
            logger.error(' queryCarKeyArea ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarKeyArea ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCarKeyArea(req,res,next){
    var params = req.params ;
    carKeyAreaDAO.updateCarKeyArea(params,function(error,result){
        if (error) {
            logger.error(' updateCarKeyArea ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCarKeyArea ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createCarKeyArea : createCarKeyArea,
    queryCarKeyArea : queryCarKeyArea,
    updateCarKeyArea : updateCarKeyArea
}
