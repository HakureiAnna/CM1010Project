/*
    Base Menu class, this is mainly used for easy templating of menu
*/
function Menu(parent, menuId, componentData) {
    // initialize menu with default components
    componentData.forEach((componentDatum) => {
        ComponentGenerator.generateComponent(menuId, componentDatum);
    });
    var self = this;
    
    var menu = {
        // pointer to self
        self: this,
        // reference to data visualizer
        parent: parent,
        // reference to container for hosting the components
        container: document.getElementById(menuId + 'Container'),
        // get self pointer
        getSelf: function() {
            return this;
        },
        // // add component to menu (after initialization)
        // addComponent: function(component) {
        //     this.components[component.id] = ComponentGenerator.generateComponent(menuId, component);
        // },
        // // remove component from menu (after initialization)
        // removeComponent: function(id) {
        //     if (id in this.components) {
        //         this.container.removeChild(this.components[id]);
        //         delete this.components[id];
        //     }
        // }
    };
        
    return menu;
}