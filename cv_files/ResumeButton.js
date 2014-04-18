define(['HH/Tooltip', 'jsx/CallBacks'], function(Tooltip){
    'use strict';

    function ResumeButton() {

        this.init = function(element, params){
            var $resumeButton = $('.HH-ResumeButton', element);

            $resumeButton.on('click', function(){
                Tooltip.hide($resumeButton);
            }).hover(function(){
                Tooltip.show($resumeButton, params.tooltip);
            }, function(){
                Tooltip.hide($resumeButton);
            });
        };

    }

    jsx.Components.build('HH/ResumeButton', ResumeButton);
});
