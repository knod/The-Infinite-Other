/* Created 02/15/15 */

'use strict'

// Other things
var rowHeight = 2;

// Types of Others and their unique properties
var othersTypes = {
	1: { points: 10, class: "other1" },
	2: { points: 20, class: "other2" },
	3: { points: 30, class: "other3" },
	x: { points: 100, class: "mysterious" }
};  // end othersTypes{}

// Other Obj
// ( JS Obj ) -> Other
var Other = function ( fieldHTML, type, colNum, colPercent ) {
/* ( {}, int ) -> Other

Returns an other of type Other in the position indicated with "left"
*/

	var other = {};

	other.class	= type.class;
	other.html 	= null;
	other.fieldHTML	= fieldHTML;

	other.points	= type.points;
	other.killed	= false;

	other.column 	= colNum;

	// Position in %'s
	other.left 		= colNum * colPercent;
	other.top		= 0;  // Individual Others instead of in rows?
	other.id 		= null;  // currently not in use

	// =============
	// FUNCTIONS
	// =============
	other.buildHTML  = function () {
	/* ( none ) -> Other

	Builds html element and changes self.html to match.
	Returns self.
	*/
		var self = this;

		var html 		= document.createElement("div");
		html.className 	= 'object other ' + self.class;
		html.style.left = self.left + "%";

		self.html 		= html;

		return self;
	};  // end other.buildHTML()


	// TODO: Not needed?
	other.updateLeft = function ( left ) {
	/* ( int ) -> Other

	Moves this Other to a new style.left using "left"
	*/

		self.html.style.left = left;

		return self;
	};  // end other.updateLeft()


	other.destroy = function () {
	/*  -> 

	
	*/

		console.log("ow");

	}; // end other.die()

	other.shoot = function () {
	/* ( HTML ) -> Bullet

	*/
		var self = this;

		var bullet = Bullet( 1, self.fieldHTML, "down" );
		// bullet.fieldHTML = self.fieldHTML;
		bullet.buildHTML( self.html );

		// self.bulletList.push( bullet );
		self.fieldHTML.appendChild( bullet.html );

// DIMENSION LINES NOT WORKING
		// var dimLineTop = document.createElement("div");
		// dimLineTop.className = "dim-top";
		// dimLineTop.style.bottom = bullet.html.offsetTop + "px";
		// dimLineTop.style.left = bullet.html.offsetLeft + "px";
		// bullet.html.parentNode.insertBefore( dimLineTop, bullet.html );

		return bullet;

	}; // end other.shoot()

	return other;

};  // end other{}
