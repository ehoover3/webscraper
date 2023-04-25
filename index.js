// const fs = require("fs");
// const axios = require("axios");
// const cheerio = require("cheerio");

// const urls = require("./urlsTEST");

// const testUrls = [
//   // "https://nces.ed.gov/collegenavigator/?q=the+new+school&s=all&id=193654",
//   // "https://nces.ed.gov/collegenavigator/?s=KS&id=154688",
//   "https://nces.ed.gov/collegenavigator/?q=purdue&s=all&id=243780",
// ];

// const results = [];

// urls.forEach((url) => {
//   axios
//     .get(url)
//     .then((response) => {
//       const html = response.data;
//       const $ = cheerio.load(html);

//       const schoolName = $(".headerlg").text().trim();
//       const phoneNumber = $('td:contains("General information:")').next().text().trim();
//       const website = $('td:contains("Website:")').next().text().trim();
//       const type = $('td:contains("Type:")').next().text().trim();
//       const awardsOffered = $('td:contains("Awards offered:")').next().text().trim();
//       const campusSetting = $('td:contains("Campus setting:")').next().text().trim();
//       const campusHousing = $('td:contains("Campus housing:")').next().text().trim();
//       const studentPopulation = $('td:contains("Student population:")').next().text().trim();
//       const studentToFacultyRatio = $('td:contains("Student-to-faculty ratio:")').next().text().trim();
//       const tuitionAndFees = $('td:contains("Tuition and fees")').next().next().next().next().text();
//       const inStateTuition = $('td:contains("In-state")').next().next().next().next().text();
//       const outOfStateTuition = $('td:contains("Out-of-state")').next().next().next().next().text();
//       const booksAndSupplies = $('td:contains("Books and supplies")').next().next().next().next().text();

//       const onCampusRoomAndBoard = $('td:contains("Living arrangement")').parent().nextAll().eq(1).find("td:eq(4)").text();
//       const onCampusOther = $('td:contains("Living arrangement")').parent().nextAll().eq(2).find("td:eq(4)").text();
//       const offCampusRoomAndBoard = $('td:contains("Living arrangement")').parent().nextAll().eq(4).find("td:eq(4)").text();
//       const offCampusOther = $('td:contains("Living arrangement")').parent().nextAll().eq(5).find("td:eq(4)").text();
//       const offCampusWithFamilyOther = $('td:contains("Living arrangement")').parent().nextAll().eq(7).find("td:eq(4)").text();

//       // TODO averageGraduateStudentInStateTuition
//       // TODO averageGraduateStudentInStateFees
//       // TODO averageGraduateStudentOutOfStateStateTuition
//       // TODO averageGraduateStudentOutOfStateFees

//       // TODO Undergraduate enrollment
//       // TODO Graduate enrollment

//       // TODO SAT Evidence-Based Reading and Writing
//       // TODO SAT Math
//       // TODO ACT Composite
//       // TODO ACT English
//       // TODO ACT Math

