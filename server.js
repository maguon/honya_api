// Copyright (c) 2012 Mark Cavage. All rights reserved.

var fs = require('fs');
var path = require('path');
var util = require('util');

var assert = require('assert-plus');
var restify = require('restify');

var sysConfig = require('./config/SystemConfig.js');
var serverLogger = require('./util/ServerLogger.js');
var logger = serverLogger.createLogger('Server.js');
var adminUser = require('./bl/AdminUser.js');
var user = require('./bl/User.js');
var truck = require('./bl/Truck.js');
var brand = require('./bl/Brand.js');
var drive = require('./bl/Drive.js');
var company = require('./bl/Company.js');
var city = require('./bl/City.js');
var storage = require('./bl/Storage.js');
var storageArea = require('./bl/StorageArea.js');
var storageParking = require('./bl/StorageParking.js');
var storageOrder = require('./bl/StorageOrder.js');
var car = require('./bl/Car.js');
var carStorageRel = require('./bl/CarStorageRel.js');
var carMake = require('./bl/CarMake.js');
var carModel = require('./bl/CarModel.js');
var carKeyCabinet = require('./bl/CarKeyCabinet.js');
var carKeyCabinetArea = require('./bl/CarKeyCabinetArea.js');
var carKeyPosition = require('./bl/CarKeyPosition.js');
var entrust = require('./bl/Entrust.js');
var port = require('./bl/Port.js');
var shipCompany = require('./bl/ShipCompany.js');
var shipTrans = require('./bl/ShipTrans.js');
var shipTransOrder = require('./bl/ShipTransOrder.js');
var shipTransCarRel = require('./bl/ShipTransCarRel.js');
var shipTransOrderFeeRel = require('./bl/ShipTransOrderFeeRel.js');
var payment = require('./bl/Payment.js');
var paymentShipOrderRel = require('./bl/PaymentShipOrderRel.js');
var paymentStorageOrderRel = require('./bl/PaymentStorageOrderRel.js');
var paymentLoanRepRel = require('./bl/PaymentLoanRepRel.js');
var loan = require('./bl/Loan.js');
var loanMortgageCarRel = require('./bl/LoanMortgageCarRel.js');
var loanBuyCarRel = require('./bl/LoanBuyCarRel.js');
var loanRepayment = require('./bl/LoanRepayment.js');
var loanRepCreditRel = require('./bl/LoanRepCreditRel.js');
var loanIntoCompany = require('./bl/LoanIntoCompany.js');
var loanInto = require('./bl/LoanInto.js');
var loanIntoBuyCarRel = require('./bl/LoanIntoBuyCarRel.js');
var loanIntoRepayment = require('./bl/LoanIntoRepayment.js');
var credit = require('./bl/Credit.js');
var creditCarRel = require('./bl/CreditCarRel.js');
var invoice = require('./bl/Invoice.js');
var invoiceStorageOrderRel = require('./bl/InvoiceStorageOrderRel.js');
var invoiceShipOrderRel = require('./bl/InvoiceShipOrderRel.js');
var invoiceLoanRepRel = require('./bl/InvoiceLoanRepRel.js');
var app = require('./bl/App.js');
var sysRecord = require('./bl/SysRecord.js');

///--- API

/**
 * Returns a server with all routes defined on it
 */
