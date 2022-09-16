/*!
  * Berlioz Form JS v2.0.0 (https://github.com/BerliozFramework/Form.js#readme)
  * Copyright 2022 Berlioz Form JS Authors (https://github.com/BerliozFramework/Form.js/graphs/contributors)
  * Licensed under MIT (https://github.com/BerliozFramework/Form.js/blob/master/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.BerliozCollection = factory());
})(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }

    return target;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var triggerEvent = function triggerEvent(type, element, args) {
    var event = new CustomEvent(type, {
      cancelable: true
    });

    if (args) {
      Object.keys(args).forEach(function (key) {
        return Object.defineProperty(event, key, {
          get: function get() {
            return args[key];
          }
        });
      });
    }

    element.dispatchEvent(event);
    return event;
  };

  var Event = {
    ADD: 'add.collection.berlioz',
    ADDED: 'added.collection.berlioz',
    DELETE: 'delete.collection.berlioz',
    DELETED: 'deleted.collection.berlioz',
    MIN: 'min.collection.berlioz',
    MAX: 'max.collection.berlioz',
    CLICK_ADD: 'click.add.collection.berlioz',
    CLICK_DELETE: 'click.delete.collection.berlioz'
  };
  var Selector = {
    DATA_ADD: '[data-add="collection"]',
    DATA_REMOVE: '[data-delete="collection"]',
    COLLECTION: '[data-collection]',
    COLLECTION_KEY: '[data-collection-key]'
  };
  var Default = {
    min: 0,
    max: -1,
    prototype: null,
    prototypePlaceholder: 'name'
  };

  var Collection = /*#__PURE__*/function () {
    function Collection(target, config) {
      _classCallCheck(this, Collection);

      this._target = target;
      this._config = _objectSpread2(_objectSpread2(_objectSpread2({}, Default), this._configFromData(target)), config);
      this._config.min = parseInt(this._config.min);
      this._config.max = parseInt(this._config.max);
      this._index = parseInt(this.lastItem ? this.lastItem.dataset.collectionKey || -1 : -1);
      this._target._collection = this;
    }

    _createClass(Collection, [{
      key: "_configFromData",
      value: function _configFromData(element) {
        var config = {};
        Object.keys(Default).forEach(function (key) {
          var keyData = 'collection' + key.substring(0, 1).toUpperCase() + key.substring(1);

          if (element.dataset.hasOwnProperty(keyData)) {
            config[key] = element.dataset[keyData];
          }
        });
        return config;
      }
    }, {
      key: "target",
      get: function get() {
        return this._target;
      }
    }, {
      key: "config",
      get: function get() {
        return this._config;
      }
    }, {
      key: "items",
      get: function get() {
        var _this = this;

        return Array.from(this.target.querySelectorAll(Selector.COLLECTION_KEY)).filter(function (element) {
          return element.closest(Selector.COLLECTION) === _this.target;
        });
      }
    }, {
      key: "index",
      get: function get() {
        return this._index;
      }
    }, {
      key: "firstItem",
      get: function get() {
        return this.items[0] || null;
      }
    }, {
      key: "lastItem",
      get: function get() {
        var items = this.items;
        return items[items.length - 1] || null;
      }
    }, {
      key: "add",
      value: function add() {
        if (!this.config.prototype) {
          console.warn('No prototype declared for collection, unable to add item');
          return;
        }

        if (this.isFull()) {
          return;
        }

        var tpl = document.createElement('div');
        tpl.dataset.collectionKey = (++this._index).toString();
        tpl.innerHTML = this.config.prototype.replace(new RegExp('___' + this.config.prototypePlaceholder + '___', 'g'), this._index); // ADD event

        var event = triggerEvent(Event.ADD, this.target, {
          collection: this
        });

        if (!event.defaultPrevented) {
          // Insert after last element or to the end
          if (this.lastItem) {
            this.lastItem.after(tpl);
          } else {
            this.target.append(tpl);
          }

          triggerEvent(Event.ADDED, this.target, {
            relatedTarget: tpl,
            collection: this
          });
        }

        return tpl;
      }
    }, {
      key: "remove",
      value: function remove(element) {
        // If the element doesn't have the key attribute, it may be a child element of the item, so we try to get
        // the item base element from its parents
        if (!element.matches(Selector.COLLECTION_KEY)) {
          if (!(element = element.closest(Selector.COLLECTION_KEY))) {
            if (element.closest(Selector.COLLECTION) !== this.target) {
              console.warn('Try to remove a non item');
              return;
            }
          }
        } // DELETE event


        var event = triggerEvent(Event.DELETE, this.target, {
          relatedTarget: element,
          collection: this
        });

        if (this.isMin()) {
          return;
        }

        if (!event.defaultPrevented) {
          element.parentNode.removeChild(element);
          triggerEvent(Event.DELETED, this.target, {
            relatedTarget: element,
            collection: this
          });
        }

        return element;
      }
    }, {
      key: "isMin",
      value: function isMin() {
        if (this.config.min > -1 && this.config.min >= this.items.length) {
          triggerEvent(Event.MIN, this.target, {
            relatedTarget: this.target,
            collection: this
          });
          return true;
        }

        return false;
      }
    }, {
      key: "isFull",
      value: function isFull() {
        if (this.config.max > -1 && this.config.max <= this.items.length) {
          triggerEvent(Event.MAX, this.target, {
            relatedTarget: this.target,
            collection: this
          });
          return true;
        }

        return false;
      }
    }]);

    return Collection;
  }(); // Events


  document.addEventListener('click', function (event) {
    var button = event.target.closest(Selector.DATA_ADD);

    if (!button) {
      return;
    }

    var collection;

    if (button.dataset.target) {
      if (!(collection = document.querySelector(button.dataset.target))) {
        collection = document.querySelector('[data-collection="' + button.dataset.target + '"]');
      }
    } else {
      collection = button.closest(Selector.COLLECTION);
    }

    if (collection && collection._collection) {
      collection._collection.add();
    }
  });
  document.addEventListener('click', function (event) {
    var button = event.target.closest(Selector.DATA_REMOVE);

    if (!button) {
      return;
    }

    var collectionItem = button.closest(Selector.COLLECTION_KEY);

    if (collectionItem) {
      var collection = collectionItem.closest(Selector.COLLECTION);

      if (collection && collection._collection) {
        collection._collection.remove(collectionItem);
      }
    }
  });

  return Collection;

}));
//# sourceMappingURL=collection.js.map
