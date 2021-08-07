/**
 * Send email based on a template message intent from Dialogflow Agent.
 * @param {String} Requester email to find intent
 * @param {String} Requester content 
 * @param {String} Generated UUID for the request
 * @param {Integer} Id of the last row of the sheet
 * @param {state} Opt state of the request
 */

var BLANK = undefined;
var PENDING_STATE = "PENDING";
var APPROVED_STATE = "APPROVED";
var DENIED_STATE = "DENIED";
var DEPLOY_ID = "https://script.google.com/macros/s/AKfycbyOXHMUpzrhVnCVrHi9ECcH7cb3cgoZwugUxlsEPxfigudeTZKvEk0Opb2kwRjwwXF31w/exec";
var SPREADSHEET_KEY = '1jlAEc6EIurhHm_QJttKNi-G_PVNB60by18pj4JEB8zs'


/**
 * Create Approval URI
 * param {string}: Script URI
 * param {string}: UUID generated
 * param {string}: state of the request
 * return {string}: Generated URI
 */
function approveURI_(scriptUri, Uuid, state, last){
 return scriptUri + "?i=" + Uuid + '&state=' + APPROVED_STATE + '&last=' + last ;
} 
/**
 * Create Deny URI
 * param {string}: Script URI
 * param {string}: UUID generated
 * param {string}: state of the request
 * return {string}: Generated URI
 */
function denyURI_(scriptUri, Uuid, last){
 return scriptUri + "?i=" + Uuid + '&state=' + DENIED_STATE + '&last=' + last ;
} 

/**
 * Generate uuid based on:
 * @params: {integer} Google Sheets last colums
 * @return: {string} newUUUID
*/
function uuid_(lastcol) {
  var epoch = (new Date().valueOf()).toString();
  var newID = 'PO-'+lastcol+epoch; 
  return newID;
}

/**
 * Send email based on a template message intent from Dialogflow Agent.
 * @param {String} Requester email to find intent
 * @param {String} Requester content 
 * @param {String} Generated UUID for the request
 * @param {Integer} Id of the last row of the sheet
 * @param {state} Opt state of the request
 */
function notifyEmail_(requesterEmail,approverEmail,status, UUID, rowIndex) {
  var scriptUri = ScriptApp.getService().getUrl();
  // hack some values on to the data just for email templates.
  var ApprovalUrl = scriptUri + "?i=" + UUID + '&status=' + APPROVED_STATE + '&rowindex=' + rowIndex;
  var DenyUrl = scriptUri + "?i=" + Uuid + '&status=' + DENIED_STATE + '&rowindex=' + rowIndex;
  var form = {
    requester_Email: requesterEmail,
    uu_Id: UUID,
    approval_Url: ApprovalUrl,
    deny_Url: DenyUrl
  };
  if (status === PENDING_STATE) {
    var template = HtmlService.createTemplateFromFile('NotifyEmail');
    template.form = form;
    var message = template.evaluate().getContent();
    MailApp.sendEmail({
      to: approverEmail,
      cc: Session.getEffectiveUser().getEmail(),
      bcc: Session.getEffectiveUser().getEmail(),
      subject: "[New Request] New moderation request",
      htmlBody: message
    });
  }
  if (state === APPROVED_STATE) {
    // state is approved
    var templ = HtmlService.createTemplateFromFile('EmailApprove');
    templ.form = form;
    var message = templ.evaluate().getContent();
    MailApp.sendEmail({
      to: Requesteremail,
      cc: Session.getEffectiveUser().getEmail(),
      subject: "[Request - Approval workflow] Request Approve",
      htmlBody: message
    });
  }
  if (state === DENIED_STATE) {
    // state is deny
    var templ = HtmlService.createTemplateFromFile('EmailDeny');
    templ.form = form;
    var message = templ.evaluate().getContent();
    MailApp.sendEmail({
      to: Requesteremail,
      cc: Session.getEffectiveUser().getEmail(),
      subject: "[Request - Approval workflow] Request Deny",
      htmlBody: message
    });
  }
}

function onFormSubmit() {
// assume it's the first sheet where the data is collected
var sheet = SpreadsheetApp.openById(SPREADSHEET_KEY).getSheets()[0];
var lastRowIndex = sheet.getLastRow();
var lastcolIndex = sheet.getLastColumn();
var requesterEmail = sheet.getRange(lastRowIndex, 2).getValue();
var approverEmail = sheet.getRange(lastRowIndex, 5).getValue();
var date = sheet.getRange(lastRowIndex, 3).getValue();
Logger.log(Utilities.formatDate(date, 'Asia/Kolkata', 'dd/MM/yyyy'));
// Generate Unique ID
/*var UUID = uuid_(lastcolIndex);
setuuid = sheet.getRange(lastRowIndex,lastcolIndex,1,1).setValue(Uuid);
// status check and updating status to pending if condition found to be true
if (sheet.getRange(lastRowIndex,lastcolIndex-1,1,1).getValue() === BLANK){
  setstate = sheet.getRange(lastRowIndex,lastcolIndex-1,1,1).setValue(PENDING_STATE);
}
var status = sheet.getRange(lastRowIndex,lastcolIndex-1,1,1).getValue();
notifyEmail_(
  requesterEmail,
  approverEmail,
  status,
  UUID,
  lastRowIndex,
  );
*/
}