function createServer() {



    // Create a server with our logger and custom formatter
    // Note that 'version' means all routes will default to
    // 1.0.0
    var server = restify.createServer({

        name: 'LOG-API-HONYA',
        version: '0.0.1'
    });


    // Ensure we don't drop data on uploads
    //server.pre(restify.pre.pause());

    // Clean up sloppy paths like //todo//////1//
    server.pre(restify.pre.sanitizePath());

    // Handles annoying user agents (curl)
    server.pre(restify.pre.userAgentConnection());




    
    // Set a per request bunyan logger (with requestid filled in)
    //server.use(restify.requestLogger());

    // Allow 5 requests/second by IP, and burst to 10
    server.use(restify.throttle({
        burst: 100,
        rate: 50,
        ip: true
    }));

    restify.CORS.ALLOW_HEADERS.push('auth-token');
    restify.CORS.ALLOW_HEADERS.push('user-name');
    restify.CORS.ALLOW_HEADERS.push('user-type');
    restify.CORS.ALLOW_HEADERS.push('user-id');
    restify.CORS.ALLOW_HEADERS.push('Access-Control-Allow-Origin');
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","GET");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","POST");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","PUT");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","DELETE");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Headers","x-requested-with,content-type");
    server.use(restify.CORS());

    // Use the common stuff you probably want
    //hard code the upload folder for now
    server.use(restify.bodyParser({uploadDir:__dirname+'/../uploads/'}));
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.dateParser());
    server.use(restify.authorizationParser());
    server.use(restify.queryParser());
    server.use(restify.gzipResponse());



   

    // Now our own handlers for authentication/authorization
    // Here we only use basic auth, but really you should look
    // at https://github.com/joyent/node-http-signature

    //server.use(authenticate);

    //server.use(apiUtil.save);



    // static files: /, /index.html, /images...
    //var STATIS_FILE_RE = /\/?\.css|\/?\.js|\/?\.png|\/?\.jpg|\/?\.gif|\/?\.jpeg|\/?\.less|\/?\.eot|\/?\.svg|\/?\.ttf|\/?\.otf|\/?\.woff|\/?\.pdf|\/?\.ico|\/?\.json|\/?\.wav|\/?\.mp3/;
    var STATIS_FILE_RE = /\.(css|js|jpe?g|png|gif|less|eot|svg|bmp|tiff|ttf|otf|woff|pdf|ico|json|wav|ogg|mp3?|xml|woff2|map)$/i;
    server.get(STATIS_FILE_RE, restify.serveStatic({ directory: './public/docs', default: 'index.html', maxAge: 0 }));
