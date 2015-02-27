/* Created 02/17/15 */

'use strict'

var Bullet = function ( id, fieldHTML, direction ) {
/* ( int, str ) -> Bullet

*/
	var bullet = {};

	bullet.objType 		= "bullet";
	bullet.class 		= "bullet";
	bullet.parentType 	= null;

	bullet.html 		= null;
	bullet.fieldHTML 	= fieldHTML;

	// Dimensions and positions in pixels
	// Why do the bullets' relative screen space adjust when zoom
	// is increased? (They get bigger when zoomed. I thought that
		// was rem's)
	bullet.width 	= 10;//4;//0.25;
	bullet.height 	= 10;//7;//0.45;
	bullet.top 		= 0;
	bullet.left 	= 0;
	// Now as percents!
	// bullet.width 	= 5;// out of 560px ~.7%
	// bullet.height 	= 5;// out of 400px ~1.75
	bullet.left 	= 0;

	// MUST BE SMALLER THAN HEIGHT OF AI (MATH.)
	// Currently in %
	bullet.speed 	= 1;

	bullet.direction 			= direction;
	// MUST BE SMALLER THAN THE DISTANCE BETWEEN TWO AI
	bullet.destrucitonRadius 	= 5;

	// Once it has died, it can't collide with anything else
	bullet.dead	= false;

	bullet.buildHTML = function ( shooter ) {
	/* ( HTML ) -> Bullet

	*/
		var self = this;
		var field = self.fieldHTML;
		// ( childElem, ancestorElem, offsetType )
		// TODO: field of shooter or field of self?
		var shooterElem 		= shooter.html;

		var shooterWidth 		= shooterElem.offsetWidth,
			shooterFieldLeft 	= Util.getPixelOffsetFromAncestor(
									shooterElem, field, "offsetLeft"
									),
			shooterFieldTop		= Util.getPixelOffsetFromAncestor(
									shooterElem, field, "offsetTop"
									),
			percentageTop		= (shooterFieldTop / field.clientHeight) * 100;
		;  // end vars

		var shooterCenter	= shooterFieldLeft + ( shooterWidth/2 ),
			bulletLeft 		= shooterCenter - ( self.width/2 )
		;  // end vars

		var html 			= document.createElement("div");
		html.className 		= 'object bullet';
		html.style.width 	= self.width + "px";
		html.style.height 	= self.height + "px";
		// html.style.width 	= self.width + "%";
		// html.style.height 	= self.height + "%";
		
		// TODO: Why is pixel placement and movement working when view zoom is changed?
		// html.dataset.top 	= percentageTop ;
		html.style.top 		= percentageTop + "%";
		html.style.left 	= bulletLeft + "px";

		self.parentType		= shooter.objType;
		self.top 			= percentageTop;
		self.left 			= bulletLeft;
		self.html 			= html;

		return self;

	};  // end Bullet.buildHTML


	bullet.move = function ( direction ) {
	/* -> Bullet

	*/
		var self = this;

		// If nothing else changes, movement will be 0
		var moveVector 	= 0;
		var top 		=  self.top; //parseFloat( self.html.dataset.top );

		// TODO: Limit to inside parent

		// Decide movement positive, negative, or none
		if ( direction === "down" ) { moveVector = self.speed; }
		else if ( direction === "up" ) { moveVector = -1 * self.speed; }

		// Implement any changes to movement
		top += moveVector;
		// self.html.dataset.top = top;
		// self.html.style.top = top + "px";
		self.html.style.top = top + "%";

		self.top = top;
		return self;

	};  // end Bullet.move()


	// TODO: Probably doesn't need to be here anymore, just do an edge
	// hit check. Except it returns an object, but the object was
	// already sent in here, obviously
	bullet.checkOutOfBounds = function ( bounderHTML ) {
	/* ( HTML ) -> HTML

	*/
		var self = this;

		var edgeThatWasHit = Util.whichEdgeHit( self.html, bounderHTML, self.speed );
		var returnAction = "none"
		if ( edgeThatWasHit !== "none" ) {
			self.die()
			returnAction = "killThis";
		}

		return returnAction;
	};  // end Bullet.checkOutOfBounds()


	bullet.collisionTest = function ( obj ) {
	/* -> 

	*/
		var self = this;

		var collidee = null;
		var collides = Util.doesOverlap( self.html, obj.html );
		if ( collides ) { collidee = obj; }

		return collidee;
	};  // end Bullet.collisionTest()


	bullet.collide = function ( collidee, areHostile ) {
	/*  -> 

	Decide what to do with the collision
	*/
		var self = this;

		var returnAction = "none";

		// Always dies on collision
		if (   ( (self.parentType === "player") && (collidee.objType === "other") )
			|| ( (self.parentType === "other") && (collidee.objType === "player") )
			||   (collidee.objType === "bullet")  ) {
		
			self.die();
			returnAction = "killThis"
		} 

		return returnAction;
	}; // end Bullet.collide()


	bullet.die = function () {
	/*  -> 

	Do a dance and then die	
	*/
		var self = this;
		var selfHTML_ = self.html;

		selfHTML_.parentNode.removeChild(selfHTML_);

		self.dead = true;
		return self;
	}; // end Bullet.die()


	// =============
	// END bullet{}
	// ============
	return bullet;
};  // end Bullet()
