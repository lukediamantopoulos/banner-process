// Set up name space for creative.
var creative = {};
var gE = function(e){return document.getElementById(e)};
var gC = function(e){return document.getElementsByClassName(e)[0]};
var qS = function(e){return document.querySelector(e)};

// Calls on page load
creative.init = function() {
	creative.build();
	creative.activate();
	creative.createTimeline();
	creative.listeners();

	if ( developerMode ) creative.QA();
};

creative.activate = function() {
	TweenMax.to( creative.elements.content, 0.6, { opacity: 1 });
};

creative.listeners = function() {
	creative.elements.content.addEventListener('click', creative.clickThrough);
	creative.replay.element.addEventListener('click', creative.replay.restart);
	creative.replay.element.addEventListener('mouseover', creative.replay.windUp);
	creative.replay.element.addEventListener('mouseout', creative.replay.windDown);
};

creative.clickThrough = function() {
	window.open(window.clickTag);
}

creative.build = function() {
	
	// Ad parts
	creative.elements = {};
  	creative.elements.ad = gC('ad') || gE('ad');
	creative.elements.content = gC('content');

	// Frames
	creative.elements.team_1 = {};
	creative.elements.team_2 = {};
	creative.elements.general = {};

	// Team 1
	creative.elements.team_1.frame = qS('#team_1');
	creative.elements.team_1.mask = qS('#team_1 .mask');
	creative.elements.team_1.badge = gE('#team_1 .badge');
	creative.elements.team_1.bg = qS('#team_1 .background');
	creative.elements.team_1.name = gE('#team_1 .name');
	creative.elements.team_1.slice = qS('#team_1 .slice');

	// Team 2
	creative.elements.team_2.frame = qS('#team_2');
	creative.elements.team_2.mask = qS('#team_2 .mask');
	creative.elements.team_2.badge = gE('#team_2 .badge');
	creative.elements.team_2.bg = qS('#team_2 .background');
	creative.elements.team_2.name = gE('#team_2 .name');
	creative.elements.team_2.slice = qS('#team_2 .slice');

	// General
	creative.elements.general.frame = qS('#general');
	creative.elements.general.mask = qS('#general .mask');
	creative.elements.general.team_1_name = gE('general_gameInfo_team_1');
	creative.elements.general.team_2_name = gE('general_gameInfo_team_2');
	creative.elements.general.date = gE('general_date');
	creative.elements.general.cta = gE('general_cta');
	creative.elements.general.logo_1 = qS('#logo_DAZN .mask');
	creative.elements.general.logo_2 = qS('#logo_gamepass .mask');
	creative.elements.general.slice = qS('#general .slice');

	// Replay
	creative.replay = {};
	creative.replay.element = gE('replay');

	creative.replay.show = function() {
		TweenMax.set( creative.replay.element, { display: 'inherit' });
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

	creative.height = creative.elements.ad.offsetHeight;
	creative.width = creative.elements.ad.offsetWidth;

	creative.meta = {};
	creative.meta.tag = qS('meta[name="ad.size"]');
	creative.meta.width = parseInt(creative.meta.tag.getAttribute('content').split(',')[0].split('=')[1]);
	creative.meta.height = parseInt(creative.meta.tag.getAttribute('content').split(',')[1].split('=')[1]);
}

creative.createTimeline = function() {

	creative.tl = new TimelineMax({ repeat: 4, onComplete: creative.replay.show })

		.add('f1')
		.set( [creative.elements.team_1.frame, creative.elements.general.logo_1], { opacity: 1})
		.to( creative.elements.general.logo_1, .75, { width: '100%', ease: Sine.easeInOut }, 'f1')
		.to( creative.elements.team_1.frame, .65, { width: '100%', ease: Sine.easeInOut }, '-=.25')
		.to( creative.elements.team_1.mask, .65, { width: '100%', ease: Sine.easeInOut })

		.add('f2', '+=1.5')
		.set( creative.elements.team_2.frame, { opacity: 1 })
		.to( creative.elements.team_2.frame, .65, { width: '100%', ease: Sine.easeInOut }, 'f2')
		.to( creative.elements.team_2.mask, .5, { width: '100%', ease: Sine.easeInOut })

		.add('f3', '+=1.5')
		.set( creative.elements.general.frame, { opacity: 1 })
		.to( creative.elements.general.frame, .65, { width: '100%', ease: Sine.easeInOut }, 'f3')
		.to( creative.elements.general.logo_2, .65, { width: '220px', ease: Sine.easeInOut }, '-=.25');
};

creative.QA = function() {
	var specs = {
		width: creative.width,
		height: creative.height,
		meta_width: creative.meta.width,
		meta_height: creative.meta.height,
		meta_matches: creative.width === creative.meta.width && creative.height === creative.meta.height ? matches = true : matches = false,
		duration: creative.tl.duration(),
		total: creative.tl.totalDuration()
	};
	console.table(specs);
};

window.addEventListener('load', creative.init.bind(creative));


