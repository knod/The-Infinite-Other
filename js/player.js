/* Created 02/17/15 */

'use strict'

var Player = function ( id ) {

	var player = {};

	// player._state = {};

	player._leftKey = [ "a", "left" ];
	player._rightKey = [ "d", "right" ];
	player._fireKey = [ "space", "return", "up" ];
	// Possible values: "left", "right", "none"
	player._direction = "none";
	player._speed = 0.75;

	player._html = null;

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

		return player;
	};  // end Player._move()

	player._keypress = new window.keypress.Listener();

	player._bindInput = function () {
	/*

	*/



	};  //  end player._bindInput()


	var key = "d";

	player._keypress.register_combo({
	    "keys"              : key,
	    "on_keydown"        : function () { player._changeDirection( "right" ); },
	    "on_keyup"          : function () { player._changeDirection( "none" ); },
	    // "on_release"        : null,
	    "this"              : player,
	    "prevent_default"   : true,
	    // "prevent_repeat"    : false,
	    // "is_unordered"      : false,
	    // "is_counting"       : false,
	    // "is_exclusive"      : false,
	    // "is_solitary"       : false,
	    // "is_sequence"       : false
	});



	return player;
};  // end Player()
