define(['Libraries/hopscotch'], function() {
    'use strict';

    jsx.Components.build('HH/Notifications', function() {

        var HOLE_PADDING = 7;
        var SCROLLING_TAB = 100;
 
        this.init = function(element, params) {
            this.element = element;
            this.$element = $('#HH-Notification-' + params.hopscotchParams.id);
            params.hopscotchParams.target = this.$element.get(0);
            if (params.hopscotchParams.target === undefined || !this.$element.is(":visible")) {
                return;
            }

            this.notificationShown();

            this.scrollToElement(params.hopscotchParams.placement);
            $(document).one('scroll.notifications', function() { //for chrome
                this.scrollToElement(params.hopscotchParams.placement);
            }.bind(this));

            this.shadowRight = params.shadowRight || 0;
            this.shadowDown = params.shadowDown || 0;

            this.$element.on('click.notifications', function(){
                callout.destroy();
                this.hide();
                HH.conversionGoals.googleEventToStorage('notifications', this.params.hopscotchParams.id, 'action');
                this.$element.off('click.notifications');
            }.bind(this));

            params.hopscotchParams.bubbleWidth = params.hopscotchParams.bubbleWidth || 374; //436-31*2
            if (params.hopscotchParams.placement in {'top': 1, 'bottom': 1}) {
                params.hopscotchParams.arrowOffset = params.hopscotchParams.arrowOffset || 'center';
                params.hopscotchParams.xOffset = params.hopscotchParams.xOffset || 'center';
            }

            params.hopscotchParams.content = params.hopscotchParams.content || $('.HH-Notifications-Content', element).html();
            $('.HH-Notifications-Content', element).html('');
            params.hopscotchParams.onClose = function() {
                this.hide();
                HH.conversionGoals.trackAnalyticsEvent('notifications', this.params.hopscotchParams.id, 'close');
            }.bind(this);

            var calloutMgr = hopscotch.getCalloutManager();
            var elementTop = this.$element.offset().top;
            var elementLeft = this.$element.offset().left;
            var callout = calloutMgr.createCallout(params.hopscotchParams);
            this.interval = window.setInterval(function() {
                if (elementTop != this.$element.offset().top) {
                    callout.setPosition(callout.currStep);
                    this.correctShadow();
                    elementTop = this.$element.offset().top;
                }
                if (elementLeft != this.$element.offset().left) {
                    callout.setPosition(callout.currStep);
                    this.correctShadow();
                    elementLeft = this.$element.offset().left;
                }
            }.bind(this), 100);
            $('body').on('focusin.notifications', function(event) {
                if (event.target.className.search('HH-Notifications-') === -1) {
                    $('.HH-Notifications-get_it').focus();
                    $('.HH-Notifications-action').focus();
                    event.stopPropagation();
                    event.preventDefault();
                }
            });
            $('.HH-Notifications-later').on('click', function() {
                this.showLater();
                callout.destroy();
                this.hide();
                HH.conversionGoals.trackAnalyticsEvent('notifications', this.params.hopscotchParams.id, 'later');
            }.bind(this));
            $('.HH-Notifications-get_it').on('click', function(event) {
                callout.destroy();
                this.hide();
                HH.conversionGoals.trackAnalyticsEvent('notifications', this.params.hopscotchParams.id, 'get_it');
            }.bind(this));
            $('.HH-Notifications-action').on('click', function(event) {
                if ($('.HH-Notifications-Href').length !== 0) {
                    HH.conversionGoals.googleEventToStorage('notifications', this.params.hopscotchParams.id, 'action_button');
                } else {
                    callout.destroy();
                    this.hide();
                    $(HH).trigger('NotificationsAction-' + this.params.hopscotchParams.id);
                    HH.conversionGoals.trackAnalyticsEvent('notifications', this.params.hopscotchParams.id, 'action_button');
                }
            }.bind(this));

            $('.HH-Notifications-get_it').focus();
            $('.HH-Notifications-action').focus();
            this.createShadow();
        };

        this.scrollToElement = function(placement) {
            var elTop = this.$element.offset().top;
            var scrllTop = $(document).scrollTop();
            var elHeight = this.$element.height();
            var winHeight = $(window).height();

            if (elTop < scrllTop + SCROLLING_TAB || elTop > (scrllTop + winHeight - elHeight - SCROLLING_TAB)) {
                if (placement === 'top') {
                    $(document).scrollTop(elTop - winHeight/2 - SCROLLING_TAB);
                } else {
                    $(document).scrollTop(elTop - winHeight/2 + SCROLLING_TAB);
                }
            }
        };

        this.createShadow = function() {
            this.$shadow = $('.HH-Notifications-Shadow', this.element);
            this.$shadow.on('mouseup', function(event) {
                event.preventDefault();
            });
            if (this.$element.css('position') === 'static') {
                this.$element.css('position', 'relative');
            }
            this.elementZIndex = this.$element.css('z-index');
            this.$element.css('z-index', '103');
            this.correctShadow();
            $('body').append(this.$shadow);
            this.$shadow.show();
            this.$shadow.fadeTo('fast', 0.5);
        };

        this.correctShadow = function() {
            this.$shadow.width(this.$element.width() + HOLE_PADDING*2);
            this.$shadow.height(this.$element.height() + HOLE_PADDING*2);
            this.$shadow.css(
                'border-width', 
                (this.$element.offset().top - HOLE_PADDING + this.shadowDown) + 'px ' + 
                    ($(document).outerWidth() - this.$element.width() - this.$element.offset().left - HOLE_PADDING - this.shadowRight) + 'px ' +
                    ($(document).outerHeight() - this.$element.height() - this.$element.offset().top - HOLE_PADDING - this.shadowDown) + 'px ' +
                    (this.$element.offset().left - HOLE_PADDING + this.shadowRight) + 'px'
            );
        };

        this.hide = function() {
            this.$shadow.hide();
            this.$element.css('z-index', this.elementZIndex);
            window.clearInterval(this.interval);
            $('body').off('focusin.notifications');
            $(document).off('scroll.notifications');
        };

        this.notificationShown = function() {
            $.ajax({
                method: 'post',
                url: '/notifications/shown',
                data: {id: this.params.hopscotchParams.id}
            });
        };

        this.showLater = function() {
            $.ajax({
                method: 'post',
                url: '/notifications/showlater',
                data: {id: this.params.hopscotchParams.id}
            });
        };

    });
});
