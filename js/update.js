/* Created 02/16/15 */

'use strict'

var update = function () {

	// ===================
	// OTHER MOVEMENT
	// ===================
	var gameCont = document.getElementsByClassName("game-container")[0];
	// var needChange = needDirectionChange(gameCont);
	// if (needChange) {
	// 	changeDirection( gameCont );
	// }

	var movePause = 5000;

	setTimeout( function () { moveAllRows( gameCont ) }, movePause );



	// ====================
	// LOOP
	// ====================
	requestAnimationFrame( update );

};  // end update()


	// var gameCont = document.getElementsByClassName("game-container")[0];
	// // var needChange = needDirectionChange(gameCont);
	// // if (needChange) {
	// // 	changeDirection( gameCont );
	// // }

	// var movePause = 5000;

	// setInterval( function () { moveAllRows( gameCont ) }, movePause );
