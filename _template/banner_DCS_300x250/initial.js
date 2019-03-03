// Setup namespace for ad.
var creative = {};
var gE = function(e){return document.getElementById(e)};
var gC = function(e){return document.getElementsByClassName(e)[0]};
var qS = function(e){return document.querySelector(e)};

creative.init = function () {
  creative.build();

  // Check if Enabler is initialized.
  if (Enabler.isInitialized()) {
    // Check if ad is visible to user.
    if (Enabler.isVisible()) {
      creative.enablerInitHandler();
    } else {
      Enabler.addEventListener(studio.events.StudioEvent.VISIBLE,
        creative.enablerInitHandler);
    }
  } else {
    Enabler.addEventListener(studio.events.StudioEvent.INIT,
        creative.enablerInitHandler);
  }
};

creative.build = function () {

  // Specs
  creative.element = gC('ad') || gE('ad');
  creative.content = gC('content');
  creative.clickTag = 'http://www.google.com';

  // Elements
  creative.elements = {};
  creative.elements.team_1 = {};
  creative.elements.team_2 = {};
  creative.elements.general = {};

  // Ad
  creative.elements.ad = document.getElementById('ad');

  // Team 1
  creative.elements.team_1.badge = document.getElementById('team_1_badge');
  creative.elements.team_1.bg = document.getElementById('team_1_bg');
  creative.elements.team_1.name = document.getElementById('team_1_name');
  creative.elements.team_1.slice = document.querySelector('#team_1 .slice');

  // Team 2
  creative.elements.team_2.badge = document.getElementById('team_2_badge');
  creative.elements.team_2.bg = document.getElementById('team_2_bg');
  creative.elements.team_2.name = document.getElementById('team_2_name');
  creative.elements.team_2.slice = document.querySelector('#team_2 .slice');

  // General
  creative.elements.general.team_1_name = document.getElementById('general_gameInfo_team_1');
  creative.elements.general.team_2_name = document.getElementById('general_gameInfo_team_2');
  creative.elements.general.bg = document.getElementById('ad-content');
  creative.elements.general.date = document.getElementById('general_date');
  creative.elements.general.cta = document.getElementById('general_cta');
  creative.elements.general.logo_1 = document.getElementById('logo_1');
  creative.elements.general.logo_2 = document.getElementById('logo_2');
  creative.elements.general.slice = document.querySelector('#general .slice');

  // Replay
  creative.elements.replay = document.getElementById('replay');

  creative.elements.replay.show = function() {
    TweenMax.set( replay, { display: 'inherit' });
    TweenMax.fromTo( replay, 0.5, { x: 2, opacity: 0}, { x: 0, opacity: 1, rotation: 0, ease: Sine.easeOut });
  }
  creative.elements.replay.restart = function() {
    creative.replay.element.style.display = "none";
    creative.tl.restart();
  }
  creative.elements.replay.windUp = function() {
    TweenMax.to( creative.replay.element, 0.5, { rotation: 360, ease: Sine.easeOut });
  }
  creative.elements.replay.windDown = function() {
    TweenMax.to( creative.replay.element, 0.5, { rotation: 0, ease: Sine.easeOut });
  }
};

creative.enablerInitHandler = function (event) {
  creative.dynamicDataAvailable();
  creative.elements.ad.addEventListener('click', creative.exitClickHandler);
  creative.showAd();

  if (Enabler.isPageLoaded()) {
    creative.pageLoadHandler();
  } else {
    Enabler.addEventListener(
      studio.events.StudioEvent.PAGE_LOADED, creative.pageLoadHandler);
  }
};

