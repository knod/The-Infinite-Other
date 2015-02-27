/* Created 02/23/15 

Has:
Field

Stats Display:
	score
	time
	aiHitCount (same as hits)
	aiHitsObj (containing the hits on each ai)
	progressBar
	shotsFired

end condition checks
gameOver
gameOverCheck
update()

*/

'use strict'

var Board = function ( id ) {
/* ( int ) -> Board

*/
	var board = {};

	// =============
	// SETUP VARS
	// =============
	board.gameOver			= false;

	board.id 				= id;
	board.html				= null;
	board.stats				= null;
	board.field 			= null;

	board.width				= 35;
	board.height			= 30;

	// TODO: Should this be global? Or maybe in StatsDisplay?
	board.startTime 		= Date.now();
	board.currentTime		= board.startTime;
	// should be true to start in future
	board.paused			= false;
	board.startingPause 	= false;
	// board.needEndPause		= false;
	board.elapsedPause		= 0;
	board.oldPauseTime		= 0;
	// board.pauseEndTime		= 0;

	// board.oldTimeAIAttack	= board.startTime;
	// board.oldTimeAIMove		= board.startTime;
	// board.oldTimePlayerShot	= board.startTime;

	// Row width?
	// self width?
	// field width?

	// =============
	// SETUP FUNCTIONS
	// =============
	board.buildHTML = function () {
	/*

	*/
		var self = this;

		var html 		= document.createElement( "div" );
		html.className 	= "game-container";
		html.id			= self.id;

		self.html 	= html;

		return self;
	};  // end Board.buildHTML()


	board.addObjects = function () {
	/*

	*/
		var self = this;

		var stats 	= StatsDisplay( self.html );
		var field 	= Field( 1, self.html );

		stats.init();

		self.stats 	= stats;
		self.field 	= field;

		return self;
	};  // end Board.addObjects()


	board.appendChildren = function () {
	/*

	*/
		var self 		= this;
		var selfHTML_ 	= this.html;
		var stats_ 		= self.stats;

		selfHTML_.appendChild( stats_.topbar );
		selfHTML_.appendChild( self.field.html );
		// append sidebar
		selfHTML_.appendChild( stats_.bottombar );

		return self;
	};  // end Board.appendChildren()


	// =============
	// ONGOING
	// =============
	board.endGame = function ( condition ) {
	/*

	*/
		var self = this;

		self.gameOver = true;

		// End screen

		return self;

	};  // end Board.endGame()


	board.togglePause = function () {
	/*

	*/
		var self = this;

		if ( self.paused === true ) {
			self.paused = false;
		} else {
			self.paused = true;
		}

		return self;

	};  // end Board.togglePause()


	board.update = function () {
	/*

	*/
		var self = this;

		if ( !self.paused && !self.gameOver ) {
			self.startingPause = false;

			// if ( self.needEndPause === true ) {
			// 	self.pauseEndTime = Date.now();
			// 	self.needEndPause = false;
			// }

			var field_ 		 = self.field;
			var stats_ 		 = self.stats;
			var currentTime_ = self.currentTime;

			var elapsedTime  = currentTime_ - self.startTime;

			// field checks for end conditions?
			self.gameOver = field_.update( currentTime_ );

			stats_.updateStat( "mysterious"	, field_.mysteriousDeadCount );
			stats_.updateStat( "other1"		, field_.other1DeadCount );
			stats_.updateStat( "other2"		, field_.other2DeadCount );
			stats_.updateStat( "other3"		, field_.other3DeadCount );

			stats_.updateStat( "lives"		, field_.livesCount );
			stats_.updateStat( "shots"		, field_.shotsCount );
			stats_.updateStat( "hits"		, field_.hitsCount );
			// stats_.updateStat( "travelDist", field_.travelDistCount );
			// TODO: in StatsDisplay?
			stats_.updateStat( "elapsedTime", elapsedTime );

			// Only end game after everything's been updated
			if ( self.gameOver ) { self.endGame; }

		}  // end if( !gameOver )

		if ( self.paused ) {

			// Just keep adding up the time
			self.elapsedPause += Date.now() - self.oldPauseTime;
			self.oldPauseTime = Date.now();
			// For test, add a div with this id into the DOM
			// document.getElementById("pause").innerHTML = self.elapsedPause;

		}

			// ===========
			// LOOP (always want to loop, to do/sense other things, be able to start again, etc)
			// ===========
			// Using Date.now() means the time keeps going even when the game is paused.
			self.currentTime = Date.now() - self.elapsedPause;
			// Prepares to time pause, but doesn't do anything with it unless game is paused
			self.oldPauseTime = Date.now();

			requestAnimationFrame( self.update.bind( self ) );
	};  // end Board.update()


	board.init = function () {
	/*

	*/
		var self = this;

		self.buildHTML( self.id );
		self.addObjects();
		self.appendChildren();
		// var selfHTML = self.html;

		self.keypress = new window.keypress.Listener();
		self.keypress.register_combo({
		    "keys"              : "esc",
		    "on_keydown"        : self.togglePause,
		    "this"              : self,
		    "prevent_default"   : true,
		});


		document.body.appendChild( self.html );
		return self;

	};  // end Board.init()


	// =============
	// END
	// =============
	return board;

};  // end Board()