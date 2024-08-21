import { LightningElement,api } from 'lwc';

export default class ChildSetter extends LightningElement {
    _playerName;
  @api
    get player()
    {
       return this._playerName;
    }
    set player(value)
    {
       this._playerName={...value}; 
       this._playerName.name=this._playerName.name.toUpperCase();
    }
}