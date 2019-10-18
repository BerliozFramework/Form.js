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
    }

    /**
     * Selectors.
     */
    const Selector = {
        DATA_ADD: '[data-add="collection"]',
        DATA_DELETE: '[data-delete="collection"]',
        COLLECTION: '[data-collection]',
        COLLECTION_KEY: '[data-collection-key]'
    }

    /**
     * Collection class.
     */
    class Collection {
        constructor(target) {
            this.target = $(target)
        }

        addElement() {
            // Count the total element count in the collection
            let newCount = this._nbElements()
            let newElement = $('<div data-collection-key="' + newCount + '"></div>')
            let prototypeString = this.target.data('prototype').replace(/___name___/g, newCount)

            // Control maximum
            if (this._controlMaximum()) {
                return;
            }

            // ADD event
            let eventAdd = $.Event(Event.ADD)
            this.target.trigger(eventAdd)

            if (!eventAdd.isPropagationStopped()) {
                newElement.append($(prototypeString))
                let lastElement = this._getCollectionItems().last()
                if (lastElement.length === 1) {
                    newElement.insertAfter(lastElement)
                } else {
                    this.target.prepend(newElement)
                }

                // ADDED event
                this.target.trigger(Event.ADDED)

                // Control maximum
                this._controlMaximum()
            }
        }

        deleteElement(element) {
            element = $(element)

            // If the element doesn't have the key attribute, it may be a child element of the item, so we try to get
            // the item base element from its parents
            if (typeof element.data('collection-key') === 'undefined') {
                element = element.closest(Selector.COLLECTION_KEY)
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
            let eventDelete = $.Event(Event.DELETE)
            this.target.trigger(eventDelete)

            if (!eventDelete.isPropagationStopped()) {
                element.remove()

                // Update the indexes on each element
                let collectionName = this.target.data('collection')
                let collectionNameEscaped = Collection._escapeRegExp(this.target.data('collection'))
                let collectionId = this.target.attr('id')

                this._getCollectionItems().each(function (index) {
                    $(this).attr('data-collection-key', index)

                    $('input, select, textarea, label', this).each(function () {
                        let idPattern = new RegExp(collectionId + '_\\d+')
                        let namePattern = new RegExp(collectionNameEscaped + '\\[\\d+')

                        if ($(this)[0].hasAttribute('for')) {
                            $(this).attr('for', $(this).attr('for').replace(idPattern, collectionId + '_' + index))
                        }

                        if ($(this)[0].hasAttribute('name')) {
                            $(this).attr('name', $(this).attr('name').replace(namePattern, collectionName + '[' + index))
                        }
                        if ($(this)[0].hasAttribute('id')) {
                            $(this).attr('id', $(this).attr('id').replace(idPattern, collectionId + '_' + index))
                        }
                    })
                })

                // DELETED event
                this.target.trigger(Event.DELETED)

                // Control minimum
                this._controlMinimum()
            }
        }

        _nbElements() {
            return this._getCollectionItems().length
        }

        _controlMinimum() {
            let minElements = this.target.data('collectionMin') || 0

            if (minElements >= this._nbElements()) {
                this.target.trigger(Event.MIN)
                return true
            }

            return false
        }

        _controlMaximum() {
            let maxElements = this.target.data('collectionMax') || null

            if (maxElements !== null && maxElements <= this._nbElements()) {
                this.target.trigger(Event.MAX)
                return true
            }

            return false
        }

        _getCollectionItems() {
            return this.target.children(Selector.COLLECTION_KEY);
        }
        static _escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
        }

        static _jQueryInterface(action, arg1) {
            this.each(function () {
                let collectionObj = $(this).data('collection-object')

                if (!(typeof collectionObj === 'object' && collectionObj instanceof Collection)) {
                    $(this).data('collection-object', collectionObj = new Collection(this))
                }

                switch (action) {
                    case 'add':
                        collectionObj.addElement()
                        break
                    case 'delete':
                        collectionObj.deleteElement(arg1)
                        break
                }
            })
        }
    }

    $.fn.berliozCollection = Collection._jQueryInterface
    $.fn.berliozCollection.noConflict = function () {
        return Collection._jQueryInterface
    }

    // Events
    $(document)
        .off(Event.CLICK_ADD, Selector.DATA_ADD)
        .on(Event.CLICK_ADD,
            Selector.DATA_ADD,
            (event) => {
                let target = $(event.currentTarget)
                let collection;
                if (target.data('target')) {
                    collection = $('[data-collection="' + target.data('target') + '"]')
                } else {
                    collection = target.closest(Selector.COLLECTION)
                }
                collection.berliozCollection('add')
            })
        .off(Event.CLICK_DELETE, Selector.DATA_DELETE)
        .on(Event.CLICK_DELETE,
            Selector.DATA_DELETE,
            (event) => {
                $(event.currentTarget)
                    .parents(Selector.COLLECTION)
                    .berliozCollection('delete', $(event.currentTarget).parents(Selector.COLLECTION_KEY))
            })
})($)

export default BerliozCollection
