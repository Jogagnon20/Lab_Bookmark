const Repository = require('../models/Repository');

module.exports = 
class ContactsController extends require('./Controller') {
    constructor(req, res){
        super(req, res);
        this.contactsRepository = new Repository('Contacts');
    }
    objectSize(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key))
                size++;
        }
        return size;
    }
    CheckContact(contact){
        if (contact.hasOwnProperty('Name'))
            if (contact.hasOwnProperty('Email'))
                if (contact.hasOwnProperty('Phone'))
                    if (this.objectSize(contact) === 4) {
                        return true;
                    }
        return false;
    }

    get(id){
        if(!isNaN(id))
            this.response.JSON(this.contactsRepository.get(id));
        else
            this.response.JSON(this.contactsRepository.getAll());
    }
    post(contact){  
        for (let i = 0; i < this.contactsRepository.objectsList.length; i++){
            if (this.contactsRepository.objectsList[i].Name === contact.Name){
                this.response.internalError();
                return null;
            }
            if (this.contactsRepository.objectsList[i].Email === contact.Email){
                this.response.internalError();
                return null;
            }
            if (this.contactsRepository.objectsList[i].Phone === contact.Phone){
                this.response.internalError();
                return null;
            }
        }
        
        if (this.CheckContact(contact)) {
            let newContact = this.contactsRepository.add(contact);
            if (newContact)
                this.response.created(newContact);
            else
                this.response.internalError();
        }
        else 
            this.response.internalError();
    }
    put(contact){
        if (this.CheckContact(contact)){
            if (this.contactsRepository.update(contact))
                this.response.ok();
            else 
                this.response.notFound();
        }
        else 
            this.response.internalError();
    }
    remove(id){
        if (this.contactsRepository.remove(id))
            this.response.accepted();
        else
            this.response.notFound();
    }
}