import { runMyApp } from "./main";
import {  RecordController } from "./recordController";
import {  ApplicationContext } from "./applicationContext";
import { bindRecord } from './recordBinder';

runMyApp();
let appContext = new ApplicationContext();
let recordController = new RecordController(appContext);

bindRecord( appContext, recordController);
