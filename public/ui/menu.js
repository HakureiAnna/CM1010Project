/**************************************************************
 * File: public/ui/menu.js
 * Description: Base Menu class, this is mainly used for 
 * easy templating of menu.
 * Author: Liu Anna
 **************************************************************/

function Menu(parent, menuId, componentData) {
    // initialize menu with default components
    componentData.forEach((componentDatum) => {
        ComponentGenerator.generateComponent(menuId, componentDatum);
    });
    
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
    };
        
    return menu;
}