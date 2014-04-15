define(
    [
        'jsx/Strings'
    ],
    function() {
jsx.Components.build(
    'HH/Linkify',
    function(){
        this.init = function(element, params){
            element.innerHTML = jsx.Strings.linkify(element.innerHTML);
        }
    }
);
    }
);
