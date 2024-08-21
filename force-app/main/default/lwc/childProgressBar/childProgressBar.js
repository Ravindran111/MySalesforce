import { LightningElement,api } from 'lwc';

export default class ChildProgressBar extends LightningElement {
    progress=0;
    intervalId;
    @api start(){
       this.intervalId=setInterval(()=>{
            this.progress+=10;
             },1000)
    }
    @api stop()
     {
        clearInterval(this.intervalId);
        console.log("stop");
    }
    @api reset(){
        this.progress=0;
    }
}