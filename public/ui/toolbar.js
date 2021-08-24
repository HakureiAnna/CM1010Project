/**************************************************************
 * File: public/ui/plotwindow.js
 * Description: Tool bar class for features common to all plots
 * such as saving the plot
 * Author: Liu Anna
 **************************************************************/

function Toolbar(parent, toolbarId) {
    return {
        // set up function to set up a save button to save a
        // customized plot to a image file.
        setup: function() {
            var toolbar = document.getElementById(toolbarId);
            var saveBtn = ComponentGenerator.generateButton('save', 'Save Image');
            saveBtn.className = "btn btn-primary btn-sm";
            saveBtn.onclick = () => {
                parent.save();
            }
            toolbar.appendChild(saveBtn);
        }
    };
}