/* Created 02/17/15 

Resources:
- http://stackoverflow.com/questions/12066870/how-to-check-if-an-element-is-overlapping-other-elements
- https://github.com/tysonmatanich/getEmPixels/blob/master/getEmPixels.js
*/

'use strict'

var Utilities = function ( id ) {

	var util = {};
	util.id = id;

	util._hasSomeOverlap = function ( DOM1, DOM2 ) {
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
	};  // end Utilities._hasSomeOverlap

	util._isInside = function ( DOM1, DOM2 ) {
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
	};  // end Utilities._hasSomeOverlap


	// TODO: ?Change to eventually return object like
	// _edgeHit triggers in bullet?
	util._doesOverlap = function ( DOM1, DOM2 ) {
	/* ( DOM, DOM ) -> bool

	*/
		var self = this;

		var rect1 = DOM1.getBoundingClientRect();
		var rect2 = DOM2.getBoundingClientRect();

		// Wish I had a visualization for this logic (like t and f on the edges)

		var someOverlap = self._hasSomeOverlap( DOM1, DOM2 );
		var inside = self._isInside( DOM1, DOM2 );

		return someOverlap || inside;
	};  // end Utilities._doesOverlap()


	// WARNING: DOES NOT HANDLE MULTIPLE EDGES AT THE SAME TIME
	util._edgeHit = function ( innerElem, surroundingElem ) {
	/* ( DOM, DOM ) -> str

	If an edge is hit, returns name of that edge. If not, returns null.
	*/
		var self = this;

		var innerRect = innerElem.getBoundingClientRect();
		var surroundingRect = surroundingElem.getBoundingClientRect();
		var edgeHit = null;

		if ( innerRect.left <= surroundingRect.left ) { edgeHit = "left"; }
		else if ( innerRect.right >= surroundingRect.right ) { edgeHit = "right"; }
		else if ( innerRect.top <= surroundingRect.top ) { edgeHit = "top"; }
		else if ( innerRect.bottom >= surroundingRect.bottom ) { edgeHit = "bottom"; }

		// Test
		// if (hitsEdge) {
		// 	innerElem.style["background-color"] = "red";
		// }

		return edgeHit;
	};  // end Utilities._edgeHit()


	/*! getEmPixels  | Author: Tyson Matanich (http://matanich.com), 2013 | License: MIT */

    // Form the style on the fly to result in smaller minified file
    var important = "!important;";
    var style = "position:absolute" + important + "visibility:hidden" + important + "width:1em" + important + "font-size:1em" + important + "padding:0" + important;

    util._getEmPixels = function (element) {

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
    };  // end Utilities._getEmPixels()


	return util;
};  // end Utilities()


// Tests
/*
02/18/15
var x = Utilities();
var dom1 = document.getElementsByClassName( "other" )[0];
var dom2 = document.getElementsByClassName("game-container")[0];
console.log(x._doesOverlap( dom1, dom2 ));  // Expected: true
var dom3 = document.getElementsByClassName("other")[1];
console.log(x._doesOverlap( dom1, dom3 ));  // Expected: false
*/

