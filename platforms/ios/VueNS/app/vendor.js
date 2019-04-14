(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["vendor"],{

/***/ "../node_modules/css-loader/lib/css-base.js":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media " + item[2] + "{" + content + "}";
      } else {
        return content;
      }
    }).join("");
  }; // import a list of modules into the list


  list.i = function (modules, mediaQuery) {
    if (typeof modules === "string") modules = [[null, modules, ""]];
    var alreadyImportedModules = {};

    for (var i = 0; i < this.length; i++) {
      var id = this[i][0];
      if (typeof id === "number") alreadyImportedModules[id] = true;
    }

    for (i = 0; i < modules.length; i++) {
      var item = modules[i]; // skip already imported module
      // this implementation is not 100% perfect for weird media query combinations
      //  when a module is imported multiple times with different media queries.
      //  I hope this will never occur (Hey this way we have smaller bundles)

      if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
        if (mediaQuery && !item[2]) {
          item[2] = mediaQuery;
        } else if (mediaQuery) {
          item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
        }

        list.push(item);
      }
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || '';
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;
  return '/*# ' + data + ' */';
}

/***/ }),

/***/ "../node_modules/nativescript-dev-webpack/load-application-css-regular.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {const loadCss = __webpack_require__("../node_modules/nativescript-dev-webpack/load-application-css.js");

module.exports = function () {
  loadCss(function () {
    const appCssContext = __webpack_require__("./ sync ^\\.\\/app\\.(css|scss|less|sass)$");

    global.registerWebpackModules(appCssContext);
  });
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/nativescript-dev-webpack/load-application-css.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = function (loadModuleFn) {
  const application = __webpack_require__("tns-core-modules/application");

  __webpack_require__("tns-core-modules/ui/styling/style-scope");

  loadModuleFn();
  application.loadAppCss();
};

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/admob/admob-common.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AD_SIZE = {
  SMART_BANNER: "SMART",
  LARGE_BANNER: "LARGE",
  BANNER: "BANNER",
  MEDIUM_RECTANGLE: "MEDIUM",
  FULL_BANNER: "FULL",
  LEADERBOARD: "LEADERBOARD",
  SKYSCRAPER: "SKYSCRAPER",
  FLUID: "FLUID"
};
exports.BANNER_DEFAULTS = {
  margins: {
    top: -1,
    bottom: -1
  },
  testing: false,
  size: "SMART",
  view: undefined
};
exports.rewardedVideoCallbacks = {
  onRewarded: function (reward) {
    return console.warn("onRewarded callback not set - the fallback implementation caught this reward: " + JSON.stringify(reward));
  },
  onLeftApplication: function () {},
  onClosed: function () {},
  onOpened: function () {},
  onStarted: function () {},
  onCompleted: function () {},
  onLoaded: function () {},
  onFailedToLoad: function (err) {
    return console.warn("onFailedToLoad not set - the fallback implementation caught this error: " + err);
  }
};

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/admob/admob.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var platform_1 = __webpack_require__("tns-core-modules/platform/platform");

var enums_1 = __webpack_require__("tns-core-modules/ui/enums/enums");

var utils_1 = __webpack_require__("tns-core-modules/utils/utils");

var firebase_common_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/firebase-common.js");

var admob_common_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/admob/admob-common.js");

exports.AD_SIZE = admob_common_1.AD_SIZE;
var _bannerOptions = undefined;
var _rewardBasedVideoAdDelegate = undefined;

function showBanner(arg) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof GADRequest === "undefined") {
        reject("Uncomment AdMob in the plugin's Podfile first");
        return;
      }

      if (firebase_common_1.firebase.admob.adView !== null && firebase_common_1.firebase.admob.adView !== undefined) {
        firebase_common_1.firebase.admob.adView.removeFromSuperview();
        firebase_common_1.firebase.admob.adView = null;
      }

      admob_common_1.BANNER_DEFAULTS.view = utils_1.ios.getter(UIApplication, UIApplication.sharedApplication).keyWindow.rootViewController.view;
      var settings = firebase_common_1.firebase.merge(arg, admob_common_1.BANNER_DEFAULTS);
      _bannerOptions = settings;
      var view = settings.view;

      var bannerType = _getBannerType(settings.size);

      var adWidth = bannerType.size.width === 0 ? view.frame.size.width : bannerType.size.width;
      var adHeight = bannerType.size.smartHeight ? bannerType.size.smartHeight : bannerType.size.height;
      var originX = (view.frame.size.width - adWidth) / 2;
      var originY = settings.margins.top > -1 ? settings.margins.top : settings.margins.bottom > -1 ? view.frame.size.height - adHeight - settings.margins.bottom : 0.0;
      var origin_1 = CGPointMake(originX, originY);
      firebase_common_1.firebase.admob.adView = GADBannerView.alloc().initWithAdSizeOrigin(bannerType, origin_1);
      firebase_common_1.firebase.admob.adView.adUnitID = settings.iosBannerId;
      var adRequest = GADRequest.request();

      if (settings.testing) {
        var testDevices = [];

        try {
          testDevices.push("Simulator");
        } catch (ignore) {}

        if (settings.iosTestDeviceIds) {
          testDevices = testDevices.concat(settings.iosTestDeviceIds);
        }

        adRequest.testDevices = testDevices;
      }

      if (settings.keywords !== undefined) {
        adRequest.keywords = settings.keywords;
      }

      firebase_common_1.firebase.admob.adView.rootViewController = utils_1.ios.getter(UIApplication, UIApplication.sharedApplication).keyWindow.rootViewController;
      firebase_common_1.firebase.admob.adView.loadRequest(adRequest);
      view.addSubview(firebase_common_1.firebase.admob.adView);
      resolve();
    } catch (ex) {
      console.log("Error in firebase.admob.showBanner: " + ex);
      reject(ex);
    }
  });
}

exports.showBanner = showBanner;

function preloadInterstitial(arg) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof GADRequest === "undefined") {
        reject("Uncomment AdMob in the plugin's Podfile first");
        return;
      }

      var settings = firebase_common_1.firebase.merge(arg, admob_common_1.BANNER_DEFAULTS);
      firebase_common_1.firebase.admob.interstitialView = GADInterstitial.alloc().initWithAdUnitID(settings.iosInterstitialId);
      var delegate_1 = GADInterstitialDelegateImpl.new().initWithCallback(function (ad, error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve();
        }
      }, function () {
        arg.onAdClosed && arg.onAdClosed();
        CFRelease(delegate_1);
        delegate_1 = undefined;
      });
      CFRetain(delegate_1);
      firebase_common_1.firebase.admob.interstitialView.delegate = delegate_1;
      var adRequest = GADRequest.request();

      if (settings.testing) {
        var testDevices = [];

        try {
          testDevices.push("Simulator");
        } catch (ignore) {}

        if (settings.iosTestDeviceIds) {
          testDevices = testDevices.concat(settings.iosTestDeviceIds);
        }

        adRequest.testDevices = testDevices;
      }

      firebase_common_1.firebase.admob.interstitialView.loadRequest(adRequest);
    } catch (ex) {
      console.log("Error in firebase.admob.preloadInterstitial: " + ex);
      reject(ex);
    }
  });
}

exports.preloadInterstitial = preloadInterstitial;

function showInterstitial(arg) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof GADRequest === "undefined") {
        reject("Uncomment AdMob in the plugin's Podfile first");
        return;
      }

      if (!arg) {
        if (firebase_common_1.firebase.admob.interstitialView) {
          firebase_common_1.firebase.admob.interstitialView.presentFromRootViewController(utils_1.ios.getter(UIApplication, UIApplication.sharedApplication).keyWindow.rootViewController);
          resolve();
        } else {
          reject("Please call 'preloadInterstitial' first");
        }

        return;
      }

      var settings = firebase_common_1.firebase.merge(arg, admob_common_1.BANNER_DEFAULTS);
      firebase_common_1.firebase.admob.interstitialView = GADInterstitial.alloc().initWithAdUnitID(settings.iosInterstitialId);
      var delegate_2 = GADInterstitialDelegateImpl.new().initWithCallback(function (ad, error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          firebase_common_1.firebase.admob.interstitialView.presentFromRootViewController(utils_1.ios.getter(UIApplication, UIApplication.sharedApplication).keyWindow.rootViewController);
          resolve();
        }

        CFRelease(delegate_2);
        delegate_2 = undefined;
      });
      CFRetain(delegate_2);
      firebase_common_1.firebase.admob.interstitialView.delegate = delegate_2;
      var adRequest = GADRequest.request();

      if (settings.testing) {
        var testDevices = [];

        try {
          testDevices.push("Simulator");
        } catch (ignore) {}

        if (settings.iosTestDeviceIds) {
          testDevices = testDevices.concat(settings.iosTestDeviceIds);
        }

        adRequest.testDevices = testDevices;
      }

      firebase_common_1.firebase.admob.interstitialView.loadRequest(adRequest);
    } catch (ex) {
      console.log("Error in firebase.admob.showInterstitial: " + ex);
      reject(ex);
    }
  });
}

exports.showInterstitial = showInterstitial;

function preloadRewardedVideoAd(arg) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof GADRequest === "undefined") {
        reject("Enable AdMob first - see the plugin documentation");
        return;
      }

      var onLoaded = function () {
        return resolve();
      };

      var onError = function (err) {
        return reject(err);
      };

      _rewardBasedVideoAdDelegate = GADRewardBasedVideoAdDelegateImpl.new().initWithCallback(onLoaded, onError);
      CFRetain(_rewardBasedVideoAdDelegate);
      firebase_common_1.firebase.admob.rewardedAdVideoView = GADRewardBasedVideoAd.sharedInstance();
      firebase_common_1.firebase.admob.rewardedAdVideoView.delegate = _rewardBasedVideoAdDelegate;
      var settings = firebase_common_1.firebase.merge(arg, admob_common_1.BANNER_DEFAULTS);
      var adRequest = GADRequest.request();

      if (settings.testing) {
        var testDevices = [];

        try {
          testDevices.push("Simulator");
        } catch (ignore) {}

        if (settings.iosTestDeviceIds) {
          testDevices = testDevices.concat(settings.iosTestDeviceIds);
        }

        adRequest.testDevices = testDevices;
      }

      firebase_common_1.firebase.admob.rewardedAdVideoView.loadRequestWithAdUnitID(adRequest, settings.iosAdPlacementId);
    } catch (ex) {
      console.log("Error in firebase.admob.preloadRewardedVideoAd: " + ex);
      reject(ex);
    }
  });
}

exports.preloadRewardedVideoAd = preloadRewardedVideoAd;

function showRewardedVideoAd(arg) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof GADRequest === "undefined") {
        reject("Enable AdMob first - see the plugin documentation");
        return;
      }

      if (!firebase_common_1.firebase.admob.rewardedAdVideoView) {
        reject("Please call 'preloadRewardedVideoAd' first");
        return;
      }

      if (arg.onRewarded) {
        admob_common_1.rewardedVideoCallbacks.onRewarded = arg.onRewarded;
      }

      if (arg.onLeftApplication) {
        admob_common_1.rewardedVideoCallbacks.onLeftApplication = arg.onLeftApplication;
      }

      if (arg.onClosed) {
        admob_common_1.rewardedVideoCallbacks.onClosed = arg.onClosed;
      }

      if (arg.onOpened) {
        admob_common_1.rewardedVideoCallbacks.onOpened = arg.onOpened;
      }

      if (arg.onStarted) {
        admob_common_1.rewardedVideoCallbacks.onStarted = arg.onStarted;
      }

      if (arg.onCompleted) {
        admob_common_1.rewardedVideoCallbacks.onCompleted = arg.onCompleted;
      }

      firebase_common_1.firebase.admob.rewardedAdVideoView.presentFromRootViewController(utils_1.ios.getter(UIApplication, UIApplication.sharedApplication).keyWindow.rootViewController);
      resolve();
    } catch (ex) {
      console.log("Error in firebase.admob.showRewardedVideoAd: " + ex);
      reject(ex);
    }
  });
}

exports.showRewardedVideoAd = showRewardedVideoAd;

function hideBanner() {
  return new Promise(function (resolve, reject) {
    try {
      if (firebase_common_1.firebase.admob.adView !== null) {
        firebase_common_1.firebase.admob.adView.removeFromSuperview();
        firebase_common_1.firebase.admob.adView = null;
      }

      resolve();
    } catch (ex) {
      console.log("Error in firebase.admob.hideBanner: " + ex);
      reject(ex);
    }
  });
}

exports.hideBanner = hideBanner;

function _getBannerType(size) {
  if (size === admob_common_1.AD_SIZE.BANNER) {
    return {
      "size": {
        "width": 320,
        "height": 50
      },
      "flags": 0
    };
  } else if (size === admob_common_1.AD_SIZE.LARGE_BANNER) {
    return {
      "size": {
        "width": 320,
        "height": 100
      },
      "flags": 0
    };
  } else if (size === admob_common_1.AD_SIZE.MEDIUM_RECTANGLE) {
    return {
      "size": {
        "width": 300,
        "height": 250
      },
      "flags": 0
    };
  } else if (size === admob_common_1.AD_SIZE.FULL_BANNER) {
    return {
      "size": {
        "width": 468,
        "height": 60
      },
      "flags": 0
    };
  } else if (size === admob_common_1.AD_SIZE.LEADERBOARD) {
    return {
      "size": {
        "width": 728,
        "height": 90
      },
      "flags": 0
    };
  } else if (size === admob_common_1.AD_SIZE.SKYSCRAPER) {
    return {
      "size": {
        "width": 120,
        "height": 600
      },
      "flags": 0
    };
  } else if (size === admob_common_1.AD_SIZE.SMART_BANNER || size === admob_common_1.AD_SIZE.FLUID) {
    var orientation_1 = utils_1.ios.getter(UIDevice, UIDevice.currentDevice).orientation;
    var isIPad = platform_1.device.deviceType === enums_1.DeviceType.Tablet;

    if (orientation_1 === 1 || orientation_1 === 2) {
      return {
        "size": {
          "width": 0,
          "height": 0,
          "smartHeight": isIPad ? 90 : 50
        },
        "flags": 18
      };
    } else {
      return {
        "size": {
          "width": 0,
          "height": 0,
          "smartHeight": isIPad ? 90 : 32
        },
        "flags": 26
      };
    }
  } else {
    return {
      "size": {
        "width": -1,
        "height": -1
      },
      "flags": 0
    };
  }
}

var GADInterstitialDelegateImpl = function (_super) {
  __extends(GADInterstitialDelegateImpl, _super);

  function GADInterstitialDelegateImpl() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  GADInterstitialDelegateImpl.new = function () {
    if (GADInterstitialDelegateImpl.ObjCProtocols.length === 0 && typeof GADInterstitialDelegate !== "undefined") {
      GADInterstitialDelegateImpl.ObjCProtocols.push(GADInterstitialDelegate);
    }

    return _super.new.call(this);
  };

  GADInterstitialDelegateImpl.prototype.initWithCallback = function (callback, onAdCloseCallback) {
    if (onAdCloseCallback === void 0) {
      onAdCloseCallback = null;
    }

    this.callback = callback;
    this.onAdCloseCallback = onAdCloseCallback;
    return this;
  };

  GADInterstitialDelegateImpl.prototype.interstitialDidReceiveAd = function (ad) {
    this.callback(ad);
  };

  GADInterstitialDelegateImpl.prototype.interstitialDidDismissScreen = function (ad) {
    this.onAdCloseCallback();
  };

  GADInterstitialDelegateImpl.prototype.interstitialDidFailToReceiveAdWithError = function (ad, error) {
    this.callback(ad, error);
  };

  GADInterstitialDelegateImpl.ObjCProtocols = [];
  return GADInterstitialDelegateImpl;
}(NSObject);

var GADRewardBasedVideoAdDelegateImpl = function (_super) {
  __extends(GADRewardBasedVideoAdDelegateImpl, _super);

  function GADRewardBasedVideoAdDelegateImpl() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  GADRewardBasedVideoAdDelegateImpl.new = function () {
    if (GADRewardBasedVideoAdDelegateImpl.ObjCProtocols.length === 0 && typeof GADRewardBasedVideoAdDelegate !== "undefined") {
      GADRewardBasedVideoAdDelegateImpl.ObjCProtocols.push(GADRewardBasedVideoAdDelegate);
    }

    return _super.new.call(this);
  };

  GADRewardBasedVideoAdDelegateImpl.prototype.initWithCallback = function (loaded, error) {
    this._loaded = loaded;
    this._error = error;
    return this;
  };

  GADRewardBasedVideoAdDelegateImpl.prototype.rewardBasedVideoAdDidClose = function (rewardBasedVideoAd) {
    firebase_common_1.firebase.admob.rewardedAdVideoView = undefined;
    admob_common_1.rewardedVideoCallbacks.onClosed();
    setTimeout(function () {
      CFRelease(_rewardBasedVideoAdDelegate);
      _rewardBasedVideoAdDelegate = undefined;
    });
  };

  GADRewardBasedVideoAdDelegateImpl.prototype.rewardBasedVideoAdDidCompletePlaying = function (rewardBasedVideoAd) {
    admob_common_1.rewardedVideoCallbacks.onCompleted();
  };

  GADRewardBasedVideoAdDelegateImpl.prototype.rewardBasedVideoAdDidFailToLoadWithError = function (rewardBasedVideoAd, error) {
    this._error(error.localizedDescription);
  };

  GADRewardBasedVideoAdDelegateImpl.prototype.rewardBasedVideoAdDidOpen = function (rewardBasedVideoAd) {
    admob_common_1.rewardedVideoCallbacks.onOpened();
  };

  GADRewardBasedVideoAdDelegateImpl.prototype.rewardBasedVideoAdDidReceiveAd = function (rewardBasedVideoAd) {
    this._loaded();
  };

  GADRewardBasedVideoAdDelegateImpl.prototype.rewardBasedVideoAdDidRewardUserWithReward = function (rewardBasedVideoAd, reward) {
    admob_common_1.rewardedVideoCallbacks.onRewarded({
      amount: reward.amount ? reward.amount.doubleValue : undefined,
      type: reward.type
    });
  };

  GADRewardBasedVideoAdDelegateImpl.prototype.rewardBasedVideoAdDidStartPlaying = function (rewardBasedVideoAd) {
    admob_common_1.rewardedVideoCallbacks.onStarted();
  };

  GADRewardBasedVideoAdDelegateImpl.prototype.rewardBasedVideoAdWillLeaveApplication = function (rewardBasedVideoAd) {
    admob_common_1.rewardedVideoCallbacks.onLeftApplication();
  };

  GADRewardBasedVideoAdDelegateImpl.ObjCProtocols = [];
  return GADRewardBasedVideoAdDelegateImpl;
}(NSObject);

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/analytics/analytics.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function logEvent(options) {
  return new Promise(function (resolve, reject) {
    try {
      if (options.key === undefined) {
        reject("Argument 'key' is missing");
        return;
      }

      var dic = NSMutableDictionary.new();

      if (options.parameters !== undefined) {
        for (var p in options.parameters) {
          var param = options.parameters[p];

          if (param.value !== undefined) {
            dic.setObjectForKey(param.value, param.key);
          }
        }
      }

      FIRAnalytics.logEventWithNameParameters(options.key, dic);
      resolve();
    } catch (ex) {
      console.log("Error in firebase.analytics.logEvent: " + ex);
      reject(ex);
    }
  });
}

exports.logEvent = logEvent;

function logComplexEvent(options) {
  return new Promise(function (resolve, reject) {
    try {
      var dic = NSMutableDictionary.new();

      if (options.parameters !== undefined) {
        for (var p in options.parameters) {
          var param = options.parameters[p];

          if (param.type === "array" && param.value !== undefined) {
            var listArray = new Array();

            for (var val in param.value) {
              var value = param.value[val];

              if (value.parameters !== undefined) {
                var dicTemp = NSMutableDictionary.new();

                for (var i in value.parameters) {
                  var item = value.parameters[i];

                  if (item.type !== "array" && item.value !== undefined && item.key !== undefined) {
                    dicTemp.setObjectForKey(item.value, item.key);
                  }
                }

                listArray.push(dicTemp);
              }
            }

            dic.setObjectForKey(listArray, param.key);
          } else if (param.type === "string" || param.type === "double" || param.type === "float" || param.type === "int" || param.type === "long" || param.type === "boolean") {
            dic.setObjectForKey(param.value, param.key);
          }
        }
      }

      FIRAnalytics.logEventWithNameParameters(options.key, dic);
      resolve();
    } catch (ex) {
      console.log("Error in firebase.analytics.logEvent: " + ex);
      reject(ex);
    }
  });
}

exports.logComplexEvent = logComplexEvent;

function setUserId(arg) {
  return new Promise(function (resolve, reject) {
    try {
      if (arg.userId === undefined) {
        reject("Argument 'userId' is missing");
        return;
      }

      FIRAnalytics.setUserID(arg.userId);
      resolve();
    } catch (ex) {
      console.log("Error in firebase.analytics.setUserId: " + ex);
      reject(ex);
    }
  });
}

exports.setUserId = setUserId;

function setUserProperty(options) {
  return new Promise(function (resolve, reject) {
    try {
      if (options.key === undefined) {
        reject("Argument 'key' is missing");
        return;
      }

      if (options.value === undefined) {
        reject("Argument 'value' is missing");
        return;
      }

      FIRAnalytics.setUserPropertyStringForName(options.value, options.key);
      resolve();
    } catch (ex) {
      console.log("Error in firebase.analytics.setUserProperty: " + ex);
      reject(ex);
    }
  });
}

exports.setUserProperty = setUserProperty;

function setScreenName(options) {
  return new Promise(function (resolve, reject) {
    try {
      if (options.screenName === undefined) {
        reject("Argument 'screenName' is missing");
        return;
      }

      FIRAnalytics.setScreenNameScreenClass(options.screenName, null);
      resolve();
    } catch (ex) {
      console.log("Error in firebase.analytics.setScreenName: " + ex);
      reject(ex);
    }
  });
}

exports.setScreenName = setScreenName;

function setAnalyticsCollectionEnabled(enabled) {
  FIRAnalytics.setAnalyticsCollectionEnabled(enabled);
}

exports.setAnalyticsCollectionEnabled = setAnalyticsCollectionEnabled;

function setSessionTimeoutDuration(seconds) {
  FIRAnalytics.setSessionTimeoutInterval(seconds);
}

exports.setSessionTimeoutDuration = setSessionTimeoutDuration;

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/crashlytics/crashlytics.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function sendCrashLog(exception) {
  if (isCrashlyticsAvailable()) {
    Crashlytics.sharedInstance().recordError(exception);
  }
}

exports.sendCrashLog = sendCrashLog;

function log(msg, tag, priority) {
  if (isCrashlyticsAvailable()) {
    if (tag) {
      TNSCrashlyticsLoggerWrapper.log(tag + " - " + msg);
    } else {
      TNSCrashlyticsLoggerWrapper.log(msg);
    }
  }
}

exports.log = log;

function setString(key, value) {
  if (isCrashlyticsAvailable()) {
    Crashlytics.sharedInstance().setObjectValueForKey(value, key);
  }
}

exports.setString = setString;

function setBool(key, value) {
  if (isCrashlyticsAvailable()) {
    Crashlytics.sharedInstance().setBoolValueForKey(value, key);
  }
}

exports.setBool = setBool;

function setFloat(key, value) {
  if (isCrashlyticsAvailable()) {
    Crashlytics.sharedInstance().setFloatValueForKey(value, key);
  }
}

exports.setFloat = setFloat;

function setInt(key, value) {
  if (isCrashlyticsAvailable()) {
    Crashlytics.sharedInstance().setIntValueForKey(value, key);
  }
}

exports.setInt = setInt;

function setDouble(key, value) {
  if (isCrashlyticsAvailable()) {
    Crashlytics.sharedInstance().setFloatValueForKey(value, key);
  }
}

exports.setDouble = setDouble;

function setUserId(id) {
  if (isCrashlyticsAvailable()) {
    Crashlytics.sharedInstance().setUserIdentifier(id);
  }
}

