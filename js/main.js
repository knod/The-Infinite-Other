/* Created 02/15/15 */
/*
TODO:
---- 1 ----
- Win/loss conditions
	2 loss conditions: lose lives, Others reach bottom
		(others touch player)
	2 non-loss conditions: destroy all, not destroy
	- Stop rows moving after all ai are gone (game over condition)
	- When AI hits the player, end condition is met
		Make sure AI runs along the bottom of the screen at end
	(add lives lost end condition at the very end
		or don't freeze everything on end condition till done
		with other stuff)
- Score
- Destroying AI
	- score
		- each time AI is killed, it adds to the score
- Destroy Player
	- lose life
- Lives

---- 2 ----
- Limit shooting speed
- Barriers
- Others' bodies destroy barrier
- Top variable score AI
- "Field" class for rows/field (refactor)

---- 3 ----
- Opening & closing screens
- Player input
	- How to unbind Keypress listeners (to rebind user keys)
- Fix keyup stopping movment in other direction. Only all
	direction keys up should stop movement
- High score
- Make modular shoot function
- Make sidebar for progress/score
- Current time can be global

---- ? ----
- Unit tests
- refactor for Field
- base all sizes on a numerical value instead of on the size of other elements
- shooting delay of 1/2 sec
- one currentTime = Date.now()
- many old___Time = Date.now()'s
	- AI shooting
	- Player shooting
	- Timer
	- AI Moving
Chance of AI shooting


MAYBE TODO:
- Build converters to convert from pixels to rem and maybe to %

QUESTIONS:
- Is there a way to change the size and placement
of the row based on its contents, to have its contents
determine its size and position?
- HTML, DOM, or Elem for names?

// Movement
// left & right arrows
// "a" & "d"

// Shooting
// spacebar, return, up arrow



*/

'use strict'


var Util = Utilities( 1 );
var BoardA;

window.addEventListener( "load", function () {

	var board_id_count = 1;

	// var 
	BoardA = Board( "board_" + board_id_count );
	BoardA.init();

	// update();
	BoardA.update();

});  // End window on load



