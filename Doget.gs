/**
 * doGet function for the script
 * @param {object} Request content
 * @return {String} Output displayed
 */
function doGet(request) {
  var user = Session.getActiveUser().getEmail();
  if (request.parameters.state == APPROVED_STATE) {
    var id = (request.parameters.i)+"";
    var last = (request.parameters.last);
    Logger.log(request.parameters.i);
    Logger.log(request.parameters.state);
    Logger.log(request.parameters.last);
    writeData_(APPROVED_STATE, last);
    MailApp.sendEmail('satishrawat2611@gmail.com','Approved','Aproved')
  }
  if (request.parameters.state == DENIED_STATE) {
    var id = (request.parameters.i)+"";
    var last = (request.parameters.last);   
    Logger.log(request.parameters.i);
    Logger.log(request.parameters.state);
    Logger.log(request.parameters.last);
    writeData_(DENIED_STATE, last);
    MailApp.sendEmail('satishrawat197@gmail.com','Denied','Denied')
  }
  return ContentService.createTextOutput('Thank you. Your response has been recorded.');
}
/**
 * Write data in Google Sheet based on doGet
 * Write in LOG_SHEET and Sheets()[0]
 * @param {String} Request ID
 * @param {String} Request state
 * @param {Integer} Request row in Sheet
 */
function writeData_(state, rowindex) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_KEY).getSheets()[0];
  setstate = sheet.getRange(rowindex,sheet.getLastColumn()-1,1,1).setValue(state);
}
