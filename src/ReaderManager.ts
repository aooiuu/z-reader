import { EventEmitter } from 'events';

class ReaderManager extends EventEmitter {}

export const readerManager: ReaderManager = new ReaderManager();