creative.dynamicDataAvailable = function () {
  // NOTE: Here starts the pasted section from Studio.
  Enabler.setProfileId(10155187);
  var devDynamicContent = {};

  devDynamicContent.feed= [{}];
  devDynamicContent.feed[0]._id = 0;
  devDynamicContent.feed[0].id = 1;
  devDynamicContent.feed[0].reporting_label = "sept_01_packers_bengals";
  devDynamicContent.feed[0].start_date = {};
  devDynamicContent.feed[0].start_date.RawValue = "";
  devDynamicContent.feed[0].start_date.UtcValue = 0;
  devDynamicContent.feed[0].end_date = {};
  devDynamicContent.feed[0].end_date.RawValue = "";
  devDynamicContent.feed[0].end_date.UtcValue = 0;
  devDynamicContent.feed[0].general_date = "sunday, 13.00est";
  devDynamicContent.feed[0].general_color = "f7ff1a";
  devDynamicContent.feed[0].general_color_bg = "0c161c";
  devDynamicContent.feed[0].general_logo_1 = {};
  devDynamicContent.feed[0].general_logo_1.Type = "file";
  devDynamicContent.feed[0].general_logo_1.Url = "https://s0.2mdn.net/ads/richmedia/studio/pv2/68764052/dirty/backup.jpeg";
  devDynamicContent.feed[0].general_logo_2 = {};
  devDynamicContent.feed[0].general_logo_2.Type = "file";
  devDynamicContent.feed[0].general_logo_2.Url = "https://s0.2mdn.net/ads/richmedia/studio/pv2/68764052/dirty/backup.jpeg";
  devDynamicContent.feed[0].general_cta_text = "Sign up now";
  devDynamicContent.feed[0].general_cta_color = "0c161c";
  devDynamicContent.feed[0].general_cta_color_bg = "f9fafa";
  devDynamicContent.feed[0].team_1_name = "Packers";
  devDynamicContent.feed[0].team_1_color = "06342d";
  devDynamicContent.feed[0].team_1_badge = {};
  devDynamicContent.feed[0].team_1_badge.Type = "file";
  devDynamicContent.feed[0].team_1_badge.Url = "https://s0.2mdn.net/ads/richmedia/studio/pv2/68764052/dirty/backup.jpeg";
  devDynamicContent.feed[0].team_1_bg = {};
  devDynamicContent.feed[0].team_1_bg.Type = "file";
  devDynamicContent.feed[0].team_1_bg.Url = "https://s0.2mdn.net/ads/richmedia/studio/pv2/68764052/dirty/backup.jpeg";
  devDynamicContent.feed[0].team_2_name = "Bengals";
  devDynamicContent.feed[0].team_2_color = "f0522c";
  devDynamicContent.feed[0].team_2_badge = {};
  devDynamicContent.feed[0].team_2_badge.Type = "file";
  devDynamicContent.feed[0].team_2_badge.Url = "https://s0.2mdn.net/ads/richmedia/studio/pv2/68764052/dirty/backup.jpeg";
  devDynamicContent.feed[0].team_2_bg = {};
  devDynamicContent.feed[0].team_2_bg.Type = "file";
  devDynamicContent.feed[0].team_2_bg.Url = "https://s0.2mdn.net/ads/richmedia/studio/pv2/68764052/dirty/backup.jpeg";
  devDynamicContent.feed[0].exit_url = {};
  devDynamicContent.feed[0].exit_url.Url = "http://www.google.com";
  devDynamicContent.feed[0].active = true;
  Enabler.setDevDynamicContent(devDynamicContent);

  // Transfer data to our elements
  creative.dynamicData = dynamicContent.feed[0];

  // Set Team 1
  creative.elements.team_1.badge.src = creative.dynamicData.team_1_badge.Url;
  creative.elements.team_1.bg.src = creative.dynamicData.team_1_bg.Url;
  creative.elements.team_1.name.innerHTML = creative.dynamicData.team_1_name;
  creative.elements.team_1.name.style.backgroundColor = creative.dynamicData.team_1_color;

  // Set Team 2
  creative.elements.team_2.badge.src = creative.dynamicData.team_2_badge.Url;
  creative.elements.team_2.bg.src = creative.dynamicData.team_2_bg.Url;
  creative.elements.team_2.name.innerHTML = creative.dynamicData.team_2_name;
  creative.elements.team_2.name.style.backgroundColor = creative.dynamicData.team_2_color;

  // Set General
  creative.elements.general.team_1_name.innerHTML = creative.dynamicData.team_1_name;
  creative.elements.general.team_2_name.innerHTML = creative.dynamicData.team_2_name;
  creative.elements.general.bg.style.backgroundColor = creative.dynamicData.general_color_bg;
  creative.elements.general.date.innerHTML = creative.dynamicData.general_date;
  creative.elements.general.logo_1.src = creative.dynamicData.general_logo_1.Url;
  creative.elements.general.logo_2.src = creative.dynamicData.general_logo_2.Url;
  creative.elements.general.cta.innerHTML = creative.dynamicData.general_cta_text;
  creative.elements.general.cta.style.color = creative.dynamicData.general_cta_color;
  creative.elements.general.cta.style.backgroundColor = creative.dynamicData.general_cta_color_bg;
  creative.elements.ad.style.backgroundColor = creative.dynamicData.general_color_bg;


  creative.dynamicExitUrl = creative.dynamicData.exit_url.Url;
};

creative.createTimeline = function() {
  creative.tl = new TimelineMax({ onComplete: creative.elements.replay.show })
  .to(creative.elements.team_1.badge, 1, { opacity: 1});
}

creative.exitClickHandler = function (event) {
  Enabler.exit('exit', creative.dynamicExitUrl);
};

creative.pageLoadHandler = function (event) {
  creative.createTimeline();
};

// Is triggered when the background image in polite.js was fully loaded.
creative.showAd = function () {
  document.getElementById('ad-content').className = "show";
  document.getElementById('ad-loader').className = "hide";
};

// Start creative once all elements in window are loaded.
window.addEventListener('load', creative.init.bind(creative));
