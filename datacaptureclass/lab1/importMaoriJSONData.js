import * as fs from "fs";

const BATCH_SIZE = 2000;

const connection = "localhost";
const database = "maori";
let fromType = "file";

//idPolicy: overwrite_with_same_id|always_insert_with_new_id|insert_with_new_id_if_id_exists|skip_documents_with_existing_id|abort_if_id_already_exists|drop_collection_first|log_errors
let toImportContents = [
    { content: "C:\\Users\\Joe\\Documents\\Work\\master\\develop\\unir_master_data_science\\datacaptureclass\\lab1\\JSON\\Agriculture_horticulture_information_for_Maori_farms_annual.json", collection: "Agriculture_horticulture_information_for_Maori_farms_annual", idPolicy: "overwrite_with_same_id" },
    { content: "C:\\Users\\Joe\\Documents\\Work\\master\\develop\\unir_master_data_science\\datacaptureclass\\lab1\\JSON\\Agriculture_land-use_information_for_Maori_farms_annual.json", collection: "Agriculture_land-use_information_for_Maori_farms_annual", idPolicy: "overwrite_with_same_id" },
    { content: "C:\\Users\\Joe\\Documents\\Work\\master\\develop\\unir_master_data_science\\datacaptureclass\\lab1\\JSON\\Agriculture_livestock_information_for_Maori_farms_annual.json", collection: "Agriculture_livestock_information_for_Maori_farms_annual", idPolicy: "overwrite_with_same_id" },
    { content: "C:\\Users\\Joe\\Documents\\Work\\master\\develop\\unir_master_data_science\\datacaptureclass\\lab1\\JSON\\Busines_demography_enterprises_for_Maori_authorities_annual.json", collection: "Busines_demography_enterprises_for_Maori_authorities_annual", idPolicy: "overwrite_with_same_id" },
    { content: "C:\\Users\\Joe\\Documents\\Work\\master\\develop\\unir_master_data_science\\datacaptureclass\\lab1\\JSON\\Business_demography_enterprises_for_Maori_SMEs_annual.json", collection: "Business_demography_enterprises_for_Maori_SMEs_annual", idPolicy: "overwrite_with_same_id" },
    { content: "C:\\Users\\Joe\\Documents\\Work\\master\\develop\\unir_master_data_science\\datacaptureclass\\lab1\\JSON\\Business_operations_rates_activities_annual.json", collection: "Business_operations_rates_activities_annual", idPolicy: "overwrite_with_same_id" },
    { content: "C:\\Users\\Joe\\Documents\\Work\\master\\develop\\unir_master_data_science\\datacaptureclass\\lab1\\JSON\\LEED_estimates_of_filled_jobs_quarterly.json", collection: "LEED_estimates_of_filled_jobs_quarterly", idPolicy: "overwrite_with_same_id" }
];

const totalImportResult = {
    result: {},
    fails: [],
}

for (let item of toImportContents) {
    totalImportResult.result[item.collection] = {
        nInserted: 0,
        nModified: 0,
        nSkipped: 0,
        failed: 0,
    };
}


function importFile({ path, batchSize, callback }) {
    const fs = require('fs'),
        readline = require('readline');



    return new Promise((resolve, reject) => {
        const fileSizeInBytes = fs.statSync(path).size;
        const digits = fileSizeInBytes > 1024 * 1024 * 1024 ? 1 : 0;//1G

        const rd = readline.createInterface({
            input: fs.createReadStream(path),
            crlfDelay: Infinity
        });

        const isValidEndLine = (line) => {
            if ((line[0] === "{") && (line[line.length - 1] === "}")) { //mongoexport format
                return true;
            }

            if ((line === "},")) {
                return true;
            } //mongo shell export

            return false;
        }

        let objCounter = 0;
        let chunk = "";
        let readFileSize = 0;
        let hasError = false;

        rd.on('line', (line) => {
            if (hasError) return;

            chunk = chunk + line + "\n";
            readFileSize += (line + "\n").length;

            if (line && isValidEndLine(line)) {
                objCounter++;

                if (objCounter === batchSize) {
                    callback(chunk, objCounter, ((readFileSize / fileSizeInBytes) * 100).toFixed(digits)).catch(err => {
                        hasError = true;
                        reject(err);
                        rd.close();
                    });
                    objCounter = 0;
                    chunk = "";
                }
            }
        });

        rd.on("close", async () => {
            if (hasError) return;

            try {
                if (chunk.length > 0) {
                    objCounter = objCounter > 0 ? objCounter : 1;
                    await (callback(chunk, objCounter, 100));
                }

                resolve();

            } catch (err) {
                reject(err);
            }
        })

        rd.on("error", (err) => {
            reject(err)
        })
    })
}


function importContent({ content, collection, idPolicy, percent }) {
    const collectionRst = totalImportResult.result[collection];

    let docs = mb.parseBSON(content);

    let writeResult = await(mb.writeToDb({ connection, db: database, collection, docs, idPolicy }));

    let failed = writeResult.errors.length;
    let success = writeResult.nInserted + writeResult.nModified;

    collectionRst.nInserted += writeResult.nInserted;
    collectionRst.nModified += writeResult.nModified;
    collectionRst.nSkipped += writeResult.nSkipped;
    collectionRst.failed += failed;

    percent = (percent === undefined) ? 100 : percent;

    console.log(`import into ${database}.${collection}: ${percent}% , ${collectionRst.nInserted} docs inserted, ${collectionRst.nModified} docs overwritten, ${collectionRst.failed} docs failed.`);
    if (failed) {
        console.log("Failed objects", writeResult.errors);
    }

    totalImportResult.fails = [...totalImportResult.fails, ...writeResult.errors];

    sleep(10)
}


for (let item of toImportContents) {
    if (item.idPolicy === "drop_collection_first") {
        mb.dropCollection({ connection, db: database, collection: item.collection });
        console.log(`drop collection ${database}.${item.collection}`);
    }

    console.log(`import into ${database}.${item.collection} start...`);

    if (fromType === "file") {
        await(importFile({
            path: item.content, batchSize: BATCH_SIZE,
            callback: (content, objCount, percent) => {
                return async(() => {
                    await(importContent({ content, collection: item.collection, idPolicy: item.idPolicy, percent }));
                })()
            }
        }))
    }

    if (fromType === "clipboard") {
        await(importContent({ ...item, percent: 100 }))
    }

    sleep(1000)
    console.log(`import into ${database}.${item.collection} finished.\n`);
}

if (toImportContents.length > 1) {
    console.log("");
    if (totalImportResult.result) {
        let successed = 0;
        let failed = 0;
        let collections = _.keys(totalImportResult.result);
        collections.forEach((key) => {
            let obj = totalImportResult.result[key];
            successed += obj.nInserted + obj.nModified;
            failed += obj.failed;
        });
        console.log(`${successed} document(s) have been imported into ${collections.length} collection(s).`);
        console.log(JSON.stringify(totalImportResult.result, null, 2));
        if (failed) {
            console.log(`${failed} document(s) haven't been imported, please check failed list below.`);
        } else {
            console.log("All documents imported successfully.");
        }
    }

    if (totalImportResult.fails.length) {
        console.log("All failed objects", totalImportResult.fails);
    }
}
