import { LightningElement,track} from 'lwc';

export default class ToDolistDemo extends LightningElement {
    @track toDolist=[];
    newTask;
    handleName(event)
    {
      this.newTask=event.target.value;
    }
    handleADD(event)
    {
        let taskId;
        taskId=this.toDolist.length;
        taskId+1;
        let newtaskObj;
        newtaskObj={
            taskId:taskId,
            taskName:this.newTask
        }
        this.toDolist=[...this.toDolist,newtaskObj];
        this.newTask="";
    }
    handleRemoveTask(event)
    {
        let conId;
        conId=event.target.name;
       this.toDolist=this.toDolist.filter(curTask=>curTask.taskId!==conId);
    }
    get isToDoListAvl()
    {
        return this.toDolist.length>0;
    }

}