/**************************************************************
 * File: public/ui/infobar.js
 * Description:   Info Bar class is used as a simplified 
 * one-line logging system to inform the user of the
 * current application status.
 * Note: the display style (e.g. red text for error message) 
 * is set using CSS class defined in styles.css.
 * Author: Liu Anna
 **************************************************************/

function InfoBar(parent, infoBarId) {
    var messageOutput = null;
    return {
        // setup function to get the output window
        setup: function() {
            messageOutput = select('#' + infoBarId + 'MessageOutput');
        },
        // display plain log message
        log: function(msg) {
            messageOutput.class('messageOutputLog');
            messageOutput.html('LOG: ' + msg);
        },
        // display warning message
        warn: function(msg) {
            messageOutput.class('messageOutputWarn');
            messageOutput.html('WARN: ' + msg);

        },
        // display information system
        info: function(msg) {
            messageOutput.class('messageOutputInfo');
            messageOutput.html('INFO: ' + msg);

        },
        // display error message
        error: function(msg) {
            messageOutput.class('messageOutputError');
            messageOutput.html('ERROR: ' + msg);
        },
        // function used to clear the info bar
        clear: function() {
            messageOutput.html('');
        }
    };
}