import clock from "clock";
import { display } from "display";
import * as document from "document";



export class RecordController {

    private startTime: Date;
    private isRunning: boolean;    
    private isSleeping: boolean;
    private ElapsedTime: number;

    private static MinuteUnit: string = "min";

    constructor() {

        //read from storage.
        this.isRunning = false;        
        this.ElapsedTime = 0;

        clock.granularity = "seconds";
        clock.ontick = (evt) => this.onTick(evt);

        display.onchange = (evt) => 
        {
            if(!this.isRunning)
                return;

            if (display.on)
                this.onTick(null);
        };

        let playButton = document.getElementById("playButton");
        let pauseButton = document.getElementById("pauseButton");

        playButton.onactivate = (evt) => this.start();
        pauseButton.onactivate = (evt) => this.pause();

        this.updateElaspedTime("0", RecordController.MinuteUnit);
    }

    private onTick(evt: TickEvent) {

        if (!this.isRunning)
            return;

        var elapsed = this.calculateElapsedTime();
        var current = elapsed + this.ElapsedTime;
        var inMinutes = this.toMinutes(current)

        this.updateElaspedTime(inMinutes.toString(), RecordController.MinuteUnit);

        console.log(this.toDebug());
    }

    public update() {
        
        var elapsed = this.calculateElapsedTime();
        var current = elapsed + this.ElapsedTime;
        var inMinutes = this.toMinutes(current)

        this.updateElaspedTime(inMinutes.toString(), RecordController.MinuteUnit);

        console.log(this.toDebug());
    }

    public start() {
        this.isRunning = true;
        this.startTime = new Date();

        this.onTick(null);
        console.log("Started." + this.toDebug());
    }

    public pause() {

        this.ElapsedTime += this.calculateElapsedTime();        
        this.isRunning = false;

        this.onTick(null);
        console.log("Paused." + this.toDebug());
    }

    private calculateElapsedTime() : number{
        return (new Date().getTime() - this.startTime.getTime());
    }

    private updateElaspedTime(elapsedMinutes: string, timeUnit: string) {
        let mixedtext = document.getElementById("mixedtext");
        mixedtext.text = this.padLeft(elapsedMinutes, 5) + timeUnit;

        let body = mixedtext.getElementById("copy");
        body.text = "This is the body text";
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
        return "Is running: " + this.isRunning + " Elapsed-Total: " + this.ElapsedTime + " Start-Time: " + this.startTime ;
    }


}


