import 'colors';
import * as _ from 'lodash';
const consoleLog = process.env.LOGGER === 'true' ? console.log.bind(console) : function () { };
const logger = {
    log: function () {
        let tag = '[ ✨ LOG ✨ ]'.green;
        let arg = _.toArray(arguments)
            .map(function (args) {
                if (typeof (args) === 'object') {
                    let string = JSON.stringify(args, null, 2);
                    return tag + '   ' + string.green;
                } else {
                    return tag + '   ' + args.green;
                }
            });
        consoleLog.apply(console, arg);
    },

    error: function () {
        let arg = _.toArray(arguments)
            .map(function (arg) {
                arg = arg.stack || arg;
                let name = arg.name || '[ ❌ ERROR ❌ ]';
                let log = name.yellow + '  ' + arg.red;
                return log;
            });

        consoleLog.apply(console, arg);
    }
}
export default logger;