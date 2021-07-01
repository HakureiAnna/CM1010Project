function SideBar(parent, isVertical,
    sideBarId, sideBarShowClass, sideBarHideClass, 
    mainSectionShowClass, mainSectionHideClass,
    btnShowText, btnHideText) {
    var sideBar = null;
    var collapseBtn = null;
    var mainSection = null;
    var self = this;

    return {
        sideBarId: sideBarId,
        collapsed: false,
        dimensions: null,
        collapse: function() {
            if (!self.collapsed) {
                sideBar.class(sideBarHideClass);
                mainSection.class(mainSectionHideClass);
                parent.resizePlotWindow(self.dimensions, true);
            } else {
                sideBar.class(sideBarShowClass);
                mainSection.class(mainSectionShowClass);
                parent.resizePlotWindow(self.dimensions, false);
            }
            self.collapsed = !self.collapsed;
            
        },
        /*
            function called when resizing the sidebar to update dimensions
            dimensions is updated such that the collapse button is not included in the updated value
            this is done for correct functioning of resizing of plot window
        */
        resize: function() {
            self.dimensions = getDimensions(sideBarId);
            if (isVertical) {
                self.dimensions.height -= getDimensions(sideBarId + 'CollapseBtn').height;
                self.dimensions.width = 0;
            } else {
                self.dimensions.height = 0;
                self.dimensions.width -= getDimensions(sideBarId + 'CollapseBtn').width;
            }
        },
        /*
            initialization function
        */
        setup: function() {
            self = this;
            self.resize();

            sideBar = select('#' + sideBarId);
            mainSection = select('#' + sideBarId + 'MainSection');
            collapseBtn = select('#' + sideBarId + 'CollapseBtn');

            collapseBtn.mouseClicked(self.collapse);
        },
    };
}