/* Created 02/16/15

RESOURCES:
http://stackoverflow.com/questions/12066870/how-to-check-if-an-element-is-overlapping-other-elements

*/

'use strict'

// Gives ability to create pauses between movement of Others
var oldTime = Date.now();
var newTime = Date.now();

var otherSpeedModifier 	= 2;
var otherMovePause 		= 1000;


var update = function () {
/* ( none ) -> None

Loop to update the whole game
*/
	
	// ===================
	// PLAYER MOVEMENT
	// ===================
	for ( var playeri = 0; playeri < playerList.length; playeri++ ) {

		var player = playerList[ playeri ];
		player._move( player._direction );

	}  // end for( player )

	// ===================
	// BULLET MOVEMENT
	// ===================
	for ( var playerBulleti = 0; playerBulleti < playerBulletList.length; playerBulleti++ ) {

		var playerBullet = playerBulletList[ playerBulleti ];
		playerBullet._move( playerBullet._direction );
		
		var collides = playerBullet._collisionTest( [] );
		if ( collides ) {

			playerBullet._die();

		}


	}  // end for( player )

	// ===================
	// OTHER MOVEMENT
	// ===================
	// Final speed of Others based on number of others left

	// Number of others in this game container (need to make dynamic
	// with function). Currently 55 (02/17/15)
	var gameCont = document.getElementsByClassName("game-container")[0];
	var numOthers = gameCont
		.getElementsByClassName("other")
		.length
	;

	// Pause between the moving of others
	// Starts at about 1000
	otherMovePause = otherSpeedModifier * Math.pow(numOthers, 1.55);
	var timeDiff = newTime - oldTime;

	if ( timeDiff > otherMovePause ) {
		// This will move each row, delaying between each
		triggerRowMovement( gameCont );
		// FOR NEXT LOOP
		oldTime = newTime;
	}

	// ====================
	// FOR NEXT LOOP
	// ====================
	newTime = Date.now();

	requestAnimationFrame( update );

};  // end update()
