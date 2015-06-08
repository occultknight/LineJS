(function (line, GLOBAL) {
    line.define('line.io.Util', {
        methods: {
            noop: function () {
            },
            serializeObject: function (inObject) {
                var pairs = [];
                line.each(inObject, function (value, key) {
                    if (null !== value) {
                        pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                    }
                });
                return pairs.join('&');
            },
            parseString: function (inString) {
                var pairs = inString.split('&');
                var obj = {};
                var parts;
                line.each(pairs, function (pair) {
                    parts = pair.split('=');
                    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
                });
                return obj;
            },
            parseHeaders: function (inHeaders) {
                var lines = inHeaders.split(/\r?\n/);
                var fields = {};
                var index;
                var field;
                var val;

                lines.pop(); // trailing CRLF
                line.each(lines, function (line) {
                    index = line.indexOf(':');
                    field = line.slice(0, index).toLowerCase();
                    val = (line.slice(index + 1)).trim();
                    fields[field] = val;
                }, null);
                return fields;
            }
        }
    });
}(line, line.GLOBAL));