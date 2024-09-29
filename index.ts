import { MailListener } from "mail-listener5"

if(!Bun.env["MAIL_USERNAME"]) {
    console.log("MAIL_USERNAME not set")
    process.exit(1)
    }
if(!Bun.env["MAIL_PASSWORD"]) {
    console.log("MAIL_PASSWORD not set")
    process.exit(1)
    }
if(!Bun.env["MAIL_HOST"]) {
    console.log("MAIL_HOST not set")
    process.exit(1)
    }
const mailListener = new MailListener({
    username:Bun.env["MAIL_USERNAME"].toString(),
    password:Bun.env["MAIL_PASSWORD"].toString(),
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
    // attachmentOptions: { directory: "attachments/" }
  });

    //@ts-ignore  shush
    mailListener.on("mail", function(mail, seqno, attributes){
        if(mail.attachments.length <= 0) {
            console.log("no attachments")
            return
            }
        console.log(mail.attachments[0].content.toString(), "mail")
      });
  mailListener.start();
      mailListener.on("error", function(error){
        console.log(error)
        });
        mailListener.on("end", function(){
            console.log("end")
            });