/* Created 02/16/15 */

'use strict'

var oldTime = Date.now();
var newTime = Date.now();
var gameCont = document.getElementsByClassName("game-container")[0];
var otherSpeed = 2;

var update = function () {

	// ===================
	// OTHER MOVEMENT
	// ===================
	// Currently 55 (02/17/15)
	var numOthers = document.getElementsByClassName("game-container")[0]
		.getElementsByClassName("other")
		.length;
	;

	var otherMovePause = otherSpeed * Math.pow(numOthers, 1.55);
	var timeDiff = newTime - oldTime;

	if ( timeDiff > otherMovePause ) {
		moveAllRows( gameCont );
		oldTime = newTime;
	}

	// var needChange = needDirectionChange(gameCont);
	// if (needChange) {
	// 	changeDirection( gameCont );
	// }

	// setTimeout( function () { moveAllRows( gameCont ) }, movePause );



	// ====================
	// LOOP
	// ====================
	newTime = Date.now();

	requestAnimationFrame( update );

};  // end update()
