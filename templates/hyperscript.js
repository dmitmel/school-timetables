// https://github.com/hyperhype/hyperscript/blob/master/index.js
// https://github.com/1N50MN14/html-element/blob/master/index.js

class Node {}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeHtmlAttribute(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

const VOID_ELEMENTS = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

class Element extends Node {
  constructor(tagName) {
    super();
    this.tagName = tagName;
    this.attributes = {};
    this.childNodes = [];
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  appendChild(node) {
    this.childNodes.push(node);
  }

  get innerHTML() {
    return this.childNodes.map((e) => e.outerHTML || e.textContent).join('');
  }

  get outerHTML() {
    let attrsStr = Object.keys(this.attributes)
      .map((name) => {
        let value = this.attributes[name];
        return ` ${name}="${escapeHtmlAttribute(String(value))}"`;
      })
      .join('');

    let a = `<${this.tagName}${attrsStr}>`;

    if (!VOID_ELEMENTS.includes(this.tagName.toLowerCase())) {
      a += this.innerHTML;
      a += `</${this.tagName}>`;
    }

    return a;
  }
}

class Text extends Node {
  constructor(value) {
    super();
    this.value = value;
  }

  get textContent() {
    return escapeHtml(String(this.value));
  }
}

module.exports = function h(tagName, ...args) {
  let element = new Element(tagName);

  function handleItem(item) {
    if (item == null) return;
    if (Array.isArray(item)) {
      item.forEach(handleItem);
    } else if (item instanceof Node) {
      element.appendChild(item);
    } else if (typeof item === 'object') {
      Object.keys(item).forEach((attrName) => {
        let attrValue = item[attrName];
        element.setAttribute(attrName, attrValue);
      });
    } else {
      element.appendChild(new Text(item));
    }
  }
  args.forEach(handleItem);

  return element;
};
