/* Created 02/17/15 */

'use strict'

var Bullet = function ( id, direction ) {
/* ( int, str ) -> Bullet

*/
	var bullet = {};

	bullet._html 	= null;
	bullet._field 	= null;

	// Dimensions and positions in pixels
	// Why do the bullets' relative screen space adjust when zoom
	// is increased? (They get bigger when zoomed. I thought that
		// was rem's)
	bullet._width 	= 4;//0.25;
	bullet._height 	= 7;//0.45;
	bullet._left 	= 0;

	// MUST BE SMALLER THAN HEIGHT OF AI (MATH.)
	// Currently in pixels
	bullet._speed 	= 5;

	bullet._direction 			= direction;
	// MUST BE SMALLER THAN THE DISTANCE BETWEEN TWO AI
	bullet._destrucitonRadius 	= 5;

	bullet._buildHTML = function ( shooterElem ) {
	/* ( HTML ) -> Bullet

	*/
		var self = this;

		// ( childElem, ancestorElem, offsetType )
		// TODO: field of shooter or field of self?
		

		var shooterWidth 		= shooterElem.offsetWidth,
			shooterFieldLeft 	= Util._getPixelOffsetFromAncestor(
									shooterElem, self._field, "offsetLeft"
									),
			shooterFieldTop		= Util._getPixelOffsetFromAncestor(
									shooterElem, self._field, "offsetTop"
									)
		;  // end vars

		var shooterCenter	= shooterFieldLeft + ( shooterWidth/2 ),
			bulletLeft 		= shooterCenter - ( self._width/2 )
		;  // end vars

		var html 			= document.createElement("div");
		html.className 		= 'object bullet';
		html.style.width 	= self._width + "px";
		html.style.height 	= self._height + "px";
		
		// TODO: Why is pixel placement and movement working when view zoom is changed?
		html.dataset.top 	= shooterFieldTop;
		html.style.top 		= shooterFieldTop + "px";
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
		var self = this;

		// Get all elements within the destruction radius
			// If they're not ancestor, destroy them

		// Destroy self visually (removal from js list will
			// be external)

		return self;
	};  // end Bullet._collide()


	bullet._goingOutOfBounds = function ( bounderHTML ) {
	/* ( HTML ) -> HTML

	*/
		var self = this;

		var exitedObj = null;
		var hitsEdge = Util._whichEdgeHit( self._html, bounderHTML, self._speed );

		if ( hitsEdge !== "none" ) { exitedObj = bounderHTML; }

		return exitedObj;
	};  // end Bullet.__goingOutOfBounds()


	bullet._collisionTest = function ( obj ) {
	/* -> 

	*/
		var self = this;

		var collidee = null;
		var collides = Util._doesOverlap( self._html, obj._html );
		if ( collides ) { collidee = obj; }

		return collidee;
	};  // end Bullet._collisionTest()


	// =============
	// END bullet{}
	// ============
	return bullet;
};  // end Bullet()
