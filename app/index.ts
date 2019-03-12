import { RecordController } from "./recordController";
import { ApplicationContext } from "./applicationContext";
import { bindRecord } from './recordBinder';
import { inbox } from "file-transfer";
import * as fs from "fs";
import { TaskController } from './taskController';
import { app } from 'peer';
import { bindTask } from './taskBinder';


let appContext = new ApplicationContext();
let recordController = new RecordController(appContext);
let taskController = new TaskController(appContext);

bindRecord(appContext, recordController);
bindTask(appContext, taskController);
