function Menu(parent, menuId, componentData) {
    var components = {};
    componentData.forEach((componentDatum) => {
        components[componentDatum.id] =  ComponentGenerator.generateComponent(menuId, componentDatum);
    });
    var self = this;

    var menu = {
        self: this,
        parent: parent,
        container: document.getElementById(menuId + 'Container'),
        components: components,
        getSelf: function() {
            return this;
        },
        addComponent: function(component) {
            this.components[component.id] = ComponentGenerator.generateComponent(menuId, component);
        },
        removeComponent: function(id) {
            if (id in this.components) {
                this.container.removeChild(this.components[id]);
                delete this.components[id];
            }
        }
    };
        
    return menu;
}