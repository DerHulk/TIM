import clock from "clock";
import { display } from "display";
import * as document from "document";
import { ApplicationContext } from './applicationContext';
import { TaskEntity } from '../common/taskEntity';



export class RecordController {

    private currentTask: TaskEntity;
    private startTime: Date;
    private isRunning: boolean;
    private isSleeping: boolean;        

    private static MinuteUnit: string = "min";

    constructor(private appContext: ApplicationContext) {

        //read from storage.
        this.isRunning = false;        

        this.updateElaspedTime("0", RecordController.MinuteUnit);

        appContext.Emitter.add(ApplicationContext.OnTaskSelected, (task:TaskEntity) => {
            this.applyItem(task);
          });
    }

    public update() {
    
        if (!this.isRunning || !this.currentTask)
            return;

        var elapsed = this.calculateElapsedTime();
        var current = elapsed + this.currentTask.timeInMs;
        var inMinutes = this.toMinutes(current)

        this.updateElaspedTime(inMinutes.toString(), RecordController.MinuteUnit);

        console.log(this.toDebug());
    }

    public start() {

        if(!this.currentTask)
            return;

        this.isRunning = true;
        this.startTime = new Date();

        this.update();
        console.log("Started." + this.toDebug());
    }

    public pause() {

        if(!this.currentTask)
            return;

        this.currentTask.timeInMs += this.calculateElapsedTime();
        this.isRunning = false;        

        this.update();
        console.log("Paused." + this.toDebug());
    }

    public hasTask():boolean{
        return this.currentTask ? true : false;
    }

    private calculateElapsedTime(): number {
        return (new Date().getTime() - this.startTime.getTime());
    }

    private updateElaspedTime(elapsedMinutes: string, timeUnit: string) {
        var newValue = this.padLeft(elapsedMinutes, 5) + timeUnit;
        
        this.appContext.Emitter.emit(ApplicationContext.OnUpdateElapseTime, newValue);
    }

    private padLeft(n: string, width: number) {
        var z = '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    private toMinutes(millisconds: number) {
        return Math.floor(millisconds / 1000 / 60);
    }

    private toDebug(): string {
        return "Is running: " + this.isRunning + " Elapsed-Total: " + this.currentTask.timeInMs + " Start-Time: " + this.startTime;
    }

    private applyItem(task:TaskEntity){

        if(!task.timeInMs) {
            task.timeInMs = 0;           
        }
                    
        this.currentTask = task;        
        var inMinutes = this.toMinutes(task.timeInMs);

        this.updateElaspedTime(inMinutes.toString(), RecordController.MinuteUnit);
    }
}


