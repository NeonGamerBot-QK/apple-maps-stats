import { expect, test,describe } from "bun:test";
import { hashEmail, parseStr, Phrases, startANDEnd, type StrResult } from "../util";
const example_phrases = [
    {
        phrase: "I will arrive at [location] around [timestamp]. I'll let you know if i'm running late.",
        type: Phrases.STARTING,
        location: "[location]",
        timestamp: "[timestamp]",
    },
    {
        phrase: "My updated arrival time to [location] is now around [timestamp].",
        type: Phrases.UPDATED,
        location: "[location]",
        timestamp: "[timestamp]",
    },
    {
        phrase: "I'm arriving at [location] soon.",
        type: Phrases.ENDING,
        location: "[location]",
    }
] as StrResult[];
function replaceWithRealData(location: string, timestamp: string) {
    return example_phrases.map((phrase) => {
        return {
            ...phrase,
            location: location,
            phrase: phrase.phrase.replaceAll("[location]", location).replaceAll("[timestamp]", timestamp),
            timestamp: phrase.timestamp ? timestamp : undefined,
        };
    });
}
// theese phrases use actuall addresses & timestamps.
// the 2 addrs are github hq addr and the whitehouse fyi. 
const example_phrases2 = [
replaceWithRealData("1600 Pennsylvania Avenue NW", "8:00 PM"),
replaceWithRealData("1600 Pennsylvania Avenue NW", "10:00 AM"),
replaceWithRealData("88 Colin P Kelly Jr St", "2:00 AM"),
replaceWithRealData("88 Colin P Kelly Jr St", "6:00 PM"),
]
test("startANDEnd", () => {
   expect(startANDEnd("start   end", "start", "end")).toBe(true);
});

describe("parseStr", () => {
   const phraseNames = ["STARTING", "UPDATED", "ENDING"];
   //@ts-ignore
describe("Example STR", () => {
example_phrases.forEach((phrase: StrResult) => {
    test(`${phraseNames[phrase.type]} `, () => {
        const result = parseStr(phrase.phrase);
        expect(result.type).toBe(phrase.type);
        expect(result.location).toBe(phrase.location);
     
     if(phrase.timestamp) {  
         expect(result.timestamp).toBe(phrase.timestamp);
         } else {
            expect(result.timestamp).toBeUndefined();
         } 
    });
});

})

    example_phrases2.forEach((sets: StrResult[], i: number) => {
        describe(`Set ${i+1}`, () => {
            sets.forEach((phrase: StrResult) => {
                test(`${phraseNames[phrase.type]} `, () => {
                    const result = parseStr(phrase.phrase);
                    expect(result.type).toBe(phrase.type);
                    expect(result.location).toBe(phrase.location);
                 
                 if(phrase.timestamp) {  
                     expect(result.timestamp).toBe(phrase.timestamp);
                     } else {
                        expect(result.timestamp).toBeUndefined();
                     } 
                });
            })
        })
    });
})

test("hashEmail", () => {
    expect(hashEmail("neon@saahild.com")).toBe("7800332736cac2e8096ed46d0ee27bd2");
});