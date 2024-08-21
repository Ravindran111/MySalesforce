import { LightningElement,api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class RecordFormDemo extends LightningElement {
    @api objectApiName;
    @api recordId;
       
    handleSuccess(event)
    {

    }
}