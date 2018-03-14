var getopt = require('posix-getopt');
var restify = require('restify');

var ti = require('./server.js');
var sysConfig = require('./config/SystemConfig.js')
var serverLogger = require('./util/ServerLogger.js');
var logger = serverLogger.createLogger('main.js');
var encrypt = require('./util/Encrypt.js');


///--- Globals

var NAME = 'fhu';

// In true UNIX fashion, debug messages go to stderr, and audit records go

function parseOptions() {
    var option;
    var opts = {}
    var parser = new getopt.BasicParser(':h:p:(port)', process.argv);

    while ((option = parser.getopt()) !== undefined) {
        switch (option.option) {
            case 'p':
                opts.port = parseInt(option.optarg, 10);
                break;
            case 'h':
                usage();
                break;

            default:
                usage('invalid option: ' + option.option);
                break;
        }
    }

    return (opts);
}


function usage(msg) {
    if (msg)
        console.error(msg);

    var str = 'usage: ' +
        NAME +
        '[-p port] [-h]';
    console.error(str);
    process.exit(msg ? 1 : 0);
}


(function main() {
    var opt=parseOptions();
    var server = ti.createServer();
    var adminServer = ti.createServer();


    server.listen((opt.port?opt.port:8001), function onListening() {
        server.get('/',restify.serveStatic({
            directory: './public/docs',
            default: 'index.html',
            maxAge: 0
        }));
        logger.info('LOG-API server has been  started ,listening at %s', server.url);
    });
})();