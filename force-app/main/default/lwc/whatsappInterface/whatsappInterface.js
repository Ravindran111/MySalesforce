import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import CASE_OBJECT from '@salesforce/schema/Case';
import DESCRIPTION_FIELD from '@salesforce/schema/Case.Description';
import CONTACT_ID_FIELD from '@salesforce/schema/Case.ContactId';

export default class ContactChat extends LightningElement {
    @track message = '';
    @track messages = [];

    handleInputChange(event) {
        this.message = event.target.value;
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') {
            this.handleSendMessage();
        }
    }

    handleSendMessage() {
        if (this.message.trim() === '') return;

        // Create new case record
        const fields = {};
        fields[DESCRIPTION_FIELD.fieldApiName] = this.message;
        fields[CONTACT_ID_FIELD.fieldApiName] = 'CONTACT_ID'; // Replace with actual Contact ID
        const recordInput = { apiName: CASE_OBJECT.objectApiName, fields };

        createRecord(recordInput)
            .then((caseRecord) => {
                this.messages.push({ id: caseRecord.id, text: this.message, class: 'sent' });
                this.message = '';
                this.scrollToBottom();
            })
            .catch((error) => {
                console.error('Error creating case: ', error);
            });
    }

    scrollToBottom() {
        const chatWindow = this.template.querySelector('.chat-window');
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
}
