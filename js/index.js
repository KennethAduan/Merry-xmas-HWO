/**
Asset => 
JS audio using howlerJS:
https://howlerjs.com/
Apple Font: 
https://sf.abarba.me/SF-UI-Text-UltrathinItalic.otf ===https://gist.github.com/AndrewBarba/2c0f6612ceef30f5f55d===
iPhone signal bar: https://icons8.com/icon/set/signal/all
iPhone framework: https://preview.ibb.co/dGjspw/Untitled_1.png
**/

var d = new Date();
var dt = d.getDate();
var h = d.getHours();
var m = d.getMinutes();

function aZero(n) {
  return n.toString().length == 1 ? (n = "0" + n) : n;
}

(function () {
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  Date.prototype.getMonthName = function () {
    return months[this.getMonth()];
  };
  Date.prototype.getDayName = function () {
    return days[this.getDay()];
  };
})();
var day = d.getDayName();
var month = d.getMonthName();

var x = aZero(h) + ":" + aZero(m);
var y = day + ", " + month + " " + dt;
var o = "AT&T";

document.getElementById("clock-text").innerHTML = x;
document.getElementById("date-text").innerHTML = y;
document.getElementById("temp-notch").innerHTML = o;

var message = document.getElementById("message-overlay");
var mw = document.getElementById("merrywrap");
var audio = new Howl({
  src: ["https://s0.vocaroo.com/media/download_temp/Vocaroo_s0E0FP15QAsj.mp3"],
  volume: 1,
});
var mcSong = new Howl({
  src: [
    "https://ia802604.us.archive.org/12/items/WeWishYouAMerryChristmas_123/WeWishYouAMerryChristmas_64kb.mp3",
  ],
  volume: 0.5,
  loop: true,
});

// <!-- GIFT BOX SOURCE CODE: https://tympanus.net/codrops/2013/12/24/merry-christmas-with-a-bursting-gift-box/ -->

function giftAnimation() {
  var merrywrap = document.getElementById("merrywrap");
  var box = merrywrap.getElementsByClassName("giftbox")[0];
  var step = 1;
  var stepMinutes = [2000, 2000, 1000, 1000];
  function init() {
    box.addEventListener("click", openBox, false);
  }
  function stepClass(step) {
    merrywrap.className = "merrywrap";
    merrywrap.className = "merrywrap step-" + step;
  }
  function openBox() {
    if (step === 1) {
      box.removeEventListener("click", openBox, false);
    }
    stepClass(step);
    if (step === 3) {
    }
    if (step === 4) {
      return;
    }
    setTimeout(openBox, stepMinutes[step - 1]);
    step++;
  }

  init();
}

// =====================

$(document).ready(function () {
  setTimeout(function () {
    audio.play();
    message.className += " animated zoomIn";
    message.style.visibility = "visible";
  }, 2000);

  $("#message-overlay").click(function () {
    $("#lock-icon").remove();
    $("#clock-text-overlay").remove();
    $("#date-overlay").remove();
    $("#message-overlay").remove();
    $("#touch-overlay").remove();
    mcSong.play();
    $(".content").css(
      "background-image",
      "url(https://image.ibb.co/d4Go1b/qwe.png)"
    );
    document.getElementById("temp-notch").innerHTML = x;
    mw.style.visibility = "visible";
    giftAnimation();
  });
});

