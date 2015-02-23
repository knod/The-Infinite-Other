/* Created 02/17/15 */

'use strict'

var Bullet = function ( id, direction ) {
/* ( int, str ) -> Bullet

*/
	var bullet = {};

	bullet.html 	= null;
	bullet.field 	= null;

	// Dimensions and positions in pixels
	// Why do the bullets' relative screen space adjust when zoom
	// is increased? (They get bigger when zoomed. I thought that
		// was rem's)
	bullet.width 	= 4;//0.25;
	bullet.height 	= 7;//0.45;
	bullet.left 	= 0;

	// MUST BE SMALLER THAN HEIGHT OF AI (MATH.)
	// Currently in pixels
	bullet.speed 	= 5;

	bullet.direction 			= direction;
	// MUST BE SMALLER THAN THE DISTANCE BETWEEN TWO AI
	bullet.destrucitonRadius 	= 5;

	bullet.buildHTML = function ( shooterElem ) {
	/* ( HTML ) -> Bullet

	*/
		var self = this;

		// ( childElem, ancestorElem, offsetType )
		// TODO: field of shooter or field of self?
		

		var shooterWidth 		= shooterElem.offsetWidth,
			shooterFieldLeft 	= Util.getPixelOffsetFromAncestor(
									shooterElem, self.field, "offsetLeft"
									),
			shooterFieldTop		= Util.getPixelOffsetFromAncestor(
									shooterElem, self.field, "offsetTop"
									)
		;  // end vars

		var shooterCenter	= shooterFieldLeft + ( shooterWidth/2 ),
			bulletLeft 		= shooterCenter - ( self.width/2 )
		;  // end vars

		var html 			= document.createElement("div");
		html.className 		= 'object bullet';
		html.style.width 	= self.width + "px";
		html.style.height 	= self.height + "px";
		
		// TODO: Why is pixel placement and movement working when view zoom is changed?
		html.dataset.top 	= shooterFieldTop;
		html.style.top 		= shooterFieldTop + "px";
		html.style.left 	= bulletLeft + "px";

		self.left 			= bulletLeft;
		self.html 			= html;

		return self;

	};  // end Bullet.buildHTML


	bullet.move = function ( direction ) {
	/* -> Bullet

	*/
		var self = this;

		// If nothing else changes, movement will be 0
		var moveVector = 0;
		var top = parseFloat( self.html.dataset.top );

		// TODO: Limit to inside parent

		// Decide movement positive, negative, or none
		if ( direction === "down" ) { moveVector = self.speed; }
		else if ( direction === "up" ) { moveVector = -1 * self.speed; }

		// Implement any changes to movement
		top += moveVector;
		self.html.dataset.top = top;
		self.html.style.top = top + "px";

		return self;

	};  // end Bullet.move()

	bullet.collide = function ( collidee ) {
	/* -> 

	*/
		var self = this;

		// Get all elements within the destruction radius
			// If they're not ancestor, destroy them

		// Destroy self visually (removal from js list will
			// be external)

		return self;
	};  // end Bullet.collide()

	// TODO: Probably doesn't need to be here anymore, just do an edge
	// hit check. Except it returns an object, but the object was
	// already sent in here, obviously
	bullet.goingOutOfBounds = function ( bounderHTML ) {
	/* ( HTML ) -> HTML

	*/
		var self = this;

		var exitedObj = null;
		var hitsEdge = Util.whichEdgeHit( self.html, bounderHTML, self.speed );

		if ( hitsEdge !== "none" ) { exitedObj = bounderHTML; }

		return exitedObj;
	};  // end Bullet._goingOutOfBounds()


	bullet.collisionTest = function ( obj ) {
	/* -> 

	*/
		var self = this;

		var collidee = null;
		var collides = Util.doesOverlap( self.html, obj.html );
		if ( collides ) { collidee = obj; }

		return collidee;
	};  // end Bullet.collisionTest()


	// =============
	// END bullet{}
	// ============
	return bullet;
};  // end Bullet()
