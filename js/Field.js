/* Created 02/19/15 */

'use strict'

var Field = function ( id ) {
/* ( int ) -> Field

*/
	var field = {};

	field.html				= null;

	field.numCols			= 11;
	var colPercent			= (100 - otherWidth) / (numCols - 1);

	field.rows 				= [];

	// Only needed for setup
	var numRows				= 5;
	var rowHeight			= 8;
	var rowWidth			= 88;
	var rowMap				= ["1", "2", "2", "3", "3"];

	var otherWidth 			= 4;

	field.player 			= null;
	field.playerBulletList 	= [];

	field.othersLists 		= [];
	field.othersBulletList 	= [];

	field.barriers	 		= [];

	// In rem's
	// Needs to overlap?
	var otherVertDistance 	= 0.8;
	// Hor distance must be the remaining width of the field/16
	// 88% is a row width
	// In %
	var otherHorDistance	= ( 100 - rowWidth ) / 16;


	// field.width		= dimensions.width; // 100%
	// field.height		= dimensions.height;  // 25rem; ( 25/30 = 10/12 = 83.3333% of board height) 30 * (10/12)


	// TODO: Should these be set elsewhere? _init?
	field.oldTime 			= Date.now();
	// field.newTime 		= field.oldTime;
	field.oldTimeAIAttack	= field.oldTime;
	field.oldTimeAIMove		= field.oldTime;
	field.oldTimePlayerShot	= field.oldTime;

	// For stats
	field.mysteriousDeadCount	= 0;
	field.other1DeadCount		= 0;
	field.other2DeadCount		= 0;
	field.other3DeadCount		= 0;
	field.livesCount			= 0;
	field.shotsCount			= 0;
	field.hitsCount				= 0;
	field.travelDistCount		= 0;

	field.hostile				= true;

	// ===========
	// SETUP
	// ===========




	field.buildRows = function ( numRows ) {
	/*

	*/
		var self = this;

		var rows = [];

		for ( var rowNum = 0; rowNum < numRows; rowNum++ ) {

			var top 				= rowHeight * rowNum;

			var html 				= document.createElement( "div" );
			html.className 			= "object others row row-" + (rowNum + 1);
			html.dataset.direction 	= 'left';
			html.dataset.left		= 0;
			html.dataset.top 		= top;

			html.style.top 			= top + "%";

			rows.push( html );

		}  // end for ( rowNum )

		return rows;
	};  // end Field.buildRows()


	field.buildHTML = function () {
	/*

	*/
		var self = this;

		var html 		= document.createElement( "section" );
		html.className 	= "field";

		var rows 		= self.buildRows( numRows );

		for ( var rowi = 0; rowi < rows.length; rowi++ ) {
			html.appendChild( rows[ rowi ] );
		}  // end for ( rowi )

		var player 		= Player( 1 );
		html.appendChild( player.html );


		self.rows 	= rows;
		self.player = player;
		self.html 	= html;

		return self;

	};  // end Field.buildHTML()


	// ============
	// OTHERS
	// ============
	// Update Group

	// TODO: Should this be a method for every field, or should
	// there just be one function for this, like on Field itself?
	// TODO: Find out if js can have truely recursive functions
	// where no stack is created (that is, you don't have to return)
	// everything.
	field.getRandomLowestOther = function ( othersGrid ) {
	/* [[Other]] -> Other

	Calls itself until it returns an Other than is the lowest
	Other in its cloumn, unless there are no Others left. allGone
	(defined inside) will stop recursion.

	TODO: Pass in columns to exclude (those that have already been tried
	and found empty)
	*/
		var self = this;

		var randomOther = null;
		// allGone will stop recursion (needed if lists are emptied, not
			// if null values are used instead. I'll explain that better,
			// sometime but it's to do with how the lowest Other will be found,
			// a decision not yet made)
		var allGone		= true;  // Can be refuted later
		// Get a random column number
		var randCol 	= Util.getRandomIntInRange( 0, self.numCols );

		// Go from top to bottom row looking for Other with that _column
		// property value, replacing randomOther with any next iteration

		// TODO: How do we make sure the bottom row is the last on the list?
		// I mean more securely than trusting that we built the list correctly

		// Because we're going from top to bottom, if an Other is found
		// in a lower row, it will replace any previous Others found
		for ( var rowi = 0; rowi < othersGrid.length; rowi++ ) {
			var row = othersGrid[ rowi ];
			// Will allow recursion after for loop
			if ( row.length > 0 ) { allGone = false; }

			for ( var otheri = 0; otheri < row.length; otheri++ ) {
				var other = row[ otheri ];
				if ( other.column === randCol ) {
					randomOther = other;
				}
			}

		}  // end for ( row )

		// Only call next recursion if there are still items in the list
		if ( !allGone ) {

			// If this column value didn't get anything, try again.
			// Otherwise, return other
			if ( randomOther === null ) {
				// MUST return something here or nothing gets returned
				return self.getRandomLowestOther( othersGrid );
			} else {
				return randomOther;
			}

		} else { 
			console.log("All Gone");
			return null;
		}

		// or
		// See if there's a non-null value at that index
			// But then other things will have to check for non-null values _and_
			// end condition can't be no Others ( but maybe it can be no #parent.other )

	};  // End Field.getRandomLowestOther()


	field.attack = function ( othersGrid ) {
	/*

	Picks a random Other that has no Others below it and
	triggers it to shoot
	*/	
		var self = this;

		var randomLowestOther = self.getRandomLowestOther( othersGrid );
		randomLowestOther.shoot( self.html );

		return this;
	};  // End Field.attack()


	field.update = function ( currentTime ) {
	/*

	Does all the updating of all the things for this field
	TODO: Will only be called if game is not over? Or does
	each field have its own game over?
	Returns whether game is over or not
	*/
		var self = this;

		// =============
		// PLAYER
		// =============
		self.player.move( self.player.direction );

		// =============
		// OTHERS
		// =============
		var shootTimeDiff = currentTime - self.oldTime;

		// TODO: set timeout for random length pausing between each attack
		// Fix this later to be own grid
		var randomWait = Math.pow( otherMovePause, 2 ) * Math.random();
		var cappedWait = Math.max( 3000, randomWait );

		if ( self.hostile && (shootTimeDiff > cappedWait) ) {
			self.attack( gridA );
			self.oldTime = currentTime;
		}

		// Game Over if all Others are dead
		var allGone = false;
		// If any row is not empty, allGone = true;
		if ( allGone ) { gameOver = true };

		// ============
		// FOR NEXT LOOP
		// ============
		// self.newTime = Date.now()

		return false;
	};  // End Field.update()


	field.init = function () {
	/*

	*/
		var self = this;

		self.buildHTML();

		return self
	};  // end Field.init()



	// ===========
	// END
	// ===========

	return field;

};  // End Field()
