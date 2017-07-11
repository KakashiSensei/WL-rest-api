var page = require('webpage').create()
var system = require('system')
var t
if (system.args.length !== 3) {
    console.log('Incorrect number of arguments');
    phantom.exit()
}
t = Date.now();
var domElement = system.args[1];
var fileName = system.args[2];
page.settings.localToRemoteUrlAccessEnabled = true;
page.settings.webSecurityEnabled = false;
page.onLoadFinished = function () {
    page.render(fileName, { format: 'png', quality: '10' });
    t = Date.now() - t
    console.log("Rendering time " + t + " msec");
    phantom.exit();
}
page.content = domElement;