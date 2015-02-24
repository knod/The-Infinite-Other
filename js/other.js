/* Created 02/15/15 */

'use strict'

// Other things
var rowHeight = 2;

// Types of Others and their unique properties
var othersTypes = {
	1: {
		points: 10,
		class: "other1"
	},

	2: {
		points: 20,
		class: "other2"
	},

	3: {
		points: 30,
		class: "other3"
	},

	x: {
		points: 100,
		class: "mysterious"
	}
};  // end othersTypes{}

// Other Obj
// ( JS Obj ) -> Other
var Other = function ( type, left ) {
/* ( {}, int ) -> Other

Returns an other of type Other in the position indicated with "left"
*/

	var other = {};

	other.class	= type.class;
	other.html 	= null;
	other.field	= document.getElementsByClassName("field")[0];

	other.points	= type.points;
	other.killed	= false;

	// Position in rem's
	other.left 	= left;
	other.top		= 0;
	other.id 		= null;  // currently not in use

	other.column 	= null;


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
		html.style.left = self.left;

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
	/* ( HTML ) -> Player

	*/
		var self = this;

		var bullet = Bullet( 1, "down" );
		bullet.field = self.field;
		bullet.buildHTML( self.html );

		othersBulletList.push( bullet );
		self.field.appendChild( bullet.html );

// DIMENSION LINES NOT WORKING
		// var dimLineTop = document.createElement("div");
		// dimLineTop.className = "dim-top";
		// dimLineTop.style.bottom = bullet.html.offsetTop + "px";
		// dimLineTop.style.left = bullet.html.offsetLeft + "px";
		// bullet.html.parentNode.insertBefore( dimLineTop, bullet.html );
		
		return self;

	}; // end other.shoot()

	return other;

};  // end other{}
