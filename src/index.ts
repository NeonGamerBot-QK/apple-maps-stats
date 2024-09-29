//@ts-ignore
import { MailListener } from "mail-listener5";
import { parseStr, Phrases } from "./util";
import { Database } from "bun:sqlite";
if (!Bun.env["MAIL_USERNAME"]) {
  console.log("MAIL_USERNAME not set");
  process.exit(1);
}
if (!Bun.env["MAIL_PASSWORD"]) {
  console.log("MAIL_PASSWORD not set");
  process.exit(1);
}
if (!Bun.env["MAIL_HOST"]) {
  console.log("MAIL_HOST not set");
  process.exit(1);
}
const db = new Database("db.db", {
  create: true,
  readwrite: true,
});
// enable WAL
db.exec("PRAGMA journal_mode = WAL;");
db.run("CREATE TABLE IF NOT EXISTS apple_maps_stats (email TEXT PRIMARY KEY, last_updated TEXT, location TEXT, timestamp TEXT, heartbeat INT DEFAULT 0)");

//test db
// db.query("INSERT INTO apple_maps_stats (email, last_updated, location, timestamp) VALUES ($email, $last_updated, $loc, $t)").run({ 
//   $email: "neon@saahild.com",
//   $last_updated: "2023-03-01",
//   $loc: "1600 Pennsylvania Avenue NW",
//   $t: "8:00 PM",
// });
const mailListener = new MailListener({
  username: Bun.env["MAIL_USERNAME"].toString(),
  password: Bun.env["MAIL_PASSWORD"].toString(),
  host: Bun.env["MAIL_HOST"].toString(),
  port: 993,
  tls: true,
  // connTimeout: 20_000,
  // authTimeout: 20_000,
  // debug: console.debug , //  console.log
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX",
  searchFilter: ["UNSEEN", ["SINCE", 0]],
  markSeen: true,
  fetchUnreadOnStart: true,
  // mailParserOptions: {streamAttachments: true},
  attachments: true,
  attachmentOptions: { directory: "attachments/" },
});

//@ts-ignore  shush
mailListener.on("mail", function (mail, seqno, attributes) {
  if (mail.attachments.length <= 0) {
    console.log("no attachments");
    return;
  }
  const content = mail.attachments[0].content.toString();
  // console.log(mail.attachments[0].content.toString(), "mail")
  // based on content create json map
  const parsed = parseStr(content);
  console.debug(parsed);
  console.debug(`from`, mail.from[0])
  switch (parsed.type) {
    case Phrases.STARTING:
      console.log("starting");
      break;
    case Phrases.UPDATED:
      console.log("updated");
      break;
    case Phrases.ENDING:
      console.log("ending");
      break;
  }
});
mailListener.start();
mailListener.on("error", function (error: any) {
  console.log(error);
});
mailListener.on("end", function () {
  console.log("end");
});
