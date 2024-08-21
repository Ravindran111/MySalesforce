import { LightningElement, api } from 'lwc';

export default class ChildToParentChild extends LightningElement {
    modalvisibility;
    selectedarray=[];
    handlecancel(event){
        
        this.dispatchEvent(new CustomEvent('canceling',{detail:this.selectedarray}));

    }
    handletaj(event){
        if(this.template.querySelector(".taj").checked==true){
        
    this.selectedarray.push(this.template.querySelector(".taj").label);
        }
    
   
    }
    handlelotus(event){
        if(this.template.querySelector(".lotus").checked==true)
        this.selectedarray.push(this.template.querySelector(".lotus").label);
   
    }
    handleagra(event){
        if(this.template.querySelector(".agra").checked==true)
        this.selectedarray.push(this.template.querySelector(".agra").label);
       
    }

    
}