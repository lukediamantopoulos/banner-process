(function(){
  
  window.fitText = function( el, options ) {

    // Using ratio -- more performant
    function reduceFontSize( el ) {
      var fontSize = parseInt( window.getComputedStyle(el).fontSize, 10 );
      var ratio = el.offsetWidth / el.scrollWidth ;
      var newFontSize = fontSize * ratio;
      el.style.fontSize = --newFontSize + 'px';
    }

    // If there are multiple elements, cycle over them and apply the function
    if ( el.length ) {
      var els = el.map( text => reduceFontSize( text ));
    } else {
      reduceFontSize( el );
    }

    // Using recursion -- more accurate
    // function reduceFontSize( el ) {
    //   var fontSize = parseInt(window.getComputedStyle(el).fontSize, 10);
    //   if ( el.scrollWidth > el.offsetWidth ) {
    //   el.style.fontSize = --newFontSize + 'px';
    //     reduceFontSize(el);
    //   } 
    // }

    return el;
  };
})();
