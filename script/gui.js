/*
 * File: ext.js
 *
 * Author: Steve Eriksson - steve.eriksson@gmail.com
 *
 * This file provides functionality for creating a function menu, popups and
 * controlling their behaviour. New widgets and graphical extensions should be
 * put in this file since it's guaranteed to be parsed before any user created
 * functions in ext.js.
 */


// Namespace object
var gui = {};


/*
 * A menu holding a number of functions that can be performed
 * on a given node. When the menu is asked to be shown or hidden
 * an event object should be passed so that the target object is
 * registered with the menu. This way functions that are called in the
 * menu can use the target object as the originator for the call.
 * 
 */
gui.functionMenu = function() {
    var currentElement; // last element to interact with the menu
    var menu;
    var x, y;   // top left coords
    var rx, ry; // rounded corners
    var width, height;
    var functions;

    /*
     * Interface of the function menu object
     */
    return {
         show: function( evt ) {
             if (menu) {
                menu.setAttribute( 'display', 'block' );
                gui.fadeIn( menu );
                if (evt) currentElement = evt.target;
            /*} else {
              throw exception
            }*/
             }
        },
        
        hide: function( evt ) {
            gui.fadeOut( menu, function() { menu.setAttribute( 'display', 'none'); } );
            if (evt) currentElement = evt.target;
        },
        
         addFunctions: function( functions ) {
             this.removeFunctions();
             this.createFunctionGroup( functions, menuGroup );
        },
         
         removeFunctions: function() {
             menuGroup.removeChild( 'functionGroup' );
         },
         
        currentElement: function() { return currentElement; },

        /*
         * Create a function menu in the document tree.
         * If a configuration object is provided it will be used
         * to tweak the parameters of the menu.
         *
         * Configuration object layout (the order of the entries isn't important):
         * {
         *   x: px, y: px, rx: px, ry: px, width: px, height: px,
         *   functions: { description/name: function object }
         * }
         *  Where x, y are upper left corner of the menu
         *        rx, ry sets the roundness of the menus corners
         *
         * Parameter: config - Object literal
         */
        create: function( config ) {
            var menuGroup = document.createElementNS( svgNS, 'g' );
            var menuBG    = document.createElementNS( svgNS, 'rect' );
            var closeText = document.createElementNS( svgNS, 'text' );
            var closeTextWidthOffset  = 50;
            var closeTextHeightOffset = 10;

            // If custom settings are provided in the config object they should be set
            x  = (config && config.x)  ? config.x  : base.viewBoxCenter.x - 400;
            y  = (config && config.y)  ? config.y  : 0;
            rx = (config && config.rx) ? config.rx : 5;
            ry = (config && config.ry) ? config.ry : 5;
            
            width  = (config && config.width)  ? config.width  : 800;
            height = (config && config.height) ? config.height : 400;
            
            // Create a group representing the whole menu
            menuGroup.setAttribute( 'id', 'functionMenu' );
            menuGroup.setAttribute( 'display', 'none' ); // Don't render
            menuGroup.setAttribute( 'opacity', 0.0 );    // Don't show
            menuGroup.appendChild( menuBG );
            menuGroup.appendChild( closeText );

            // The menu's background
            menuBG.setAttribute( 'class', 'window' );   
            menuBG.setAttribute( 'width',  width );
            menuBG.setAttribute( 'height', height );
            menuBG.setAttribute( 'x', x );
            menuBG.setAttribute( 'y', y );
            menuBG.setAttribute( 'rx', rx );
            menuBG.setAttribute( 'ry', ry );
            
            // The clickable close text in the menu
            closeText.setAttribute( 'class', 'menu_text' );
            closeText.setAttribute( 'x', x + width  - closeTextWidthOffset  );
            closeText.setAttribute( 'y', y + height - closeTextHeightOffset );
            closeText.appendChild( document.createTextNode( 'Close' ) );
            closeText.onclick = function() { 
                gui.fadeOut( menu, 
                             function() { 
                                 menu.setAttribute( 'display', 'none'); 
                             } ); 
            };

            // If the user has provided function entries they should
             // be added to the menu
            if (config && config.functions) {
                try {
                    createFunctionGroup( config.functions, menuGroup );
                } catch( e ) {
                    alert( e.name + ': ' + e.message );
                }
            }

             // Add the menu to the document
            base.svgRoot.appendChild( menuGroup );
            menuGroup.setAttribute( 'display', 'none' ); // Don't render
            menu = menuGroup;

            // Make the menu disappear when a user press escape
            base.svgRoot.addEventListener( 'keyup', function( evt ) {
                if ( evt.keyCode == 27) gui.functionMenu.hide();
            }, null );
        }
     };
    
    /* 
     * Helper function that popualate the menu with functions and descriptions
     *
     * Throws: CreateFunctionGroupError - exceeded allowed number of functions
     *
     * Parameter: functions - object literal holding functions and their description
     * Parameter: container - the element this menu should be attached to in the DOM tree
     */
    function createFunctionGroup( functions, container ) {
        var padding = 40;
        var maxRows = 4;
        var maxCols = 3;
        var colSpacing = 200;
        var rows = 0;
        var colX = padding + x;
        var rowY = padding + y;
        var functionGroup = document.createElementNS( svgNS, 'g' );

        functionGroup.setAttribute( 'id', 'functionGroup' );
               
        // Check if there's room for text elements representing the functions
        if (functions.length > maxCols * maxRows) {
            throw { name: 'CreateFunctionGroupError', 
                    error: 'Exceeded maximum amount of functions in the menu' };
        }

        // Create text elements for the functions
        for (name in functions) {
            if (rows === maxRows) {
                rows = 0;
                rowY = padding + y;
                colX += colSpacing;
            }
            var text     = document.createElementNS( svgNS, 'text' );
            var textNode = document.createTextNode( name );
            
            text.setAttribute( 'x', colX );
            text.setAttribute( 'y', rowY );
            text.setAttribute( 'class', 'menu_text' );
            text.onclick     = functions[name];
            
            text.appendChild( textNode );
            functionGroup.appendChild( text );

            rowY += 40;
            rows++;
        }
        container.appendChild( functionGroup );
    }
}(); // execute function and return interface object in closure



