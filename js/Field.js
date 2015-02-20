/* Created 02/19/15 */

'use strict'

var Field = function ( id ) {
/* ( int ) -> Field

*/
	var field = {};

	field._html			= document.getElementsByClassName("field")[0];
	field._numCols		= 11;

	field._rows 		= null;
	field._hostile		= true;

	field._oldTime 		= Date.now();
	field._newTime 		= field._oldTime;

	// ============
	// OTHERS
	// ============
	// Update Group
	var count = 0;
	// TODO: Should this be a method for every field, or should
	// there just be one function for this, like on Field itself?
	// TODO: Find out if js can have truely recursive functions
	// where no stack is created (that is, you don't have to return)
	// everything.
	field._getRandomLowestOther = function ( othersGrid ) {
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
		var randCol 	= Util._getRandomInt( 0, self._numCols );

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
				if ( other._column === randCol ) {
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
				return self._getRandomLowestOther( othersGrid );
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

	};  // End Field._getRandomLowestOther()


	field._attack = function ( othersGrid ) {
	/*

	Picks a random Other that has no Others below it and
	triggers it to shoot
	*/	
		var self = this;

		var randomLowestOther = self._getRandomLowestOther( othersGrid );
		randomLowestOther._shoot( self._html );

		return this;
	};  // End Field._attack()


	field._update = function () {
	/*

	Does all the updating of all the things for this field
	TODO: Will only be called if game is not over? Or does
	each field have its own game over?
	*/
		var self = this;

		var shootTimeDiff = self._newTime - self._oldTime;

		// TODO: set timeout for random length pausing between each attack
		// Fix this later to be own grid
		var randomWait = Math.pow( otherMovePause, 2 ) * Math.random();
		var cappedWait = Math.max( 3000, randomWait );

		if ( self._hostile && (shootTimeDiff > cappedWait) ) {
			self._attack( gridA );
			self._oldTime = self._newTime;
		}

		// Game Over if all Others are dead
		var allGone = false;
		// If any row is not empty, allGone = true;
		if ( allGone ) { gameOver = true };

		// ============
		// FOR NEXT LOOP
		// ============
		self._newTime = Date.now()

		return this;
	};  // End Field._update()

	return field;

};  // End Field()
