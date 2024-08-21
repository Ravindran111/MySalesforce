// budgetPlanAllocationTable.js
import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getBudgetPlanAllocations from '@salesforce/apex/BudgetPlanAllocationController.getBudgetPlanAllocations';
import approveRecord from '@salesforce/apex/BudgetPlanAllocationController.approveRecord';
import rejectRecord from '@salesforce/apex/BudgetPlanAllocationController.rejectRecord';
import sendEmailWithAttachment from '@salesforce/apex/BudgetPlanAllocationController.sendEmailWithAttachment';
import { refreshApex } from '@salesforce/apex';
const COLUMNS = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Emirates', fieldName: 'Emirates__c', type: 'text' },
    { label: 'Requested Amount', fieldName: 'Requested_Amount__c', type: 'number' },
    { label: 'Status', fieldName: 'Status__c', type: 'text' },
    { label: 'Budget Plan Name', fieldName: 'Budget_Plan_Name' },
    {
        type: 'button', label: 'Approve', typeAttributes: {
            label: '✔',
            name: 'approve',
            title: 'Approve',
            disabled: false,
            value: 'approve',
        },
        cellAttributes: { alignment: 'center' }
    },
    {
        type: 'button', label: 'Reject', typeAttributes: {
            label: '❌',
            name: 'reject',
            title: 'Reject',
            disabled: false,
            value: 'reject',
        },
        cellAttributes: { alignment: 'center' }
    }
];

const PAGE_SIZE = 5;

export default class BudgetPlanAllocationTable extends LightningElement {
    @track data = [];
    @track filteredData = [];
    @track pagedData = [];
    @track emailAddress = '';
    @track selectedBudgetPlan = '';
    @track budgetPlanOptions = [];
    columns = COLUMNS;
    @track currentPage = 1;
    @track totalPages = 1;
    @track recordCount = '5';
    wiredBudget;

    @wire(getBudgetPlanAllocations)
    wiredBudgetPlanAllocations(result) {
        this.wiredBudget = result;
        if (result.data) {
            this.data = result.data.map(record => ({
                Id: record.Id,
                Name: record.Name,
                Emirates__c: record.Emirates__c,
                Requested_Amount__c: record.Requested_Amount__c,
                Status__c: record.Status__c,
                Budget_Plan_Name: record.Budget_PlanId__r.Name
            }));
            this.filteredData = this.data;
            this.totalPages = Math.ceil(this.filteredData.length / PAGE_SIZE);
            this.currentPage = 1;
            this.paginateData();

            // Update the budget plan options
            this.budgetPlanOptions = [{ label: '--All--', value: '' }];
            const budgetPlanNames = new Set(this.data.map(record => record.Budget_Plan_Name));
            budgetPlanNames.forEach(name => {
                this.budgetPlanOptions.push({ label: name, value: name });
            });
        } else if (result.error) {
            console.error('Error retrieving Budget Plan Allocations: ', result.error);
        }
    }

    get isPrevDisabled() {
        return this.currentPage === 1;
    }

    get isNextDisabled() {
        return this.currentPage === this.totalPages;
    }

    handlePageNextAction() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.paginateData();
        }
    }
     
    handlePagePrevAction() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.paginateData();
        }
    }

    paginateData() {
        const startIndex = (this.currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        this.pagedData = this.filteredData.slice(startIndex, endIndex);
    }

    handleDownload(){
        let downloadRecords = [...this.data];
        this.createCsvForDownload(downloadRecords);
    }

    createCsvForDownload(downloadRecords){
        let csvHeader = Object.keys(downloadRecords[6]).join(',');
        let csvBody = downloadRecords.map(row => {
            let rowValues = Object.values(row).map(cell => {
                if (cell === null || cell === undefined || cell === "") {
                    return '';
                } else if (typeof cell === 'string' && cell.includes(',')) {
                    return `"${cell}"`;
                } else {
                    return cell;
                }
            }).join(',');
            return rowValues;
        }).filter(row => row !== '').join('\n');
    
        let csv = csvHeader + '\n' + csvBody;
        this.downloadCsv(csv);
    }
    
    
    downloadCsv(csv){
        let hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'BudgetPlanAllocation.csv';
        hiddenElement.click();
    }

    handleChange(event) {
        this.emailAddress = event.target.value;
    }

    handleBudgetPlanChange(event) {
        this.selectedBudgetPlan = event.detail.value;
        this.filterData();
    }

    filterData() {
        if (this.selectedBudgetPlan === '') {
            this.filteredData = this.data;
        } else {
            this.filteredData = this.data.filter(record => record.Budget_Plan_Name === this.selectedBudgetPlan);
        }
        this.totalPages = Math.ceil(this.filteredData.length / PAGE_SIZE);
        this.currentPage = 1;
        this.paginateData();
    }

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;

        switch (action.name) {
            case 'approve':
                this.approveRecord(row.Id);
                break;
            case 'reject':
                this.rejectRecord(row.Id);
                break;
            default:
                break;
        }
    }

    approveRecord(recordId) {
        approveRecord({ recordId: recordId })
            .then(result => {
                this.refreshData();
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record Approved successfully.',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                console.error('Error approving record: ', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

    rejectRecord(recordId) {
        rejectRecord({ recordId: recordId })
            .then(result => {
                this.refreshData();
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record Rejected successfully.',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                console.error('Error rejecting record: ', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

    refreshData() {
        return refreshApex(this.wiredBudget);
    }

    handleSendEmail() {
        sendEmailWithAttachment({ email: this.emailAddress })
            .then(result => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Email sent successfully.',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error sending email',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
}
