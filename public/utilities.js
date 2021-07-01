/*
    helper function to obtain the dimensions of the DOM element
*/
function getDimensions(id) {
    var element = document.getElementById(id);
    var rect = element.getBoundingClientRect();
    return {
        width: rect.width,
        height: rect.height
    };
}

function getTextBoxValue(id) {
    return document.getElementById('txt' + id).value;
}

function getRadioButtonValue(name) {    
    var radios = document.getElementsByName('rad' + name);
    var retVal = null;
    for (var i=0; i<radios.length; ++i) {
        if (radios[i].checked) {
            retVal = radios[i].value;
        }
    }
    return retVal;
}

function getDropdownValue(id) {
    return document.getElementById('drp' + id).value;
}

function getCheckboxValue(id) {
    return document.getElementById('chk' + id).checked;
}