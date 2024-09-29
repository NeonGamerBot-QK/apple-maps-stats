//@ts-ignore
import { MailListener } from "mail-listener5"
enum Phrases {
    STARTING, 
    UPDATED,
    ENDING,
    UNK  = -1
}
type StrResult = {
    phrase: string,
    type: Phrases,
    location: string,
    timestamp?: string
}
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
    const startANDEnd = (content: string, start: string, end: string) => {
        if(content.includes(start) && content.includes(end)) {
            console.log(content)
            return true
            }
            return false
            }
const parseStr = (content: string) => {
    const arrivalRegex = /I will arrive at (.*) around (.*)\. I'll let you know if i'm running late\./
    const updatedRegex = /My updated arrival time to (.*) is now around (.*)\./
    const endingRegex = /I'm arriving at (.*) soon/
    const result: StrResult = {
        phrase: content,
        type: Phrases.UNK,
        location: "",
        }
        if(content.match(arrivalRegex)) {
            result.type = Phrases.STARTING
            result.location = arrivalRegex.exec(content)![1]
            result.timestamp = arrivalRegex.exec(content)![2]
        }
        else if(content.match(updatedRegex)) {
                result.type = Phrases.UPDATED
                result.location = updatedRegex.exec(content)![1] 
                result.timestamp = updatedRegex.exec(content)![2] 
                }
        else if(content.match(endingRegex)) {
                    result.type = Phrases.ENDING
                    result.location = endingRegex.exec(content)![1]
                    }
                    return result

}
// console.log(parseStr("I'm arriving at [location] soon."))
// console.log(parseStr("My updated arrival time to [location] is now around [timestamp]."))
// console.log(parseStr("I will arrive at <location> around <timestamp>. I'll let you know if i'm running late."))
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
    attachmentOptions: { directory: "attachments/" }
  });

    //@ts-ignore  shush
    mailListener.on("mail", function(mail, seqno, attributes){
        if(mail.attachments.length <= 0) {
            console.log("no attachments")
            return
            }
            const content = mail.attachments[0].content.toString()
        // console.log(mail.attachments[0].content.toString(), "mail")
        // based on content create json map
        const parsed = parseStr(content)
    console.debug(parsed)
    switch(parsed.type) {
        case Phrases.STARTING:
            console.log("starting")
            break
            case Phrases.UPDATED:
                console.log("updated")
                break
                case Phrases.ENDING:
                    console.log("ending")
                    break
    }
    });
  mailListener.start();
      mailListener.on("error", function(error:any){
        console.log(error)
        });
        mailListener.on("end", function(){
            console.log("end")
            });