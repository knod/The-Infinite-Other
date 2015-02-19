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

	var other = {};

	other._classes    = type._classes;
	other._html 		 = null;

	other._points 	 = type._points;
	other._killed 	 = false;

	// Position in rem's
	other._left   	 = left;
	other._top   	 = 0;
	other._id     	 = null;  // currently not in use

	other._column	 = null;


	// =============
	// FUNCTIONS
	// =============
	other._buildHTML  = function () {
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
	other._updateLeft = function ( left ) {
	/* ( int ) -> Other

	Moves this Other to a new style.left using "left"
	*/

		self._html.style.left = left;

		return self;
	};  // end other._updateLeft()


	other._destroy = function () {
	/*  -> 

	
	*/

		console.log("ow");

	}; // end other._die()

	other._shoot = function ( parent ) {
	/* ( HTML ) -> Player

	*/
		var self = this;

		var bullet = Bullet( 1, "down" );
		bullet._parent = parent;
		bullet._buildHTML( self._html );

		otherBulletList.push( bullet );
		parent.appendChild( bullet._html );

		return self;

	}; // end other._shoot()

	return other;

};  // end other{}
