import { LightningElement } from 'lwc';

export default class ParentProgressBar extends LightningElement {
    handlestart(event)
    {
        //this.template.querySelector('c-child-progress-bar').start();-->instide of using this.ref
        this.refs.clickstop.disabled=false;
        this.refs.clickreset.disabled=false;
        this.refs.child.start(); 
    }
    handlestop(event)
    {
        this.refs.child.stop();
    }
    handlereset(event)
    {
        this.refs.child.reset();
    }
}