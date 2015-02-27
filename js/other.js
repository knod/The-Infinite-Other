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
var Other = function ( fieldHTML, type, colNum, colPercent, vertSpeed, horSpeed ) {
/* ( {}, int ) -> Other

Returns an other of type Other in the position indicated with "left"
*/

	var other = {};

	other.objType 	= "other";
	other.class		= type.class;
	other.html 		= null;
	other.fieldHTML	= fieldHTML;
	other.vertSpeed	= vertSpeed;
	other.horSpeed 	= horSpeed;

	other.points	= type.points;
	other.killed	= false;

	other.column 	= colNum;

	// Position in %'s
	other.left 		= colNum * colPercent;
	other.top		= 0;  // Individual Others instead of in rows?
	other.id 		= null;  // currently not in use

	// Once it has died, it can't collide with anything else
	other.dead 		= false;

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


	other.shoot = function () {
	/* ( HTML ) -> Bullet

	*/
		var self = this;

		var bullet = Bullet( 1, self.fieldHTML, "down" );
		// bullet.fieldHTML = self.fieldHTML;
		bullet.buildHTML( self );

		// self.bulletList.push( bullet );
		self.fieldHTML.appendChild( bullet.html );

// DIMENSION LINES NOT WORKING
		// var dimLineTop = document.createElement("div");
		// dimLineTop.className = "dim-top";
		// dimLineTop.style.bottom = bullet.html.offsetTop + "px";
		// dimLineTop.style.left = bullet.html.offsetLeft + "px";
		// bullet.html.parentNode.insertBefore( dimLineTop, bullet.html );

		return bullet;

	}; // end Other.shoot()


	// For now, just pretend there is only horizontal movement and collision
	other.checkOutOfBounds = function ( bounderHTML ) {
	/* ( HTML ) -> HTML

	*/
		var self = this;

		// Only checks with horizontal speed because I messed up big time
		var edgeThatWasHit = Util.whichEdgeHit( self.html, bounderHTML, self.horSpeed );
		// Function caller will take action based on edge that was hit
		var returnAction = "none";
		if ( edgeThatWasHit === "bottom" ) {
			returnAction === "endGame";
		} else if ( edgeThatWasHit === "right" ) {
			returnAction = "moveRowsLeft";
		} else if ( edgeThatWasHit === "left" ) {
			returnAction = "moveRowsRight";
		}

		return returnAction;
	};  // end Other.checkOutOfBounds()


	other.collide = function ( collidee, areHostile ) {
	/*  -> 

	Decide what to do with the collision
	*/
		var self = this;

		var returnAction = "none";

		// Player
		if ( collidee.objType === "player" ) {
			// Other never dies on contact with player, regardless of hostility
			returnAciton = "endGame";

		// Bullet
		} else if ( collidee.parentType && (collidee.parentType === "player") ) {
			self.die();
			returnAction = "killThis";
		}

		return returnAction;
	}; // end Other.collide()


	other.die = function () {
	/*  -> 

	Do a dance and then die	
	*/
		var self = this;
		var selfHTML_ = self.html;

		selfHTML_.parentNode.removeChild(selfHTML_);

		self.dead = true;
		return self;
	}; // end Other.die()


	// =========
	// END
	// =========
	return other;

};  // end other{}
