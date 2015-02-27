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

		self.gameOver = false;

		// End screen

		return self;

	};  // end Board.endGame()


	board.update = function () {
	/*

	*/
		var self = this;

		var field_ 		 = self.field;
		var stats_ 		 = self.stats;
		var currentTime_ = self.currentTime;

		var elapsedTime  = currentTime_ - self.startTime;

		if ( !self.gameOver ) {

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

			// ===========
			// LOOP
			// ===========
			self.currentTime = Date.now();

			requestAnimationFrame( self.update.bind( self ) );

		}  // end if( !gameOver )
	};  // end Board.update()


	board.init = function () {
	/*

	*/
		var self = this;

		self.buildHTML( self.id );
		self.addObjects();
		self.appendChildren();
		// var selfHTML = self.html;

		document.body.appendChild( self.html );
		return self;

	};  // end Board.init()


	// =============
	// END
	// =============
	return board;

};  // end Board()