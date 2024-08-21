import { LightningElement } from 'lwc';

export default class ChildToParentParent extends LightningElement {
    monumentstrue;
    receivedarrayofmonuments=[];
  //  display;
    monuments(event){
        
       this.monumentstrue=true;

    }
    handlecanceling(event){
        this.monumentstrue=false;
        this.receivedarrayofmonuments=event.detail;
       
    }
    get display(){
      
      return this.receivedarrayofmonuments.length>0;
      
    }
    
}