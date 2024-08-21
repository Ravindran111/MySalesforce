import { LightningElement, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountDataController.getAccounts';
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const RECORD_COUNT_OPTIONS = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '5', value: '5' },
    { label: '10', value: '10' },
    { label: '15', value: '15' },
    { label: '20', value: '20' },
    { label: '25', value: '25' }
];

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Rating', fieldName: 'Rating' },
    { label: 'Active', fieldName: 'Active__c' },
    {
        type: "button-icon", label: 'Edit', typeAttributes: {
            label: 'Edit',
            name: 'Edit',
            title: 'Edit',
            disabled: false,
            value: 'edit',
            iconName: 'utility:edit'
        }
    },
    {
        type: "button-icon", label: 'Delete', typeAttributes: {
            label: 'Delete',
            name: 'Delete',
            title: 'Delete',
            disabled: false,
            value: 'delete',
            iconName: 'utility:delete'
        }
    }
];


export default class ButtonsInLWC extends NavigationMixin(LightningElement) {
    @track data;
    @track error;
    @track recordCountOptions = RECORD_COUNT_OPTIONS;
    @track recordCount = '10';
    @track searchTerm = '';
    @track wiredAccountsResult;
    @track filteredData;
    @track currentPage = 1;
    @track totalPages = 1;
    @track accountData=[];
    @track isModalOpen = false;
    @track email = '';

    columns = columns;
    columnHeader=['Id','Name','Rating','Active__c'];

    @wire(getAccounts)
    wiredAccounts(result) {
        this.wiredAccountsResult = result;
        if (result.data) {
            this.data = result.data;
            this.totalPages = Math.ceil(this.data.length / parseInt(this.recordCount, 10));
            this.filterData();
        } else if (result.error) {
            this.error = result.error;
        }
    }

    handlepdfDownload() {
        window.open('/apex/AccountPdf');
    }

    handleRecordCountChange(event) {
        this.recordCount = event.target.value;
        this.totalPages = Math.ceil(this.data.length / parseInt(this.recordCount, 10));
        this.filterData();
    }

    handleSearch(event) {
        this.searchTerm = event.target.value.toLowerCase();
        this.filterData();
    }

    filterData() {
        if (this.data) {
            let filteredData = this.data;

            if (this.searchTerm) {
                filteredData = filteredData.filter(record => {
                    return Object.values(record).some(value =>
                        String(value).toLowerCase().includes(this.searchTerm)
                    );
                });
            }

            const start = (this.currentPage - 1) * parseInt(this.recordCount, 10);
            const end = start + parseInt(this.recordCount, 10);
            this.filteredData = filteredData.slice(start, end);
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
        this.filterData();
        }
        }
     
        handlePagePrevAction() {
        if (this.currentPage > 1) {
        this.currentPage--;
        this.filterData();
        }
        }

    callRowAction(event) {
        const recId = event.detail.row.Id;
        const actionName = event.detail.action.name;
        if (actionName === 'Edit') {
            this.handleAction(recId, 'edit');
        } else if (actionName === 'Delete') {
            this.handleDeleteRow(recId);
        }
    }

    handleAction(recordId, mode) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Account',
                actionName: mode
            }
        });
    }

    handleDeleteRow(recordIdToDelete) {
        deleteRecord(recordIdToDelete)
        .then(result => {
            this.showToast('Success!!', 'Record got deleted successfully!!', 'success', 'dismissable');
            return refreshApex(this.wiredAccountsResult);
        }).catch(error => {
            this.error = error;
        });
    }
   
    showToast(title, message, variant, mode) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }

    handleDownload(){
        let downloadRecords = [...this.data];
        this.createCsvForDownload(downloadRecords);
    }

    createCsvForDownload(downloadRecords){
        let csvHeader = Object.keys(downloadRecords[0]).join(',');
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
        hiddenElement.download = 'Account.csv';
        hiddenElement.click();
    }
}
