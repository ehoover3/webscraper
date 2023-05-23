const puppeteer = require("puppeteer");
const fs = require("fs");

const urls = [
  "https://nces.ed.gov/collegenavigator/?id=100654",
  "https://nces.ed.gov/collegenavigator/?id=136774",
  "https://nces.ed.gov/collegenavigator/?id=177834",
  "https://nces.ed.gov/collegenavigator/?id=100690",
  "https://nces.ed.gov/collegenavigator/?id=100812",
];

//   https://nces.ed.gov/collegenavigator/?id=100654",
  //"https://nces.ed.gov/collegenavigator/?id=136774",
 // "https://nces.ed.gov/collegenavigator/?id=177834",
 // https://nces.ed.gov/collegenavigator/?id=100690,
 // "https://nces.ed.gov/collegenavigator/?id=100812",
 // "https://nces.ed.gov/collegenavigator/?id=110398

  

async function scrapeData() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const scrapedData = [];

  for (const url of urls) {
    await page.goto(url);

    // makes sure the tuition div is loaded before executing the below. 
    const tuitionDivHandle = await page.waitForSelector(
      "div > #divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00"
    );

    const tuitionDivContent = await page.evaluate((element) => {
      // IN STATE TUITION - In-state
      const xpathSelectorInStateTuition = './/td[contains(text(), "In-state")]';
      const InStateTuitionElement = document.evaluate(
        xpathSelectorInStateTuition,
        element,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      // TUITION AND FEES - Tuition and fees
      const xpathSelectorTuitionandFees =
        './/td[contains(text(), "Tuition and fees")]';
      const TuitionandFeesElement = document.evaluate(
        xpathSelectorTuitionandFees,
        element,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      // TUITION ALONE - Tuition
      // FEES ALONE - Fees 
      
      const xpathSelectorTuitionAlone = './/td[contains(text(), "Tuition")]';
      const TuitionAloneElement = document.evaluate(
        xpathSelectorTuitionAlone,
        element,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;



      // UnderGraduate Specific Tuition and Fees
        const xpathSelectorUndergradTuitionAlone = './/td[contains(text(), "Undergraduate student tuition and fees")]';
        const UndergradTuitionAloneElement = document.evaluate(
          xpathSelectorUndergradTuitionAlone,
          element,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;


      let inStateTuitionValue = "";
      let tuitionAndFeesValue = "";
      let tuitionAloneValue = "";
      let undergradTuitionAloneValue = "";

      if (UndergradTuitionAloneElement){
        console.log(UndergradTuitionAloneElement)
      }

      // EX 1 specific
        if (InStateTuitionElement && !UndergradTuitionAloneElement) {
          let inStateTuitionValueElement =
            InStateTuitionElement.nextElementSibling.nextElementSibling
              .nextElementSibling;
          inStateTuitionValue = inStateTuitionValueElement.textContent.trim();
        }
      // EX 2 specific 
      if (TuitionandFeesElement && !UndergradTuitionAloneElement) {
        let tuitionAndFeesValueElement =
          TuitionandFeesElement.nextElementSibling.nextElementSibling
            .nextElementSibling.nextElementSibling;
        tuitionAndFeesValue = tuitionAndFeesValueElement.textContent.trim();
      }
       
      // EX 3 specific 
      if ( tuitionAndFeesValue.length <= 0 && TuitionAloneElement){
        let tuitionAloneValueElement = TuitionAloneElement.nextElementSibling;
        tuitionAloneValue = tuitionAloneValueElement.textContent.trim();
      }

        return {
          InStateTuition: inStateTuitionValue ? inStateTuitionValue : "",
          TuitionAndFees: tuitionAndFeesValue ? tuitionAndFeesValue : "",
          TuitionAlone: tuitionAloneValue ? tuitionAloneValue : "",
          UnderGradTuitionAlone: undergradTuitionAloneValue ? undergradTuitionAloneValue : ""
        };
    }, tuitionDivHandle);



    scrapedData.push(tuitionDivContent);
  }

  await browser.close();

  fs.writeFile("outputs/colleges.json", JSON.stringify(scrapedData), (err) => {
    if (err) throw err;
  });

  return scrapedData;
}






scrapeData().then((value) => {
  console.log(value); // print the scraped data
});
