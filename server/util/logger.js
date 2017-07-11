require('colors');
var _ = require('lodash');
var consoleLog = process.env.LOGGER === 'true' ? console.log.bind(console) : function () { };
var logger = {
    log: function () {
        var tag = '[ ✨ LOG ✨ ]'.green;
        var arg = _.toArray(arguments)
            .map(function (args) {
                if (typeof (args) === 'object') {
                    var string = JSON.stringify(args, null, 2);
                    return tag + '   ' + string.green;
                } else {
                    return tag + '   ' + args.green;
                }
            });
        consoleLog.apply(console, arg);
    },

    error: function () {
        var arg = _.toArray(arguments)
            .map(function (arg) {
                arg = arg.stack || arg;
                var name = arg.name || '[ ❌ ERROR ❌ ]';
                var log = name.yellow + '  ' + arg.red;
                return log;
            });

        consoleLog.apply(console, arg);
    }
}

module.exports = logger;