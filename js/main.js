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
	var colPercent  = 100/numCols;
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

	var moveRowHor = function ( rowHTML, left, direction ) {

		if ( direction === "right" ) {

			left += 0.25;
			rowHTML.dataset.left = left;
			rowHTML.style.left = left + "rem" ;

		} else {
			left -= 0.25;
			rowHTML.dataset.left = left;
			rowHTML.style.left = left + "rem" ;
		}

		return rowHTML;

	};  // end moveRowHor()

	var moveRow = function ( rowHTML ) {

		var direction = rowHTML.dataset.direction;
		var top  = parseFloat(rowHTML.dataset.top);
		var left = parseFloat(rowHTML.dataset.left);

		// TODO: way of telling rightmost is incorrect,
		// ai has to always move as far right as possible
		if ( (left <= 0) || (left >= 10.25) ) {
			top += 0.25;
			rowHTML.dataset.top = top;
			rowHTML.style.top = top + "rem";

			// Currently direction doesn't change fast enough to
			// do this right if it's in its own if statement
			if ( direction === "right" ) {
			moveRowHor( rowHTML, left, "right" );
			} else {
				moveRowHor( rowHTML, left, "left" );
			}

		} else if ( direction === "right" ) {
			moveRowHor( rowHTML, left, "right" );
		} else {
			moveRowHor( rowHTML, left, "left" );
		}

		return rowHTML;

	};  // end moveRow()

	var changeDirection = function ( gameContainerHTML ) {

		var othersRows = gameContainerHTML.getElementsByClassName( "row" );

		for ( var rowi = 0; rowi < othersRows.length; rowi++ ) {

			var direction = othersRows[ rowi ].dataset.direction;

			if ( direction === "right" ) {
				othersRows[ rowi ].dataset.direction = "left";
			} else {
				othersRows[ rowi ].dataset.direction = "right";
			}

		}  // end for( row )

		// TODO: What to return? Container or rows list or what?
		return gameContainerHTML;

	};  // end changeDirection();

	var needDirectionChange = function ( gameContainerHTML ) {
		var needChange = false;

		var containerLeft 	= gameContainerHTML.getBoundingClientRect().left;
		var containerRight 	= gameContainerHTML.getBoundingClientRect().right;
		var allOthers 		= gameContainerHTML.getElementsByClassName( "other" );

		for ( var otheri = 0; otheri < allOthers.length; otheri++ ) {
			var other = allOthers[ otheri ];

			var otherLeft 	= other.getBoundingClientRect().left;
			var otherRight 	= other.getBoundingClientRect().right;

			if ( (containerLeft >= otherLeft) || (containerRight <= otherRight) ) {
				needChange = true;
			}
		}

		return needChange;

	};  // end needDirectionChange()



	var moveAllRows = function ( gameContainerHTML ) {

		var othersRows = gameContainerHTML.getElementsByClassName( "row" );

		var needChange = needDirectionChange( gameContainerHTML );
		if (needChange) {
			changeDirection( gameContainerHTML );
		}

		for ( var rowi = 0; rowi < othersRows.length; rowi++ ) {
			moveRow( othersRows[ rowi ] );
		}

		return gameContainerHTML;

	};  // end moveAllRows()

// });

// =============
// TESTS
// =============
var y = buildRows( 5, rowMap, Other, othersObjs );
appendToRows( rowList, y );
update();

