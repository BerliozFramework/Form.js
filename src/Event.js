const triggerEvent = (type, element, args) => {
    const event = new CustomEvent(type, {cancelable: true})

    if (args) {
        Object.keys(args)
            .forEach((key) => Object.defineProperty(event,
                key,
                {
                    get() {
                        return args[key]
                    }
                }));
    }

    element.dispatchEvent(event);

    return event;
};

export default triggerEvent;
