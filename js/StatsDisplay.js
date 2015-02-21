/* Created 02/20/15 */

'use strict'

var StatsDisplay = function ( parent ) {
/*

Stats to be displayed to player as they play the game
*/

	var stats = {};

	stats._parent 		= parent;
	stats._topbar		= null;
	stats._bottombar	= null;
	stats._sidebar		= null;

	// All the numbers and counts, etc. that will need to be updated
	stats._mysterious	= null;
	stats._other1		= null;
	stats._other2		= null;
	stats._other3		= null;
	stats._elapsedTime	= null;

	stats._lives		= null;
	stats._shots		= null;
	stats._hits			= null;
	
	stats._travelDist	= null;


	stats._buildKillCount = function ( type ) {
	/* ( {} ) -> DOM obj

	Builds a kill counter div for the right type to go in
	the bar
	*/
		var self = this;

		var outerClassNames	= 'stat kill-count ' + type._class;
		var iconClassNames	= 'object ' + type._class
		// -------
		var outer			= document.createElement( "div" );
		outer.className		= outerClassNames;
		// -------
		var icon			= document.createElement( "div" );
		icon.className		= iconClassNames;
		// -------
		var exOut			= document.createElement( "div" );
		exOut.className		= 'dead-x';
		// Temporary
		var xNode 			= document.createTextNode( 'X' );
		exOut.appendChild( xNode );
		// -------
		var countArea		= document.createElement( "div" );
		countArea.className	= 'dead-count';
		var countNode 		= document.createTextNode( '0' );
		countArea.appendChild( countNode );

		// -------
		icon.appendChild( exOut );
		icon.appendChild( exOut );
		outer.appendChild( icon );
		outer.appendChild( countArea );

		var propName = "_" + type._class;

		self[ propName ] = countNode;
// debugger;
		return outer;

	};  // end StatsDisplay._buildKillCount()


	stats._buildTimer = function () {
	/* ->

	*/
		var self = this;

		var timer			= document.createElement( "div" );
		var timeTextNode	= document.createTextNode( "Time: " );
		// -------
		var timeValSpan		= document.createElement( "span" );
		var startTime		= Util._msToMMSS( 0 );
		var timeValNode 	= document.createTextNode( startTime );
		timeValSpan.appendChild( timeValNode );


		timer.appendChild( timeTextNode );
		timer.appendChild( timeValSpan );

		self._time = timeValNode;

		return timer;

	};  // end StatsDisplay._buildTimer)


	stats._buildHTML = function () {
	/* ->

	*/
		var self = this;

		// ===========
		// TOPBAR
		// ===========
		var topbar 			= document.createElement( "section" );
		topbar.className 	= "topbar";

		var timer 			= self._buildTimer();

		var deathRow		= document.createElement( "div" );
		deathRow.className 	= "death-row";
		var mysterious 		= self._buildKillCount( othersTypes["x"] );
		var other1 			= self._buildKillCount( othersTypes["1"] );
		var other2 			= self._buildKillCount( othersTypes["2"] );
		var other3 			= self._buildKillCount( othersTypes["3"] );

		deathRow.appendChild( mysterious );
		deathRow.appendChild( other1 );
		deathRow.appendChild( other2 );
		deathRow.appendChild( other3 );

		topbar.appendChild( timer );
		topbar.appendChild( deathRow );
		// self._whatever has been taken care of in individual functions

		// ===========
		// BOTTOMBAR
		// ===========
		var bottombar 		= document.createElement( "section" );
		bottombar.className = "bottombar";

		// --- lives ---
		var lives 			= document.createElement( "div" );
		lives.className 	= 'stat lives';
		var livesText		= document.createTextNode( 'Lives: ' );
		// Might be images in the end. No text. Or both.
		var livesCount 		= document.createElement( "span" );
		var livesCountTxt	= document.createTextNode( '3' );
		livesCount.appendChild( livesCountTxt );

		lives.appendChild( livesText );
		lives.appendChild( livesCount );

		// --- bullet things ---
		var bulletStats 	= document.createElement( "div" );
		bulletStats.className = 'bullet-stats';

		// - shots -
		var shots 			= document.createElement( "div" );
		shots.className 	= 'stat shots';
		var shotsText		= document.createTextNode( 'Shots: ' );

		var shotsCount 		= document.createElement( "span" );
		// TODO: Make contingency for >999 (DEATH/DESTROYER)
		var shotsCountTxt	= document.createTextNode( '000' );  // add 0's onto beginning
		shotsCount.appendChild( shotsCountTxt );

		shots.appendChild( shotsText );
		shots.appendChild( shotsCount );

		// - hits -
		var hits 			= document.createElement( "div" );
		hits.className 	= 'stat hits';
		var hitsText		= document.createTextNode( 'Hits: ' );

		var hitsCount 		= document.createElement( "span" );
		var hitsCountTxt	= document.createTextNode( '00' );  // add 0's onto beginning
		hitsCount.appendChild( hitsCountTxt );

		hits.appendChild( hitsText );
		hits.appendChild( hitsCount );

		bulletStats.appendChild( shots );
		bulletStats.appendChild( hits );

		// --- all three ---
		bottombar.appendChild( lives );
		bottombar.appendChild( bulletStats );

		self._lives		= livesCountTxt;
		self._shots		= shotsCountTxt;
		self._hits		= hitsCountTxt;

		// ===========
		// SIDEBAR
		// ===========
		var sidebar 		= document.createElement( "div" );
		sidebar.className 	= "sidebar";

		// All appending goes in game container obj?
		self._topbar 		= topbar;
		self._bottombar 	= bottombar;
		self._sidebar 		= sidebar;

		return self;

	};  // end StatsDisplay._buildHTML()


	stats._update = function () {
	/* ->

	*/
		var self = this;

		self._updateTime( Date.now() );

		// node.nodeValue = "";

	};  // end StatsDisplay._update()


	stats._buildHTML();

	return stats;
}; 

