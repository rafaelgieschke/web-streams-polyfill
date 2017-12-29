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

export function IsReadableStreamConstructor(ctor) {
  if (!IsStreamConstructor(ctor)) {
    return false;
  }
  try {
    new ctor().getReader();
  } catch (e) {
    return false;
  }
  return true;
}

export function IsWritableStreamConstructor(ctor) {
  if (!IsStreamConstructor(ctor)) {
    return false;
  }
  try {
    new ctor().getWriter();
  } catch (e) {
    return false;
  }
  return true;
}

export function IsTransformStreamConstructor(ctor) {
  if (!IsStreamConstructor(ctor)) {
    return false;
  }
  try {
    new ctor().readable.getReader();
  } catch (e) {
    return false;
  }
  return true;
}

export const HasNativeReadableStreamConstructor = IsReadableStreamConstructor(NativeReadableStream);
export const HasNativeWritableStreamConstructor = IsWritableStreamConstructor(NativeWritableStream);
export const HasNativeTransformStreamConstructor = IsTransformStreamConstructor(NativeTransformStream);
