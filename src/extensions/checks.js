function isStreamConstructor(ctor) {
    if (typeof ctor !== 'function') {
        return false;
    }
    let startCalled = false;
    try {
        new ctor({
            start() {
                startCalled = true;
            }
        });
    } catch (e) {
        // ignore
    }
    return startCalled;
}

export function isReadableStreamConstructor(ctor) {
    if (!isStreamConstructor(ctor)) {
        return false;
    }
    try {
        new ctor().getReader();
    } catch (e) {
        return false;
    }
    return true;
}

export function isWritableStreamConstructor(ctor) {
    if (!isStreamConstructor(ctor)) {
        return false;
    }
    try {
        new ctor().getWriter();
    } catch (e) {
        return false;
    }
    return true;
}

export function isTransformStreamConstructor(ctor) {
    if (!isStreamConstructor(ctor)) {
        return false;
    }
    try {
        new ctor().readable.getReader();
    } catch (e) {
        return false;
    }
    return true;
}
