



var mysqlConnectOptions ={
    user: 'log',
    password: 'log_base',
    database:'log_base',
    host: '47.93.121.1' ,
    charset : 'utf8mb4',
    //,dateStrings : 'DATETIME'
};


var logLevel = 'DEBUG';
var loggerConfig = {
    appenders: { file: { type: 'file', filename: 'honya_api.log' } ,console: { type: 'stdout' },},
    categories: { default: { appenders: ['console','file'], level: 'debug' } }
}

function getMysqlConnectOptions (){
    return mysqlConnectOptions;
}

var mongoConfig = {
    connect : 'mongodb://127.0.0.1:27017/honya'
}

var hosts = {
    record : {host:"localhost",port:9004},
    auth : {host:"stg.myxxjs.com",port:9009}
}

module.exports = {
    getMysqlConnectOptions : getMysqlConnectOptions,
    loggerConfig : loggerConfig,
    logLevel : logLevel ,
    mongoConfig : mongoConfig,
    hosts : hosts
}
