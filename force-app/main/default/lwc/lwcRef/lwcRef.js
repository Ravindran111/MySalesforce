import { LightningElement } from 'lwc';

export default class LwcRef extends LightningElement {
    age;
    name;
    handleName(event){
        this.name=event.target.value;
        this.refs.refinputreq.required=true;
    }
    handleAgeChange(event)
    {
        this.age=event.target.value;
    }
    handleEligiblityClick(event)
    {
       if(this.age>18)
       {
        this.refs.refEligible.innerHTML="<b>Eligible for DRIVING!!!...</b>"
        this.refs.refjoinbutton.disabled=false;
        //console.log( this.refs.refEligible.innerText);
       }
       else
       {
         this.refs.refEligible.innerHTML="<b>NOT Eligible for DRIVING!!!....</b>"
         this.refs.refjoinbutton.disabled=true;
       }
    }
    handlejoinschool(event)
    {
        alert(`WELCOME!!! ${this.name} to join our Driving School `);
    }
}