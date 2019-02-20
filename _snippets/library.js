
// **************************************************************
// RETINA ELEMENTS 
// When an ad is made retina, some elements will either lose a pixel or gain a pixel depending on their position on screen
// and this will result in some images getting cropped.
// This function will add a pixel border around the sprite within the containing element
// **************************************************************

var els = [ logo, h1, tv_side ]; // List your elements that will be displayed in retina in an iterable of some sort
var is2x = true; // Declare a variable to decide if your ad is Retina

function adjustRetina( element ) {

	var container = element; // Element being called
	var img = container.querySelector('img'); // Spritesheet within the element
	var nWidth = element.offsetWidth + 2; // Expand container element
	var nHeight = element.offsetHeight + 2; // Expand container element
	var nTop = img.offsetTop + 1; // Move the spritesheet accordingly
	var nLeft = img.offsetLeft + 1; // Move the spritesheet accordingly

	TweenMax.set( container, { width: nWidth, height: nHeight } ) // Move Container
	TweenMax.set( img, { top: nTop, left: nLeft } ) // Move Container
}

if ( is2x ) { // If the ad is Retina 
	for (var i = 0; i < els.length; i++) {
		adjustRetina(els[i]); // Run the retina function on the following elements
	}
}

// **************************************************************
// TRANSFORM 
// Function takes the first element and finds the 
// difference via placement and size
// **************************************************************

function transform( start, finish ) {

	var startRect = start.getBoundingClientRect(); // small
	var finishRect = finish.getBoundingClientRect(); // big

	var startCoords = {
		x: startRect.left,
		y: startRect.top,
		w: startRect.width
	}

	var finishCoords = {
		x: finishRect.left,
		y: finishRect.top,
		w: finishRect.width
	}
	
	var xDiff = startCoords.x - finishCoords.x;
	var yDiff = startCoords.y - finishCoords.y;
	var sDiff = (startCoords.w / finishCoords.w);

	return {
		xDiff: xDiff,
		yDiff: yDiff,
		sDiff: sDiff
	}
}

var xDiff = transform(smallPhone, bigPhone).xDiff;
var yDiff = transform(smallPhone, bigPhone).yDiff;
var sDiff = transform(smallPhone, bigPhone).sDiff;

// **************************************************************
// SEARCH within an elements node
// The first argument will be the node you want to search through
// The second argument will be the element you are searching for
// **************************************************************

var sFa = function( ref, search ) { return [].slice.call(ref.querySelectorAll(search))};

// **************************************************************
// WRAP ELEMENT IN DIV
// Function that accepts an array and wraps them in  
// a div with a matching class name
// **************************************************************

function makeBoxes(e){
	var divs = [];
	var newKids = [];
	 for ( var i in e ) {
		var div = document.createElement("div");
		div.className="adElement " + e[0].className.split(' ')[1] + "Boxes";
		creative.elements.content.insertBefore(div, creative.elements.bg);
		var base = e[i];
		specs = {l:base.offsetLeft,t:base.offsetTop,w:base.offsetWidth,h:base.offsetHeight}
		TweenMax.set(div, {left:specs.l, top:specs.t, width:specs.w,height:specs.h+1, zIndex:2})
		rootC = div;

		oldChild = e[i].cloneNode(true);
		e[i].parentNode.removeChild(e[i]);
		rootC.appendChild(oldChild);
		TweenMax.set(oldChild,{left:0,top:0})
		newKids.push(oldChild)
		divs.push(div);
		if ( i == base.length - 1 ){
			e = newKids;
		}
	 }
	 return divs;
}


// How to use
creative.elements.h1s = sFa(creative.elements.root, '.frame1');
creative.elements.h1s_masks = creative.elements.h1s.map( function(el) {
	return makeBoxes([el]);
});

// **************************************************************
// Detect IE
// **************************************************************

function isIE() {
  ua = navigator.userAgent;
  /* MSIE used to detect old browsers and Trident used to newer ones*/
  var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1 || ua.indexOf('Edge/') > -1;
  
  return is_ie; 
}

// If it is IE, do this
if (isIE()) {};


// **************************************************************
// Move off screen
// This will take the element, the offset distance of how much farther 
// you want the element to move off screen, and the direction, then 
// give you the distance the given element needs to move off screen
// **************************************************************

distOffscreen = function( el, direction, buffer ) {
	buffer = buffer | 0;

	switch ( direction.toLowerCase() ) {
		case 'left':
			return -(el.offsetLeft + el.offsetWidth) + buffer;
		break;

		case 'right':
			return (el.offsetWidth - el.offsetLeft) + buffer;
		break;
	}
};

distOtherSide = function( el, direction, buffer ) {
	buffer = buffer | 0;

	switch ( direction.toLowerCase() ) {
		case 'left':
			return (el.offsetWidth - creative.specs.width) + buffer;
		break;

		case 'right':
			return -(el.offsetWidth - creative.specs.width) + buffer;
		break;
	}
} 
	