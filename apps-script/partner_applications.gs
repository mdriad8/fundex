/**
 * Beyond the Prompt 2027: receiver for the application forms on fundexglobal.vc/hackathon
 * (Campus Ambassador, Club Partner, Community Partner, University Partner, Speaker).
 *
 * The forms live on our website. This script only receives submissions: it checks them, saves each one
 * to a Google Sheet in the Fund'ex account (one tab per form), gives it an ID, emails Nahid, and sends the
 * applicant a short acknowledgement. Nothing is shared with sponsors.
 *
 * ONE-TIME SET-UP (signed in as nahid@fundexglobal.vc):
 *   1. script.google.com → New project → paste this file → Save.
 *   2. Run "setup" once → Review permissions → Allow. It creates the Sheet and prints its link.
 *   3. Deploy → New deployment → type "Web app" → Execute as: Me → Who has access: Anyone → Deploy.
 *   4. Copy the Web app URL (ends in /exec) into APPLY_ENDPOINT in src/pages/hackathon/applications.ts.
 * After any edit to this script: Deploy → Manage deployments → Edit → Version: New version → Deploy
 * (the URL stays the same).
 */

var CONFIG = {
  notifyEmail: 'nahid@fundexglobal.vc',
  sheetTitle: 'Beyond the Prompt 2027 - Applications',
  eventUrl: 'https://www.fundexglobal.vc/hackathon',
  maxFieldLength: 2000,
  maxPayloadLength: 20000,
  perEmailPerHour: 3,
  allPerTenMinutes: 60,
};

// BEGIN-FORMS: kept in step with src/pages/hackathon/applications.ts by tests/applications.test.ts
var COMMON_REQUIRED = ["fullName","email","country","city","adult","agreeConduct","agreePrivacy"];
var FORMS = {
  "ambassador": {"prefix":"AMB","tab":"Campus Ambassadors","label":"Campus Ambassador","required":["institution","role","communities","channels","hours","motivation","noAuthority"]},
  "club": {"prefix":"CLB","tab":"Club Partners","label":"Club Partner","required":["clubName","institution","clubUrl","role","contribution","authorised"]},
  "community": {"prefix":"COM","tab":"Community Partners","label":"Community Partner","required":["communityName","communityType","communityUrl","role","audience","reach","collaboration","fees"]},
  "university": {"prefix":"UNI","tab":"University Partners","label":"University Partner","required":["institution","department","title","institutionalEmail","support","authorised"]},
  "speaker": {"prefix":"SPK","tab":"Speakers","label":"Speaker","required":["organisation","jobTitle","format","sessionType","sessionTitle","abstract","outcomes","recordingOk"]}
};
// END-FORMS

var BASE_HEADERS = ['ID', 'Received (UTC)', 'Status', 'Reviewer notes'];

function setup() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  var ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.create(CONFIG.sheetTitle);
  props.setProperty('SHEET_ID', ss.getId());
  Object.keys(FORMS).forEach(function (kind) {
    var sh = ss.getSheetByName(FORMS[kind].tab) || ss.insertSheet(FORMS[kind].tab);
    if (sh.getLastRow() === 0) {
      sh.appendRow(BASE_HEADERS);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, BASE_HEADERS.length).setFontWeight('bold');
    }
  });
  var first = ss.getSheetByName('Sheet1');
  if (first && ss.getSheets().length > 1) ss.deleteSheet(first);
  Logger.log('Applications sheet: ' + ss.getUrl());
}

function doGet() {
  return json_({ ok: true, service: 'beyond-the-prompt-applications' });
}

