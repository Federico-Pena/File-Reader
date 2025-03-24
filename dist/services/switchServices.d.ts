export declare const CHUNK_SIZE = 5000;
export declare const splitText: (text: string, chunkSize: number) => string[];
declare const switchServices: (mimetype: string, dataBuffer: Buffer, sendPage: (data: Data[]) => void) => Promise<void>;
export { switchServices };
