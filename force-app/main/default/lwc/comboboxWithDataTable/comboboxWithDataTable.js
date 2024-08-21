import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
//import sendEmailWithAttachment from '@salesforce/apex/comboboxWithDataTableClass.sendEmailWithAttachment';
//import generatePDFAttachment from '@salesforce/apex/comboboxWithDataTableClass.generatePDFAttachment';

export default class BudgetPlanPDFGenerator extends NavigationMixin(LightningElement) {


    value = "";
options = [
	{label: "--None--", value: ""},
	{label: "Call", value: "Call"},
	{label: "Email", value: "Email"},
	{label: "Message", value: "Message"},
	{label: "Task", value: "Task"},
	{label: "Visit", value: "Visit"},
	{label: "Other", value: "Other"},
];

handleChange(event) {
	this.value = event.detail.value;
	console.log(this.value);
}
    email = '';

    handleChange(event) {
        if (event.target.name === 'emailAddress') {
            this.email = event.target.value;
        }
    }

    async sendEmailHandler() {
        try {
            const attachmentBody = await generatePDFAttachment();
            sendEmailWithAttachment({
                toAddress: [this.email],
                subject: 'Budget Plan PDF',
                body: 'Please find the attached Budget Plan PDF',
                attachmentBody: attachmentBody,
                attachmentName: 'BudgetPlan.pdf'
            });
            console.log('Email sent with PDF attachment');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}
