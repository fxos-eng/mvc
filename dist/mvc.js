define(["exports"], function (exports) {
  "use strict";

  var Model = function Model(properties) {
    properties = properties || {};

    for (var key in properties) {
      this[key] = properties[key];
    }
  };

  exports.Model = Model;


  /**
   * View
   */
  var events = {};

  var View = (function () {
    var View = function View(options) {
      options = options || {};

      for (var key in options) {
        this[key] = options[key];
      }

      if (!this.el) {
        this.el = document.createElement("div");
      }
    };

    View.prototype.init = function (controller) {
      this.controller = controller;

      return this;
    };

    View.prototype.render = function () {
      this.el.innerHTML = this.template();
    };

    View.prototype.template = function () {
      return "";
    };

    View.prototype.$ = function (selector) {
      return this.el.querySelector(selector);
    };

    View.prototype.$$ = function (selector) {
      return this.el.querySelectorAll(selector);
    };

    View.prototype.on = function (type, selector, handler) {
      if (!events[type]) {
        events[type] = [];
        window.addEventListener(type, delegateHandler, true);
      }

      events[type].push({
        selector: selector,
        handler: handler
      });
    };

    View.prototype.off = function (type, selector, handler) {
      if (!events[type]) {
        return;
      }

      events[type] = events[type].filter(function (delegate) {
        if (typeof handler === "function") {
          return delegate.selector !== selector || delegate.handler !== handler;
        }

        return delegate.selector !== selector;
      });
    };

    return View;
  })();

  exports.View = View;


  function delegateHandler(event) {
    var target = event.target;

    events[event.type].forEach(function (delegate) {
      if (target.matches(delegate.selector)) {
        delegate.handler.call(target, event);
      }
    });
  }

  var Controller = function Controller(options) {
    options = options || {};

    for (var key in options) {
      this[key] = options[key];
    }

    // Initialize the view (if applicable) when the
    // controller is instantiated.
    if (this.view && typeof this.view.init === "function") {
      this.view.init(this);
    }
  };

  exports.Controller = Controller;
});