/**
 * Created by zwl on 2018/3/30.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var carKeyPositionDAO = require('../dao/CarKeyPositionDAO.js');
var carDAO = require('../dao/CarDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarKeyPosition.js');

function updateCarKeyPosition(req,res,next){
    var params = req.params ;
    var parkObj = {};
    Seq().seq(function(){
        var that = this;
        carKeyPositionDAO.getCarKeyPositionBase(params,function(error,rows){
            if (error) {
                logger.error(' getCarKeyPosition ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length>0){
                    logger.warn(' getCarKeyPosition ' + 'failed');
                    resUtil.resetFailedRes(res,"getCarKeyPosition is not empty");
                    return next();
                }else{
                    parkObj.row = rows[0].row;
                    parkObj.col = rows[0].col;
                    that();
                }
            }
        })
    }).seq(function () {
        var that = this;
        carKeyPositionDAO.updateCarKeyPositionMove(params,function(error,result){
            if (error) {
                logger.error(' updateCarKeyPosition ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateCarKeyPosition ' + 'success');
                }else{
                    logger.warn(' updateCarKeyPosition ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        carKeyPositionDAO.updateCarKeyPosition(params,function(error,result){
            if (error) {
                logger.error(' updateCarKeyPosition ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateCarKeyPosition ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    updateCarKeyPosition : updateCarKeyPosition
}