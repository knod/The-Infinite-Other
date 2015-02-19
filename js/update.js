/* Created 02/16/15

RESOURCES:

*/

'use strict'

// Gives ability to create pauses between movement of Others
var oldTime = Date.now();
var newTime = Date.now();

var otherSpeedModifier 	= 2;
var otherMovePause 		= 1000;


var update = function () {
/* ( none ) -> None

Loop to update the whole game
*/
	
	// ===================
	// PLAYER MOVEMENT
	// ===================
	for ( var playeri = 0; playeri < playerList.length; playeri++ ) {

		var player = playerList[ playeri ];
		player._move( player._direction );

	}  // end for( player )

	// ===================
	// BULLETS
	// ===================
	// TODO: Do collisions in one place and movement in another place?
	var updateBullets = function ( bulletList, objLists ) {
	/* ( [], [[{}]] ) -> 

	Moves bullets in the bulletList, destroys them if they git a wall or
	collide with something, destroyes anything they collide with
	*/
		for ( var bulleti = 0; bulleti < bulletList.length; bulleti++ ) {

			var bullet = bulletList[ bulleti ];
			bullet._move( bullet._direction );

			// Will we need to destroy the bullet?
			var needDestroy = false;
			var collidee = null;

			// check for collision with parent
			var exitee = bullet._goingOutOfBounds( bullet._parent );
			if ( exitee !== null ) {
				needDestroy = true; 

			// If parent doesn't destroy, check for other collisions
			} else {

				for ( var objListi = 0; objListi < objLists.length; objListi++ ) {
					var objs = objLists[ objListi ];

					for ( var obji = 0; obji < objs.length; obji++ ) {
						var obj = objs[ obji ];

						// Test for collision and act appropriately
						var collidee = bullet._collisionTest( obj );
						// If there was actually a collision with something,
						// destroy the thing and mark bullet for destruciton
						if ( collidee !== null ) {
							needDestroy = true;
							// Destroy collidee, in DOM and in JS
							var elem = collidee._html;
							elem.parentNode.removeChild(elem);
							objs.splice( obji, 1 );
						}
					}  // end for ( obj )
				}  // end for ( objList )
			}  // end if ( exit )

			if ( needDestroy ) {
				// Remove Bullet from DOM
				var elem = bullet._html;
				elem.parentNode.removeChild(elem);
				// Remove from js
				bulletList.splice( bulleti, 1 );

			}  // end if ( needDestroy )

		}  // end for( playerBullet )

		// TODO: return collisions?
		return bulletList;
	};  // End updateBullets()

	updateBullets( playerBulletList, [othersList] );

	// ===================
	// OTHER MOVEMENT
	// ===================
	// Final speed of Others based on number of others left

	// Number of others in this game container (need to make dynamic
	// with function). Currently 55 (02/17/15)
	var gameCont = document.getElementsByClassName("game-container")[0];
	var numOthers = gameCont
		.getElementsByClassName("other")
		.length
	;

	// Pause between the moving of others
	// Starts at about 1000
	otherMovePause = otherSpeedModifier * Math.pow(numOthers, 1.55);
	var timeDiff = newTime - oldTime;

	if ( timeDiff > otherMovePause ) {
		// This will move each row, delaying between each
		triggerRowMovement( gameCont );
		// FOR NEXT LOOP
		oldTime = newTime;
	}

	// ====================
	// FOR NEXT LOOP
	// ====================
	newTime = Date.now();

	requestAnimationFrame( update );

};  // end update()
