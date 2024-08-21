public with sharing class AccountDataController {

  @AuraEnabled(cacheable=true)
  public static List<Account> getAccounts() {
      return [SELECT Id, Name, Industry, Type, Phone, Rating, AnnualRevenue FROM Account];
  }

  @AuraEnabled
  public static void deleteAccount(Id accountId) {
      delete new Account(Id = accountId);
  }
}
