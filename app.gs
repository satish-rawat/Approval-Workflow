const SPREADSHEET_KEY = "";
const TEAM = "Team";
const FORM_RESPONSE = "Response";

function doGet(e) {
  var htmlOutput =  HtmlService.createTemplateFromFile('Form');
  var teams = getTeam();
  htmlOutput.message = '';
  htmlOutput.teams = teams;
  return htmlOutput.evaluate();
}

function doPost(e) {
  var effective = Session.getEffectiveUser().getEmail();
  var active = Session.getActiveUser().getEmail();
  Logger.log("Eff : " + effective + "act : " + active)
  Logger.log(JSON.stringify(e));
  var team = e.parameters.team.toString();
  var lead = e.parameters.leads.toString();
  var requestor = e.parameters.requestor.toString();
  addRecord(team, lead, requestor);
  var htmlOutput =  HtmlService.createTemplateFromFile('Form');
  var teams = getTeam();
  htmlOutput.message = 'Record Added';
  htmlOutput.teams = teams;
  return htmlOutput.evaluate(); 
}

function getTeam() { 
  var sheet = SpreadsheetApp.openById(SPREADSHEET_KEY).getSheetByName(TEAM); 
  var getLastRow = sheet.getLastRow();
  var teamArray = [];
  for(var i = 2; i <= getLastRow; i++)
  {
      if(teamArray.indexOf(sheet.getRange(i, 1).getValue()) === -1) {
        teamArray.push(sheet.getRange(i, 1).getValue());
      }
  }
  Logger.log(teamArray)
  return teamArray;  
}

function getLeads(team) { 
  var sheet = SpreadsheetApp.openById(SPREADSHEET_KEY).getSheetByName(TEAM);
  var getLastRow = sheet.getLastRow();
  var leadArray = [];
  for(var i = 2; i <= getLastRow; i++)
  {
      if(sheet.getRange(i, 1).getValue() === team) {
        leadArray.push(sheet.getRange(i, 3).getValue());
      }
  }
  Logger.log(leadArray)
  return leadArray;  
}

function getRequestorLDAP(team) { 
  var sheet = SpreadsheetApp.openById(SPREADSHEET_KEY).getSheetByName(TEAM);
  var getLastRow = sheet.getLastRow();
  var memberArray = [];
  for(var i = 2; i <= getLastRow; i++)
  {
      if(sheet.getRange(i, 1).getValue() === team) {
        memberArray.push(sheet.getRange(i, 2).getValue());
      }
  }
  Logger.log(memberArray)
  return memberArray;  
}

function addRecord(team, lead, requestor) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_KEY).getSheetByName(FORM_RESPONSE);
  sheet.appendRow([new Date(), team, lead, requestor]);
}

function getUrl() {
 var url = ScriptApp.getService().getUrl();
 return url;
}


