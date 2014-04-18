define(
    [
        'jsx/Dom',
        'jsx/CallBacks'
    ],
    function() {
jsx.Components.build('HH/FirstPageFocusMover',
  function(){

    this.init = function(element, params){
      this.element = element;
      this.params = params;
      if (params.target) {
        this.target = params.target;
      } else {
        this.target = document.getElementById('main-search-applicant');
      }
      jsx.CallBacks.add('jsxComponents-ToggleBlock-Switch', this.go.bind(this), this.element);
    };

    this.go = function(e) {
      if (e.closed) {
        if (this.target)
          this.target.focus();
      }
    };

  }
);
    }
);
