const puppeteer = require('puppeteer');
const fs = require('fs');
const urls = require('./inputs/urlsTEST.json');

async function getData() {
  const browser = await puppeteer.launch({ headless: true });
  const results = [];

  for (let url of urls) {
    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });

      const data = await page.evaluate(() => {
        const schoolName = document.querySelector('.headerlg').innerText.trim();
        let tuitionData = {};

        // Case 1
        let inStateRow = Array.from(document.querySelectorAll('td')).find(td => td.innerText.includes('In-state'))?.parentElement;
        let outStateRow = Array.from(document.querySelectorAll('td')).find(td => td.innerText.includes('Out-of-state'))?.parentElement;
        if (inStateRow && outStateRow) {
          tuitionData.inStateTuitionAndFees = inStateRow.lastElementChild.previousElementSibling.innerText.trim().replace(/[^0-9.-]+/g, "");
          tuitionData.outStateTuitionAndFees = outStateRow.lastElementChild.previousElementSibling.innerText.trim().replace(/[^0-9.-]+/g, "");
          return {schoolName, tuitionData};
        }

        // Case 2
        let tuitionAndFeesRow = Array.from(document.querySelectorAll('td')).find(td => td.innerText.includes('Tuition and fees'))?.parentElement;
        if (tuitionAndFeesRow) {
          tuitionData.tuitionAndFees = tuitionAndFeesRow.lastElementChild.previousElementSibling.innerText.trim().replace(/[^0-9.-]+/g, "");
          return {schoolName, tuitionData};
        }

        // Case 3
        // Similar to A T Still University of Health Sciences
        let avgGradStudentTuitionAndFeesRow = Array.from(document.querySelectorAll('th')).find(th => th.innerText.includes('Average graduate student tuition and fees for academic year'));
        if (avgGradStudentTuitionAndFeesRow) {
          const tuitionRow = Array.from(document.querySelectorAll("td")).find(
            (td) => td.innerText.includes("Tuition")
          )?.parentElement;
          const feesRow = Array.from(document.querySelectorAll("td")).find(
            (td) => td.innerText.includes("Fees")
          )?.parentElement;
          if (tuitionRow && feesRow) {
            tuitionData.tuition = tuitionRow.children[1].innerText
              .trim()
              .replace(/[^0-9.-]+/g, "");
            tuitionData.fees = feesRow.children[1].innerText
              .trim()
              .replace(/[^0-9.-]+/g, "");
            return { schoolName, tuitionData };
          }
        }

        // Case 4 - Amridge University
        else if (
          $('td:contains("Undergraduate student tuition and fees")').length > 0
        ) {
          const undergradTuitionRow = $(
            'td:contains("Undergraduate student tuition and fees")'
          )
            .parent()
            .next();
          const gradTuitionRow = $(
            'td:contains("Graduate student tuition and fees")'
          )
            .parent()
            .next();

          const undergradTuition = $(undergradTuitionRow)
            .find("td")
            .eq(1)
            .text()
            .trim()
            .replace(/[^0-9.-]+/g, "");
          const undergradFees = $(undergradTuitionRow)
            .next()
            .find("td")
            .eq(1)
            .text()
            .trim()
            .replace(/[^0-9.-]+/g, "");
          const gradTuition = $(gradTuitionRow)
            .find("td")
            .eq(1)
            .text()
            .trim()
            .replace(/[^0-9.-]+/g, "");
          const gradFees = $(gradTuitionRow)
            .next()
            .find("td")
            .eq(1)
            .text()
            .trim()
            .replace(/[^0-9.-]+/g, "");

          tuitionData.tuition = undergradTuition || null;
          tuitionData.fees = undergradFees || null;
          tuitionData.gradTuition = gradTuition || null;
          tuitionData.gradFees = gradFees || null;

          return { schoolName, tuitionData };
        }

        // Check for Case 5 - Athens State University
        else if (
          $('td:contains("Undergraduate student tuition and fees")').length > 0
        ) {
          const tuitionTable = $(
            'td:contains("Undergraduate student tuition and fees")'
          ).closest("table");
          const rows = $(tuitionTable).find("tr");

          let inStateTuition = null;
          let inStateFees = null;
          let outStateTuition = null;
          let outStateFees = null;

          $(rows).each((index, row) => {
            const rowData = $(row)
              .find("td")
              .map((_, cell) => $(cell).text().trim())
              .get();

            if (rowData[0] === "In-state tuition") {
              inStateTuition = rowData[1].replace(/[^0-9.-]+/g, "") || null;
            }

            if (rowData[0] === "In-state fees") {
              inStateFees = rowData[1].replace(/[^0-9.-]+/g, "") || null;
            }

            if (rowData[0] === "Out-of-state tuition") {
              outStateTuition = rowData[1].replace(/[^0-9.-]+/g, "") || null;
            }

            if (rowData[0] === "Out-of-state fees") {
              outStateFees = rowData[1].replace(/[^0-9.-]+/g, "") || null;
            }
          });

          tuitionData.inStateTuition = inStateTuition;
          tuitionData.inStateFees = inStateFees;
          tuitionData.outStateTuition = outStateTuition;
          tuitionData.outStateFees = outStateFees;

          return { schoolName, tuitionData };
        }

        // Check for Case 7 - University of California-Hastings College of Law
        else if (
          $("#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl04").length > 0
        ) {
          const gradTuitionTable = $(
            "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl04"
          );
          const tuitionRow = $(gradTuitionTable)
            .find('td:contains("Graduate (out-of-state)")')
            .parent();

          tuitionData.gradOutStateTuitionAndFees = $(tuitionRow)
            .find("td")
            .eq(1)
            .text()
            .trim()
            .replace(/[^0-9.-]+/g, "");

          return { schoolName, tuitionData };
        }


        // Case 8
        // Similar to Athens State University
        let undergradTuitionTableCase8 = document.querySelector('#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl03');
        if (undergradTuitionTableCase8) {
          const inStateRow = Array.from(undergradTuitionTableCase8.querySelectorAll('td')).find(td => td.innerText.includes('In-state tuition'))?.parentElement;
          const outStateRow = Array.from(undergradTuitionTableCase8.querySelectorAll('td')).find(td => td.innerText.includes('Out-of-state tuition'))?.parentElement;
          if (inStateRow && outStateRow) {            tuitionData.inStateTuitionAndFees = inStateRow.children[1].innerText.trim().replace(/[^0-9.-]+/g, "");
            tuitionData.outStateTuitionAndFees = outStateRow.children[1].innerText.trim().replace(/[^0-9.-]+/g, "");
            return {schoolName, tuitionData};
          }
        }

        return {schoolName, tuitionData};
      });

      results.push(data);

      console.log('Scraped data for:', data.schoolName);
      await page.close();
    } catch (error) {
      console.log('Error scraping data:', error);
    }
  }

  await browser.close();

  fs.writeFile(
    'outputs/colleges4.json',
    JSON.stringify(results, null, 2),
    (err) => {
      if (err) throw err;
      console.log('Data saved successfully!');
    }
  );
}

getData();

