/* Created 02/15/15 */
/*
TODO:
- Player input
- Other movement
- Row constructions

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

		console.log(othersList);
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
			// console.log("row type: ");
			// console.log( typeof(row) );

			for ( var coli = 0; coli < othersRow.length; coli++ ) {
				// console.log( "col type: " );
				// console.log( typeof( toAppend[ coli ]._html ) ); 
				docRow.appendChild( othersRow[ coli ]._html );
			}
		}

		return htmlRows;

	};  // end appendRows()

	var moveRow = function ( row ) {

		// if at left-most
			// direction = "right";
			// move down 1 unit;
		// else if rightmost
			// same
		// else if ( row.direction === "right" ) {
			// move right 1 unit
		// } same for left

	};  // end moveRow

// });

// =============
// TESTS
// =============
var y = buildRows( 5, rowMap, Other, othersObjs );
appendToRows( rowList, y );



