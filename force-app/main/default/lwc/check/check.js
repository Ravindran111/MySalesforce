import { LightningElement, wire, track } from 'lwc';
import getBudgetPlans from '@salesforce/apex/BudgetPlanController.getBudgetPlans';
import getBudgetPlanForCombobox from '@salesforce/apex/comboboxWithDataTableClass.getBudgetPlanForCombobox';
import BudgetPlanAllocation from '@salesforce/apex/comboboxWithDataTableClass.BudgetPlanAllocation';
import sendEmailWithAttachment from '@salesforce/apex/comboboxWithDataTableClass.sendEmailWithAttachment';
import generatePDFAttachment from '@salesforce/apex/comboboxWithDataTableClass.generatePDFAttachment';

const columns = [
    { label: 'Budget Plan Name', fieldName: 'Name', type: 'text' },
    { label: 'Start Date', fieldName: 'StartDate', type: 'date' },
    { label: 'End Date', fieldName: 'EndDate', type: 'date' },
    { label: 'Total Amount', fieldName: 'TotalAmount', type: 'currency' },
    { label: 'Status', fieldName: 'Status', type: 'text' },
    { label: 'Budget Plan Allocation Name', fieldName: 'BudgetAllocationName', type: 'text'},
    { label: 'Number of Budget Allocation', fieldName: 'NumberofBudgetAllocation', type: 'text'}
];

const column = [
    {label : 'Name', fieldName : 'Name'},
    {label : 'Budget Plan', fieldName : 'Budget_PlanId__c'},
];

export default class DisplayBudgetPlans extends LightningElement {
    columns = columns;
    @track data = [];
    @track originalData = [];
    @track value = '';
    @track optionsArray = [{ label: '--None of these--', value: '--None of these--' }]; // Added None option
    @track cardvisible = false;
    @track column = column;
    email = '';
    @track selectedBudgetPlan = '--None of these--'; // Set default selected value

    @wire(getBudgetPlans)
    wiredDataResult({ error, data }) {
        if (data) {
            this.data = data.map(budgetWrapper => ({
                Id: budgetWrapper.Budget.Id,
                Name: budgetWrapper.Name,
                StartDate: budgetWrapper.StartDate,
                EndDate: budgetWrapper.EndDate,
                TotalAmount: budgetWrapper.TotalAmount,
                Status: budgetWrapper.Status,
                BudgetAllocationName: budgetWrapper.BudgetAllocationName,
                NumberofBudgetAllocation: budgetWrapper.NumberofBudgetAllocation
            }));
            this.originalData = this.data;
        } else if (error) {
            console.error('Error fetching Budget and Budget plan Allocation data', error);
        }
    }

    handleSearch(event) {
        const searchKey = event.target.value.toLowerCase();
        this.data = this.originalData.filter(row => row.Name.toLowerCase().includes(searchKey));
    }

    get options(){
        return this.optionsArray;
    }

    connectedCallback(){
        getBudgetPlanForCombobox()
        .then(response=>{
            let arr =[];
            for(var i=0; i<response.length; i++){
                arr.push({label : response[i].Name , value : response[i].Id})
            }
            this.optionsArray = this.optionsArray.concat(arr); // Adding the fetched options to None option
            console.log('Arr--->',arr);
        })
        .catch(error => {
            console.error('Error fetching budget plans:', error);
        });
    }

    handleChangedValue(event){
        this.value = event.detail.value;
        if(this.value !='--None of these--'){
            this.cardvisible=true;
            this.data = this.originalData;
        
        BudgetPlanAllocation({ selectedBudgetplanId : this.value})
        .then( result =>{
            this.data = result;
        })
        .catch( error=>{
            window.alert("Error:-->"+error);
        });
    }
    else{
        this.cardvisible=false;
    }
}


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
