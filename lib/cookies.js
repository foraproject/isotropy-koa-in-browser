/*
    Code from https://github.com/pillarjs/cookies
    Thanks to dougwilson

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
        get: function(name, opts) {
            var header, match, value;

            header = this.request.headers.cookie;
            if (!header) return;

            match = header.match(getPattern(name));
            if (!match) return;

            value = match[1];
            return value;
        },

        set: function(name, value, opts) {
            var res = this.response;
            var req = this.request;
            var headers = res.getHeader("Set-Cookie") || [];
            var secure = req.protocol === 'https' || req.connection.encrypted;
            var cookie = new Cookie(name, value, opts);

            if (typeof headers == "string") headers = [headers];

            if (!secure && opts && opts.secure) {
                throw new Error('Cannot send secure cookie over unencrypted connection');
            }

            cookie.secure = secure;
            if (opts && "secure" in opts) cookie.secure = opts.secure;
            if (opts && "secureProxy" in opts) cookie.secure = opts.secureProxy;
            headers = pushCookie(headers, cookie);

            res.setHeader.call(res, 'Set-Cookie', headers);
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
            return this.name + "=" + this.value;
        },

        toHeader: function() {
            var header = this.toString();

            if (this.maxAge) this.expires = new Date(Date.now() + this.maxAge);

            if (this.path     ) header += "; path=" + this.path;
            if (this.expires  ) header += "; expires=" + this.expires.toUTCString();
            if (this.domain   ) header += "; domain=" + this.domain;
            if (this.secure   ) header += "; secure";
            if (this.httpOnly ) header += "; httponly";

            return header;
        }
    };

    // back-compat so maxage mirrors maxAge
    Object.defineProperty(Cookie.prototype, 'maxage', {
        configurable: true,
        enumerable: true,
        get: function () { return this.maxAge; },
        set: function (val) { this.maxAge = val; }
    });

    function getPattern(name) {
        if (cache[name]) {
            return cache[name];
        }

        cache[name] = new RegExp(
            "(?:^|;) *" +
            name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") +
            "=([^;]*)"
        );

        return cache[name];
    }

    function pushCookie(cookies, cookie) {
        if (cookie.overwrite) {
            cookies = cookies.filter(function(c) { return c.indexOf(cookie.name+'=') !== 0; });
        }
        cookies.push(cookie.toHeader());
        return cookies;
    }

    Cookies.connect = Cookies.express = function(keys) {
        return function(req, res, next) {
            req.cookies = res.cookies = new Cookies(req, res, keys);
            next();
        };
    };

    Cookies.Cookie = Cookie;

    module.exports = Cookies;

})();
