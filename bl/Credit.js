/**
 * Created by zwl on 2018/5/18.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var creditDAO = require('../dao/CreditDAO.js');
var creditCarRelDAO = require('../dao/CreditCarRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Credit.js');

function createCredit(req,res,next){
    var params = req.params ;
    creditDAO.addCredit(params,function(error,result){
        if (error) {
            logger.error(' createCredit ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createCredit ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryCredit(req,res,next){
    var params = req.params ;
    creditDAO.getCredit(params,function(error,result){
        if (error) {
            logger.error(' queryCredit ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCredit ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCredit(req,res,next){
    var params = req.params ;
    creditDAO.updateCredit(params,function(error,result){
        if (error) {
            logger.error(' updateCredit ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCredit ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateCreditStatus(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    params.creditEndDate = myDate;
    creditDAO.updateCreditStatus(params,function(error,result){
        if (error) {
            logger.error(' updateCreditStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCreditStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getCreditCsv(req,res,next){
    var csvString = "";
    var header = "信用证号" + ',' + "委托方" + ',' + "委托方性质" + ','+ "信用证金额" + ','+ "实际到款金额"+ ','+ "预计回款日期" + ','+ "实际回款日期" + ','+ "接证日期"
        + ','+ "交单日期"+ ','+ "文件发出日期" + ','+ "开户行文件接收日期"+ ',' + "实际汇款日期" + ',' + "发票号"+ ',' + "备注" + ',' + "完结时间" + ','+ "状态" + ','+ "关联还款编号"
        + ','+ "VIN" + ','+ "制造商"+ ',' + "型号" + ',' + "商品车估值"+ ',' + "是否金融车"+ ',' + "商品车备注" + ',' + "始发港口" + ','+ "目的港口" + ','+ "预计开船日期" + ','+ "预计到港日期"
        + ','+ "实际开船日期"+ ',' + "实际到港日期" + ',' + "船公司"+ ',' + "船名" + ',' + "货柜" + ','+ "booking" + ','+ "封签";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    creditCarRelDAO.getCreditCarRel(params,function(error,rows){
        if (error) {
            logger.error(' getCreditCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){

                parkObj.creditId = rows[i].credit_id;
                parkObj.shortName = rows[i].short_name;
                if(rows[i].entrust_type == 1){
                    parkObj.entrustType = "个人";
                }else{
                    parkObj.entrustType = "企业";
                }
                parkObj.creditMoney = rows[i].credit_money;
                parkObj.actualMoney = rows[i].actual_money;
                if(rows[i].plan_return_date == null){
                    parkObj.planReturnDate = "";
                }else{
                    parkObj.planReturnDate = new Date(rows[i].plan_return_date).toLocaleDateString();
                }
                if(rows[i].actual_return_date == null){
                    parkObj.actualReturnDate = "";
                }else{
                    parkObj.actualReturnDate = new Date(rows[i].actual_return_date).toLocaleDateString();
                }
                if(rows[i].receive_card_date == null){
                    parkObj.receiveCardDate = "";
                }else{
                    parkObj.receiveCardDate = new Date(rows[i].receive_card_date).toLocaleDateString();
                }
                if(rows[i].documents_date == null){
                    parkObj.documentsDate = "";
                }else{
                    parkObj.documentsDate = new Date(rows[i].documents_date).toLocaleDateString();
                }
                if(rows[i].documents_send_date == null){
                    parkObj.documentsSendDate = "";
                }else{
                    parkObj.documentsSendDate = new Date(rows[i].documents_send_date).toLocaleDateString();
                }
                if(rows[i].documents_receive_date == null){
                    parkObj.documentsReceiveDate = "";
                }else{
                    parkObj.documentsReceiveDate = new Date(rows[i].documents_receive_date).toLocaleDateString();
                }
                if(rows[i].actual_remit_date == null){
                    parkObj.actualRemitDate = "";
                }else{
                    parkObj.actualRemitDate = new Date(rows[i].actual_remit_date).toLocaleDateString();
                }
                parkObj.invoiceNumber = rows[i].invoice_number;
                if(rows[i].remark == null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark;
                }
                if(rows[i].credit_end_date == null){
                    parkObj.creditEndDate = "";
                }else{
                    parkObj.creditEndDate = new Date(rows[i].credit_end_date).toLocaleDateString();
                }
                if(rows[i].credit_status == 1){
                    parkObj.creditStatus = "未完结";
                }else{
                    parkObj.creditStatus = "已完结";
                }
                if(rows[i].repayment_id == null){
                    parkObj.repaymentId = "";
                }else{
                    parkObj.repaymentId = rows[i].repayment_id;
                }

                parkObj.vin = rows[i].vin;
                parkObj.makeName = rows[i].make_name;
                parkObj.modelName = rows[i].model_name;
                parkObj.valuation = rows[i].valuation;
                if(rows[i].purchase_type == 1){
                    parkObj.purchaseType = "是";
                }else{
                    parkObj.purchaseType = "否";
                }
                if(rows[i].car_remark == null){
                    parkObj.carRemark = "";
                }else{
                    parkObj.carRemark = rows[i].car_remark;
                }

                parkObj.startPortName = rows[i].start_port_name;
                parkObj.endPortName = rows[i].end_port_name;
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
                parkObj.shipCompanyName = rows[i].ship_company_name;
                parkObj.shipName = rows[i].ship_name;
                parkObj.container = rows[i].container;
                parkObj.booking = rows[i].booking;
                parkObj.tab = rows[i].tab;

                csvString = csvString+parkObj.creditId+","+parkObj.shortName+","+parkObj.entrustType+","+parkObj.creditMoney+","+parkObj.actualMoney
                    +","+parkObj.planReturnDate+","+parkObj.actualReturnDate+","+parkObj.receiveCardDate+","+parkObj.documentsDate
                    +","+parkObj.documentsSendDate +","+parkObj.documentsReceiveDate+","+parkObj.actualRemitDate+","+parkObj.invoiceNumber
                    +","+parkObj.remark+","+parkObj.creditEndDate +","+parkObj.creditStatus+","+parkObj.repaymentId
                    +","+parkObj.vin+","+parkObj.makeName+","+parkObj.modelName+","+parkObj.valuation+","+parkObj.purchaseType+","+parkObj.carRemark
                    +","+parkObj.startPortName+","+parkObj.endPortName+","+parkObj.startShipDate+","+parkObj.endShipDate+","+parkObj.actualStartDate
                    +","+parkObj.actualEndDate+","+parkObj.shipCompanyName+","+parkObj.shipName+","+parkObj.container+","+parkObj.booking +","+parkObj.tab + '\r\n';
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
    createCredit : createCredit,
    queryCredit : queryCredit,
    updateCredit : updateCredit,
    updateCreditStatus : updateCreditStatus,
    getCreditCsv : getCreditCsv
}
