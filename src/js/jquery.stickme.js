/*!
  jQuery StickMe Plugin v1.0.2
  http://stickme.martinmetodiev.com

  Copyright (c) 2015 Martin Metodiev
  Licensed under the MIT license.
*/


(function($) {

'use strict';

// Defining plugin
var plg = $.stickme = function(params) {
    // Define plugin shortcut
    var plg = $.stickme;

    var target = plg.setup.target(params);

    // Create a jQuery Object Instance (extended with plg.stickme) inside the DOM object
    target.each(function() {
        if (!$(this).parent().is('.stickme-holder')) {
            var holder = plg.dom.holder.clone();
                $(this).after(holder);
                holder.append($(this));
        }

        var obj = $(this).parent('.stickme-holder')[0];

        if (!obj.stickme) {
            $.extend(obj, {
                stickme: $.extend($(obj), plg.stickme)
            });

            var stickme = obj.stickme;

            plg.clients.push(stickme.init(params));
        }
    });

    // Extend target with StickMe methods (if not yet)
    if (!target.stickmeMethods) {
        $.extend(target, {
            stickmeMethods: true,

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
                    for (var event in obj.options) {
                        obj.children().unbind(event, obj.options[event]);
                    }

                    // Delete object from the client's list
                    for (var i = 0; i < plg.clients.length; i++) {
                        if (holder === plg.clients[i][0]) {
                            plg.clients.splice(i, 1);
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

                delete this.destroy;
                delete this.stickmeMethods;

                return this;
            }
        });
    }
    
    return target;
};

// Extending plugin
$.extend(plg, {
    // Storage array of all objects that are active clients of the plugin
    clients: [],

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
                   params.target : plg.base.target;
        },

        options: function(params) {
            var options = {},
                events = {};

            for (var option in plg.base.options) {
                options[option] = params && params.hasOwnProperty(option) ?
                params[option] : plg.base.options[option];
            }

            for (var event = 0; event < plg.events.length; event++) {
                if (params && params.hasOwnProperty(plg.events[event])) {
                    events[plg.events[event]] = params[plg.events[event]];
                }
            }

            $.extend(options, {events: events});

            return options;
        }
    },

    stickme: {
        init: function(params) {
            var obj = this;

            // Attach options
            obj.options = plg.setup.options(params);

            // Create observer
            obj.createObserver();

            // Set initial width and position
            obj.setPosition();

            // Bind provided events
            for (var event in obj.options.events) {
                obj.children().bind(event, obj.options.events[event]);
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

            obj.observer = plg.dom.observer.clone();
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
    }
});

// Defining StickMe method
$.fn.stickme = function(params) {
    params = $.extend({}, params, {target: $(this)});

    return $.stickme(params);
};

// Bind scroll event
$(document).bind('scroll', function() {
    for (var client in plg.clients) {
        var obj = plg.clients[client];
        obj.setPosition();
    }
});

// Bind window resize event to update object's position & fluid width
$(window).bind('resize', function() {
    for (var client in plg.clients) {
        var obj = plg.clients[client];
        obj.resizeHandler();
    }
});

}(jQuery));