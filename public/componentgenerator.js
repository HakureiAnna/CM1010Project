/*
 Workhorse for the templating system
 */
var ComponentGenerator = {
    /* 
        main function to component generation
        prefix: usually the menu id to ensure components of the same type has no name collision in id
        component: initialization data for component
        suffix: optional parameter for cases where more than one component can possibly be generated (data series)
     */
    generateComponent: function(prefix, component, suffix) {        
        var cont = document.getElementById(prefix + 'Container');
        var comp = null;
        var id = prefix + component.id + (suffix == undefined? '': suffix)
        switch (component.type) {
            case 'radioButtons':
                comp = this.generateRadioButtons(component.label, prefix + component.group, prefix + component.name, component.options);
                break;
            case 'button':
                comp =  this.generateButton(id, component.text);
                break;
            case 'textBox':
                comp = this.generateTextBox(id, component.label);
                break;
            case 'dropDown':
                comp = this.generateDropdown(id, component.label, component.default, component.options, 
                    component.hasOwnProperty('multi')? component.multi: false);
                break;
            case 'checkbox':
                comp = this.generateCheckbox(id, component.label);
                break;
            case 'counter':
                comp = this.generateCounter(id, component.label);
                break;
            case 'colorPicker':
                comp = this.generateColorPicker(id, component.label);
                break;                
        }
        // add event handlers
        if (component.handlers != undefined) {
            component.handlers.forEach(handler => {
                var element = comp.childNodes[handler.target];
                switch (handler.type) {
                    case 'click':
                        element.onclick = handler.handler;
                        break;
                    case 'change':
                        element.onchange = handler.handler;                        
                        break;
                }
            });
        }

        if (comp != null) {
            cont.appendChild(comp);
        }
        return comp;
    },
    /*
        generator for div with default settings
    */
    generateDiv: function() {
        var div = document.createElement('div');
        div.className = 'form-group';
        return div;
    },
    /*
        generator for label with default settings
        labelText: text for label
        forId; id of object to add label to
    */
    generateLabel: function(labelText, forId) {
        var label = document.createElement('label');
        label.attributes.for = forId;
        label.innerHTML = labelText;
        return label;
    },
    /*
        generator for radio button 'group'
        topLabelText: group label text
        groupId: group id
        name: name to correlate all radio buttons by
        options: array of initialization button for individual radio button options
     */
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
    /*
        generator for textbox
        id: textbox id
        labelText: text for label attached to the text box
     */
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
    /*
        generator for color picker
        id: color picker id
        labelText: text for label attached to the color picker
     */
    generateColorPicker: function(id, labelText) {
        var container = this.generateDiv();

        var label = this.generateLabel(labelText, id);
        container.appendChild(label);

        var picker = document.createElement('input');
        picker.className = 'form-control';
        picker.type = 'color';
        picker.id = id;
        picker.value = '#' + parseInt(random() * 256).toString(16)
            + parseInt(random() * 256).toString(16)
            + parseInt(random() * 256).toString(16);
        container.appendChild(picker);

        return container;
    },
    /*
        generator for button
        id: id of button
        text: text to display on button
     */
    generateButton: function(id, text) {
        var container = this.generateDiv();
        
        var button = document.createElement('button');
        button.className = 'btn btn-primary btn-sm btn-block';
        button.style = "width: 100%;";
        button.innerHTML = text;
        button.id = 'btn' + id;
        container.appendChild(button);

        return container;
    },
    /*
        generator for checkbox
        id: id for checkbox
        text: text for label attached to checkbox
     */
    generateCheckbox: function(id, labelText) {
        var container = this.generateDiv();
        container.className = 'form-check';
        var label = this.generateLabel(labelText, id);
        label.className = 'form-check-label';
        container.appendChild(label);

        var checkbox = document.createElement('input');
        checkbox.className = 'form-check-input';
        checkbox.type = 'checkbox';
        checkbox.id = 'chk' + id;
        container.appendChild(checkbox);

        return container;
    },
    /*
        generator for dropdown list
        id: id of list (select)
        labelText: text for label attached to list
        prompt: default option displayed
        options: options to add to the drop down list
     */
    generateDropdown: function(id, labelText, prompt, options, multi) {
        var container = this.generateDiv();
        
        var label = this.generateLabel(labelText, id);
        container.appendChild(label);

        var select = document.createElement('select');
        select.id = 'drp' + id;
        select.className = 'form-select';
        if (multi) {
            select.multiple = true;
        }
        container.appendChild(select);

        if (prompt) {
            var defaultOption = document.createElement('option');
            defaultOption.selected = true;
            defaultOption.innerHTML = prompt;
            defaultOption.value = 'default';
            select.appendChild(defaultOption);
        }

        if (options != undefined) {
            for (var i=0; i<options.length; ++i) {
                var option = document.createElement('option');
                option.value = options[i].value;
                option.innerHTML = options[i].text;
                select.appendChild(option)
            }
        }

        return container;
    },    
    /*
        generator for custom counter component with a label, a count and two buttons for add/ remove
        id: id for counter component
        label: text for label of counter
     */
    generateCounter: function(id, label) {
        var container = this.generateDiv();
        container.className = 'input-group input-group-sm';

        var counterId = 'txt' + id;
        var titleLabel = this.generateLabel(label, counterId);
        titleLabel.className = 'form-control';
        container.appendChild(titleLabel);

        var textBox = document.createElement('input');
        textBox.className = 'form-control';
        textBox.id = counterId;
        textBox.type = 'text';
        textBox.disabled = true;
        container.appendChild(textBox);
        
        var upId = 'btn' + id + 'Up';
        var upButton = document.createElement('button');
        upButton.id = upId;
        upButton.className = 'btn btn-outline-primary';
        upButton.innerHTML = '+';
        container.appendChild(upButton);
        
        var downId = 'btn' + id + 'Down';
        var downButton = document.createElement('button');
        downButton.id = downId;
        downButton.className = 'btn btn-outline-danger'
        downButton.innerHTML = '-';
        container.appendChild(downButton);

        return container;
    },
    /*
        generator for a collapsible card component.
        id: id for the card
        cardText: title to be set on the card header
     */
    generateCard: function(id, cardText) {
        var card = this.generateDiv();
        card.className = 'card';

        var cardHeader = this.generateDiv();
        cardHeader.className = 'card-header';
        card.appendChild(cardHeader);

        var btnHeader = document.createElement('button');
        btnHeader.className = 'btn btn-sm btn-none';
        btnHeader.type = 'button';
        btnHeader.setAttribute('data-bs-toggle', 'collapse');
        btnHeader.setAttribute('data-bs-target', '#' + id + 'CardBody');
        btnHeader.innerHTML = cardText;
        cardHeader.appendChild(btnHeader);

        var body = this.generateDiv();
        body.className = 'collapse';
        body.id = id + 'CardBody';
        card.appendChild(body);

        var cardBody = this.generateDiv();
        cardBody.className = 'card-body';
        cardBody.id = id + 'Container';
        body.appendChild(cardBody);

        return card;
    },
    /*
        modifier for dropdown list, often used to repopulate a dropdown list
        id: id of dropdown
        options: new initialization array for options in the list
        noDefaultOptions: number of options to remain in list after clearing
    */
    modifyDropdown: function(id, options, noDefaultOptions) {        
        var drp = document.getElementById('drp' + id);
        var n = drp.childNodes.length;
        
        while (n > noDefaultOptions) {
            drp.removeChild(drp.childNodes[n-1]);
            n--;
        }

        for (var i=0; i<options.length; ++i) {
            var option = document.createElement('option');
            option.value = options[i];
            option.innerHTML = options[i];
            drp.appendChild(option);
        }
    },
    /*
        updater for textbox
        id: id of textbox
        value: value to set textbox to
     */
    updateTextBox: function(id, value) {

        var text = document.getElementById('txt' + id);
        text.value = value;
    },
    /*
        purge container content.
        container: id of container
        remaining: no. of elements to remain within container
    */
    clearContainer: function(container, remaining) {        
        var n = container.childNodes.length;
        while (n > remaining) {
            container.removeChild(container.childNodes[n-1]);
            n--;
        }
    },
    getMultiselectValue: function(select) {        
        var ops = select.options;
        var selected = [];
        for (var i=0; i<ops.length; ++i) {
            if (ops[i].selected) {
                selected.push(ops[i].value);
            }
        }
        return selected;
    }

};
