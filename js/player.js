/* Created 02/17/15 

TODO:
- Move player off of the bottom a tad so it doesn't hit the edge all the time

NOTES:
- https://developer.mozilla.org/en-US/docs/Web/API/Element.clientWidth picture
is incorrect, shows size with margin and border
*/

'use strict'

var Player = function ( parent, id ) {
/*

*/
	var player = {};

	// player.state = {};

	player.leftKeyList 	= [ "a", "left" ];
	player.rightKeyList 	= [ "d", "right" ];
	player.fireKeyList 	= [ "space", "return", "up" ];
	// Possible values: "left", "right", "none"
	player.direction 		= "none";
	player.speed 			= 0;

	player.html 			= null;

	player.field 			= document.getElementsByClassName("field")[0];


	// TODO: AT 90% AND 110% (OTHERS?) PLAYER GOES HALF OUT OF CONTAINER
	player.calcPlayerSpeed = function ( container ) {
	/* ( DOM Obj ) -> num

	Makes sure player can't exit bounds of parent
	*/
		var self = this;

		// Get ratio of player width to container width
		// offsetWidth to get padding and border too
		var selfPixelWidth 		= self.html.offsetWidth;
		// clientWidth to have only inside measurements (where
			// self's left/top 0 sits)
		var containerPixelWidth = container.clientWidth;

		// Ultimate ratio needs to be a multiple of player width
		// in order for player to not exceed bounds of container
		var evenlyDivided = (selfPixelWidth / 2) / containerPixelWidth;

		// Convert to em's
		var elemEmWidth = Util.convertPixelsToEms( container, containerPixelWidth );

		var speed = elemEmWidth * evenlyDivided;

		return speed;

	};  // end Player.calcPlayerSpeed()


	player.buildHTML = function () {
	/*

	*/
		var self = this;

		var html 			= document.createElement("div");
		html.className 		= 'object player';
		html.dataset.left 	= "0";
		html.style.left 	= "0rem";

		self.html 			= html;

		return self;

	};  // end Player.buildHTML()


	player.changeDirection = function ( direction ) {
	/*

	*/
		var self = this;
		self.direction = direction;
	};  // end Player.changeDirection()

	player.move = function ( direction ) {
	/*

	*/
		var self 		= this;
		var selfHTML 	= self.html;
		// If nothing else changes, movement will be 0
		var moveVector 	= 0;
		var left 		= parseFloat( selfHTML.dataset.left );
		var speedPx 	= Util.convertEmsToPixels( selfHTML, self.speed );

		// Limit to inside parent
		var whichEdgeHit = Util.whichEdgeHit( selfHTML, self.field, speedPx );

		// As long as we're not out of bounds
		if ( direction !== whichEdgeHit ) {
			// Decide movement positive, negative, or none
			// (it will be none if it's neither right nor left)
			if ( direction === "right" ) { moveVector = self.speed; }
			else if ( direction === "left" ) { moveVector = -1 * self.speed; }
		}

		// Implement any changes to movement
		left += moveVector;
		selfHTML.dataset.left = left;
		selfHTML.style.left = left + "rem";

		return self;
	};  // end Player.move()


	player.shoot = function () {
	/* ( none ) -> Player

	*/
		var self = this;

		var bullet = Bullet( 1, "up" );
		bullet.field = self.field;
		bullet.buildHTML( self.html );

		playerBulletList.push( bullet );
		self.field.appendChild( bullet.html );

		return self;
	};


	// ============
	// INPUT
	// ============
	player.keypress = new window.keypress.Listener();

	player.bindInput = function ( keyCombo, keyDown, keyUp, thisObj ) {
	/* ( str, func, func, {} ) -> {}

	*/
		var obj = thisObj;

		obj.keypress.register_combo({
		    "keys"              : keyCombo,
		    "on_keydown"        : keyDown,
		    "on_keyup"          : keyUp,
		    // "on_release"        : null,
		    "this"              : obj,
		    "prevent_default"   : true,
		    // "prevent_repeat"    : false,
		    // "is_unordered"      : false,
		    // "is_counting"       : false,
		    // "is_exclusive"      : false,
		    // "is_solitary"       : false,
		    // "is_sequence"       : false
		});

		return thisObj;

	};  //  end player.bindInput()


	// ================
	// SET UP PLAYER (with inputs)
	// ================
	// EVENT LISTENERS
	for ( var keyi = 0; keyi < player.leftKeyList.length; keyi++ ) {

		player.bindInput( player.leftKeyList[ keyi ],
			function () { player.changeDirection( "left" ); },
			function () { player.changeDirection( "none" ); },
			player
		);

	}; // end for ( leftKey )

	for ( var keyi = 0; keyi < player.rightKeyList.length; keyi++ ) {

		player.bindInput( player.rightKeyList[ keyi ],
			function () { player.changeDirection( "right" ); },
			function () { player.changeDirection( "none" ); },
			player
		);

	}; // end for ( rightKey )


	for ( var keyi = 0; keyi < player.fireKeyList.length; keyi++ ) {

		player.bindInput( player.fireKeyList[ keyi ],
			function () { player.shoot( player.field ); },
			function () {  },
			player
		);

	}; // end for ( fireKey )

	player.buildHTML();

	// IMPORTANT:
	// PLAYER HAS NOT YET BEEN APPENDED TO THE DOM

	return player;
};  // end Player()
