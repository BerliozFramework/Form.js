import triggerEvent from "./Event";

const Event = {
    ADD: 'add.collection.berlioz',
    ADDED: 'added.collection.berlioz',
    DELETE: 'delete.collection.berlioz',
    DELETED: 'deleted.collection.berlioz',
    MIN: 'min.collection.berlioz',
    MAX: 'max.collection.berlioz',
    CLICK_ADD: 'click.add.collection.berlioz',
    CLICK_DELETE: 'click.delete.collection.berlioz'
};

const Selector = {
    DATA_ADD: '[data-add="collection"]',
    DATA_REMOVE: '[data-delete="collection"]',
    COLLECTION: '[data-collection]',
    COLLECTION_KEY: '[data-collection-key]'
};

const Default = {
    min: 0,
    max: -1,
    prototype: null,
    prototypePlaceholder: 'name',
};

class Collection {
    constructor(target, config) {
        this._target = target;
        this._config = {
            ...Default,
            ...this._configFromData(target),
            ...config,
        };
        this._config.min = parseInt(this._config.min);
        this._config.max = parseInt(this._config.max);
        this._index = parseInt(this.lastItem ? this.lastItem.dataset.collectionKey || -1 : -1);

        this._target._collection = this;
    }

    _configFromData(element) {
        let config = {};

        Object.keys(Default).forEach(function (key) {
            let keyData = 'collection' + key.substring(0, 1).toUpperCase() + key.substring(1);

            if (element.dataset.hasOwnProperty(keyData)) {
                config[key] = element.dataset[keyData];
            }
        });

        return config;
    }

    get target() {
        return this._target;
    }

    get config() {
        return this._config;
    }

    get items() {
        return Array.from(this.target.querySelectorAll(Selector.COLLECTION_KEY))
            .filter((element) => element.closest(Selector.COLLECTION) === this.target);
    }

    get index() {
        return this._index;
    }

    get firstItem() {
        return this.items[0] || null;
    }

    get lastItem() {
        const items = this.items;

        return items[items.length - 1] || null;
    }

    add() {
        if (!this.config.prototype) {
            console.warn('No prototype declared for collection, unable to add item');
            return;
        }

        if (this.isFull()) {
            return;
        }

        let tpl = document.createElement('div');
        tpl.dataset.collectionKey = (++this._index).toString();
        tpl.innerHTML = this.config.prototype.replace(new RegExp('___' + this.config.prototypePlaceholder + '___', 'g'), this._index);

        // ADD event
        let event = triggerEvent(Event.ADD, this.target, {collection: this});

        if (!event.defaultPrevented) {
            // Insert after last element or to the end
            if (this.lastItem) {
                this.lastItem.after(tpl);
            } else {
                this.target.append(tpl);
            }

            triggerEvent(Event.ADDED, this.target, {relatedTarget: tpl, collection: this});
        }

        return tpl;
    }

    remove(element) {
        // If the element doesn't have the key attribute, it may be a child element of the item, so we try to get
        // the item base element from its parents
        if (!element.matches(Selector.COLLECTION_KEY)) {
            if (!(element = element.closest(Selector.COLLECTION_KEY))) {
                if (element.closest(Selector.COLLECTION) !== this.target) {
                    console.warn('Try to remove a non item');
                    return;
                }
            }
        }

        // DELETE event
        let event = triggerEvent(Event.DELETE, this.target, {relatedTarget: element, collection: this});

        if (this.isMin()) {
            return;
        }

        if (!event.defaultPrevented) {
            element.parentNode.removeChild(element);
            triggerEvent(Event.DELETED, this.target, {relatedTarget: element, collection: this});
        }

        return element;
    }

    isMin() {
        if (this.config.min > -1 && this.config.min >= this.items.length) {
            triggerEvent(Event.MIN, this.target, {relatedTarget: this.target, collection: this});
            return true;
        }

        return false;
    }

    isFull() {
        if (this.config.max > -1 && this.config.max <= this.items.length) {
            triggerEvent(Event.MAX, this.target, {relatedTarget: this.target, collection: this});
            return true;
        }

        return false;
    }
}


// Events
document.addEventListener('click', (event) => {
    let button = event.target.closest(Selector.DATA_ADD);
    if (!button) {
        return;
    }

    let collection;
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
document.addEventListener('click', (event) => {
    let button = event.target.closest(Selector.DATA_REMOVE);
    if (!button) {
        return;
    }

    let collectionItem = button.closest(Selector.COLLECTION_KEY);

    if (collectionItem) {
        let collection = collectionItem.closest(Selector.COLLECTION);

        if (collection && collection._collection) {
            collection._collection.remove(collectionItem);
        }
    }
});

export default Collection;
