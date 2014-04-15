define(function() {
    'use strict';

    jsx.Components.build('HH/VisitedResumeStorage', function() {
        this.init = function() {
            var hash = this.$element.data('hhResumeHash');

            if (hash) {
                window.localStorage.setItem('LastOpenedResume', hash);
            }
        };
    });
});
