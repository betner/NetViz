/*
 * File: ext.js
 *
 * Author: Steve Eriksson - steve.eriksson@gmail.com
 *
 * This is where one should put new functionality for user interaction with the
 * SVG document.
 * A number of functions are provided for showing how to use the base and gui 
 * libraries. 
 *
 */


/*
 * Make clicks on nodes in the document show the function menu
 */
base.nodeClickDispatch.addFunction( 'show_menu', function( evt ) {
    gui.functionMenu.show( evt );
} );


/*
 * Since GraphViz styles the elements in the SVG document by using the
 * style attribute we cannot override those attributes by providing
 * a CSS file. Therefore we must set some attributes explicitly in JavaScript 
 * like below.
 */

// Highlight nodes when user moves the mouse over it
base.nodeMouseOverDispatch.addFunction( 'hightlight', function( evt ) {
    // Retrieve the graphical element in the group
    // that triggered the event and style it
    var element = base.getNodeElement( evt );
    if (element) {
        element.style.setProperty( 'stroke', 'black', '' );
        element.style.setProperty( 'stroke-width', '3px', '' );
    }
} );

// De-highlight
base.nodeMouseOutDispatch.addFunction( 'hightlight', function( evt ) {
    var element = base.getNodeElement( evt );
    if (element) {
	element.style.removeProperty( 'stroke' );
    }
    } );

// Highlight the edges
base.edgeMouseOverDispatch.addFunction( 'highlight', function( evt ) {
    var element = base.getEdgeElement( evt );
    if (element) {
	element.style.setProperty( 'stroke', 'red', '' );
	// Append this elements group last in the graph
	// group so that it is rendered on top of other 
	// elements representing links
	base.getGraphGroup().appendChild( element.parentNode );
    }
    } );

// De-highlight
base.edgeMouseOutDispatch.addFunction( 'de-highlight', function( evt ) {
    var element = base.getEdgeElement( evt );
    if (element) element.style.setProperty( 'stroke', 'grey', '' );
} );


/* 
 * Show an alert with the ID of the group that contains the element
 * triggering the event
 */
base.edgeClickDispatch.addFunction( 'popup', function( evt ) {
    alert( 'edge_clicked -> group id:' + evt.target.parentNode.id );
} );

/* 
 * Make an asynchronous call to a CGI script and show the result
 */
base.edgeClickDispatch.addFunction( 'ajax', function( evt ) {
    base.makePlainXMLRequest( 'GET', '/~steeri/cgi-bin/ajax_test.pl?key=edge_ajax', function( response ) { alert( response ) } );
} );


/*
 * This function creates an asynchronous call to a CGI script that lookups
 * the node's IP address
 */
function hostToIP() {
    // Get the element that triggered the display of the function menu
    var elem = gui.functionMenu.currentElement();
    var hostname = elem.parentNode.getElementsByTagName( 'title' )[0].childNodes[0].nodeValue;
    var textGroup = document.createElementNS( svgNS, 'g' );

    // This function is called when and if the asynchronous call is successful
    var showResult = function( response ) {
	var textGroup = gui.stringToText( response );
        gui.createPopup( textGroup );  // No config parameter implies default values
    };
    
    // Perform an asynchronous call
    base.makePlainXMLRequest( 'GET', 
                              '/~steeri/cgi-bin/hostToIP.pl?host=' + hostname, 
                              function( response ) { showResult( response ); } );

    // Hide the function menu when the user clicks on this function
    gui.functionMenu.hide();
}

/*
 * Make an asynchronous call to a CGI script that pings the node.
 * This will only work correctly if the script is run within Telenors network.
 */
function pingNode() {
    var elem = gui.functionMenu.currentElement();
    var hostname = elem.parentNode.getElementsByTagName( 'title' )[0].childNodes[0].nodeValue;

    var showResult = function( response ) {
	var textGroup = gui.stringToText( response );
        gui.createPopup( textGroup );  // No config parameter implies default values
    };

    base.makePlainXMLRequest( 'GET', 
                              '/~steeri/cgi-bin/pingNode.pl?host=' + hostname, 
                              function( response ) { showResult( response ); } );
    gui.functionMenu.hide();
}


/*
 * Make an asynchronous call to a CGI script that returns information regarding
 * the nodes hardware.
 */
function getHW() {
    var elem = gui.functionMenu.currentElement();
    var hostname = elem.parentNode.getElementsByTagName( 'title' )[0].childNodes[0].nodeValue;
    
    var showResult = function( response ) {
	var stringArray = response.split( ',' );
	var textGroup = gui.stringArrayToText( stringArray );
	gui.createPopup( textGroup );
    };

    base.makePlainXMLRequest( 'GET',
			      '/~steeri/cgi-bin/getHWInfo.pl?host=' + hostname,
			      function( response ) { showResult( response ); } );
    gui.functionMenu.hide();
}


/*
 * This function show how one can use the timedDispatch for scheduling recurring
 * calls to functions.
 * The result of running the function below is another function that is called
 * when a user clicks on it in the function menu.
 * This is an example on how one can use closures.
 */
var timedEventTest = function() {
    // Private variable that is used to toggle the timer
    var running = false;
   
    // Add timed events
    base.timedDispatch.addFunction( 'show_alert', 
                                    function() { alert( 'Timed event 1' ); } );
    base.timedDispatch.addFunction( 'show_alert2', 
                                    function() { alert( 'Timed event 2' ); } );

    // Remove the first function
    base.timedDispatch.removeFunction( 'show_alert' ); 

    // The function below is returned and can be referenced by timedEventTest
    return function() {

        if (running) {
            running = false;
            base.timedDispatch.stopTimer();
        } else {
            running = true;
            base.timedDispatch.startTimer( 5000 ); // Set timeout to 5 seconds
        }
        gui.functionMenu.hide(); 
    };
}(); // Notice the function call, it creates a closure


/* 
 * Example function that queries a CGi script for open TT's for a given node.
 * The result is show as HTML in a popup window and not in a SVG popup.
 * This might be preferable since it's easy to display and format that output
 * and also copy it.
 */
function showOpenTT() {
    var elem = gui.functionMenu.currentElement();
    var hostname = elem.parentNode.getElementsByTagName( 'title' )[0].childNodes[0].nodeValue;
    window.open( 'showOpenTT.pl?host=' + hostname,
		 'Open trouble tickets for: ' + hostname,
		 width = 350, height = 250 );
}


/*
 * Configuration for the menu containing available functions, AKA function menu
 */
var menuConfig = { x: base.viewBoxCenter - 400, y: 0, width: 800, 
                   height: 200, rx: 5, ry: 5,
                   functions: { 'Get IP adress': hostToIP,
                                'Show open trouble tickets': showOpenTT,
                                'Toggle timed events': timedEventTest,
                                'Ping node': pingNode,
				'Show hardware info': getHW
                              } 
                 };


/* 
 * Create the function menu when the SVG document is done loading and use 
 * the configuration above
 */
base.svgLoadDispatch.addFunction( 'create_menu', 
                                  function() { 
                                      gui.functionMenu.create( menuConfig ) } );




