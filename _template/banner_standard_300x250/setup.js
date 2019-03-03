// Set up name space for creative.
var creative = {};
var els;

// Helpers
var gE = function(e) { return document.getElementById(e) };
var qS = function(e) { return document.querySelector(e) };
var qSa = function(e) { return [].slice.call( document.querySelectorAll(e) ) };

// Calls on page load
creative.init = function() {
	creative.cacheDOM();
	creative.build();
	creative.activate();
	creative.createTimeline();
	creative.listeners();
};

creative.activate = function() {
	TweenMax.to( els.content, 0.6, { opacity: 1 });
};

creative.listeners = function() {
	
	// Click through
	els.content.addEventListener('click', creative.clickThrough);

	// Replay
	creative.replay.element.addEventListener('click', creative.replay.restart);
	creative.replay.element.addEventListener('mouseover', creative.replay.windUp);
	creative.replay.element.addEventListener('mouseout', creative.replay.windDown);
};

creative.clickThrough = function() {
	window.open(window.clickTag);
}

creative.cacheDOM = function() {
	creative.elements = {};
	els = creative.elements;

	els.root = gE('ad');
	els.content = qS('.content');
	els.logo = qS('#logo');

	creative.replay = {
		element: gE('replay')
	}
}

creative.build = function() {

	creative.specs = {
		height: els.root.offsetHeight,
		width: els.root.offsetWidth
	}

	creative.meta = {}; // Fetch meta tag to compare to ad dimensions
	creative.meta.tag = qS('meta[name="ad.size"]');
	creative.meta.width = parseInt(creative.meta.tag.getAttribute('content').split(',')[0].split('=')[1]);
	creative.meta.height = parseInt(creative.meta.tag.getAttribute('content').split(',')[1].split('=')[1]);

	// Replay functionality
	creative.replay.show = function() {
		TweenMax.set( creative.replay.element, { display: 'inherit', pointerEvents: 'auto' });
		TweenMax.fromTo( creative.replay.element, 0.5, { x: 2, opacity: 0}, { x: 0, opacity: 1, rotation: 0, ease: Sine.easeOut });
	}
	creative.replay.restart = function() {
		TweenMax.set( creative.replay.element, { display: 'none' });
		creative.tl.restart();
	}
	creative.replay.windUp = function() {
		TweenMax.to( creative.replay.element, 0.5, { rotation: 360, ease: Sine.easeOut });
	}
	creative.replay.windDown = function() {
		TweenMax.to( creative.replay.element, 0.5, { rotation: 0, ease: Sine.easeOut });
	}
}

creative.createTimeline = function() {
	creative.tl = new TimelineMax({ onComplete: creative.replay.show })

		.add('f1', .5)
		.to('h1', .75, { y: -50, ease: Expo.easeOut}, 'f1')
		.to('h1', 1, { y: creative.specs.height, ease: Sine.easeIn})

};

creative.QA = function() {
	var specs = {
		width: creative.specs.width,
		height: creative.specs.height,
		meta_width: creative.meta.width,
		meta_height: creative.meta.height,
		meta_matches: creative.specs.width === creative.meta.width && creative.specs.height === creative.meta.height ? matches = true : matches = false,
		duration: creative.tl.duration(),
		total: creative.tl.totalDuration()
	};
	console.table(specs);
};

window.addEventListener('load', creative.init.bind(creative));