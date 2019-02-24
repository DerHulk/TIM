import clock from "clock";
import { display } from "display";
import { RecordController } from "./recordController"
import * as document from "document";

export function bind(controller:RecordController){

    clock.granularity = "seconds";
    clock.ontick = (evt) => this.onTick(evt);

    display.onchange = (evt) => 
    {    
        if (display.on)
            controller.update();
    };

    let playButton = document.getElementById("playButton");
    let pauseButton = document.getElementById("pauseButton");

    playButton.onactivate = (evt) => controller.start();
    pauseButton.onactivate = (evt) => controller.pause();

}