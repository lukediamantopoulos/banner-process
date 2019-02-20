$(document).ready(function () {
  var _BT_version = "3.0.1";
  var _body = $('body');
  var _app = $('#_BT_');
  var _ad = $("#ad");
  var _BT_storage;
  var rulerIndex = 0;
  var btn_replay = $("#replay");
  var replayIsShowing = true;
  var isPlaying = _BT_isExpanded = false;
  var playing = imgOverlayFirstRun = true;

  // Helpers
  var gE = function(e){return document.getElementById(e)};
  var gC = function(e){return document.getElementsByClassName(e)[0]};
  var qS = function(e){return document.querySelector(e)};
  var qSa = function(e){return [].slice.call(document.querySelectorAll(e))};

  _BT_prepare();

  function _BT_prepare() {
    chrome.storage.sync.get(null, function (items) {
      _BT_storage = items;
      build();
    });
  }

  function alignGrid() {
    var adCoords = qS('#ad').getBoundingClientRect();
    var overlay = qS('#_BT_ad_overlay');
    overlay.style.left = adCoords.left + 'px';
  }

  function removeActive(element) {
    setTimeout(function() {
      qS(element).classList.remove('_BT_isActive');
    }, 250);
  }

  function buildRuler( arg ) {
    rulerIndex += 1;
    arg = arg.toUpperCase();

    var ruler = document.createElement('span');
    ruler.classList.add('_BT_ruler');
    ruler.id = '_BT_ruler_' + rulerIndex;
    ruler.style.position = 'absolute';
    ruler.style.top = '0';
    ruler.style.left = '0';
    ruler.style.backgroundColor = 'rgb(10, 133, 185)'; // blue
    ruler.style.zIndex = '9999';
    if ( arg === 'X' ) {
      ruler.style.width = '100%'
      ruler.style.height = '2px'
    } else if (arg === 'Y') {
      ruler.style.width = '2px'
      ruler.style.height = '100%'
    }
    qS('#_BT_rulers').appendChild(ruler);
  }

  // Listeners
  window.addEventListener('resize', onResize);

  // On Window Resize
  function onResize() {
    alignGrid();
  }

  // Change string to function
  function fnToFunction( element ) {
    window[element.getAttribute('data-fn')]();
  }

  // Add click events and functionality
  function operations() {

    // Action functions creator
    document.addEventListener('click', function(e) {
      var target = e.target;
      if ( target.classList.contains('_BT_action') ) {
        fnToFunction(target);
        target.classList.toggle('_BT_isActive');
        target.getAttribute('aria-pressed') === 'false' ? target.setAttribute('aria-pressed', true) : target.setAttribute('aria-pressed', false);
      }    
    });

    // Display Grid
    window.fn_grid = function() {
      _body.toggleClass('_BT_grid_active');
    }

    // Change Theme
    window.fn_theme = function() {
      _body.toggleClass('_BT_theme_dark');
    }

    // Drop Down Margin
    window.fn_margin = function() {
      _body.toggleClass('_BT_margin_active');
    }

    // Open App
    window.fn_open = function() {
      _body.addClass('_BT_expand');
    }

    // Close App
    window.fn_close = function() {
      _body.removeClass('_BT_expand');
    }

    // Turn out the lights
    window.fn_dark = function() {
      _body.toggleClass('_BT_dark_active');
    }

    // Toggle replay
    window.fn_toggle_replay = function() {
      replayIsShowing ? fn_hide_replay() : fn_show_replay();
      replayIsShowing = !replayIsShowing;
    }

    // Hide Replay Button
    window.fn_hide_replay = function() {
      _BT_appendTempScript({ function: "toggleReplay('hide')" });
    }

    // Show Replay Button
    window.fn_show_replay = function() {
      _BT_appendTempScript({ function: "toggleReplay('show')" });
    }

    // Screenshot 
    window.fn_screenshot = function(callback) {
      if (callback) {
        fn_open();
        gE('ad').classList.remove('_BT_corner');
        gE('_BT_screenshotButton').classList.remove('_BT_isActive');
        return;
      } else {
        // Buff to end frame
        fn_fast_forward();

        // Turn off all active actions
        var active_actions = qSa('#_BT_actions_grid > ._BT_action._BT_isActive:not(#_BT_screenshotButton)');
        if (active_actions.length) {
          active_actions.forEach(function(action) {
            fnToFunction(action);
          });
        }

        fn_close();
        fn_hide_replay();
        gE('ad').classList.add('_BT_corner');
        chrome.extension.sendRequest({
          cmd: "_BT_resetZoom"
        });
        
        setTimeout( function() {
          var specs = {
            width: localStorage["_BT_adWidth"],
            height: localStorage["_BT_adHeight"],
            url: window.location.pathname
          };
          chrome.extension.sendRequest({
            cmd: "_BT_screenshot",
            specs: specs
          });
        }, 1000)
      }
    }

    // Play Button
    window.fn_play = function() {
      _BT_appendTempScript({ function: "toggleAnimation()" });
      isPlaying = !isPlaying;   
    }

    // Rewind Button
    window.fn_rewind = function() {
       _BT_appendTempScript({ function: "firstFrame()" });
    }

    // Fast Forwards Button
    window.fn_fast_forward = function() {
       _BT_appendTempScript({ function: "lastFrame()" });
    }

    // Display Rulers 
    window.fn_rulers = function() {
      _body.toggleClass('_BT_rulers_active');
    }

    // Add ruler on x axis 
    window.fn_rulers_x = function() {
      qS('#_BT_rulers_show').classList.add('_BT_isActive');
      _body.addClass('_BT_rulers_active');
      buildRuler('x');
      removeActive('#_BT_rulers_x');
    }

    // Add ruler on y axis
    window.fn_rulers_y = function() {
      qS('#_BT_rulers_show').classList.add('_BT_isActive');
      _body.addClass('_BT_rulers_active');
      buildRuler('y');
      removeActive('#_BT_rulers_y');
    }

    // Check last clicked on
    var lastPressed;
    qS('#_BT_rulers').addEventListener('click', function(e) {
      if ( lastPressed ) {
        lastPressed.classList.remove('_BT_highlight');
      }

      if ( !e.target.classList.contains('_BT_ruler') ) return;
      lastPressed = e.target;
      lastPressed.classList.add('_BT_highlight');
    });

    // Delete ruler when the delete button is pressed
    window.addEventListener('keydown', function(e) {
      if ( lastPressed && lastPressed.classList.contains('_BT_ruler') ) {
        if ( e.key === 'Delete' || e.key === 'Backspace') {
            lastPressed.remove();
        }
      }
    });

    // Move X & Y ruler on drag
    var isDown = false;
    var startX = 0;
    var scrollLeft;
    var currentX;

    qS('#_BT_rulers').addEventListener('mousedown', function(e) {
      if ( !e.target.classList.contains('_BT_ruler') ) return;
      isDown = true;
      startX = qS('#_BT_rulers').offsetLeft;
      scrollLeft = qS('#_BT_rulers').scrollLeft;
    });

    qS('#_BT_rulers').addEventListener('mouseup', function(e) {
      isDown = false;
    });

    qS('#_BT_rulers').addEventListener('mouseleave', function(e) {
      isDown = false;
    });

    qS('#_BT_rulers').addEventListener('mousemove', function(e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - qS('#ad').offsetLeft;
      var walk = x - startX;
      currentX = this.offsetLeft;
      this.style.left = currentX + walk + 'px';
    });

    // Upload Reference Image
    window.fn_add_ref = function() {
      _body.addClass('_BT_preview_active');
      qS('input[type=file]').click();
      qS('#_BT_show_ref').classList.add('_BT_isActive');
    }

    qS('input[type=file]').addEventListener('change', function() {
      var preview = qS('#_BT_preview');
      var file = qS('input[type=file]').files[0];
      var reader = new FileReader();

      reader.addEventListener("load", function () {
        preview.src = reader.result;
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
      qS('#_BT_add_ref').classList.remove('_BT_isActive');
    });

    // Delete Reference Image
    window.fn_del_ref = function() {
      _body.removeClass('_BT_preview_active');
      qS('#_BT_show_ref').classList.remove('_BT_isActive');
      qS('#_BT_preview').src = 'http://via.placeholder.com/' + localStorage["_BT_adWidth"] + 'x' + localStorage["_BT_adHeight"];
      removeActive('#_BT_del_ref');
    }

    // Show Reference Image
    window.fn_show_ref = function() {
       _body.toggleClass('_BT_preview_active');
    }

    $(document).on('click', '._BT_rulerButtons', function () {
      var axis, maxAxisRange, pos;
      if (this.id == "_BT_xRulerButton") {
        axis = "X";
        pos = "left";
        maxAxisRange = localStorage["_BT_adWidth"];
      } else {
        axis = "Y";
        pos = "top";
        maxAxisRange = localStorage["_BT_adHeight"];
      }
      $("#_BT_rulerOverlay").append(_BT_getRuler(axis));
      $("._BT_ruler" + axis).draggable({
        axis: axis,
        containment: "#_BT_rulerOverlay",
        drag: function () {
          var Position = $(this).css(pos);

          if (Position == (maxAxisRange - 2) + "px") {
            Position = (maxAxisRange + "px");
          }
          $(this).find($('._BT_rulerPos')).text(axis + ': ' + Position);
        }
      });
    });

    $(document).on('click', '.delImg', function () {
      imgs.splice($(this).parent().attr("id"), 1);
      if ($(this).attr("src") == localStorage['_BT_imgOverlay']) {
        localStorage.removeItem('_BT_imgOverlay');
        $("#_BT_imgOverlay").attr("src", "");
      }
      $(this).parent().remove();
      if ($('#_BT_imgRefGallery').is(':empty')) {
        _BT_deleteImgOverlayAssets();
      }
    });

    $(document).on('click', '.img', function () {
      $("[class*=_BT_selectedImgOverlay]").removeClass("_BT_selectedImgOverlay");

      if (localStorage['_BT_imgOverlay'] == $(this).attr("src")) {
        $("#_BT_imgOverlay").attr("src", "");
        $("#_BT_imgOverlay").removeClass("_BT_visible");
        localStorage.removeItem('_BT_imgOverlay');
        $(this).removeClass("_BT_selectedImgOverlay");
      } else {
        $("#_BT_imgOverlay").attr("src", $(this).attr("src"));
        $("#_BT_imgOverlay").addClass("_BT_visible");
        localStorage['_BT_imgOverlay'] = $(this).attr("src");
        $(this).addClass("_BT_selectedImgOverlay");
      }
    });

    $(document).on('mouseover', '._BT_feature, ._BT_rulerButtons', function () {
      if (_BT_helpOn) {
        $("#_BT_helpDesk").addClass("_BT_opacity");
        _BT_appendHelp($(this).attr('bt-featurename'), $(this).attr('bt-featuredesc'));
      }
    });

    $(document).on('mouseout', '._BT_feature, ._BT_rulerButtons', function () {
      if (_BT_helpOn) $("#_BT_helpDesk").removeClass("_BT_opacity");
    });

    $("#_BT_imgOverlayUpload").change(uploadImgOverlayAsset);
  }

  function construct() {
    // Create controls
    getControls("actions", "#_BT_actions_grid");
    getControls("rulers", "#_BT_rulerOverlayControls>table", 2);

    // Add version number
    $("#_BT_version").append(' V' + _BT_version);

    // Set Overlay Size
    qS('#_BT_ad_overlay').style.width = localStorage["_BT_adWidth"] + 'px';
    qS('#_BT_ad_overlay').style.height = localStorage["_BT_adHeight"] + 'px';

    // Set Overlay Position
    alignGrid();

    // Set placeholder image
    qS('#_BT_preview').src = 'http://via.placeholder.com/' + localStorage["_BT_adWidth"] + 'x' + localStorage["_BT_adHeight"];
  };

  function build() {
    if ($("#ad").length) {
      if (_BT_storage["_BT_disable"] == 1) return;

      $("head").prepend('<link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300" rel="stylesheet">');
      $("head").append("<script src='" + chrome.extension.getURL('src/js/jquery-3.1.1.min.js') + "'></script>");
      $("head").append("<script src='" + chrome.extension.getURL('src/js/jquery-ui.min.js') + "'></script>");
      
      // Change state to 'running'
      isPlaying = true;

      // Send message to bkg script to inject HTML in page
      chrome.extension.sendRequest({ cmd: "injectHTML" }, function (html) {

        // Make a node to input the html callback string
        var tempNode = document.createElement('div');
            tempNode.id = 'injectedHTML';
            tempNode.innerHTML = html;
            document.body.append(tempNode);

        // Add HTML UI Panel to page
        _BT_appendAssetScript({ script: "bannerObject" });

        // Start Building
        construct();
        operations();
        fn_open();
      });
    } else {
      console.log("BannerTools will remain disabled as it could not find '#ad' ID!");
    }
  }

  function uploadImgOverlayAsset() {
    $(this).remove();
    $('<input id="_BT_imgOverlayUpload" type="file" name="filename" accept="image/jpeg, image/png">').change(uploadImgOverlayAsset).appendTo("#_BT_imgOverlayUploadInput");

    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        addImgOverlayAsset(e.target.result);
      };
      reader.readAsDataURL(this.files[0]);
    }
  }

  function _BT_getRuler(axis) {
    return '<div class="_BT_ruler' + axis + ' draggable ui-widget-content"><span class="_BT_rulerPos"></span></div>';
  }

  function getControls(file, parent) {
    var actions = [];
    $.getJSON(chrome.extension.getURL('/src/json/' + file + '.json'), function (data) {
      $.each(data, function (key, val) {
        actions.push([
          data[key]["id"],
          data[key]["class"],
          data[key]["svgIcon"],
          data[key]["featureName"],
          data[key]["featureDesc"],
          data[key]["fn"]
        ]);
      });

      $(parent).append(buildControls(actions));

      if(file == "_BT_actions"){
        _BT_unpack(_BT_storage);
      }
    });
  }

  function buildControls(actions) {
    var html = '';
    for ( var counter = 0; counter < actions.length; counter++ ) {
      var feature = "<div role='button' aria-pressed='false' id='" + actions[counter][0] + "' class='" + actions[counter][1] + "' bt-value='0' bt-featureName='" + actions[counter][3] + "'bt-featureDesc='" + actions[counter][4] + " ' data-fn='" + actions[counter][5] + "'>" + "<span>" + actions[counter][3] + "</span>" + actions[counter][2] + "</div>";
      html += feature;
    }
    return html;
  }

  function _BT_appendAssetScript(obj, callback) {
    if (typeof obj.remove === 'undefined') {
      obj.remove = "";
    }
    if (typeof obj.arg === 'undefined') {
      obj.arg = "";
    }
    var className = "";
    if (obj.remove == 1) {
      className = "_BT_injectedScript";
    }
    var script = obj.arg + '<script class="' + className + '" src="' + chrome.extension.getURL('/src/js/' + obj.script + '.js') + '"></script>';
    $("body").append(script);
    if (obj.remove == 1) {
      $("._BT_injectedScript").remove();
    }
    if (callback) callback();
  }

  function _BT_appendTempScript(obj) {
    var script = '<script class="_BT_injectedScript">' + obj.function + '</script>';
    $("body").append(script);
    $("._BT_injectedScript").remove();
  }

  function _BT_disable() {
    setToStorage({ "_BT_disable": 1 });
    location.reload();
  }

  function _BT_imgOverlayAsset() {
    $("#_BT_imgAddRefButton").children().removeClass("_BT_featureOn");
    $("#_BT_imgAddRefButton").attr("bt-value", 0);
    if (!imgOverlayFirstRun) {
      $("#_BT_imgOverlayUpload").change();
    } else {
      $("#_BT_imgOverlayUpload").click();
    }
  }

  function addImgOverlayAsset(arg) {
    imgs.push(arg);
    $("#_BT_imgRefGallery").append(getImgContainer({ imgSrc: imgs[imgs.length - 1], id: imgs.length - 1 }));

    if (imgs.length - 1 < 1) {
      $("#_BT_imgOverlay, #_BT_imgDelRefButton, #_BT_imgRefGalleryContainer").addClass("_BT_visible");
      $("#_BT_imgRefGalleryContainer").addClass("_BT_display");
      $("#_BT_imgOverlay").attr("src", imgs[imgs.length - 1]);
      localStorage['_BT_imgOverlay'] = imgs[imgs.length - 1];
      $(".imgContainer > .img").addClass("_BT_selectedImgOverlay");
    }
    $("#_BT_imgRefGallery").width(imgs.length * 87 + "px");
  }

  function _BT_deleteImgOverlayAssets() {
    imgs = new Array();
    $("#_BT_imgRefGallery").empty();
    $("#_BT_imgOverlay").attr("src", "");
    $("#_BT_imgOverlay, #_BT_imgDelRefButton, #_BT_imgRefGalleryContainer").removeClass("_BT_visible");
    $("#_BT_imgRefGalleryContainer").removeClass("_BT_display");
    localStorage.removeItem('_BT_imgOverlay');
  }

  function getImgContainer(object) {
    var html = '<div class="imgContainer" id=' + object.id + '><img class="img" src="' + object.imgSrc + '" alt=""><span class="delImg">&#x2716</span></div>';
    return html;
  }

  function _BT_border(arg) {
    (arg == 1) ? ($(".content").children().addClass("_BT_border")) : ($(".content").children().removeClass("_BT_border"));
    (arg == 1) ? ($(".content").children().children().addClass("_BT_border")) : ($(".content").children().children().removeClass("_BT_border"));

    if (arg == 1) {
      $(".content").children().each(function () {
        if ($(this).width() == 0 || $(this).height() == 0) {
          $(this).removeClass("_BT_border");
        }
      });

      $(".content").children().children().each(function () {
        if ($(this).width() == 0 || $(this).height() == 0) {
          $(this).removeClass("_BT_border");
        }
      });
    }

    if ($(".draggable").length) {
      $(".draggable").removeClass("_BT_border");
    }

    setToStorage({ "_BT_border": arg });
  }

  function _BT_guide(arg) {
    _BT_grid(arg);
    _BT_rulers(arg);
    setToStorage({ "_BT_guide": arg });
  }

  function _BT_rulers(arg) {
    var style;
    (arg == 1) ? ($("#_BT_rulerOverlay, #_BT_rulerOverlayControls").addClass("_BT_visible")) : ($("#_BT_rulerOverlay, #_BT_rulerOverlayControls").removeClass("_BT_visible"));
    if (arg == 0) {
      $(".draggable").remove();
    }
  }

  function setToStorage(obj) {
    chrome.storage.sync.set(obj);
    _BT_storage[obj.key] = obj.val;
  }

  chrome.runtime.onMessage.addListener( function (request, sender, sendResponse) {
      if (request._BT_pluginClick == 1) {
        if (isPlaying == false) {
          setToStorage({ "_BT_disable": 0 });
          setToStorage({ "_BT_minimized": 0 });
          _BT_prepare();
        } else {
          if (_BT_isExpanded == false) {
            setToStorage({ "_BT_minimized": 0 });
            fn_open();
          } else {
            fn_close();
          }
        }
      } else if (request._BT_pluginClick == 0) {
        if (isPlaying == true) {
          _BT_disable();
        }
      } else if (request._BT_screenshot == 0) {
        fn_screenshot('reset');
      }
    }
  );
});