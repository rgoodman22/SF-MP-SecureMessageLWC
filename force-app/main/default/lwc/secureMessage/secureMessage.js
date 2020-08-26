import { wire, api, track, LightningElement } from 'lwc';
import qContact  from "@salesforce/apex/secureMessage.qContact";
import qCase from "@salesforce/apex/secureMessage.qCase";
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import SECURE_MESSAGE_OBJECT from '@salesforce/schema/Secure_Message__c';
import NAME_FIELD from '@salesforce/schema/Secure_Message__c.Name';
import Case_Id_FIELD from '@salesforce/schema/Secure_Message__c.Case_Id__c';
import Contact_FIELD from '@salesforce/schema/Secure_Message__c.Contact__c';
import Body_FIELD from '@salesforce/schema/Secure_Message__c.Body__c';



export default class SecureMessage extends LightningElement {
    @track screen1 = true;
    @track screen2 = false;
    @track screen3 = false;

    @track contactValue = null;
    @track caseValue = null;
    @api subjectValue;
    @api messageValue;
    @track messageStatus = null;

    @track contactData;
    @track contactError;
    @track caseData;
    @track caseError;

    @wire(qContact)
    popContacts ({error, data}) {
        if (data) {
            this.contactData = data;
            this.contactError = undefined;
        } else {
            this.contactError = error;
            this.contactData = undefined;
        }
    }

    @wire(qCase, {contactId: '$contactValue'})
    popCases({error, data}) {
        if (data) {
            this.caseData = data;
            this.caseError = undefined;
        } else {
            this.caseError = error;
            this.caseData = undefined;
        }
    }

    handleContactSelect(event){
        this.contactValue=event.detail.value;
    }

    HandleNext1(event) {
        if (this.contactValue != null) {
            this.screen1=false;
            this.screen2=true;
        }
    }

    handleCaseSelect(event) {
        this.caseValue=event.detail.value;
    }

    HandleNext2(event) {
            this.screen2 = false;
            this.screen3 = true;
    }

    HandleBack2(event) {
        this.screen2 = false;
        this.screen1 = true;
        this.contactValue = null;
    }

    handleSubject(event) {
        this.subjectValue = event.detail.value;
    }

    handleMessage(event) {
        this.messageValue = event.detail.value;
    } 


    sendMessage() {
        const fields = {};
        fields[NAME_FIELD.fieldApiName] = this.subjectValue;
        fields[Case_Id_FIELD.fieldApiName] = this.caseValue;
        fields[Contact_FIELD.fieldApiName] = this.contactValue;
        fields[Body_FIELD.fieldApiName] = this.messageValue;
        const recordInput = {apiName: SECURE_MESSAGE_OBJECT.objectApiName, fields };
        createRecord(recordInput)
            .then(result => {
                this.messageStatus = true;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Message Sent',
                        variant: 'success',
                    }),
                );
            })
            .catch(error => {
                this.messageStatus = false;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error Sending Message',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });

    }

    HandleNext3(event) {
        this.sendMessage();
        if (this.messageStatus) {
            this.contactValue = null;
            this.caseValue = null;
            this.messageValue = null;
            this.subjectValue = null;
        }
        this.screen3 = false;
        this.screen1 = true;
    }

    HandleBack3(event) {
        this.screen3=false;
        this.screen2=true;
        this.caseValue=null;
    }

    get getContactData() {
        if (this.contactData) {
            let myContacts = [];
            let length = this.contactData.length;
            for (let i = 0; i<length;i++) {
                let x = this.contactData[i];
                myContacts.push({label: x.Name, value: x.Id});
            }
            return myContacts;
        } else {
            return this.contactError;
        }
    }

    get getCaseData() {
        if (this.caseData) {
            let myCases = [];
            let length = this.caseData.length;
            for (let i = 0; i < length; i++) {
                let x = this.caseData[i];
                myCases.push({label: x.Subject, value: x.Id});
            }
            return myCases;
        } else {
            return this.contactError;
        }
    }

}