exports.setUserId = setUserId;

function crash() {
  if (isCrashlyticsAvailable()) {
    Crashlytics.sharedInstance().crash();
  }
}

exports.crash = crash;

function isCrashlyticsAvailable() {
  if (typeof Crashlytics === "undefined") {
    console.log("Add 'crashlytics: true' to firebase.nativescript.json and remove the platforms folder");
    return false;
  }

  return true;
}

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/firebase-common.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var dialogs_1 = __webpack_require__("tns-core-modules/ui/dialogs");

var application_settings_1 = __webpack_require__("tns-core-modules/application-settings");

var admob = __webpack_require__("../node_modules/nativescript-plugin-firebase/admob/admob.js");

var analytics = __webpack_require__("../node_modules/nativescript-plugin-firebase/analytics/analytics.js");

var crashlytics = __webpack_require__("../node_modules/nativescript-plugin-firebase/crashlytics/crashlytics.js");

var performance = __webpack_require__("../node_modules/nativescript-plugin-firebase/performance/performance.js");

var storage = __webpack_require__("../node_modules/nativescript-plugin-firebase/storage/storage.js");

var mlkit = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/index.js");

var FieldValue = function () {
  function FieldValue(type, value) {
    this.type = type;
    this.value = value;
  }

  FieldValue.serverTimestamp = function () {
    return "SERVER_TIMESTAMP";
  };

  FieldValue.delete = function () {
    return "DELETE_FIELD";
  };

  FieldValue.arrayUnion = function () {
    var elements = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      elements[_i] = arguments[_i];
    }

    return new FieldValue("ARRAY_UNION", elements);
  };

  FieldValue.arrayRemove = function () {
    var elements = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      elements[_i] = arguments[_i];
    }

    return new FieldValue("ARRAY_REMOVE", elements);
  };

  return FieldValue;
}();

exports.FieldValue = FieldValue;

var GeoPoint = function () {
  function GeoPoint(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  return GeoPoint;
}();

exports.GeoPoint = GeoPoint;
exports.firebase = {
  initialized: false,
  instance: null,
  firebaseRemoteConfig: null,
  currentAdditionalUserInfo: null,
  authStateListeners: [],
  _receivedNotificationCallback: null,
  _dynamicLinkCallback: null,
  admob: admob,
  analytics: analytics,
  crashlytics: crashlytics,
  performance: performance,
  storage: storage,
  mlkit: mlkit,
  firestore: {
    FieldValue: FieldValue,
    GeoPoint: function (latitude, longitude) {
      return new GeoPoint(latitude, longitude);
    }
  },
  invites: {
    MATCH_TYPE: {
      WEAK: 0,
      STRONG: 1
    }
  },
  dynamicLinks: {
    MATCH_CONFIDENCE: {
      WEAK: 0,
      STRONG: 1
    }
  },
  LoginType: {
    ANONYMOUS: "anonymous",
    PASSWORD: "password",
    PHONE: "phone",
    CUSTOM: "custom",
    FACEBOOK: "facebook",
    GOOGLE: "google",
    EMAIL_LINK: "emailLink"
  },
  LogComplexEventTypeParameter: {
    STRING: "string",
    INT: "int",
    FLOAT: "float",
    DOUBLE: "double",
    LONG: "long",
    ARRAY: "array",
    BOOLEAN: "boolean"
  },
  QueryOrderByType: {
    KEY: "key",
    VALUE: "value",
    CHILD: "child",
    PRIORITY: "priority"
  },
  QueryLimitType: {
    FIRST: "first",
    LAST: "last"
  },
  QueryRangeType: {
    START_AT: "startAt",
    END_AT: "endAt",
    EQUAL_TO: "equalTo"
  },
  addAuthStateListener: function (listener) {
    if (exports.firebase.authStateListeners.indexOf(listener) === -1) {
      exports.firebase.authStateListeners.push(listener);
    }

    return true;
  },
  removeAuthStateListener: function (listener) {
    var index = exports.firebase.authStateListeners.indexOf(listener);

    if (index >= 0) {
      exports.firebase.authStateListeners.splice(index, 1);
      return true;
    } else {
      return false;
    }
  },
  hasAuthStateListener: function (listener) {
    return exports.firebase.authStateListeners.indexOf(listener) >= 0;
  },
  notifyAuthStateListeners: function (data) {
    exports.firebase.authStateListeners.forEach(function (listener) {
      try {
        if (listener.thisArg) {
          listener.onAuthStateChanged.call(listener.thisArg, data);
        } else if (listener.onAuthStateChanged) {
          listener.onAuthStateChanged(data);
        } else {
          listener(data);
        }
      } catch (ex) {
        console.error("Firebase AuthStateListener failed to trigger", listener, ex);
      }
    });
  },
  rememberEmailForEmailLinkLogin: function (email) {
    application_settings_1.setString("FirebasePlugin.EmailLinkLogin", email);
  },
  getRememberedEmailForEmailLinkLogin: function () {
    return application_settings_1.getString("FirebasePlugin.EmailLinkLogin");
  },
  strongTypeify: function (value) {
    if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    } else if (parseFloat(value) === value) {
      value = parseFloat(value);
    } else if (parseInt(value) === value) {
      value = parseInt(value);
    }

    return value;
  },
  requestPhoneAuthVerificationCode: function (onUserResponse, verificationPrompt) {
    dialogs_1.prompt(verificationPrompt || "Verification code").then(function (promptResult) {
      if (!promptResult.result) {
        onUserResponse(undefined);
      } else {
        onUserResponse(promptResult.text);
      }
    });
  },
  moveLoginOptionsToObjects: function (loginOptions) {
    if (loginOptions.email) {
      console.log("Please update your code: the 'email' property is deprecated and now expected at 'passwordOptions.email'");

      if (!loginOptions.passwordOptions) {
        loginOptions.passwordOptions = {};
      }

      if (!loginOptions.passwordOptions.email) {
        loginOptions.passwordOptions.email = loginOptions.email;
      }
    }

    if (loginOptions.password) {
      console.log("Please update your code: the 'password' property is deprecated and now expected at 'passwordOptions.password'");

      if (!loginOptions.passwordOptions) {
        loginOptions.passwordOptions = {};
      }

      if (!loginOptions.passwordOptions.password) {
        loginOptions.passwordOptions.password = loginOptions.password;
      }
    }

    if (loginOptions.token) {
      console.log("Please update your code: the 'token' property is deprecated and now expected at 'customOptions.token'");

      if (!loginOptions.customOptions) {
        loginOptions.customOptions = {};
      }

      if (!loginOptions.customOptions.token) {
        loginOptions.customOptions.token = loginOptions.token;
      }
    }

    if (loginOptions.tokenProviderFn) {
      console.log("Please update your code: the 'tokenProviderFn' property is deprecated and now expected at 'customOptions.tokenProviderFn'");

      if (!loginOptions.customOptions) {
        loginOptions.customOptions = {};
      }

      if (!loginOptions.customOptions.tokenProviderFn) {
        loginOptions.customOptions.tokenProviderFn = loginOptions.tokenProviderFn;
      }
    }

    if (loginOptions.scope) {
      console.log("Please update your code: the 'scope' property is deprecated and now expected at 'facebookOptions.scope'");

      if (!loginOptions.facebookOptions) {
        loginOptions.facebookOptions = {};
      }

      if (!loginOptions.facebookOptions.scope) {
        loginOptions.facebookOptions.scope = loginOptions.scope;
      }
    }
  },
  merge: function (obj1, obj2) {
    var result = {};

    for (var i in obj1) {
      if (i in obj2 && typeof obj1[i] === "object" && i !== null) {
        result[i] = exports.firebase.merge(obj1[i], obj2[i]);
      } else {
        result[i] = obj1[i];
      }
    }

    for (var i in obj2) {
      if (i in result) {
        continue;
      }

      result[i] = obj2[i];
    }

    return result;
  }
};

var DocumentSnapshot = function () {
  function DocumentSnapshot(id, exists, documentData, ref) {
    this.id = id;
    this.exists = exists;
    this.ref = ref;

    this.data = function () {
      return exists ? documentData : undefined;
    };
  }

  return DocumentSnapshot;
}();

exports.DocumentSnapshot = DocumentSnapshot;

function isDocumentReference(object) {
  return object && object.discriminator === "docRef";
}

exports.isDocumentReference = isDocumentReference;

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/firebase.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var application = __webpack_require__("tns-core-modules/application/application");

var firebase_common_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/firebase-common.js");

var firebaseFunctions = __webpack_require__("../node_modules/nativescript-plugin-firebase/functions/functions.js");

var firebaseMessaging = __webpack_require__("../node_modules/nativescript-plugin-firebase/messaging/messaging.js");

var utils_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/utils.js");

firebase_common_1.firebase._gIDAuthentication = null;
firebase_common_1.firebase._cachedInvitation = null;
firebase_common_1.firebase._cachedDynamicLink = null;
firebase_common_1.firebase._configured = false;
var useExternalPushProvider = NSBundle.mainBundle.infoDictionary.objectForKey("UseExternalPushProvider") === true;
var initializeArguments;

var DocumentSnapshot = function (_super) {
  __extends(DocumentSnapshot, _super);

  function DocumentSnapshot(snapshot) {
    var _this = _super.call(this, snapshot.documentID, snapshot.exists, utils_1.firebaseUtils.toJsObject(snapshot.data()), firebase_common_1.firebase.firestore._getDocumentReference(snapshot.reference)) || this;

    _this.snapshot = snapshot;
    _this.metadata = {
      fromCache: _this.snapshot.metadata.fromCache,
      hasPendingWrites: _this.snapshot.metadata.pendingWrites
    };
    _this.ios = snapshot;
    return _this;
  }

  return DocumentSnapshot;
}(firebase_common_1.DocumentSnapshot);

firebase_common_1.firebase.authStateListener = null;
firebase_common_1.firebase.addOnMessageReceivedCallback = firebaseMessaging.addOnMessageReceivedCallback;
firebase_common_1.firebase.addOnPushTokenReceivedCallback = firebaseMessaging.addOnPushTokenReceivedCallback;
firebase_common_1.firebase.registerForPushNotifications = firebaseMessaging.registerForPushNotifications;
firebase_common_1.firebase.unregisterForPushNotifications = firebaseMessaging.unregisterForPushNotifications;
firebase_common_1.firebase.getCurrentPushToken = firebaseMessaging.getCurrentPushToken;
firebase_common_1.firebase.registerForInteractivePush = firebaseMessaging.registerForInteractivePush;
firebase_common_1.firebase.subscribeToTopic = firebaseMessaging.subscribeToTopic;
firebase_common_1.firebase.unsubscribeFromTopic = firebaseMessaging.unsubscribeFromTopic;
firebase_common_1.firebase.areNotificationsEnabled = firebaseMessaging.areNotificationsEnabled;
firebase_common_1.firebase.functions = firebaseFunctions;

firebase_common_1.firebase.addAppDelegateMethods = function (appDelegate) {
  appDelegate.prototype.applicationDidFinishLaunchingWithOptions = function (application, launchOptions) {
    if (!firebase_common_1.firebase._configured) {
      firebase_common_1.firebase._configured = true;

      if (typeof FIRApp !== "undefined") {
        FIRApp.configure();
      }
    }

    if (launchOptions) {
      var remoteNotification = launchOptions.objectForKey(UIApplicationLaunchOptionsRemoteNotificationKey);

      if (remoteNotification) {
        firebaseMessaging.handleRemoteNotification(application, remoteNotification);
      }
    }

    if (typeof FBSDKApplicationDelegate !== "undefined") {
      FBSDKApplicationDelegate.sharedInstance().applicationDidFinishLaunchingWithOptions(application, launchOptions);
    }

    return true;
  };

  if (typeof FBSDKApplicationDelegate !== "undefined" || typeof GIDSignIn !== "undefined" || typeof FIRInvites !== "undefined" || typeof FIRDynamicLink !== "undefined") {
    appDelegate.prototype.applicationOpenURLSourceApplicationAnnotation = function (application, url, sourceApplication, annotation) {
      var result = false;

      if (typeof FBSDKApplicationDelegate !== "undefined") {
        result = FBSDKApplicationDelegate.sharedInstance().applicationOpenURLSourceApplicationAnnotation(application, url, sourceApplication, annotation);
      }

      if (typeof GIDSignIn !== "undefined") {
        result = result || GIDSignIn.sharedInstance().handleURLSourceApplicationAnnotation(url, sourceApplication, annotation);
      }

      if (typeof FIRInvites !== "undefined") {
        var receivedInvite = FIRInvites.handleURLSourceApplicationAnnotation(url, sourceApplication, annotation);

        if (receivedInvite) {
          console.log("Deep link from " + sourceApplication + ", Invite ID: " + receivedInvite.inviteId + ", App URL: " + receivedInvite.deepLink);
          firebase_common_1.firebase._cachedInvitation = {
            deepLink: receivedInvite.deepLink,
            matchType: receivedInvite.matchType,
            invitationId: receivedInvite.inviteId
          };
          result = true;
        }
      }

      if (typeof FIRDynamicLink !== "undefined") {
        var dynamicLink = FIRDynamicLinks.dynamicLinks().dynamicLinkFromCustomSchemeURL(url);

        if (dynamicLink) {
          firebase_common_1.firebase._cachedDynamicLink = {
            url: dynamicLink.url.absoluteString,
            minimumAppVersion: dynamicLink.minimumAppVersion
          };
          result = true;
        }
      }

      return result;
    };
  }

  if (typeof FBSDKApplicationDelegate !== "undefined" || typeof GIDSignIn !== "undefined" || typeof FIRDynamicLink !== "undefined") {
    appDelegate.prototype.applicationOpenURLOptions = function (application, url, options) {
      var result = false;

      if (typeof FBSDKApplicationDelegate !== "undefined") {
        result = FBSDKApplicationDelegate.sharedInstance().applicationOpenURLSourceApplicationAnnotation(application, url, options.valueForKey(UIApplicationOpenURLOptionsSourceApplicationKey), options.valueForKey(UIApplicationOpenURLOptionsAnnotationKey));
      }

      if (typeof GIDSignIn !== "undefined") {
        result = result || GIDSignIn.sharedInstance().handleURLSourceApplicationAnnotation(url, options.valueForKey(UIApplicationOpenURLOptionsSourceApplicationKey), options.valueForKey(UIApplicationOpenURLOptionsAnnotationKey));
      }

      if (typeof FIRDynamicLink !== "undefined") {
        var dynamicLinks = FIRDynamicLinks.dynamicLinks();
        var dynamicLink = dynamicLinks.dynamicLinkFromCustomSchemeURL(url);

        if (dynamicLink && dynamicLink.url !== null) {
          if (firebase_common_1.firebase._dynamicLinkCallback) {
            firebase_common_1.firebase._dynamicLinkCallback({
              url: dynamicLink.url.absoluteString,
              minimumAppVersion: dynamicLink.minimumAppVersion
            });
          } else {
            firebase_common_1.firebase._cachedDynamicLink = {
              url: dynamicLink.url.absoluteString,
              minimumAppVersion: dynamicLink.minimumAppVersion
            };
          }

          result = true;
        }
      }

      return result;
    };
  }

  if (typeof FIRDynamicLink !== "undefined") {
    appDelegate.prototype.applicationContinueUserActivityRestorationHandler = function (application, userActivity, restorationHandler) {
      var result = false;

      if (userActivity.webpageURL) {
        var fAuth_1 = typeof FIRAuth !== "undefined" ? FIRAuth.auth() : undefined;

        if (fAuth_1 && fAuth_1.isSignInWithEmailLink(userActivity.webpageURL.absoluteString)) {
          var rememberedEmail_1 = firebase_common_1.firebase.getRememberedEmailForEmailLinkLogin();

          if (rememberedEmail_1 !== undefined) {
            if (fAuth_1.currentUser) {
              var onCompletionLink = function (result, error) {
                if (error) {
                  fAuth_1.signInWithEmailLinkCompletion(rememberedEmail_1, userActivity.webpageURL.absoluteString, function (authData, error) {
                    if (!error) {
                      firebase_common_1.firebase.notifyAuthStateListeners({
                        loggedIn: true,
                        user: toLoginResult(authData.user)
                      });
                    }
                  });
                } else {
                  firebase_common_1.firebase.notifyAuthStateListeners({
                    loggedIn: true,
                    user: toLoginResult(result.user)
                  });
                }
              };

              var fIRAuthCredential = FIREmailAuthProvider.credentialWithEmailLink(rememberedEmail_1, userActivity.webpageURL.absoluteString);
              fAuth_1.currentUser.linkAndRetrieveDataWithCredentialCompletion(fIRAuthCredential, onCompletionLink);
            } else {
              fAuth_1.signInWithEmailLinkCompletion(rememberedEmail_1, userActivity.webpageURL.absoluteString, function (authData, error) {
                if (error) {
                  console.log(error.localizedDescription);
                } else {
                  firebase_common_1.firebase.notifyAuthStateListeners({
                    loggedIn: true,
                    user: toLoginResult(authData.user)
                  });
                }
              });
            }
          }

          result = true;
        } else {
          result = FIRDynamicLinks.dynamicLinks().handleUniversalLinkCompletion(userActivity.webpageURL, function (dynamicLink, error) {
            if (dynamicLink.url !== null) {
              if (firebase_common_1.firebase._dynamicLinkCallback) {
                firebase_common_1.firebase._dynamicLinkCallback({
                  url: dynamicLink.url.absoluteString,
                  minimumAppVersion: dynamicLink.minimumAppVersion
                });
              } else {
                firebase_common_1.firebase._cachedDynamicLink = {
                  url: dynamicLink.url.absoluteString,
                  minimumAppVersion: dynamicLink.minimumAppVersion
                };
              }
            }
          });
        }
      }

      return result;
    };
  }

  if (typeof FIRMessaging !== "undefined" || useExternalPushProvider) {
    firebaseMessaging.addBackgroundRemoteNotificationHandler(appDelegate);
  }
};

firebase_common_1.firebase.fetchProvidersForEmail = function (email) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof email !== "string") {
        reject("A parameter representing an email address is required.");
        return;
      }

      FIRAuth.auth().fetchProvidersForEmailCompletion(email, function (providerNSArray, error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve(utils_1.firebaseUtils.toJsObject(providerNSArray));
        }
      });
    } catch (ex) {
      console.log("Error in firebase.fetchProvidersForEmail: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.fetchSignInMethodsForEmail = function (email) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof email !== "string") {
        reject("A parameter representing an email address is required.");
        return;
      }

      FIRAuth.auth().fetchSignInMethodsForEmailCompletion(email, function (methodsNSArray, error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve(utils_1.firebaseUtils.toJsObject(methodsNSArray));
        }
      });
    } catch (ex) {
      console.log("Error in firebase.fetchSignInMethodsForEmail: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.addOnDynamicLinkReceivedCallback = function (callback) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof FIRDynamicLink === "undefined") {
        reject("Enable FIRInvites in Podfile first");
        return;
      }

      firebase_common_1.firebase._dynamicLinkCallback = callback;

      if (firebase_common_1.firebase._cachedDynamicLink !== null) {
        callback(firebase_common_1.firebase._cachedDynamicLink);
        firebase_common_1.firebase._cachedDynamicLink = null;
      }

      resolve();
    } catch (ex) {
      console.log("Error in firebase.addOnDynamicLinkReceivedCallback: " + ex);
      reject(ex);
    }
  });
};

if (typeof FIRMessaging !== "undefined" || useExternalPushProvider) {
  firebaseMessaging.prepAppDelegate();
}

function getAppDelegate() {
  if (application.ios.delegate === undefined) {
    var UIApplicationDelegateImpl = function (_super) {
      __extends(UIApplicationDelegateImpl, _super);

      function UIApplicationDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      UIApplicationDelegateImpl = __decorate([ObjCClass(UIApplicationDelegate)], UIApplicationDelegateImpl);
      return UIApplicationDelegateImpl;
    }(UIResponder);

    application.ios.delegate = UIApplicationDelegateImpl;
  }

  return application.ios.delegate;
}

firebase_common_1.firebase.addAppDelegateMethods(getAppDelegate());

firebase_common_1.firebase.getCallbackData = function (type, snapshot) {
  return {
    type: type,
    key: snapshot.key,
    value: utils_1.firebaseUtils.toJsObject(snapshot.value)
  };
};

