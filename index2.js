const puppeteer = require("puppeteer");
const fs = require("fs");

const urls = [
  "https://nces.ed.gov/collegenavigator/?id=104568"
];


async function scrapeData() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const scrapedData = [];

  for (const url of urls) {
    await page.goto(url);

    let inStateTuitionValue = "";
    let tuitionAndFeesValue = "";
    let tuitionAloneValue = "";
    let gradTuitionAlone = "";
    let SchoolName = "";
    let ProgramLength = "";

    // School Name
    try {
      SchoolName = await page.$eval(
        "#RightContent > div.dashboard > div > div:nth-child(2) > span > span",
        (element) => element.textContent.trim()
      );
    } catch (error) {
      console.log("Error retrieving school name value:", error.message);
    }

    //Program Length Header
    try {
      ProgramLength = await page.$eval(
        "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(3) > thead > tr > th:nth-child(2)",
        (element) => element.textContent.trim()
      );
    } catch (error) {
      console.log("Error retrieving school name value:", error.message);
    }

    // EX 1
    try {
      inStateTuitionValue = await page.$eval(
        "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(5)",
        (element) => element.textContent.trim()
      );
    } catch (error) {
      console.log("Error retrieving in-state tuition value:", error.message);
    }

    // EX 2
    try {
      tuitionAndFeesValue = await page.$eval(
        "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(3) > tbody > tr:nth-child(1) > td:nth-child(5)",
        (element) => element.textContent.trim()
      );
    } catch (error) {
      console.log("Error retrieving tuition and fees value:", error.message);
    }

    // EX 3
    if (!tuitionAndFeesValue && !inStateTuitionValue) {
      try {
        tuitionAloneValue = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2)",
          (element) => element.textContent.trim()
        );
      } catch (error) {
        console.log("Error retrieving tuition alone value:", error.message);
      }
    }

    // EX 4

    if (!tuitionAndFeesValue && !inStateTuitionValue && !tuitionAloneValue) {
      try {
        tuitionAloneValue = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2)",
          (element) => element.textContent.trim()
        );
      } catch (error) {
        console.log("Error retrieving tuition alone value:", error.message);
      }
    }

    // EX 5

    if (!tuitionAndFeesValue && !inStateTuitionValue && !tuitionAloneValue) {
      try {
        inStateTuitionValue = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2)",
          (element) => element.textContent.trim()
        );
      } catch (error) {
        console.log("Error retrieving tuition alone value:", error.message);
      }
    }

    // EX 6

    if (
      !tuitionAndFeesValue &&
      !inStateTuitionValue &&
      !tuitionAloneValue &&
      ProgramLength != "Program Length"
    ) {
      try {
        gradTuitionAlone = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table > tbody > tr:nth-child(1) > td:nth-child(2)",
          (element) => element.textContent.trim()
        );
      } catch (error) {
        console.log("Error retrieving tuition alone value:", error.message);
      }
    }

    if (tuitionAndFeesValue) {
      inStateTuitionValue = "";
    }

    if (ProgramLength === "Program Length") {
      try {
        tuitionAndFeesValue = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(4) > tbody > tr:nth-child(1) > td:nth-child(5)",
          (element) => element.textContent.trim()
        );
      } catch (error) {
        console.log(
          "Error retrieving Program Tuition and Fees value:",
          error.message
        );
      }
    }

    //*[@id="divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00"]/div/table[2]/tbody/tr[1]/td[5]

    scrapedData.push({
      SchoolName: SchoolName,
      InStateTuition: inStateTuitionValue,
      TuitionAndFees: tuitionAndFeesValue,
      TuitionAlone: tuitionAloneValue ? tuitionAloneValue : "",
      GradTuition: gradTuitionAlone,
      ProgramLength : ProgramLength
    });
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