var snowStorm = (function (window, document) {
  // --- common properties ---

  this.autoStart = true; // Whether the snow should start automatically or not.
  this.excludeMobile = true; // Snow is likely to be bad news for mobile phones' CPUs (and batteries.) Enable at your own risk.
  this.flakesMax = 128; // Limit total amount of snow made (falling + sticking)
  this.flakesMaxActive = 64; // Limit amount of snow falling at once (less = lower CPU use)
  this.animationInterval = 50; // Theoretical "miliseconds per frame" measurement. 20 = fast + smooth, but high CPU use. 50 = more conservative, but slower
  this.useGPU = true; // Enable transform-based hardware acceleration, reduce CPU load.
  this.className = null; // CSS class name for further customization on snow elements
  this.excludeMobile = true; // Snow is likely to be bad news for mobile phones' CPUs (and batteries.) By default, be nice.
  this.flakeBottom = null; // Integer for Y axis snow limit, 0 or null for "full-screen" snow effect
  this.followMouse = false; // Snow movement can respond to the user's mouse
  this.snowColor = "#fff"; // Don't eat (or use?) yellow snow.
  this.snowCharacter = "&bull;"; // &bull; = bullet, &middot; is square on some systems etc.
  this.snowStick = true; // Whether or not snow should "stick" at the bottom. When off, will never collect.
  this.targetElement = null; // element which snow will be appended to (null = document.body) - can be an element ID eg. 'myDiv', or a DOM node reference
  this.useMeltEffect = true; // When recycling fallen snow (or rarely, when falling), have it "melt" and fade out if browser supports it
  this.useTwinkleEffect = false; // Allow snow to randomly "flicker" in and out of view while falling
  this.usePositionFixed = false; // true = snow does not shift vertically when scrolling. May increase CPU load, disabled by default - if enabled, used only where supported
  this.usePixelPosition = false; // Whether to use pixel values for snow top/left vs. percentages. Auto-enabled if body is position:relative or targetElement is specified.

  // --- less-used bits ---

  this.freezeOnBlur = true; // Only snow when the window is in focus (foreground.) Saves CPU.
  this.flakeLeftOffset = 0; // Left margin/gutter space on edge of container (eg. browser window.) Bump up these values if seeing horizontal scrollbars.
  this.flakeRightOffset = 0; // Right margin/gutter space on edge of container
  this.flakeWidth = 8; // Max pixel width reserved for snow element
  this.flakeHeight = 8; // Max pixel height reserved for snow element
  this.vMaxX = 5; // Maximum X velocity range for snow
  this.vMaxY = 4; // Maximum Y velocity range for snow
  this.zIndex = 0; // CSS stacking order applied to each snowflake

  // --- "No user-serviceable parts inside" past this point, yadda yadda ---

  var storm = this,
    features,
    // UA sniffing and backCompat rendering mode checks for fixed position, etc.
    isIE = navigator.userAgent.match(/msie/i),
    isIE6 = navigator.userAgent.match(/msie 6/i),
    isMobile = navigator.userAgent.match(/mobile|opera m(ob|in)/i),
    isBackCompatIE = isIE && document.compatMode === "BackCompat",
    noFixed = isBackCompatIE || isIE6,
    screenX = null,
    screenX2 = null,
    screenY = null,
    scrollY = null,
    docHeight = null,
    vRndX = null,
    vRndY = null,
    windOffset = 1,
    windMultiplier = 2,
    flakeTypes = 6,
    fixedForEverything = false,
    targetElementIsRelative = false,
    opacitySupported = (function () {
      try {
        document.createElement("div").style.opacity = "0.5";
      } catch (e) {
        return false;
      }
      return true;
    })(),
    didInit = false,
    docFrag = document.createDocumentFragment();

  features = (function () {
    var getAnimationFrame;

    /**
     * hat tip: paul irish
     * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
     * https://gist.github.com/838785
     */

    function timeoutShim(callback) {
      window.setTimeout(callback, 1000 / (storm.animationInterval || 20));
    }

    var _animationFrame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      timeoutShim;

    // apply to window, avoid "illegal invocation" errors in Chrome
    getAnimationFrame = _animationFrame
      ? function () {
          return _animationFrame.apply(window, arguments);
        }
      : null;

    var testDiv;

    testDiv = document.createElement("div");

    function has(prop) {
      // test for feature support
      var result = testDiv.style[prop];
      return result !== undefined ? prop : null;
    }

    // note local scope.
    var localFeatures = {
      transform: {
        ie: has("-ms-transform"),
        moz: has("MozTransform"),
        opera: has("OTransform"),
        webkit: has("webkitTransform"),
        w3: has("transform"),
        prop: null, // the normalized property value
      },

      getAnimationFrame: getAnimationFrame,
    };

    localFeatures.transform.prop =
      localFeatures.transform.w3 ||
      localFeatures.transform.moz ||
      localFeatures.transform.webkit ||
      localFeatures.transform.ie ||
      localFeatures.transform.opera;

    testDiv = null;

    return localFeatures;
  })();

  this.timer = null;
  this.flakes = [];
  this.disabled = false;
  this.active = false;
  this.meltFrameCount = 20;
  this.meltFrames = [];

  this.setXY = function (o, x, y) {
    if (!o) {
      return false;
    }

    if (storm.usePixelPosition || targetElementIsRelative) {
      o.style.left = x - storm.flakeWidth + "px";
      o.style.top = y - storm.flakeHeight + "px";
    } else if (noFixed) {
      o.style.right = 100 - (x / screenX) * 100 + "%";
      // avoid creating vertical scrollbars
      o.style.top = Math.min(y, docHeight - storm.flakeHeight) + "px";
    } else {
      if (!storm.flakeBottom) {
        // if not using a fixed bottom coordinate...
        o.style.right = 100 - (x / screenX) * 100 + "%";
        o.style.bottom = 100 - (y / screenY) * 100 + "%";
      } else {
        // absolute top.
        o.style.right = 100 - (x / screenX) * 100 + "%";
        o.style.top = Math.min(y, docHeight - storm.flakeHeight) + "px";
      }
    }
  };

  this.events = (function () {
    var old = !window.addEventListener && window.attachEvent,
      slice = Array.prototype.slice,
      evt = {
        add: old ? "attachEvent" : "addEventListener",
        remove: old ? "detachEvent" : "removeEventListener",
      };

    function getArgs(oArgs) {
      var args = slice.call(oArgs),
        len = args.length;
      if (old) {
        args[1] = "on" + args[1]; // prefix
        if (len > 3) {
          args.pop(); // no capture
        }
      } else if (len === 3) {
        args.push(false);
      }
      return args;
    }

    function apply(args, sType) {
      var element = args.shift(),
        method = [evt[sType]];
      if (old) {
        element[method](args[0], args[1]);
      } else {
        element[method].apply(element, args);
      }
    }

    function addEvent() {
      apply(getArgs(arguments), "add");
    }

    function removeEvent() {
      apply(getArgs(arguments), "remove");
    }

    return {
      add: addEvent,
      remove: removeEvent,
    };
  })();

  function rnd(n, min) {
    if (isNaN(min)) {
      min = 0;
    }
    return Math.random() * n + min;
  }

  function plusMinus(n) {
    return parseInt(rnd(2), 10) === 1 ? n * -1 : n;
  }

  this.randomizeWind = function () {
    var i;
    vRndX = plusMinus(rnd(storm.vMaxX, 0.2));
    vRndY = rnd(storm.vMaxY, 0.2);
    if (this.flakes) {
      for (i = 0; i < this.flakes.length; i++) {
        if (this.flakes[i].active) {
          this.flakes[i].setVelocities();
        }
      }
    }
  };

  this.scrollHandler = function () {
    var i;
    // "attach" snowflakes to bottom of window if no absolute bottom value was given
    scrollY = storm.flakeBottom
      ? 0
      : parseInt(
          window.scrollY ||
            document.documentElement.scrollTop ||
            (noFixed ? document.body.scrollTop : 0),
          10
        );
    if (isNaN(scrollY)) {
      scrollY = 0; // Netscape 6 scroll fix
    }
    if (!fixedForEverything && !storm.flakeBottom && storm.flakes) {
      for (i = 0; i < storm.flakes.length; i++) {
        if (storm.flakes[i].active === 0) {
          storm.flakes[i].stick();
        }
      }
    }
  };

  this.resizeHandler = function () {
    if (window.innerWidth || window.innerHeight) {
      screenX = window.innerWidth - 16 - storm.flakeRightOffset;
      screenY = storm.flakeBottom || window.innerHeight;
    } else {
      screenX =
        (document.documentElement.clientWidth ||
          document.body.clientWidth ||
          document.body.scrollWidth) -
        (!isIE ? 8 : 0) -
        storm.flakeRightOffset;
      screenY =
        storm.flakeBottom ||
        document.documentElement.clientHeight ||
        document.body.clientHeight ||
        document.body.scrollHeight;
    }
    docHeight = document.body.offsetHeight;
    screenX2 = parseInt(screenX / 2, 10);
  };

  this.resizeHandlerAlt = function () {
    screenX = storm.targetElement.offsetWidth - storm.flakeRightOffset;
    screenY = storm.flakeBottom || storm.targetElement.offsetHeight;
    screenX2 = parseInt(screenX / 2, 10);
    docHeight = document.body.offsetHeight;
  };

  this.freeze = function () {
    // pause animation
    if (!storm.disabled) {
      storm.disabled = 1;
    } else {
      return false;
    }
    storm.timer = null;
  };

  this.resume = function () {
    if (storm.disabled) {
      storm.disabled = 0;
    } else {
      return false;
    }
    storm.timerInit();
  };

  this.toggleSnow = function () {
    if (!storm.flakes.length) {
      // first run
      storm.start();
    } else {
      storm.active = !storm.active;
      if (storm.active) {
        storm.show();
        storm.resume();
      } else {
        storm.stop();
        storm.freeze();
      }
    }
  };

  this.stop = function () {
    var i;
    this.freeze();
    for (i = 0; i < this.flakes.length; i++) {
      this.flakes[i].o.style.display = "none";
    }
    storm.events.remove(window, "scroll", storm.scrollHandler);
    storm.events.remove(window, "resize", storm.resizeHandler);
    if (storm.freezeOnBlur) {
      if (isIE) {
        storm.events.remove(document, "focusout", storm.freeze);
        storm.events.remove(document, "focusin", storm.resume);
      } else {
        storm.events.remove(window, "blur", storm.freeze);
        storm.events.remove(window, "focus", storm.resume);
      }
    }
  };

  this.show = function () {
    var i;
    for (i = 0; i < this.flakes.length; i++) {
      this.flakes[i].o.style.display = "block";
    }
  };

  this.SnowFlake = function (type, x, y) {
    var s = this;
    this.type = type;
    this.x = x || parseInt(rnd(screenX - 20), 10);
    this.y = !isNaN(y) ? y : -rnd(screenY) - 12;
    this.vX = null;
    this.vY = null;
    this.vAmpTypes = [1, 1.2, 1.4, 1.6, 1.8]; // "amplification" for vX/vY (based on flake size/type)
    this.vAmp = this.vAmpTypes[this.type] || 1;
    this.melting = false;
    this.meltFrameCount = storm.meltFrameCount;
    this.meltFrames = storm.meltFrames;
    this.meltFrame = 0;
    this.twinkleFrame = 0;
    this.active = 1;
    this.fontSize = 10 + (this.type / 5) * 10;
    this.o = document.createElement("div");
    this.o.innerHTML = storm.snowCharacter;
    if (storm.className) {
      this.o.setAttribute("class", storm.className);
    }
    this.o.style.color = storm.snowColor;
    this.o.style.position = fixedForEverything ? "fixed" : "absolute";
    if (storm.useGPU && features.transform.prop) {
      // GPU-accelerated snow.
      this.o.style[features.transform.prop] = "translate3d(0px, 0px, 0px)";
    }
    this.o.style.width = storm.flakeWidth + "px";
    this.o.style.height = storm.flakeHeight + "px";
    this.o.style.fontFamily = "arial,verdana";
    this.o.style.cursor = "default";
    this.o.style.overflow = "hidden";
    this.o.style.fontWeight = "normal";
    this.o.style.zIndex = storm.zIndex;
    docFrag.appendChild(this.o);

    this.refresh = function () {
      if (isNaN(s.x) || isNaN(s.y)) {
        // safety check
        return false;
      }
      storm.setXY(s.o, s.x, s.y);
    };

    this.stick = function () {
      if (
        noFixed ||
        (storm.targetElement !== document.documentElement &&
          storm.targetElement !== document.body)
      ) {
        s.o.style.top = screenY + scrollY - storm.flakeHeight + "px";
      } else if (storm.flakeBottom) {
        s.o.style.top = storm.flakeBottom + "px";
      } else {
        s.o.style.display = "none";
        s.o.style.bottom = "0%";
        s.o.style.position = "fixed";
        s.o.style.display = "block";
      }
    };

    this.vCheck = function () {
      if (s.vX >= 0 && s.vX < 0.2) {
        s.vX = 0.2;
      } else if (s.vX < 0 && s.vX > -0.2) {
        s.vX = -0.2;
      }
      if (s.vY >= 0 && s.vY < 0.2) {
        s.vY = 0.2;
      }
    };

    this.move = function () {
      var vX = s.vX * windOffset,
        yDiff;
      s.x += vX;
      s.y += s.vY * s.vAmp;
      if (s.x >= screenX || screenX - s.x < storm.flakeWidth) {
        // X-axis scroll check
        s.x = 0;
      } else if (vX < 0 && s.x - storm.flakeLeftOffset < -storm.flakeWidth) {
        s.x = screenX - storm.flakeWidth - 1; // flakeWidth;
      }
      s.refresh();
      yDiff = screenY + scrollY - s.y + storm.flakeHeight;
      if (yDiff < storm.flakeHeight) {
        s.active = 0;
        if (storm.snowStick) {
          s.stick();
        } else {
          s.recycle();
        }
      } else {
        if (
          storm.useMeltEffect &&
          s.active &&
          s.type < 3 &&
          !s.melting &&
          Math.random() > 0.998
        ) {
          // ~1/1000 chance of melting mid-air, with each frame
          s.melting = true;
          s.melt();
          // only incrementally melt one frame
          // s.melting = false;
        }
        if (storm.useTwinkleEffect) {
          if (s.twinkleFrame < 0) {
            if (Math.random() > 0.97) {
              s.twinkleFrame = parseInt(Math.random() * 8, 10);
            }
          } else {
            s.twinkleFrame--;
            if (!opacitySupported) {
              s.o.style.visibility =
                s.twinkleFrame && s.twinkleFrame % 2 === 0
                  ? "hidden"
                  : "visible";
            } else {
              s.o.style.opacity =
                s.twinkleFrame && s.twinkleFrame % 2 === 0 ? 0 : 1;
            }
          }
        }
      }
    };

    this.animate = function () {
      // main animation loop
      // move, check status, die etc.
      s.move();
    };

    this.setVelocities = function () {
      s.vX = vRndX + rnd(storm.vMaxX * 0.12, 0.1);
      s.vY = vRndY + rnd(storm.vMaxY * 0.12, 0.1);
    };

    this.setOpacity = function (o, opacity) {
      if (!opacitySupported) {
        return false;
      }
      o.style.opacity = opacity;
    };

    this.melt = function () {
      if (!storm.useMeltEffect || !s.melting) {
        s.recycle();
      } else {
        if (s.meltFrame < s.meltFrameCount) {
          s.setOpacity(s.o, s.meltFrames[s.meltFrame]);
          s.o.style.fontSize =
            s.fontSize - s.fontSize * (s.meltFrame / s.meltFrameCount) + "px";
          s.o.style.lineHeight =
            storm.flakeHeight +
            2 +
            storm.flakeHeight * 0.75 * (s.meltFrame / s.meltFrameCount) +
            "px";
          s.meltFrame++;
        } else {
          s.recycle();
        }
      }
    };

    this.recycle = function () {
      s.o.style.display = "none";
      s.o.style.position = fixedForEverything ? "fixed" : "absolute";
      s.o.style.bottom = "auto";
      s.setVelocities();
      s.vCheck();
      s.meltFrame = 0;
      s.melting = false;
      s.setOpacity(s.o, 1);
      s.o.style.padding = "0px";
      s.o.style.margin = "0px";
      s.o.style.fontSize = s.fontSize + "px";
      s.o.style.lineHeight = storm.flakeHeight + 2 + "px";
      s.o.style.textAlign = "center";
      s.o.style.verticalAlign = "baseline";
      s.x = parseInt(rnd(screenX - storm.flakeWidth - 20), 10);
      s.y = parseInt(rnd(screenY) * -1, 10) - storm.flakeHeight;
      s.refresh();
      s.o.style.display = "block";
      s.active = 1;
    };

    this.recycle(); // set up x/y coords etc.
    this.refresh();
  };

  this.snow = function () {
    var active = 0,
      flake = null,
      i,
      j;
    for (i = 0, j = storm.flakes.length; i < j; i++) {
      if (storm.flakes[i].active === 1) {
        storm.flakes[i].move();
        active++;
      }
      if (storm.flakes[i].melting) {
        storm.flakes[i].melt();
      }
    }
    if (active < storm.flakesMaxActive) {
      flake = storm.flakes[parseInt(rnd(storm.flakes.length), 10)];
      if (flake.active === 0) {
        flake.melting = true;
      }
    }
    if (storm.timer) {
      features.getAnimationFrame(storm.snow);
    }
  };

  this.mouseMove = function (e) {
    if (!storm.followMouse) {
      return true;
    }
    var x = parseInt(e.clientX, 10);
    if (x < screenX2) {
      windOffset = -windMultiplier + (x / screenX2) * windMultiplier;
    } else {
      x -= screenX2;
      windOffset = (x / screenX2) * windMultiplier;
    }
  };

  this.createSnow = function (limit, allowInactive) {
    var i;
    for (i = 0; i < limit; i++) {
      storm.flakes[storm.flakes.length] = new storm.SnowFlake(
        parseInt(rnd(flakeTypes), 10)
      );
      if (allowInactive || i > storm.flakesMaxActive) {
        storm.flakes[storm.flakes.length - 1].active = -1;
      }
    }
    storm.targetElement.appendChild(docFrag);
  };

  this.timerInit = function () {
    storm.timer = true;
    storm.snow();
  };

  this.init = function () {
    var i;
    for (i = 0; i < storm.meltFrameCount; i++) {
      storm.meltFrames.push(1 - i / storm.meltFrameCount);
    }
    storm.randomizeWind();
    storm.createSnow(storm.flakesMax); // create initial batch
    storm.events.add(window, "resize", storm.resizeHandler);
    storm.events.add(window, "scroll", storm.scrollHandler);
    if (storm.freezeOnBlur) {
      if (isIE) {
        storm.events.add(document, "focusout", storm.freeze);
        storm.events.add(document, "focusin", storm.resume);
      } else {
        storm.events.add(window, "blur", storm.freeze);
        storm.events.add(window, "focus", storm.resume);
      }
    }
    storm.resizeHandler();
    storm.scrollHandler();
    if (storm.followMouse) {
      storm.events.add(isIE ? document : window, "mousemove", storm.mouseMove);
    }
    storm.animationInterval = Math.max(20, storm.animationInterval);
    storm.timerInit();
  };

  this.start = function (bFromOnLoad) {
    if (!didInit) {
      didInit = true;
    } else if (bFromOnLoad) {
      // already loaded and running
      return true;
    }
    if (typeof storm.targetElement === "string") {
      var targetID = storm.targetElement;
      storm.targetElement = document.getElementById(targetID);
      if (!storm.targetElement) {
        throw new Error(
          'Snowstorm: Unable to get targetElement "' + targetID + '"'
        );
      }
    }
    if (!storm.targetElement) {
      storm.targetElement = document.body || document.documentElement;
    }
    if (
      storm.targetElement !== document.documentElement &&
      storm.targetElement !== document.body
    ) {
      // re-map handler to get element instead of screen dimensions
      storm.resizeHandler = storm.resizeHandlerAlt;
      //and force-enable pixel positioning
      storm.usePixelPosition = true;
    }
    storm.resizeHandler(); // get bounding box elements
    storm.usePositionFixed =
      storm.usePositionFixed && !noFixed && !storm.flakeBottom; // whether or not position:fixed is to be used
    if (window.getComputedStyle) {
      // attempt to determine if body or user-specified snow parent element is relatlively-positioned.
      try {
        targetElementIsRelative =
          window
            .getComputedStyle(storm.targetElement, null)
            .getPropertyValue("position") === "relative";
      } catch (e) {
        // oh well
        targetElementIsRelative = false;
      }
    }
    fixedForEverything = storm.usePositionFixed;
    if (screenX && screenY && !storm.disabled) {
      storm.init();
      storm.active = true;
    }
  };

  function doDelayedStart() {
    window.setTimeout(function () {
      storm.start(true);
    }, 20);
    // event cleanup
    storm.events.remove(isIE ? document : window, "mousemove", doDelayedStart);
  }

  function doStart() {
    if (!storm.excludeMobile || !isMobile) {
      doDelayedStart();
    }
    // event cleanup
    storm.events.remove(window, "load", doStart);
  }

  // hooks for starting the snow
  if (storm.autoStart) {
    storm.events.add(window, "load", doStart, false);
  }

  return this;
})(window, document);
