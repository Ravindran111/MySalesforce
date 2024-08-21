import { LightningElement } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class ToastNotificationDemo extends LightningElement {

    label;
    /*handlesuccessClick(event)
    {
         const MyToast = new ShowToastEvent({
                           title:"Success",
                           message:"{0} Display Success Message {1}",
                           variant:"Success",
                           mode:"pester",
                           messageData:[
                                       'salesforce',
                                       {
                                        url:'https://www.lightningdesignsystem.com/components/buttons/#site-main-content',
                                        label:"ClickHere"
                                       }
                           ]
        })
        this.dispatchEvent(MyToast);
    }
    handleerrorClick(event){
        const MyToast = new ShowToastEvent({
            title:"Error",
            message:"Display ERROR Message",
            variant:"error",
            mode:"sticky"
})
this.dispatchEvent(MyToast);
    }
    handleinfoClick(event)
    {
        const MyToast = new ShowToastEvent({
            title:"Info",
            message:"Display INFO Message",
            variant:"info"
})
this.dispatchEvent(MyToast);
    }
    handlewarningClick(event){
        const MyToast = new ShowToastEvent({
            title:"Warning",
            message:"Display WARNING Message",
            variant:"warning"
})
this.dispatchEvent(MyToast);
    }
}*/

handleClick(event)
{
  this.label=event.target.label 
  switch(this.label)
  {
    case 'success':
        {
           this.Showtoast('Success','{0} Account Created SuccessFully{1}','success','dismissible')
           break;
        }
    case 'Error':
            {
                this.Showtoast('Error','Display ERROR Message','error','pester')
                break;
            }
    case 'Info':
        {
            this.Showtoast('Info','Display INFO Message','info','sticky')
            break;
        }
    case 'Warning':
        {
            this.Showtoast('Warning','Display Warning Message','warning')
                break;
        } 
        default:
            break;   
  }
}
  Showtoast(title,message,variant,mode)
  {
    this.dispatchEvent(new ShowToastEvent({
        title:title,
        message:message,
        variant:variant,
        mode:mode,
         messageData:[
            'salesforce',
            {
             url:'https://www.lightningdesignsystem.com/components/buttons/#site-main-content',
             label:'ClickHere'
            }
         ]
        })
        );
  }
}

