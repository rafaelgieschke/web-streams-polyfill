import {
  ReadableStream as IReadableStream, ReadableStreamBYOBReader, ReadableStreamDefaultReader,
  ReadableStreamPipeOptions, ReadableStreamUnderlyingSource
} from './spec/readable-stream';
import {
  WritableStream as IWritableStream, WritableStreamDefaultWriter,
  WritableStreamUnderlyingSink
} from './spec/writable-stream';
import { TransformStream as ITransformStream, TransformStreamTransformer } from './spec/transform-stream';
import { QueuingStrategy } from './spec/queuing-strategy';

export declare class ReadableStream implements IReadableStream {

  constructor(underlyingSource?: ReadableStreamUnderlyingSource, queuingStrategy?: Partial<QueuingStrategy>);

  readonly locked: boolean;

  cancel(reason: any): Promise<void>;

  getReader(options: { mode: 'byob' }): ReadableStreamBYOBReader;
  getReader(options?: { mode?: string }): ReadableStreamDefaultReader;

  pipeThrough(pair: ReadableWritableStreamPair, options?: ReadableStreamPipeOptions): ReadableStream;

  pipeTo(dest: WritableStream, options?: ReadableStreamPipeOptions): Promise<void>;

  tee(): [ReadableStream, ReadableStream];

  // region Extensions

  static fromNative(readable: IReadableStream, queuingStrategy?: Partial<QueuingStrategy>): ReadableStream;

  static toNative(readable: IReadableStream, queuingStrategy?: Partial<QueuingStrategy>): IReadableStream;

  // endregion

}

interface ReadableWritableStreamPair {
  readonly readable: ReadableStream;
  readonly writable: WritableStream;
}

export declare class WritableStream implements IWritableStream {

  constructor(underlyingSink?: WritableStreamUnderlyingSink, queuingStrategy?: Partial<QueuingStrategy>);

  readonly locked: boolean;

  abort(reason: any): Promise<void>;

  getWriter(): WritableStreamDefaultWriter;

  // region Extensions

  static fromNative(readable: IWritableStream, queuingStrategy?: Partial<QueuingStrategy>): WritableStream;

  static toNative(readable: IWritableStream, queuingStrategy?: Partial<QueuingStrategy>): IWritableStream;

  // endregion

}

export declare class CountQueuingStrategy implements QueuingStrategy {

  constructor(options: { highWaterMark?: number });

  readonly highWaterMark: number;

  size(chunk: any): number;

}

export declare class ByteLengthQueuingStrategy implements QueuingStrategy {

  constructor(options: { highWaterMark?: number });

  readonly highWaterMark: number;

  size(chunk: ArrayBufferView): number;
}


export declare class TransformStream implements ITransformStream {

  constructor(transformer?: TransformStreamTransformer,
              writableStrategy?: Partial<QueuingStrategy>,
              readableStrategy?: Partial<QueuingStrategy>);

  readonly readable: ReadableStream;
  readonly writable: WritableStream;

}
