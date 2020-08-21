import { wire, api, track, LightningElement } from 'lwc';
import qContact  from "@salesforce/apex/secureMessage.qContact";
import qCase from "@salesforce/apex/secureMessage.qCase";


export default class SecureMessage extends LightningElement {
    @track screen1 = true;
    @track screen2 = false;
    @track screen3 = false;

    @track contactValue = 'Select a contact...';
    @track caseValue = 'Select a case';

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
        this.screen1=false;
        this.screen2=true;
    }

    handleCaseSelect(event) {
        this.caseValue=event.detail.value;
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