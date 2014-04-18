define(function() {
    'use strict';

    /**
     * Some useful string functions.
     * @alias jsx.Strings
     */
    jsx.Strings = {
        _trimRegexp: /(^[\s\xA0]+|[\s\xA0]+$)/g,
        _escapeRegexp: /([\|\!\[\]\^\$\(\)\{\}\+\=\?\.\*\\])/g,
        _textCases: [2, 0, 1, 1, 1, 2],

        /**
         * Allows to do some convertions like any printf.
         *
         * %[padding][width]type
         * padding   - An optional padding specifier that says what character will be
         *             used for padding the results to the right string size. This may
         *             be a space character or a "0" (zero character).
         * width     - An optional number, a width specifier that says how many
         *             characters (minimum) this conversion should result in.
         * precision - An optional precision specifier that says how many decimal digits
         *             should be displayed for floating-point numbers. This option has
         *             no effect for other types than float.
         * type      - A type specifier that says what type the argument data should be
         *             treated as. Possible types:
         *
         * % - a literal percent character. No argument is required.
         * d - the argument is treated as an integer, and presented as a decimal number.
         * s - the argument is treated as and presented as a string.
         * @alias jsx.Strings.printf
         * @param {String} Format.
         * @param {Array} Array of arguments.
         * @return {String} Result string.
         */
        printf: function (string, data) {
            if (typeof(data) !== 'object') {
                data = [data];
            }
            var formats = string.match(/%(?:s|(?:\d{0,2}d))/g);
            if (formats) {
                for (var i = 0, l = formats.length; i < l; i++) {
                    data[i] = typeof(data[i]) === 'undefined' ? '' : data[i];
                    string = string.replace(new RegExp(formats[i], ''), this.convertData(formats[i], data[i]));
                }
            }
            return string.replace(/%%/g, '%');
        },

        /**
         * Removes spaces from begin and end of string.
         * @alias jsx.Strings.trim
         * @param {String} String.
         * @return {String} Trimed string.
         */
        trim: function(string){
            return string.replace(this._trimRegexp, '');
        },

        /**
         * Converts data for jsx.Strings.printf
         * @alias jsx.Strings.convertData
         * @param {String} Format.
         * @param {Object} Data fo convertion.
         * @return {String} Result string.
         * @private
         */
        convertData: function (format, data) {
            data = '' + data;
            if (format === '%s' || format === '%d') {
                return data;
            }
            if (/%\d{2,2}d/.test(format)) {
                var symbol = format.substr(1, 1),
                    length = format.substr(2, 1);
                while (data.length < length) {
                    data = symbol + data;
                }
            }
            return data;
        },

        divideNumber: function(number, divide){
          divide = divide || ' ';
          var string = '' + number;
          var result = '';
          for (var i = string.length - 1; i >= 0; i--){
            if ((string.length - 1 - i) % 3 === 0 && string.length - 1 - i > 0){
              result = divide + result;
            }
            result = string.charAt(i) + result;
          }
          return result;
        },

        /**
         * !!! DEPRICATED, numConversion must be used !!!
         */
        conversion: function (num, words, dontPrintNumber) {
            var titles = [words[0], words[2], words[1]];
            if (!words[3]) {
                titles.push('');
            }
            if (num === 0) {
                return dontPrintNumber ? titles[3] : this.printf('%s ' + titles[3], String(num));
            }else{
                return this.numConversion(num, titles, dontPrintNumber);
            }
        },

        /**
         * Allows to create correct Russian string from number and 3 word forms.
         *   1 ['день', 'дня', 'дней'] - 1 день.
         *   5 ['день', 'дня', 'дней'] - 5 дней.
         *   2 ['день', 'дня', 'дней'] - 2 дня.
         *   0 ['день', 'дня', 'дней'] - 0 дней.
         * @alias jsx.Strings.conversion
         * @param {Number} Number.
         * @param {Array} Arrays of words.
         * @return {String} Number and correct word.
         */
        numConversion: function (num, words, dontPrintNumber) {
            var textInt = num % 100 > 4 && num % 100 < 20 ? 2 : this._textCases[Math.min(num % 10, 5)];
            return dontPrintNumber ? words[textInt] : this.printf('%s ' + words[textInt], String(num));
        },


        /**
         * Escapes all regexp symbols in string.
         * @alias y5.Strings.escapeRegexp
         * @param {String} String.
         * @return {String} Escaped string.
         */
        escapeRegexp: function (text){
            return text.replace(this._escapeRegexp, "\\$1");
        },

        /**
         * Cut a part from a string start at "from" and length is "length".
         * @alias jsx.Strings.cut
         * @param {String} String.
         * @param {Number} Number.
         * @param {Number} Number.
         * @return {String} Escaped string.
         */
        cut: function(string, from, length){
          length = length || string.length;
          var begin = string.substr(0, from || 0);
          var end = string.substr(from + length);
          return begin + end;
        },

        linkify: function(inputText) {
            //URLs s"tarting with http://, https://, or ftp://
            var replacePattern1 = /(\b(https?|ftp):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z0-9+&@#\/%=~_|])/gim;
            var replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

            //URLs starting with www. (without // before it, or it'd re-link the ones done above)
            var replacePattern2 = /(^|[^\/])(www\.[\-A-Z0-9+&@#\/%?=~_|!:,.;]+(\b|$))/gim;
            replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

            //Change email addresses to mailto:: links
            var replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
            replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

            return replacedText;
        },

        /* Nano Templates (Tomasz Mazur, Jacek Becela) https://github.com/trix/nano */
        applyTemplate: function(template, data) {
            return template.replace(/\{([\w\.]*)\}/g, function (str, key) {
                var keys = key.split("."), value = data[keys.shift()];
                keys.forEach(function() {
                  value = value[this];
                }, this);
                return (value === null || value === undefined) ? "" : value;
            });
        },

        capitalize: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

    };

    return jsx.Strings;
});