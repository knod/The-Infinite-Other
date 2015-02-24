/* Created 02/23/15 */

'use strict'

var rowTypes = {

	1: {
		class 		: "row-1",
		direction 	: "left",
		left 		: "0" 
	},

	2: {
		class 		: "row-2",
		direction 	: "left",
		left 		: "0" 
	},

	3: {
		class 		: "row-3",
		direction 	: "left",
		left 		: "0" 
	},

	4: {
		class 		: "row-4",
		direction 	: "left",
		left 		: "0" 
	},

	5: {
		class 		: "row-5",
		direction 	: "left",
		left 		: "0" 
	},


};

var Rows = function ( id, numRows, dimensions ) {
/* ( int ) -> Field

*/
	var rows = {};

	// In rem's
	rows.width 	= dimensions.width;
	rows.height = dimsions.height;
	// width: 31rem;  /* field width - (otherSpeed * 16) */
	// height: 2rem;


	rows.html 	= null;

	// ===========
	// SETUP
	// ===========
	rows.buildHTML = function () {
	/*

	*/
		var self = this;

		for ( var rowi = 0; rowi < (numRows - 1); rowi++ ) {

			var top = self.height * rowi;


		}

		// Row 1
		var row1 				= document.createElement( "div" );
		row1.className 			= "object others row row-1";
		row1.dataset.direction 	= 'left';
		row1.dataset.top 		= 0;



	};  // end Rows.buildHTML()

	// <div class='object others row row-1' data-direction='left' data-top='0' data-left='0'></div>
	// 		<div class='object others row row-2' data-direction='left' data-top='2' data-left='0'></div>
	// 		<div class='object others row row-3' data-direction='left' data-top='4' data-left='0'></div>
	// 		<div class='object others row row-4' data-direction='left' data-top='6' data-left='0'></div>
	// 		<div class='object others row row-5' data-direction='left' data-top='8' data-left='0'></div>


	// ========
	// END
	// ========

	return rows;

};  // end Rows()