firebase_common_1.firebase.init = function (arg) {
  return new Promise(function (resolve, reject) {
    if (firebase_common_1.firebase.initialized) {
      reject("Firebase already initialized");
      return;
    }

    firebase_common_1.firebase.initialized = true;

    try {
      try {
        if (typeof FIRServerValue !== "undefined") {
          firebase_common_1.firebase.ServerValue = {
            TIMESTAMP: FIRServerValue.timestamp()
          };
        }
      } catch (ignore) {}

      arg = arg || {};
      initializeArguments = arg;

      if (FIROptions.defaultOptions() !== null) {
        FIROptions.defaultOptions().deepLinkURLScheme = NSBundle.mainBundle.bundleIdentifier;
      }

      FIRAnalyticsConfiguration.sharedInstance().setAnalyticsCollectionEnabled(arg.analyticsCollectionEnabled !== false);

      if (!firebase_common_1.firebase._configured) {
        firebase_common_1.firebase._configured = true;

        if (typeof FIRApp !== "undefined") {
          FIRApp.configure();
        }
      }

      if (typeof FIRDatabase !== "undefined") {
        if (arg.persist) {
          FIRDatabase.database().persistenceEnabled = true;
        }
      }

      if (typeof FIRFirestore !== "undefined") {
        if (arg.persist === false) {
          var fIRFirestoreSettings = FIRFirestoreSettings.new();
          fIRFirestoreSettings.persistenceEnabled = false;
          FIRFirestore.firestore().settings = fIRFirestoreSettings;
        }
      }

      if (typeof FIRAuth !== "undefined") {
        if (arg.iOSEmulatorFlush) {
          try {
            FIRAuth.auth().signOut();
          } catch (signOutErr) {
            console.log('Sign out of Firebase error: ' + signOutErr);
          }
        }

        if (arg.onAuthStateChanged) {
          firebase_common_1.firebase.authStateListener = function (auth, user) {
            arg.onAuthStateChanged({
              loggedIn: user !== null,
              user: toLoginResult(user)
            });
          };

          FIRAuth.auth().addAuthStateDidChangeListener(firebase_common_1.firebase.authStateListener);
        }

        if (!firebase_common_1.firebase.authStateListener) {
          firebase_common_1.firebase.authStateListener = function (auth, user) {
            firebase_common_1.firebase.notifyAuthStateListeners({
              loggedIn: user !== null,
              user: toLoginResult(user)
            });
          };

          FIRAuth.auth().addAuthStateDidChangeListener(firebase_common_1.firebase.authStateListener);
        }
      }

      if (arg.onDynamicLinkCallback !== undefined) {
        firebase_common_1.firebase.addOnDynamicLinkReceivedCallback(arg.onDynamicLinkCallback);
      }

      if (typeof FBSDKAppEvents !== "undefined") {
        FBSDKAppEvents.activateApp();
      }

      if (typeof FIRMessaging !== "undefined") {
        firebaseMessaging.initFirebaseMessaging(arg);
      }

      if (arg.storageBucket) {
        if (typeof FIRStorage === "undefined") {
          reject("Uncomment Storage in the plugin's Podfile first");
          return;
        }

        firebase_common_1.firebase.storageBucket = FIRStorage.storage().referenceForURL(arg.storageBucket);
      }

      resolve(typeof FIRDatabase !== "undefined" ? FIRDatabase.database().reference() : undefined);
    } catch (ex) {
      console.log("Error in firebase.init: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.getRemoteConfig = function (arg) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof FIRRemoteConfig === "undefined") {
        reject("Uncomment RemoteConfig in the plugin's Podfile first");
        return;
      }

      if (arg.properties === undefined) {
        reject("Argument 'properties' is missing");
        return;
      }

      var firebaseRemoteConfig_1 = FIRRemoteConfig.remoteConfig();
      firebaseRemoteConfig_1.configSettings = new FIRRemoteConfigSettings({
        developerModeEnabled: arg.developerMode || false
      });
      var dic = NSMutableDictionary.new();

      for (var p in arg.properties) {
        var prop = arg.properties[p];

        if (prop.default !== undefined) {
          dic.setObjectForKey(prop.default, prop.key);
        }
      }

      firebaseRemoteConfig_1.setDefaults(dic);

      var onCompletion = function (remoteConfigFetchStatus, error) {
        if (remoteConfigFetchStatus === 1 || remoteConfigFetchStatus === 3) {
          var activated = firebaseRemoteConfig_1.activateFetched();
          var result = {
            lastFetch: firebaseRemoteConfig_1.lastFetchTime,
            throttled: remoteConfigFetchStatus === 3,
            properties: {}
          };

          for (var p in arg.properties) {
            var prop = arg.properties[p];
            var key = prop.key;
            var value = firebaseRemoteConfig_1.configValueForKey(key).stringValue;
            result.properties[key] = firebase_common_1.firebase.strongTypeify(value);
          }

          resolve(result);
        } else {
          reject(error.localizedDescription);
        }
      };

      var expirationDuration = arg.cacheExpirationSeconds || 43200;
      firebaseRemoteConfig_1.fetchWithExpirationDurationCompletionHandler(expirationDuration, onCompletion);
    } catch (ex) {
      console.log("Error in firebase.getRemoteConfig: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.getCurrentUser = function (arg) {
  return new Promise(function (resolve, reject) {
    try {
      var fAuth = FIRAuth.auth();

      if (fAuth === null) {
        reject("Run init() first!");
        return;
      }

      var user = fAuth.currentUser;

      if (user) {
        resolve(toLoginResult(user));
      } else {
        reject();
      }
    } catch (ex) {
      console.log("Error in firebase.getCurrentUser: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.sendEmailVerification = function (actionCodeSettings) {
  return new Promise(function (resolve, reject) {
    try {
      var fAuth = FIRAuth.auth();

      if (fAuth === null) {
        reject("Run init() first!");
        return;
      }

      var user = fAuth.currentUser;

      if (user) {
        var onCompletion = function (error) {
          if (error) {
            reject(error.localizedDescription);
          } else {
            resolve(true);
          }
        };

        if (actionCodeSettings) {
          var firActionCodeSettings = FIRActionCodeSettings.new();

          if (actionCodeSettings.handleCodeInApp !== undefined) {
            firActionCodeSettings.handleCodeInApp = actionCodeSettings.handleCodeInApp;
          }

          if (actionCodeSettings.url) {
            firActionCodeSettings.URL = NSURL.URLWithString(actionCodeSettings.url);
          }

          if (actionCodeSettings.iOS) {
            if (actionCodeSettings.iOS.bundleId) {
              firActionCodeSettings.setIOSBundleID(actionCodeSettings.iOS.bundleId);
            }

            if (actionCodeSettings.iOS.dynamicLinkDomain) {
              firActionCodeSettings.dynamicLinkDomain = actionCodeSettings.iOS.dynamicLinkDomain;
            }
          }

          if (actionCodeSettings.android && actionCodeSettings.android.packageName) {
            firActionCodeSettings.setAndroidPackageNameInstallIfNotAvailableMinimumVersion(actionCodeSettings.android.packageName, actionCodeSettings.android.installApp, actionCodeSettings.android.minimumVersion || null);
          }

          user.sendEmailVerificationWithActionCodeSettingsCompletion(firActionCodeSettings, onCompletion);
        } else {
          user.sendEmailVerificationWithCompletion(onCompletion);
        }
      } else {
        reject("Log in first");
      }
    } catch (ex) {
      console.log("Error in firebase.sendEmailVerification: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.logout = function (arg) {
  return new Promise(function (resolve, reject) {
    try {
      FIRAuth.auth().signOut();
      firebase_common_1.firebase.currentAdditionalUserInfo = null;

      if (typeof GIDSignIn !== "undefined") {
        GIDSignIn.sharedInstance().disconnect();
      }

      if (typeof FBSDKLoginManager !== "undefined") {
        FBSDKLoginManager.alloc().logOut();
      }

      resolve();
    } catch (ex) {
      console.log("Error in firebase.logout: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.unlink = function (providerId) {
  return new Promise(function (resolve, reject) {
    try {
      var user = FIRAuth.auth().currentUser;

      if (!user) {
        reject("Not logged in");
        return;
      }

      user.unlinkFromProviderCompletion(providerId, function (user, error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve(user);
        }
      });
    } catch (ex) {
      console.log("Error in firebase.logout: " + ex);
      reject(ex);
    }
  });
};

function toLoginResult(user, additionalUserInfo) {
  if (!user) {
    return null;
  }

  if (additionalUserInfo) {
    firebase_common_1.firebase.currentAdditionalUserInfo = additionalUserInfo;
  }

  var providers = [];

  if (user.providerData) {
    for (var i = 0, l = user.providerData.count; i < l; i++) {
      var firUserInfo = user.providerData.objectAtIndex(i);
      var pid = firUserInfo.valueForKey("providerID");

      if (pid === 'facebook.com' && typeof FBSDKAccessToken !== "undefined") {
        var fbCurrentAccessToken = FBSDKAccessToken.currentAccessToken();
        providers.push({
          id: pid,
          token: fbCurrentAccessToken ? fbCurrentAccessToken.tokenString : null
        });
      } else {
        providers.push({
          id: pid
        });
      }
    }
  }

  var loginResult = {
    uid: user.uid,
    anonymous: user.anonymous,
    isAnonymous: user.anonymous,
    providers: providers,
    photoURL: user.photoURL ? user.photoURL.absoluteString : null,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: user.displayName,
    phoneNumber: user.phoneNumber,
    refreshToken: user.refreshToken,
    metadata: {
      creationTimestamp: user.metadata.creationDate,
      lastSignInTimestamp: user.metadata.lastSignInDate
    },
    getIdToken: function (forceRefresh) {
      return new Promise(function (resolve, reject) {
        firebase_common_1.firebase.getAuthToken({
          forceRefresh: forceRefresh
        }).then(function (result) {
          return resolve(result.token);
        }).catch(reject);
      });
    },
    getIdTokenResult: function (forceRefresh) {
      return new Promise(function (resolve, reject) {
        firebase_common_1.firebase.getAuthToken({
          forceRefresh: forceRefresh
        }).then(function (result) {
          return resolve(result);
        }).catch(reject);
      });
    },
    sendEmailVerification: function (actionCodeSettings) {
      return firebase_common_1.firebase.sendEmailVerification(actionCodeSettings);
    }
  };

  if (firebase_common_1.firebase.currentAdditionalUserInfo) {
    loginResult.additionalUserInfo = {
      providerId: firebase_common_1.firebase.currentAdditionalUserInfo.providerID,
      username: firebase_common_1.firebase.currentAdditionalUserInfo.username,
      isNewUser: firebase_common_1.firebase.currentAdditionalUserInfo.newUser,
      profile: utils_1.firebaseUtils.toJsObject(firebase_common_1.firebase.currentAdditionalUserInfo.profile)
    };
  }

  return loginResult;
}

firebase_common_1.firebase.getAuthToken = function (arg) {
  return new Promise(function (resolve, reject) {
    try {
      var fAuth = FIRAuth.auth();

      if (fAuth === null) {
        reject("Run init() first!");
        return;
      }

      var user = fAuth.currentUser;

      if (user) {
        user.getIDTokenResultForcingRefreshCompletion(arg.forceRefresh, function (result, error) {
          if (error) {
            reject(error.localizedDescription);
          } else {
            resolve({
              token: result.token,
              claims: utils_1.firebaseUtils.toJsObject(result.claims),
              signInProvider: result.signInProvider,
              expirationTime: utils_1.firebaseUtils.toJsObject(result.expirationDate),
              issuedAtTime: utils_1.firebaseUtils.toJsObject(result.issuedAtDate),
              authTime: utils_1.firebaseUtils.toJsObject(result.authDate)
            });
          }
        });
      } else {
        reject("Log in first");
      }
    } catch (ex) {
      console.log("Error in firebase.getAuthToken: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.login = function (arg) {
  return new Promise(function (resolve, reject) {
    try {
      var onCompletionWithAuthResult_1 = function (authResult, error) {
        if (error) {
          if (typeof GIDSignIn !== "undefined") {
            GIDSignIn.sharedInstance().disconnect();
          }

          reject(error.localizedDescription);
        } else {
          resolve(toLoginResult(authResult && authResult.user, authResult && authResult.additionalUserInfo));
          firebase_common_1.firebase.notifyAuthStateListeners({
            loggedIn: true,
            user: toLoginResult(authResult.user)
          });
        }
      };

      var fAuth_2 = FIRAuth.auth();

      if (fAuth_2 === null) {
        reject("Run init() first!");
        return;
      }

      firebase_common_1.firebase.moveLoginOptionsToObjects(arg);

      if (arg.type === firebase_common_1.firebase.LoginType.ANONYMOUS) {
        fAuth_2.signInAnonymouslyWithCompletion(onCompletionWithAuthResult_1);
      } else if (arg.type === firebase_common_1.firebase.LoginType.PASSWORD) {
        if (!arg.passwordOptions || !arg.passwordOptions.email || !arg.passwordOptions.password) {
          reject("Auth type PASSWORD requires an 'passwordOptions.email' and 'passwordOptions.password' argument");
          return;
        }

        var fIRAuthCredential_1 = FIREmailAuthProvider.credentialWithEmailPassword(arg.passwordOptions.email, arg.passwordOptions.password);

        if (fAuth_2.currentUser) {
          var onCompletionLink = function (authData, error) {
            if (error) {
              log("--- linking error: " + error.localizedDescription);
              fAuth_2.signInAndRetrieveDataWithCredentialCompletion(fIRAuthCredential_1, onCompletionWithAuthResult_1);
            } else {
              onCompletionWithAuthResult_1(authData, error);
            }
          };

          fAuth_2.currentUser.linkAndRetrieveDataWithCredentialCompletion(fIRAuthCredential_1, onCompletionLink);
        } else {
          fAuth_2.signInWithEmailPasswordCompletion(arg.passwordOptions.email, arg.passwordOptions.password, onCompletionWithAuthResult_1);
        }
      } else if (arg.type === firebase_common_1.firebase.LoginType.EMAIL_LINK) {
        if (!arg.emailLinkOptions || !arg.emailLinkOptions.email) {
          reject("Auth type EMAIL_LINK requires an 'emailLinkOptions.email' argument");
          return;
        }

        if (!arg.emailLinkOptions.url) {
          reject("Auth type EMAIL_LINK requires an 'emailLinkOptions.url' argument");
          return;
        }

        var firActionCodeSettings = FIRActionCodeSettings.new();
        firActionCodeSettings.URL = NSURL.URLWithString(arg.emailLinkOptions.url);
        firActionCodeSettings.handleCodeInApp = true;
        firActionCodeSettings.setIOSBundleID(arg.emailLinkOptions.iOS ? arg.emailLinkOptions.iOS.bundleId : NSBundle.mainBundle.bundleIdentifier);
        firActionCodeSettings.setAndroidPackageNameInstallIfNotAvailableMinimumVersion(arg.emailLinkOptions.android ? arg.emailLinkOptions.android.packageName : NSBundle.mainBundle.bundleIdentifier, arg.emailLinkOptions.android ? arg.emailLinkOptions.android.installApp || false : false, arg.emailLinkOptions.android ? arg.emailLinkOptions.android.minimumVersion || "1" : "1");
        fAuth_2.sendSignInLinkToEmailActionCodeSettingsCompletion(arg.emailLinkOptions.email, firActionCodeSettings, function (error) {
          if (error) {
            reject(error.localizedDescription);
            return;
          }

          firebase_common_1.firebase.rememberEmailForEmailLinkLogin(arg.emailLinkOptions.email);
          resolve();
        });
      } else if (arg.type === firebase_common_1.firebase.LoginType.PHONE) {
        if (!arg.phoneOptions || !arg.phoneOptions.phoneNumber) {
          reject("Auth type PHONE requires a 'phoneOptions.phoneNumber' argument");
          return;
        }

        FIRPhoneAuthProvider.provider().verifyPhoneNumberUIDelegateCompletion(arg.phoneOptions.phoneNumber, null, function (verificationID, error) {
          if (error) {
            reject(error.localizedDescription);
            return;
          }

          firebase_common_1.firebase.requestPhoneAuthVerificationCode(function (userResponse) {
            if (userResponse === undefined) {
              reject("Prompt was canceled");
              return;
            }

            var fIRAuthCredential = FIRPhoneAuthProvider.provider().credentialWithVerificationIDVerificationCode(verificationID, userResponse);

            if (fAuth_2.currentUser) {
              var onCompletionLink = function (authData, error) {
                if (error) {
                  fAuth_2.signInAndRetrieveDataWithCredentialCompletion(fIRAuthCredential, onCompletionWithAuthResult_1);
                } else {
                  onCompletionWithAuthResult_1(authData, error);
                }
              };

              fAuth_2.currentUser.linkAndRetrieveDataWithCredentialCompletion(fIRAuthCredential, onCompletionLink);
            } else {
              fAuth_2.signInAndRetrieveDataWithCredentialCompletion(fIRAuthCredential, onCompletionWithAuthResult_1);
            }
          }, arg.phoneOptions.verificationPrompt);
        });
      } else if (arg.type === firebase_common_1.firebase.LoginType.CUSTOM) {
        if (!arg.customOptions || !arg.customOptions.token && !arg.customOptions.tokenProviderFn) {
          reject("Auth type CUSTOM requires a 'customOptions.token' or 'customOptions.tokenProviderFn' argument");
          return;
        }

        if (arg.customOptions.token) {
          fAuth_2.signInAndRetrieveDataWithCustomTokenCompletion(arg.customOptions.token, onCompletionWithAuthResult_1);
        } else if (arg.customOptions.tokenProviderFn) {
          arg.customOptions.tokenProviderFn().then(function (token) {
            fAuth_2.signInAndRetrieveDataWithCustomTokenCompletion(token, onCompletionWithAuthResult_1);
          }, function (error) {
            reject(error);
          });
        }
      } else if (arg.type === firebase_common_1.firebase.LoginType.FACEBOOK) {
        if (typeof FBSDKLoginManager === "undefined") {
          reject("Facebook SDK not installed - see Podfile");
          return;
        }

        var onFacebookCompletion = function (fbSDKLoginManagerLoginResult, error) {
          if (error) {
            console.log("Facebook login error " + error);
            reject(error.localizedDescription);
          } else if (fbSDKLoginManagerLoginResult.isCancelled) {
            reject("login cancelled");
          } else {
            var fIRAuthCredential_2 = FIRFacebookAuthProvider.credentialWithAccessToken(FBSDKAccessToken.currentAccessToken().tokenString);

            if (fAuth_2.currentUser) {
              var onCompletionLink = function (authData, error) {
                if (error) {
                  log("--- linking error: " + error.localizedDescription);
                  fAuth_2.signInAndRetrieveDataWithCredentialCompletion(fIRAuthCredential_2, onCompletionWithAuthResult_1);
                } else {
                  onCompletionWithAuthResult_1(authData);
                }
              };

              fAuth_2.currentUser.linkAndRetrieveDataWithCredentialCompletion(fIRAuthCredential_2, onCompletionLink);
            } else {
              fAuth_2.signInAndRetrieveDataWithCredentialCompletion(fIRAuthCredential_2, onCompletionWithAuthResult_1);
            }
          }
        };

        var fbSDKLoginManager = FBSDKLoginManager.new();
        var scope = ["public_profile", "email"];

        if (arg.facebookOptions && arg.facebookOptions.scope) {
          scope = arg.facebookOptions.scope;
        }

        fbSDKLoginManager.logInWithReadPermissionsFromViewControllerHandler(scope, null, onFacebookCompletion);
      } else if (arg.type === firebase_common_1.firebase.LoginType.GOOGLE) {
        if (typeof GIDSignIn === "undefined") {
          reject("Google Sign In not installed - see Podfile");
          return;
        }

        var sIn = GIDSignIn.sharedInstance();
        sIn.uiDelegate = arg.ios && arg.ios.controller ? arg.ios.controller : application.ios.rootController;
        sIn.clientID = FIRApp.defaultApp().options.clientID;

        if (arg.googleOptions && arg.googleOptions.hostedDomain) {
          sIn.hostedDomain = arg.googleOptions.hostedDomain;
        }

        var delegate_1 = GIDSignInDelegateImpl.new().initWithCallback(function (user, error) {
          if (error === null) {
            firebase_common_1.firebase._gIDAuthentication = user.authentication;
            var fIRAuthCredential_3 = FIRGoogleAuthProvider.credentialWithIDTokenAccessToken(firebase_common_1.firebase._gIDAuthentication.idToken, firebase_common_1.firebase._gIDAuthentication.accessToken);

            if (fAuth_2.currentUser) {
              var onCompletionLink = function (user, error) {
                if (error) {
                  fAuth_2.signInAndRetrieveDataWithCredentialCompletion(fIRAuthCredential_3, onCompletionWithAuthResult_1);
                } else {
                  onCompletionWithAuthResult_1(user);
                }
              };

              fAuth_2.currentUser.linkAndRetrieveDataWithCredentialCompletion(fIRAuthCredential_3, onCompletionLink);
            } else {
              fAuth_2.signInAndRetrieveDataWithCredentialCompletion(fIRAuthCredential_3, onCompletionWithAuthResult_1);
            }
          } else {
            reject(error.localizedDescription);
          }

          CFRelease(delegate_1);
          delegate_1 = undefined;
        });
        CFRetain(delegate_1);
        sIn.delegate = delegate_1;
        sIn.signIn();
      } else {
        reject("Unsupported auth type: " + arg.type);
      }
    } catch (ex) {
      console.log("Error in firebase.login: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.reauthenticate = function (arg) {
  return new Promise(function (resolve, reject) {
    try {
      var fAuth = FIRAuth.auth();

      if (fAuth === null) {
        reject("Run init() first!");
        return;
      }

      var user = fAuth.currentUser;

      if (user === null) {
        reject("no current user");
        return;
      }

      firebase_common_1.firebase.moveLoginOptionsToObjects(arg);
      var authCredential = null;

      if (arg.type === firebase_common_1.firebase.LoginType.PASSWORD) {
        if (!arg.passwordOptions || !arg.passwordOptions.email || !arg.passwordOptions.password) {
          reject("Auth type PASSWORD requires an 'passwordOptions.email' and 'passwordOptions.password' argument");
          return;
        }

        authCredential = FIREmailAuthProvider.credentialWithEmailPassword(arg.passwordOptions.email, arg.passwordOptions.password);
      } else if (arg.type === firebase_common_1.firebase.LoginType.GOOGLE) {
        if (!firebase_common_1.firebase._gIDAuthentication) {
          reject("Not currently logged in with Google");
          return;
        }

        authCredential = FIRGoogleAuthProvider.credentialWithIDTokenAccessToken(firebase_common_1.firebase._gIDAuthentication.idToken, firebase_common_1.firebase._gIDAuthentication.accessToken);
      } else if (arg.type === firebase_common_1.firebase.LoginType.FACEBOOK) {
        var currentAccessToken = FBSDKAccessToken.currentAccessToken();

        if (!currentAccessToken) {
          reject("Not currently logged in with Facebook");
          return;
        }

        authCredential = FIRFacebookAuthProvider.credentialWithAccessToken(currentAccessToken.tokenString);
      }

      if (authCredential === null) {
        reject("arg.type should be one of LoginType.PASSWORD | LoginType.GOOGLE | LoginType.FACEBOOK");
        return;
      }

      var onCompletion = function (error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve();
        }
      };

      user.reauthenticateWithCredentialCompletion(authCredential, onCompletion);
    } catch (ex) {
      console.log("Error in firebase.reauthenticate: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.reloadUser = function () {
  return new Promise(function (resolve, reject) {
    try {
      var user = FIRAuth.auth().currentUser;

      if (user === null) {
        reject("no current user");
        return;
      }

      var onCompletion = function (error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve();
        }
      };

      user.reloadWithCompletion(onCompletion);
    } catch (ex) {
      console.log("Error in firebase.reloadUser: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.sendPasswordResetEmail = function (email) {
  return new Promise(function (resolve, reject) {
    try {
      var onCompletion = function (error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve();
        }
      };

      FIRAuth.auth().sendPasswordResetWithEmailCompletion(email, onCompletion);
    } catch (ex) {
      console.log("Error in firebase.sendPasswordResetEmail: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.updateEmail = function (newEmail) {
  return new Promise(function (resolve, reject) {
    try {
      var onCompletion = function (error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve();
        }
      };

      var user = FIRAuth.auth().currentUser;

      if (user === null) {
        reject("no current user");
      } else {
        user.updateEmailCompletion(newEmail, onCompletion);
      }
    } catch (ex) {
      console.log("Error in firebase.updateEmail: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.updatePassword = function (newPassword) {
  return new Promise(function (resolve, reject) {
    try {
      var onCompletion = function (error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve();
        }
      };

      var user = FIRAuth.auth().currentUser;

      if (user === null) {
        reject("no current user");
      } else {
        user.updatePasswordCompletion(newPassword, onCompletion);
      }
    } catch (ex) {
      console.log("Error in firebase.updatePassword: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.createUser = function (arg) {
  return new Promise(function (resolve, reject) {
    try {
      var onCompletion = function (authResult, error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve(toLoginResult(authResult.user, authResult.additionalUserInfo));
        }
      };

      if (!arg.email || !arg.password) {
        reject("Creating a user requires an email and password argument");
      } else {
        FIRAuth.auth().createUserWithEmailPasswordCompletion(arg.email, arg.password, onCompletion);
      }
    } catch (ex) {
      console.log("Error in firebase.createUser: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.deleteUser = function (arg) {
  return new Promise(function (resolve, reject) {
    try {
      var user = FIRAuth.auth().currentUser;

      if (user === null) {
        reject("no current user");
        return;
      }

      var onCompletion = function (error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve();
        }
      };

      user.deleteWithCompletion(onCompletion);
    } catch (ex) {
      console.log("Error in firebase.deleteUser: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.updateProfile = function (arg) {
  return new Promise(function (resolve, reject) {
    try {
      var onCompletion = function (error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve();
        }
      };

      var fAuth = FIRAuth.auth();

      if (fAuth === null) {
        reject("Run init() first!");
        return;
      }

      if (!arg.displayName && !arg.photoURL) {
        reject("Updating a profile requires a displayName and / or a photoURL argument");
      } else {
        var user = fAuth.currentUser;

        if (user) {
          var changeRequest = user.profileChangeRequest();
          changeRequest.displayName = arg.displayName;
          changeRequest.photoURL = NSURL.URLWithString(arg.photoURL);
          changeRequest.commitChangesWithCompletion(onCompletion);
        } else {
          reject();
        }
      }
    } catch (ex) {
      console.log("Error in firebase.updateProfile: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase._addObservers = function (to, updateCallback) {
  var listeners = [];
  listeners.push(to.observeEventTypeWithBlock(0, function (snapshot) {
    updateCallback(firebase_common_1.firebase.getCallbackData('ChildAdded', snapshot));
  }));
  listeners.push(to.observeEventTypeWithBlock(1, function (snapshot) {
    updateCallback(firebase_common_1.firebase.getCallbackData('ChildRemoved', snapshot));
  }));
  listeners.push(to.observeEventTypeWithBlock(2, function (snapshot) {
    updateCallback(firebase_common_1.firebase.getCallbackData('ChildChanged', snapshot));
  }));
  listeners.push(to.observeEventTypeWithBlock(3, function (snapshot) {
    updateCallback(firebase_common_1.firebase.getCallbackData('ChildMoved', snapshot));
  }));
  return listeners;
};

firebase_common_1.firebase.keepInSync = function (path, switchOn) {
  return new Promise(function (resolve, reject) {
    try {
      var where = FIRDatabase.database().reference().childByAppendingPath(path);
      where.keepSynced(switchOn);
      resolve();
    } catch (ex) {
      console.log("Error in firebase.keepInSync: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.addChildEventListener = function (updateCallback, path) {
  return new Promise(function (resolve, reject) {
    try {
      var where = path === undefined ? FIRDatabase.database().reference() : FIRDatabase.database().reference().childByAppendingPath(path);
      resolve({
        path: path,
        listeners: firebase_common_1.firebase._addObservers(where, updateCallback)
      });
    } catch (ex) {
      console.log("Error in firebase.addChildEventListener: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.addValueEventListener = function (updateCallback, path) {
  return new Promise(function (resolve, reject) {
    try {
      var where = path === undefined ? FIRDatabase.database().reference() : FIRDatabase.database().reference().childByAppendingPath(path);
      var listener = where.observeEventTypeWithBlockWithCancelBlock(4, function (snapshot) {
        updateCallback(firebase_common_1.firebase.getCallbackData('ValueChanged', snapshot));
      }, function (firebaseError) {
        updateCallback({
          error: firebaseError.localizedDescription
        });
      });
      resolve({
        path: path,
        listeners: [listener]
      });
    } catch (ex) {
      console.log("Error in firebase.addChildEventListener: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.getValue = function (path) {
  return new Promise(function (resolve, reject) {
    try {
      var where = path === undefined ? FIRDatabase.database().reference() : FIRDatabase.database().reference().childByAppendingPath(path);
      where.observeSingleEventOfTypeWithBlockWithCancelBlock(4, function (snapshot) {
        resolve(firebase_common_1.firebase.getCallbackData('ValueChanged', snapshot));
      }, function (firebaseError) {
        reject(firebaseError.localizedDescription);
      });
    } catch (ex) {
      console.log("Error in firebase.getValue: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.removeEventListeners = function (listeners, path) {
  return new Promise(function (resolve, reject) {
    try {
      var where = path === undefined ? FIRDatabase.database().reference() : FIRDatabase.database().reference().childByAppendingPath(path);

      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        where.removeObserverWithHandle(listener);
      }

      resolve();
    } catch (ex) {
      console.log("Error in firebase.removeEventListeners: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.push = function (path, val) {
  return new Promise(function (resolve, reject) {
    try {
      var ref_1 = FIRDatabase.database().reference().childByAppendingPath(path).childByAutoId();
      ref_1.setValueWithCompletionBlock(val, function (error, dbRef) {
        error ? reject(error.localizedDescription) : resolve({
          key: ref_1.key
        });
      });
    } catch (ex) {
      console.log("Error in firebase.push: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.setValue = function (path, val) {
  return new Promise(function (resolve, reject) {
    try {
      FIRDatabase.database().reference().childByAppendingPath(path).setValueWithCompletionBlock(val, function (error, dbRef) {
        error ? reject(error.localizedDescription) : resolve();
      });
    } catch (ex) {
      console.log("Error in firebase.setValue: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.update = function (path, val) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof val === "object") {
        FIRDatabase.database().reference().childByAppendingPath(path).updateChildValuesWithCompletionBlock(val, function (error, dbRef) {
          error ? reject(error.localizedDescription) : resolve();
        });
      } else {
        var lastPartOfPath = path.lastIndexOf("/");
        var pathPrefix = path.substring(0, lastPartOfPath);
        var pathSuffix = path.substring(lastPartOfPath + 1);
        var updateObject = '{"' + pathSuffix + '" : "' + val + '"}';
        FIRDatabase.database().reference().childByAppendingPath(pathPrefix).updateChildValuesWithCompletionBlock(JSON.parse(updateObject), function (error, dbRef) {
          error ? reject(error.localizedDescription) : resolve();
        });
      }
    } catch (ex) {
      console.log("Error in firebase.update: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.query = function (updateCallback, path, options) {
  return new Promise(function (resolve, reject) {
    try {
      var where = path === undefined ? FIRDatabase.database().reference() : FIRDatabase.database().reference().childByAppendingPath(path);
      var query = void 0;

      if (options.orderBy.type === firebase_common_1.firebase.QueryOrderByType.KEY) {
        query = where.queryOrderedByKey();
      } else if (options.orderBy.type === firebase_common_1.firebase.QueryOrderByType.VALUE) {
        query = where.queryOrderedByValue();
      } else if (options.orderBy.type === firebase_common_1.firebase.QueryOrderByType.PRIORITY) {
        query = where.queryOrderedByPriority();
      } else if (options.orderBy.type === firebase_common_1.firebase.QueryOrderByType.CHILD) {
        if (options.orderBy.value === undefined || options.orderBy.value === null) {
          reject("When orderBy.type is 'child' you must set orderBy.value as well.");
          return;
        }

        query = where.queryOrderedByChild(options.orderBy.value);
      } else {
        reject("Invalid orderBy.type, use constants like firebase.QueryOrderByType.VALUE");
        return;
      }

      if (options.range && options.range.type) {
        if (options.range.type === firebase_common_1.firebase.QueryRangeType.START_AT) {
          query = query.queryStartingAtValue(options.range.value);
        } else if (options.range.type === firebase_common_1.firebase.QueryRangeType.END_AT) {
          query = query.queryEndingAtValue(options.range.value);
        } else if (options.range.type === firebase_common_1.firebase.QueryRangeType.EQUAL_TO) {
          query = query.queryEqualToValue(options.range.value);
        } else {
          reject("Invalid range.type, use constants like firebase.QueryRangeType.START_AT");
          return;
        }
      }

      if (options.ranges) {
        for (var i = 0; i < options.ranges.length; i++) {
          var range = options.ranges[i];

          if (range.value === undefined || range.value === null) {
            reject("Please set ranges[" + i + "].value");
            return;
          }

          if (range.type === firebase_common_1.firebase.QueryRangeType.START_AT) {
            query = query.queryStartingAtValue(range.value);
          } else if (range.type === firebase_common_1.firebase.QueryRangeType.END_AT) {
            query = query.queryEndingAtValue(range.value);
          } else if (range.type === firebase_common_1.firebase.QueryRangeType.EQUAL_TO) {
            query = query.queryEqualToValue(range.value);
          } else {
            reject("Invalid ranges[" + i + "].type, use constants like firebase.QueryRangeType.START_AT");
            return;
          }
        }
      }

      if (options.limit && options.limit.type) {
        if (options.limit.value === undefined || options.limit.value === null) {
          reject("Please set limit.value");
          return;
        }

        if (options.limit.type === firebase_common_1.firebase.QueryLimitType.FIRST) {
          query = query.queryLimitedToFirst(options.limit.value);
        } else if (options.limit.type === firebase_common_1.firebase.QueryLimitType.LAST) {
          query = query.queryLimitedToLast(options.limit.value);
        } else {
          reject("Invalid limit.type, use constants like firebase.queryOptions.limitType.FIRST");
          return;
        }
      }

      if (options.singleEvent) {
        query.observeSingleEventOfTypeWithBlock(4, function (snapshot) {
          var result = {
            type: "ValueChanged",
            key: snapshot.key,
            value: {},
            children: []
          };

          for (var i = 0; i < snapshot.children.allObjects.count; i++) {
            var snap = snapshot.children.allObjects.objectAtIndex(i);
            var val = utils_1.firebaseUtils.toJsObject(snap.value);
            result.value[snap.key] = val;
            result.children.push(val);
          }

          if (updateCallback) updateCallback(result);
          resolve(result);
        });
      } else {
        resolve({
          path: path,
          listeners: firebase_common_1.firebase._addObservers(query, updateCallback)
        });
      }
    } catch (ex) {
      console.log("Error in firebase.query: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.remove = function (path) {
  return new Promise(function (resolve, reject) {
    try {
      FIRDatabase.database().reference().childByAppendingPath(path).setValueWithCompletionBlock(null, function (error, dbRef) {
        error ? reject(error.localizedDescription) : resolve();
      });
    } catch (ex) {
      console.log("Error in firebase.remove: " + ex);
      reject(ex);
    }
  });
};

var OnDisconnect = function () {
  function OnDisconnect(dbRef, path) {
    this.dbRef = dbRef;
    this.path = path;
  }

  OnDisconnect.prototype.cancel = function () {
    var _this = this;

    return new Promise(function (resolve, reject) {
      try {
        _this.dbRef.cancelDisconnectOperationsWithCompletionBlock(function (error, dbRef) {
          error ? reject(error.localizedDescription) : resolve();
        });
      } catch (ex) {
        console.log("Error in firebase.onDisconnect.cancel: " + ex);
        reject(ex);
      }
    });
  };

  OnDisconnect.prototype.remove = function () {
    var _this = this;

    return new Promise(function (resolve, reject) {
      try {
        _this.dbRef.onDisconnectRemoveValueWithCompletionBlock(function (error, dbRef) {
          error ? reject(error.localizedDescription) : resolve();
        });
      } catch (ex) {
        console.log("Error in firebase.onDisconnect.remove: " + ex);
        reject(ex);
      }
    });
  };

  OnDisconnect.prototype.set = function (value) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      try {
        _this.dbRef.onDisconnectSetValueWithCompletionBlock(value, function (error, dbRef) {
          error ? reject(error.localizedDescription) : resolve();
        });
      } catch (ex) {
        console.log("Error in firebase.onDisconnect.set: " + ex);
        reject(ex);
      }
    });
  };

  OnDisconnect.prototype.setWithPriority = function (value, priority) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      try {
        _this.dbRef.onDisconnectSetValueAndPriorityWithCompletionBlock(value, priority, function (error, dbRef) {
          error ? reject(error.localizedDescription) : resolve();
        });
      } catch (ex) {
        console.log("Error in firebase.onDisconnect.setWithPriority: " + ex);
        reject(ex);
      }
    });
  };

  OnDisconnect.prototype.update = function (values) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      try {
        if (typeof values === "object") {
          _this.dbRef.onDisconnectUpdateChildValuesWithCompletionBlock(values, function (error, dbRef) {
            error ? reject(error.localizedDescription) : resolve();
          });
        } else {
          var lastPartOfPath = _this.path.lastIndexOf("/");

          var pathPrefix = _this.path.substring(0, lastPartOfPath);

          var pathSuffix = _this.path.substring(lastPartOfPath + 1);

          var updateObject = '{"' + pathSuffix + '" : "' + values + '"}';
          FIRDatabase.database().reference().childByAppendingPath(pathPrefix).updateChildValuesWithCompletionBlock(JSON.parse(updateObject), function (error, dbRef) {
            error ? reject(error.localizedDescription) : resolve();
          });
        }
      } catch (ex) {
        console.log("Error in firebase.onDisconnect.update: " + ex);
        reject(ex);
      }
    });
  };

  return OnDisconnect;
}();

firebase_common_1.firebase.onDisconnect = function (path) {
  if (!firebase_common_1.firebase.initialized) {
    console.error("Please run firebase.init() before firebase.onDisconnect()");
    throw new Error("FirebaseApp is not initialized. Make sure you run firebase.init() first");
  }

  var dbRef = FIRDatabase.database().reference().child(path);
  return new OnDisconnect(dbRef, path);
};

firebase_common_1.firebase.transaction = function (path, transactionUpdate, onComplete) {
  return new Promise(function (resolve, reject) {
    if (!firebase_common_1.firebase.initialized) {
      console.error("Please run firebase.init() before firebase.transaction()");
      throw new Error("FirebaseApp is not initialized. Make sure you run firebase.init() first");
    }

    var dbRef = FIRDatabase.database().reference().child(path);
    dbRef.runTransactionBlockAndCompletionBlock(function (mutableData) {
      var desiredValue = transactionUpdate(utils_1.firebaseUtils.toJsObject(mutableData.value));

      if (desiredValue === undefined) {
        return FIRTransactionResult.successWithValue(mutableData);
      } else {
        mutableData.value = desiredValue;
        return FIRTransactionResult.successWithValue(mutableData);
      }
    }, function (error, commited, snapshot) {
      error !== null ? reject(error.localizedDescription) : resolve({
        committed: commited,
        snapshot: nativeSnapshotToWebSnapshot(snapshot)
      });
    });
  });
};

function nativeSnapshotToWebSnapshot(snapshot) {
  function forEach(action) {
    var iterator = snapshot.children;
    var innerSnapshot;
    var datasnapshot;

    while (innerSnapshot = iterator.nextObject()) {
      datasnapshot = nativeSnapshotToWebSnapshot(innerSnapshot);

      if (action(datasnapshot)) {
        return true;
      }
    }

    return false;
  }

  return {
    key: snapshot.key,
    ref: snapshot.ref,
    child: function (path) {
      return nativeSnapshotToWebSnapshot(snapshot.childSnapshotForPath(path));
    },
    exists: function () {
      return snapshot.exists();
    },
    forEach: function (func) {
      return forEach(func);
    },
    getPriority: function () {
      return utils_1.firebaseUtils.toJsObject(snapshot.priority);
    },
    hasChild: function (path) {
      return snapshot.hasChild(path);
    },
    hasChildren: function () {
      return snapshot.hasChildren();
    },
    numChildren: function () {
      return snapshot.childrenCount;
    },
    toJSON: function () {
      return snapshot.valueInExportFormat();
    },
    val: function () {
      return utils_1.firebaseUtils.toJsObject(snapshot.value);
    }
  };
}

firebase_common_1.firebase.enableLogging = function (logging, persistent) {
  FIRDatabase.setLoggingEnabled(logging);
};

firebase_common_1.firebase.sendCrashLog = function (arg) {
  return new Promise(function (resolve, reject) {
    try {
      resolve();
    } catch (ex) {
      console.log("Error in firebase.sendCrashLog: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.invites.sendInvitation = function (arg) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof FIRInvites === "undefined") {
        reject("Make sure 'Firebase/Invites' is in the plugin's Podfile");
        return;
      }

      if (!arg.message || !arg.title) {
        reject("The mandatory 'message' or 'title' argument is missing");
        return;
      }

      var inviteDialog = FIRInvites.inviteDialog();
      inviteDialog.performSelectorWithObject("setMessage:", arg.message);
      inviteDialog.performSelectorWithObject("setTitle:", arg.title);

      if (arg.deepLink) {
        inviteDialog.performSelectorWithObject("setDeepLink:", arg.deeplink);
      }

      if (arg.callToActionText) {
        inviteDialog.performSelectorWithObject("setCallToActionText:", arg.callToActionText);
      }

      if (arg.customImage) {
        inviteDialog.performSelectorWithObject("setCustomImage:", arg.customImage);
      }

      if (arg.androidClientID) {
        var targetApplication = FIRInvitesTargetApplication.new();
        targetApplication.androidClientID = arg.androidClientID;
        inviteDialog.performSelectorWithObject("setOtherPlatformsTargetApplication:", targetApplication);
      }

      var delegate_2 = FIRInviteDelegateImpl.new().initWithCallback(function (invitationIds, error) {
        if (error === null) {
          var ids = utils_1.firebaseUtils.toJsObject(invitationIds);
          resolve({
            count: invitationIds.count,
            invitationIds: ids
          });
        } else {
          reject(error.localizedDescription);
        }

        CFRelease(delegate_2);
        delegate_2 = undefined;
      });
      CFRetain(delegate_2);
      inviteDialog.performSelectorWithObject("setInviteDelegate:", delegate_2);
      inviteDialog.performSelector("open");
    } catch (ex) {
      console.log("Error in firebase.sendInvitation: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.invites.getInvitation = function () {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof FIRInvites === "undefined") {
        reject("Make sure 'Firebase/Invites' is in the plugin's Podfile");
        return;
      }

      if (firebase_common_1.firebase._cachedInvitation !== null) {
        resolve(firebase_common_1.firebase._cachedInvitation);
        firebase_common_1.firebase.cachedInvitation = null;
      } else {
        reject("Not launched by invitation");
      }
    } catch (ex) {
      console.log("Error in firebase.getInvitation: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.firestore.WriteBatch = function (nativeWriteBatch) {
  var FirestoreWriteBatch = function () {
    function FirestoreWriteBatch() {
      var _this = this;

      this.set = function (documentRef, data, options) {
        fixSpecialFields(data);
        nativeWriteBatch.setDataForDocumentMerge(data, documentRef.ios, options && options.merge);
        return _this;
      };

      this.update = function (documentRef, data) {
        fixSpecialFields(data);
        nativeWriteBatch.updateDataForDocument(data, documentRef.ios);
        return _this;
      };

      this.delete = function (documentRef) {
        nativeWriteBatch.deleteDocument(documentRef.ios);
        return _this;
      };
    }

    FirestoreWriteBatch.prototype.commit = function () {
      return new Promise(function (resolve, reject) {
        nativeWriteBatch.commitWithCompletion(function (error) {
          error ? reject(error.localizedDescription) : resolve();
        });
      });
    };

    return FirestoreWriteBatch;
  }();

  return new FirestoreWriteBatch();
};

firebase_common_1.firebase.firestore.batch = function () {
  return new firebase_common_1.firebase.firestore.WriteBatch(FIRFirestore.firestore().batch());
};

firebase_common_1.firebase.firestore.Transaction = function (nativeTransaction) {
  var FirestoreTransaction = function () {
    function FirestoreTransaction() {
      var _this = this;

      this.get = function (documentRef) {
        var docSnapshot = nativeTransaction.getDocumentError(documentRef.ios);
        return new DocumentSnapshot(docSnapshot);
      };

      this.set = function (documentRef, data, options) {
        fixSpecialFields(data);
        nativeTransaction.setDataForDocumentMerge(data, documentRef.ios, options && options.merge);
        return _this;
      };

      this.update = function (documentRef, data) {
        fixSpecialFields(data);
        nativeTransaction.updateDataForDocument(data, documentRef.ios);
        return _this;
      };

      this.delete = function (documentRef) {
        nativeTransaction.deleteDocument(documentRef.ios);
        return _this;
      };
    }

    return FirestoreTransaction;
  }();

  return new FirestoreTransaction();
};

firebase_common_1.firebase.firestore.runTransaction = function (updateFunction) {
  return new Promise(function (resolve, reject) {
    FIRFirestore.firestore().runTransactionWithBlockCompletion(function (nativeTransaction, err) {
      var tx = new firebase_common_1.firebase.firestore.Transaction(nativeTransaction);
      return updateFunction(tx);
    }, function (result, error) {
      return error ? reject(error.localizedDescription) : resolve();
    });
  });
};

firebase_common_1.firebase.firestore.settings = function (settings) {
  if (typeof FIRFirestore !== "undefined") {
    try {
      var fIRFirestoreSettings = FIRFirestoreSettings.new();
      if (initializeArguments.persist !== undefined) fIRFirestoreSettings.persistenceEnabled = initializeArguments.persist;
      if (settings.ssl !== undefined) fIRFirestoreSettings.sslEnabled = settings.ssl;
      if (settings.host !== undefined) fIRFirestoreSettings.host = settings.host;
      FIRFirestore.firestore().settings = fIRFirestoreSettings;
    } catch (err) {
      console.log("Error in firebase.firestore.settings: " + err);
    }
  }
};

firebase_common_1.firebase.firestore.collection = function (collectionPath) {
  try {
    if (typeof FIRFirestore === "undefined") {
      console.log("Make sure 'Firebase/Firestore' is in the plugin's Podfile");
      return null;
    }

    if (!firebase_common_1.firebase.initialized) {
      console.log("Please run firebase.init() before firebase.firestore.collection()");
      return null;
    }

    return firebase_common_1.firebase.firestore._getCollectionReference(FIRFirestore.firestore().collectionWithPath(collectionPath));
  } catch (ex) {
    console.log("Error in firebase.firestore.collection: " + ex);
    return null;
  }
};

firebase_common_1.firebase.firestore.onDocumentSnapshot = function (docRef, optionsOrCallback, callbackOrOnError, onError) {
  var includeMetadataChanges = false;
  var onNextCallback;
  var onErrorCallback;

  if (typeof optionsOrCallback === "function") {
    onNextCallback = optionsOrCallback;
    onErrorCallback = callbackOrOnError;
  } else {
    onNextCallback = callbackOrOnError;
    onErrorCallback = onError;
  }

  if (optionsOrCallback.includeMetadataChanges === true) {
    includeMetadataChanges = true;
  }

  var listener = docRef.addSnapshotListenerWithIncludeMetadataChangesListener(includeMetadataChanges, function (snapshot, error) {
    if (error || !snapshot) {
      error && onErrorCallback && onErrorCallback(new Error(error.localizedDescription));
      return;
    }

    onNextCallback && onNextCallback(new DocumentSnapshot(snapshot));
  });

  if (listener.remove === undefined) {
    return function () {
      onNextCallback = function () {};
    };
  } else {
    return function () {
      return listener.remove();
    };
  }
};

firebase_common_1.firebase.firestore.onCollectionSnapshot = function (colRef, optionsOrCallback, callbackOrOnError, onError) {
  var includeMetadataChanges = false;
  var onNextCallback;
  var onErrorCallback;

  if (typeof optionsOrCallback === "function") {
    onNextCallback = optionsOrCallback;
    onErrorCallback = callbackOrOnError;
  } else {
    onNextCallback = callbackOrOnError;
    onErrorCallback = onError;
  }

  if (optionsOrCallback.includeMetadataChanges === true) {
    includeMetadataChanges = true;
  }

  var listener = colRef.addSnapshotListenerWithIncludeMetadataChangesListener(includeMetadataChanges, function (snapshot, error) {
    if (error || !snapshot) {
      error && onErrorCallback && onErrorCallback(new Error(error.localizedDescription));
      return;
    }

    onNextCallback && onNextCallback(new QuerySnapshot(snapshot));
  });

  if (listener.remove === undefined) {
    return function () {
      onNextCallback = function () {};
    };
  } else {
    return function () {
      return listener.remove();
    };
  }
};

firebase_common_1.firebase.firestore._getCollectionReference = function (colRef) {
  if (!colRef) {
    return null;
  }

  var collectionPath = colRef.path;
  return {
    id: colRef.collectionID,
    parent: firebase_common_1.firebase.firestore._getDocumentReference(colRef.parent),
    doc: function (documentPath) {
      return firebase_common_1.firebase.firestore.doc(collectionPath, documentPath);
    },
    add: function (document) {
      return firebase_common_1.firebase.firestore.add(collectionPath, document);
    },
    get: function () {
      return firebase_common_1.firebase.firestore.get(collectionPath);
    },
    where: function (fieldPath, opStr, value) {
      return firebase_common_1.firebase.firestore.where(collectionPath, fieldPath, opStr, value);
    },
    orderBy: function (fieldPath, directionStr) {
      return firebase_common_1.firebase.firestore.orderBy(collectionPath, fieldPath, directionStr, colRef);
    },
    limit: function (limit) {
      return firebase_common_1.firebase.firestore.limit(collectionPath, limit, colRef);
    },
    onSnapshot: function (optionsOrCallback, callbackOrOnError, onError) {
      return firebase_common_1.firebase.firestore.onCollectionSnapshot(colRef, optionsOrCallback, callbackOrOnError, onError);
    },
    startAfter: function (document) {
      return firebase_common_1.firebase.firestore.startAfter(collectionPath, document, colRef);
    },
    startAt: function (document) {
      return firebase_common_1.firebase.firestore.startAt(collectionPath, document, colRef);
    },
    endAt: function (document) {
      return firebase_common_1.firebase.firestore.endAt(collectionPath, document, colRef);
    },
    endBefore: function (document) {
      return firebase_common_1.firebase.firestore.endBefore(collectionPath, document, colRef);
    }
  };
};

firebase_common_1.firebase.firestore._getDocumentReference = function (docRef) {
  if (!docRef) {
    return null;
  }

  var collectionPath = docRef.parent.path;
  return {
    discriminator: "docRef",
    id: docRef.documentID,
    parent: firebase_common_1.firebase.firestore._getCollectionReference(docRef.parent),
    path: docRef.path,
    collection: function (cp) {
      return firebase_common_1.firebase.firestore.collection(collectionPath + "/" + docRef.documentID + "/" + cp);
    },
    set: function (data, options) {
      return firebase_common_1.firebase.firestore.set(collectionPath, docRef.documentID, data, options);
    },
    get: function () {
      return firebase_common_1.firebase.firestore.getDocument(collectionPath, docRef.documentID);
    },
    update: function (data) {
      return firebase_common_1.firebase.firestore.update(collectionPath, docRef.documentID, data);
    },
    delete: function () {
      return firebase_common_1.firebase.firestore.delete(collectionPath, docRef.documentID);
    },
    onSnapshot: function (optionsOrCallback, callbackOrOnError, onError) {
      return firebase_common_1.firebase.firestore.onDocumentSnapshot(docRef, optionsOrCallback, callbackOrOnError, onError);
    },
    ios: docRef
  };
};

firebase_common_1.firebase.firestore.doc = function (collectionPath, documentPath) {
  try {
    if (typeof FIRFirestore === "undefined") {
      console.log("Make sure 'Firebase/Firestore' is in the plugin's Podfile");
      return null;
    }

    if (!firebase_common_1.firebase.initialized) {
      console.log("Please run firebase.init() before firebase.firestore.doc()");
      return null;
    }

    var fIRCollectionReference = FIRFirestore.firestore().collectionWithPath(collectionPath);
    var fIRDocumentReference = documentPath ? fIRCollectionReference.documentWithPath(documentPath) : fIRCollectionReference.documentWithAutoID();
    return firebase_common_1.firebase.firestore._getDocumentReference(fIRDocumentReference);
  } catch (ex) {
    console.log("Error in firebase.firestore.doc: " + ex);
    return null;
  }
};

firebase_common_1.firebase.firestore.docRef = function (documentPath) {
  if (typeof FIRFirestore === "undefined") {
    console.log("Make sure 'Firebase/Firestore' is in the plugin's Podfile");
    return null;
  }

  return firebase_common_1.firebase.firestore._getDocumentReference(FIRFirestore.firestore().documentWithPath(documentPath));
};

firebase_common_1.firebase.firestore.add = function (collectionPath, document) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof FIRFirestore === "undefined") {
        reject("Make sure 'Firebase/Firestore' is in the plugin's Podfile");
        return;
      }

      fixSpecialFields(document);
      var defaultFirestore = FIRFirestore.firestore();
      var fIRDocumentReference_1 = defaultFirestore.collectionWithPath(collectionPath).addDocumentWithDataCompletion(document, function (error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve(firebase_common_1.firebase.firestore._getDocumentReference(fIRDocumentReference_1));
        }
      });
    } catch (ex) {
      console.log("Error in firebase.firestore.add: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.firestore.set = function (collectionPath, documentPath, document, options) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof FIRFirestore === "undefined") {
        reject("Make sure 'Firebase/Firestore' is in the plugin's Podfile");
        return;
      }

      fixSpecialFields(document);
      var docRef = FIRFirestore.firestore().collectionWithPath(collectionPath).documentWithPath(documentPath);

      if (options && options.merge) {
        docRef.setDataMergeCompletion(document, true, function (error) {
          if (error) {
            reject(error.localizedDescription);
          } else {
            resolve();
          }
        });
      } else {
        docRef.setDataCompletion(document, function (error) {
          if (error) {
            reject(error.localizedDescription);
          } else {
            resolve();
          }
        });
      }
    } catch (ex) {
      console.log("Error in firebase.firestore.set: " + ex);
      reject(ex);
    }
  });
};

function fixSpecialFields(item) {
  for (var k in item) {
    if (item.hasOwnProperty(k)) {
      item[k] = fixSpecialField(item[k]);
    }
  }

  return item;
}

function fixSpecialField(item) {
  if (item === null) {
    return null;
  } else if (item === "SERVER_TIMESTAMP") {
    return FIRFieldValue.fieldValueForServerTimestamp();
  } else if (item === "DELETE_FIELD") {
    return FIRFieldValue.fieldValueForDelete();
  } else if (item instanceof firebase_common_1.FieldValue) {
    var fieldValue = item;

    if (fieldValue.type === "ARRAY_UNION") {
      return FIRFieldValue.fieldValueForArrayUnion(Array.isArray(fieldValue.value[0]) ? fieldValue.value[0] : fieldValue.value);
    } else if (fieldValue.type === "ARRAY_REMOVE") {
      return FIRFieldValue.fieldValueForArrayRemove(Array.isArray(fieldValue.value[0]) ? fieldValue.value[0] : fieldValue.value);
    } else {
      console.log("You found a bug! Please report an issue at https://github.com/EddyVerbruggen/nativescript-plugin-firebase/issues, mention fieldValue.type = '" + fieldValue.type + "'. Thanks!");
    }
  } else if (item instanceof firebase_common_1.GeoPoint) {
    var geo = item;
    return new FIRGeoPoint({
      latitude: geo.latitude,
      longitude: geo.longitude
    });
  } else if (firebase_common_1.isDocumentReference(item)) {
    return item.ios;
  } else if (typeof item === "object" && item.constructor === Object) {
    return fixSpecialFields(item);
  } else {
    return item;
  }
}

firebase_common_1.firebase.firestore.update = function (collectionPath, documentPath, document) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof FIRFirestore === "undefined") {
        reject("Make sure 'Firebase/Firestore' is in the plugin's Podfile");
        return;
      }

      fixSpecialFields(document);
      var docRef = FIRFirestore.firestore().collectionWithPath(collectionPath).documentWithPath(documentPath);
      docRef.updateDataCompletion(document, function (error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve();
        }
      });
    } catch (ex) {
      console.log("Error in firebase.firestore.update: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.firestore.delete = function (collectionPath, documentPath) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof FIRFirestore === "undefined") {
        reject("Make sure 'Firebase/Firestore' is in the plugin's Podfile");
        return;
      }

      var docRef = FIRFirestore.firestore().collectionWithPath(collectionPath).documentWithPath(documentPath);
      docRef.deleteDocumentWithCompletion(function (error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve();
        }
      });
    } catch (ex) {
      console.log("Error in firebase.firestore.delete: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.firestore.getCollection = function (collectionPath) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof FIRFirestore === "undefined") {
        reject("Make sure 'Firebase/Firestore' is in the plugin's Podfile");
        return;
      }

      var defaultFirestore = FIRFirestore.firestore();
      defaultFirestore.collectionWithPath(collectionPath).getDocumentsWithCompletion(function (snapshot, error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve(new QuerySnapshot(snapshot));
        }
      });
    } catch (ex) {
      console.log("Error in firebase.firestore.getCollection: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.firestore.get = function (collectionPath) {
  return firebase_common_1.firebase.firestore.getCollection(collectionPath);
};

firebase_common_1.firebase.firestore.getDocument = function (collectionPath, documentPath) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof FIRFirestore === "undefined") {
        reject("Make sure 'Firebase/Firestore' is in the plugin's Podfile");
        return;
      }

      FIRFirestore.firestore().collectionWithPath(collectionPath).documentWithPath(documentPath).getDocumentWithCompletion(function (snapshot, error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve(new DocumentSnapshot(snapshot));
        }
      });
    } catch (ex) {
      console.log("Error in firebase.firestore.getDocument: " + ex);
      reject(ex);
    }
  });
};

firebase_common_1.firebase.firestore._getQuery = function (collectionPath, query) {
  return {
    get: function () {
      return new Promise(function (resolve, reject) {
        query.getDocumentsWithCompletion(function (snapshot, error) {
          if (error) {
            reject(error.localizedDescription);
          } else {
            resolve(new QuerySnapshot(snapshot));
          }
        });
      });
    },
    where: function (fp, os, v) {
      return firebase_common_1.firebase.firestore.where(collectionPath, fp, os, v, query);
    },
    orderBy: function (fp, directionStr) {
      return firebase_common_1.firebase.firestore.orderBy(collectionPath, fp, directionStr, query);
    },
    limit: function (limit) {
      return firebase_common_1.firebase.firestore.limit(collectionPath, limit, query);
    },
    onSnapshot: function (optionsOrCallback, callbackOrOnError, onError) {
      return firebase_common_1.firebase.firestore.onCollectionSnapshot(query, optionsOrCallback, callbackOrOnError, onError);
    },
    startAfter: function (document) {
      return firebase_common_1.firebase.firestore.startAfter(collectionPath, document, query);
    },
    startAt: function (document) {
      return firebase_common_1.firebase.firestore.startAt(collectionPath, document, query);
    },
    endAt: function (document) {
      return firebase_common_1.firebase.firestore.endAt(collectionPath, document, query);
    },
    endBefore: function (document) {
      return firebase_common_1.firebase.firestore.endBefore(collectionPath, document, query);
    }
  };
};

firebase_common_1.firebase.firestore.where = function (collectionPath, fieldPath, opStr, value, query) {
  try {
    if (typeof FIRFirestore === "undefined") {
      console.log("Make sure 'Firebase/Firestore' is in the plugin's Podfile");
      return null;
    }

    query = query || FIRFirestore.firestore().collectionWithPath(collectionPath);
    value = fixSpecialField(value);

    if (opStr === "<") {
      query = query.queryWhereFieldIsLessThan(fieldPath, value);
    } else if (opStr === "<=") {
      query = query.queryWhereFieldIsLessThanOrEqualTo(fieldPath, value);
    } else if (opStr === "==") {
      query = query.queryWhereFieldIsEqualTo(fieldPath, value);
    } else if (opStr === ">=") {
      query = query.queryWhereFieldIsGreaterThanOrEqualTo(fieldPath, value);
    } else if (opStr === ">") {
      query = query.queryWhereFieldIsGreaterThan(fieldPath, value);
    } else if (opStr === "array-contains") {
      query = query.queryWhereFieldArrayContains(fieldPath, value);
    } else {
      console.log("Illegal argument for opStr: " + opStr);
      return null;
    }

    return firebase_common_1.firebase.firestore._getQuery(collectionPath, query);
  } catch (ex) {
    console.log("Error in firebase.firestore.where: " + ex);
    return null;
  }
};

firebase_common_1.firebase.firestore.orderBy = function (collectionPath, fieldPath, direction, query) {
  query = query.queryOrderedByFieldDescending(fieldPath, direction === "desc");
  return firebase_common_1.firebase.firestore._getQuery(collectionPath, query);
};

firebase_common_1.firebase.firestore.limit = function (collectionPath, limit, query) {
  query = query.queryLimitedTo(limit);
  return firebase_common_1.firebase.firestore._getQuery(collectionPath, query);
};

firebase_common_1.firebase.firestore.startAt = function (collectionPath, document, query) {
  return firebase_common_1.firebase.firestore._getQuery(collectionPath, query.queryStartingAtDocument(document.ios));
};

firebase_common_1.firebase.firestore.startAfter = function (collectionPath, document, query) {
  return firebase_common_1.firebase.firestore._getQuery(collectionPath, query.queryStartingAfterDocument(document.ios));
};

firebase_common_1.firebase.firestore.endAt = function (collectionPath, document, query) {
  return firebase_common_1.firebase.firestore._getQuery(collectionPath, query.queryEndingAtDocument(document.ios));
};

firebase_common_1.firebase.firestore.endBefore = function (collectionPath, document, query) {
  return firebase_common_1.firebase.firestore._getQuery(collectionPath, query.queryEndingBeforeDocument(document.ios));
};

var FIRInviteDelegateImpl = function (_super) {
  __extends(FIRInviteDelegateImpl, _super);

  function FIRInviteDelegateImpl() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  FIRInviteDelegateImpl.new = function () {
    if (FIRInviteDelegateImpl.ObjCProtocols.length === 0 && typeof FIRInviteDelegate !== "undefined") {
      FIRInviteDelegateImpl.ObjCProtocols.push(FIRInviteDelegate);
    }

    return _super.new.call(this);
  };

  FIRInviteDelegateImpl.prototype.initWithCallback = function (callback) {
    this.callback = callback;
    return this;
  };

  FIRInviteDelegateImpl.prototype.inviteFinishedWithInvitationsError = function (invitationIds, error) {
    this.callback(invitationIds, error);
  };

  FIRInviteDelegateImpl.ObjCProtocols = [];
  return FIRInviteDelegateImpl;
}(NSObject);

var GIDSignInDelegateImpl = function (_super) {
  __extends(GIDSignInDelegateImpl, _super);

  function GIDSignInDelegateImpl() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  GIDSignInDelegateImpl.new = function () {
    if (GIDSignInDelegateImpl.ObjCProtocols.length === 0 && typeof GIDSignInDelegate !== "undefined") {
      GIDSignInDelegateImpl.ObjCProtocols.push(GIDSignInDelegate);
    }

    return _super.new.call(this);
  };

  GIDSignInDelegateImpl.prototype.initWithCallback = function (callback) {
    this.callback = callback;
    return this;
  };

  GIDSignInDelegateImpl.prototype.signInDidSignInForUserWithError = function (signIn, user, error) {
    this.callback(user, error);
  };

  GIDSignInDelegateImpl.ObjCProtocols = [];
  return GIDSignInDelegateImpl;
}(NSObject);

function convertDocChangeType(type) {
  switch (type) {
    case 0:
      return 'added';

    case 1:
      return 'modified';

    case 2:
      return 'removed';

    default:
      throw new Error('Unknown DocumentChangeType');
  }
}

function convertDocument(qDoc) {
  return new DocumentSnapshot(qDoc);
}

var QuerySnapshot = function () {
  function QuerySnapshot(snapshot) {
    this.snapshot = snapshot;
    this.metadata = {
      fromCache: this.snapshot.metadata.fromCache,
      hasPendingWrites: this.snapshot.metadata.pendingWrites
    };
    this.docSnapshots = this.docs;
  }

  Object.defineProperty(QuerySnapshot.prototype, "docs", {
    get: function () {
      var _this = this;

      var getSnapshots = function () {
        var docSnapshots = [];

        for (var i = 0, l = _this.snapshot.documents.count; i < l; i++) {
          var document_1 = _this.snapshot.documents.objectAtIndex(i);

          docSnapshots.push(new DocumentSnapshot(document_1));
        }

        _this._docSnapshots = docSnapshots;
        return docSnapshots;
      };

      return this._docSnapshots || getSnapshots();
    },
    enumerable: true,
    configurable: true
  });

  QuerySnapshot.prototype.docChanges = function (options) {
    if (options) {
      console.info('No options support yet, for docChanges()');
    }

    var docChanges = [];
    var jChanges = this.snapshot.documentChanges;

    for (var i = 0; i < jChanges.count; i++) {
      var chg = jChanges[i];
      var type = convertDocChangeType(chg.type);
      var doc = convertDocument(chg.document);
      docChanges.push({
        doc: doc,
        newIndex: chg.newIndex,
        oldIndex: chg.oldIndex,
        type: type
      });
    }

    return docChanges;
  };

  QuerySnapshot.prototype.forEach = function (callback, thisArg) {
    this.docSnapshots.map(function (snapshot) {
      return callback(snapshot);
    });
  };

  return QuerySnapshot;
}();

exports.QuerySnapshot = QuerySnapshot;
module.exports = firebase_common_1.firebase;

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/functions/functions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var utils_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/utils.js");

function httpsCallable(functionName) {
  var functions = FIRFunctions.functions();
  return function (data) {
    return new Promise(function (resolve, reject) {
      var callable = functions.HTTPSCallableWithName(functionName);

      var handleCompletion = function (result, err) {
        if (err) {
          reject(err.localizedDescription);
          return;
        }

        if (result) {
          resolve(utils_1.firebaseUtils.toJsObject(result.data));
        }
      };

      if (data) {
        callable.callWithObjectCompletion(data, handleCompletion);
      } else {
        callable.callWithCompletion(handleCompletion);
      }
    });
  };
}

exports.httpsCallable = httpsCallable;

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/messaging/messaging.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var application = __webpack_require__("tns-core-modules/application/application");

var applicationSettings = __webpack_require__("tns-core-modules/application-settings");

var utils_1 = __webpack_require__("tns-core-modules/utils/utils");

var platform_1 = __webpack_require__("tns-core-modules/platform/platform");

var utils_2 = __webpack_require__("../node_modules/nativescript-plugin-firebase/utils.js");

var firebase_common_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/firebase-common.js");

var _notificationActionTakenCallback;

var _pendingNotifications = [];
var _pendingActionTakenNotifications = [];

var _pushToken;

var _receivedPushTokenCallback;

var _receivedNotificationCallback;

var _registerForRemoteNotificationsRanThisSession = false;

var _userNotificationCenterDelegate;

var _messagingConnected = null;

var _firebaseRemoteMessageDelegate;

var _showNotifications = true;
var _showNotificationsWhenInForeground = false;
var NOTIFICATIONS_REGISTRATION_KEY = "Firebase-RegisterForRemoteNotifications";

function initFirebaseMessaging(options) {
  if (!options) {
    return;
  }

  _showNotifications = options.showNotifications === undefined ? _showNotifications : !!options.showNotifications;
  _showNotificationsWhenInForeground = options.showNotificationsWhenInForeground === undefined ? _showNotificationsWhenInForeground : !!options.showNotificationsWhenInForeground;

  if (options.onMessageReceivedCallback !== undefined) {
    addOnMessageReceivedCallback(options.onMessageReceivedCallback);
  }

  if (options.onPushTokenReceivedCallback !== undefined) {
    addOnPushTokenReceivedCallback(options.onPushTokenReceivedCallback);
  }
}

exports.initFirebaseMessaging = initFirebaseMessaging;

function addOnMessageReceivedCallback(callback) {
  return new Promise(function (resolve, reject) {
    try {
      applicationSettings.setBoolean(NOTIFICATIONS_REGISTRATION_KEY, true);
      _receivedNotificationCallback = callback;

      _registerForRemoteNotifications();

      _processPendingNotifications();

      resolve();
    } catch (ex) {
      console.log("Error in messaging.addOnMessageReceivedCallback: " + ex);
      reject(ex);
    }
  });
}

exports.addOnMessageReceivedCallback = addOnMessageReceivedCallback;

function getCurrentPushToken() {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof FIRMessaging !== "undefined") {
        resolve(FIRMessaging.messaging().FCMToken);
      } else {
        resolve(_pushToken);
      }
    } catch (ex) {
      console.log("Error in messaging.getCurrentPushToken: " + ex);
      reject(ex);
    }
  });
}

exports.getCurrentPushToken = getCurrentPushToken;

function registerForPushNotifications(options) {
  return new Promise(function (resolve, reject) {
    try {
      initFirebaseMessaging(options);
      _registerForRemoteNotificationsRanThisSession = false;

      _registerForRemoteNotifications();

      resolve();
    } catch (ex) {
      console.log("Error in messaging.registerForPushNotifications: " + ex);
      reject(ex);
    }
  });
}

exports.registerForPushNotifications = registerForPushNotifications;

function unregisterForPushNotifications() {
  return new Promise(function (resolve, reject) {
    try {
      UIApplication.sharedApplication.unregisterForRemoteNotifications();
      resolve();
    } catch (ex) {
      console.log("Error in messaging.unregisterForPushNotifications: " + ex);
      reject(ex);
    }
  });
}

exports.unregisterForPushNotifications = unregisterForPushNotifications;

function handleRemoteNotification(app, userInfo) {
  var userInfoJSON = utils_2.firebaseUtils.toJsObject(userInfo);
  var aps = userInfo.objectForKey("aps");

  if (aps !== null) {
    var alrt = aps.objectForKey("alert");

    if (alrt !== null && alrt.objectForKey) {
      userInfoJSON.title = alrt.objectForKey("title");
      userInfoJSON.body = alrt.objectForKey("body");
    }
  }

  userInfoJSON.foreground = app.applicationState === 0;
  updateUserInfo(userInfoJSON);

  _pendingNotifications.push(userInfoJSON);

  if (_receivedNotificationCallback) {
    _processPendingNotifications();
  }
}

exports.handleRemoteNotification = handleRemoteNotification;

function addOnPushTokenReceivedCallback(callback) {
  return new Promise(function (resolve, reject) {
    try {
      _receivedPushTokenCallback = callback;

      if (_pushToken) {
        callback(_pushToken);
      }

      applicationSettings.setBoolean(NOTIFICATIONS_REGISTRATION_KEY, true);

      _registerForRemoteNotifications();

      _processPendingNotifications();

      resolve();
    } catch (ex) {
      console.log("Error in messaging.addOnPushTokenReceivedCallback: " + ex);
      reject(ex);
    }
  });
}

exports.addOnPushTokenReceivedCallback = addOnPushTokenReceivedCallback;

function addBackgroundRemoteNotificationHandler(appDelegate) {
  appDelegate.prototype.applicationDidRegisterForRemoteNotificationsWithDeviceToken = function (application, deviceToken) {
    if (typeof FIRMessaging !== "undefined") {
      FIRMessaging.messaging().APNSToken = deviceToken;
    } else {
      var token = deviceToken.description.replace(/[< >]/g, "");
      _pushToken = token;

      if (_receivedPushTokenCallback) {
        _receivedPushTokenCallback(token);
      }
    }
  };

  appDelegate.prototype.applicationDidReceiveRemoteNotificationFetchCompletionHandler = function (app, notification, completionHandler) {
    if (typeof FIRAuth !== "undefined") {
      if (firebase_common_1.firebase._configured && FIRAuth.auth().canHandleNotification(notification)) {
        completionHandler(1);
        return;
      }
    }

    completionHandler(0);
    handleRemoteNotification(app, notification);
  };
}

exports.addBackgroundRemoteNotificationHandler = addBackgroundRemoteNotificationHandler;

function registerForInteractivePush(model) {
  var nativeActions = [];
  model.iosSettings.interactiveSettings.actions.forEach(function (action) {
    var notificationActionOptions = action.options ? action.options.valueOf() : UNNotificationActionOptionNone;
    var actionType = action.type || "button";
    var nativeAction;

    if (actionType === "input") {
      nativeAction = UNTextInputNotificationAction.actionWithIdentifierTitleOptionsTextInputButtonTitleTextInputPlaceholder(action.identifier, action.title, notificationActionOptions, action.submitLabel || "Submit", action.placeholder);
    } else if (actionType === "button") {
      nativeAction = UNNotificationAction.actionWithIdentifierTitleOptions(action.identifier, action.title, notificationActionOptions);
    } else {
      console.log("Unsupported action type: " + action.type);
    }

    nativeActions.push(nativeAction);
  });
  var actions = NSArray.arrayWithArray(nativeActions);
  var nativeCategories = [];
  model.iosSettings.interactiveSettings.categories.forEach(function (category) {
    var nativeCategory = UNNotificationCategory.categoryWithIdentifierActionsIntentIdentifiersOptions(category.identifier, actions, null, null);
    nativeCategories.push(nativeCategory);
  });
  var center = utils_1.ios.getter(UNUserNotificationCenter, UNUserNotificationCenter.currentNotificationCenter);
  var nsSetCategories = new NSSet(nativeCategories);
  center.setNotificationCategories(nsSetCategories);

  if (model.onNotificationActionTakenCallback) {
    _addOnNotificationActionTakenCallback(model.onNotificationActionTakenCallback);
  }
}

exports.registerForInteractivePush = registerForInteractivePush;

function prepAppDelegate() {
  _addObserver("com.firebase.iid.notif.refresh-token", function (notification) {
    return exports.onTokenRefreshNotification(notification.object);
  });

  _addObserver(UIApplicationDidFinishLaunchingNotification, function (appNotification) {
    if (applicationSettings.getBoolean(NOTIFICATIONS_REGISTRATION_KEY, false)) {
      _registerForRemoteNotifications();
    }
  });

  _addObserver(UIApplicationDidBecomeActiveNotification, function (appNotification) {
    _processPendingNotifications();

    if (!_messagingConnected) {
      _messagingConnectWithCompletion();
    }
  });

  _addObserver(UIApplicationDidEnterBackgroundNotification, function (appNotification) {
    if (_messagingConnected) {
      FIRMessaging.messaging().disconnect();
    }
  });

  _addObserver(UIApplicationWillEnterForegroundNotification, function (appNotification) {
    if (_messagingConnected !== null) {
      FIRMessaging.messaging().connectWithCompletion(function (error) {
        if (!error) {
          _messagingConnected = true;
        }
      });
    }
  });
}

exports.prepAppDelegate = prepAppDelegate;

function subscribeToTopic(topicName) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof FIRMessaging === "undefined") {
        reject("Enable FIRMessaging in Podfile first");
        return;
      }

      FIRMessaging.messaging().subscribeToTopicCompletion(topicName, function (error) {
        error ? reject(error.localizedDescription) : resolve();
      });
    } catch (ex) {
      console.log("Error in messaging.subscribeToTopic: " + ex);
      reject(ex);
    }
  });
}

exports.subscribeToTopic = subscribeToTopic;

function unsubscribeFromTopic(topicName) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof FIRMessaging === "undefined") {
        reject("Enable FIRMessaging in Podfile first");
        return;
      }

      FIRMessaging.messaging().unsubscribeFromTopicCompletion(topicName, function (error) {
        error ? reject(error.localizedDescription) : resolve();
      });
    } catch (ex) {
      console.log("Error in messaging.unsubscribeFromTopic: " + ex);
      reject(ex);
    }
  });
}

exports.unsubscribeFromTopic = unsubscribeFromTopic;

exports.onTokenRefreshNotification = function (token) {
  _pushToken = token;

  if (_receivedPushTokenCallback) {
    _receivedPushTokenCallback(token);
  }

  _messagingConnectWithCompletion();
};

var IosInteractivePushSettings = function () {
  function IosInteractivePushSettings() {}

  return IosInteractivePushSettings;
}();

exports.IosInteractivePushSettings = IosInteractivePushSettings;
var IosInteractiveNotificationActionOptions;

(function (IosInteractiveNotificationActionOptions) {
  IosInteractiveNotificationActionOptions[IosInteractiveNotificationActionOptions["authenticationRequired"] = 1] = "authenticationRequired";
  IosInteractiveNotificationActionOptions[IosInteractiveNotificationActionOptions["destructive"] = 2] = "destructive";
  IosInteractiveNotificationActionOptions[IosInteractiveNotificationActionOptions["foreground"] = 4] = "foreground";
})(IosInteractiveNotificationActionOptions = exports.IosInteractiveNotificationActionOptions || (exports.IosInteractiveNotificationActionOptions = {}));

var IosPushSettings = function () {
  function IosPushSettings() {}

  return IosPushSettings;
}();

exports.IosPushSettings = IosPushSettings;

var PushNotificationModel = function () {
  function PushNotificationModel() {}

  return PushNotificationModel;
}();

exports.PushNotificationModel = PushNotificationModel;

var NotificationActionResponse = function () {
  function NotificationActionResponse() {}

  return NotificationActionResponse;
}();

exports.NotificationActionResponse = NotificationActionResponse;

function areNotificationsEnabled() {
  var app = utils_1.ios.getter(UIApplication, UIApplication.sharedApplication);
  return app.currentUserNotificationSettings.types > 0;
}

exports.areNotificationsEnabled = areNotificationsEnabled;

var updateUserInfo = function (userInfoJSON) {
  if (userInfoJSON.aps && userInfoJSON.aps.alert) {
    userInfoJSON.title = userInfoJSON.aps.alert.title;
    userInfoJSON.body = userInfoJSON.aps.alert.body;
  }

  if (!userInfoJSON.hasOwnProperty("data")) {
    userInfoJSON.data = {};
  }

  Object.keys(userInfoJSON).forEach(function (key) {
    if (key !== "data") userInfoJSON.data[key] = userInfoJSON[key];
  });
  userInfoJSON.aps = undefined;
};

function _registerForRemoteNotifications() {
  var app = utils_1.ios.getter(UIApplication, UIApplication.sharedApplication);

  if (!app) {
    application.on("launch", function () {
      return _registerForRemoteNotifications();
    });
    return;
  }

  if (_registerForRemoteNotificationsRanThisSession) {
    return;
  }

  _registerForRemoteNotificationsRanThisSession = true;

  if (parseInt(platform_1.device.osVersion) >= 10) {
    var authorizationOptions = 4 | 2 | 1;
    var curNotCenter = utils_1.ios.getter(UNUserNotificationCenter, UNUserNotificationCenter.currentNotificationCenter);
    curNotCenter.requestAuthorizationWithOptionsCompletionHandler(authorizationOptions, function (granted, error) {
      if (!error) {
        if (app === null) {
          app = utils_1.ios.getter(UIApplication, UIApplication.sharedApplication);
        }

        if (app !== null) {
          utils_2.firebaseUtils.invokeOnRunLoop(function () {
            return app.registerForRemoteNotifications();
          });
        }
      } else {
        console.log("Error requesting push notification auth: " + error);
      }
    });

    if (_showNotifications) {
      _userNotificationCenterDelegate = UNUserNotificationCenterDelegateImpl.new().initWithCallback(function (unnotification, actionIdentifier, inputText) {
        var userInfo = unnotification.request.content.userInfo;
        var userInfoJSON = utils_2.firebaseUtils.toJsObject(userInfo);
        updateUserInfo(userInfoJSON);

        if (actionIdentifier) {
          _pendingActionTakenNotifications.push({
            actionIdentifier: actionIdentifier,
            userInfoJSON: userInfoJSON,
            inputText: inputText
          });

          if (_notificationActionTakenCallback) {
            _processPendingActionTakenNotifications();
          }
        }

        userInfoJSON.foreground = utils_1.ios.getter(UIApplication, UIApplication.sharedApplication).applicationState === 0;

        _pendingNotifications.push(userInfoJSON);

        if (_receivedNotificationCallback) {
          _processPendingNotifications();
        }
      });
      curNotCenter.delegate = _userNotificationCenterDelegate;
    }

    if (typeof FIRMessaging !== "undefined") {
      _firebaseRemoteMessageDelegate = FIRMessagingDelegateImpl.new().initWithCallback(function (appDataDictionary) {
        var userInfoJSON = utils_2.firebaseUtils.toJsObject(appDataDictionary);
        updateUserInfo(userInfoJSON);

        _pendingNotifications.push(userInfoJSON);

        var asJs = utils_2.firebaseUtils.toJsObject(appDataDictionary.objectForKey("notification"));

        if (asJs) {
          userInfoJSON.title = asJs.title;
          userInfoJSON.body = asJs.body;
        }

        var app = utils_1.ios.getter(UIApplication, UIApplication.sharedApplication);

        if (app.applicationState === 0) {
          userInfoJSON.foreground = true;

          if (_receivedNotificationCallback) {
            _processPendingNotifications();
          }
        } else {
          userInfoJSON.foreground = false;
        }
      });
      FIRMessaging.messaging().delegate = _firebaseRemoteMessageDelegate;
    }
  } else {
    var notificationTypes = 4 | 1 | 2 | 1;
    var notificationSettings = UIUserNotificationSettings.settingsForTypesCategories(notificationTypes, null);
    utils_2.firebaseUtils.invokeOnRunLoop(function () {
      app.registerForRemoteNotifications();
    });
    app.registerUserNotificationSettings(notificationSettings);
  }
}

function _messagingConnectWithCompletion() {
  return new Promise(function (resolve, reject) {
    if (typeof FIRMessaging === "undefined") {
      resolve();
      return;
    }

    FIRMessaging.messaging().connectWithCompletion(function (error) {
      if (error) {
        return reject(error);
      }

      _messagingConnected = true;
      resolve();
    });
  });
}

function _addOnNotificationActionTakenCallback(callback) {
  return new Promise(function (resolve, reject) {
    try {
      _notificationActionTakenCallback = callback;

      _processPendingActionTakenNotifications();

      resolve();
    } catch (ex) {
      console.log("Error in messaging._addOnNotificationActionTakenCallback: " + ex);
      reject(ex);
    }
  });
}

function _processPendingNotifications() {
  var app = utils_1.ios.getter(UIApplication, UIApplication.sharedApplication);

  if (!app) {
    application.on("launch", function () {
      return _processPendingNotifications();
    });
    return;
  }

  if (_receivedNotificationCallback) {
    for (var p in _pendingNotifications) {
      _receivedNotificationCallback(_pendingNotifications[p]);
    }

    _pendingNotifications = [];

    if (app.applicationState === 0) {
      app.applicationIconBadgeNumber = 0;
    }
  }
}

function _processPendingActionTakenNotifications() {
  var app = utils_1.ios.getter(UIApplication, UIApplication.sharedApplication);

  if (!app) {
    application.on("launch", function () {
      return _processPendingNotifications();
    });
    return;
  }

  if (_notificationActionTakenCallback) {
    for (var p in _pendingActionTakenNotifications) {
      _notificationActionTakenCallback(_pendingActionTakenNotifications[p].actionIdentifier, _pendingActionTakenNotifications[p].userInfoJSON, _pendingActionTakenNotifications[p].inputText);
    }

    _pendingActionTakenNotifications = [];

    if (app.applicationState === 0) {
      app.applicationIconBadgeNumber = 0;
    }
  }
}

function _addObserver(eventName, callback) {
  var queue = utils_1.ios.getter(NSOperationQueue, NSOperationQueue.mainQueue);
  return utils_1.ios.getter(NSNotificationCenter, NSNotificationCenter.defaultCenter).addObserverForNameObjectQueueUsingBlock(eventName, null, queue, callback);
}

var UNUserNotificationCenterDelegateImpl = function (_super) {
  __extends(UNUserNotificationCenterDelegateImpl, _super);

  function UNUserNotificationCenterDelegateImpl() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  UNUserNotificationCenterDelegateImpl.new = function () {
    if (UNUserNotificationCenterDelegateImpl.ObjCProtocols.length === 0 && typeof UNUserNotificationCenterDelegate !== "undefined") {
      UNUserNotificationCenterDelegateImpl.ObjCProtocols.push(UNUserNotificationCenterDelegate);
    }

    return _super.new.call(this);
  };

  UNUserNotificationCenterDelegateImpl.prototype.initWithCallback = function (callback) {
    this.callback = callback;
    return this;
  };

  UNUserNotificationCenterDelegateImpl.prototype.userNotificationCenterWillPresentNotificationWithCompletionHandler = function (center, notification, completionHandler) {
    var userInfo = notification.request.content.userInfo;
    var userInfoJSON = utils_2.firebaseUtils.toJsObject(userInfo);

    if (_showNotificationsWhenInForeground || userInfoJSON["gcm.notification.showWhenInForeground"] === "true" || userInfoJSON["showWhenInForeground"] === true || userInfoJSON.aps && userInfoJSON.aps.showWhenInForeground === true) {
      completionHandler(4 | 2 | 1);
    } else {
      this.callback(notification);
      completionHandler(0);
    }
  };

  UNUserNotificationCenterDelegateImpl.prototype.userNotificationCenterDidReceiveNotificationResponseWithCompletionHandler = function (center, response, completionHandler) {
    if (response && response.actionIdentifier === UNNotificationDismissActionIdentifier) {
      completionHandler();
      return;
    }

    this.callback(response.notification, response.actionIdentifier, response.userText);
    completionHandler();
  };

  UNUserNotificationCenterDelegateImpl.ObjCProtocols = [];
  return UNUserNotificationCenterDelegateImpl;
}(NSObject);

var FIRMessagingDelegateImpl = function (_super) {
  __extends(FIRMessagingDelegateImpl, _super);

  function FIRMessagingDelegateImpl() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  FIRMessagingDelegateImpl.new = function () {
    if (FIRMessagingDelegateImpl.ObjCProtocols.length === 0 && typeof FIRMessagingDelegate !== "undefined") {
      FIRMessagingDelegateImpl.ObjCProtocols.push(FIRMessagingDelegate);
    }

    return _super.new.call(this);
  };

  FIRMessagingDelegateImpl.prototype.initWithCallback = function (callback) {
    this.callback = callback;
    return this;
  };

  FIRMessagingDelegateImpl.prototype.messagingDidReceiveMessage = function (messaging, remoteMessage) {
    this.callback(remoteMessage.appData);
  };

  FIRMessagingDelegateImpl.prototype.messagingDidReceiveRegistrationToken = function (messaging, fcmToken) {
    exports.onTokenRefreshNotification(fcmToken);
  };

  FIRMessagingDelegateImpl.ObjCProtocols = [];
  return FIRMessagingDelegateImpl;
}(NSObject);

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/mlkit/barcodescanning/barcodescanning-common.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var view_base_1 = __webpack_require__("tns-core-modules/ui/core/view-base");

var properties_1 = __webpack_require__("tns-core-modules/ui/core/properties");

var mlkit_cameraview_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/mlkit-cameraview.js");

var BarcodeFormat;

(function (BarcodeFormat) {
  BarcodeFormat[BarcodeFormat["CODE_128"] = 1] = "CODE_128";
  BarcodeFormat[BarcodeFormat["CODE_39"] = 2] = "CODE_39";
  BarcodeFormat[BarcodeFormat["CODE_93"] = 4] = "CODE_93";
  BarcodeFormat[BarcodeFormat["CODABAR"] = 8] = "CODABAR";
  BarcodeFormat[BarcodeFormat["DATA_MATRIX"] = 16] = "DATA_MATRIX";
  BarcodeFormat[BarcodeFormat["EAN_13"] = 32] = "EAN_13";
  BarcodeFormat[BarcodeFormat["EAN_8"] = 64] = "EAN_8";
  BarcodeFormat[BarcodeFormat["ITF"] = 128] = "ITF";
  BarcodeFormat[BarcodeFormat["QR_CODE"] = 256] = "QR_CODE";
  BarcodeFormat[BarcodeFormat["UPC_A"] = 512] = "UPC_A";
  BarcodeFormat[BarcodeFormat["UPC_E"] = 1024] = "UPC_E";
  BarcodeFormat[BarcodeFormat["PDF417"] = 2048] = "PDF417";
  BarcodeFormat[BarcodeFormat["AZTEC"] = 4096] = "AZTEC";
})(BarcodeFormat = exports.BarcodeFormat || (exports.BarcodeFormat = {}));

exports.formatsProperty = new properties_1.Property({
  name: "formats",
  defaultValue: null
});
exports.beepOnScanProperty = new properties_1.Property({
  name: "beepOnScan",
  defaultValue: true,
  valueConverter: view_base_1.booleanConverter
});
exports.reportDuplicatesProperty = new properties_1.Property({
  name: "reportDuplicates",
  defaultValue: false,
  valueConverter: view_base_1.booleanConverter
});

var MLKitBarcodeScanner = function (_super) {
  __extends(MLKitBarcodeScanner, _super);

  function MLKitBarcodeScanner() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MLKitBarcodeScanner.prototype[exports.formatsProperty.setNative] = function (value) {
    this.formats = value;
  };

  MLKitBarcodeScanner.prototype[exports.beepOnScanProperty.setNative] = function (value) {
    this.beepOnScan = value;
  };

  MLKitBarcodeScanner.prototype[exports.reportDuplicatesProperty.setNative] = function (value) {
    this.reportDuplicates = value;
  };

  return MLKitBarcodeScanner;
}(mlkit_cameraview_1.MLKitCameraView);

exports.MLKitBarcodeScanner = MLKitBarcodeScanner;
exports.formatsProperty.register(MLKitBarcodeScanner);
exports.beepOnScanProperty.register(MLKitBarcodeScanner);
exports.reportDuplicatesProperty.register(MLKitBarcodeScanner);

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/mlkit/barcodescanning/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var image_source_1 = __webpack_require__("tns-core-modules/image-source");

var barcodescanning_common_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/barcodescanning/barcodescanning-common.js");

exports.BarcodeFormat = barcodescanning_common_1.BarcodeFormat;

var MLKitBarcodeScanner = function (_super) {
  __extends(MLKitBarcodeScanner, _super);

  function MLKitBarcodeScanner() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MLKitBarcodeScanner.prototype.createDetector = function () {
    var formats;

    if (this.formats) {
      formats = [];
      var requestedFormats = this.formats.split(",");
      requestedFormats.forEach(function (format) {
        return formats.push(barcodescanning_common_1.BarcodeFormat[format.trim().toUpperCase()]);
      });
    }

    if (this.beepOnScan) {
      AVAudioSession.sharedInstance().setCategoryModeOptionsError(AVAudioSessionCategoryPlayback, AVAudioSessionModeDefault, 1);
      var barcodeBundlePath = NSBundle.bundleWithIdentifier("org.nativescript.plugin.firebase.MLKit").bundlePath;
      this.player = new AVAudioPlayer({
        contentsOfURL: NSURL.fileURLWithPath(barcodeBundlePath + "/beep.caf")
      });
      this.player.numberOfLoops = 1;
      this.player.volume = 0.7;
      this.player.prepareToPlay();
    }

    return getBarcodeDetector(formats);
  };

  MLKitBarcodeScanner.prototype.createSuccessListener = function () {
    var _this = this;

    return function (barcodes, error) {
      if (error !== null) {
        console.log(error.localizedDescription);
      } else if (barcodes !== null) {
        var result = {
          barcodes: []
        };

        for (var i = 0, l = barcodes.count; i < l; i++) {
          var barcode = barcodes.objectAtIndex(i);
          result.barcodes.push({
            value: barcode.rawValue,
            format: barcodescanning_common_1.BarcodeFormat[barcode.format],
            ios: barcode,
            bounds: barcode.frame
          });
        }

        _this.notify({
          eventName: MLKitBarcodeScanner.scanResultEvent,
          object: _this,
          value: result
        });

        if (barcodes.count > 0 && _this.player) {
          _this.player.play();
        }
      }
    };
  };

  MLKitBarcodeScanner.prototype.rotateRecording = function () {
    return false;
  };

  return MLKitBarcodeScanner;
}(barcodescanning_common_1.MLKitBarcodeScanner);

exports.MLKitBarcodeScanner = MLKitBarcodeScanner;

function getBarcodeDetector(formats) {
  if (formats && formats.length > 0) {
    var barcodeFormats_1 = 0;
    formats.forEach(function (format) {
      return barcodeFormats_1 |= format;
    });
    return FIRVision.vision().barcodeDetectorWithOptions(FIRVisionBarcodeDetectorOptions.alloc().initWithFormats(barcodeFormats_1));
  } else {
    return FIRVision.vision().barcodeDetector();
  }
}

function scanBarcodesOnDevice(options) {
  return new Promise(function (resolve, reject) {
    try {
      var barcodeDetector = getBarcodeDetector(options.formats);
      barcodeDetector.detectInImageCompletion(getImage(options), function (barcodes, error) {
        if (error !== null) {
          reject(error.localizedDescription);
        } else if (barcodes !== null) {
          var result = {
            barcodes: []
          };

          for (var i = 0, l = barcodes.count; i < l; i++) {
            var barcode = barcodes.objectAtIndex(i);
            result.barcodes.push({
              value: barcode.rawValue,
              format: barcodescanning_common_1.BarcodeFormat[barcode.format],
              ios: barcode,
              bounds: barcode.frame
            });
          }

          resolve(result);
        }
      });
    } catch (ex) {
      console.log("Error in firebase.mlkit.scanBarcodesOnDevice: " + ex);
      reject(ex);
    }
  });
}

exports.scanBarcodesOnDevice = scanBarcodesOnDevice;

function getImage(options) {
  var image = options.image instanceof image_source_1.ImageSource ? options.image.ios : options.image.imageSource.ios;
  return FIRVisionImage.alloc().initWithImage(image);
}

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/mlkit/custommodel/custommodel-common.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var fs = __webpack_require__("tns-core-modules/file-system");

var properties_1 = __webpack_require__("tns-core-modules/ui/core/properties");

var mlkit_cameraview_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/mlkit-cameraview.js");

exports.localModelFileProperty = new properties_1.Property({
  name: "localModelFile",
  defaultValue: null
});
exports.labelsFileProperty = new properties_1.Property({
  name: "labelsFile",
  defaultValue: null
});
exports.modelInputShapeProperty = new properties_1.Property({
  name: "modelInputShape",
  defaultValue: null
});
exports.modelInputTypeProperty = new properties_1.Property({
  name: "modelInputType",
  defaultValue: null
});
exports.maxResultsProperty = new properties_1.Property({
  name: "maxResults",
  defaultValue: 5
});

var MLKitCustomModel = function (_super) {
  __extends(MLKitCustomModel, _super);

  function MLKitCustomModel() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MLKitCustomModel.prototype[exports.localModelFileProperty.setNative] = function (value) {
    this.localModelFile = value;
  };

  MLKitCustomModel.prototype[exports.labelsFileProperty.setNative] = function (value) {
    this.labelsFile = value;

    if (value.indexOf("~/") === 0) {
      this.labels = getLabelsFromAppFolder(value);
    } else {
      console.log("For the 'labelsFile' property, use the ~/ prefix for now..");
      return;
    }
  };

  MLKitCustomModel.prototype[exports.maxResultsProperty.setNative] = function (value) {
    this.maxResults = parseInt(value);
  };

  MLKitCustomModel.prototype[exports.modelInputShapeProperty.setNative] = function (value) {
    if (typeof value === "string") {
      this.modelInputShape = value.split(",").map(function (v) {
        return parseInt(v.trim());
      });
    }
  };

  MLKitCustomModel.prototype[exports.modelInputTypeProperty.setNative] = function (value) {
    this.modelInputType = value;
  };

  MLKitCustomModel.scanResultEvent = "scanResult";
  return MLKitCustomModel;
}(mlkit_cameraview_1.MLKitCameraView);

exports.MLKitCustomModel = MLKitCustomModel;
exports.localModelFileProperty.register(MLKitCustomModel);
exports.labelsFileProperty.register(MLKitCustomModel);
exports.maxResultsProperty.register(MLKitCustomModel);
exports.modelInputShapeProperty.register(MLKitCustomModel);
exports.modelInputTypeProperty.register(MLKitCustomModel);

function getLabelsFromAppFolder(labelsFile) {
  var labelsPath = fs.knownFolders.currentApp().path + labelsFile.substring(1);
  return getLabelsFromFile(labelsPath);
}

exports.getLabelsFromAppFolder = getLabelsFromAppFolder;

function getLabelsFromFile(labelsFile) {
  var fileContents = fs.File.fromPath(labelsFile).readTextSync();
  var lines = fileContents.split("\n");

  while (lines[lines.length - 1].trim() === "") {
    lines.pop();
  }

  return lines;
}

exports.getLabelsFromFile = getLabelsFromFile;

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/mlkit/custommodel/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var fs = __webpack_require__("tns-core-modules/file-system");

var image_source_1 = __webpack_require__("tns-core-modules/image-source");

var custommodel_common_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/custommodel/custommodel-common.js");

var MLKitCustomModel = function (_super) {
  __extends(MLKitCustomModel, _super);

  function MLKitCustomModel() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MLKitCustomModel.prototype.createDetector = function () {
    this.modelInterpreter = getInterpreter(this.localModelFile);
    return this.modelInterpreter;
  };

  MLKitCustomModel.prototype.runDetector = function (image, onComplete) {
    var _this = this;

    var modelExpectsWidth = this.modelInputShape[1];
    var modelExpectsHeight = this.modelInputShape[2];
    var isQuantized = this.modelInputType !== "FLOAT32";

    if (!this.inputOutputOptions) {
      this.inputOutputOptions = FIRModelInputOutputOptions.new();
      var inputType = void 0;
      var arrIn_1 = NSMutableArray.new();
      this.modelInputShape.forEach(function (dim) {
        return arrIn_1.addObject(dim);
      });
      inputType = isQuantized ? 3 : 1;
      this.inputOutputOptions.setInputFormatForIndexTypeDimensionsError(0, inputType, arrIn_1);
      var arrOut = NSMutableArray.new();
      arrOut.addObject(1);
      arrOut.addObject(this.labels.length);
      this.inputOutputOptions.setOutputFormatForIndexTypeDimensionsError(0, inputType, arrOut);
    }

    var inputData;

    if (isQuantized) {
      inputData = TNSMLKitCameraView.scaledDataWithSizeByteCountIsQuantized(image, CGSizeMake(modelExpectsWidth, modelExpectsHeight), modelExpectsWidth * modelExpectsHeight * this.modelInputShape[3] * this.modelInputShape[0], isQuantized);
    } else {
      inputData = TNSMLKitCameraView.getInputDataWithRowsAndColumnsAndType(image, modelExpectsWidth, modelExpectsHeight, "Float32");
    }

    var inputs = FIRModelInputs.new();
    inputs.addInputError(inputData);
    this.modelInterpreter.runWithInputsOptionsCompletion(inputs, this.inputOutputOptions, function (outputs, error) {
      if (error !== null) {
        console.log(error.localizedDescription);
      } else if (outputs !== null) {
        var probabilities = outputs.outputAtIndexError(0)[0];

        if (_this.labels.length !== probabilities.count) {
          console.log("The number of labels (" + _this.labels.length + ") is not equal to the interpretation result (" + probabilities.count + ")!");
          onComplete();
        } else {
          var result = {
            result: getSortedResult(_this.labels, probabilities, _this.maxResults)
          };

          _this.notify({
            eventName: MLKitCustomModel.scanResultEvent,
            object: _this,
            value: result
          });
        }
      }

      onComplete();
    });
  };

  MLKitCustomModel.prototype.createSuccessListener = function () {
    var _this = this;

    return function (outputs, error) {
      if (error !== null) {
        console.log(error.localizedDescription);
      } else if (outputs !== null) {
        var result = {
          result: []
        };
        console.log(">>> outputs: " + outputs);

        _this.notify({
          eventName: MLKitCustomModel.scanResultEvent,
          object: _this,
          value: result
        });
      }
    };
  };

  MLKitCustomModel.prototype.rotateRecording = function () {
    return false;
  };

  return MLKitCustomModel;
}(custommodel_common_1.MLKitCustomModel);

exports.MLKitCustomModel = MLKitCustomModel;

function getInterpreter(localModelFile) {
  var localModelRegistrationSuccess = false;
  var cloudModelRegistrationSuccess = false;
  var localModelName;

  if (localModelFile) {
    localModelName = localModelFile.lastIndexOf("/") === -1 ? localModelFile : localModelFile.substring(localModelFile.lastIndexOf("/") + 1);

    if (FIRModelManager.modelManager().localModelWithName(localModelName)) {
      localModelRegistrationSuccess = true;
    } else {
      var localModelFilePath = void 0;

      if (localModelFile.indexOf("~/") === 0) {
        localModelFilePath = fs.knownFolders.currentApp().path + localModelFile.substring(1);
      } else {
        localModelFilePath = NSBundle.mainBundle.pathForResourceOfType(localModelFile.substring(0, localModelFile.lastIndexOf(".")), localModelFile.substring(localModelFile.lastIndexOf(".") + 1));
      }

      var localModelSource = FIRLocalModel.alloc().initWithNamePath(localModelName, localModelFilePath);
      localModelRegistrationSuccess = FIRModelManager.modelManager().registerLocalModel(localModelSource);
    }
  }

  if (!localModelRegistrationSuccess && !cloudModelRegistrationSuccess) {
    console.log("No (cloud or local) model was successfully loaded.");
    return null;
  }

  var fIRModelOptions = FIRModelOptions.alloc().initWithRemoteModelNameLocalModelName(null, localModelRegistrationSuccess ? localModelName : null);
  return FIRModelInterpreter.modelInterpreterWithOptions(fIRModelOptions);
}

function useCustomModel(options) {
  return new Promise(function (resolve, reject) {
    try {
      var image = options.image instanceof image_source_1.ImageSource ? options.image.ios : options.image.imageSource.ios;
      var isQuant = options.modelInput[0].type !== "FLOAT32";
      var inputData = void 0;

      if (isQuant) {
        inputData = TNSMLKitCameraView.scaledDataWithSizeByteCountIsQuantized(image, CGSizeMake(options.modelInput[0].shape[1], options.modelInput[0].shape[2]), options.modelInput[0].shape[1] * options.modelInput[0].shape[2] * options.modelInput[0].shape[3] * options.modelInput[0].shape[0], options.modelInput[0].type !== "FLOAT32");
      } else {
        inputData = TNSMLKitCameraView.getInputDataWithRowsAndColumnsAndType(image, options.modelInput[0].shape[1], options.modelInput[0].shape[2], "Float32");
      }

      var inputs = FIRModelInputs.new();
      inputs.addInputError(inputData);
      var inputOptions_1 = FIRModelInputOutputOptions.new();
      var inputType_1;
      options.modelInput.forEach(function (dimensionAndType, i) {
        var arrIn = NSMutableArray.new();
        dimensionAndType.shape.forEach(function (dim) {
          return arrIn.addObject(dim);
        });
        inputType_1 = dimensionAndType.type === "FLOAT32" ? 1 : 3;
        inputOptions_1.setInputFormatForIndexTypeDimensionsError(i, inputType_1, arrIn);
      });
      var labels_1;

      if (options.labelsFile.indexOf("~/") === 0) {
        labels_1 = custommodel_common_1.getLabelsFromAppFolder(options.labelsFile);
      } else {
        var labelsFile = NSBundle.mainBundle.pathForResourceOfType(options.labelsFile.substring(0, options.labelsFile.lastIndexOf(".")), options.labelsFile.substring(options.labelsFile.lastIndexOf(".") + 1));
        labels_1 = custommodel_common_1.getLabelsFromFile(labelsFile);
      }

      var arrOut = NSMutableArray.new();
      arrOut.addObject(1);
      arrOut.addObject(labels_1.length);
      inputOptions_1.setOutputFormatForIndexTypeDimensionsError(0, inputType_1, arrOut);
      var modelInterpreter = getInterpreter(options.localModelFile);
      modelInterpreter.runWithInputsOptionsCompletion(inputs, inputOptions_1, function (outputs, error) {
        if (error !== null) {
          reject(error.localizedDescription);
        } else if (outputs !== null) {
          var probabilities = outputs.outputAtIndexError(0)[0];

          if (labels_1.length !== probabilities.count) {
            console.log("The number of labels in " + options.labelsFile + " (" + labels_1.length + ") is not equal to the interpretation result (" + probabilities.count + ")!");
            return;
          }

          var result = {
            result: getSortedResult(labels_1, probabilities, options.maxResults)
          };
          resolve(result);
        }
      });
    } catch (ex) {
      console.log("Error in firebase.mlkit.useCustomModel: " + ex);
      reject(ex);
    }
  });
}

exports.useCustomModel = useCustomModel;

function getSortedResult(labels, probabilities, maxResults) {
  if (maxResults === void 0) {
    maxResults = 5;
  }

  var result = [];
  labels.forEach(function (text, i) {
    return result.push({
      text: text,
      confidence: probabilities.objectAtIndex(i)
    });
  });
  result.sort(function (a, b) {
    return a.confidence < b.confidence ? 1 : a.confidence === b.confidence ? 0 : -1;
  });

  if (result.length > maxResults) {
    result.splice(maxResults);
  }

  var softmaxScale = 1.0 / 256.0;
  result.map(function (r) {
    return r.confidence = NSNumber.numberWithFloat(softmaxScale * r.confidence);
  });
  return result;
}

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/mlkit/facedetection/facedetection-common.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var view_base_1 = __webpack_require__("tns-core-modules/ui/core/view-base");

var properties_1 = __webpack_require__("tns-core-modules/ui/core/properties");

var mlkit_cameraview_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/mlkit-cameraview.js");

exports.minimumFaceSizeProperty = new properties_1.Property({
  name: "minimumFaceSize",
  defaultValue: 0.1
});
exports.enableFaceTrackingProperty = new properties_1.Property({
  name: "enableFaceTracking",
  defaultValue: false,
  valueConverter: view_base_1.booleanConverter
});
var detectionModeConverter = view_base_1.makeParser(view_base_1.makeValidator("accurate", "fast"));
exports.detectionModeProperty = new properties_1.Property({
  name: "detectionMode",
  defaultValue: "fast",
  valueConverter: detectionModeConverter
});

var MLKitFaceDetection = function (_super) {
  __extends(MLKitFaceDetection, _super);

  function MLKitFaceDetection() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MLKitFaceDetection.prototype[exports.minimumFaceSizeProperty.setNative] = function (value) {
    this.minimumFaceSize = value;
  };

  MLKitFaceDetection.prototype[exports.enableFaceTrackingProperty.setNative] = function (value) {
    this.enableFaceTracking = value;
  };

  MLKitFaceDetection.prototype[exports.detectionModeProperty.setNative] = function (value) {
    this.detectionMode = value;
  };

  MLKitFaceDetection.scanResultEvent = "scanResult";
  return MLKitFaceDetection;
}(mlkit_cameraview_1.MLKitCameraView);

exports.MLKitFaceDetection = MLKitFaceDetection;
exports.minimumFaceSizeProperty.register(MLKitFaceDetection);
exports.enableFaceTrackingProperty.register(MLKitFaceDetection);
exports.detectionModeProperty.register(MLKitFaceDetection);

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/mlkit/facedetection/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var image_source_1 = __webpack_require__("tns-core-modules/image-source");

var utils_1 = __webpack_require__("tns-core-modules/utils/utils");

var facedetection_common_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/facedetection/facedetection-common.js");

var MLKitFaceDetection = function (_super) {
  __extends(MLKitFaceDetection, _super);

  function MLKitFaceDetection() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MLKitFaceDetection.prototype.createDetector = function () {
    return getDetector({
      detectionMode: this.detectionMode,
      enableFaceTracking: this.enableFaceTracking,
      minimumFaceSize: this.minimumFaceSize
    });
  };

  MLKitFaceDetection.prototype.createSuccessListener = function () {
    var _this = this;

    return function (faces, error) {
      if (error !== null) {
        console.log(error.localizedDescription);
      } else if (faces !== null && faces.count > 0) {
        var result = {
          faces: []
        };

        for (var i = 0, l = faces.count; i < l; i++) {
          var face = faces.objectAtIndex(i);
          result.faces.push({
            smilingProbability: face.hasSmilingProbability ? face.smilingProbability : undefined,
            leftEyeOpenProbability: face.hasLeftEyeOpenProbability ? face.leftEyeOpenProbability : undefined,
            rightEyeOpenProbability: face.hasRightEyeOpenProbability ? face.rightEyeOpenProbability : undefined,
            trackingId: face.hasTrackingID ? face.trackingID : undefined,
            bounds: face.frame,
            headEulerAngleY: face.headEulerAngleY,
            headEulerAngleZ: face.headEulerAngleZ
          });
        }

        _this.notify({
          eventName: MLKitFaceDetection.scanResultEvent,
          object: _this,
          value: result
        });
      }
    };
  };

  MLKitFaceDetection.prototype.rotateRecording = function () {
    return false;
  };

  MLKitFaceDetection.prototype.getVisionOrientation = function (imageOrientation) {
    if (imageOrientation === 0 && !utils_1.ios.isLandscape()) {
      return 6;
    } else {
      return _super.prototype.getVisionOrientation.call(this, imageOrientation);
    }
  };

  return MLKitFaceDetection;
}(facedetection_common_1.MLKitFaceDetection);

exports.MLKitFaceDetection = MLKitFaceDetection;

function getDetector(options) {
  var firVision = FIRVision.vision();
  var firOptions = FIRVisionFaceDetectorOptions.new();
  firOptions.performanceMode = options.detectionMode === "accurate" ? 2 : 1;
  firOptions.landmarkMode = 2;
  firOptions.classificationMode = 2;
  firOptions.minFaceSize = options.minimumFaceSize;
  firOptions.trackingEnabled = options.enableFaceTracking === true;
  return firVision.faceDetectorWithOptions(firOptions);
}

function detectFacesOnDevice(options) {
  return new Promise(function (resolve, reject) {
    try {
      var faceDetector = getDetector(options);
      faceDetector.processImageCompletion(getImage(options), function (faces, error) {
        if (error !== null) {
          reject(error.localizedDescription);
        } else if (faces !== null) {
          var result = {
            faces: []
          };

          for (var i = 0, l = faces.count; i < l; i++) {
            var face = faces.objectAtIndex(i);
            result.faces.push({
              smilingProbability: face.hasSmilingProbability ? face.smilingProbability : undefined,
              leftEyeOpenProbability: face.hasLeftEyeOpenProbability ? face.leftEyeOpenProbability : undefined,
              rightEyeOpenProbability: face.hasRightEyeOpenProbability ? face.rightEyeOpenProbability : undefined,
              trackingId: face.hasTrackingID ? face.trackingID : undefined,
              bounds: face.frame,
              headEulerAngleY: face.headEulerAngleY,
              headEulerAngleZ: face.headEulerAngleZ
            });
          }

          resolve(result);
        }
      });
    } catch (ex) {
      console.log("Error in firebase.mlkit.detectFaces: " + ex);
      reject(ex);
    }
  });
}

exports.detectFacesOnDevice = detectFacesOnDevice;

function getImage(options) {
  var image = options.image instanceof image_source_1.ImageSource ? options.image.ios : options.image.imageSource.ios;
  var newImage = UIImage.alloc().initWithCGImageScaleOrientation(image.CGImage, 1, 0);
  return FIRVisionImage.alloc().initWithImage(newImage);
}

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/mlkit/imagelabeling/imagelabeling-common.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var properties_1 = __webpack_require__("tns-core-modules/ui/core/properties");

var mlkit_cameraview_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/mlkit-cameraview.js");

exports.confidenceThresholdProperty = new properties_1.Property({
  name: "confidenceThreshold",
  defaultValue: 0.5
});

var MLKitImageLabeling = function (_super) {
  __extends(MLKitImageLabeling, _super);

  function MLKitImageLabeling() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MLKitImageLabeling.prototype[exports.confidenceThresholdProperty.setNative] = function (value) {
    this.confidenceThreshold = parseFloat(value);
  };

  MLKitImageLabeling.scanResultEvent = "scanResult";
  return MLKitImageLabeling;
}(mlkit_cameraview_1.MLKitCameraView);

exports.MLKitImageLabeling = MLKitImageLabeling;
exports.confidenceThresholdProperty.register(MLKitImageLabeling);

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/mlkit/imagelabeling/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var image_source_1 = __webpack_require__("tns-core-modules/image-source");

var imagelabeling_common_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/imagelabeling/imagelabeling-common.js");

var MLKitImageLabeling = function (_super) {
  __extends(MLKitImageLabeling, _super);

  function MLKitImageLabeling() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MLKitImageLabeling.prototype.createDetector = function () {
    return getDetector(this.confidenceThreshold);
  };

  MLKitImageLabeling.prototype.createSuccessListener = function () {
    var _this = this;

    return function (labels, error) {
      if (error !== null) {
        console.log(error.localizedDescription);
      } else if (labels !== null && labels.count > 0) {
        var result = {
          labels: []
        };

        for (var i = 0, l = labels.count; i < l; i++) {
          var label = labels.objectAtIndex(i);
          result.labels.push({
            text: label.text,
            confidence: label.confidence
          });
        }

        _this.notify({
          eventName: MLKitImageLabeling.scanResultEvent,
          object: _this,
          value: result
        });
      }
    };
  };

  MLKitImageLabeling.prototype.rotateRecording = function () {
    return true;
  };

  return MLKitImageLabeling;
}(imagelabeling_common_1.MLKitImageLabeling);

exports.MLKitImageLabeling = MLKitImageLabeling;

function getDetector(confidenceThreshold) {
  var firVision = FIRVision.vision();
  var fIRVisionOnDeviceImageLabelerOptions = FIRVisionOnDeviceImageLabelerOptions.new();
  fIRVisionOnDeviceImageLabelerOptions.confidenceThreshold = confidenceThreshold || 0.5;
  return firVision.onDeviceImageLabelerWithOptions(fIRVisionOnDeviceImageLabelerOptions);
}

function labelImageOnDevice(options) {
  return new Promise(function (resolve, reject) {
    try {
      var labelDetector = getDetector(options.confidenceThreshold);
      labelDetector.processImageCompletion(getImage(options), function (labels, error) {
        if (error !== null) {
          reject(error.localizedDescription);
        } else if (labels !== null) {
          var result = {
            labels: []
          };

          for (var i = 0, l = labels.count; i < l; i++) {
            var label = labels.objectAtIndex(i);
            result.labels.push({
              text: label.text,
              confidence: label.confidence
            });
          }

          resolve(result);
        }
      });
    } catch (ex) {
      console.log("Error in firebase.mlkit.labelImageOnDevice: " + ex);
      reject(ex);
    }
  });
}

exports.labelImageOnDevice = labelImageOnDevice;

function labelImageCloud(options) {
  return new Promise(function (resolve, reject) {
    try {
      var fIRVisionCloudImageLabelerOptions = FIRVisionCloudImageLabelerOptions.new();
      fIRVisionCloudImageLabelerOptions.confidenceThreshold = options.confidenceThreshold || 0.5;
      var firVision = FIRVision.vision();
      var labeler = firVision.cloudImageLabelerWithOptions(fIRVisionCloudImageLabelerOptions);
      labeler.processImageCompletion(getImage(options), function (labels, error) {
        if (error !== null) {
          reject(error.localizedDescription);
        } else if (labels !== null) {
          var result = {
            labels: []
          };

          for (var i = 0, l = labels.count; i < l; i++) {
            var label = labels.objectAtIndex(i);
            result.labels.push({
              text: label.text,
              confidence: label.confidence
            });
          }

          console.log(">>> cloud image labeling result: " + JSON.stringify(result.labels));
          resolve(result);
        }
      });
    } catch (ex) {
      console.log("Error in firebase.mlkit.labelImageCloud: " + ex);
      reject(ex);
    }
  });
}

exports.labelImageCloud = labelImageCloud;

function getImage(options) {
  var image = options.image instanceof image_source_1.ImageSource ? options.image.ios : options.image.imageSource.ios;
  return FIRVisionImage.alloc().initWithImage(image);
}

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/mlkit/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var textrecognition = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/textrecognition/index.js");

exports.textrecognition = textrecognition;

var barcodescanning = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/barcodescanning/index.js");

exports.barcodescanning = barcodescanning;

var facedetection = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/facedetection/index.js");

exports.facedetection = facedetection;

var imagelabeling = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/imagelabeling/index.js");

exports.imagelabeling = imagelabeling;

var landmarkrecognition = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/landmarkrecognition/index.js");

exports.landmarkrecognition = landmarkrecognition;

var custommodel = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/custommodel/index.js");

exports.custommodel = custommodel;

var naturallanguageidentification = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/naturallanguageidentification/index.js");

exports.naturallanguageidentification = naturallanguageidentification;

var smartreply = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/smartreply/index.js");

exports.smartreply = smartreply;

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/mlkit/landmarkrecognition/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var image_source_1 = __webpack_require__("tns-core-modules/image-source");

function getDetector(modelType, maxResults) {
  var firVision = FIRVision.vision();
  var fIRVisionCloudDetectorOptions = FIRVisionCloudDetectorOptions.alloc();
  fIRVisionCloudDetectorOptions.modelType = modelType === "latest" ? 1 : 0;
  fIRVisionCloudDetectorOptions.maxResults = maxResults || 10;
  return firVision.cloudLandmarkDetectorWithOptions(fIRVisionCloudDetectorOptions);
}

function recognizeLandmarksCloud(options) {
  return new Promise(function (resolve, reject) {
    try {
      var landmarkDetector = getDetector(options.modelType, options.maxResults);
      landmarkDetector.detectInImageCompletion(getImage(options), function (landmarks, error) {
        if (error !== null) {
          reject(error.localizedDescription);
        } else if (landmarks !== null) {
          var result = {
            landmarks: []
          };

          for (var i = 0, l = landmarks.count; i < l; i++) {
            var landmark = landmarks.objectAtIndex(i);
            console.log(">> detected landmark: " + landmark);
            result.landmarks.push({
              name: landmark.landmark,
              confidence: landmark.confidence
            });
          }

          resolve(result);
        }
      });
    } catch (ex) {
      console.log("Error in firebase.mlkit.recognizeLandmarksCloud: " + ex);
      reject(ex);
    }
  });
}

exports.recognizeLandmarksCloud = recognizeLandmarksCloud;

function getImage(options) {
  var image = options.image instanceof image_source_1.ImageSource ? options.image.ios : options.image.imageSource.ios;
  return FIRVisionImage.alloc().initWithImage(image);
}

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/mlkit/mlkit-cameraview-common.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var content_view_1 = __webpack_require__("tns-core-modules/ui/content-view");

var properties_1 = __webpack_require__("tns-core-modules/ui/core/properties");

var view_base_1 = __webpack_require__("tns-core-modules/ui/core/view-base");

exports.processEveryNthFrameProperty = new properties_1.Property({
  name: "processEveryNthFrame",
  defaultValue: 10
});
exports.preferFrontCameraProperty = new properties_1.Property({
  name: "preferFrontCamera",
  defaultValue: false,
  valueConverter: view_base_1.booleanConverter
});
exports.torchOnProperty = new properties_1.Property({
  name: "torchOn",
  defaultValue: false,
  valueConverter: view_base_1.booleanConverter
});
exports.pauseProperty = new properties_1.Property({
  name: "pause",
  defaultValue: false,
  valueConverter: view_base_1.booleanConverter
});

var MLKitCameraView = function (_super) {
  __extends(MLKitCameraView, _super);

  function MLKitCameraView() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MLKitCameraView.prototype[exports.processEveryNthFrameProperty.setNative] = function (value) {
    this.processEveryNthFrame = value;
  };

  MLKitCameraView.prototype[exports.preferFrontCameraProperty.setNative] = function (value) {
    this.preferFrontCamera = value;
  };

  MLKitCameraView.prototype[exports.torchOnProperty.setNative] = function (value) {
    this.torchOn = value;
    this.updateTorch();
  };

  MLKitCameraView.prototype[exports.pauseProperty.setNative] = function (value) {
    this.pause = value;
    this.pause ? this.pauseScanning() : this.resumeScanning();
  };

  MLKitCameraView.prototype.updateTorch = function () {};

  ;

  MLKitCameraView.prototype.pauseScanning = function () {};

  ;

  MLKitCameraView.prototype.resumeScanning = function () {};

  MLKitCameraView.scanResultEvent = "scanResult";
  return MLKitCameraView;
}(content_view_1.ContentView);

exports.MLKitCameraView = MLKitCameraView;
exports.processEveryNthFrameProperty.register(MLKitCameraView);
exports.preferFrontCameraProperty.register(MLKitCameraView);
exports.torchOnProperty.register(MLKitCameraView);
exports.pauseProperty.register(MLKitCameraView);

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/mlkit/mlkit-cameraview.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var utils_1 = __webpack_require__("tns-core-modules/utils/utils");

var application = __webpack_require__("tns-core-modules/application");

var mlkit_cameraview_common_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/mlkit-cameraview-common.js");

var MLKitCameraView = function (_super) {
  __extends(MLKitCameraView, _super);

  function MLKitCameraView() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MLKitCameraView.prototype.disposeNativeView = function () {
    _super.prototype.disposeNativeView.call(this);

    if (this.captureSession) {
      this.captureSession.stopRunning();
      this.captureSession = undefined;
    }

    this.captureDevice = undefined;
    this.previewLayer = undefined;
    this.cameraView = undefined;
    application.off("orientationChanged");
  };

  MLKitCameraView.prototype.createNativeView = function () {
    var v = _super.prototype.createNativeView.call(this);

    if (this.canUseCamera()) {
      this.initView();
    } else {
      console.log("There's no Camera on this device :(");
    }

    return v;
  };

  MLKitCameraView.prototype.canUseCamera = function () {
    try {
      return !!AVCaptureDeviceDiscoverySession && AVCaptureDevice.defaultDeviceWithMediaType(AVMediaTypeVideo) !== null && NSProcessInfo.processInfo.environment.objectForKey("SIMULATOR_DEVICE_NAME") === null;
    } catch (ignore) {
      return false;
    }
  };

  MLKitCameraView.prototype.initView = function () {
    var _this = this;

    this.captureDevice = AVCaptureDeviceDiscoverySession.discoverySessionWithDeviceTypesMediaTypePosition([AVCaptureDeviceTypeBuiltInWideAngleCamera], AVMediaTypeVideo, this.preferFrontCamera ? 2 : 1).devices.firstObject;

    if (this.torchOn) {
      this.updateTorch();
    }

    this.captureSession = AVCaptureSession.new();
    this.captureSession.sessionPreset = AVCaptureSessionPreset1280x720;

    try {
      var captureDeviceInput = AVCaptureDeviceInput.deviceInputWithDeviceError(this.captureDevice);
      this.captureSession.addInput(captureDeviceInput);
    } catch (e) {
      console.log("Error while trying to use the camera: " + e);
      return;
    }

    this.previewLayer = AVCaptureVideoPreviewLayer.layerWithSession(this.captureSession);
    this.previewLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;

    if (utils_1.ios.isLandscape()) {
      var deviceOrientation = UIDevice.currentDevice.orientation;
      this.previewLayer.connection.videoOrientation = deviceOrientation === 3 ? 3 : 4;
    } else {
      this.previewLayer.connection.videoOrientation = 1;
    }

    application.off("orientationChanged");
    application.on("orientationChanged", this.rotateOnOrientationChange.bind(this));
    setTimeout(function () {
      if (_this.ios) {
        _this.ios.layer.addSublayer(_this.previewLayer);
      }

      if (!_this.pause) {
        _this.captureSession.startRunning();
      }

      _this.cameraView = TNSMLKitCameraView.alloc().initWithCaptureSession(_this.captureSession);
      _this.cameraView.processEveryXFrames = _this.processEveryNthFrame;

      if (_this.rotateRecording()) {
        _this.cameraView.imageOrientation = 3;
      }

      _this.cameraView.delegate = TNSMLKitCameraViewDelegateImpl.createWithOwnerResultCallbackAndOptions(new WeakRef(_this), function (data) {}, {});
    }, 0);
  };

  MLKitCameraView.prototype.rotateOnOrientationChange = function (args) {
    if (this.previewLayer) {
      if (args.newValue === "landscape") {
        var deviceOrientation = UIDevice.currentDevice.orientation;
        this.previewLayer.connection.videoOrientation = deviceOrientation === 3 ? 3 : 4;
      } else if (args.newValue === "portrait") {
        this.previewLayer.connection.videoOrientation = 1;
      }
    }
  };

  MLKitCameraView.prototype.onLayout = function (left, top, right, bottom) {
    _super.prototype.onLayout.call(this, left, top, right, bottom);

    if (this.previewLayer && this.ios && this.canUseCamera()) {
      this.previewLayer.frame = this.ios.layer.bounds;
    }
  };

  MLKitCameraView.prototype.getVisionOrientation = function (imageOrientation) {
    if (imageOrientation === 0) {
      return 1;
    } else if (imageOrientation === 1) {
      return 3;
    } else if (imageOrientation === 2) {
      return 8;
    } else if (imageOrientation === 3) {
      return 6;
    } else if (imageOrientation === 4) {
      return 2;
    } else if (imageOrientation === 5) {
      return 4;
    } else if (imageOrientation === 6) {
      return 5;
    } else if (imageOrientation === 7) {
      return 7;
    } else {
      return 1;
    }
  };

  MLKitCameraView.prototype.updateTorch = function () {
    var device = this.captureDevice;

    if (device && device.hasTorch && device.lockForConfiguration()) {
      if (this.torchOn) {
        device.torchMode = 1;
        device.flashMode = 1;
      } else {
        device.torchMode = 0;
        device.flashMode = 0;
      }

      device.unlockForConfiguration();
    }
  };

  MLKitCameraView.prototype.pauseScanning = function () {
    if (this.captureSession && this.captureSession.running) {
      this.captureSession.stopRunning();
    }
  };

  ;

  MLKitCameraView.prototype.resumeScanning = function () {
    if (this.captureSession && !this.captureSession.running) {
      this.captureSession.startRunning();
    }
  };

  MLKitCameraView.prototype.runDetector = function (image, onComplete) {
    throw new Error("No custom detector implemented, so 'runDetector' can't do its thing");
  };

  return MLKitCameraView;
}(mlkit_cameraview_common_1.MLKitCameraView);

exports.MLKitCameraView = MLKitCameraView;

var TNSMLKitCameraViewDelegateImpl = function (_super) {
  __extends(TNSMLKitCameraViewDelegateImpl, _super);

  function TNSMLKitCameraViewDelegateImpl() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.detectorBusy = false;
    return _this;
  }

  TNSMLKitCameraViewDelegateImpl.createWithOwnerResultCallbackAndOptions = function (owner, callback, options) {
    if (TNSMLKitCameraViewDelegateImpl.ObjCProtocols.length === 0 && typeof TNSMLKitCameraViewDelegate !== "undefined") {
      TNSMLKitCameraViewDelegateImpl.ObjCProtocols.push(TNSMLKitCameraViewDelegate);
    }

    var delegate = TNSMLKitCameraViewDelegateImpl.new();
    delegate.owner = owner;
    delegate.options = options;
    delegate.resultCallback = callback;
    delegate.detector = owner.get().createDetector();
    delegate.onSuccessListener = owner.get().createSuccessListener();
    return delegate;
  };

  TNSMLKitCameraViewDelegateImpl.prototype.cameraDidOutputImage = function (image) {
    var _this = this;

    if (!image || this.detectorBusy) {
      return;
    }

    this.detectorBusy = true;

    var onComplete = function () {
      _this.detectorBusy = false;
    };

    if (this.detector.detectInImageCompletion) {
      this.detector.detectInImageCompletion(this.uiImageToFIRVisionImage(image), function (result, error) {
        _this.onSuccessListener(result, error);

        onComplete();
      });
    } else if (this.detector.processImageCompletion) {
      this.detector.processImageCompletion(this.uiImageToFIRVisionImage(image), function (result, error) {
        _this.onSuccessListener(result, error);

        onComplete();
      });
    } else {
      this.owner.get().runDetector(image, onComplete);
    }
  };

  TNSMLKitCameraViewDelegateImpl.prototype.uiImageToFIRVisionImage = function (image) {
    var fIRVisionImage = FIRVisionImage.alloc().initWithImage(image);
    var fIRVisionImageMetadata = FIRVisionImageMetadata.new();
    fIRVisionImageMetadata.orientation = this.owner.get().getVisionOrientation(image.imageOrientation);
    fIRVisionImage.metadata = fIRVisionImageMetadata;
    return fIRVisionImage;
  };

  TNSMLKitCameraViewDelegateImpl.ObjCProtocols = [];
  return TNSMLKitCameraViewDelegateImpl;
}(NSObject);

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/mlkit/naturallanguageidentification/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function identifyNaturalLanguage(options) {
  return new Promise(function (resolve, reject) {
    try {
      var naturalLanguage = FIRNaturalLanguage.naturalLanguage();
      var languageId = naturalLanguage.languageIdentificationWithOptions(FIRLanguageIdentificationOptions.alloc().initWithConfidenceThreshold(options.confidenceThreshold || 0.5));
      languageId.identifyLanguageForTextCompletion(options.text, function (languageCode, error) {
        if (error !== null) {
          console.log("Failed with error: " + error.localizedDescription);
          reject(error.localizedDescription);
        } else if (languageCode !== null && languageCode !== "und") {
          console.log("Identified language: " + languageCode);
          resolve({
            languageCode: languageCode
          });
        } else {
          console.log("No language was identified");
          resolve();
        }
      });
    } catch (ex) {
      console.log("Error in firebase.mlkit.identifyNaturalLanguage: " + ex);
      reject(ex);
    }
  });
}

exports.identifyNaturalLanguage = identifyNaturalLanguage;

function indentifyPossibleLanguages(options) {
  return new Promise(function (resolve, reject) {
    try {
      var naturalLanguage = FIRNaturalLanguage.naturalLanguage();
      var languageId = naturalLanguage.languageIdentificationWithOptions(FIRLanguageIdentificationOptions.alloc().initWithConfidenceThreshold(options.confidenceThreshold || 0.01));
      languageId.identifyPossibleLanguagesForTextCompletion(options.text, function (languages, error) {
        if (error !== null) {
          console.log("Failed with error: " + error.localizedDescription);
          reject(error.localizedDescription);
        } else if (languages.count === 1 && languages.objectAtIndex(0).languageCode === "und") {
          console.log("No language was identified");
          resolve([]);
        } else {
          var langs = [];

          for (var i = 0; i < languages.count; i++) {
            var l = languages.objectAtIndex(i);
            langs.push({
              languageCode: l.languageCode,
              confidence: l.confidence
            });
          }

          resolve(langs);
        }
      });
    } catch (ex) {
      console.log("Error in firebase.mlkit.indentifyPossibleLanguages: " + ex);
      reject(ex);
    }
  });
}

exports.indentifyPossibleLanguages = indentifyPossibleLanguages;

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/mlkit/smartreply/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function suggestReplies(options) {
  return new Promise(function (resolve, reject) {
    try {
      var naturalLanguage = FIRNaturalLanguage.naturalLanguage();
      var smartReply = naturalLanguage.smartReply();
      var conversation_1 = NSMutableArray.new();
      options.conversation.forEach(function (m) {
        return conversation_1.addObject(FIRTextMessage.alloc().initWithTextTimestampUserIDIsLocalUser(m.text, m.timestamp, m.userId, m.localUser));
      });
      smartReply.suggestRepliesForMessagesCompletion(conversation_1, function (result, error) {
        if (error) {
          reject(error.localizedDescription);
        } else if (!result) {
          reject("No results");
        } else if (result.status === 1) {
          reject("Unsupported language");
        } else if (result.status === 2) {
          reject("No reply");
        } else if (result.status === 0) {
          var suggestions = [];

          for (var i = 0; i < result.suggestions.count; i++) {
            var s = result.suggestions.objectAtIndex(i);
            suggestions.push(s.text);
          }

          resolve(suggestions);
        } else {
          reject();
        }
      });
    } catch (ex) {
      console.log("Error in firebase.mlkit.suggestReplies: " + ex);
      reject(ex);
    }
  });
}

exports.suggestReplies = suggestReplies;

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/mlkit/textrecognition/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var image_source_1 = __webpack_require__("tns-core-modules/image-source");

var textrecognition_common_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/textrecognition/textrecognition-common.js");

var MLKitTextRecognition = function (_super) {
  __extends(MLKitTextRecognition, _super);

  function MLKitTextRecognition() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MLKitTextRecognition.prototype.createDetector = function () {
    var firVision = FIRVision.vision();
    return firVision.onDeviceTextRecognizer();
  };

  MLKitTextRecognition.prototype.createSuccessListener = function () {
    var _this = this;

    return function (visionText, error) {
      if (error !== null) {
        console.log(error.localizedDescription);
      } else if (visionText !== null) {
        _this.notify({
          eventName: MLKitTextRecognition.scanResultEvent,
          object: _this,
          value: getResult(visionText)
        });
      }
    };
  };

  MLKitTextRecognition.prototype.rotateRecording = function () {
    return true;
  };

  return MLKitTextRecognition;
}(textrecognition_common_1.MLKitTextRecognition);

exports.MLKitTextRecognition = MLKitTextRecognition;

function getResult(visionText) {
  if (visionText === null) {
    return {};
  }

  var result = {
    text: visionText.text,
    blocks: [],
    ios: visionText
  };

  var _loop_1 = function (i, l) {
    var feature = visionText.blocks.objectAtIndex(i);
    var resultFeature = {
      text: feature.text,
      confidence: feature.confidence,
      bounds: feature.frame,
      lines: []
    };

    var addLineToResult = function (line) {
      var resultLine = {
        text: feature.text,
        confidence: line.confidence,
        bounds: line.frame,
        elements: []
      };

      for (var a = 0, m = line.elements.count; a < m; a++) {
        var element = line.elements.objectAtIndex(a);
        resultLine.elements.push({
          text: element.text,
          bounds: element.frame
        });
      }

      resultFeature.lines.push(resultLine);
    };

    if (feature instanceof FIRVisionTextBlock) {
      var textBlock = feature;

      for (var j = 0, k = textBlock.lines.count; j < k; j++) {
        addLineToResult(textBlock.lines.objectAtIndex(j));
      }
    }

    if (feature instanceof FIRVisionTextLine) {
      addLineToResult(feature);
    }

    result.blocks.push(resultFeature);
  };

  for (var i = 0, l = visionText.blocks.count; i < l; i++) {
    _loop_1(i, l);
  }

  return result;
}

function recognizeTextOnDevice(options) {
  return new Promise(function (resolve, reject) {
    try {
      var firVision = FIRVision.vision();
      var textDetector = firVision.onDeviceTextRecognizer();
      textDetector.processImageCompletion(getImage(options), function (visionText, error) {
        if (error !== null) {
          reject(error.localizedDescription);
        } else {
          resolve(getResult(visionText));
        }
      });
    } catch (ex) {
      console.log("Error in firebase.mlkit.recognizeTextOnDevice: " + ex);
      reject(ex);
    }
  });
}

exports.recognizeTextOnDevice = recognizeTextOnDevice;

function recognizeTextCloud(options) {
  return new Promise(function (resolve, reject) {
    try {
      var fIRVisionCloudDetectorOptions = FIRVisionCloudTextRecognizerOptions.new();
      fIRVisionCloudDetectorOptions.modelType = 0;
      var firVision = FIRVision.vision();
      var textDetector = firVision.cloudTextRecognizerWithOptions(fIRVisionCloudDetectorOptions);
      textDetector.processImageCompletion(getImage(options), function (visionText, error) {
        console.log(">>> recognizeTextCloud error? " + error + ", visionText? " + visionText);

        if (error !== null) {
          reject(error.localizedDescription);
        } else if (visionText !== null) {
          resolve(getResult(visionText));
        } else {
          reject("Unknown error :'(");
        }
      });
    } catch (ex) {
      console.log("Error in firebase.mlkit.recognizeTextCloud: " + ex);
      reject(ex);
    }
  });
}

exports.recognizeTextCloud = recognizeTextCloud;

function getImage(options) {
  var image = options.image instanceof image_source_1.ImageSource ? options.image.ios : options.image.imageSource.ios;
  return FIRVisionImage.alloc().initWithImage(image);
}

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/mlkit/textrecognition/textrecognition-common.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var view_base_1 = __webpack_require__("tns-core-modules/ui/core/view-base");

var properties_1 = __webpack_require__("tns-core-modules/ui/core/properties");

var mlkit_cameraview_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/mlkit-cameraview.js");

exports.reportDuplicatesProperty = new properties_1.Property({
  name: "reportDuplicates",
  defaultValue: false,
  valueConverter: view_base_1.booleanConverter
});

var MLKitTextRecognition = function (_super) {
  __extends(MLKitTextRecognition, _super);

  function MLKitTextRecognition() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MLKitTextRecognition.prototype[exports.reportDuplicatesProperty.setNative] = function (value) {
    this.reportDuplicates = value;
  };

  MLKitTextRecognition.scanResultEvent = "scanResult";
  return MLKitTextRecognition;
}(mlkit_cameraview_1.MLKitCameraView);

exports.MLKitTextRecognition = MLKitTextRecognition;
exports.reportDuplicatesProperty.register(MLKitTextRecognition);

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/performance/performance.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var utils_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/utils.js");

function startTrace(name) {
  return new FirebaseTrace(FIRPerformance.startTraceWithName(name));
}

exports.startTrace = startTrace;

var FirebaseTrace = function () {
  function FirebaseTrace(nativeTrace) {
    this.nativeTrace = nativeTrace;
  }

  FirebaseTrace.prototype.setValue = function (attribute, value) {
    this.nativeTrace.setValueForAttribute(value, attribute);
  };

  FirebaseTrace.prototype.getValue = function (attribute) {
    return this.nativeTrace.valueForAttribute(attribute);
  };

  FirebaseTrace.prototype.getAttributes = function () {
    return utils_1.firebaseUtils.toJsObject(this.nativeTrace.attributes);
  };

  FirebaseTrace.prototype.removeAttribute = function (attribute) {
    this.nativeTrace.removeAttribute(attribute);
  };

  FirebaseTrace.prototype.incrementMetric = function (metric, by) {
    this.nativeTrace.incrementMetricByInt(metric, by);
  };

  FirebaseTrace.prototype.stop = function () {
    this.nativeTrace.stop();
  };

  return FirebaseTrace;
}();

exports.FirebaseTrace = FirebaseTrace;

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/storage/storage.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var firebase_common_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/firebase-common.js");

function getStorageRef(reject, arg) {
  if (typeof FIRStorage === "undefined") {
    reject("Uncomment Storage in the plugin's Podfile first");
    return undefined;
  }

  if (!arg.remoteFullPath) {
    reject("remoteFullPath is mandatory");
    return undefined;
  }

  if (arg.bucket) {
    return FIRStorage.storage().referenceForURL(arg.bucket);
  } else if (firebase_common_1.firebase.storageBucket) {
    return firebase_common_1.firebase.storageBucket;
  } else {
    return FIRStorage.storage().reference();
  }
}

function uploadFile(arg) {
  return new Promise(function (resolve, reject) {
    try {
      var onCompletion = function (metadata, error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve({
            name: metadata.name,
            contentType: metadata.contentType,
            created: metadata.timeCreated,
            updated: metadata.updated,
            bucket: metadata.bucket,
            size: metadata.size
          });
        }
      };

      var storageRef = getStorageRef(reject, arg);

      if (!storageRef) {
        return;
      }

      var fIRStorageReference = storageRef.child(arg.remoteFullPath);
      var fIRStorageUploadTask = null;

      if (arg.localFile) {
        if (typeof arg.localFile !== "object") {
          reject("localFile argument must be a File object; use file-system module to create one");
          return;
        }

        fIRStorageUploadTask = fIRStorageReference.putFileMetadataCompletion(NSURL.fileURLWithPath(arg.localFile.path), null, onCompletion);
      } else if (arg.localFullPath) {
        fIRStorageUploadTask = fIRStorageReference.putFileMetadataCompletion(NSURL.fileURLWithPath(arg.localFullPath), null, onCompletion);
      } else {
        reject("One of localFile or localFullPath is required");
        return;
      }

      if (fIRStorageUploadTask !== null) {
        fIRStorageUploadTask.observeStatusHandler(2, function (snapshot) {
          if (!snapshot.error && typeof arg.onProgress === "function") {
            arg.onProgress({
              fractionCompleted: snapshot.progress.fractionCompleted,
              percentageCompleted: Math.round(snapshot.progress.fractionCompleted * 100)
            });
          }
        });
      }
    } catch (ex) {
      console.log("Error in firebase.uploadFile: " + ex);
      reject(ex);
    }
  });
}

exports.uploadFile = uploadFile;

function downloadFile(arg) {
  return new Promise(function (resolve, reject) {
    try {
      var onCompletion = function (url, error) {
        console.log(">>> download complete, error: " + error);

        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve(url.absoluteString);
        }
      };

      var storageRef = getStorageRef(reject, arg);

      if (!storageRef) {
        return;
      }

      var fIRStorageReference = storageRef.child(arg.remoteFullPath);
      var localFilePath = void 0;

      if (arg.localFile) {
        if (typeof arg.localFile !== "object") {
          reject("localFile argument must be a File object; use file-system module to create one");
          return;
        }

        localFilePath = arg.localFile.path;
      } else if (arg.localFullPath) {
        localFilePath = arg.localFullPath;
      } else {
        reject("One of localFile or localFullPath is required");
        return;
      }

      var localFileUrl = NSURL.fileURLWithPath(localFilePath);
      fIRStorageReference.writeToFileCompletion(localFileUrl, onCompletion);
    } catch (ex) {
      console.log("Error in firebase.downloadFile: " + ex);
      reject(ex);
    }
  });
}

exports.downloadFile = downloadFile;

function getDownloadUrl(arg) {
  return new Promise(function (resolve, reject) {
    try {
      var onCompletion = function (url, error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve(url.absoluteString);
        }
      };

      var storageRef = getStorageRef(reject, arg);

      if (!storageRef) {
        return;
      }

      var fIRStorageReference = storageRef.child(arg.remoteFullPath);
      fIRStorageReference.downloadURLWithCompletion(onCompletion);
    } catch (ex) {
      console.log("Error in firebase.getDownloadUrl: " + ex);
      reject(ex);
    }
  });
}

exports.getDownloadUrl = getDownloadUrl;

function deleteFile(arg) {
  return new Promise(function (resolve, reject) {
    try {
      var onCompletion = function (error) {
        if (error) {
          reject(error.localizedDescription);
        } else {
          resolve();
        }
      };

      var storageRef = getStorageRef(reject, arg);

      if (!storageRef) {
        return;
      }

      var fIRStorageFileRef = storageRef.child(arg.remoteFullPath);
      fIRStorageFileRef.deleteWithCompletion(onCompletion);
    } catch (ex) {
      console.log("Error in firebase.deleteFile: " + ex);
      reject(ex);
    }
  });
}

exports.deleteFile = deleteFile;

/***/ }),

/***/ "../node_modules/nativescript-plugin-firebase/utils.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var firebase_common_1 = __webpack_require__("../node_modules/nativescript-plugin-firebase/firebase-common.js");

var types_1 = __webpack_require__("tns-core-modules/utils/types");

var Utils = function () {
  function Utils() {
    this.invokeOnRunLoop = function () {
      var runloop = CFRunLoopGetMain();
      return function (func) {
        CFRunLoopPerformBlock(runloop, kCFRunLoopDefaultMode, func);
        CFRunLoopWakeUp(runloop);
      };
    }();
  }

  Utils.prototype.toJsObject = function (objCObj) {
    if (objCObj === null || typeof objCObj !== "object") {
      return objCObj;
    }

    var node,
        key,
        i,
        l,
        oKeyArr = objCObj.allKeys;

    if (oKeyArr === undefined && objCObj.count !== undefined) {
      node = [];

      for (i = 0, l = objCObj.count; i < l; i++) {
        key = objCObj.objectAtIndex(i);
        node.push(this.toJsObject(key));
      }
    } else if (oKeyArr !== undefined) {
      node = {};

      for (i = 0, l = oKeyArr.count; i < l; i++) {
        key = oKeyArr.objectAtIndex(i);
        var val = objCObj.valueForKey(key);

        if (val === null) {
          node[key] = null;
          continue;
        }

        node[key] = this.getValueForClass(val);
      }
    } else {
      node = this.getValueForClass(objCObj);
    }

    return node;
  };

  Utils.prototype.getValueForClass = function (val) {
    switch (types_1.getClass(val)) {
      case 'NSArray':
      case 'NSMutableArray':
        return this.toJsObject(val);

      case 'NSDictionary':
      case 'NSMutableDictionary':
        return this.toJsObject(val);

      case 'String':
        return String(val);

      case 'Boolean':
        return val;

      case 'Number':
      case 'NSDecimalNumber':
        return Number(String(val));

      case 'Date':
        return new Date(val);

      case 'FIRTimestamp':
        return val.dateValue();

      case 'FIRDocumentReference':
        var path = val.path;
        var lastSlashIndex = path.lastIndexOf("/");
        return firebase_common_1.firebase.firestore._getDocumentReference(val, path.substring(0, lastSlashIndex), path.substring(lastSlashIndex + 1));

      case 'FIRGeoPoint':
        return firebase_common_1.firebase.firestore.GeoPoint(val.latitude, val.longitude);

      default:
        console.log("Please report this at https://github.com/EddyVerbruggen/nativescript-plugin-firebase/issues: iOS toJsObject is missing a converter for class '" + types_1.getClass(val) + "'. Casting to String as a fallback.");
        return String(val);
    }
  };

  return Utils;
}();

exports.Utils = Utils;
exports.firebaseUtils = new Utils();

/***/ }),

/***/ "../node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "../node_modules/webpack/buildin/global.js":
/***/ (function(module, exports) {

var g; // This works in non-strict mode

g = function () {
  return this;
}();

try {
  // This works if eval is allowed (see CSP)
  g = g || new Function("return this")();
} catch (e) {
  // This works if the window reference is available
  if (typeof window === "object") g = window;
} // g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}


module.exports = g;

/***/ })

}]);