(function() {   
    // Check if the timeline object is available 
    // var checkInfo = {
    //     interval: setInterval( keepChecking, 500),
    //     counter: 0,
    //     limit: 20,
    //     error: 'Could not find timeline, please reload page'
    // };

    // function keepChecking() {
    //     if ( creative.tl ) {
    //         checkInfo.counter++;
    //         clearInterval(checkInfo.interval);
            init();
//         } else if ( checkInfo.limit === checkInfo.counter) {
//             clearInterval(checkInfo).interval;
//             alert(checkInfo.error);
//         }
//     };
})();

// Initialize
function init() {
    

    // update buffer values on page start
    window.interval = function() {
        setInterval( function() {
            updateBuffer();
            if ( creative.tl.time() === (creative.tl.time() * creative.tl.progress())) {
                window.clearInterval(interval);
            };
        }, 100);
    };

    // Update the size of the ad
    setSize();
    
    // Reset to beginning
    firstFrame();
    toggleAnimation('start from beginning');

    // Print specs to page
    $("#_BT_adTotalDurationLabel").html(creative.tl.totalDuration());
    $("#_BT_adDurationLabel").html(creative.tl.duration());
    $("#_BT_adPlaying").html(creative.tl.repeat());
    $("#_BT_current_time").html(Math.round(creative.tl.time()));
    $("#_BT_total_time").html(Math.round(creative.tl.duration() * 100 ) / 100);

    buildLabels();

    // Check for warnings
    warnings();
}

function warnings() {
    // If the ad is longer than 15 seconds (IAB standards)
    if (creative.tl.duration() > 15) { $("#_BT_cycle").addClass("_BT_warning"); }
    if (creative.tl.totalDuration() > 15) { $("#_BT_adDurationLabel").addClass("_BT_warning"); }

    // Check to see if the meta data matches thar of the ad size
    if (creative.specs.height !== creative.meta.height || creative.specs.width !== creative.meta.width) {
        $("#_BT_meta").addClass("_BT_warning");
        $("#_BT_meta").html("Meta Doesn't Match");
    } else {
        $("#_BT_meta").html("Meta Matches");
    }
}

// ------------------------------------------------------------------------
// Create labels for each label on the timeline
// ------------------------------------------------------------------------

function buildLabels() {
    // Get labels from the timeline and place them on the page
    var labels = creative.tl.getLabelsArray();
    var labelsContainer = document.querySelector('._BT_panel_labels');
    var label;
    for ( var i = 0; i < labels.length; i++ ) {
        label = '<span class="_BT_label" data-time="' + labels[i].time + '">';
        label +=  labels[i].name
        label += '</span>';
        labelsContainer.innerHTML += label;
    }

    labelsContainer.addEventListener('click', function(e) {
        if (!e.target.matches('span')) return;
        creative.tl.time(e.target.getAttribute('data-time'));
        document.querySelector('#_BT_current_time').innerHTML = Math.round(creative.tl.time() * 10) / 10;
    });
}

// ------------------------------------------------------------------------
// Buffer scrolling
// ------------------------------------------------------------------------

var buffer = document.querySelector('._BT_slider');
var playback = document.querySelector('._BT_settings_playback');
var isDown = false;
var isPlaying;
var x;
var trueX;
var bufferSpecs;

function getTime( event ) {
    mouseX = event.pageX;
    trueX = event.pageX - bufferSpecs.left;
    bufferPercent = Math.round( ( trueX / bufferSpecs.width) * 100);
    creative.tl.progress( bufferPercent / 100);
}

playback.addEventListener('mousedown', function(e) {
    if ( e.target.matches('div._BT_settings_playback') || e.target.matches('span._BT_slider') ) {
        isDown = true;
        if ( creative.tl.isActive() ) {
            isPlaying = true;
        } else {
            isPlaying = false;
        }
        bufferSpecs = playback.getBoundingClientRect();
        getTime(e);
        updateBuffer();
    }
});

playback.addEventListener('mousemove', function(e) {
    if ( e.target.matches('div._BT_settings_playback') || e.target.matches('span._BT_slider') ) {
        if ( isDown ) {
            getTime(e);
            updateBuffer();
        }
    }
});

playback.addEventListener('mouseleave', function(e) {
    if ( e.target.matches('div._BT_settings_playback') || e.target.matches('span._BT_slider') ) {
        isDown = false;
    }
});

playback.addEventListener('mouseup', function(e) {
    if ( e.target.matches('div._BT_settings_playback') || e.target.matches('span._BT_slider') ) {
        isDown = false;
    }
});

// ------------------------------------------------------------------------
// Update the buffer size and current time
// ------------------------------------------------------------------------

function updateBuffer() {
    document.querySelector('._BT_slider').style.transform = 'translatex(' + (creative.tl.progress() * 100).toFixed(2) + '%)';
    document.querySelector('#_BT_current_time').innerHTML = Math.round(creative.tl.time() * 10) / 10;
}

// ------------------------------------------------------------------------
// Fetch the size of the ad and display
// ------------------------------------------------------------------------

function setSize() {
    localStorage["_BT_adWidth"] = creative.specs.width;
    localStorage["_BT_adHeight"] = creative.specs.height;
    $("#_BT_adNowPlaying").text(creative.specs.width + "px x " + creative.specs.height + "px");
    $("._BT_featureOverlay").css({ width: creative.specs.width, height: creative.specs.height });
}


// ------------------------------------------------------------------------
// Commands
// ------------------------------------------------------------------------

function firstFrame() { 
    creative.tl.progress(0); 
    updateBuffer();
}

function lastFrame() { 
    creative.tl.progress(100); 
    updateBuffer();
}

function toggleAnimation(arg) { 
    // If aniamtion is done or fresh
    if (creative.tl.progress() === 1 || arg) { 
        creative.tl.play(0); 
        interval();
    // If animation is playing
    } else if (creative.tl.isActive()) {
        creative.tl.pause(); 
        clearInterval(interval);
    // If animation is paused
    } else {
        creative.tl.play(); 
        interval();
    }
}

function toggleReplay(trigger) {
    trigger === 'hide' ? $('body').addClass('_BT_hide_replay') : $('body').removeClass('_BT_hide_replay');
}
