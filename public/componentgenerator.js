
var ComponentGenerator = {
    generateComponent: function(prefix, component) {        
        var cont = document.getElementById(prefix + 'Container');
        var comp = null;
        switch (component.type) {
            case 'radioButtons':
                comp = this.generateRadioButtons(component.label, prefix + component.group, prefix + component.name, component.options);
                break;
            case 'button':
                comp =  this.generateButton(prefix + component.id, component.text);
                break;
            case 'textBox':
                comp = this.generateTextBox(prefix + component.id, component.label);
                break;
            case 'dropDown':
                comp = this.generateDropdown(prefix + component.id, component.label, component.default, component.options);
                break;
            case 'checkbox':
                comp = this.generateCheckbox(prefix + component.id, component.label);
                break;
        }

        if (component.handlers != undefined) {
            component.handlers.forEach(handler => {
                switch (handler.type) {
                    case 'click':
                        comp.onclick = handler.handler;
                        break;
                    case 'change':
                        comp.onchange = handler.handler;
                        break;
                }
            });
        }

        if (comp != null) {
            cont.appendChild(comp);
        }
        return comp;
    },
    generateDiv: function() {
        var div = document.createElement('div');
        div.className = 'form-group';
        return div;
    },
    generateLabel: function(labelText, forId) {
        var label = document.createElement('label');
        label.attributes.for = forId;
        label.innerHTML = labelText;
        return label;
    },

    generateRadioButtons: function(topLabelText, groupId, name, options) {
        var container = this.generateDiv();
        container.appendChild(this.generateLabel(topLabelText, groupId));
        var group = this.generateDiv();
        group.id = groupId;

        options.forEach((option, id) => {

            var box = this.generateDiv();
            box.className = 'form-check form-check-inline';
            var radId = 'rad' + name + id;
            box.appendChild(this.generateLabel(option.label, radId));

            var radio = document.createElement('input');
            radio.type = 'radio';
            radio.className = 'form-check-input';
            radio.id = radId;
            radio.value = option.value;
            radio.name = 'rad' + name;       
            box.appendChild(radio);
            
            group.appendChild(box); 
        });
        container.appendChild(group);

        return container;
    },
    generateTextBox: function(id, labelText) {
        var container = this.generateDiv();
        
        container.appendChild(this.generateLabel(labelText, id));

        var textbox = document.createElement('input');
        textbox.className='form-control';
        textbox.type = 'text';
        textbox.id = 'txt' + id;
        container.appendChild(textbox);
        
        return container;
    },
    generateButton: function(id, text) {
        var container = this.generateDiv();

        var button = document.createElement('button');
        button.className = 'btn btn-primary';
        button.innerHTML = text;
        button.id = 'btn' + id;
        container.appendChild(button);

        return container;
    },
    generateCheckbox: function(id, labelText) {
        var container = this.generateDiv();

        //container.className = 'form-check';
        var inner = this.generateDiv();
        inner.className = 'form-check';
        container.appendChild(inner);

        var label = this.generateLabel(labelText, id);
        label.className = 'form-check-label';
        inner.appendChild(label);

        var checkbox = document.createElement('input');
        checkbox.className = 'form-check-input';
        checkbox.type = 'checkbox';
        checkbox.id = 'chk' + id;
        inner.appendChild(checkbox);

        return container;
    },
    generateDropdown: function(id, labelText, prompt, options) {
        var container = this.generateDiv();
        
        var label = this.generateLabel(labelText, id);
        container.appendChild(label);

        var select = document.createElement('select');
        select.id = 'drp' + id;
        select.className = 'form-select';
        container.appendChild(select);

        var defaultOption = document.createElement('option');
        defaultOption.selected = true;
        defaultOption.innerHTML = prompt;
        select.appendChild(defaultOption);

        for (var i=0; i<options.length; ++i) {
            var option = document.createElement('option');
            option.value = options[i].value;
            option.innerHTML = options[i].text;
            select.appendChild(option)
        }

        return container;
    }
};