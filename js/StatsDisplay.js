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
	stats._shots		= null;
	stats._hits			= null;
	stats._lives		= null;
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

		self._time = timeValNode

		return timer;

	};  // end StatsDisplay._buildTimer)


	stats._buildHTML = function () {
	/* ->

	*/
		var self = this;

		var topbar 			= document.createElement( "div" );
		topbar.className 	= "topbar";

		var mysterious 		= self._buildKillCount( othersTypes["x"] );
		var other1 			= self._buildKillCount( othersTypes["1"] );
		var other2 			= self._buildKillCount( othersTypes["2"] );
		var other3 			= self._buildKillCount( othersTypes["3"] );
		var timer 			= self._buildTimer();

		topbar.appendChild( mysterious );
		topbar.appendChild( other1 );
		topbar.appendChild( other2 );
		topbar.appendChild( other3 );
		topbar.appendChild( timer );

		var bottombar 		= document.createElement( "div" );
		bottombar.className = "bottombar";

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

