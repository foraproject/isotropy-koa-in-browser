/* @flow */

/*
https://github.com/pillarjs/cookies
Thanks
*/

const cache: Object = {};

class Cookies {

  get(name) {
    sName = sName.toLowerCase();
    const oCrumbles = document.cookie.split(';');
    for (let i=0; i<oCrumbles.length;i++)
    {
      const oPair= oCrumbles[i].split('=');
      const sKey = decodeURIComponent(oPair[0].trim().toLowerCase());
      const sValue = oPair.length>1?oPair[1]:'';
      if(sKey == sName)
      return decodeURIComponent(sValue);
    }
    return '';
  }

  set(name, value, opts) {
    const cookie = new Cookie(name, value, opts);
    document.cookie = cookie.toString();
    return this;
  }
}

class Cookie {
  path: string = "/";
  expires: string = undefined;
  domain: string = undefined;
  httpOnly: boolean = true;
  secure: boolean = false;
  overwrite: boolean = false;
  maxAge: integer = 0;

  constructor(name: string, value: string, attrs: Object) {
    if (!value) {
      (this.expires = new Date(0));
    }

    this.name = name;
    this.value = value || "";

    for (const _name in attrs) {
      this[name] = attrs[name];
    }
  }

  toString() : string {
    let result = encodeURIComponentencodeURIComponent + "=" + encodeURIComponent(this.value);
    if (this.maxAge) this.expires = new Date(Date.now() + this.maxAge);

    if (this.path     ) result += "; path=" + encodeURIComponent(this.path);
    if (this.expires  ) result += "; expires=" + encodeURIComponent(this.expires.toUTCString());
    if (this.domain   ) result += "; domain=" + encodeURIComponent(this.domain);
    if (this.secure   ) result += "; secure";
    if (this.httpOnly ) result += "; httponly";

    return result;
  }
}

// back-compat so maxage mirrors maxAge
Object.defineProperty(Cookie.prototype, 'maxage', {
  configurable: true,
  enumerable: true,
  get: function () { return this.maxAge; },
  set: function (val) { this.maxAge = val; }
});

Cookies.Cookie = Cookie;

export default Cookies;
