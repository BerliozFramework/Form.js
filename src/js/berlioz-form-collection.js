import $ from 'jquery'

const BerliozCollection = (($) => {
    /**
     * Events.
     */
    const Event = {
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
    const Selector = {
        DATA_ADD: '[data-add="collection"]',
        DATA_DELETE: '[data-delete="collection"]',
        COLLECTION: '[data-collection]',
        COLLECTION_KEY: '[data-collection-key]'
    };

    /**
     * Collection class.
     */
    class Collection {
        constructor(target) {
            this.target = $(target);
            this.index = this._getCollectionItems().last().attr('data-collection-key') || -1;
        }

        addElement() {
            // Count the total element count in the collection
            let newIndex = this.index + 1;
            let newElement = $('<div data-collection-key="' + newIndex + '"></div>');
            let prototypeString = this.target.data('prototype').replace(/___name___/g, newIndex);

            // Control maximum
            if (this._controlMaximum()) {
                return;
            }

            // ADD event
            let eventAdd = $.Event(Event.ADD);
            this.target.trigger(eventAdd);

            if (!eventAdd.isDefaultPrevented()) {
                newElement.append($(prototypeString));

                let lastElement = this._getCollectionItems().last();
                if (lastElement.length === 1) {
                    newElement.insertAfter(lastElement);
                } else {
                    this.target.prepend(newElement);
                }

                this.index = newIndex;

                // ADDED event
                this.target.trigger(Event.ADDED);
            }
        }

        deleteElement(element) {
            element = $(element);

            // If the element doesn't have the key attribute, it may be a child element of the item, so we try to get
            // the item base element from its parents
            if (typeof element.data('collection-key') === 'undefined') {
                element = element.closest(Selector.COLLECTION_KEY);
            }

            // If no element found!
            if (element.length === 0) {
                return;
            }

            // Control minimum
            if (this._controlMinimum()) {
                return;
            }

            // DELETE event
            let eventDelete = $.Event(Event.DELETE);
            this.target.trigger(eventDelete);

            if (!eventDelete.isDefaultPrevented()) {
                element.remove();

                // DELETED event
                this.target.trigger(Event.DELETED);
            }
        }

        _nbElements() {
            return this._getCollectionItems().length
        }

        _controlMinimum() {
            let minElements = this.target.data('collectionMin') || 0;

            if (minElements >= this._nbElements()) {
                this.target.trigger(Event.MIN);

                return true;
            }

            return false;
        }

        _controlMaximum() {
            let maxElements = this.target.data('collectionMax') || null;

            if (maxElements !== null && maxElements <= this._nbElements()) {
                this.target.trigger(Event.MAX);

                return true;
            }

            return false;
        }

        _getCollectionItems() {
            return this.target.children(Selector.COLLECTION_KEY);
        }

        static _escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        }

        static _jQueryInterface(action, arg1) {
            this.each(function () {
                let collectionObj = $(this).data('collection-object');

                if (!(typeof collectionObj === 'object' && collectionObj instanceof Collection)) {
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
            })
        }
    }

    $.fn.berliozCollection = Collection._jQueryInterface;
    $.fn.berliozCollection.noConflict = function () {
        return Collection._jQueryInterface;
    };

    // Events
    $(document)
        .off(Event.CLICK_ADD, Selector.DATA_ADD)
        .on(Event.CLICK_ADD,
            Selector.DATA_ADD,
            (event) => {
                let target = $(event.currentTarget);
                let collection;
                if (target.data('target')) {
                    collection = $('[data-collection="' + target.data('target') + '"]');
                } else {
                    collection = target.closest(Selector.COLLECTION);
                }
                collection.berliozCollection('add');
            })
        .off(Event.CLICK_DELETE, Selector.DATA_DELETE)
        .on(Event.CLICK_DELETE,
            Selector.DATA_DELETE,
            (event) => {
                $(event.currentTarget)
                    .parents(Selector.COLLECTION)
                    .berliozCollection('delete', $(event.currentTarget).parents(Selector.COLLECTION_KEY));
            })
})($);

export default BerliozCollection
