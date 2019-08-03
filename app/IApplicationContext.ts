import { IEventEmitter } from './IEventEmitter';
import { TaskEntity } from '../common/taskEntity';
import { IDeviceContext } from './IdeviceContext';

export interface IApplicationContext {
    Emitter: IEventEmitter;
    ReadTaskFile(): Array<TaskEntity>;
    WriteTaskFile(toWrite: Array<TaskEntity>): void;
    device: IDeviceContext;
}