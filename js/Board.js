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
	board.stats			= null;
	board.field			= null;

	board.width			= 35;
	board.height			= 30;
	// field:
	// width: 100%;
	// height: 25rem; ( 25/30 = 10/12 = 83.3333% of board height) 30 * (10/12)
	// 
	// 

	// TODO: Should this be global? Or maybe in StatsDisplay?
	board.startTime 		= Date.now();
	board.currentTime		= board.startTime;
	// board.oldTimeAIAttack	= board.startTime;
	// board.oldTimeAIMove		= board.startTime;
	// board.oldTimePlayerShot	= board.startTime;


	// =============
	// SETUP FUNCTIONS
	// =============
	board.buildHTML = function () {
	/*

	*/
		var self = this;
		var html = document.createElement( "div" );
		html.className = "game-container";

		self.stats = StatsDisplay( html );
		var stats_ = self.stats
		stats_.init();

		html.appendChild( stats_.topbar );
		// append field
		// append sidebar
		html.appendChild( stats_.bottombar );



		self.html = html;
		return self;

	};  // end Board.buildHTML()


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
			var gameOver = field_.update( currentTime_ );

			// stats.updateStat( "mysterious", field.mysteriousDeadCount );
			// stats.updateStat( "other1"	, field.other1DeadCount );
			// stats.updateStat( "other2"	, field.other2DeadCount );
			// stats.updateStat( "other3"	, field.other3DeadCount );
			// stats.updateStat( "lives"		, field.livesCount );
			// stats.updateStat( "shots"		, field.shotsCount );
			// stats.updateStat( "hits"		, field.hitsCount );
			// stats.updateStat( "travelDist", field.travelDistCount );
			// TODO: in StatsDisplay?
			stats_.updateStat( "elapsedTime", elapsedTime );

			// Only end game after everything's been updated
			if ( gameOver ) { self.endGame; }

			// ===========
			// LOOP
			// ===========
			self.currentTime = Date.now();

			requestAnimationFrame( self.update );

		}  // end if( gameOver )

	};  // end Board.update()


	board.init = function () {
	/*

	*/
		var self = this;

		self.buildHTML( self.id );
		// var selfHTML = self.html;


		document.body.appendChild( self.html );
		return self;

	};  // end Board.init()


	// =============
	// END
	// =============
	return board;

};  // end Board()