/*
 * Create a popup
 * If no configuration is provided default values will be used
 * 
 * The height and width of the popup doesn't adjust automatically
 * after the provided content but should be set by the caller in 
 * the configuration object.
 *
 * Parameter: contents - SVG that represents the text to be shown
 * Parameter: config   - SVG group containing the content
 */
gui.createPopup = function( content, config ) {
    var popup    = document.createElementNS( svgNS, 'g'     );
    var popupBG  = document.createElementNS( svgNS, 'rect'  );
    var titlebar = document.createElementNS( svgNS, 'rect'  );
    var closeBtn = document.createElementNS( svgNS, 'circle');
   
    // Configure the popup window based on config object and default values
    var width  = (config && config.width)  ? config.width  : 500;
    var height = (config && config.height) ? config.height : 300;    
    var center = width / 2;
    var x  = (config && config.x)  ? config.x  : base.viewBoxCenter.x - (width / 2);
    var y  = (config && config.y)  ? config.y  : base.viewBoxCenter.y - height;
    var rx = (config && config.rx) ? config.rx : 10;
    var ry = (config && config.ry) ? config.ry : 10;

    var titleBarHeight = 25;
    var titleBarOffset = 25;
    
    var contentX = x + (width / 2);
    var contentY = y + titleBarHeight + titleBarOffset;

    // Position the group on the popup
    content.setAttribute( 'transform', 
			  'translate(' + contentX + ',' + contentY + ')' );

    // Configure the popup
    popup.setAttribute( 'id', 'popup' );
    popup.setAttribute( 'opacity', 0.0 ); // start hidden
    popup.appendChild( popupBG );
    popup.appendChild( content );
    popup.appendChild( titlebar );
    popup.appendChild( closeBtn );
   
    // Configure the titlebar
    titlebar.setAttribute( 'class', 'titlebar' );
    titlebar.setAttribute( 'x', x );
    titlebar.setAttribute( 'y', y );
    titlebar.setAttribute( 'width', width );
    titlebar.setAttribute( 'height', titleBarHeight );

    // Configure the close button
    closeBtn.setAttribute( 'class', 'button' );
    closeBtn.setAttribute( 'cx', x + width - 12 );
    closeBtn.setAttribute( 'cy', y + 12 );
    closeBtn.setAttribute( 'r', 10 );
    closeBtn.onclick = function() { 
        gui.fadeOut( popup, function() { popup.parentNode.removeChild( popup ); } )};

    // Configure the background rectangle of the popup
    popupBG.setAttribute( 'x', x );
    popupBG.setAttribute( 'y', y );
    popupBG.setAttribute( 'rx', rx );
    popupBG.setAttribute( 'ry', ry );
    popupBG.setAttribute( 'width', width );
    popupBG.setAttribute( 'height', height );  
    popupBG.setAttribute( 'class', 'window' );   
  
    // Add the popup to the document and show it
    base.svgRoot.appendChild( popup );
    gui.fadeIn( popup );
    
    // Return a reference to the popup window
    return popup;
};



