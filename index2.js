const puppeteer = require("puppeteer");
const fs = require("fs");

const urls = require("./inputs/urls.json");



async function scrapeData() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const scrapedData = [];

  const getRandomDelay = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }



  for (const url of urls) {
    await page.goto(url);

    console.log("URL = ", url);

    let inStateTuitionAndFeesValue = "";
    let inStateTuitionValue = "";
    let inStateFeesValue = "";
    let tuitionAndFeesValue = "";
    let tuitionAloneValue = "";
    let gradTuitionAlone = "";
    let gradFeesAlone = "";
    let SchoolName = "";
    let ProgramLength = "";
    let schoolAddressText = "";
    let feesAloneValue = "";

    // School Name
    try {
      SchoolName = await page.$eval(
        "#RightContent > div.dashboard > div > div:nth-child(2) > span > span",
        (element) => element.textContent.trim()
      );
      console.log("School Name Found Successfully with ", SchoolName);
    } catch (error) {
      console.log("Error retrieving school name value:", error.message);
    }

    // SCHOOL ADDRESS
    try {
      const schoolAddress = await page.$x(
        "//*[@id='RightContent']/div[4]/div/div[2]/span/text()"
      );
      if (schoolAddress.length > 0) {
        schoolAddressText = await page.evaluate(
          (element) => element.textContent.trim(),
          schoolAddress[0]
        );
        console.log(
          "School address Found Successfully with",
          schoolAddressText
        );
      } else {
        console.log("School address element not found");
      }
    } catch (error) {
      console.log("Error retrieving school address value:", error.message);
    }

    //CHECK FOR Program Length Header
    try {
      ProgramLength = await page.$eval(
        "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(3) > thead > tr > th:nth-child(2)",
        (element) => element.textContent.trim()
      );
    } catch (error) {
      console.log("Error retrieving school name value:", error.message);
    }




    // TUITION AND FEES SECTION
    // CHECK 1 IN-STATE and OUT-OF-STATE SEPERATE 4 YEARS OF DATA
    
    let TuitionFeesCheck1Identifier = "";
    // Check for in-StateRowHeader
    try {
      TuitionFeesCheck1Identifier = await page.$eval(
        "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(1)",
        (element) => element.textContent.trim()
      );
    } catch (error) {
      console.log("Error in InStateRowHeader Check 1: ", error.message);
    }

    // IF IN STATE ROW HEADER GRAB DATA
    if (TuitionFeesCheck1Identifier === "In-state"){
      try {
        inStateTuitionAndFeesValue = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(5)",
          (element) => element.textContent.trim()
        );
        console.log(
          "Tuition and Fees Check 1 Successful with ",
          inStateTuitionAndFeesValue
        );
      } catch (error) {
        console.log("Error in Tuition Check 1: ", error.message);
      }}
    


    // CHECK 2
    // TUITON AND FEES TOGETHER 4 YEARS OF DATA
    // CHECK FOR TUITON AND FEES ROW HEADER
      let TuitionFeesCheck2Identifier = "";
      try {
        TuitionFeesCheck2Identifier = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(3) > tbody > tr:nth-child(1) > td:nth-child(1)",
          (element) => element.textContent.trim()
        );
      } catch (error) {
        console.log("Error in Tuition and Fees Row Header Check 2: ", error.message);
      }
    // IF TUITION AND FEES ROW HEADER GRAB DATA
    if (TuitionFeesCheck2Identifier === "Tuition and fees"){
      try {
        tuitionAndFeesValue = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(3) > tbody > tr:nth-child(1) > td:nth-child(5)",
          (element) => element.textContent.trim()
        );
        console.log(
          "Tuition and Fees Check 2 Successful with ",
          tuitionAndFeesValue
        );
      } catch (error) {
        console.log("Error in Tuition Check 2: ", error.message);
      }}

    // CHECK 3
    // TUITION AND FEES SEPERATE 1 YEAR OF DATA PRESENTED GRADUATE STUDENT DATA ONLY
    // Tuition Specific

    let TuitionFeesCheck3Identifier = "";

    try {
      TuitionFeesCheck3Identifier = await page.$eval(
        "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(1) > thead > tr > th:nth-child(1)",
        (element) => element.textContent.trim()
      );
    } catch (error) {
      console.log("Error in Tuition Check 3: ", error.message);
    }

    if (
      TuitionFeesCheck3Identifier === "Average graduate student tuition and fees for academic year"
    ) {
      try {
        gradTuitionAlone = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2)",
          (element) => element.textContent.trim()
        );
        console.log("Tuition Check 3 Successful with ", gradTuitionAlone);
      } catch (error) {
        console.log("Error in Tuition Check 3: ", error.message);
      }
    }
    // Check 3
    // TUITION AND FEES SEPERATE 1 YEAR OF DATA PRESENTED
    // FEES Specific
    if (
      TuitionFeesCheck3Identifier ===
      "Average graduate student tuition and fees for academic year"
    ) {
      try {
        gradFeesAlone = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2)",
          (element) => element.textContent.trim()
        );
        console.log("Fees Check 3 Successful with ", gradFeesAlone);
      } catch (error) {
        console.log("Error in Fees Check 3: ", error.message);
      }
    }

    // CHECK 4
    // TUITION AND FEES SEPERATE UNDERGRAD AND GRAD SPLIT 1 YEAR OF DATA PRESENTED
    // TUITION SPECIFIC

    let TuitionFeesCheck4Identifier = "";

    try {
      TuitionFeesCheck4Identifier = await page.$eval(
        "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(1)",
        (element) => element.textContent.trim()
      );
    } catch (error) {
      console.log("Error in Tuition Check 4: ", error.message);
    }

    if (TuitionFeesCheck4Identifier === "Tuition") {
      try {
        tuitionAloneValue = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2)",
          (element) => element.textContent.trim()
        );
        console.log("TUITION Check 4 Successful with ", tuitionAloneValue);
      } catch (error) {
        console.log("Error in Tuition Check 4: ", error.message);
      }
    }

    // CHECK 4
    // TUITION AND FEES SEPERATE UNDERGRAD AND GRAD SPLIT 1 YEAR OF DATA PRESENTED
    // FEES SPECIFIC
    if (TuitionFeesCheck4Identifier === "Tuition") {
      try {
        feesAloneValue = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(2)",
          (element) => element.textContent.trim()
        );
        console.log("FEES Check 4 Successful with ", tuitionAloneValue);
      } catch (error) {
        console.log("Error in Tuition Check 4: ", error.message);
      }
    }

    // CHECK 5
    // UNDEGRAD AND GRAD SPLIT, IN-STATE AND OUT-OF-STATE SPLIT 1 YEAR OF DATA PRESENTED
    // TUITION SPECIFIC

    let TuitionFeesCheck5Identifier = "";
    try {
      TuitionFeesCheck5Identifier = await page.$eval(
        "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(1)",
        (element) => element.textContent.trim()
      );
      console.log("Check 5 Identifier Successful with ", TuitionFeesCheck5Identifier);
    } catch (error) {
      console.log("Error in Tuition Check 5: ", error.message);
    }

    if (TuitionFeesCheck5Identifier === "In-state tuition") {
      try {
        inStateTuitionValue = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2)",
          (element) => element.textContent.trim()
        );
        console.log(
          "TUITION AND FEES Check 5 Successful with ",
          inStateTuitionValue
        );
      } catch (error) {
        console.log("Error in Tuition Check 5: ", error.message);
      }
    }

    // CHECK 5
    // UNDEGRAD AND GRAD SPLIT, IN-STATE AND OUT-OF-STATE SPLIT 1 YEAR OF DATA PRESENTED
    // FEES SPECIFIC
    if (TuitionFeesCheck5Identifier === "In-state tuition") {
      try {
        inStateFeesValue = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(2)",
          (element) => element.textContent.trim()
        );
        console.log(
          "TUITION AND FEES Check 5 Successful with ",
          inStateFeesValue
        );
      } catch (error) {
        console.log("Error in Tuition Check 5: ", error.message);
      }
    }

    // CHECK 6
    // TUITION AND FEES SEPERATE ONLY GRAD STUDENT DATA AVAILABLE
    if (
      !tuitionAndFeesValue &&
      !inStateTuitionAndFeesValue &&
      !tuitionAloneValue &&
      ProgramLength != "Program Length"
    ) {
      try {
        gradTuitionAlone = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table > tbody > tr:nth-child(1) > td:nth-child(2)",
          (element) => element.textContent.trim()
        );
        console.log("Grad TUITION Check 6 Successful with ", gradTuitionAlone);
      } catch (error) {
        console.log("Error retrieving tuition alone value:", error.message);
      }
    }


    // CHECK 7 PROGRAM SPECIFIC SCHOOL GETS TUITION AND FEES FOR MOST POPULAR PROGRAM

    let programFocused = false;
    let booksAndSuppliesValue = "";

    if (ProgramLength === "Program Length") {
      programFocused = true;
      try {
        tuitionAndFeesValue = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(4) > tbody > tr:nth-child(1) > td:nth-child(5)",
          (element) => element.textContent.trim()
        );
         console.log(
           "Program Specific Check 7 Successful with ",
           tuitionAndFeesValue
         );
      } catch (error) {
        console.log(
          "Error retrieving Program Tuition and Fees value:",
          error.message
        );
      }
    }

     if (ProgramLength === "Program Length") {
       programFocused = true;
       try {
         booksAndSuppliesValue = await page.$eval(
           "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(4) > tbody > tr:nth-child(2) > td:nth-child(5)",
           (element) => element.textContent.trim()
         );
         console.log(
           "Program Specific books and supplies check 7 ",
           booksAndSuppliesValue
         );
       } catch (error) {
         console.log(
           "Error retrieving Program Tuition and Fees value:",
           error.message
         );
       }
     }

    // CHECK FOR BOOKS AND SUPPLIES HEADER 1

    let booksAndSuppliesRowHeaderCase1 = "";

    try {
      booksAndSuppliesRowHeaderCase1 = await page.$eval(
        "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(3) > tbody > tr:nth-child(4) > td:nth-child(1)",
        (element) => element.textContent.trim()
      );
    } catch (error) {
      console.log(
        "Error retrieving Program Tuition and Fees value:",
        error.message
      );
    }

    // IF booksAndSuppliesRowHeaderCase1 IS CORRECT
    if (booksAndSuppliesRowHeaderCase1 === "Books and supplies") {
      try {
        booksAndSuppliesValue = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(3) > tbody > tr:nth-child(4) > td:nth-child(5)",
          (element) => element.textContent.trim()
        );
      } catch (error) {
        console.log(
          "Error retrieving Program Tuition and Fees value:",
          error.message
        );
      }
    }

    // CHECK FOR BOOKS AND SUPPLIES HEADER 2
    let booksAndSuppliesRowHeaderCase2 = "";
    try {
      booksAndSuppliesRowHeaderCase2 = await page.$eval(
        "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(1)",
        (element) => element.textContent.trim()
      );
    } catch (error) {
      console.log(
        "Error retrieving Program Tuition and Fees value:",
        error.message
      );
    }

    // IF booksAndSuppliesRowHeaderCase2 IS CORRECT
    if (booksAndSuppliesRowHeaderCase2 === "Books and supplies") {
      try {
        booksAndSuppliesValue = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(5)",
          (element) => element.textContent.trim()
        );
      } catch (error) {
        console.log(
          "Error retrieving Program Tuition and Fees value:",
          error.message
        );
      }
    }

    // ON CAMPUS ROOM AND BOARD CHECK CASE 1
    let onCampusRowHeaderCase1 = "";
    let onCampusRoomAndBoardValue = "";

    try {
      onCampusRowHeaderCase1 = await page.$eval(
        "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(3) > tbody > tr:nth-child(6) > td:nth-child(1)",
        (element) => element.textContent.trim()
      );
    } catch (error) {
      console.log("Error retrieving onCampusRowHeader", error.message);
    }

    // CHECK IF onCampusRowHeaderCase1 IS CORRECT
    if (onCampusRowHeaderCase1 === "On Campus") {
      try {
        onCampusRoomAndBoardValue = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(3) > tbody > tr:nth-child(7) > td:nth-child(5)",
          (element) => element.textContent.trim()
        );
      } catch (error) {
        console.log(
          "Error retrieving Program Tuition and Fees value:",
          error.message
        );
      }
    }

    // ON CAMPUS ROOM AND BOARD CHECK CASE 2
    let onCampusRowHeaderCase2 = "";

    try {
      onCampusRowHeaderCase2 = await page.$eval(
        "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(3) > tbody > tr:nth-child(4) > td:nth-child(1)",
        (element) => element.textContent.trim()
      );
    } catch (error) {
      console.log("Error retrieving onCampusRowHeader", error.message);
    }

    // CHECK IF onCampusRowHeaderCase2 IS CORRECT
    if (onCampusRowHeaderCase2 === "On Campus") {
      try {
        onCampusRoomAndBoardValue = await page.$eval(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl00 > div > table:nth-child(3) > tbody > tr:nth-child(5) > td:nth-child(5)",
          (element) => element.textContent.trim()
        );
      } catch (error) {
        console.log(
          "Error retrieving Program Tuition and Fees value:",
          error.message
        );
      }
    }

    console.log("\n")

    scrapedData.push({
      Url: url,
      SchoolName: SchoolName,
      SchoolAddress: schoolAddressText,
      InStateTuitionAndFees: inStateTuitionAndFeesValue,
      TuitionAndFees: tuitionAndFeesValue,
      TuitionAlone: tuitionAloneValue,
      FeesAlone : feesAloneValue,
      GradTuition: gradTuitionAlone,
      GradFees: gradFeesAlone,
      BooksandSupplies: booksAndSuppliesValue,
      OnCampusRoomAndBoard: onCampusRoomAndBoardValue,
      ProgramFocused: programFocused,
      InStateTuition: inStateTuitionValue,
      InStateFees: inStateFeesValue
    });
  }
    const delayTime = getRandomDelay(2000, 4000); // Random delay between 2 to 4 seconds
    await delay(delayTime);
   
  await browser.close();


  fs.writeFile("outputs/colleges.json", JSON.stringify(scrapedData), (err) => {
    if (err) throw err;
  });

  return scrapedData;
}

scrapeData();
