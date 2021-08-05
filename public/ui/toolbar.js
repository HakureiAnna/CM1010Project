function Toolbar(parent, toolbarId) {
    return {
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