/*
 * Helper function that translates given x and y coordinates
 * to the coordinate system used by the root element.
 * Useful if translations are used in the document.
 */
gui.calcCoords = function( evt ) {
    var matrix = document.documentElement.getScreenCTM();
    var point  = document.documentElement.createSVGPoint();
    point.x = evt.clientX;
    point.y = evt.clientY;

    point = point.matrixTransform( matrix.inverse() );
    point.x = point.x + window.scrollX;
    point.y = point.y + window.scrollY;

    return point;
};


/* 
* Make the object fade in or fade out depending on the given comparator
* The objects opacity attribute is used to make it more or less visible
* 
* Parameter: node       - object to fade
* Parameter: opacity    - starting value, is changed during fade
* Parameter: endVal     - the end value for the opacity
* Parameter: step       - how much should the opacity be changed each iteration
* Parameter: comparator - should be less than or greater than comparison
* Parameter: cleanup    - function to be called when the animation is complete
*                         this could be used to remove the object from the doc
*                         the parameter is optional
*/
gui.fade = function( node, opacity, endVal, step, comparator, cleanup ) {
    var fader = function() {
        // Should we continue fading?
        if (comparator( opacity, endVal )) {
            node.setAttribute( 'opacity', opacity );
            opacity += step;
            setTimeout( fader, 20 );
        } else {
            cleanup && cleanup(); // perform cleanup
        }
    };
    setTimeout( fader, 20 );
};


/*
 * Wrapper for the fade function
 * The cleanup function is optional
 * The comparator is "less than"
 */
gui.fadeIn = function( node, cleanup ) {
    gui.fade( node, 0.0, 1.0, 0.1, function( x, y ) { return x < y; }, cleanup );
};

/*
 * Wrapper for the fade function
 * The cleanup function is optional
 * The comparator is "greater than"
 */
gui.fadeOut = function( node, cleanup ) {
    gui.fade( node, 1.0, 0.0, -0.1, function( x, y ) { return x > y; }, cleanup );
};


/*
 * Takes an array of strings and returns a SVG group containing
 * one text element for every object in the array.
 * Every string in the array becomes one row in the text group.
 *
 * Parameter: stringArray - the array of strings
 * Parameter: yPadding    - the padding between rows
 */
gui.stringArrayToText = function( stringArray, yPadding ) {
	var textGroup = document.createElementNS( svgNS, 'g' );
	var yOffset = 0;
	var padding = yPadding || 20;
	for (i = 0; i < stringArray.length; i++) {
	    var text = document.createElementNS( svgNS, 'text' );
	    var textNode = document.createTextNode( stringArray[i] );
	    text.appendChild( textNode );
	    text.setAttribute( 'y', yOffset );
	    text.setAttribute( 'class', 'popup' );
	    textGroup.appendChild( text );
	    yOffset += padding;
	}
	return textGroup;
};

/*
 * Takes a single string and returns a SVG group containing
 * one text element with the string.
 *
 * Parameter: string - the string that should be used in the 
 *                     text element
 */
gui.stringToText = function( string ) {
    var textGroup = document.createElementNS( svgNS, 'g' );
    var text      = document.createElementNS( svgNS, 'text' );
    var textNode  = document.createTextNode( string );
    
    text.appendChild( textNode );
    text.setAttribute( 'class', 'popup' );
    textGroup.appendChild( text );

    return textGroup;
};