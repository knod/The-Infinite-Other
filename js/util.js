/* Created 02/17/15 */

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


	util._doesHitEdge = function ( DOM1, DOM2 ) {
	/* ( DOM, DOM ) -> bool

	*/
		var self = this;

		var rect1 = DOM1.getBoundingClientRect();
		var rect2 = DOM2.getBoundingClientRect();

		var hitsEdge = (
			rect1.left <= rect2.left || 
			rect1.right >= rect2.right || 
			rect1.top <= rect2.top || 
			rect1.bottom >= rect2.bottom
	    );

		// Test
		// if (hitsEdge) {
		// 	DOM1.style["background-color"] = "red";
		// }

		return hitsEdge;
	};  // end Utilities._doesHitEdge()


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

