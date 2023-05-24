
import fs from "fs";
import puppeteer from "puppeteer";
import urls from "./inputs/set1urls.json" assert { type: "json" };
import checkSelectors from "./checkSelectors.json" assert { type: "json" };
import dataSelectors from "./dataSelectors.json" assert { type: "json" };

async function scrapeData() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const scrapedData = [];


  // helper functions for timing of the scraper
  const getRandomDelay = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  for (const url of urls) {
    await page.goto(url, { timeout: 60000 });
    console.log("URL = ", url);

    // INITIALIZE VARIABLES

    let inStateTuitionAndFeesValue = "";
    let inDistrictTuitionAndFeesValue = "";
    let outStateTuitionAndFeesValue = "";
    let inStateTuitionValue = "";
    let inStateFeesValue = "";
    let tuitionAndFeesValue = "";
    let tuitionAloneValue = "";
    let gradTuitionAlone = "";
    let gradFeesAlone = "";
    let feesAloneValue = "";
    let onCampusRoomAndBoardValue = "";
    let programFocused = false;
    let booksAndSuppliesValue = "";

    async function fetchPageData(selector, type = "css") {
      try {
        let result;
        if (type === "css") {
          result = await page.$eval(selector, (element) =>
            element.textContent.trim()
          );
        } else if (type === "xpath") {
          const elements = await page.$x(selector);
          if (elements.length > 0) {
            result = await page.evaluate(
              (element) => element.textContent.trim(),
              elements[0]
            );
          } else {
            console.log(`${selector} element not found`);
            return null;
          }
        }
        console.log(`Data Found Successfully with ${result}`);
        return result;
      } catch (error) {
        console.log(
          `Error retrieving data from selector: ${selector}`,
          error.message
        );
      }
    }

    // GENERAL INFORMATION
    let schoolName = await fetchPageData(
      dataSelectors.schoolNameSelector,
      "css"
    );
    let schoolAddress = await fetchPageData(
      dataSelectors.schoolAddressXPath,
      "xpath"
    );
    let programLength = await fetchPageData(
      dataSelectors.programLengthSelector,
      "css"
    );
  
   let IpedsString = await fetchPageData(dataSelectors.ipedsIDXPath,"xpath")

   let IpedsID;
   try {
    let match = IpedsString.match(/\d+/);
    if (match !== null) {
      IpedsID = match[0];
    } else {
      console.error("No match found");
    }
   } catch (error) {
    console.error("An error occurred: ", error);
   }


    // TUITION AND FEES SECTION
    // CHECK 1
    // IN-STATE and OUT-OF-STATE SEPERATE
    // 4 YEARS OF DATA
    let TuitionFeesCheck1Identifier = await fetchPageData(
      checkSelectors.TuitionFeesCheck1IdentifierSelector,
      "css"
    );
    if (TuitionFeesCheck1Identifier === "In-state") {
      inStateTuitionAndFeesValue = await fetchPageData(
        dataSelectors.TuitionCheck1Selector,
        "css"
      );
    }

    // CHECK 2
    // TUITON AND FEES TOGETHER
    // 4 YEARS OF DATA
    let TuitionFeesCheck2Identifier = await fetchPageData(
      checkSelectors.TuitionFeesCheck2IdentifierSelector,
      "css"
    );
    if (TuitionFeesCheck2Identifier === "Tuition and fees") {
      tuitionAndFeesValue = await fetchPageData(
        dataSelectors.TuitionCheck2Selector,
        "css"
      );
    }

    // CHECK 3
    // TUITION AND FEES SEPERATE
    //1 YEAR OF DATA PRESENTED
    // GRADUATE STUDENT DATA ONLY
    let TuitionFeesCheck3Identifier = await fetchPageData(
      checkSelectors.TuitionFeesCheck3IdentifierSelector,
      "css"
    );
    if (
      TuitionFeesCheck3Identifier ===
      "Average graduate student tuition and fees for academic year"
    ) {
      gradTuitionAlone = await fetchPageData(
        dataSelectors.TuitionCheck3Selector,
        "css"
      );
      gradFeesAlone = await fetchPageData(
        dataSelectors.FeesCheck3Selector,
        "css"
      );
    }

    // CHECK 4
    // TUITION AND FEES SEPERATE
    // UNDERGRAD AND GRAD SEPERATE
    // 1 YEAR OF DATA PRESENTED
    let TuitionFeesCheck4Identifier = await fetchPageData(
      checkSelectors.TuitionFeesCheck4IdentifierSelector,
      "css"
    );
    if (TuitionFeesCheck4Identifier === "Tuition") {
      tuitionAloneValue = await fetchPageData(
        dataSelectors.TuitionCheck4Selector,
        "css"
      );
      feesAloneValue = await fetchPageData(
        dataSelectors.FeesCheck4Selector,
        "css"
      );
    }

    // CHECK 5
    // UNDEGRAD AND GRAD SEPERATE
    // IN-STATE AND OUT-OF-STATE SEPERATE
    // 1 YEAR OF DATA PRESENTED
    let TuitionFeesCheck5Identifier = await fetchPageData(
      checkSelectors.TuitionFeesCheck5IdentifierSelector,
      "css"
    );
    if (TuitionFeesCheck5Identifier === "In-state tuition") {
      inStateTuitionValue = await fetchPageData(
        dataSelectors.TuitionCheck5Selector,
        "css"
      );
      inStateFeesValue = await fetchPageData(
        dataSelectors.FeesCheck5Selector,
        "css"
      );
    }

    // CHECK 6
    // TUITION AND FEES SEPERATE ONLY GRAD STUDENT DATA AVAILABLE
    //!! This may need to be modified with an identifier !!
    if (
      !tuitionAndFeesValue &&
      !inStateTuitionAndFeesValue &&
      !tuitionAloneValue &&
      programLength != "Program Length"
    ) {
      gradTuitionAlone = await fetchPageData(
        dataSelectors.TuitionCheck6Selector,
        "css"
      );
    }

    // CHECK 7
    // PROGRAM SPECIFIC SCHOOL
    // GETS TUITION AND FEES FOR MOST POPULAR PROGRAM
    if (programLength === "Program Length") {
      programFocused = true;
      tuitionAndFeesValue = await fetchPageData(
        dataSelectors.TuitionFeesCheck7Selector,
        "css"
      );
      booksAndSuppliesValue = await fetchPageData(
        dataSelectors.ProgramFocusedBooksSuppliesSelector,
        "css"
      );
    }

    // CHECK 8
    // IN DISTRICT AVAILABLE
    // 4 YEARS DATA
    let TuitionFeesCheck8Identifier = await fetchPageData(
      checkSelectors.TuitionFeesCheck8IdentifierSelector,
      "css"
    );
    if (TuitionFeesCheck8Identifier === "In-district") {
      inStateTuitionAndFeesValue = await fetchPageData(
        dataSelectors.TuitonFeesCheck8SelectorInState,
        "css"
      );
      inDistrictTuitionAndFeesValue = await fetchPageData(
        dataSelectors.TuitonFeesCheck8SelectorInDistrict,
        "css"
      );
      outStateTuitionAndFeesValue = await fetchPageData(
        dataSelectors.TuitonFeesCheck8SelectorOutState,
        "css"
      );
    }

    // CHECK FOR BOOKS AND SUPPLIES HEADER 1
    let booksAndSuppliesCheck1Identifier = await fetchPageData(
      checkSelectors.BooksSuppliesCheck1IdentifierSelector,
      "css"
    );
    if (booksAndSuppliesCheck1Identifier === "Books and supplies") {
      booksAndSuppliesValue = await fetchPageData(
        dataSelectors.BooksSuppliesCheck1Selector,
        "css"
      );
    }

    // CHECK FOR BOOKS AND SUPPLIES HEADER 2
    let booksAndSuppliesCheck2Identifier = await fetchPageData(
      checkSelectors.BooksSuppliesCheck2IdentifierSelector,
      "css"
    );
    if (booksAndSuppliesCheck2Identifier === "Books and supplies")
      booksAndSuppliesValue = await fetchPageData(
        dataSelectors.BooksSuppliesCheck2Selector,
        "css"
      );

    // // CHECK FOR BOOKS AND SUPPLIES HEADER 3
    let booksAndSuppliesCheck3Identifier = await fetchPageData(
      checkSelectors.BooksSuppliesCheck3IdentifierSelector,
      "css"
    );
    if (booksAndSuppliesCheck3Identifier === "Books and supplies") {
      booksAndSuppliesValue = await fetchPageData(
        dataSelectors.BooksSuppliesCheck3Selector,
        "css"
      );
    }

    // ON CAMPUS ROOM AND BOARD CHECK CASE 1
    let onCampusRowHeaderCase1 = await fetchPageData(
      checkSelectors.OnCampusRoomAndBoardCheck1IdentifierSelector,
      "css"
    );
    if (onCampusRowHeaderCase1 === "On Campus") {
      onCampusRoomAndBoardValue = await fetchPageData(
        dataSelectors.OnCampusRoomAndBoardCheck1Selector,
        "css"
      );
    }

    // ON CAMPUS ROOM AND BOARD CHECK CASE 2
    let onCampusRowHeaderCase2 = await fetchPageData(
      checkSelectors.OnCampusRoomAndBoardCheck2IdentifierSelector,
      "css"
    );
    if (onCampusRowHeaderCase2 === "On Campus") {
      onCampusRoomAndBoardValue = await fetchPageData(
        dataSelectors.OnCampusRoomAndBoardCheck2Selector,
        "css"
      );
    }

    // ON CAMPUS ROOM AND BOARD CHECK CASE 3
    let onCampusRowHeaderCase3 = await fetchPageData(
      checkSelectors.OnCampusRoomAndBoardCheck3IdentifierSelector,
      "css"
    );
    if (onCampusRowHeaderCase3 === "On Campus") {
      onCampusRoomAndBoardValue = await fetchPageData(
        dataSelectors.OnCampusRoomAndBoardCheck3Selector,
        "css"
      );
    }

    // END SCRAPING LOGIC

    // Space in console.log and random delay
    console.log("\n");
    const delayTime = getRandomDelay(2000, 4000); // Random delay between 2 to 4 seconds
    await delay(delayTime);

    scrapedData.push({
      Url: url,
      ID: IpedsID,
      SchoolName: schoolName,
      SchoolAddress: schoolAddress,
      InStateTuitionAndFees: inStateTuitionAndFeesValue,
      InDistrictTuitionAndFees: inDistrictTuitionAndFeesValue,
      OutStateTuitionAndFees: outStateTuitionAndFeesValue,
      TuitionAndFees: tuitionAndFeesValue,
      TuitionAlone: tuitionAloneValue,
      FeesAlone: feesAloneValue,
      GradTuition: gradTuitionAlone,
      GradFees: gradFeesAlone,
      BooksandSupplies: booksAndSuppliesValue,
      OnCampusRoomAndBoard: onCampusRoomAndBoardValue,
      ProgramFocused: programFocused,
      InStateTuition: inStateTuitionValue,
      InStateFees: inStateFeesValue,
    });
  }

  await browser.close();

  fs.writeFile("outputs/set1results.json", JSON.stringify(scrapedData,null,4), (err) => {
    if (err) throw err;
  });

  return scrapedData;
}

scrapeData();