//    server.get(/^\/((.*)(\.)(.+))*$/, restify.serveStatic({ directory: './TruMenuWeb', default: "index.html" }));



    server.get(/\.html$/i,restify.serveStatic({
        directory: './public/docs',
        maxAge: 0}));
    //For 'abc.html?name=zzz'
    server.get(/\.html\?/i,restify.serveStatic({
        directory: './public/docs',
        maxAge: 0}));

    /**
     * Admin User Module
     */
    server.get('/api/admin/:adminId' ,adminUser.getAdminUserInfo);
    server.post({path:'/api/admin/do/login',contentType: 'application/json'},adminUser.adminUserLogin);
    server.put({path:'/api/admin/:adminId',contentType: 'application/json'} ,adminUser.updateAdminInfo);
    server.put({path:'/api/admin/:adminId/password',contentType: 'application/json'} ,adminUser.changeAdminPassword);

    /**
     * User Module
     */
    server.get('/api/user' ,user.queryUser);
    server.get('/api/admin/:adminId/user' ,user.queryUser);
    server.post({path:'/api/admin/:adminId/user',contentType: 'application/json'} , user.createUser);
    server.put({path:'/api/admin/:adminId/user/:userId',contentType: 'application/json'} ,user.updateUserInfo);
    server.put({path:'/api/admin/:adminId/user/:userId/status/:status',contentType: 'application/json'} ,user.updateUserStatus);
    server.get('/api/user/:userId' , user.queryUser);
    server.post({path:'/api/userLogin' ,contentType: 'application/json'}, user.userLogin);
    server.put({path:'/api/user/:userId/password',contentType: 'application/json'} ,user.changeUserPassword);
    server.get('/api/user/:userId/token/:token' , user.changeUserToken);

    /**
     * Truck Module
     */
    server.get('/api/user/:userId/truck' , truck.queryTruck);
    server.get('/api/user/:userId/company/:companyId/firstCount' , truck.queryFirstCount);
    server.get('/api/user/:userId/company/:companyId/trailerCount' , truck.queryTrailerCount);
    server.post({path:'/api/user/:userId/truck',contentType: 'application/json'},truck.createTruck);
    server.put({path:'/api/user/:userId/truck/:truckId',contentType: 'application/json'} ,truck.updateTruck);
    server.put({path:'/api/user/:userId/truck/:truckId/TruckDriveRel',contentType: 'application/json'} ,truck.updateTruckDriveRel);
    server.put({path:'/api/user/:userId/truck/:truckId/truckStatus/:truckStatus',contentType: 'application/json'} ,truck.updateTruckStatus);

    /**
     * Brand Module
     */
    server.get('/api/brand',brand.queryBrand);
    server.post({path:'/api/user/:userId/brand',contentType: 'application/json'},brand.createBrand);
    server.put({path:'/api/user/:userId/brand/:brandId',contentType: 'application/json'} ,brand.updateBrand);

    /**
     * Drive Module
     */
    server.get('/api/user/:userId/drive' , drive.queryDrive);
    server.get('/api/user/:userId/company/:companyId/driveCount' , drive.queryDriveCount);
    server.post({path:'/api/user/:userId/drive',contentType: 'application/json'},drive.createDrive);
    server.put({path:'/api/user/:userId/drive/:driveId',contentType: 'application/json'} ,drive.updateDrive);
    server.put({path:'/api/user/:userId/drive/:driveId/driveStatus/:driveStatus',contentType: 'application/json'} ,drive.updateDriveStatus);

    /**
     * Company Module
     */
    server.get('/api/user/:userId/company',company.queryCompany);
    server.post({path:'/api/user/:userId/company',contentType: 'application/json'},company.createCompany);
    server.put({path:'/api/user/:userId/company/:companyId',contentType: 'application/json'} ,company.updateCompany);

    /**
     * City Module
     */
    server.get('/api/user/:userId/city',city.queryCity);
    server.post({path:'/api/user/:userId/city',contentType: 'application/json'},city.createCity);
    server.put({path:'/api/user/:userId/city/:cityId',contentType: 'application/json'} ,city.updateCity);

    /**
     * Storage Module
     */
    server.get('/api/storage',storage.queryStorage);
    server.get('/api/storageDate',storage.queryStorageDate);
    server.get('/api/storageCount',storage.queryStorageCount);
    server.get('/api/storageTotalMonth',storage.queryStorageTotalMonth);
    server.get('/api/storageTotalDay',storage.queryStorageTotalDay);
    server.post({path:'/api/admin/:adminId/storage',contentType: 'application/json'},storage.createStorage);
    server.put({path:'/api/admin/:adminId/storage/:storageId',contentType: 'application/json'} ,storage.updateStorage);
    server.put({path:'/api/admin/:adminId/storage/:storageId/storageStatus/:storageStatus',contentType: 'application/json'} ,storage.updateStorageStatus);

    /**
     * StorageArea Module
     */
    server.get('/api/storageArea',storageArea.queryStorageArea);
    server.post({path:'/api/user/:userId/storage/:storageId/storageArea',contentType: 'application/json'},storageArea.createStorageArea);
    server.put({path:'/api/user/:userId/storageArea/:areaId',contentType: 'application/json'} ,storageArea.updateStorageArea);
    server.put({path:'/api/user/:userId/storageArea/:areaId/areaStatus/:areaStatus',contentType: 'application/json'} ,storageArea.updateStorageAreaStatus);

    /**
     * StorageParking Module
     */
    server.get('/api/storageParking',storageParking.queryStorageParking);
    server.get('/api/storageParkingRow',storageParking.queryStorageParkingRow);
    server.get('/api/storageParkingCol',storageParking.queryStorageParkingCol);
    server.get('/api/storageParkingLot',storageParking.queryStorageParkingLot);
    server.get('/api/storageParkingBalanceCount',storageParking.queryStorageParkingBalanceCount);
    server.get('/api/storage/:storageId/makeStat',storageParking.queryStorageParkingMakeStat);
    server.put({path:'/api/user/:userId/storageParking/:parkingId',contentType: 'application/json'} ,storageParking.updateStorageParking,sysRecord.saveCarRecord);

    /**
     * StorageOrder Module
     */
    server.get('/api/storageOrder',storageOrder.queryStorageOrder);
    server.get('/api/storageOrderCount',storageOrder.queryStorageOrderCount);
    server.get('/api/storageOrder.csv',storageOrder.getStorageOrderCsv);
    server.put({path:'/api/user/:userId/storageOrder/:storageOrderId',contentType: 'application/json'} ,storageOrder.updateStorageOrderActualFee);
    server.put({path:'/api/user/:userId/storageOrder/:storageOrderId/orderStatus/:orderStatus',contentType: 'application/json'} ,storageOrder.updateStorageOrderStatus);

    /**
     * Car Module
     */
    server.get('/api/user/:userId/car',car.queryCar);
    server.get('/api/carList', car.queryCarList);
    server.get('/api/car.csv', car.getCarCsv);
    server.get('/api/carList.csv', car.getCarListCsv);
    server.get('/api/carStorageShipTrans.csv', car.getCarStorageShipTransCsv);
    server.get('/api/carStorageCount', car.queryCarStorageCount);
    server.get('/api/carMortgageStatusCount', car.queryCarMortgageStatusCount);
    server.get('/api/carPurchaseCount', car.queryCarPurchaseCount);
    server.get('/api/carEntrustStat', car.queryCarEntrustStat);
    server.post({path:'/api/user/:userId/car',contentType: 'application/json'},car.createCar);
    server.put({path:'/api/user/:userId/car/:carId',contentType: 'application/json'} ,car.updateCar);
    server.put({path:'/api/user/:userId/car/:carId/valuationMso',contentType: 'application/json'} ,car.updateCarValuationMso);
    server.get('/api/admin/:adminId/car',car.queryCar);
    server.put({path:'/api/admin/:adminId/car/:carId/vin',contentType: 'application/json'} ,car.updateCarVin);

    /**
     * CarStorageRel Module
     */
    server.get('/api/carStorageRel',carStorageRel.queryCarStorageRel);
    server.post({path:'/api/user/:userId/carStorageRel',contentType: 'application/json'},carStorageRel.createCarStorageRel,sysRecord.saveCarRecord);
    server.put({path:'/api/user/:userId/car/:carId/vin/:vin/carStorageRel',contentType: 'application/json'},carStorageRel.createAgainCarStorageRel,sysRecord.saveCarRecord);
    server.put({path:'/api/user/:userId/carStorageRel/:relId/relStatus/:relStatus',contentType: 'application/json'} ,carStorageRel.updateRelStatus,sysRecord.saveCarRecord);
    server.put({path:'/api/user/:userId/carStorageRel/:relId/planOutTime',contentType: 'application/json'} ,carStorageRel.updateRelPlanOutTime);

    /**
     * CarMake Module
     */
    server.get('/api/carMake',carMake.queryCarMake);
    server.post({path:'/api/admin/:adminId/carMake',contentType: 'application/json'},carMake.createCarMake);
    server.post({path:'/api/user/:userId/carMake',contentType: 'application/json'},carMake.createCarMake);
    server.put({path:'/api/admin/:adminId/carMake/:makeId',contentType: 'application/json'} ,carMake.updateCarMake);
    server.put({path:'/api/user/:userId/carMake/:makeId',contentType: 'application/json'} ,carMake.updateCarMake);

    /**
     * CarModel Module
     */
    server.get('/api/carMake/:makeId/carModel',carModel.queryCarModel);
    server.post({path:'/api/admin/:adminId/carMake/:makeId/carModel',contentType: 'application/json'},carModel.createCarModel);
    server.post({path:'/api/user/:userId/carMake/:makeId/carModel',contentType: 'application/json'},carModel.createCarModel);
    server.put({path:'/api/admin/:adminId/carModel/:modelId',contentType: 'application/json'} ,carModel.updateCarModel);
    server.put({path:'/api/user/:userId/carModel/:modelId',contentType: 'application/json'} ,carModel.updateCarModel);
    server.put({path:'/api/admin/:adminId/carModel/:modelId/modelStatus/:modelStatus',contentType: 'application/json'} ,carModel.updateModelStatus);
    server.put({path:'/api/user/:userId/carModel/:modelId/modelStatus/:modelStatus',contentType: 'application/json'} ,carModel.updateModelStatus);

    /**
     * CarKeyCabinet Module
     */
    server.get('/api/carKeyCabinet',carKeyCabinet.queryCarKeyCabinet);
    server.post({path:'/api/user/:userId/carKeyCabinet',contentType: 'application/json'},carKeyCabinet.createCarKeyCabinet);
    server.put({path:'/api/user/:userId/carKeyCabinet/:carKeyCabinetId',contentType: 'application/json'} ,carKeyCabinet.updateCarKeyCabinet);
    server.put({path:'/api/user/:userId/carKeyCabinet/:carKeyCabinetId/keyCabinetStatus/:keyCabinetStatus',contentType: 'application/json'} ,carKeyCabinet.updateCarKeyCabinetStatus);

    /**
     * CarKeyCabinetArea Module
     */
    server.get('/api/carKeyCabinetArea',carKeyCabinetArea.queryCarKeyCabinetArea);
    server.post({path:'/api/user/:userId/carKeyCabinet/:carKeyCabinetId/carKeyCabinetArea',contentType: 'application/json'},carKeyCabinetArea.createCarKeyCabinetArea);
    server.put({path:'/api/user/:userId/carKeyCabinetArea/:areaId',contentType: 'application/json'} ,carKeyCabinetArea.updateCarKeyCabinetArea);
    server.put({path:'/api/user/:userId/carKeyCabinetArea/:areaId/areaStatus/:areaStatus',contentType: 'application/json'} ,carKeyCabinetArea.updateCarKeyCabinetAreaStatus);

    /**
     * CarKeyPosition Module
     */
    server.get('/api/carKeyPosition',carKeyPosition.queryCarKeyPosition);
    server.get('/api/carKeyCabinet/:carKeyCabinetId/carKeyPositionCount',carKeyPosition.queryCarKeyPositionCount);
    server.put({path:'/api/user/:userId/carKeyPosition/:carKeyPositionId',contentType: 'application/json'} ,carKeyPosition.updateCarKeyPosition,sysRecord.saveCarRecord);

    /**
     * Entrust Module
     */
    server.get('/api/entrust',entrust.queryEntrust);
    server.get('/api/entrustBase',entrust.queryEntrustBase);
    server.get('/api/entrustCount',entrust.queryEntrustCount);
    server.post({path:'/api/user/:userId/entrust',contentType: 'application/json'},entrust.createEntrust);
    server.put({path:'/api/user/:userId/entrust/:entrustId',contentType: 'application/json'} ,entrust.updateEntrust);

    /**
     * Port Module
     */
    server.get('/api/port',port.queryPort);
    server.post({path:'/api/user/:userId/port',contentType: 'application/json'},port.createPort);
    server.put({path:'/api/user/:userId/port/:portId',contentType: 'application/json'} ,port.updatePort);

    /**
     * ShipCompany Module
     */
    server.get('/api/shipCompany',shipCompany.queryShipCompany);
    server.post({path:'/api/user/:userId/shipCompany',contentType: 'application/json'},shipCompany.createShipCompany);
    server.put({path:'/api/user/:userId/shipCompany/:shipCompanyId',contentType: 'application/json'} ,shipCompany.updateShipCompany);
    server.put({path:'/api/user/:userId/shipCompany/:shipCompanyId/shipCompanyStatus/:shipCompanyStatus',contentType: 'application/json'} ,shipCompany.updateShipCompanyStatus);

    /**
     * ShipTrans Module
     */
    server.get('/api/shipTrans',shipTrans.queryShipTrans);
    server.get('/api/shipTrans.csv',shipTrans.getShipTransCsv);
    server.get('/api/shipTransStatDate',shipTrans.queryShipTransStatDate);
    server.get('/api/shipTransCount',shipTrans.queryShipTransCount);
    server.get('/api/shipTransMonthStat',shipTrans.queryShipTransMonthStat);
    server.get('/api/shipTransDayStat',shipTrans.queryShipTransDayStat);
    server.post({path:'/api/user/:userId/shipTrans',contentType: 'application/json'},shipTrans.createShipTrans);
    server.put({path:'/api/user/:userId/shipTrans/:shipTransId',contentType: 'application/json'} ,shipTrans.updateShipTrans);
    server.put({path:'/api/user/:userId/shipTrans/:shipTransId/shipTransStatus/:shipTransStatus',contentType: 'application/json'} ,shipTrans.updateShipTransStatus);

    /**
     * ShipTransOrder Module
     */
    server.get('/api/shipTransOrder',shipTransOrder.queryShipTransOrder);
    server.get('/api/invoiceShipTransOrderList',shipTransOrder.queryInvoiceShipTransOrderList);
    server.get('/api/shipTransOrder.csv',shipTransOrder.getShipTransOrderCsv);
    server.get('/api/shipTransOrderCount',shipTransOrder.queryShipTransOrderCount);
    server.put({path:'/api/user/:userId/shipTransOrder/:shipTransOrderId/orderStatus/:orderStatus',contentType: 'application/json'} ,shipTransOrder.updateShipTransOrderStatus);

    /**
     * ShipTransCarRel Module
     */
    server.get('/api/shipTransCarRel',shipTransCarRel.queryShipTransCarRel);
    server.post({path:'/api/user/:userId/shipTransCarRel',contentType: 'application/json'},shipTransCarRel.createShipTransCarRel,sysRecord.saveCarRecord);
    server.del('/api/user/:userId/shipTrans/:shipTransId/car/:carId' , shipTransCarRel.removeShipTransCarRel,sysRecord.saveCarRecord);

    /**
     * ShipTransOrderFeeRel Module
     */
    server.get('/api/shipTransOrderFeeRel',shipTransOrderFeeRel.queryShipTransOrderFeeRel);
    server.post({path:'/api/user/:userId/shipTransOrder/:shipTransOrderId/shipTransOrderFeeRel',contentType: 'application/json'},shipTransOrderFeeRel.createShipTransOrderFeeRel);
    server.put({path:'/api/user/:userId/shipTransOrderFeeRel/:shipTransOrderFeeRelId',contentType: 'application/json'} ,shipTransOrderFeeRel.updateShipTransOrderFeeRel);
    server.del('/api/user/:userId/shipTransOrderFeeRel/:shipTransOrderFeeRelId' , shipTransOrderFeeRel.removeShipTransOrderFeeRel);

    /**
     * Payment Module
     */
    server.get('/api/payment',payment.queryPayment);
    server.get('/api/paymentCount',payment.queryPaymentCount);
    server.get('/api/payment.csv',payment.getPaymentCsv);
    server.post({path:'/api/user/:userId/payment',contentType: 'application/json'},payment.createPayment);
    server.post({path:'/api/user/:userId/paymentOrder',contentType: 'application/json'},payment.createPaymentOrder);
    server.put({path:'/api/user/:userId/payment/:paymentId',contentType: 'application/json'} ,payment.updatePayment);
    server.put({path:'/api/user/:userId/payment/:paymentId/paymentStatus/:paymentStatus',contentType: 'application/json'} ,payment.updatePaymentStatus);

    /**
     * PaymentStorageOrderRel Module
     */
    server.get('/api/paymentStorageOrderRel',paymentStorageOrderRel.queryPaymentStorageOrderRel);
    server.post({path:'/api/user/:userId/paymentStorageOrderRel',contentType: 'application/json'},paymentStorageOrderRel.createPaymentStorageOrderRel);
    server.del('/api/user/:userId/storageOrder/:storageOrderId/payment/:paymentId' , paymentStorageOrderRel.removePaymentStorageOrderRel);

    /**
     * PaymentShipOrderRel Module
     */
    server.get('/api/paymentShipOrderRel',paymentShipOrderRel.queryPaymentShipOrderRel);
    server.post({path:'/api/user/:userId/paymentShipOrderRel',contentType: 'application/json'},paymentShipOrderRel.createPaymentShipOrderRel);
    server.del('/api/user/:userId/shipTransOrder/:shipTransOrderId/payment/:paymentId' , paymentShipOrderRel.removePaymentShipOrderRel);

    /**
     * PaymentLoanRepRel Module
     */
    server.get('/api/paymentLoanRepRel',paymentLoanRepRel.queryPaymentLoanRepRel);
    server.get('/api/repayment/:repaymentId/paymentRepMoney',paymentLoanRepRel.queryPaymentRepMoney);
    server.post({path:'/api/user/:userId/paymentLoanRepRel',contentType: 'application/json'},paymentLoanRepRel.createPaymentLoanRepRel);
    server.put({path:'/api/user/:userId/repayment/:repaymentId/payment/:paymentId/paymentRepMoney',contentType: 'application/json'} ,paymentLoanRepRel.updatePaymentRepMoney);
    server.del('/api/user/:userId/repayment/:repaymentId/payment/:paymentId' , paymentLoanRepRel.removePaymentLoanRepRel);

    /**
     * Loan Module
     */
    server.get('/api/loan',loan.queryLoan);
    server.get('/api/loanNotCount',loan.queryLoanNotCount);
    server.get('/api/loanStatDate',loan.queryLoanStatDate);
    server.get('/api/loan.csv',loan.getLoanCsv);
    server.post({path:'/api/user/:userId/loan',contentType: 'application/json'},loan.createLoan);
    server.put({path:'/api/user/:userId/loan/:loanId',contentType: 'application/json'} ,loan.updateLoan);
    server.put({path:'/api/user/:userId/loan/:loanId/loanStatus/:loanStatus',contentType: 'application/json'} ,loan.updateLoanStatus);

    /**
     * LoanMortgageCarRel Module
     */
    server.get('/api/loanMortgageCarRel',loanMortgageCarRel.queryLoanMortgageCarRel);
    server.post({path:'/api/user/:userId/loanMortgageCarRel',contentType: 'application/json'},loanMortgageCarRel.createLoanMortgageCarRel);
    server.del('/api/user/:userId/loan/:loanId/car/:carId' , loanMortgageCarRel.removeLoanMortgageCarRel);

    /**
     * LoanBuyCarRel Module
     */
    server.get('/api/loanBuyCarRel',loanBuyCarRel.queryLoanBuyCarRel);
    server.post({path:'/api/user/:userId/loanBuyCarRel',contentType: 'application/json'},loanBuyCarRel.createLoanBuyCarRel);
    server.del('/api/user/:userId/loan/:loanId/car/:carId/loanBuyCarRel' , loanBuyCarRel.removeLoanBuyCarRel);

    /**
     * LoanRepayment Module
     */
    server.get('/api/loanRepayment',loanRepayment.queryLoanRepayment);
    server.get('/api/loanRepayment.csv',loanRepayment.getLoanRepaymentCsv);
    server.post({path:'/api/user/:userId/loanRepayment',contentType: 'application/json'},loanRepayment.createLoanRepayment);
    server.put({path:'/api/user/:userId/repayment/:repaymentId',contentType: 'application/json'} ,loanRepayment.updateLoanRepayment);
    server.put({path:'/api/user/:userId/repayment/:repaymentId/repaymentStatus/:repaymentStatus',contentType: 'application/json'} ,loanRepayment.updateLoanRepaymentStatus);

    /**
     * LoanRepCreditRel Module
     */
    server.get('/api/loanRepCreditRel',loanRepCreditRel.queryLoanRepCreditRel);
    server.post({path:'/api/user/:userId/loanRepCreditRel',contentType: 'application/json'},loanRepCreditRel.createLoanRepCreditRel);
    server.del('/api/user/:userId/repayment/:repaymentId/credit/:creditId' , loanRepCreditRel.removeLoanRepCreditRel);

    /**
     * LoanIntoCompany Module
     */
    server.get('/api/loanIntoCompany',loanIntoCompany.queryLoanIntoCompany);
    server.get('/api/loanIntoCompanyTotalMoney',loanIntoCompany.queryLoanIntoCompanyTotalMoney);
    server.post({path:'/api/user/:userId/loanIntoCompany',contentType: 'application/json'},loanIntoCompany.createLoanIntoCompany);
    server.put({path:'/api/user/:userId/loanIntoCompany/:loanIntoCompanyId',contentType: 'application/json'} ,loanIntoCompany.updateLoanIntoCompany);
    server.put({path:'/api/user/:userId/loanIntoCompany/:loanIntoCompanyId/companyStatus/:companyStatus',contentType: 'application/json'} ,loanIntoCompany.updateLoanIntoCompanyStatus);

    /**
     * LoanInto Module
     */
    server.get('/api/loanInto',loanInto.queryLoanInto);
    server.get('/api/loanIntoNotCount',loanInto.queryLoanIntoNotCount);
    server.get('/api/loanIntoStatDate',loanInto.queryLoanIntoStatDate);
    server.get('/api/loanInto.csv',loanInto.getLoanIntoCsv);
    server.post({path:'/api/user/:userId/loanInto',contentType: 'application/json'},loanInto.createLoanInto);
    server.put({path:'/api/user/:userId/loanInto/:loanIntoId',contentType: 'application/json'} ,loanInto.updateLoanInto);
    server.put({path:'/api/user/:userId/loanInto/:loanIntoId/loanIntoStatus/:loanIntoStatus',contentType: 'application/json'} ,loanInto.updateLoanIntoStatus);

    /**
     * loanIntoBuyCarRel Module
     */
    server.get('/api/loanIntoBuyCarRel',loanIntoBuyCarRel.queryLoanIntoBuyCarRel);
    server.post({path:'/api/user/:userId/loanIntoBuyCarRel',contentType: 'application/json'},loanIntoBuyCarRel.createLoanIntoBuyCarRel);
    server.del('/api/user/:userId/loanInto/:loanIntoId/car/:carId' , loanIntoBuyCarRel.removeLoanIntoBuyCarRel);

    /**
     * LoanIntoRepayment Module
     */
    server.get('/api/loanIntoRepayment',loanIntoRepayment.queryLoanIntoRepayment);
    server.get('/api/loanIntoRepayment.csv',loanIntoRepayment.getLoanIntoRepaymentCsv);
    server.post({path:'/api/user/:userId/loanIntoRepayment',contentType: 'application/json'},loanIntoRepayment.createLoanIntoRepayment);
    server.put({path:'/api/user/:userId/loanIntoRepayment/:repaymentId',contentType: 'application/json'} ,loanIntoRepayment.updateLoanIntoRepayment);
    server.put({path:'/api/user/:userId/loanIntoRepayment/:repaymentId/repaymentStatus/:repaymentStatus',contentType: 'application/json'} ,loanIntoRepayment.updateLoanIntoRepaymentStatus);

    /**
     * Credit Module
     */
    server.get('/api/credit',credit.queryCredit);
    server.get('/api/credit.csv',credit.getCreditCsv);
    server.get('/api/repayment/:repaymentId/creditRepMoney',credit.queryCreditRepMoney);
    server.post({path:'/api/user/:userId/credit',contentType: 'application/json'},credit.createCredit);
    server.put({path:'/api/user/:userId/credit/:creditId',contentType: 'application/json'} ,credit.updateCredit);
    server.put({path:'/api/user/:userId/credit/:creditId/creditStatus/:creditStatus',contentType: 'application/json'} ,credit.updateCreditStatus);

    /**
     * CreditCarRel Module
     */
    server.get('/api/creditCarRel',creditCarRel.queryCreditCarRel);
    server.post({path:'/api/user/:userId/creditCarRel',contentType: 'application/json'},creditCarRel.createCreditCarRel);
    server.del('/api/user/:userId/credit/:creditId/car/:carId' , creditCarRel.removeCreditCarRel);

    /**
     * Invoice Module
     */
    server.get('/api/invoice',invoice.queryInvoice);
    server.post({path:'/api/user/:userId/invoice',contentType: 'application/json'},invoice.createInvoice);
    server.put({path:'/api/user/:userId/invoice/:invoiceId',contentType: 'application/json'} ,invoice.updateInvoice);
    server.put({path:'/api/user/:userId/invoice/:invoiceId/invoiceStatus/:invoiceStatus',contentType: 'application/json'} ,invoice.updateInvoiceStatus);

    /**
     * InvoiceStorageOrderRel Module
     */
    server.get('/api/invoiceStorageOrderRel',invoiceStorageOrderRel.queryInvoiceStorageOrderRel);
    server.post({path:'/api/user/:userId/invoiceStorageOrderRel',contentType: 'application/json'},invoiceStorageOrderRel.createInvoiceStorageOrderRel);
    server.del('/api/user/:userId/storageOrder/:storageOrderId/invoice/:invoiceId' , invoiceStorageOrderRel.removeInvoiceStorageOrderRel);

    /**
     * InvoiceShipOrderRel Module
     */
    server.get('/api/invoiceShipOrderRel',invoiceShipOrderRel.queryInvoiceShipOrderRel);
    server.post({path:'/api/user/:userId/invoiceShipOrderRel',contentType: 'application/json'},invoiceShipOrderRel.createInvoiceShipOrderRel);
    server.del('/api/user/:userId/shipTransOrder/:shipTransOrderId/invoice/:invoiceId' , invoiceShipOrderRel.removeInvoiceShipOrderRel);

    /**
     * InvoiceLoanRepRel Module
     */
    server.get('/api/invoiceLoanRepRel',invoiceLoanRepRel.queryInvoiceLoanRepRel);
    server.post({path:'/api/user/:userId/invoiceLoanRepRel',contentType: 'application/json'},invoiceLoanRepRel.createInvoiceLoanRepRel);
    server.del('/api/user/:userId/repayment/:repaymentId/invoice/:invoiceId' , invoiceLoanRepRel.removeInvoiceLoanRepRel);

    /**
     * App Module
     */
    server.get('/api/app',app.queryApp);
    server.post({path:'/api/user/:userId/app',contentType: 'application/json'},app.createAppVersion);
    server.put({path:'/api/user/:userId/app/:appId',contentType: 'application/json'} ,app.updateAppVersion);

    server.on('NotFound', function (req, res, next) {
        logger.warn(req.url + " not found");
        res.send(404,{success:false,msg:" service not found !"});
        next();
    });

    return (server);

}



///--- Exports

module.exports = {
    createServer: createServer
};