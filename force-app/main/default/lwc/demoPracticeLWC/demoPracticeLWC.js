import { LightningElement,track } from 'lwc';

export default class DemoPracticeLWC extends LightningElement {

   @track course=["Admin","Apex","LWC","Trigger",];
    newcourse;
    handlerchange(event)
    {
       this.newcourse=event.target.value;
    }
    handlerclick(event)
    {
        JSON.stringify(this.course.push(this.newcourse));
    }
   get isArray()
   {
    return this.course.length>0
   }
}