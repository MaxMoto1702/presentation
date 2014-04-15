define(['jsx/CallBacks'], function(){
    'use strict';

    function ResumeChangeLang() {

        this.init = function(element){
            var $languages = $('.HH-ResumeChangeLang', element);
            var $selectedLang = $('.HH-ResumeSelectedLang', element);
            $languages.on('click', function(){
                $selectedLang.val($(this).data('lang'));
                $(element).submit();
            });

        };

    }

    jsx.Components.build('HH/ResumeChangeLang', ResumeChangeLang);
});
