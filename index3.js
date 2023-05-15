const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const urls = require("./inputs/urlsTEST.json");

const results = [];

async function getData() {
  for (const [index, url] of urls.entries()) {
    try {
      const response = await axios.get(url, { timeout: 30000 });
      const html = response.data;
      const $ = cheerio.load(html);
      const schoolName = $(".headerlg").text().trim();

      const tuitionData = {};

      // Check for Case 1
      if (
        $('td:contains("In-state")').length > 0 &&
        $('td:contains("Out-of-state")').length > 0
      ) {
        const inStateRow = $('td:contains("In-state")').parent();
        const outStateRow = $('td:contains("Out-of-state")').parent();

        tuitionData.inStateTuitionAndFees = $(inStateRow)
          .find("td")
          .eq(4)
          .text()
          .trim()
          .replace(/[^0-9.-]+/g, "");
        tuitionData.outStateTuitionAndFees = $(outStateRow)
          .find("td")
          .eq(4)
          .text()
          .trim()
          .replace(/[^0-9.-]+/g, "");
      }

      // Check for Case 2
      else if ($('td:contains("Tuition and fees")').length > 0) {
        tuitionData.tuitionAndFees = $('td:contains("Tuition and fees")')
          .siblings()
          .last()
          .prev()
          .text()
          .trim()
          .replace(/[^0-9.-]+/g, "");
      }

      // Check for Case 3
      // Check for Case 3 - A T Still University of Health Sciences
      else if (
        $(
          'th:contains("Average graduate student tuition and fees for academic year")'
        ).length > 0
      ) {
        const tuitionRow = $('td:contains("Tuition")').parent();
        const feesRow = $('td:contains("Fees")').parent();

        tuitionData.tuition =
          $(tuitionRow)
            .find("td")
            .eq(1)
            .text()
            .trim()
            .replace(/[^0-9.-]+/g, "") || null;
        tuitionData.fees =
          $(feesRow)
            .find("td")
            .eq(1)
            .text()
            .trim()
            .replace(/[^0-9.-]+/g, "") || null;
      }

      // Check for Case 4 - Amridge University
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
      }

      // Check for Case 6
      else if ($('td:contains("Tuition and fees")').length > 0) {
        tuitionData.tuitionAndFees = $('td:contains("Tuition and fees")')
          .nextAll()
          .last()
          .text()
          .trim()
          .replace(/[^0-9.-]+/g, "");
      }
      // Check for Case 7 - Similar to University of California-Hastings College of Law
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
      }

      // Check for Case 8 - Similar to Athens State University
      else if (
        $("#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl03").length > 0
      ) {
        const undergradTuitionTable = $(
          "#divctl00_cphCollegeNavBody_ucInstitutionMain_ctl03"
        );
        const inStateRow = $(undergradTuitionTable)
          .find('td:contains("In-state tuition")')
          .parent();
        const outStateRow = $(undergradTuitionTable)
          .find('td:contains("Out-of-state tuition")')
          .parent();

        tuitionData.inStateTuitionAndFees = $(inStateRow)
          .find("td")
          .eq(1)
          .text()
          .trim()
          .replace(/[^0-9.-]+/g, "");
        tuitionData.outStateTuitionAndFees = $(outStateRow)
          .find("td")
          .eq(1)
          .text()
          .trim()
          .replace(/[^0-9.-]+/g, "");
      }



      results.push({
        schoolName,
        tuitionData,
      });

      console.log("Index: ", index);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.log("Index: ", index);
      console.log(error);
    }
  }

  fs.writeFile(
    "outputs/colleges3.json",
    JSON.stringify(results, null, 2),
    (err) => {
      if (err) throw err;
    }
  );
}

getData();
