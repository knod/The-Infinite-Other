/* Created 02/17/15 

Resources:
- http://stackoverflow.com/questions/12066870/how-to-check-if-an-element-is-overlapping-other-elements
- https://github.com/tysonmatanich/getEmPixels/blob/master/getEmPixels.js
*/

'use strict'

var Utilities = function ( id ) {

	var util = {};
	util.id = id;


	util.getRandomIntInRange = function ( min, stopBefore ) {
	/* ( int, int ) -> int

	WARNING: max value is excluded from results
	Returns an integer between min and max
	*/
	  return Math.floor(Math.random() * (stopBefore - min)) + min;
	};  // End Utilities.randomIntInRange()


	util.chooseRandom = function ( choiceList ) {
	/* ( [] ) -> *

	Returns a random value from choiceList
	*/
		var self = this;

		var randInt = self.getRandomIntInRange( 0, choiceList.length );
		return choiceList[ randInt ];
	};  // end Utilities.chooseRandom()


	// ================
	// COMPARE
	// ================

	util.hasSomeOverlap = function ( DOM1, DOM2 ) {
	/* ( DOM, DOM ) -> bool

	*/
		var rect1 = DOM1.getBoundingClientRect();
		var rect2 = DOM2.getBoundingClientRect();

		// Wish I had a visualization for this logic
		var someOverlap = !(
			rect1.right < rect2.left || 
			rect1.left > rect2.right || 
			rect1.bottom < rect2.top || 
			rect1.top > rect2.bottom
	    );

		return someOverlap;
	};  // end Utilities.hasSomeOverlap


	util.isInside = function ( DOM1, DOM2 ) {
	/* ( DOM, DOM ) -> bool

	*/
		var rect1 = DOM1.getBoundingClientRect();
		var rect2 = DOM2.getBoundingClientRect();

		// Wish I had a visualization for this logic (like t and f on the edges)
		var inside = (
			( (rect2.top <= rect1.top) && (rect1.top <= rect2.bottom) ) &&
			( (rect2.top <= rect1.bottom) && (rect1.bottom <= rect2.bottom) ) &&
			( (rect2.left <= rect1.left) && (rect1.left <= rect2.right) ) &&
			( (rect2.left <= rect1.right) && (rect1.right <= rect2.right) )
		);

		return inside;
	};  // end Utilities.hasSomeOverlap


	// TODO: ?Change to eventually return object like
	// _whichEdgeHit triggers in bullet?
	util.doesOverlap = function ( DOM1, DOM2 ) {
	/* ( DOM, DOM ) -> bool

	*/
		var self = this;

		var rect1 = DOM1.getBoundingClientRect();
		var rect2 = DOM2.getBoundingClientRect();

		// Wish I had a visualization for this logic (like t and f on the edges)

		var someOverlap = self.hasSomeOverlap( DOM1, DOM2 );
		var inside = self.isInside( DOM1, DOM2 );

		return someOverlap || inside;
	};  // end Utilities.doesOverlap()


	// WARNING: DOES NOT HANDLE MULTIPLE EDGES AT THE SAME TIME
	// WARNING: ONLY FOR CHECKING ELEMENTS CONTAINED IN OTHER ELEMENTS
	// TODO: Should this be called "outsideOfWhichEdge"? "pastWhichEdge"?
	util.whichEdgeHit = function ( innerElem, surroundingElem, speed ) {
	/* ( DOM, DOM, int ) -> str

	speed IS GIVEN IN %
	If an edge is hit, returns name of that edge. If not, returns null.
	Add a fraction (how much?) of speed to position of innerElem
	in each direction to test if the next step could take it out of bounds.
	*/
		var self = this;

		var innerRect 		= innerElem.getBoundingClientRect();
		var surroundingRect = surroundingElem.getBoundingClientRect();
		var edgeHit 		= "none";

		var buffer			= (( speed/2 ) / 100) * surroundingElem.clientWidth;

		var futureLeft 		= innerRect.left - buffer,
			futureRight 	= innerRect.right + buffer,
			futureTop		= innerRect.top - buffer,
			futureBottom	= innerRect.bottom + buffer
		;  // end vars

		if ( futureLeft < surroundingRect.left ) { edgeHit = "left"; }
		else if ( futureRight > surroundingRect.right ) { edgeHit = "right"; }
		else if ( futureTop < surroundingRect.top ) { edgeHit = "top"; }
		else if ( futureBottom > surroundingRect.bottom ) { edgeHit = "bottom"; }

		// Test
		// if (hitsEdge) {
		// 	innerElem.style["background-color"] = "red";
		// }

		return edgeHit;
	};  // end Utilities.whichEdgeHit()


    util.getPixelOffsetFromAncestor = function ( childElem, ancestorElem, offsetType ) {
    /* ( HTML, HTML, str ) -> num

	childElem MUST HAVE ancestorElem AS AN ANCESTOR
    */

    	var totalOffset 	= 0;
    	var currElem		= childElem;

    	// Cycle through the ancestors, adding offsets together, until
    	// the right ancestor is reached
    	while ( (currElem !== ancestorElem) && (currElem !== document.body) ) {

    		totalOffset += currElem[ offsetType ];
    		// LOOP
    		currElem = currElem.parentNode;
    	}

    	if ( currElem !== ancestorElem ) { totalOffset = "There was no such ancestor!"; }

    	return totalOffset;

    };  // End Utilities.getPixelOffsetFromAncestor()


    // TODO: I suspect this isn't really very effective
    util.distanceBetweenSides = function ( elem1, elem2, side1, side2 ) {
    /* ( DOM obj, DOM obj, str, str ) -> int

	Returns the distance between the two elements and their given sides
	*/

    	var side1 	= elem1.getBoundingClientRect()[ side1 ];
    	var side2	= elem2.getBoundingClientRect()[ side2 ];

    	return (side1 - side2);

    };  // end Utilities.distanceBetweenSides()


    // TODO: I suspect this isn't really very effective either
    util.pastWhichEdge = function ( sideDiff, alongAxis ) {
    /*

	Parses int distance difference into which side the element is on
    */
    	var self = this;

    	var passedSide = "none";

    	if ( alongAxis === "y" ) {
	    	if ( sideDiff < 0 ) { passedSide = "top"; }
	    	else if ( sideDiff > 0 ) { passedSide = "bottom"; }
    	} else if ( alongAxis === "x" ) {
	    	if ( sideDiff < 0 ) { passedSide = "left"; }
	    	else if ( sideDiff > 0 ) { passedSide = "right"; }
    	} else {
    		// Will this show the stack trace?
    		console.error( "No axis has been given, so there's no way to tell if the difference is between the top and bottom, or the left and right." );
    	}

    	return passedSide;

    };  // end Utilities.pastWhichEdge()


	// ===============
	// CONVERTING
	// ===============

	/*! getEmPixels  | Author: Tyson Matanich (http://matanich.com), 2013 | License: MIT */

    // Form the style on the fly to result in smaller minified file
    var important = "!important;";
    var style = "position:absolute" + important + "visibility:hidden" + important + "width:1em" + important + "font-size:1em" + important + "padding:0" + important;

    util.getPixelValueOfOneEm = function (element) {

        var extraBody;

        if (!element) {
            // Emulate the documentElement to get rem value (documentElement does not work in IE6-7)
            element = extraBody = document.createElement("body");
            extraBody.style.cssText = "font-size:1em" + important;
            documentElement.insertBefore(extraBody, document.body);
        }

        // Create and style a test element
        var testElement = document.createElement("i");
        testElement.style.cssText = style;
        element.appendChild(testElement);

        // Get the client width of the test element
        var value = testElement.clientWidth;

        if (extraBody) {
            // Remove the extra body element
            documentElement.removeChild(extraBody);
        }
        else {
            // Remove the test element
            element.removeChild(testElement);
        }

        // Return the em value in pixels
        return value;
    };  // end Utilities.getPixelValueOfOneEm()


    util.convertEmsToPixels = function ( emElem, emValue ) {
    /* ( DOM, num ) -> num

	Converts a property in pixels to its value in em's relative to
	emElem
    */

    	var pixelsInOneEm 	= Util.getPixelValueOfOneEm( emElem );
		var pxValue 		= pixelsInOneEm * emValue;

		return pxValue;

    };  // end Utilities.convertEmsToPixels()


    // Note of interest: attribute is HTML, property is the DOM
    util.convertPixelsToEms = function ( emElem, pxValue ) {
    /* ( DOM, num ) -> num

	Converts a property in pixels to its value in em's relative to
	emElem
    */

    	var pixelsInOneEm 	= Util.getPixelValueOfOneEm( emElem );
		var emValue 		= pxValue / pixelsInOneEm;

		return emValue;

    };  // end Utilities.convertPixelsToEms()


    // Note of interest: attribute is HTML, property is the DOM
    util.convertPixelsToRems = function ( pxValue ) {
    /* ( num ) -> num

	Converts a property in pixels to its value in rem's
    */

    	var oneRemToPixels = Util.getPixelValueOfOneEm( document.body );
		var remValue = pxValue / oneRemToPixels;

		return remValue;

    };  // end Utilities.convertPixelsToRems()


    util.percentToPx = function ( percentVal, referenceElem, property ) {
    /*  ( num, DOM obj, str ) ->

	Convert's a percentage value into pixels based on the property of the 
	give reference element.

	WARNING: Should be based on the client property (the inside of the element),
	which, I think, is what percent widths are based off. Don't use the offset
	property. Should specifically be either clientWidth or clientHeight
	WARNING: property must return a numerical value

	TODO: build property based off of string by parsing property string (or
	just check for the correct type of property and warn)
    */

    	if( property.indexOf('client') === -1) {
		  console.warn( "In percentToPx, the property given was not a client based property. Client based properties, like clientWidth or client Height are what html percent values are based off of." );
		}

    	var referenceProp 	= referenceElem[ property ];
    	var pxVal 			= referenceProp * ( percentVal / 100 );

    	return pxVal;
    };  // end Utilities.percentToPx()


	// http://stackoverflow.com/questions/5588465/javascript-parse-time-minutesseconds-from-miliseconds
    util.msToMMSS = function ( msValue ) {
    /* ( int or str ) -> str

    */
    	var msInt	= parseInt( msValue, 10 );
    	var min 	= parseInt( msInt/1000/60 );
    	var sec 	= ( msInt/1000 ) % 60;

    	if ( min < 10 ) { min = "0" + min; }
    	if ( sec < 10 ) { sec = "0" + sec; }

    	return (min + ":" + sec)
	};  // End Utilities.msToMMSS()


    // ==========
    // END
    // ==========
	return util;
};  // end Utilities()


// Tests
/*
02/18/15
var x = Utilities();
var dom1 = document.getElementsByClassName( "other" )[0];
var dom2 = document.getElementsByClassName("field")[0];
console.log(x.doesOverlap( dom1, dom2 ));  // Expected: true
var dom3 = document.getElementsByClassName("other")[1];
console.log(x.doesOverlap( dom1, dom3 ));  // Expected: false
*/

