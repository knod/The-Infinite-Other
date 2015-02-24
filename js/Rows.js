/* Created 02/23/15 */

'use strict'

var Rows = function ( id, numRows ) {
/* ( int ) -> Field
2/25
*/
	var rows = {};

	// In rem's
	// rows.width 	= dimensions.width;
	rows.rowHeight 	= 8;
	// width: 88%;
	// height: 8%;

	rows.list 		= [];

	// ===========
	// SETUP
	// ===========
	rows.buildHTMLList = function () {
	/*

	*/
		var self = this;

		for ( var rowNum = 0; rowNum < numRows; rowNum++ ) {

			var top 				= self.rowHeight * rowNum;

			var html 				= document.createElement( "div" );
			html.className 			= "object others row row-" + (rowNum + 1);
			html.dataset.direction 	= 'left';
			html.dataset.left		= 0;
			html.dataset.top 		= top;

			html.style.top 			= top + "%";

			self.list.push( html );

		}  // end for ( rowNum )

		return self.list;

	};  // end Rows.buildHTMLList()

	rows.buildHTMLList();

	// ========
	// END
	// ========

	return rows;

};  // end Rows()