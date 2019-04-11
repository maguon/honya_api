/**
 * Created by zwl on 2018/5/21.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var creditCarRelDAO = require('../dao/CreditCarRelDAO.js');
var carDAO = require('../dao/CarDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CreditCarRel.js');

function createCreditCarRel(req,res,next){
    var params = req.params ;
    creditCarRelDAO.addCreditCarRel(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "VIN已经被关联，操作失败");
                return next();
            } else{
                logger.error(' createCreditCarRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createCreditCarRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryCreditCarRel(req,res,next){
    var params = req.params ;
    creditCarRelDAO.getCreditCarRel(params,function(error,result){
        if (error) {
            logger.error(' queryCreditCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCreditCarRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCreditCarRel(req,res,next){
    var params = req.params ;
    creditCarRelDAO.updateCreditCarRel(params,function(error,result){
        if (error) {
            logger.error(' updateCreditCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCreditCarRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateCreditCarRepRel(req,res,next){
    var params = req.params ;
    var parkObj = {};
    Seq().seq(function(){
        var that = this;
        creditCarRelDAO.getCreditCarRelBase({carId:params.carId},function(error,rows){
            if (error) {
                logger.error(' getCarList ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length >0){
                    parkObj.valuation=rows[0].valuation;
                    parkObj.lcHandlingFee=rows[0].lc_handling_fee;
                    parkObj.bankServicesFee=rows[0].bank_services_fee;
                    that();
                }else{
                    logger.warn(' getCarList ' + 'failed');
                    resUtil.resetFailedRes(res," 商品车不存在 ");
                    return next();

                }
            }
        })
    }).seq(function () {
        if(params.repaymentId>0){
            params.valuationFee = parkObj.valuation-(parkObj.lcHandlingFee+parkObj.bankServicesFee);
        }else{
            params.valuationFee = 0;
        }

        creditCarRelDAO.updateCreditCarRepRel(params,function(error,result){
            if (error) {
                logger.error(' updateCreditCarRepRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateCreditCarRepRel ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })

}

function removeCreditCarRel(req,res,next){
    var params = req.params;
    creditCarRelDAO.deleteCreditCarRel(params,function(error,result){
        if (error) {
            logger.error(' removeCreditCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeCreditCarRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createCreditCarRel : createCreditCarRel,
    queryCreditCarRel : queryCreditCarRel,
    updateCreditCarRel : updateCreditCarRel,
    updateCreditCarRepRel: updateCreditCarRepRel,
    removeCreditCarRel : removeCreditCarRel
}