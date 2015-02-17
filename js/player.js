/* Created 02/17/15 */

'use strict'

var Player = function ( parent, id ) {
/*

*/
	var player = {};

	// player._state = {};

	player._leftKeyList 	= [ "a", "left" ];
	player._rightKeyList 	= [ "d", "right" ];
	player._fireKeyList 	= [ "space", "return", "up" ];
	// Possible values: "left", "right", "none"
	player._direction 		= "none";
	player._speed 			= 0.75;

	player._html 			= null;

	player._parent 			= document.getElementsByClassName("game-container")[0];

	player._buildHTML = function () {
	/*

	*/
		var self = this;

		var html 			= document.createElement("div");
		html.className 		= 'object player';
		html.dataset.left 	= "0";
		html.style.left 	= "0rem";

		self._html 			= html;

		return self;

	};  // end Player._buildHTML

	player._changeDirection = function ( direction ) {
	/*

	*/
		var self = this;
		self._direction = direction;
	};  // end Player._changeDirection()

	player._move = function ( direction ) {
	/*

	*/
		var self = this;
		// If nothing else changes, movement will be 0
		var moveVector = 0;
		var left = parseFloat( self._html.dataset.left );

		// TODO: Limit to inside parent

		// Decide movement positive, negative, or none
		if ( direction === "right" ) { moveVector = self._speed; }
		else if ( direction === "left" ) { moveVector = -1 * self._speed; }

		// Implement any changes to movement
		left += moveVector;
		self._html.dataset.left = left;
		self._html.style.left = left + "rem";

		return self;
	};  // end Player._move()


	player._shoot = function ( parent ) {
	/* ( HTML ) -> Player

	*/
		var self = this;

		var bullet = Bullet( 1, "up" );
		bullet._buildHTML( self._html );

		playerBulletList.push( bullet );
		parent.appendChild( bullet._html );

		return self;
	};


	// ============
	// INPUT
	// ============
	player._keypress = new window.keypress.Listener();

	player._bindInput = function ( keyCombo, keyDown, keyUp, thisObj ) {
	/* ( str, func, func, {} ) -> {}

	*/
		var obj = thisObj;

		obj._keypress.register_combo({
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

	};  //  end player._bindInput()


	// ================
	// SET UP PLAYER (with inputs)
	// ================
	// EVENT LISTENERS
	for ( var keyi = 0; keyi < player._leftKeyList.length; keyi++ ) {

		player._bindInput( player._leftKeyList[ keyi ],
			function () { player._changeDirection( "left" ); },
			function () { player._changeDirection( "none" ); },
			player
		);

	}; // end for ( leftKey )

	for ( var keyi = 0; keyi < player._rightKeyList.length; keyi++ ) {

		player._bindInput( player._rightKeyList[ keyi ],
			function () { player._changeDirection( "right" ); },
			function () { player._changeDirection( "none" ); },
			player
		);

	}; // end for ( rightKey )


	for ( var keyi = 0; keyi < player._fireKeyList.length; keyi++ ) {

		player._bindInput( player._fireKeyList[ keyi ],
			function () { player._shoot( player._parent ); },
			function () {  },
			player
		);

	}; // end for ( fireKey )


	return player;
};  // end Player()
