define(['Underscore', 'jsx/Utils'], function (_, Utils) {
    'use strict';

    var defaults = {
        'message': '',
        'position': 'top',
        'maxWidth': 300,
        'minWidth': 150,
        'timeout': 0,
        'className': {
            'block': 'tooltip',
            'hidden': 'tooltip_hidden',
            'modifiers': {
                'right': 'tooltip_right',
                'top': 'tooltip_top',
                'bottom': 'tooltip_bottom'
            }
        }
    };

    function Tooltip(element, params) {
        this.$element = $(element);
        this.params = $.extend(true, {}, defaults, params);
        this.buildTooltip();
    }

    Tooltip.prototype = {

        builtWith: function(params) {
            return _.isEqual(this.params, $.extend(true, {}, defaults, params));
        },

        buildTooltip: function() {
            this.$tooltip = $('<div/>')
                .addClass(this.params.className.block)
                .addClass(this.params.className.modifiers[this.params.position])
                .addClass(this.params.className.hidden)
                .css({
                    left: -9999,
                    top: -9999
                })
                .text(this.params.message || '')
                .insertAfter(this.$element);

            var metrics = this.$tooltip.get(0).getBoundingClientRect();
            this.width = metrics.right - metrics.left;
            this.margins = this.$tooltip.outerWidth(true) - this.width;
        },

        calculateTop:  {
            'right': function() {
                var elementPos = this.$element.position();
                return elementPos.top + Math.floor((this.$element.innerHeight() - this.$tooltip.innerHeight()) / 2);
            },
            'top': function() {
                return this.$element.position().top - this.$tooltip.outerHeight();
            },
            'bottom': function() {
                return this.$element.position().top + this.$element.outerHeight();
            }
        },

        calculateLeft: {
            'right': function() {
                var elementPos = this.$element.position();
                return elementPos.left + this.$element.outerWidth();
            },
            'top': function() {
                return Math.round(this.$element.position().left +
                       (this.$element.outerWidth() - Math.min(this.$tooltip.outerWidth(), this.params.maxWidth)) / 2);
            },
            'bottom': function() {
                return this.$element.position().left +
                       (this.$element.outerWidth() - Math.min(this.$tooltip.outerWidth(), this.params.maxWidth)) / 2;
            }
        },

        calculateWidth: function() {
            var overflow = this.calculateLeft[this.params.position].call(this, this.$element) + this.margins +
                           Math.min(this.width, this.params.maxWidth) - $(window).width(),
                result;
            if (overflow > 0) {
                result = Math.min(this.width, this.params.maxWidth) - overflow - this.margins + 'px';
            } else {
                result = Math.min(this.width, this.params.maxWidth) + 'px';
            }
            return result;
        },

        render: function() {
            this.$tooltip.css({
                maxWidth: this.params.maxWidth + 'px',
                minWidth: this.params.minWidth + 'px',
                width: this.calculateWidth.bind(this),
                left: this.calculateLeft[this.params.position].bind(this),
                top: this.calculateTop[this.params.position].bind(this)
            });
        },

        toggle: function(state) {
            var render = $.proxy(this.render, this);

            if (state && this.params.message) {
                this.render();
                $(window).on('resize', render);
            } else {
                $(window).off('resize', render);
            }

            this.$tooltip.toggleClass(this.params.className.hidden, !state);
        },

        show: function() {
            this.toggle(true);

            if (this.params.timeout > 0) {
                window.clearTimeout(this.timeout);
                this.timeout = window.setTimeout(function() {
                    this.toggle(false);
                }.bind(this), this.params.timeout);
            }

            return this;
        },

        hide: function() {
            this.toggle(false);
        },

        remove: function() {
            this.$tooltip.remove();
        }
    };


    var tooltips = {};
    var groupToUid = {};


    function TooltipModule() {
        this.toggle = function(element, state, params) {
            if (state) {
                this.show(element, params);
            } else {
                this.hide(element);
            }
        };

        this.show = function(element, options) {
            var $element = $(element),
                params = $.extend({
                    'message': $element.data('tooltip-message'),
                    'position': $element.data('tooltip-position')
                }, options),
                uid = Utils.getUniqueId($element[0]);

            // Удаляем тултип на текущем элементе, если у него другие настройки
            if (tooltips[uid] && !tooltips[uid].builtWith(params)) {
                tooltips[uid].remove();
                delete tooltips[uid];
            }

            if (params.group) {
                var groupUid = groupToUid[params.group];

                // Удаляем групповой тултип, если он был показан на другом элементе
                if ((groupUid !== uid) && tooltips[groupUid]) {
                    tooltips[groupUid].remove();
                    delete tooltips[groupUid];
                }

                groupToUid[params.group] = uid;
            }

            if (!tooltips[uid]) {
                tooltips[uid] = new Tooltip(element, params);
            }

            tooltips[uid].show();
        };

        this.hide = function(element) {
            var uid = Utils.getUniqueId($(element)[0]);
            if (tooltips[uid]) {
                tooltips[uid].hide();
            }
        };
    }

    return new TooltipModule();
});
