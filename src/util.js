/* @flow */

const isDefined = function(val) {
  return (typeof val !== "undefined" && val !== null);
};

const assign = function(target, name, source, required) {
  required = isDefined(required) ? required : true;
  if (isDefined(source[name])) {
    target[name] = source[name];
  } else {
    if (required) {
      throw new Error(name + " is required to make a native target.");
    }
  }
};

const printNotImplemented = function(method) {
  console.log("The method or property '" + method + "' is not implemented on the client.");
};

export default {
  isDefined,
  assign,
  printNotImplemented
};
