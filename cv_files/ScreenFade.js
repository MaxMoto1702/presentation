define(['require', 'jsx/Dom', 'jsx/Events', 'jsx/CallBacks'], function(req) {
    'use strict';

    jsx.Links.createLink({href: req.toUrl('./ScreenFade/style.css')});
    jsxComponents.ScreenFade = {
        init: function() {
            var body = document.getElementsByTagName('body')[0];
            this.frame = body.insertBefore(document.createElement('div'), body.firstChild);
            jsx.Dom.addClassName(this.frame, 'jsxComponents-ScreenFade-frame');
            jsx.Dom.addClassName(this.frame, 'jsxComponents-ScreenFade-hidden');

            jsx.Dom.getElementsBySelector(this.element, '.jsxComponents-ScreenFade-Hide')
                .forEach(function(element) {
                    jsx.Events.observe(element, 'click', this.dispatch.bind(this));
                }, this);

            jsx.CallBacks.add('jsxComponents-ScreenFade-Position', this.setPosition.bind(this), this);
            jsx.CallBacks.add('jsxComponents-ScreenFade-PreventClickPropagnation', function() {
                jsx.Events.observe(this.frame, 'click', function(e) {
                    jsx.Events.stop(e);
                });
            }.bind(this), this);

            this.createShadow();
            this.createContainer();
        },

        createShadow: function() {
            var shadow = document.createElement('div');
            jsx.Events.observe(shadow, 'click', this.dispatch.bind(this));
            jsx.Dom.addClassName(shadow, 'jsxComponents-ScreenFade-shadow');
            this.frame.appendChild(shadow);
        },

        createContainer: function() {
            this.container = this.frame.appendChild(document.createElement('div'));
            jsx.Dom.addClassName(this.container, 'jsxComponents-ScreenFade-container');
        },

        createCloser: function(parent) {
            if (!this.closer || !this.closer.innerHTML) {
                this.closer = parent.appendChild(document.createElement('div'));
                jsx.Dom.addClassName(this.closer, 'jsxComponents-ScreenFade-closer');
                jsx.Dom.addClassName(this.closer, 'b-popup-closer');
                this.closer.innerHTML = '<img src="' + req.toUrl('./ScreenFade/close.gif') + '" alt="Закрыть" title="Закрыть" />';
            } else {
                parent.appendChild(this.closer);
            }

            jsx.Events.observe(this.closer, 'click', this.closerClick.bind(this));
        },

        dispatch: function(e) {
            if (this.autoclose) {
                jsx.Events.stop(e);
                this.hide();
            }
            jsx.CallBacks.dispatch('jsxComponents-ScreenFade-Click', this);
        },

        closerClick: function(e) {
            jsx.Events.preventDefault(e);
            this.hide();
            jsx.CallBacks.dispatch('jsxComponents-ScreenFade-Click', this);
        },

        show: function(child, autoclose, hideCloser) {
            this.clear();
            if (child) {
                this.child = this.container.appendChild(child);
                jsx.Dom.addClassName(this.child, 'jsxComponents-ScreenFade-child');
                this.setPosition();
                if (!hideCloser) {
                    this.createCloser(child);
                }
            }
            jsx.Dom.removeClassName(this.frame, 'jsxComponents-ScreenFade-hidden');
            this.autoclose = autoclose;
        },

        hide: function() {
            jsx.Dom.addClassName(this.frame, 'jsxComponents-ScreenFade-hidden');
            jsx.CallBacks.dispatch('jsxComponents-ScreenFade-Hide', this);
            this.clear();
        },

        clear: function() {
            if (this.child && this.child.parentNode) {
                this.child.parentNode.removeChild(this.child);
                this.child = false;
            }
        },

        setPosition: function() {
            if (!this.child) {
                return;
            }

            var add = 80,
                scrollTop = parseInt(jsx.Dom.getScroll().top, 10),
                windowHeight = document.documentElement.clientHeight || window.innerHeight,
                popupHeight = this.child.offsetHeight,
                popupTop;
            if (popupHeight === 0) {
                popupTop = scrollTop + add;
            } else {
                popupTop = Math.round(scrollTop + ((windowHeight / 2) - (popupHeight / 2)));
                if (popupTop < add) {
                    popupTop = add;
                }
            }
            this.child.style.top = popupTop + 'px';

            this.frame.style.height = jsx.Dom.getScrollBox().height + 'px';
        }
    };
    jsxComponents.ScreenFade.init();

    return jsxComponents.ScreenFade;
});
