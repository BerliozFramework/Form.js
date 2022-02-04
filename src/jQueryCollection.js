import NativeCollection from "./Collection";

class Collection extends NativeCollection {
    constructor(target, config) {
        if (target instanceof jQuery) {
            target = target.get(0);
        }

        super(target, config);
    }
}

const _jQueryInterface = (action, arg1) => {
    this.each(function () {
        let collectionObj = $(this).data('collection-object');

        if (!(collectionObj instanceof Collection)) {
            $(this).data('collection-object', collectionObj = new Collection($(this).get(0)));
        }

        switch (action) {
            case 'add':
                collectionObj.add();
                break;
            case 'delete':
                collectionObj.remove($(arg1).get(0));
                break;
        }
    })
}

$.fn.berliozCollection = _jQueryInterface;
$.fn.berliozCollection.noConflict = function () {
    return _jQueryInterface;
};

export default Collection;
