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
            var fileTypes = ComponentGenerator.generateDropdown('toolBarFileType', 'File Type:', null, [
                {text: '.jpg', value: 'jpg'},
                {text: '.png', value : 'png'}
            ]);
            fileTypes.className = 'col-sm'
            toolbar.appendChild(fileTypes);
            var saveBtn = ComponentGenerator.generateButton('save', 'Save Image');
            saveBtn.className = "col-sm btn btn-primary btn-sm";
            toolbar.appendChild(saveBtn);
            saveBtn.onclick = () => {
                var file = prompt('Enter file name to save to:');
                if (!file) {
                    return;
                }
                var start = file.lastIndexOf('\\');
                if (start == -1) {
                    start = file.lastIndexOf('/');
                }
                var path = file.substr(start+1, file.lastIndexOf('.')-start-1);
                parent.save(path, fileTypes.value);
            }
        }
    };
}