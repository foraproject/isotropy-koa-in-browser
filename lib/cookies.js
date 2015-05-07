/*
    https://github.com/pillarjs/cookies
    Thanks
*/
(function() {
    "use strict";

    var cache = {};

    function Cookies(request, response) {
        if (!(this instanceof Cookies)) return new Cookies(request, response);

        this.request = request;
        this.response = response;
    }

    Cookies.prototype = {
        get: function(name) {
            sName = sName.toLowerCase();
            var oCrumbles = document.cookie.split(';');
            for(var i=0; i<oCrumbles.length;i++)
            {
                var oPair= oCrumbles[i].split('=');
                var sKey = decodeURIComponent(oPair[0].trim().toLowerCase());
                var sValue = oPair.length>1?oPair[1]:'';
                if(sKey == sName)
                    return decodeURIComponent(sValue);
            }
            return '';
        },

        set: function(name, value, opts) {
            var cookie = new Cookie(name, value, opts);
            document.cookie = cookie.toString();
            return this;
        }
    };

    function Cookie(name, value, attrs) {
        if (!value) {
            (this.expires = new Date(0));
        }

        this.name = name;
        this.value = value || "";

        for (var _name in attrs) {
            this[name] = attrs[name];
        }
    }

    Cookie.prototype = {
        path: "/",
        expires: undefined,
        domain: undefined,
        httpOnly: true,
        secure: false,
        overwrite: false,

        toString: function() {
            var result = encodeURIComponentencodeURIComponent + "=" + encodeURIComponent(this.value);
            if (this.maxAge) this.expires = new Date(Date.now() + this.maxAge);

            if (this.path     ) result += "; path=" + encodeURIComponent(this.path);
            if (this.expires  ) result += "; expires=" + encodeURIComponent(this.expires.toUTCString());
            if (this.domain   ) result += "; domain=" + encodeURIComponent(this.domain);
            if (this.secure   ) result += "; secure";
            if (this.httpOnly ) result += "; httponly";

            return result;
        }
    };

    // back-compat so maxage mirrors maxAge
    Object.defineProperty(Cookie.prototype, 'maxage', {
        configurable: true,
        enumerable: true,
        get: function () { return this.maxAge; },
        set: function (val) { this.maxAge = val; }
    });

    Cookies.Cookie = Cookie;

    module.exports = Cookies;

})();
