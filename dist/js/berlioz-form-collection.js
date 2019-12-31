/*!
  * Berlioz Form JS v1.0.0 (https://github.com/BerliozFramework/Form.js#readme)
  * Copyright 2018 Berlioz Form JS Authors (https://github.com/BerliozFramework/Form.js/graphs/contributors)
  * Licensed under MIT (https://github.com/BerliozFramework/Form.js/blob/master/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  (global = global || self, global.BerliozCollection = factory(global.jQuery));
}(this, (function ($) { 'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
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
    return Constructor;
  }

  var BerliozCollection = function ($) {
    /**
     * Events.
     */
    var Event = {
      ADD: 'add.collection.berlioz',
      ADDED: 'added.collection.berlioz',
      DELETE: 'delete.collection.berlioz',
      DELETED: 'deleted.collection.berlioz',
      MIN: 'min.collection.berlioz',
      MAX: 'max.collection.berlioz',
      // Selectors
      CLICK_ADD: 'click.add.collection.berlioz',
      CLICK_DELETE: 'click.delete.collection.berlioz'
    };
    /**
     * Selectors.
     */

    var Selector = {
      DATA_ADD: '[data-add="collection"]',
      DATA_DELETE: '[data-delete="collection"]',
      COLLECTION: '[data-collection]',
      COLLECTION_KEY: '[data-collection-key]'
    };
    /**
     * Collection class.
     */

    var Collection =
    /*#__PURE__*/
    function () {
      function Collection(target) {
        _classCallCheck(this, Collection);

        this.target = $(target);
        this.index = parseInt(this._getCollectionItems().last().attr('data-collection-key') || -1);
      }

      _createClass(Collection, [{
        key: "addElement",
        value: function addElement() {
          // Count the total element count in the collection
          var newIndex = this.index + 1;
          var newElement = $('<div data-collection-key="' + newIndex + '"></div>');
          var prototypeString = this.target.data('prototype').replace(/___name___/g, newIndex); // Control maximum

          if (this._controlMaximum()) {
            return;
          } // ADD event


          var eventAdd = $.Event(Event.ADD);
          this.target.trigger(eventAdd);

          if (!eventAdd.isDefaultPrevented()) {
            newElement.append($(prototypeString));

            var lastElement = this._getCollectionItems().last();

            if (lastElement.length === 1) {
              newElement.insertAfter(lastElement);
            } else {
              this.target.prepend(newElement);
            }

            this.index = newIndex; // ADDED event

            this.target.trigger(Event.ADDED);
          }
        }
      }, {
        key: "deleteElement",
        value: function deleteElement(element) {
          element = $(element); // If the element doesn't have the key attribute, it may be a child element of the item, so we try to get
          // the item base element from its parents

          if (typeof element.data('collection-key') === 'undefined') {
            element = element.closest(Selector.COLLECTION_KEY);
          } // If no element found!


          if (element.length === 0) {
            return;
          } // Control minimum


          if (this._controlMinimum()) {
            return;
          } // DELETE event


          var eventDelete = $.Event(Event.DELETE);
          this.target.trigger(eventDelete);

          if (!eventDelete.isDefaultPrevented()) {
            element.remove(); // DELETED event

            this.target.trigger(Event.DELETED);
          }
        }
      }, {
        key: "_nbElements",
        value: function _nbElements() {
          return this._getCollectionItems().length;
        }
      }, {
        key: "_controlMinimum",
        value: function _controlMinimum() {
          var minElements = this.target.data('collectionMin') || 0;

          if (minElements >= this._nbElements()) {
            this.target.trigger(Event.MIN);
            return true;
          }

          return false;
        }
      }, {
        key: "_controlMaximum",
        value: function _controlMaximum() {
          var maxElements = this.target.data('collectionMax') || null;

          if (maxElements !== null && maxElements <= this._nbElements()) {
            this.target.trigger(Event.MAX);
            return true;
          }

          return false;
        }
      }, {
        key: "_getCollectionItems",
        value: function _getCollectionItems() {
          var self = this;
          return this.target.children(Selector.COLLECTION_KEY).filter(function () {
            return $(this).closest(Selector.COLLECTION).is(self.target);
          });
        }
      }], [{
        key: "_escapeRegExp",
        value: function _escapeRegExp(string) {
          return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        }
      }, {
        key: "_jQueryInterface",
        value: function _jQueryInterface(action, arg1) {
          this.each(function () {
            var collectionObj = $(this).data('collection-object');

            if (!(_typeof(collectionObj) === 'object' && collectionObj instanceof Collection)) {
              $(this).data('collection-object', collectionObj = new Collection(this));
            }

            switch (action) {
              case 'add':
                collectionObj.addElement();
                break;

              case 'delete':
                collectionObj.deleteElement(arg1);
                break;
            }
          });
        }
      }]);

      return Collection;
    }();

    $.fn.berliozCollection = Collection._jQueryInterface;

    $.fn.berliozCollection.noConflict = function () {
      return Collection._jQueryInterface;
    }; // Events


    $(document).off(Event.CLICK_ADD, Selector.DATA_ADD).on(Event.CLICK_ADD, Selector.DATA_ADD, function (event) {
      var target = $(event.currentTarget);
      var collection;

      if (target.data('target')) {
        collection = $('[data-collection="' + target.data('target') + '"]');
      } else {
        collection = target.closest(Selector.COLLECTION);
      }

      collection.berliozCollection('add');
    }).off(Event.CLICK_DELETE, Selector.DATA_DELETE).on(Event.CLICK_DELETE, Selector.DATA_DELETE, function (event) {
      $(event.currentTarget).parents(Selector.COLLECTION).berliozCollection('delete', $(event.currentTarget).parents(Selector.COLLECTION_KEY));
    });
  }($);

  return BerliozCollection;

})));
//# sourceMappingURL=berlioz-form-collection.js.map
