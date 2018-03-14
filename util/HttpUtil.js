/**
 * Created by ling xue on 2016/3/17.
 */

var http = require('http');
var https = require('https');
var oAuthUtil = require('./OAuthUtil.js');
var qs = require('querystring');

function httpGet(host,url,req,params,callback){
    if(params !=null){
        url = url + "?" + qs.stringify(params);
    }
    httpRequest(host,url,req,{},callback,'get');
}

function httpRequest(host,url,req,params,callback,method){
    var paramStr = JSON.stringify(params);
    var options = {
        host: host.host,
        port: host.port,
        path: url,
        method: method!=null?method:'post',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length' : Buffer.byteLength(paramStr, 'utf8')
        }
    }
    try{
        var req = http.request(options, function(res) {
            var data = "";
            res.on('data', function(d){
                data += d;
            });
            res.on('end', function(){
                var resObj = eval("(" + data + ")");
                callback(null,resObj);
            });
        });
        req.write(paramStr);
        req.end();
        req.on('error', function(e) {
            callback(e,null);
        });
    }catch(e){
        console.log(e);
    }
}

function httpsRequest(host,port,url,req,params,callback,method){
    var paramStr = JSON.stringify(params);
    var options = {
        host: host,
        port: port,
        path: url,
        method: method!=null?method:'post',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length' : Buffer.byteLength(paramStr, 'utf8')
        }
    }
    try{
        var req = https.request(options, function(res) {
            var data = "";
            res.on('data', function(d){
                data += d;
            });
            res.on('end', function(){
                try{
                    var resObj = eval("(" + data + ")");
                    callback(null,resObj);
                }catch(e){
                    callback(e,null);
                }

            });
        });
        req.write(paramStr);
        req.end();
        req.on('error', function(e) {
            callback(e,null);
        });
    }catch(e){
        callback(e,null);
    }
}

function httpPost(host,url,req,params,callback){
    httpRequest(host,url,req,params,callback,'post');
}

function httpPut(host,url,req,params,callback){
    httpRequest(host,url,req,params,callback,'put');
}

function httpDelete(host,url,req,params,callback){
    httpRequest(host,url,req,params,callback,'delete');
}

function httpsGet(host,port,url,req,params,callback){
    if(params !=null){
        url = url + "?" + qs.stringify(params);
    }
    httpsRequest(host,port,url,req,{},callback,'get');
}

module.exports ={
    httpGet : httpGet ,
    httpPost  :httpPost,
    httpPut : httpPut ,
    httpDelete : httpDelete ,
    httpsGet : httpsGet
}