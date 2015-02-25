/* Created 02/19/15 */

'use strict'

var Field = function ( id, boardHTML ) {
/* ( int ) -> Field

*/
	var field = {};

	field.html				= null;
	field.boardHTML 		= boardHTML;

	field.rows 				= [];
	// vars only needed for setup, used once
	field.numRows			= 5;
	field.rowHeight			= 8;
	field.rowWidth			= 88;
	field.rowMap			= ["1", "2", "2", "3", "3"];

	field.otherWidth 		= 4;
	field.numCols			= 11;
	field.colPercent		= (100 - field.otherWidth) / (field.numCols - 1);

	field.numOthers			= field.numCols * field.rowMap.length;
	field.othersGrid		= [];

	field.player 			= null;
	field.playerBulletList 	= [];

	field.othersGrid 		= [];
	field.othersBulletList 	= [];

	field.barriers	 		= [];

	// In %'s
	// Needs to overlap?
	field.otherVertSpeed 	= 3.2; 
	// Hor distance must be the remaining width of the field/16
	// 88% is a row width
	// In %'s
	field.otherHorSpeed			= ( 100 - field.rowWidth ) / 16;
	// Pause between movement
	field.otherPauseModifier 	= 2;
	field.otherPauseExponent	= 1.55;
	field.otherBasePause 		= 1000;


	// field.width		= dimensions.width; // 100%
	// field.height		= dimensions.height;  // 25rem; ( 25/30 = 10/12 = 83.3333% of board height) 30 * (10/12)


	// TODO: Should these be set elsewhere? _init?
	field.oldTime 			= Date.now();
	// field.newTime 		= field.oldTime;
	field.lastTimeAIMoved	= field.oldTime;
	field.lastTimeAIShot	= field.oldTime;
	field.lastTimePlShot	= field.oldTime;

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
	field.buildObjsRow = function ( Other, type, mappedTypes ) {
	/* ( func{}, str, {} ) -> [Other]
	
	// TODO: Is it better to use globals, internal globals (object scope),
	// object properties, or arguments passsed in? There would be a lot of
	// excess properties.

	Returns a list of Other objects to fill a row (based on number of columns)
	mappedTypes: object of objects containing the values for the Others to be generated
	*/
		var self = this;

		var othersList = [];

		for ( var col = 0; col < self.numCols; col++ ) {

			var leftVal 	= col * self.colPercent;
			var leftStr 	= leftVal + "%";

			// Create an Other of this type with this css "left" value
			var other 		= Other( self.html, mappedTypes[ type ], leftStr );
			other.buildHTML();
			other.column 	= col;
			// other.row	= rowNum;
			othersList.push( other );
		}

		return othersList;
	};  // end Field.buildOtherRow()


	field.buildObjectGrid = function ( Other, mappedTypes ) {
	/* ( [], func{}, {} ) -> [ [ Other ] ]

	Returns a list of Other's go in each row. Used to then add Other's
	html to the currently empty row elements

	rowMap: list of which types of objects go in which row. Those strings will
		be used to get objects from mappedTypes
	mappedTypes: object of objects containing the values for the Others to be generated
	*/
		var self = this;
		var grid = [];
debugger;
		// Build and add each row for the grid
		for ( var rowi = 0; rowi < self.rowMap.length; rowi++ ) {
			var typeVal 	= self.rowMap[ rowi ];
			var othersList 	= self.buildObjsRow( Other, typeVal, mappedTypes );
			grid.push( othersList );
		}

		self.othersGrid = grid;
		return grid;

	};  // end Field.buildObjectGrid()


	field.appendToRows = function ( htmlRows, toAppend ) {
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

	};  // end Field.appendRows()


	field.buildRowsHTML = function ( numRows, rowHeight ) {
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
	};  // end Field.buildRowsHTML()


	field.buildHTML = function () {
	/*

	*/
		var self = this;

		var html 		= document.createElement( "section" );
		html.className 	= "field";
		debugger;
		self.html 		= html;
		return self;

	};  // end Field.buildHTML()

	
	field.addObjects = function () {
	/*

	*/
		var self = this;

		// OTHERS
		var rows 	= self.buildRowsHTML( self.numRows, self.rowHeight );
		// TODO: Needs a clearer name
		self.appendToRows( rows, self.othersGrid );

		self.player = Player( self.html, 1 );
		self.rows 	= rows;
		return self;
	};  // end Field.addObjects()


	field.appendChildren = function () {
	/*

	*/
		var self 		= this;
		var selfHTML_ 	= this.html;
		var rows_ 		= self.rows;

		for ( var rowi = 0; rowi < rows_.length; rowi++ ) {
			selfHTML_.appendChild( rows_[ rowi ] );
		}  // end for ( rowi )

		selfHTML_.appendChild( self.player.html );

		return self;
	};  // end Field.appendChildren()


	// ============
	// OTHERS
	// ============
	// ---- MOVEMENT ----
	// TODO: needs a different name now that it triggers subsequent rows
	field.moveHorRows = function ( rowsHTMLList, indx ) {
	/* ( DOM Obj, int ) -> same

	Moves row laterally depending on direction then
	triggers the movement of the next row
	*/
		var self = this;

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
				left += self.otherHorSpeed;
				rowHTML.dataset.left = left;
				rowHTML.style.left = left + "%";

			} else {
				left -= self.otherHorSpeed;
				rowHTML.dataset.left = left;
				rowHTML.style.left = left + "%";
			}

			// NEXT LOOP
			var newIndx = indx - 1;
			
			// Pause to give that good ye ol' Space Invader feel
			// otherMovePos is currently in update.js
			setTimeout( function() { self.moveHorRows( rowsHTMLList, newIndx ); },
				// WARNING!!: THIS INTERVAL ALWAYS HAS TO BE SMALLER
				// THAN THE ONE THAT CALLS THE MOVEMENT OF ALL THE ROWS
				// Start at about 100
				self.otherBasePause/10 );

		}  // end if (no row)

	};  // end Field.moveHorRows()


	field.moveDownRows = function ( rowsHTMLList, indx ) {
	/* ( [DOM Obj], int ) -> bool

	Moves row laterally depending on direction then
	triggers the movement of the next row
	*/
		var self = this;
		// TODO: Fix to proper end condition
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
			hitBottom = Util.doesOverlap( rowHTML, self.player.html );

			var top  			= parseFloat(rowHTML.dataset.top);
			top 				+= self.otherVertSpeed;
			rowHTML.dataset.top = top;
			// TODO: Fix to percent
			rowHTML.style.top 	= top + "%";

			// NEXT LOOP
			var newIndx 		= indx - 1;
			
			// Pause to give that good ye ol' Space Invader feel
			// otherMovePos is currently in update.js
			setTimeout( function() { self.moveDownRows( rowsHTMLList, newIndx ); },
				// WARNING!!: THIS INTERVAL ALWAYS HAS TO BE SMALLER
				// THAN THE ONE THAT CALLS THE MOVEMENT OF ALL THE ROWS
				// Start at about 100
				self.otherBasePause/10 );

		}  // end if (no row)

		return hitBottom;
	};  // end field.moveDownRows()


	field.changeDirection = function ( rowsHTMLList ) {
	/* ( DOM Obj ) -> same

	Changes ai row direction dataset value to its opposite.
	Lowers ai rows on each change of direction.
	*/
		var self = this;

		for ( var rowi = 0; rowi < rowsHTMLList.length; rowi++ ) {
			var rowHTML = rowsHTMLList[ rowi ];

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
		self.gameOver = self.moveDownRows( rowsHTMLList, (rowsHTMLList.length - 1) );

		// TODO: What to return? Container or rows list or what?
		return rowsHTMLList;
	};  // end Field.changeDirection();



	field.needDirectionChange = function ( boardHTML ) {
	/* ( DOM Obj ) -> bool

	Determines if the ai rows need to change direction.
	*/
		var self = this;

		var needChange = false;

		// TODO: Change to individual others so can just check individual positions
		// TODO: Shouldn't "game engines" have the ability to have parent objects?
		// TODO: Check position between any two objects
		// var leftmost 	= 0;
		// var rightmost	= 100 - field.otherWidth;

		var containerLeft 	= boardHTML.getBoundingClientRect().left;
		var containerRight 	= boardHTML.getBoundingClientRect().right;
		var allOthers 		= boardHTML.getElementsByClassName( "other" );

		// If any "other"s are out of their game container, true will be returned
		for ( var otheri = 0; otheri < allOthers.length; otheri++ ) {
			var other = allOthers[ otheri ];

			var edgeHit = Util.whichEdgeHit( other, boardHTML, self.otherHorSpeed );

			if ( edgeHit === "right" || edgeHit === "left" ) { needChange = true; }

		}  // for (other (HTML) )

		return needChange;

	};  // end Field.needDirectionChange()


	field.triggerRowMovement = function ( boardHTML ) {
	// TODO: Add pause between the movement of each row
	/* ( [HTML] ) -> same

	Changes direction if needed then triggers the movement of
	all rows in the boardHTML
	*/
		var self = this;

		var othersRows = boardHTML.getElementsByClassName( "row" );

		var needChange = self.needDirectionChange( boardHTML );
		if ( needChange ) {
			self.changeDirection( othersRows );
		}

		// Start with the first row
		self.moveHorRows( othersRows, (othersRows.length - 1) );

		return boardHTML;
	};  // end Field.triggerRowMovement()

	
	// ---- ATTACKING ----

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
		self.othersBulletList.push( randomLowestOther.shoot( self.html ) );

		return this;
	};  // End Field.attack()



	// TODO: Do collisions in one place and movement in another place?
	field.updateBullets = function ( bulletList, objLists ) {
	/* ( [], [[{}]] ) -> 

	Moves bullets in the bulletList, destroys them if they git a wall or
	collide with something, destroyes anything they collide with
	*/
		for ( var bulleti = 0; bulleti < bulletList.length; bulleti++ ) {

			var bullet = bulletList[ bulleti ];
			bullet.move( bullet.direction );

			// Will we need to destroy the bullet?
			var needDestroyBullet = false;
			var collidee = null;

			// check for collision with parent
			var exitee = bullet.goingOutOfBounds( bullet.fieldHTML );
			if ( exitee !== null ) {
				needDestroyBullet = true; 

			// If parent doesn't destroy, check for other collisions
			} else {

				for ( var objListi = 0; objListi < objLists.length; objListi++ ) {
					var objs = objLists[ objListi ];

					for ( var obji = 0; obji < objs.length; obji++ ) {
						var obj = objs[ obji ];

						// Test for collision and act appropriately
						var collidee = bullet.collisionTest( obj );
						// If there was actually a collision with something,
						// destroy the thing and mark bullet for destruciton
						if ( collidee !== null ) {
							needDestroyBullet = true;
							// Destroy collidee, in DOM and in JS
							var elem = collidee.html;
							elem.parentNode.removeChild(elem);
							objs.splice( obji, 1 );
						}
					}  // end for ( obj )
				}  // end for ( objList )
			}  // end if ( exit )

			if ( needDestroyBullet ) {
				// Remove Bullet from DOM
				var elem = bullet.html;
				elem.parentNode.removeChild(elem);
				// Remove from js
				bulletList.splice( bulleti, 1 );

			}  // end if ( needDestroyBullet )
		}  // end for( bullet )
		// TODO: return collisions?
		return bulletList;
	};  // End updateBullets()



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
		var player_ = self.player;

		field.lastTimePlShot;
		player_.move( player_.direction );

		// =============
		// OTHERS
		// =============

		// ---- MOVEMENT ----
		// Pause between the moving of Others
		// Starts at about 1000
		var movePause 		= self.otherPauseModifier * Math.pow( self.numOthers, self.otherPauseExponent);
		var moveTimeDiff 	= currentTime - self.lastTimeAIMoved;

		if ( moveTimeDiff > movePause ) {
			// This will move each row, delaying between each
			self.triggerRowMovement( self.html );
			// FOR NEXT LOOP
			self.lastTimeAIMoved = currentTime;
		}

		// ---- ATTACKING ----
		var othersGrid_		= self.othersGrid;
		var shootTimeDiff 	= currentTime - self.lastTimeAIShot;
		// TODO: set timeout for random length pausing between each attack
		// Fix this later to be own grid
		var randomWait 		= Math.pow( movePause, 2 ) * Math.random();
		var cappedWait 		= Math.max( 3000, randomWait );

		if ( self.hostile && (shootTimeDiff > cappedWait) ) {
			self.attack( othersGrid_ );
			// FOR NEXT LOOP
			self.lastTimeAIShot = currentTime;
		}

		self.updateBullets( self.player.bulletList, [ othersGrid_[0], othersGrid_[1], othersGrid_[2], othersGrid_[3], othersGrid_[4] ] );
		self.updateBullets( self.othersBulletList, [ [self.player] ] );

		// Game Over if all Others are dead
		var allGone = false;
		// If any row is not empty, allGone = true;
		if ( allGone ) { gameOver = true };

		// ============
		// FOR NEXT LOOP
		// ============
		// Taken care of by currentTime passed in
		// self.newTime = Date.now()

		return self.gameOver;
	};  // End Field.update()

	// ================
	// CREATE OWN VALUES/PROPERTIES
	// ================
	field.buildHTML();
	// rowMap is temporary, it can't be in here...
	field.othersGrid = field.buildObjectGrid( Other, othersTypes );
	field.addObjects();
	field.appendChildren();

	// ===========
	// END
	// ===========

	return field;

};  // End Field()
