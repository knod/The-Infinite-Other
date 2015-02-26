/* Created 02/17/15 

TODO:
- Move player off of the bottom a tad so it doesn't hit the edge all the time

NOTES:
- https://developer.mozilla.org/en-US/docs/Web/API/Element.clientWidth picture
is incorrect, shows size with margin and border
*/

'use strict'

var Player = function ( fieldHTML, id ) {
/*

*/
	var player = {};

	// player.state = {};

	player.leftKeyList 		= [ "a", "left" ];
	player.rightKeyList 	= [ "d", "right" ];
	player.fireKeyList 		= [ "space", "return", "up" ];
	// Possible values: "left", "right", "none"
	player.direction 		= "none";
	// In %
	player.speed 			= 1;

	player.html 			= null;

	player.fieldHTML 		= fieldHTML;

	// Add bullet list! Duh!
	player.bulletList 		= [];


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

	Should this be called .update()?
	*/
		var self 		= this;
		var selfHTML_ 	= self.html;
		// If nothing else changes, movement will be 0
		var moveVector 	= 0;
		var left 		= parseFloat( selfHTML_.dataset.left );
		var speedPx 	= Util.convertEmsToPixels( selfHTML_, self.speed );

		// Limit to inside parent
		// var whichEdgeHit = Util.whichEdgeHit( selfHTML_, self.fieldHTML, speedPx );
		var whichEdgeHit = Util.whichEdgeHit( selfHTML_, self.fieldHTML, self.speed );

		// As long as we're not out of bounds
		if ( direction !== whichEdgeHit ) {
			// Decide movement positive, negative, or none
			// (it will be none if it's neither right nor left)
			if ( direction === "right" ) { moveVector = self.speed; }
			else if ( direction === "left" ) { moveVector = -1 * self.speed; }
		}

		// Implement any changes to movement
		left += moveVector;
		selfHTML_.dataset.left = left;
		selfHTML_.style.left = left + "%";
		// selfHTML_.style.left = left + "rem";

		return self;
	};  // end Player.move()


	player.shoot = function () {
	/* ( none ) -> Bullet

	*/
		var self = this;

		var bullet = Bullet( 1, self.fieldHTML, "up" );
		// bullet.fieldHTML = self.fieldHTML;
		bullet.buildHTML( self.html );

		self.bulletList.push( bullet );
		self.fieldHTML.appendChild( bullet.html );

		return bullet;
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
			function () { player.shoot( player.fieldHTML ); },
			function () {  },
			player
		);

	}; // end for ( fireKey )

	player.buildHTML();

	// IMPORTANT:
	// PLAYER HAS NOT YET BEEN APPENDED TO THE DOM

	return player;
};  // end Player()
