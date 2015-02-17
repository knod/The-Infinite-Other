/* Created 02/17/15 */

'use strict'

var Bullet = function ( id, direction ) {
/* ( int ) -> Bullet

*/
	var bullet = {};

	bullet._html 	= null;
	bullet._parent 	= null;

	// Dimensions and positions in pixels
	bullet._width 	= 4;
	bullet._height 	= 7;
	bullet._left 	= 0;

	// MUST BE SMALLER THAN HEIGHT OF AI (currently. MATH.)
	bullet._speed 	= 15;

	bullet._direction = direction;

	bullet._buildHTML = function ( shooter ) {
	/* ( HTML ) -> Bullet

	*/
		var self = this;

		var shooterWidth 	= shooter.offsetWidth,
			shooterLeft 	= shooter.offsetLeft,
			shooterTop		= shooter.offsetTop
		;

		var shooterCenter	= shooterLeft + ( shooterWidth/2 ),
			bulletLeft 		= shooterCenter - ( self._width/2 )
		;

		var html 			= document.createElement("div");
		html.className 		= 'object bullet';
		html.style.width 	= self._width + "px";
		html.style.height 	= self._height + "px";
		
		html.dataset.top 	= shooterTop;
		html.style.top 		= shooterTop + "px";
		html.style.left 	= bulletLeft + "px";

		self._left 			= bulletLeft;
		self._html 			= html;

		return self;

	};  // end Bullet._buildHTML


	bullet._move = function ( direction ) {
	/* -> Bullet

	*/
		var self = this;

		// If nothing else changes, movement will be 0
		var moveVector = 0;
		var top = parseFloat( self._html.dataset.top );

		// TODO: Limit to inside parent

		// Decide movement positive, negative, or none
		if ( direction === "down" ) { moveVector = self._speed; }
		else if ( direction === "up" ) { moveVector = -1 * self._speed; }

		// Implement any changes to movement
		top += moveVector;
		self._html.dataset.top = top;
		self._html.style.top = top + "px";

		return self;

	};  // end Bullet._move()

	bullet._collide = function ( collidee ) {
	/* -> 

	*/

		//

	};  // end Bullet._collide()


	bullet._collisionTest = function ( collideeList ) {
	/* -> 

	*/
		var self = this;

		var collided = null;

		return collided;
	};  // end Bullet._collisionTest()


	return bullet;
};  // end Bullet()
