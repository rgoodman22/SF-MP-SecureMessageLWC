public with sharing class secureMessage {
    @AuraEnabled(cacheable=true)
    public static list<contact> qContact(){
        list<contact> firstContacts = [SELECT Id, Name, (SELECT Id, Subject, CreatedDate FROM Cases) FROM Contact ORDER BY LastName];
        list<contact> myContacts = new list<Contact>();
        for (contact c : firstContacts) {
            if (c.cases.size() > 0) {
                myContacts.add(c);
            }
        }
        return myContacts;
    }
    @AuraEnabled(cacheable=true)
    public static list<case> qCase(string contactId) {
        list<case> myCases = [SELECT Id, Subject FROM Case WHERE contact.Id =: contactId];
        return myCases;
    }
}