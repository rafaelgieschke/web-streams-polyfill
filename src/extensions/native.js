function IsStreamConstructor(ctor) {
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
export const NativeWritableStream = typeof WritableStream === 'function' ? ReadableStream : undefined;
export const NativeTransformStream = typeof TransformStream === 'function' ? TransformStream : undefined;

export const IsReadableStreamConstructor = IsStreamConstructor;
export const IsWritableStreamConstructor = IsStreamConstructor;
export const IsTransformStreamConstructor = IsStreamConstructor;

export const HasNativeReadableStreamConstructor = IsReadableStreamConstructor(NativeReadableStream);
export const HasNativeWritableStreamConstructor = IsWritableStreamConstructor(NativeWritableStream);
export const HasNativeTransformStreamConstructor = IsTransformStreamConstructor(NativeTransformStream);
