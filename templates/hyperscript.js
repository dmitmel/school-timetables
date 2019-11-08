// derived from https://github.com/hyperhype/hyperscript/blob/master/index.js

let { document, Node } = require('html-element');

module.exports = function h(...args) {
  let elementCreated = false;
  let element;

  function handleItem(item) {
    if (item == null) return;
    if (typeof item === 'string' && !elementCreated) {
      element = document.createElement(item);
      elementCreated = true;
    } else if (Array.isArray(item)) {
      item.forEach(handleItem);
    } else if (item instanceof Node) {
      element.appendChild(item);
    } else if (typeof item === 'object') {
      for (let attrName in item) {
        let attrValue = item[attrName];
        if (attrName === 'style') {
          if (typeof attrValue === 'string') {
            element.style.cssText = attrValue;
          } else {
            for (let cssAttrName in attrValue) {
              let cssAttrValue = attrValue[cssAttrName];
              let match = cssAttrValue.match(/(.*)\W+!important\W*$/);
              if (match) {
                element.style.setProperty(cssAttrName, match[1], 'important');
              } else {
                element.style.setProperty(cssAttrName, cssAttrValue);
              }
            }
          }
        } else {
          element.setAttribute(attrName, attrValue);
        }
      }
    } else {
      element.appendChild(document.createTextNode(item.toString()));
    }
  }
  args.forEach(handleItem);

  return element;
};
