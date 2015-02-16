/* Created 02/15/15 */

'use strict'

// Other things
var rowHeight = 2;

// Types of Others and their properties
var othersObjs = {
	1: {
		_points: 10,
		_classes: "object other1"
	},

	2: {
		_points: 20,
		_classes: "object other2"
	},

	3: {
		_points: 30,
		_classes: "object other3"
	}
};  // end othersObjs{}

// Other Obj
// ( JS Obj ) -> Other
var Other = function ( type, left ) {

	var self = {};

	self._classes    =     type._classes;
	self._html 		 =				null;

	self._points 	 =		type._points;
	self._killed 	 =			   false;

	self._left   	 =				left;
	self._top   	 =  			   0;
	self._id     	 = 				null;


	// =============
	// FUNCTIONS
	// =============
	self._buildHTML  = function () {
		var self = this;

		var html 		= document.createElement("div");
		html.className 	= self._classes;
		html.style.left = self._left;

		self._html 		= html;

		return self;
	};  // end other.buildHTML()


	self._updateLeft = function ( left ) {

		self._html.style.left = left;

		return self;
	};  // end other._updateLeft()


	self._die = function () {}; // end other._die()

	self._shoot = function () {}; // end other._shoot()

	return self;

};  // end other{}
