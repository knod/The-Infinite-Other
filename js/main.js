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

// window.addEventListener( "load", function () {

	var Util = Utilities( 1 );

	// These two need to be the same length
	// TODO: create data values for rows of their Other type
	// and use that to get mapped types
	var rowList 	= document.getElementsByClassName("row");
	var rowMap   	= ["1", "2", "2", "3", "3"];

	var rowWidth	= 88;
	var otherWidth 	= 4;
	var numCols  	= 11;

	var colPercent	= (100 - otherWidth) / (numCols - 1);

	var playerBulletList 	= [];
	var othersBulletList 	= [];
	var barrierElementsList = [];

	// THIS IS ALL WRONG, FIX - game containers and their contents should be
	// created at the same time. Perhaps updates should be for containers as
	// well.
	// -------- MOVED -------------
	var addPlayers = function ( parent, playerList ) {
	/*

	*/
		var player = playerList[ 0 ];
		// TODO: Need to append player in itself during it's creation?
		parent.appendChild( player.html );

	};  // end addPlayers()

	// -------- MOVED -------------
	var buildOthersRow = function ( Other, type, mappedOthers ) {
	/* ( func{}, str, {} ) -> [Other]
	
	Returns a list of Other objects to fill a row (based on number of columns)
	mappedOthers: object of objects containing the values for the Others to be generated
	*/
		var othersList = [];

		for ( var col = 0; col < numCols; col++ ) {
			var leftVal = col * colPercent;
			var leftStr = leftVal + "%";

			// Create an Other of this type with this css "left" value
			var other 		= Other( mappedOthers[ type ], leftStr );
			other.buildHTML();
			other.column 	= col;
			// other.row	= rowNum;
			othersList.push( other );
		}

		return othersList;
	};  // end buildOtherRow()

	// -------- MOVED -------------
	var buildOthersGrid = function ( rowMap, Other, mappedOthers ) {
	/* ( [], func{}, {} ) -> [ [ Other ] ]

	Returns a list of Other's go in each row. Used to then add Other's
	html to the currently empty row elements

	rowMap: list of which types of objects go in which row. Those strings will
		be used to get objects from mappedOthers
	mappedOthers: object of objects containing the values for the Others to be generated
	*/

		var rows = [];

		for ( var rowi = 0; rowi < rowMap.length; rowi++ ) {
			var typeVal = rowMap[ rowi ];
			var othersList = buildOthersRow( Other, typeVal, mappedOthers );
			rows.push( othersList );
		}

		return rows;

	};  // end buildOthersGrid()

	// -------- MOVED -------------
	var appendToRows = function ( htmlRows, toAppend ) {
	/* ( [HTML], [[ HTML ]] ) -> [HTML]

	Makes the Others appear on the page in the correct rows.
	Returns the original rows handed in.
	*/

		// Get each row element
		for ( var rowi = 0; rowi < htmlRows.length; rowi++ ) {
			var docRow = htmlRows[ rowi ];
			// Get the corresponding row in toAppend,
			var othersRow = toAppend[ rowi ];
			// Get each Other object in that row
			for ( var coli = 0; coli < othersRow.length; coli++ ) {
				docRow.appendChild( othersRow[ coli ].html );
			}
		}

		return htmlRows;

	};  // end appendRows()

	// -------- MOVED -------------
	// in rem's
	// var otherHorDistance 	= 0.25;  // MUST BE ABLE TO ADD UP TO 1rem
	var otherVertDistance 	= 0.8;  // Doesn't matter if it overlaps
	// Hor distance must be the remaining width of the field/16
	// 88% is a row width
	var otherHorDistance	= ( 100 - rowWidth ) / 16;

	// -------- MOVED -------------
	// TODO: needs a different name now that it triggers subsequent rows
	var moveHorRows = function ( rowsHTMLList, indx ) {
	/* ( DOM Obj, int ) -> same

	Moves row laterally depending on direction then
	triggers the movement of the next row
	*/

		// If there are no rows left, stop
		if ( indx < 0 ) {
			return rowsHTMLList

		// Otherwise, cycle through the rows, pausing between each row
		} else {

			var rowHTML 	= rowsHTMLList[ indx ];

			// get the row's current direction and position
			var direction 	= rowHTML.dataset.direction;
			var left 		= parseFloat(rowHTML.dataset.left);

			// Move accordingly
			if ( direction === "right" ) {
				left += otherHorDistance;
				rowHTML.dataset.left = left;
				// rowHTML.style.left = left + "rem";
				rowHTML.style.left = left + "%";

			} else {
				left -= otherHorDistance;
				rowHTML.dataset.left = left;
				// rowHTML.style.left = left + "rem";
				rowHTML.style.left = left + "%";
			}

			// NEXT LOOP
			var newIndx = indx - 1;
			
			// Pause to give that good ye ol' Space Invader feel
			// otherMovePos is currently in update.js
			setTimeout( function() { moveHorRows( rowsHTMLList, newIndx ); },
				// WARNING!!: THIS INTERVAL ALWAYS HAS TO BE SMALLER
				// THAN THE ONE THAT CALLS THE MOVEMENT OF ALL THE ROWS
				// Start at about 100
				otherMovePause/10 );

		}  // end if (no row)

	};  // end moveHorRows()

	// -------- MOVED -------------
	var moveDownRows = function ( rowsHTMLList, indx ) {
	/* ( [DOM Obj], int ) -> bool

	Moves row laterally depending on direction then
	triggers the movement of the next row
	*/
		var hitBottom = false;

		// If there are no rows left, stop
		if ( indx < 0 ) {
			return rowsHTMLList

		// Otherwise, cycle through the rows, pausing between each row
		} else {

			var rowHTML 		= rowsHTMLList[ indx ];
			// TODO: Should end game condition really be in here, or all
			// of them in one place?
			// TODO: needs to be overlap with single AI
			hitBottom = Util.doesOverlap( rowHTML, player1.html );

			var top  			= parseFloat(rowHTML.dataset.top);
			top 				+= otherVertDistance;
			rowHTML.dataset.top = top;
			rowHTML.style.top 	= top + "rem";

			// NEXT LOOP
			var newIndx 		= indx - 1;
			
			// Pause to give that good ye ol' Space Invader feel
			// otherMovePos is currently in update.js
			setTimeout( function() { moveDownRows( rowsHTMLList, newIndx ); },
				// WARNING!!: THIS INTERVAL ALWAYS HAS TO BE SMALLER
				// THAN THE ONE THAT CALLS THE MOVEMENT OF ALL THE ROWS
				// Start at about 100
				otherMovePause/10 );

		}  // end if (no row)

		return hitBottom;
	};  // end moveDownRows()

	// -------- MOVED -------------
	// Also drops on each change of direction
	var changeDirection = function ( gameContainerHTML ) {
	/* ( DOM Obj ) -> same

	Changes ai row direction dataset value to its opposite.
	Lowers ai rows on each change of direction.
	*/

		var othersRows = gameContainerHTML.getElementsByClassName( "row" );

		for ( var rowi = 0; rowi < othersRows.length; rowi++ ) {
			var rowHTML = othersRows[ rowi ];

			// Change direction data value to opposite
			var direction = rowHTML.dataset.direction;
			if ( direction === "right" ) {
				rowHTML.dataset.direction = "left";
			} else {
				rowHTML.dataset.direction = "right";
			}

		}  // end for( row )

		// Move rows down in a staggered style
		// TODO: !!! IMPORTANT: DO NOT CHANGE gameOver IN HERE LIKE THIS !!!
		gameOver = moveDownRows( othersRows, (othersRows.length - 1) );

		// TODO: What to return? Container or rows list or what?
		return gameContainerHTML;

	};  // end changeDirection();


	var needDirectionChange = function ( gameContainerHTML ) {
	/* ( DOM Obj ) -> bool

	Determines if the ai rows need to change direction.
	*/

		var needChange = false;

		var containerLeft 	= gameContainerHTML.getBoundingClientRect().left;
		var containerRight 	= gameContainerHTML.getBoundingClientRect().right;
		var allOthers 		= gameContainerHTML.getElementsByClassName( "other" );

		// If any "other"s are out of their game container, true will be returned
		for ( var otheri = 0; otheri < allOthers.length; otheri++ ) {
			var other = allOthers[ otheri ];

			// var speedPx = Util.convertEmsToPixels( other, otherHorDistance );
			// var edgeHit = Util.whichEdgeHit( other, gameContainerHTML, speedPx );
			var edgeHit = Util.whichEdgeHit( other, gameContainerHTML, otherHorDistance );

			if ( edgeHit === "right" || edgeHit === "left" ) { needChange = true; }

		}  // for (other (HTML) )

		return needChange;

	};  // end needDirectionChange()


	var triggerRowMovement = function ( gameContainerHTML ) {
	// TODO: Add pause between the movement of each row
	/* ( [HTML] ) -> same

	Changes direction if needed then triggers the movement of
	all rows in the gameContainerHTML
	*/

		var othersRows = gameContainerHTML.getElementsByClassName( "row" );

		var needChange = needDirectionChange( gameContainerHTML );
		if (needChange) {
			changeDirection( gameContainerHTML );
		}

		// Start with the first row
		moveHorRows( othersRows, (othersRows.length - 1) );

		return gameContainerHTML;

	};  // end triggerRowMovement()

