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

/*
    helper function to obtain current value of textbox
    id: textbox id
 */
function getTextBoxValue(id) {
    return document.getElementById('txt' + id).value;
}

/*
    helper function to obtain current value of radio button group
    name: name of radio button set
 */
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

/*
    helper function to get dropdown list (select) value
    id: drop down list id
 */
function getDropdownValue(id) {
    return document.getElementById('drp' + id).value;
}

/*
    helper function to get if checkbox is checked
    id: checkbox id
*/
function getCheckboxValue(id) {
    return document.getElementById('chk' + id).checked;
}