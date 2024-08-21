import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import CASE_OBJECT from '@salesforce/schema/Case';
import DESCRIPTION_FIELD from '@salesforce/schema/Case.Description';
import CONTACT_ID_FIELD from '@salesforce/schema/Case.ContactId';

export default class ContactChat extends LightningElement {
    @track message = '';
    @track whatsappMessages = [];
    @track facebookMessages = [];
    @track instagramMessages = [];
    @track currentPlatform = 'WhatsApp'; // Default platform

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

        const userMessage = this.message;
        const timestamp = new Date().toLocaleTimeString(); // Get current time

        // Create new case record
        const fields = {};
        fields[DESCRIPTION_FIELD.fieldApiName] = userMessage;
        fields[CONTACT_ID_FIELD.fieldApiName] = 'CONTACT_ID'; // Replace with actual Contact ID
        const recordInput = { apiName: CASE_OBJECT.objectApiName, fields };

        // Optimistically add the message to the chat window
        const messageId = 'msg_' + new Date().getTime();
        const message = { id: messageId, text: userMessage, time: timestamp, class: 'sent' };

        if (this.currentPlatform === 'WhatsApp') {
            this.whatsappMessages.push(message);
        } else if (this.currentPlatform === 'Facebook') {
            this.facebookMessages.push(message);
        } else if (this.currentPlatform === 'Instagram') {
            this.instagramMessages.push(message);
        }

        this.message = '';
        this.scrollToBottom();

        // Create record in Salesforce
        createRecord(recordInput)
            .then((caseRecord) => {
                // Optionally, update the message ID if needed
                const messageIndex = this[this.getCurrentMessagesArray()].findIndex(msg => msg.id === messageId);
                if (messageIndex !== -1) {
                    this[this.getCurrentMessagesArray()][messageIndex].id = caseRecord.id;
                }
                // Simulate a reply after 1 second
                setTimeout(() => {
                    const replyTimestamp = new Date().toLocaleTimeString();
                    const replyMessage = { id: 'reply_' + caseRecord.id, text: 'Reply to: ' + userMessage, time: replyTimestamp, class: 'received' };
                    if (this.currentPlatform === 'WhatsApp') {
                        this.whatsappMessages.push(replyMessage);
                    } else if (this.currentPlatform === 'Facebook') {
                        this.facebookMessages.push(replyMessage);
                    } else if (this.currentPlatform === 'Instagram') {
                        this.instagramMessages.push(replyMessage);
                    }
                    this.scrollToBottom();
                }, 1000);
            })
            .catch((error) => {
                console.error('Error creating case: ', error);
                // Optionally, remove the optimistically added message or show an error state
            });
    }

    scrollToBottom() {
        const chatWindow = this.template.querySelector('.chat-window');
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    getCurrentMessagesArray() {
        return this.currentPlatform.toLowerCase() + 'Messages';
    }
}
