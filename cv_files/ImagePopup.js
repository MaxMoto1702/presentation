define(
    [
        'jsx/Dom',
        'jsx/CallBacks',
        'jsx/Events',
        'jsxComponents/ScreenFade'
    ],
    function() {
jsx.Components.build('HH/Resume/ImagePopup',
    function(){
        this.init = function(element, params){
            this.element = element;
            this.popup = jsx.Dom.$$(this.element,'.HH-Resume-ImagePopup-Popup');
            this.image = jsx.Dom.$$(this.element,'.HH-Resume-ImagePopup-Image');
            this.title = jsx.Dom.$$(this.element,'.HH-Resume-ImagePopup-Title');

            jsx.Dom.getElementsBySelector(this.element, '.HH-Resume-ImagePopup-Link').forEach(this.observeLink, this);
        };

        this.observeLink = function(link) {
            jsx.Events.observe(link, 'click', this.show.bind(this,link));
        };

        this.show = function(a,e) {
            jsx.Events.stop(e);
            this.image.src = a.href;
            this.title[(typeof this.title.innerText != 'undefined' ? 'innerText' : 'textContent')] = a.title;
            jsxComponents.ScreenFade.show(this.popup, true);
            jsx.Dom.removeClassName(this.popup, 'g-hidden');
        }
    }
);
    }
);
