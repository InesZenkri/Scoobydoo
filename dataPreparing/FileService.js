import csvParser from "csv-parser";
import fs from "fs";
import path from "path";

export class FileService {
  url;
  folderPath;
  constructor(url, folderPath) {
    this.url = url;
    this.folderPath = folderPath;
  }
  async getRecord(id) {
    // if (!id || typeof id != "number") {
    //   throw new Error("invalid input in getRecord");
    // }
    let result = [];
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(this.url);
      stream.pipe(csvParser()).on("data", data => {
        result.push(data);
        if (result.length - 1 == id) {
          resolve(result[result.length - 1]);
          stream.close();
        }
      });
    });
  }
  async getAllRecords() {
    let result = [];
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(this.url);
      stream.pipe(csvParser());
      stream.on("data", data => {
        result.push(data);
      });
      stream.on("end", () => {
        if (result.length > 0) {
          resolve(result);
        } else {
          reject(new Error("there is no data"));
        }
      });
    });
  }

  createFile(name, records) {
    const paths = path.join(this.folderPath, `init_data${name}.csv`);
    const keys =
      "Engine speed,Engine load,Railpressure,Air supply,Crank angle,Intake pressure,Back pressure,Intake temperature,NOx,PM 1,CO2,PM 2,Pressure cylinder" +
      "\n";

    const csvContent = records
      .map(record => Object.values(record).join(","))
      .join("\n");
    fs.writeFileSync(paths, keys + csvContent);
  }
}
