const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const urls = require("./inputs/urlsTEST.json");

const results = [];

const years = [2019, 2020, 2021, 2022];

async function getData() {
  for (const [index, url] of urls.entries()) {
    try {
      const response = await axios.get(url, { timeout: 30000 });
      const html = response.data;
      const $ = cheerio.load(html);
      const schoolName = $(".headerlg").text().trim();

      // ... other data extraction code ...

      const tuitionData = {
        tuitionAndFees: [],
        inStateTuition: [],
        outOfStateTuition: [],
      };

      years.forEach((year, i) => {
        let tuitionAndFees = $('td:contains("Tuition and fees")')
          .nextAll()
          .eq(i)
          .text()
          .trim();
        tuitionData.tuitionAndFees.push(tuitionAndFees || null);

        let inStateTuition = $('td:contains("In-state")')
          .nextAll()
          .eq(i)
          .text()
          .trim();
        tuitionData.inStateTuition.push(inStateTuition || null);

        let outOfStateTuition = $('td:contains("Out-of-state")')
          .nextAll()
          .eq(i)
          .text()
          .trim();
        tuitionData.outOfStateTuition.push(outOfStateTuition || null);
      });

      results.push({
        schoolName,
        // ... other data ...
        tuitionData,
      });

      console.log("Index: ", index);

      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.log("Index: ", index);
      console.log(error);
    }
  }

  fs.writeFile("outputs/colleges2.json", JSON.stringify(results), (err) => {
    if (err) throw err;
  });
}

getData();
