define(function() {
  jsx.Events = {};
  jsx.Events.observe = jQuery.event.add.bind(jQuery.event);
  jsx.Events.stopObserving = jQuery.event.remove.bind(jQuery.event);
  jsx.Events.element = function(event){
    return  event.srcElement || event.target;
  };
  jsx.Events.isLeftClick = function(event){
    return jQuery.event.fix(event).which == 1;
  };
  jsx.Events.pageX = function(event){
    return jQuery.event.fix(event).pageX;
  };
  jsx.Events.pageY = function(event){
    return jQuery.event.fix(event).pageY;
  };

  jsx.Events.domready = function(callback){
    // avoid the bug in jquery: when readyState is 'interactive', 'ready' callbacks are executed only on 'load' event:
    // http://bugs.jquery.com/ticket/10067
    if (document.readyState === 'interactive') {
      setTimeout( function() {
        jQuery.ready();
        jQuery(document).ready(callback);
      }, 1);
    } else {
      jQuery(document).ready(callback);
    }
  };

});