/* Created 02/15/15 */

'use strict'

// Other things
var rowHeight = 2;

// Types of Others and their unique properties
var othersTypes = {
	1: {
		_points: 10,
		_classes: "object other other1"
	},

	2: {
		_points: 20,
		_classes: "object other other2"
	},

	3: {
		_points: 30,
		_classes: "object other other3"
	}
};  // end othersTypes{}

// Other Obj
// ( JS Obj ) -> Other
var Other = function ( type, left ) {
/* ( {}, int ) -> Other

Returns an other of type Other in the position indicated with "left"
*/

	var self = {};

	self._classes    =     type._classes;
	self._html 		 =				null;

	self._points 	 =		type._points;
	self._killed 	 =			   false;

	// Position in rem's
	self._left   	 =				left;
	self._top   	 =  			   0;
	self._id     	 = 				null;  // currently not in use


	// =============
	// FUNCTIONS
	// =============
	self._buildHTML  = function () {
	/* ( none ) -> Other

	Builds html element and changes self._html to match.
	Returns self.
	*/
		var self = this;

		var html 		= document.createElement("div");
		html.className 	= self._classes;
		html.style.left = self._left;

		self._html 		= html;

		return self;
	};  // end other.buildHTML()


	// TODO: Not needed?
	self._updateLeft = function ( left ) {
	/* ( int ) -> Other

	Moves this Other to a new style.left using "left"
	*/

		self._html.style.left = left;

		return self;
	};  // end other._updateLeft()


	self._die = function () {}; // end other._die()

	self._shoot = function () {}; // end other._shoot()

	return self;

};  // end other{}
