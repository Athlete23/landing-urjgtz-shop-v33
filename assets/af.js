var afjs = (function () {
  // Приватные константы
  var APP_SETTINGS = {
    promoTypeLand: "land",
    promoTypePreland: "preland",
    land: "land",
    referer: "referer",
  };

  var API_ENDPOINTS = {
    apiLeadSend: "https://r.affstar.com/l/create",
    apiLandingUrl: "https://r.affstar.com/r/url",
    apiUpdateRedirect: "https://r.affstar.com/r/update",
    apiCreateRedirect: "https://r.affstar.com/r/remote",
    // ShowCase
    backjsUrl: "https://api.affstar.com/api/public/back.js",
  };

  var QUERY_KEYS = {
    subaccount: "subaccount",
    utmCampaign: "utm_campaign",
    utmSource: "utm_source",
    utmTerm: "utm_term",
    // ids
    redirectId: "r_id",
    subId1: "sub_id1",
    subId2: "sub_id2",
    subId3: "sub_id3",
    flow_uuid: "flow_uuid",
    showcase: "showcase",
    sys_sub_id1: "sys_sub_id1",
    sys_sub_id2: "sys_sub_id2",
    sys_sub_id3: "sys_sub_id3",
    sys_sub_id4: "sys_sub_id4",
    sys_sub_id5: "sys_sub_id5",
    landingUuid: "landing_uuid",
    // trackers
    yandexTrackerId: "yandex_id",
    mailTrackerId: "mail_id",
    googleTrackerId: "google_id",
    fbTrackerId: "fb_id",
    flowId: "flow_id",
    vkId: "vk_id",
    bigoTrackerId: "ba_id",
    utmContent: "utm_content",
    utmMedium: "utm_medium",
    ttId: "tt_id",

    yandexId: "ya_id",
  };

  var METRIC_CONFIG = {
    metric_ws_url: "wss://m.afcnt.com/ws",
    metric_ws_reconnect_delay_sec: 10,
    metric_ws_interval_sec: 3,
    metric_src: "cpa",
  };

  // Приватные переменные
  var isConfirmPage = /confirm[-a-zA-Z]*.html/.test(location.href);
  var confirmPage = null;
  var promoType = null;
  var redirectId = null;
  var isInitialized = false;

  // Приватные функции
  function getAllParamsFromUrl(queryString) {
    queryString = queryString || window.location.search;
    var paramsArr = {};
    if (!queryString.length) return paramsArr;

    if (queryString.substr(0, 1) === "?") {
      queryString = queryString.substr(1);
    }

    var params = queryString.split("&");
    for (var i = 0; i < params.length; i++) {
      var pair = params[i].split("=");
      var key = decodeURIComponent(pair[0]);
      var value = decodeURIComponent(pair[1]);

      if (key === "undefined" || value === "undefined") continue;
      paramsArr[key] = value;
    }

    return paramsArr;
  }

  var afjsQueryParams = {
    all: {},
    init: function () {
      this.all = getAllParamsFromUrl();
    },
    getParam: function (paramName) {
      return this.all[paramName] || null;
    },
    generateString: function (params) {
      var queryArray = [];
      for (var key in params) {
        if (
          params.hasOwnProperty(key) &&
          params[key] !== null &&
          params[key] !== undefined
        ) {
          queryArray.push(key + "=" + params[key]);
        }
      }
      return queryArray.join("&");
    },
  };

  var trackers = {
    data: {},
    generateData: function () {
      this.data.mail_id = afjsQueryParams.getParam(QUERY_KEYS.mailTrackerId);
      this.data.yandex_id = afjsQueryParams.getParam(
        QUERY_KEYS.yandexTrackerId,
      );
      this.data.google_id = afjsQueryParams.getParam(
        QUERY_KEYS.googleTrackerId,
      );
      this.data.fb_id = afjsQueryParams.getParam(QUERY_KEYS.fbTrackerId);
      this.data.showcase = afjsQueryParams.getParam(QUERY_KEYS.showcase);
      this.data.flow_id = afjsQueryParams.getParam(QUERY_KEYS.flowId);
      this.data.tt_id = afjsQueryParams.getParam(QUERY_KEYS.ttId);
      this.data.vk_id = afjsQueryParams.getParam(QUERY_KEYS.vkId);
      this.data.ba_id = afjsQueryParams.getParam(QUERY_KEYS.bigoTrackerId);
    },
    cMailRu: function (mailruId) {
      (function (d, id) {
        var _tmr = window._tmr || (window._tmr = []);
        _tmr.push({ id: id, type: "pageView", start: new Date().getTime() });
        (function (d, w, id) {
          if (d.getElementById(id)) return;
          var ts = d.createElement("script");
          ts.type = "text/javascript";
          ts.async = true;
          ts.id = id;
          ts.src =
            (d.location.protocol == "https:" ? "https:" : "http:") +
            "//top-fwz1.mail.ru/js/code.js";
          var f = function () {
            var s = d.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(ts, s);
          };
          if (w.opera == "[object Opera]") {
            if (d.addEventListener) {
              d.addEventListener("DOMContentLoaded", f, false);
            } else if (d.attachEvent) {
              d.attachEvent("onreadystatechange", function () {
                if (d.readyState === "complete") f();
              });
            }
          } else {
            f();
          }
        })(document, window, "topmailru-code");
        var r = d.createElement("img"),
          v = d.createElement("div"),
          n = d.createElement("noscript");
        r.src = "//top-fwz1.mail.ru/counter?id=" + id + ";js=na";
        r.style = "border:0;";
        r.height = 1;
        r.width = 1;
        v.style = "position:absolute;left:-10000px;";
        v.appendChild(r);
        n.appendChild(v);
        d.body.appendChild(n);
      })(document, mailruId);
    },
    cYandex: function (yandexId) {
      (function (d, w, c, id) {
        (w[c] = w[c] || []).push(function () {
          try {
            w.yacounter[yandexId] = new Ya.Metrika({
              id: id,
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              webvisor: true,
            });
          } catch (e) {}
        });
        var n = d.getElementsByTagName("script")[0],
          s = d.createElement("script"),
          f = function () {
            n.parentNode.insertBefore(s, n);
          };
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://mc.yandex.ru/metrika/watch.js";
        if (w.opera == "[object Opera]") {
          if (d.addEventListener) {
            d.addEventListener("DOMContentLoaded", f, false);
          } else if (d.attachEvent) {
            d.attachEvent("onreadystatechange", function () {
              if (d.readyState === "complete") f();
            });
          }
        } else {
          f();
        }
      })(document, window, "yandex_metrika_callbacks", yandexId);
    },
    cGoogle: function (googleId) {
      var head = document.head;
      var googleCDNScript = document.createElement("script");
      googleCDNScript.src =
        "https://www.googletagmanager.com/gtag/js?id='" + googleId + "'";

      var googleTagScript = document.createElement("script");
      googleTagScript.text =
        "window.dataLayer = window.dataLayer || []; \n" +
        "   function gtag(){dataLayer.push(arguments);} \n" +
        "   gtag('js', new Date()); \n" +
        "   gtag('config', '" +
        googleId +
        "'); \n";
      head.appendChild(googleTagScript);
      head.appendChild(googleCDNScript);
    },
    cVk: function (vkId) {
      var head = document.head;
      var vkTagScript = document.createElement("script");
      vkTagScript.text =
        "!function(){var\n" +
        "t=document.createElement('script');t.type='text/javascript',t.async=!0,t.\n" +
        "src='https://vk.com/js/api/openapi.js?161',t.onload=function()\n" +
        "{VK.Retargeting.Init('" +
        vkId +
        "'),VK.Retargeting.Hit()},document.head.appendChild(t)}();\n";
      var vkNoScript = document.createElement("noscript");
      vkNoScript.innerHTML =
        "<img src='https://vk.com/rtrg?p=" +
        vkId +
        "' style='position: fixed; left:-999px;' alt=''>";
      head.appendChild(vkTagScript);
      head.appendChild(vkNoScript);
    },
    cFaceBook: function (facebookId) {
      var trackFB = isConfirmPage ? "Lead" : "PageView";
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js",
      );
      fbq("init", facebookId);
      fbq("track", trackFB);
    },
    cTTPixel: function (id) {
      !(function (w, d, t) {
        w.TiktokAnalyticsObject = t;
        var ttq = (w[t] = w[t] || []);
        ttq.methods = [
          "page",
          "track",
          "identify",
          "instances",
          "debug",
          "on",
          "off",
          "once",
          "ready",
          "alias",
          "group",
          "enableCookie",
          "disableCookie",
        ];
        ttq.setAndDefer = function (t, e) {
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        };
        for (var i = 0; i < ttq.methods.length; i++)
          ttq.setAndDefer(ttq, ttq.methods[i]);
        ttq.instance = function (t) {
          for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
            ttq.setAndDefer(e, ttq.methods[n]);
          return e;
        };
        ttq.load = function (e, n) {
          var i = "https://analytics.tiktok.com/i18n/pixel/events.js";
          ttq._i = ttq._i || {};
          ttq._i[e] = [];
          ttq._i[e]._u = i;
          ttq._t = ttq._t || {};
          ttq._t[e] = +new Date();
          ttq._o = ttq._o || {};
          ttq._o[e] = n || {};
          var o = document.createElement("script");
          o.type = "text/javascript";
          o.async = !0;
          o.src = i + "?sdkid=" + e + "&lib=" + t;
          var a = document.getElementsByTagName("script")[0];
          a.parentNode.insertBefore(o, a);
        };

        ttq.load(id);
        ttq.page();
      })(window, document, "ttq");
    },
    cBigoAds: function (id) {
      var head = document.head;
      var bigoAdsScript = document.createElement("script");
      bigoAdsScript.src =
        "https://api.imotech.video/ad/events.js?pixel_id=" + id;

      var bigoAdsTag = document.createElement("script");
      bigoAdsTag.text =
        "window.bgdataLayer = window.bgdataLayer || []; \n" +
        "   function bge(){bgdataLayer.push(arguments);} \n" +
        "   bge('init', '" +
        id +
        "'); \n" +
        "   bge('event', 'page_view'); \n";
      head.appendChild(bigoAdsTag);
      head.appendChild(bigoAdsScript);
    },
    start: function () {
      if (this.data.mail_id) this.cMailRu(this.data.mail_id);
      if (this.data.yandex_id) this.cYandex(this.data.yandex_id);
      if (this.data.google_id) this.cGoogle(this.data.google_id);
      if (this.data.vk_id) this.cVk(this.data.vk_id);
      if (this.data.fb_id) this.cFaceBook(this.data.fb_id);
      if (this.data.tt_id) this.cTTPixel(this.data.tt_id);
      if (this.data.ba_id) this.cBigoAds(this.data.ba_id);
    },
  };

  var metric = {
    src: null,
    uuid: null,
    active: false,
    count: 0,
    socket: null,
    referer: window.location.protocol + "//" + window.location.host,

    timer: {
      stopped: true,
      callback: null,
      token: null,

      start: function (callback) {
        this.callback = callback;
        this.stopped = false;
        if (this.token) clearInterval(this.token);
        this.token = setInterval(this.callback, 1000);
      },

      stop: function () {
        this.stopped = true;
        if (this.token) clearInterval(this.token);
      },
    },

    createConnection: function () {
      var self = this;
      try {
        if (window.WebSocket) {
          this.socket = new WebSocket(METRIC_CONFIG.metric_ws_url);
          this.socket.onopen = function () {
            console.log("WebSocket connection opened:", self.uuid);
          };
          this.socket.onclose = function () {
            console.log("WebSocket connection closed");
          };
          this.socket.onerror = function (e) {
            console.error("WebSocket error:", e);
          };
          this.socket.onmessage = function (e) {
            console.log("WebSocket message received:", e.data);
          };
        } else {
          console.error(
            "WebSocket not supported. Consider using long polling.",
          );
        }
      } catch (e) {
        console.error("Error creating WebSocket:", e);
      }
    },

    init: function (src) {
      if (this.uuid !== null) return;

      this.src = src;
      this.uuid = redirectId;

      this.count = 0;
      this.createConnection();
      this.setupWindowEvents();

      try {
        this.start();
      } catch (e) {
        console.error("Error starting metric:", e);
      }
    },

    setupWindowEvents: function () {
      var self = this;

      function onFocus() {
        try {
          self.start();
        } catch (e) {
          console.error("Error on window focus:", e);
        }
      }

      function onBlur() {
        try {
          self.stop();
        } catch (e) {
          console.error("Error on window blur:", e);
        }
      }

      if (window.addEventListener) {
        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur);
        window.addEventListener("beforeunload", function (event) {
          if (self.socket) self.socket.close();
          event.returnValue = "";
        });
      } else if (window.attachEvent) {
        window.attachEvent("onfocus", onFocus);
        window.attachEvent("onblur", onBlur);
        window.attachEvent("onbeforeunload", function (event) {
          if (self.socket) self.socket.close();
          event.returnValue = "";
        });
      }
    },

    start: function () {
      var self = this;
      var connectionStart = Date.now ? Date.now() : new Date().getTime();
      var innerCount = 0;

      this.timer.start(function () {
        self.count++;
        innerCount++;

        if (!self.socket || self.socket.readyState === 3) {
          var newConnectionDate = Date.now ? Date.now() : new Date().getTime();
          if (
            newConnectionDate - connectionStart >
            METRIC_CONFIG.metric_ws_reconnect_delay_sec * 1000
          ) {
            connectionStart = newConnectionDate;
            self.createConnection();
          }
          return;
        }

        if (self.socket.readyState === 0 || self.socket.readyState === 2) {
          return;
        }

        if (self.socket.readyState === 1 && self.count > 0) {
          if (innerCount < METRIC_CONFIG.metric_ws_interval_sec) {
            return;
          }

          innerCount = 0;

          try {
            var data = JSON.stringify({
              src_id: self.uuid,
              src: self.src,
              referer: self.referer,
              counter: self.count,
            });
            self.socket.send(data);
          } catch (e) {
            console.error("Error sending WebSocket data:", e);
            self.stop();
          }
        }
      });
    },

    stop: function () {
      this.timer.stop();
    },
  };

  function installAShowCaseCPA() {
    if (!isInitialized) {
      setTimeout(installAShowCaseCPA, 100);
      return;
    }
    if (trackers.data.flow_id && trackers.data.showcase && redirectId) {
      var bestViewerLink = document.createElement("script");
      var newBackjsUrl =
        API_ENDPOINTS.backjsUrl +
        "?flow_id=" +
        trackers.data.flow_id +
        "&r_uuid=" +
        redirectId;
      bestViewerLink.setAttribute("src", newBackjsUrl);

      bestViewerLink.onload = function () {
        if (window.vitBack) {
          window.vitBack(trackers.data.flow_id);
        }
      };

      if (document.body) {
        document.body.appendChild(bestViewerLink);
      } else if (document.documentElement) {
        document.documentElement.appendChild(bestViewerLink);
      }
    }
  }

  function sendHttpRequest(args) {
    var method = args.method;
    var url = args.url;
    var data = args.data ? JSON.stringify(args.data) : null;
    var successCallback = args.successCallback;
    var hasSuccessErrorCallback = args.hasSuccessErrorCallback;

    var xhr = new XMLHttpRequest();
    xhr.open(method, url, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.response);
        if (response.success === true) {
          if (successCallback) {
            successCallback(response.data);
          }
        } else {
          if (hasSuccessErrorCallback) {
            handleResponseErrors(response.errors);
          }
        }
      } else {
        console.log(xhr);
      }
    };

    xhr.send(data);
  }

  function handleResponseErrors(errors) {
    for (var i = 0; i < errors.length; i++) {
      var error = errors[i];
      var errorParts = [];

      if (error.field) {
        errorParts.push(error.field);
      }
      errorParts.push(error.text);

      alert(errorParts.join(": "));
    }
  }

  var redirect = {
    setId: function (id) {
      redirectId = id;
    },
    create: function (flowUuid, subids) {
      var sub_id1 = "";

      if (subids && subids.length) {
        var test = ["{subid}", "{clickid}", "{{vcode}}", "<tid>"];
        for (var index = 0; index < subids.length; index++) {
          var value = subids[index];
          var testValue = test[index];
          if (value !== testValue) {
            sub_id1 = value;
          }
        }
      }

      if (!sub_id1) {
        sub_id1 = afjsQueryParams.getParam(QUERY_KEYS.subId1);
      }

      var data = {
        flow_uuid: flowUuid,
        promo_type: promoType,
        referer: document.referrer,
        subaccount: afjsQueryParams.getParam(QUERY_KEYS.subaccount),
        utm_campaign: afjsQueryParams.getParam(QUERY_KEYS.utmCampaign),
        utm_content: afjsQueryParams.getParam(QUERY_KEYS.utmContent),
        utm_medium: afjsQueryParams.getParam(QUERY_KEYS.utmMedium),
        utm_source: afjsQueryParams.getParam(QUERY_KEYS.utmSource),
        utm_term: afjsQueryParams.getParam(QUERY_KEYS.utmTerm),
        sub_id1: sub_id1,
        sub_id2: afjsQueryParams.getParam(QUERY_KEYS.subId2),
        sub_id3: afjsQueryParams.getParam(QUERY_KEYS.subId3),
        sys_sub_id1: afjsQueryParams.getParam(QUERY_KEYS.sys_sub_id1),
        sys_sub_id2: afjsQueryParams.getParam(QUERY_KEYS.sys_sub_id2),
        sys_sub_id3: afjsQueryParams.getParam(QUERY_KEYS.sys_sub_id3),
        sys_sub_id4: afjsQueryParams.getParam(QUERY_KEYS.sys_sub_id4),
        sys_sub_id5: afjsQueryParams.getParam(QUERY_KEYS.sys_sub_id5),
      };

      var createRequestOptions = {
        method: "POST",
        url: API_ENDPOINTS.apiCreateRedirect,
        data: data,
        successCallback: function (response) {
          redirect.setId(response.r_id);
        },
      };
      sendHttpRequest(createRequestOptions);
    },

    update: function () {
      var updateRequestOptions = {
        method: "POST",
        url: API_ENDPOINTS.apiUpdateRedirect,
        data: {
          r_id: redirectId,
          landing_uuid: afjsQueryParams.getParam(QUERY_KEYS.landingUuid),
        },
      };
      sendHttpRequest(updateRequestOptions);
    },

    syncLinksWithLandingUrl: function () {
      var requestParam = {
        r_id: redirectId,
        mail_id: trackers.data.mail_id,
        yandex_id: trackers.data.yandex_id,
        google_id: trackers.data.google_id,
        vk_id: trackers.data.vk_id,
        ba_id: trackers.data.ba_id,
        fb_id: trackers.data.fb_id,
        tt_id: trackers.data.tt_id,
        land: afjsQueryParams.getParam(APP_SETTINGS.land),
      };

      var query = afjsQueryParams.generateString(requestParam);

      var landingRequestOptions = {
        method: "GET",
        url: API_ENDPOINTS.apiLandingUrl + "?" + query,
        successCallback: function (response) {
          redirect.replaceAllLinksToLandingUrl(response.url);
        },
      };
      sendHttpRequest(landingRequestOptions);
    },

    replaceAllLinksToLandingUrl: function (url) {
      var links = document.getElementsByTagName("a");
      for (var i = 0; i < links.length; i++) {
        links[i].href = url;
      }
    },
  };

  var forms = {
    setupFormSubmissionHandler: function () {
      if (document.addEventListener) {
        document.addEventListener("submit", function (event) {
          if (event.target && event.target.tagName === "FORM") {
            forms.submitFormHandler(event);
          }
        });
      } else if (document.attachEvent) {
        document.attachEvent("onsubmit", function (event) {
          if (event.target && event.target.tagName === "FORM") {
            forms.submitFormHandler(event);
          }
        });
      }
    },

    submitFormHandler: function (event) {
      event.preventDefault();

      var formData = forms.extractFormData(event.target);

      var formRequestOptions = {
        method: "POST",
        url: API_ENDPOINTS.apiLeadSend,
        data: formData,
        successCallback: function () {
          var path =
            confirmPage +
            "?name=" +
            formData.name +
            "&phone=" +
            formData.phone +
            "&country_code=" +
            formData.country_code;

          var query = afjsQueryParams.generateString(trackers.data);

          var link = document.createElement("a");
          link.href = path + (query ? "&" + query : "");

          link.click();
        },
        hasSuccessErrorCallback: true,
      };
      sendHttpRequest(formRequestOptions);
    },

    extractFormData: function (formElement) {
      var data = {
        name: "",
        phone: "",
        country: "",
        comment: "",
        address: "",
      };

      var inputs = formElement.getElementsByTagName("input");
      for (var ii = 0; ii < inputs.length; ii++) {
        var inputName = inputs[ii].name;
        if (data.hasOwnProperty(inputName)) {
          data[inputName] = inputs[ii].value;
        }
      }

      var selects = formElement.getElementsByTagName("select");
      for (var ii = 0; ii < selects.length; ii++) {
        if (selects[ii].name === "country") {
          data.country = selects[ii].value;
        }
      }

      var tempOrderCommentAddon = "";
      var orderCommentAddons = document.getElementsByClassName(
        "order-comment-addon",
      );
      for (var ii = 0; ii < orderCommentAddons.length; ii++) {
        tempOrderCommentAddon +=
          " " +
          (orderCommentAddons[ii].textContent ||
            orderCommentAddons[ii].innerText);
      }
      data.comment = tempOrderCommentAddon + data.comment;
      data.r_id = redirectId;
      data.country_code = data.country;
      delete data.country;

      return data;
    },
  };

  // Инициализация модуля
  try {
    afjsQueryParams.init();
    trackers.generateData();
  } catch (e) {
    console.error("Ошибка при инициализации приложения:", e);
  }

  (function () {
    function initAll() {
      installAShowCaseCPA();
      trackers.start();
    }
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", initAll);
    } else if (document.attachEvent) {
      document.attachEvent("onreadystatechange", function () {
        if (document.readyState === "complete") {
          initAll();
        }
      });
    }
  })();

  // Публичный интерфейс
  return {
    init: function (initPromoType, initConfirmPage, flowUuid, subids) {
      redirect.setId(afjsQueryParams.getParam(QUERY_KEYS.redirectId));
      confirmPage = initConfirmPage;
      promoType = initPromoType;

      if (
        !redirectId &&
        afjsQueryParams.getParam(QUERY_KEYS.flow_uuid) &&
        afjsQueryParams.getParam(QUERY_KEYS.flow_uuid) !== "undefined"
      ) {
        flowUuid = afjsQueryParams.getParam(QUERY_KEYS.flow_uuid);
        redirect.create(flowUuid, subids);
      }

      if (promoType === APP_SETTINGS.promoTypePreland) {
        redirect.syncLinksWithLandingUrl();
      }

      if (promoType === APP_SETTINGS.promoTypeLand) {
        if (!redirectId) {
          if (flowUuid) {
            redirect.create(flowUuid, subids);
          }
        }

        if (
          afjsQueryParams.getParam(QUERY_KEYS.landingUuid) &&
          afjsQueryParams.getParam(QUERY_KEYS.landingUuid) !== "undefined"
        ) {
          redirect.update();
        }

        if (redirectId) {
          try {
            metric.init(METRIC_CONFIG.metric_src);
          } catch (e) {
            console.log(e);
          }
        }
      }

      isInitialized = true;
      forms.setupFormSubmissionHandler();
    },
    confirm: function () {
      var returnEl = document.getElementById("return");

      document.getElementById("name").textContent =
        afjsQueryParams.getParam("name");
      document.getElementById("phone").textContent =
        afjsQueryParams.getParam("phone");

      isInitialized = true;
      if (returnEl) returnEl.href = document.referrer;
    },
  };
})();