// });

// =============
// TESTS
// =============

// var gridA = buildOthersGrid( rowMap, Other, othersTypes );
// appendToRows( rowList, gridA );

// THIS WOULD CREATE A REDUNDANT LIST AND OBJ WOULD HAVE TO BE
// REMOVED FROM ALL LISTS
// var othersList = [];
// for ( var rowi = 0; rowi < gridA.length; rowi++ ) {
// 	var row = gridA[ rowi ];

// 	for ( var otheri = 0; otheri < row.length; otheri++ ) {
// 		othersList.push( row[ otheri ] );
// 	}
// }  // end for ( rows in rowA )

var board_id_count = 1;

var BoardA = Board( "board_" + board_id_count );
BoardA.init();

// //------------

// var fieldAElem = document.getElementsByClassName("field")[0];
// var player1 	= Player( fieldAElem, 1 );
// var playerList 	= [ player1 ];
// addPlayers( fieldAElem, playerList );

// var GameContA = document.getElementsByClassName("game-container")[0];
// var FieldA = Field(1);

// var StatsA = StatsDisplay( GameContA );
// StatsA.init();
// GameContA.insertBefore( StatsA.topbar, fieldAElem );
// GameContA.appendChild( StatsA.bottombar, fieldAElem );

// update();
BoardA.update();
