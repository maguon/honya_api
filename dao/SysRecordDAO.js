/**
 * Created by lingxue on 2017/4/24.
 */

var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SysRecordDAO.js');
var httpUtil =  require('../util/HttpUtil.js');
var sysConfig =  require('../config/SystemConfig.js');

function addRecord(req,params,callback){
    var url = '/api/car/'+params.carId+'/vin/'+params.vin+"/record";
    httpUtil.httpPost(sysConfig.hosts.record,url,req,params,function(error,result){
        callback(error,result);
    })
}

module.exports ={
    addRecord : addRecord
}