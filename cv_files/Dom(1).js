define(function() {
  jsx.Dom = {};
  jsx.Dom.hasClassName = function(element, className){
    if (!element || !element.nodeType){
      return;
    }
    return $(element).hasClass(className);
  };
  jsx.Dom.removeClassName = function(element, className){
    if (!element || !element.nodeType){
      return;
    }
    return $(element).removeClass(className);
  };
  jsx.Dom.addClassName = function(element, className){
    if (!element || !element.nodeType){
      return;
    }
    return $(element).addClass(className);
  };
  jsx.Dom.switchClassName = function(element, classOne, classTwo){
    if (jsx.Dom.hasClassName(element, classOne)){
      jsx.Dom.removeClassName(element, classOne);
      jsx.Dom.addClassName(element, classTwo);
    }else if(jsx.Dom.hasClassName(element, classTwo)){
      jsx.Dom.removeClassName(element, classTwo);
      jsx.Dom.addClassName(element, classOne);
    }
  };
  jsx.Dom.toggleClassName = function(element, className){
    if(jsx.Dom.hasClassName(element, className)){
      jsx.Dom.removeClassName(element, className);
    }else{
      jsx.Dom.addClassName(element, className);
    }
  };
  jsx.Dom.getElementsBySelector = function(context, selector){
    return jQuery(selector, context).toArray();
  };
  jsx.Dom.getElementBySelector = function(context, selector){
    return jsx.Dom.getElementsBySelector(context, selector)[0];
  };
  jsx.Dom.$$ = jsx.Dom.getElementBySelector;
  jsx.Dom.offset = function (element){
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);
    return {left: valueL, top: valueT};
    //return jQuery(element).offset();
  };
  jsx.Dom.descendantOf = function(element, ancestor){
    var originalAncestor = ancestor;

    if (element.compareDocumentPosition)
      return (element.compareDocumentPosition(ancestor) & 8) === 8;

    if (element.sourceIndex) {
      var e = element.sourceIndex, a = ancestor.sourceIndex,
       nextAncestor = ancestor.nextSibling;
      if (!nextAncestor) {
        do { ancestor = ancestor.parentNode; }
        while (!(nextAncestor = ancestor.nextSibling) && ancestor.parentNode);
      }
      if (nextAncestor && nextAncestor.sourceIndex)
       return (e > a && e < nextAncestor.sourceIndex);
    }

    while ((element = element.parentNode))
      if (element == originalAncestor) return true;
    return false;
  };

  jsx.Dom.getParent = function(element, selector){
    return $(element).parents(selector)[0];
  };

  jsx.Dom.css = function(element) {
	  return jQuery(element).css.apply(jQuery(element), Array.prototype.slice.call(arguments, 1));
  };

  jsx.Dom.height = function(element) {
	  var args = Array.prototype.slice.call(arguments, 1);
	  return jQuery(element).height.apply(jQuery(element), args);
  }

  jsx.Dom.width = function(element) {
	  var args = Array.prototype.slice.call(arguments, 1);
	  return jQuery(element).width.apply(jQuery(element), args);
  }

  jsx.Dom.outerWidth = function(element) {
      var args = Array.prototype.slice.call(arguments, 1);
      return jQuery(element).outerWidth.apply(jQuery(element), args);
  }

  jsx.Dom.val = function(element) {
	  return jQuery(element).val.apply(jQuery(element), Array.prototype.slice.call(arguments, 1));
  };

  jsx.Dom.attr = function(element) {
	  return jQuery(element).attr.apply(jQuery(element), Array.prototype.slice.call(arguments, 1));
  };

  jsx.Dom.position = function(element) {
	  return jQuery(element).position.apply(jQuery(element), Array.prototype.slice.call(arguments, 1));
  };

});