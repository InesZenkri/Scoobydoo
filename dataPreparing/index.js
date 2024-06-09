import { FileService } from "./FileService.js";
import { HackathonPage } from "./HackathonPage.js";
import "dotenv/config";
async function main(count) {
  const Page = new HackathonPage(
    process.env.LINK,
    process.env.EMAIL,
    process.env.PASSWORD
  );
  const Service = new FileService(
    process.env.READ_FILE,
    process.env.OUTPUT_FOLDER
  );
  await Page.start();
  await Page.login();

  const processedRecords = [];
  for (let i = 0; i < count; i++) {
    try {
      const record = await Service.getRecord(i);
      await Page.inputParameters({
        Speed: record.Speed,
        Load: record.Load,
        Railpressure: record.Railpressure,
        Air: record.Air,
        CrankAngle: record.Angle,
        Intakepressure: record.Pressure1,
        Backpressure: record.Pressure2,
        Intaketemperature: record.Temperature,
      });
      await Page.submit();
      const results = await Page.getResults();
      console.log("results from server", results);
      processedRecords.push({ ...record, results: results.join(",") });
    } catch (error) {
      console.error(`Error processing record ${i}:`, error);
    }
  }
  Service.createFile("testcase", processedRecords);
  await Page.stopBrowser();
}

main(90);
