define(['hh/livetexinit', 'jsx/CallBacks'], function() {
    jsx.Components.build('HH/LiveTex',
        function() {

            'use strict';

            this.init = function(element, params) {
                this.params = params;
                this.element = element;

                this.$elem = $(this.element);

                this.activeClass = this.params.activeClass || 'livetex_active';

                jsx.CallBacks.add('HH-LiveTex-Loaded', this.checkStatus.bind(this));
                jsx.CallBacks.ready(this);
            };

            this.checkStatus = function() {
                if (LiveTex.hhOper) {
                    this.$elem.addClass(this.activeClass).on('click', this.openChat);
                }
            };

            this.openChat = function() {
                LiveTex.hhOpenChat();
            };

        }
    );
});
