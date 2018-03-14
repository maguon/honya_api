var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var encrypt = require('../util/Encrypt.js');
var resUtil = require('../util/ResponseUtil.js');
var listOfValue = require('../util/ListOfValue.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var adminUserDao = require('../dao/AdminUserDAO.js');
var serverLogger = require('../util/ServerLogger.js');
var Seq = require('seq');
var logger = serverLogger.createLogger('Admin.js');

function adminUserLogin(req,res,next){
    var params = req.params;

    adminUserDao.queryAdminUser(params,function(error,rows){
        if (error) {
            logger.error(' adminUserLogin ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            if(rows && rows.length<1){
                logger.warn(' adminUserLogin ' +params.userName+ sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                //res.send(200, {success:false,errMsg:sysMsg.ADMIN_LOGIN_USER_UNREGISTERED});
                resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED) ;
                return next();
            }else{
                var passwordMd5 = encrypt.encryptByMd5(params.password);
                if(passwordMd5 != rows[0].password){
                    logger.warn(' adminUserLogin ' +params.phone+ sysMsg.CUST_LOGIN_PSWD_ERROR);
                    //res.send(200, {success:false,errMsg:sysMsg.CUST_LOGIN_PSWD_ERROR});
                    resUtil.resetFailedRes(res,sysMsg.CUST_LOGIN_PSWD_ERROR) ;
                    return next();

                }else{
                    if(rows[0].admin_status == listOfValue.ADMIN_USER_STATUS_NOT_ACTIVE){
                        //Admin User status is not verified return user id
                        var user = {
                            userId : rows[0].id,
                            userStatus : rows[0].admin_status
                        }
                        logger.info('adminUserLogin' +params.userName+ " not verified");
                        resUtil.resetQueryRes(res,user,null);
                        return next();
                    }else{
                        //admin user status is active,return token
                        var user = {
                            userId : rows[0].id,
                            userStatus : rows[0].admin_status
                        }
                        user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.admin,user.userId,user.userStatus);
                        logger.info('adminUserLogin' +params.userName+ " success");
                        resUtil.resetQueryRes(res,user,null);
                        return next();
                    }
                }
            }
        }
    })
}

function getAdminUserInfo(req,res,next){
    var params = req.params;
    adminUserDao.queryAdminUser(params,function(error,rows){
        if (error) {
            logger.error(' getAdminUserInfo ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' getAdminUserInfo ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}

function updateAdminInfo (req,res,next){
    var params = req.params;
    adminUserDao.updateInfo(params,function(error,result){
        if (error) {
            logger.error(' updateAdminInfo ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateAdminInfo ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function changeAdminPassword(req,res,next){
    var params = req.params;

    Seq().seq(function(){
        var that = this;
        adminUserDao.queryAdminUser(params,function(error,rows){
            if (error) {
                logger.error(' changeAdminPassword ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(rows && rows.length<1){
                    logger.warn(' changeAdminPassword ' + sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);

                    //res.send(200, {success:false,errMsg:sysMsg.ADMIN_LOGIN_USER_UNREGISTERED});
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                    return next();
                }else if(encrypt.encryptByMd5(params.originPassword) != rows[0].password){
                    logger.warn(' changeAdminPassword ' + sysMsg.CUST_ORIGIN_PSWD_ERROR);
                    //res.send(200, {success:false,errMsg:sysMsg.CUST_ORIGIN_PSWD_ERROR});
                    resUtil.resetFailedRes(res,sysMsg.CUST_ORIGIN_PSWD_ERROR);
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
            params.password = encrypt.encryptByMd5(params.newPassword);
            adminUserDao.updatePassword(params,function(error,result){
                if (error) {
                    logger.error(' changeAdminPassword ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    logger.info(' changeAdminPassword ' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        })
}

module.exports = {
    adminUserLogin : adminUserLogin,
    getAdminUserInfo  : getAdminUserInfo,
    updateAdminInfo : updateAdminInfo,
    changeAdminPassword : changeAdminPassword
}