angular.module('myApp').provider('w6log', ['$logProvider', function ($logProvider) {

    var log = null;
    var utils = null;
    var filter = null;
    var studioSettings = null;
    var defaultApp = "Service Edge"

    var logArray = [];

    var createLogObject = function (app, text, type) {
        return {
            app: app,
            text: text,
            time: new Date(),
            type: type
        }
    }

    var createObjectAndWriteToLogIfExists = function (app, text, type) {

        //  return;

        var obj = createLogObject(app, text, type);

        if (log) {
            if (logArray.length > 1000) {
                logArray = [];
            }

            logArray.push(obj);
            //  console.log( logArray.length );
            writeTextToLog(app, text, type);
        }
        else {
            logArray.push(obj);
        }
    }

    var writeTextToLog = function (app, text, type) {

        switch (type) {
            case "time":
                console.time('App: ' + app + ', Log: ' + text);
                break;
            case "timeEnd":
                if ($logProvider.debugEnabled()) {
                    console.timeEnd('App: ' + app + ', Log: ' + text);
                }
                break;
            default:
                log[type]('App: ' + app + ', Log: ' + text);
        }

    }

    var adjustAppName = function (app) {
        if (app == null) {
            if (studioSettings.selectedApp) {
                app = studioSettings.selectedApp.text;
            }
            else {
                app = defaultApp;
            }
        }
        return app;
    }

    this.debugEnabled = function (value) {
        $logProvider.debugEnabled(value);
    }

    this.isDebugEnabled = function () {
        return $logProvider.debugEnabled();
    }
    this.log = function (app, text) {

        app = adjustAppName(app);

        createObjectAndWriteToLogIfExists(app, text, 'log');
    };

    this.time = function (app, text) {

        app = adjustAppName(app);

        createObjectAndWriteToLogIfExists(app, text, 'time');
    }
    this.timeEnd = function (app, text) {

        app = adjustAppName(app);

        createObjectAndWriteToLogIfExists(app, text, 'timeEnd');

    }

    this.info = function (text, app) {

        app = adjustAppName(app);

        createObjectAndWriteToLogIfExists(app, text, 'info');
    };

    this.warn = function (text, app) {

        app = adjustAppName(app);

        createObjectAndWriteToLogIfExists(app, text, 'warn');
    };

    this.debug = function (text, app) {

        if (!this.isDebugEnabled()) {
            // if debug is not Enabled
            return;
        }
        if (typeof text === 'string' || text instanceof String) {
            var timeStamp = filter('date')(new Date(), 'd/M/yy hh:mm:s:sss');
            text = `|** ${timeStamp} **| ${text}`;
        }
        app = adjustAppName(app);

        createObjectAndWriteToLogIfExists(app, text, 'debug');
    };

    this.error = function (text, app) {

        app = adjustAppName(app);

        createObjectAndWriteToLogIfExists(app, text, 'error');
    };

    this.download = function () {
        filesService.downloadFile(
            'export.json',
            angular.toJson(logArray),
            'text/json'
        );
    };

    this.toArray = function () {
        return logArray;
    };

    this.clear = function () {
        logArray = [];
        return logArray;
    };

    this.$get = ['$log', '$filter', 'w6filesService', 'w6studioSettings', function ($log, $filter, w6filesService, w6studioSettings) {
        log = $log;
        filesService = w6filesService;
        filter = $filter;
        studioSettings = w6studioSettings;

        for (var i = 0; i < logArray.length; i++) {
            var currLog = logArray[i];
            writeTextToLog(currLog.app, currLog.text, currLog.type);
        }

        return this;
    }];
}]);