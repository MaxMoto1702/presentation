define(function() {

    'use strict';

     /**
     * Вызывает инициализацию у конструктора компонента на элементе/элементах
     */
    var _initComponent = function(name, element, params) {
        jsx.Console.log('Calling "init" for: ', name, element, params);

        var Component = window;
        var path = name.split('/');

        for (var i = 0, l = path.length; i < l; i++) {
            Component = Component[path[i]];

            if (!Component) {
                return false;
            }
        }

        if (typeof(Component.init) !== 'function') {
            return jsx.Console.error('Missing init function at component:', name);
        }

        if (!element) {
            return jsx.Console.error('Element undefined for component:', name);
        }

        if (element.nodeType) {
            Component.init(element, params);
        } else if (element.length) {
            for (var i = 0, l = element.length; i < l; i++) {
                Component.init(element[i], params);
            }
        }

        if (HH && HH.jsxDebug) {
            HH.compInitEnd = (+new Date());
        }

        return true;
    };

    /**
     * Старые компоненты для обратной совместимости
     */
    var _processOldComponents = function(node) {
        var translateOldName = function(name) {
            name = name.replace(/(\}\.|\.)/g, '/');
            return name[0] === '{' ? name.slice(1) : 'jsx/' + name;
        };

        var CLASSNAME = 'jsx-component';
        var $elements = $('.' + CLASSNAME, node);

        if ($(node).hasClass(CLASSNAME)) {
            $elements = $elements.add(node);
        }

        $elements.each(function(index, element) {
            try {
                var params = element.onclick();
                element.removeAttribute('onclick');
                element.onclick = {};
            } catch (e) {
                var params = {};
            }

            if (params.types) {
                for (var i = 0, l = params.types.length; i < l; i++) {
                    var name = params.types[i];
                    jsx.Console.warn('Processing old component:', name);
                    this.make(translateOldName(name), element, params[name]);
                }
            }
        }.bind(this));
    };

    return jsx.Components = {

        /**
         * Инициализирует компоненты в указанной ноде
         */
        init: function(node) {
            $('script[data-name]', node || document).each(function(index, container){
                var $container = $(container);
                var name = $container.data('name');
                var paramsText = $container.data('params')
                var element;
                var params = {};

                //костыль для <input, textarea> тегов
                if ($container.data('for') === 'prev') {
                    element = $container.prev().get(0);
                } else {
                    element = $container.parent().get(0);
                }


                if (paramsText && paramsText.length) {
                    try {
                        //eval взрывается, когда в значении свойства json'а есть строка с переносом.
                        paramsText = paramsText.replace(/\n/g, '');

                        params = eval('(' + paramsText+ ')');
                    } catch(e) {
                        jsx.Console.error('Syntax Error in json params in component:', name, paramsText);
                    }
                }

                this.make(name, element, params);
            }.bind(this));

            // Для обратной совместимости
            _processOldComponents.call(this, node || document);
        },

        /**
         * Вешает на элемент компонент с параметрами
         */
        make: function(name, element, params) {
            jsx.Console.log('Start loading js files for: ', name);
            if(!_initComponent(name, element, params || {})){
                requirejs([name], _initComponent.bind(this, name, element, params || {}));
            }
        },

        /**
         * Формирует конструктор для компонента
         */
        build: function(name, constructor) {
            jsx.Console.log('Building component: ', name);

            var Component = window;
            var path = name.split('/');

            for (var i = 0, l = path.length; i < l; i++) {
                Component[path[i]] = Component[path[i]] || {};
                Component = Component[path[i]];
            }

            Component.init = function(element, params) {
                new Component.Constructor(element, params);
            };

            Component.Constructor = function(element, params) {
                this.__name = name;
                this.element = element;
                this.$element = $(element);
                this.params = $.extend(true, {}, this.defaults || {}, params);
                this.init(element, params);
            };

            Component.Constructor.prototype = new constructor();

            return Component;
        }
    };
});