//       // TODO Agricultural and Extension Education Services
//       // TODO Agricultural Business and Management, General
//       // TODO Agricultural Communication/Journalism
//       // TODO Agricultural Economics
//       // TODO Agricultural Mechanization, General
//       // TODO Agriculture, General
//       // TODO Agroecology and Sustainable Agriculture
//       // TODO Agronomy and Crop Science
//       // TODO Animal Sciences, General
//       // TODO Farm/Farm and Ranch Management
//       // TODO Food Science
//       // TODO Horticultural Science
//       // TODO Soil Science and Agronomy, General
//       // TODO Turf and Turfgrass Management
//       // TODO Veterinary Medicine
//       // TODO Veterinary Sciences/Veterinary Clinical Sciences, General
//       // TODO Veterinary/Animal Health Technology/Technician and Veterinary Assistant
//       // TODO Landscape Architecture
//       // TODO African-American/Black Studies
//       // TODO American/United States Studies/Civilization
//       // TODO Asian Studies/Civilization
//       // TODO Italian Studies
//       // TODO Women's Studies
//       // TODO Biochemistry
//       // TODO Biochemistry and Molecular Biology
//       // TODO Biological and Biomedical Sciences, Other
//       // TODO Biology/Biological Sciences, General
//       // TODO Biomedical Sciences, General
//       // TODO Biotechnology
//       // TODO Botany/Plant Biology
//       // TODO Cell/Cellular and Molecular Biology
//       // TODO Ecology and Evolutionary Biology
//       // TODO Entomology
//       // TODO Exercise Physiology and Kinesiology
//       // TODO Genetics, General
//       // TODO Microbiology and Immunology
//       // TODO Neurobiology and Anatomy
//       // TODO Pharmacology
//       // TODO Plant Genetics
//       // TODO Toxicology
//       // TODO Accounting
//       // TODO Actuarial Science
//       // TODO Business Administration and Management, General
//       // TODO Business/Corporate Communications, General
//       // TODO Business/Corporate Communications, Other
//       // TODO Entrepreneurial and Small Business Operations, Other
//       // TODO Finance, General
//       // TODO Financial Planning and Services
//       // TODO Hotel/Motel Administration/Management
//       // TODO Human Resources Development
//       // TODO Human Resources Management/Personnel Administration, General
//       // TODO Logistics, Materials, and Supply Chain Management
//       // TODO Management Science
//       // TODO Management Sciences and Quantitative Methods, Other
//       // TODO Marketing Research
//       // TODO Marketing/Marketing Management, General
//       // TODO Operations Management and Supervision
//       // TODO Organizational Leadership
//       // TODO Selling Skills and Sales Operations
//       // TODO Communication, General
//       // TODO Speech Communication and Rhetoric
//       // TODO Artificial Intelligence
//       // TODO Computer and Information Sciences, Other
//       // TODO Computer and Information Sciences, General
//       // TODO Computer and Information Systems Security/Auditing/Information Assurance
//       // TODO Computer Graphics
//       // TODO Computer Science
//       // TODO Computer Systems Analysis/Analyst
//       // TODO Information Science/Studies
//       // TODO Information Technology
//       // TODO Information Technology Project Management
//       // TODO Adult and Continuing Education and Teaching
//       // TODO Agricultural Teacher Education
//       // TODO Art Teacher Education
//       // TODO Bilingual and Multilingual Education
//       // TODO Curriculum and Instruction
//       // TODO Early Childhood Education and Teaching
//       // TODO Education, General
//       // TODO Education, Other
//       // TODO Education/Teaching of the Gifted and Talented
//       // TODO Educational Evaluation and Research
//       // TODO Educational Leadership and Administration, General
//       // TODO Educational Statistics and Research Methods
//       // TODO Educational/Instructional Technology
//       // TODO Elementary Education and Teaching
//       // TODO English/Language Arts Teacher Education
//       // TODO Physical Education Teaching and Coaching
//       // TODO Science, Technology, Engineering, and Mathematics (STEM) Educational Methods
//       // TODO Social Studies Teacher Education
//       // TODO Special Education and Teaching, Other
//       // TODO Technology Teacher Education/Industrial Arts Teacher Education
//       // TODO Aerospace, Aeronautical, and Astronautical/Space Engineering, General
//       // TODO Agricultural Engineering
//       // TODO Bioengineering and Biomedical Engineering
//       // TODO Chemical Engineering
//       // TODO Civil Engineering, General
//       // TODO Computer Engineering, General
//       // TODO Construction Engineering
//       // TODO Electrical and Electronics Engineering
//       // TODO Engineering, General
//       // TODO Engineering, Other
//       // TODO Environmental/Environmental Health Engineering
//       // TODO Industrial Engineering
//       // TODO Materials Engineering
//       // TODO Mechanical Engineering
//       // TODO Nuclear Engineering
//       // TODO Telecommunications Engineering
//       // TODO
//       // TODO (continue to add other programs)
//       // TODO
//       // TODO
//       // TODO
//       // TODO
//       // TODO
//       // TODO

//       // TODO (Campus Security and Safety)

//       // ODO Cohort Default Rates

//       results.push({ schoolName, phoneNumber, website });
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// });

// const outputFilename = "outputs/colleges.json";

// fs.writeFile(outputFilename, JSON.stringify(results), (err) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(`File ${outputFilename} written successfully`);
//   }
// });

////////////////////////////

// 1. Each College has an IPEDS id
// 2. Get all of the IPEDS id's from the nces.ed.gov/ipeds

// End Goal is an array of objects with college data from nces.ed.gov/collegenavigator

// Goal 1:  Id should be the ipeds id
// Goal 2:  Can you create an async await, so that the fetch request go in order, & don't overwhelm the server
// Goal 3:  Can you add one piece of data reliably?
////// college tuition... can be private, in-state, out-of-state, in-district, other
////// college data could 2022-2023 only vs the last 4 years
//////
////// recommend starting with "Undergraduate enrollment"

const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const urls = require("./inputs/urlsTEST.json");

const results = [];

urls.forEach((url, index) => {
  axios
    .get(url, { timeout: 30000 })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      const schoolName = $(".headerlg").text().trim();
      const phoneNumber = $('td:contains("General information:")').next().text().trim();
      const website = $('td:contains("Website:")').next().text().trim();

      results.push({
        id: index,
        schoolName,
        phoneNumber,
        website,
      });

      console.log("Index: ", index);

      fs.writeFile("outputs/colleges.json", JSON.stringify(results), (err) => {
        if (err) throw err;
        // console.log(`${index} Results saved to file!`);
      });
    })
    .catch((error) => {
      console.log("Index: ", index);
      // console.log("schoolName: ", schoolName);
      console.log(error);
    });
});

////////////////////////
