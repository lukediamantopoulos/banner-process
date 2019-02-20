// Set up name space for creative.
var creative = {};
var gE = function(e){return document.getElementById(e)};
var gC = function(e){return document.getElementsByClassName(e)[0]};
var qS = function(e){return document.querySelector(e)};

creative.initEB = function() {
	if (!EB.isInitialized()){
		EB.addEventListener(EBG.EventName.EB_INITIALIZED, creative.init);
	} else {
		creative.init();
	}
}

// Calls on page load
creative.init = function() {
	creative.build();
	creative.activate();
	creative.createTimeline();
	creative.listeners();
};

creative.activate = function() {
	TweenMax.to( creative.content, 0.6, { opacity: 1 });
};

creative.listeners = function() {
	creative.content.addEventListener('click', creative.clickThrough);
	creative.replay.element.addEventListener('click', creative.replay.restart);
	creative.replay.element.addEventListener('mouseover', creative.replay.windUp);
	creative.replay.element.addEventListener('mouseout', creative.replay.windDown);
};

creative.clickThrough = function() {
	window.open(window.clickTag);
}

creative.build = function() {
	creative.element = gC('ad') || gE('ad');
	creative.content = gC('content');
	creative.replay = {};
	creative.replay.element = gE('replay');

	creative.replay.show = function() {
		TweenMax.set( creative.replay.element, { display: 'inherit', pointerEvents: 'auto' });
		TweenMax.fromTo( creative.replay.element, 0.5, { x: 2, opacity: 0}, { x: 0, opacity: 1, rotation: 0, ease: Sine.easeOut });
	}
	creative.replay.restart = function() {
		TweenMax.set( creative.replay.element, { display: 'inherit' });
		creative.tl.restart();
	}
	creative.replay.windUp = function() {
		TweenMax.to( creative.replay.element, 0.5, { rotation: 360, ease: Sine.easeOut });
	}
	creative.replay.windDown = function() {
		TweenMax.to( creative.replay.element, 0.5, { rotation: 0, ease: Sine.easeOut });
	}

	creative.height = creative.element.offsetHeight;
	creative.width = creative.element.offsetWidth;

	creative.meta = {};
	creative.meta.tag = qS('meta[name="ad.size"]');
	creative.meta.width = parseInt(creative.meta.tag.getAttribute('content').split(',')[0].split('=')[1]);
	creative.meta.height = parseInt(creative.meta.tag.getAttribute('content').split(',')[1].split('=')[1]);

	// Elements
	creative.logo = gE('logo');
}

creative.createTimeline = function() {
	creative.tl = new TimelineMax({ onComplete: creative.replay.show })
		.add('f1')
		.from(creative.logo, 2.5, { opacity: 0, y: creative.height/10, ease: Sine.easeInOut });
}

window.addEventListener('load', creative.initEB);