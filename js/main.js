/* Created 02/15/15 */
/*
TODO:
- Player input
- Destroying AI
	- score
	- collision detection with bullets
- Destroy Player
- Bullet collision
- AI bullets (only shoot from lowest)
- Lives
- Top variable score AI
- Barriers
- Win/loss conditions
	2 loss conditions: lose lives, Others reach bottom (barriers? player?)
	2 non-loss conditions: destroy all, not destroy
- High score
- Opening & closing screens
- Unit tests
- ~ Other movement (partially done)

MAYBE TODO:
- Build converters to convert from pixels to rem and maybe to %

QUESTIONS:
- Is there a way to change the size and placement
of the row based on its contents, to have its contents
determine its size and position?

// Movement
// left & right arrows
// "a" & "d"

// Shooting
// spacebar, return, up arrow

*/

'use strict'

// window.addEventListener( "load", function () {

	// These two need to be the same length
	// TODO: create data values for rows of their Other type
	// and use that to get mapped types
	var rowList 	= document.getElementsByClassName("row");
	var rowMap   	= ["1", "2", "2", "3", "3"];

	var numCols  	= 11;
	// TODO: Determine this dynamically
	// TODO: !!!! THIS MATH IS WRONG !!! FIGURE IT OUT !!!
	// This determines how the Other elements are laid out in the rows
	var otherWidth 	= 1/3;
	var colPercent  = 100/( (numCols-1) + otherWidth );

	var player1 = Player( 1 );
	var playerList = [ player1 ];

	// THIS IS ALL WRONG, FIX - game containers and their contents should be
	// created at the same time. Perhaps updates should be for containers as
	// well.
	var addPlayers = function ( parent, playerList ) {
	/*

	*/
		var player = playerList[ 0 ];
		player._buildHTML();
		parent.appendChild( player._html );

	};  // end addPlayers()

	var buildOthersRow = function ( type, mappedOthers ) {
	/* ( str, {} ) -> [Other]
	
	Returns a list of Other objects to fill a row (based on number of columns)
	mappedOthers: object of objects containing the values for the Others to be generated
	*/
		var othersList = [];

		for ( var col = 0; col < numCols; col++ ) {
			var leftVal = col * colPercent;
			var leftStr = leftVal + "%";

			// Create an Other of this type with this css "left" value
			var other = Other( mappedOthers[ type ], leftStr );
			other._buildHTML();
			othersList.push( other );
		}

		return othersList;
	}


	var buildRow = function ( rowElem, node ) {
	/* ( HTML, HTML ) -> HTML
	 Given a row element and a set of classes (??),
	 creates a row full of elements with that class
	*/


	};  // end buildRow()


	var buildRows = function ( rowMap, Other, mappedOthers ) {
	/* ( int, [str], {}, {} ) -> [HTML]

	Returns a list of Other's go in each row. Used to then add Other's
	html to the currently empty row elements

	rowMap: list of which types of objects go in which row. Those strings will
		be used to get objects from mappedOthers
	mappedOthers: object of objects containing the values for the Others to be generated
	*/

		var rows = [];

		for ( var rowi = 0; rowi < rowMap.length; rowi++ ) {
			var typeVal = rowMap[ rowi ];
			var othersList = buildOthersRow( typeVal, mappedOthers );
			rows.push( othersList );
		}

		return rows;

	};  // end buildRows()


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
				docRow.appendChild( othersRow[ coli ]._html );
			}
		}

		return htmlRows;

	};  // end appendRows()

	// 
	var otherMoveDistance = 0.25;

	// TODO: needs a different name now that it triggers subsequent rows
	var moveRows = function ( rowsHTML, indx ) {
	/* ( DOM Obj ) -> same

	Moves row laterally depending on direction then
	triggers the movement of the next row
	*/

		// If there are no rows left, stop
		if ( indx > (rowsHTML.length - 1) ) {
			return rowsHTML

		// Otherwise, cycle through the rows, pausing between each row
		} else {

			var rowHTML 	= rowsHTML[ indx ];

			// get the row's current direction and position
			var direction 	= rowHTML.dataset.direction;
			var left 		= parseFloat(rowHTML.dataset.left);

			// Move accordingly
			if ( direction === "right" ) {
				left += otherMoveDistance;
				rowHTML.dataset.left = left;
				rowHTML.style.left = left + "rem" ;

			} else {
				left -= otherMoveDistance;
				rowHTML.dataset.left = left;
				rowHTML.style.left = left + "rem" ;
			}

			// NEXT LOOP
			var newIndx = indx + 1;
			
			// Pause to give that good ye ol' Space Invader feel
			// otherMovePos is currently in update.js
			setTimeout( function() { moveRows( rowsHTML, newIndx ); },
				// WARNING!!: THIS INTERVAL ALWAYS HAS TO BE SMALLER
				// THAN THE ONE THAT CALLS THE MOVEMENT OF ALL THE ROWS
				// Start at about 100
				otherMovePause/10 );

		}  // end if (no row)

	};  // end moveRows()


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

			// Move row down
			var top  			= parseFloat(rowHTML.dataset.top);
			top 				+= otherMoveDistance;
			rowHTML.dataset.top = top;
			rowHTML.style.top 	= top + "rem";

		}  // end for( row )

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

			var otherLeft 	= other.getBoundingClientRect().left;
			var otherRight 	= other.getBoundingClientRect().right;

			// +1 on the right so it doesn't have to actually cross the boundry to be detected
			if ( (containerLeft >= otherLeft) || (containerRight <= (otherRight + 1)) ) {
				needChange = true;
			}
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
		moveRows( othersRows, 0 );

		return gameContainerHTML;

	};  // end triggerRowMovement()

// });

// =============
// TESTS
// =============
var y = buildRows( rowMap, Other, othersTypes );
appendToRows( rowList, y );

var gameCont = document.getElementsByClassName("game-container")[0];
addPlayers( gameCont, playerList );

update();