function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents ? String(e.postData.contents) : '';
    if (!raw || raw.length > CONFIG.maxPayloadLength) return json_({ ok: false, code: 'bad-request' });
    var data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return json_({ ok: false, code: 'bad-request' });

    var kind = String(data.kind || '');
    var form = FORMS[kind];
    if (!form) return json_({ ok: false, code: 'bad-request' });

    // Spam checks: honeypot and minimum fill time (the website records when the form was opened).
    if (data.website) return json_({ ok: true, id: 'OK' }); // silently drop bots
    var started = Number(data.startedAt || 0);
    if (started && Date.now() - started < 4000) return json_({ ok: false, code: 'rejected' });

    var values = data.values && typeof data.values === 'object' ? data.values : {};
    var missing = COMMON_REQUIRED.concat(form.required).filter(function (k) {
      var v = values[k];
      if (Array.isArray(v)) return v.length === 0;
      if (v === true) return false;
      return typeof v !== 'string' || v.trim() === '';
    });
    if (missing.length) return json_({ ok: false, code: 'invalid', missing: missing });

    var email = String(values.email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json_({ ok: false, code: 'invalid', missing: ['email'] });

    // Rate limits.
    var cache = CacheService.getScriptCache();
    if (!bump_(cache, 'all', 600, CONFIG.allPerTenMinutes)) return json_({ ok: false, code: 'rate-limited' });
    if (!bump_(cache, 'em:' + email, 3600, CONFIG.perEmailPerHour)) return json_({ ok: false, code: 'rate-limited' });

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    var id;
    try {
      var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID'));
      var sh = ss.getSheetByName(form.tab);
      var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      var keys = Object.keys(values);
      keys.forEach(function (k) {
        if (headers.indexOf(k) === -1) {
          headers.push(k);
          sh.getRange(1, headers.length).setValue(k).setFontWeight('bold');
        }
      });
      id = 'BTP-' + form.prefix + '-' + ('0000' + sh.getLastRow()).slice(-4);
      var row = headers.map(function (h) {
        if (h === 'ID') return id;
        if (h === 'Received (UTC)') return new Date().toISOString();
        if (h === 'Status') return 'Received';
        if (h === 'Reviewer notes') return '';
        return cell_(values[h]);
      });
      sh.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    notify_(form, id, values);
    acknowledge_(form, id, values, email);
    return json_({ ok: true, id: id });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, code: 'server-error' });
  }
}

function bump_(cache, key, seconds, limit) {
  var n = Number(cache.get(key) || 0) + 1;
  cache.put(key, String(n), seconds);
  return n <= limit;
}

/** Flatten a value for the sheet and stop formula injection. */
function cell_(v) {
  if (v === undefined || v === null) return '';
  if (v === true) return 'Yes';
  if (v === false) return 'No';
  var s = Array.isArray(v) ? v.map(String).join('; ') : String(v);
  s = s.slice(0, CONFIG.maxFieldLength);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function notify_(form, id, values) {
  var lines = Object.keys(values).map(function (k) { return k + ': ' + cell_(values[k]); });
  var who = cell_(values.fullName) + ' (' + cell_(values.country) + ')';
  MailApp.sendEmail({
    to: CONFIG.notifyEmail,
    replyTo: String(values.email),
    subject: '[Beyond the Prompt] New ' + form.label + ' application ' + id + ': ' + who,
    body: 'New ' + form.label + ' application via ' + CONFIG.eventUrl + '\n\nID: ' + id + '\n\n' + lines.join('\n') +
      '\n\nAll applications: https://docs.google.com/spreadsheets/d/' + PropertiesService.getScriptProperties().getProperty('SHEET_ID'),
  });
}

function acknowledge_(form, id, values, email) {
  var first = String(values.fullName || '').split(' ')[0];
  MailApp.sendEmail({
    to: email,
    replyTo: CONFIG.notifyEmail,
    name: "Fund'ex - Beyond the Prompt 2027",
    subject: 'We received your ' + form.label + ' application (' + id + ')',
    body: 'Hi ' + first + ',\n\nThanks for applying to be a ' + form.label + ' for Beyond the Prompt 2027, the free AI & automation ' +
      'conference and 48-hour hackathon (23-25 January 2027).\n\nYour reference is ' + id + '. We review every application ' +
      'personally and will reply within about a week. Nothing is published about you without your permission.\n\n' +
      'Event page: ' + CONFIG.eventUrl + '\nQuestions: just reply to this email.\n\nNahid Tanjum\nDirector, Fundex Global - Melbourne, Australia',
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
