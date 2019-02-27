import clock from "clock";
import { display } from "display";
import * as document from "document";
import { ApplicationContext } from './applicationContext';



export class RecordController {

    private startTime: Date;
    private isRunning: boolean;
    private isSleeping: boolean;
    private ElapsedTime: number;

    private static MinuteUnit: string = "min";

    constructor(private appContext: ApplicationContext) {

        //read from storage.
        this.isRunning = false;
        this.ElapsedTime = 0;

        this.updateElaspedTime("0", RecordController.MinuteUnit);
    }

    public update() {

        if (!this.isRunning)
            return;

        var elapsed = this.calculateElapsedTime();
        var current = elapsed + this.ElapsedTime;
        var inMinutes = this.toMinutes(current)

        this.updateElaspedTime(inMinutes.toString(), RecordController.MinuteUnit);

        console.log(this.toDebug());
    }

    public start() {
        this.isRunning = true;
        this.startTime = new Date();

        this.update();
        console.log("Started." + this.toDebug());
    }

    public pause() {

        this.ElapsedTime += this.calculateElapsedTime();
        this.isRunning = false;

        this.update();
        console.log("Paused." + this.toDebug());
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
        return "Is running: " + this.isRunning + " Elapsed-Total: " + this.ElapsedTime + " Start-Time: " + this.startTime;
    }

}


