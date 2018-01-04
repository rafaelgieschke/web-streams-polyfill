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

export const NativeReadableStream = typeof ReadableStream === 'function' ? ReadableStream : undefined;
export const NativeWritableStream = typeof WritableStream === 'function' ? WritableStream : undefined;
export const NativeTransformStream = typeof TransformStream === 'function' ? TransformStream : undefined;

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

export const hasNativeReadableStreamConstructor = isReadableStreamConstructor(NativeReadableStream);
export const hasNativeWritableStreamConstructor = isWritableStreamConstructor(NativeWritableStream);
export const hasNativeTransformStreamConstructor = isTransformStreamConstructor(NativeTransformStream);
