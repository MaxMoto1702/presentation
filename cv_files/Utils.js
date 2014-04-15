define(function() {
    'use strict';

    /**
     * Some functions for uniqID
     */
    jsx.Utils = {
        count: 0,
        /**
         * Generates unique string with prefix.
         * @param {String} Prefix.
         * @return {String} Uniq ID.
         */
        generateId: function(prefix) {
            return (prefix || 'uid') + (this.count++);
        },

        /**
         * Generates unique ID for DOM node for IE returns native uniqID.
         * @param {Object} DOM node.
         * @return {String} Uniq ID.
         * @deprecated
         */
        getUniqueID: function(object) {
            return this.getUniqueId(object);
        },

        /**
         * Generates unique ID for DOM node for IE returns native uniqID.
         * @param {Object} DOM node.
         * @return {String} Uniq ID.
         */
        getUniqueId: function(object) {
            return object.uniqueID || (object.uniqueID = this.generateId());
        },

        /**
         * Remove unique ID for DOM node.
         * @param {Object} DOM node.
         */
        removeUniqueId: function(object) {
            try {
                object.uniqueID = null;
            }
            catch (e) {}
        },

        /**
         * Compares two links DOM nodes.
         * @param {Object} DOM node.
         * @param {Object} DOM node.
         */
        isEqual: function(first, second) {
            return (this.getUniqueId(first) === this.getUniqueId(second));
        },

        /**
         * Clone object
         * WARNING! Not deep copy (TODO)
         */
        clone: function(obj) {
            return Array.isArray(obj) ? obj.slice() : this.extend({}, obj);
        },

        /**
         * LOL
         */
        toQueryString: function(obj) {
            var i,
                key,
                value,
                result = [];
            for (i in obj) {
                key = encodeURIComponent(i);
                value = obj[i];
                result.push(key + '=' + value);
            }
            return result.join('&');
        },

        hash2hash: function(thisObject, callback) {
            var i,
                map = {},
                current;
            for (i in thisObject) {
                if (Object.prototype.hasOwnProperty.call(thisObject, i)) {
                    current = callback(i, thisObject[i]);
                    map[current[0]] = current[1];
                }
            }
            return map;
        },

        hash2array: function(thisObject, callback) {
            var i,
                map = [];
            for (i in thisObject) {
                if (Object.prototype.hasOwnProperty.call(thisObject, i)) {
                    map.push(callback(i, thisObject[i]));
                }
            }
            return map;
        },

        forEach: function(thisObject, callback) {
            var i;
            for (i in thisObject) {
                if (Object.prototype.hasOwnProperty.call(thisObject, i)) {
                    callback(i, thisObject[i]);
                }
            }
        },


        keys: function(thisObject) {
            var i,
                map = [];
            for (i in thisObject) {
                if (Object.prototype.hasOwnProperty.call(thisObject, i)) {
                    map.push(i);
                }
            }
            return map;
        },

        values: function(thisObject) {
            var i,
                map = [];
            for (i in thisObject) {
                if (Object.prototype.hasOwnProperty.call(thisObject, i)) {
                    map.push(thisObject[i]);
                }
            }
            return map;
        },

        contains: function(value, list) {
            if (typeof list !== 'string' && !Array.isArray(list)) {
                return false;
            }
            return (list).indexOf(value) !== -1;
        },

        sortNumbers: function(list, reverse) {
            if (!Array.isArray(list)) {
                return;
            }
            return list.sort(function(a, b) {
                return reverse ? b - a : a - b;
            });
        },

        extend: function(obj) {
            this.forEach(Array.prototype.slice.call(arguments, 1), function(idx, source) {
                for (var prop in source) {
                    if (source[prop] !== void 0) {
                        obj[prop] = source[prop];
                    }
                }
            });

            return obj;
        },

        postMessageInterface: function(data, domain) {  // IE 8 popup-to-parent messaging workaround
            window.setTimeout(function() {
                window.top.postMessage(data, domain);
            }, 0);
        },

        getURLParameter: function(url, param) {
            return (new RegExp(param + '=' + '(.+?)(&|$)').exec(url) || [null, null])[1];
        },

        replaceURLParameter: function(url, param, value) {
            return url.replace(new RegExp('(' + param + '=)' + '(.+?)' + '(&|$)'), '$1' + value + '$3');
        },

        getParams: function(object) {
            var params;
            try {
                params = object.onclick ? object.onclick() : {};
            }
            catch (e) {}

            object.removeAttribute('onclick');
            object.onclick = {};
            
            return params || {};
        }
    };

    return jsx.Utils;

});
