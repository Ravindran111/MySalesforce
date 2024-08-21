import { LightningElement } from 'lwc';

export default class ParentSlider extends LightningElement {
    currentSliderValue;
    handleSliderChange(event)
    {
        this.currentSliderValue=event.target.value;
        console.log(this.currentSliderValue);
    }
}