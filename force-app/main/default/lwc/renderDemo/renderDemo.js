import { LightningElement } from 'lwc';
import enrollment from './enrollmentTemplate.html';
import alumni from './alumniTemplate.html';
import render from './renderDemo.html';

export default class RenderDemo extends LightningElement {

     ChosenTemplate;

    render()
    {
        return this.ChosenTemplate==='NewEnrollment'?enrollment:
                this.ChosenTemplate==='Alumni'?alumni:render;
    }
    handleClick(event)
    {
        this.ChosenTemplate= event.target.label;
    }
}