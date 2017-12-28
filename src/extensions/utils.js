export function GetBYOBOrDefaultReader(readable) {
  try {
    const reader = readable.getReader({ mode: 'byob' });
    return { reader, mode: 'bytes' };
  } catch (e) {
    const reader = readable.getReader();
    return { reader, mode: undefined };
  }
}
