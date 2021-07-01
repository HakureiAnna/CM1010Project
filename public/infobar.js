function InfoBar(parent, infoBarId) {
    var messageOutput = null;
    return {
        setup: function() {
            messageOutput = select('#' + infoBarId + 'MessageOutput');
        },
        log: function(msg) {
            messageOutput.class('messageOutputLog');
            messageOutput.html('LOG: ' + msg);
        },
        warn: function(msg) {
            messageOutput.class('messageOutputWarn');
            messageOutput.html('WARN: ' + msg);

        },
        info: function(msg) {
            messageOutput.class('messageOutputInfo');
            messageOutput.html('INFO: ' + msg);

        },
        error: function(msg) {
            messageOutput.class('messageOutputError');
            messageOutput.html('ERROR: ' + msg);
        }
    };
}