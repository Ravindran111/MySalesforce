import { LightningElement,track } from 'lwc';


export default class TemplateLooping extends LightningElement {
    @track Leads=[];
    @track leadName='';
    @track leadSource='';
    @track AnnualRevenue='';
    @track Email='';
    @track showError = false;
    @track showNoLeads = false;

    handleLeadName(event){
        this.leadName=event.target.value;
    }
    handleLeadSource(event){
        this.leadSource=event.target.value;
    }
    handleAnnualRevenue(event){
        this.AnnualRevenue=event.target.value;
    }
    handleEmail(event){
        this.Email=event.target.value;
    }

    handleADD(){
        if(!this.leadName || !this.leadSource || ! this.AnnualRevenue || !this.Email)
        {
            this.showError= true;
            return;
        }
        this.showError=false;
         const lead={
            id:this.leads.length+1,
            name:this.leadName,
            source:this.leadSource,
            revenue: this.AnnualRevenue,
            email:this.Email
        };
        this.leads.push(lead);
        this.clearfields();
    }
    handlCLEAR(){
        this.lead=[];
        this.clearfields();
    }
    handleDISPLAY(){
        this.showNoLeads = this.Leads.length === 0;
    }
    clearfields(){
        this.leadName='';
        this.leadSource='';
        this.AnnualRevenue='';
        this.Email='';
    }
}