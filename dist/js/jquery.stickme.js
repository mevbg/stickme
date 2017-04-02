/*! 
 jQuery StickMe Plugin v1.1.1
 http://stickme.martinmetodiev.com

 Copyright (c) 2017 Martin Metodiev
 Licensed under the MIT license.
*/

;(function($) {

  'use strict';

// Define all plugin components
  var plugin = {
    // Base plugin data
    base: {
      // Default target selector if no such provided
      target: $('.stickme'),

      // List of all supported options with their default values
      options: {
        top: 0
      }
    },

    events: [
      'onStick',   // e, data
      'onUnstick', // e, data
      'onDestroy'  // e, data
    ],

    dom: {
      observer: $('<div class="stickme_observer">'),
      holder: $('<div class="stickme-holder">')
    },

    setup: {
      target: function(params) {
        return params && params.hasOwnProperty('target') ?
          params.target : plugin.base.target;
      },

      options: function(params) {
        var options = {},
          events = {};

        (function() {
          for (var option in plugin.base.options) {
            if (plugin.base.options.hasOwnProperty(option)) {
              options[option] = params && params.hasOwnProperty(option) ?
                params[option] : plugin.base.options[option];
            }
          }
        }());

        (function() {
          for (var event = 0; event < plugin.events.length; event++) {
            if (params && params.hasOwnProperty(plugin.events[event])) {
              events[plugin.events[event]] = params[plugin.events[event]];
            }
          }
        }());

        $.extend(options, {events: events});

        return options;
      }
    },

    methods: {
      init: function(params) {
        var obj = this;

        // Attach options
        obj.options = plugin.setup.options(params);

        // Create observer
        obj.createObserver();

        // Set initial width and position
        obj.setPosition();

        // Bind provided events
        for (var event in obj.options.events) {
          if (obj.options.events.hasOwnProperty(event)) {
            obj.children().bind(event, obj.options.events[event]);
          }
        }

        return obj;
      },

      getPosition: function() {
        return $(this.observer).offset().top - $(document).scrollTop();
      },

      setPosition: function() {
        var obj = this;

        obj.position = obj.getPosition();
        var old_status = obj.status || null;
        obj.status = obj.position <= obj.options.top ? 'stick' : 'unstick';
        if (obj.status !== old_status) { obj[obj.status](); }

        return obj;
      },

      createObserver: function() {
        var obj = this;

        obj.observer = plugin.dom.observer.clone();
        obj.before(obj.observer);

        return obj;
      },

      setStyles: function() {
        var obj = this;

        obj.css({
          width: obj.observer.width(),
          position: 'fixed',
          zIndex: 10,
          left: obj.observer.offset().left,
          top: obj.options.top
        });

        obj.observer.height(obj.height());

        return obj;
      },

      stick: function() {
        var obj = this;

        obj.children().trigger('onStick', [obj.children()]);
        obj.stickmeMode = 'sticked';
        obj.observer.height(obj.height());
        obj.setStyles();

        return obj;
      },

      unstick: function() {
        var obj = this;

        obj.children().trigger('onUnstick', [obj.children()]);
        obj.stickmeMode = 'unsticked';
        obj.observer.height(0);
        obj.removeAttr('style');

        return obj;
      },

      resizeHandler: function() {
        var obj = this;

        if (obj.stickmeMode && obj.stickmeMode === 'sticked') {
          obj.setStyles();
        }

        return obj;
      }
    },

    output: {
      extended: true,

      update: function() {
        this.each(function() {
          var holder = $(this).parent('.stickme-holder')[0];
          var obj = holder.stickme;

          if (obj.stickmeMode === 'sticked') { obj.setStyles(); }
        });

        return this;
      },

      destroy: function() {
        this.each(function() {
          var holder = $(this).parent('.stickme-holder')[0];
          var obj = holder.stickme;

          // Unstick (if sticked)
          if (obj.stickmeMode === 'sticked') { obj.unstick(); }

          // Remove the observer HTML from the DOM
          obj.observer.remove();

          // Unbind provided events
          (function() {
            for (var event in obj.options) {
              if (obj.options.hasOwnProperty(event)) {
                obj.children().unbind(event, obj.options[event]);
              }
            }
          }());

          // Delete object from the targets' list
          for (var i = 0; i < $.stickme.targets.length; i++) {
            if (holder === $.stickme.targets[i][0]) {
              $.stickme.targets.splice(i, 1);
              break;
            }
          }

          // Trigger onDestroy event
          obj.children().trigger('onDestroy', [obj.children()]);

          // Pull out the target and delete holder
          obj.before(obj.children());
          obj.remove();

          // Delete stickme object
          delete holder.stickme;
        });

        // Delete output properties
        for (var property in plugin.output) {
          if (plugin.output.hasOwnProperty(property)) {
            if (this.hasOwnProperty[plugin.output[property]]) {
              delete this[plugin.output[property]];
            }
          }
        }

        return this;
      }
    }
  };

// Define plugin as a jQuery function
  $.stickme = function(params) {
    // Setup target
    var target = plugin.setup.target(params);

    // Create a jQuery Object Instance (extended with plugin.stickme) inside the DOM object
    target.each(function() {
      if (!$(this).parent().is('.stickme-holder')) {
        var holder = plugin.dom.holder.clone();
        $(this).after(holder);
        holder.append($(this));
      }

      var obj = $(this).parent('.stickme-holder')[0];

      if (!obj.stickme) {
        $.extend(obj, {
          stickme: $.extend($(obj), plugin.methods)
        });

        var stickme = obj.stickme;

        $.stickme.targets.push(stickme.init(params));
      }
    });

    // Extend target with public methods (if not yet)
    if (!target.extended) { $.extend(target, plugin.output); }

    return target;
  };

// Define plugin as a method function
  $.fn.stickme = function(params) {
    params = $.extend({}, params, {target: $(this)});

    return $.stickme(params);
  };

// Create public storage array with all DOM elements that are active targets of the plugin
  $.stickme.targets = [];

// Bind scroll event
  $(document).bind('scroll', function() {
    for (var target in $.stickme.targets) {
      if ($.stickme.targets.hasOwnProperty(target)) {
        var obj = $.stickme.targets[target];
        obj.setPosition();
      }
    }
  });

// Bind window resize event to update object's position & fluid width
  $(window).bind('resize', function() {
    for (var target in $.stickme.targets) {
      if ($.stickme.targets.hasOwnProperty(target)) {
        var obj = $.stickme.targets[target];
        obj.resizeHandler();
      }
    }
  });

}(jQuery));