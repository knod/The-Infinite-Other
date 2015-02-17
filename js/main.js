/* Created 02/15/15 */
/*
TODO:
- Player input
- Other movement
- Row constructions
- Is there a way to change the size and placement
of the row based on its contents, to have its contents
determine its size and position?

// Movement
// left & right arrows
// "a" & "d"

// Shooting
// spacebar & return

// 11 columns, 5 rows
// 16 movements

*/

'use strict'

// window.addEventListener( "load", function () {

	var rowList = document.getElementsByClassName("row");

	var numRows  	=  rowList.length;
	var numCols  	= 11;
	// TODO: Determine this dynamically
	// TODO: !!!! THIS MATH IS WRONG !!! FIGURE IT OUT !!!
	var otherWidth 	= 1/3;
	var colPercent  = 100/( (numCols-1) + otherWidth );
	var rowMap   	= ["1", "2", "2", "3", "3"];

	var buildOthersList = function ( type, mappedOthers ) {
		/* (str, JS Obj) -> [Other]
		
		Does it need to be a int instead of an str?
		The keys in mappedOthers should be integers
		*/
		var othersList = [];

		for ( var col = 0; col < numCols; col++ ) {
			var leftVal = col * colPercent;
			var leftStr = leftVal + "%";

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


	// Builds all the rows handed in
	// ( [HTML], HTML ) -> [HTML]
	// var buildRows = function ( rowList, node ) {
	var buildRows = function ( numRows, rowMap, Other, mappedOthers ) {
		/* ( int, [int], {}, {} ) -> [HTML?]

		*/

		var rows = [];

		for ( var rowi = 0; rowi < numRows; rowi++ ) {

			var mappedVal = rowMap[ rowi ];
			var othersList = buildOthersList( mappedVal, mappedOthers );
			rows.push( othersList );

		}

		return rows;

	};  // end buildRows()


	var appendToRows = function ( htmlRows, toAppend ) {

		for ( var rowi = 0; rowi < htmlRows.length; rowi++ ) {
			var docRow = htmlRows[ rowi ];
			var othersRow = toAppend[ rowi ];

			for ( var coli = 0; coli < othersRow.length; coli++ ) {
				docRow.appendChild( othersRow[ coli ]._html );
			}
		}

		return htmlRows;

	};  // end appendRows()

	var otherMoveDistance = 0.25;

	// TODO: needs a different name now that it triggers subsequent rows
	var moveRowHor = function ( rowsHTML, indx ) {
		/* ( DOM Obj ) -> same

		Moves row laterally depending on direction then
		triggers the movement of the next row
		*/

		if ( indx > (rowsHTML.length - 1) ) {
			return rowsHTML
		} else {

			var rowHTML = rowsHTML[ indx ];

			var direction = rowHTML.dataset.direction;
			var left = parseFloat(rowHTML.dataset.left);

			if ( direction === "right" ) {
				left += otherMoveDistance;
				rowHTML.dataset.left = left;
				rowHTML.style.left = left + "rem" ;

			} else {
				left -= 0.25;
				rowHTML.dataset.left = left;
				rowHTML.style.left = left + "rem" ;
			}

			var newIndx = indx + 1;

			// NEXT LOOP
			setTimeout( function() {moveRowHor( rowsHTML, newIndx );},
				100);

		}

	};  // end moveRowHor()

	// Also drops on each change of direction
	var changeDirection = function ( gameContainerHTML ) {
		/* ( DOM Obj ) -> same

		Changes ai row direction dataset value.
		Lowers ai rows on each change of direction.
		*/

		var othersRows = gameContainerHTML.getElementsByClassName( "row" );

		for ( var rowi = 0; rowi < othersRows.length; rowi++ ) {
			var rowHTML = othersRows[ rowi ];

			// Change direction data value
			var direction = rowHTML.dataset.direction;
			if ( direction === "right" ) {
				rowHTML.dataset.direction = "left";
			} else {
				rowHTML.dataset.direction = "right";
			}

			// Move down
			var top  = parseFloat(rowHTML.dataset.top);
			top += otherMoveDistance;
			rowHTML.dataset.top = top;
			rowHTML.style.top = top + "rem";

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

		for ( var otheri = 0; otheri < allOthers.length; otheri++ ) {
			var other = allOthers[ otheri ];

			var otherLeft 	= other.getBoundingClientRect().left;
			var otherRight 	= other.getBoundingClientRect().right;

			// +1 on the right so it doesn't have to actually cross the boundry to be detected
			if ( (containerLeft >= otherLeft) || (containerRight <= (otherRight + 1)) ) {
				needChange = true;
			}
		}

		return needChange;

	};  // end needDirectionChange()



	var moveAllRows = function ( gameContainerHTML ) {
		// TODO: Add pause between the movement of each row
		/* Triggers the movement of all rows */

		var othersRows = gameContainerHTML.getElementsByClassName( "row" );

		var needChange = needDirectionChange( gameContainerHTML );
		if (needChange) {
			changeDirection( gameContainerHTML );
		}
		
		// Start with the first row
		moveRowHor( othersRows, 0 );

		return gameContainerHTML;

	};  // end moveAllRows()

// });

// =============
// TESTS
// =============
var y = buildRows( 5, rowMap, Other, othersObjs );
appendToRows( rowList, y );
update();

