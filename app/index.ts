import { RecordController } from "./recordController";
import { ApplicationContext } from "./applicationContext";
import { bindRecord } from './recordBinder';
import { inbox } from "file-transfer";
import * as fs from "fs";
import { TaskController } from './taskController';
import { app } from 'peer';
import { bindTask } from './taskBinder';
import { DeviceContext } from './deviceContext';

let device = new DeviceContext();
let appContext = new ApplicationContext(device);
let recordController = new RecordController(appContext);
let taskController = new TaskController(appContext);

bindRecord(appContext, recordController);
bindTask(appContext, taskController);
