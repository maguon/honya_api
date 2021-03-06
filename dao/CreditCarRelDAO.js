/**
 * Created by zwl on 2018/5/21.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CreditCarRelDAO.js');

function addCreditCarRel(params,callback){
    var query = " insert into credit_car_rel (credit_id,car_id,lc_handling_fee,bank_services_fee) " +
        " values ( ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.creditId;
    paramsArray[i++]=params.carId;
    paramsArray[i++]=params.lcHandlingFee;
    paramsArray[i++]=params.bankServicesFee;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCreditCarRel ');
        return callback(error,rows);
    });
}

function getCreditCarRel(params,callback) {
    var query = " select ccr.*,ct.credit_number,ct.entrust_id,e.entrust_type,e.short_name,ct.credit_money,ct.receive_card_money, " +
        " ct.actual_money,ct.difference_fee,ct.plan_return_date,ct.actual_return_date,ct.receive_card_date,ct.documents_date,ct.documents_send_date, " +
        " ct.documents_receive_date,ct.actual_remit_date,ct.invoice_number,ct.remark,ct.credit_end_date,ct.credit_status, " +
        " c.vin,c.make_name,c.model_name,pro_date,c.colour,c.valuation,c.purchase_type,c.remark as car_remark,csr.mortgage_status, " +
        " st.start_port_name,st.end_port_name,st.start_ship_date,st.end_ship_date,st.actual_start_date,st.actual_end_date, " +
        " sc.ship_company_name,st.ship_name,st.container,st.booking,st.tab " +
        " from credit_car_rel ccr " +
        " left join credit_info ct on ccr.credit_id = ct.id " +
        " left join entrust_info e on ct.entrust_id = e.id " +
        " left join car_info c on ccr.car_id = c.id " +
        " left join ship_trans_car_rel stcr on c.id = stcr.car_id " +
        " left join ship_trans_info st on stcr.ship_trans_id = st.id " +
        " left join ship_company_info sc on st.ship_company_id = sc.id " +
        " left join car_storage_rel csr on ccr.car_id = csr.car_id " +
        " where ccr.id is not null and (csr.active =1 or csr.id is null) ";
    var paramsArray=[],i=0;
    if(params.creditId){
        paramsArray[i++] = params.creditId;
        query = query + " and ccr.credit_id = ? ";
    }
    if(params.creditNumber){
        paramsArray[i++] = params.creditNumber;
        query = query + " and ct.credit_number = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.repaymentId){
        paramsArray[i++] = params.repaymentId;
        query = query + " and lrcr.repayment_id = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and ct.entrust_id = ? ";
    }
    if(params.creditStatus){
        paramsArray[i++] = params.creditStatus;
        query = query + " and ct.credit_status = ? ";
    }
    if(params.planReturnDateStart){
        paramsArray[i++] = params.planReturnDateStart +" 00:00:00";
        query = query + " and ct.plan_return_date >= ? ";
    }
    if(params.planReturnDateEnd){
        paramsArray[i++] = params.planReturnDateEnd +" 23:59:59";
        query = query + " and ct.plan_return_date <= ? ";
    }
    if(params.actualReturnDateStart){
        paramsArray[i++] = params.actualReturnDateStart +" 00:00:00";
        query = query + " and ct.actual_return_date >= ? ";
    }
    if(params.actualReturnDateEnd){
        paramsArray[i++] = params.actualReturnDateEnd +" 23:59:59";
        query = query + " and ct.actual_return_date <= ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCreditCarRel ');
        return callback(error,rows);
    });
}

function getCreditCarRelBase(params,callback) {
    var query = " select ccr.*,c.vin,c.make_name,c.model_name,pro_date,c.colour,c.valuation,c.purchase_type,c.remark as car_remark " +
        " from credit_car_rel ccr " +
        " left join car_info c on ccr.car_id = c.id " +
        " left join invoice_loan_rep_rel ilrr on ccr.repayment_id = ilrr.repayment_id " +
        " where ccr.id is not null ";
    var paramsArray=[],i=0;
    if(params.creditId){
        paramsArray[i++] = params.creditId;
        query = query + " and ccr.credit_id = ? ";
    }
    if(params.carId){
        paramsArray[i++] = params.carId;
        query = query + " and ccr.car_id = ? ";
    }
    if(params.repaymentId){
        paramsArray[i++] = params.repaymentId;
        query = query + " and ccr.repayment_id = ? ";
    }
    if(params.invoiceId){
        paramsArray[i++] = params.invoiceId;
        query = query + " and ilrr.invoice_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCreditCarRelBase ');
        return callback(error,rows);
    });
}

function getCreditCarRelFeeCount(params,callback) {
    var query = " select if(isnull(sum(ccr.lc_handling_fee)),0,sum(ccr.lc_handling_fee)) as lc_handling_fee_total, " +
        " if(isnull(sum(ccr.bank_services_fee)),0,sum(ccr.bank_services_fee)) as bank_services_fee_total " +
        " from credit_car_rel ccr where ccr.id is not null ";
    var paramsArray=[],i=0;
    if(params.repaymentId){
        paramsArray[i++] = params.repaymentId;
        query = query + " and ccr.repayment_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCreditCarRelFeeCount ');
        return callback(error,rows);
    });
}

function updateCreditCarRel(params,callback){
    var query = " update credit_car_rel set lc_handling_fee = ? , bank_services_fee = ? , valuation_fee = ? " +
        " where credit_id = ? and car_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.lcHandlingFee;
    paramsArray[i++]=params.bankServicesFee;
    paramsArray[i++]=params.valuationFee;
    paramsArray[i++]=params.creditId;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCreditCarRel ');
        return callback(error,rows);
    });
}

function updateCreditCarRepRel(params,callback){
    var query = " update credit_car_rel set repayment_id = ? , valuation_fee = ? " +
        " where credit_id = ? and car_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repaymentId;
    paramsArray[i++]=params.valuationFee;
    paramsArray[i++]=params.creditId;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCreditCarRepRel ');
        return callback(error,rows);
    });
}

function deleteCreditCarRel(params,callback){
    var query = " delete from credit_car_rel where credit_id = ? and car_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.creditId;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteCreditCarRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addCreditCarRel : addCreditCarRel,
    getCreditCarRel : getCreditCarRel,
    getCreditCarRelBase : getCreditCarRelBase,
    getCreditCarRelFeeCount : getCreditCarRelFeeCount,
    updateCreditCarRel : updateCreditCarRel,
    updateCreditCarRepRel : updateCreditCarRepRel,
    deleteCreditCarRel : deleteCreditCarRel
}