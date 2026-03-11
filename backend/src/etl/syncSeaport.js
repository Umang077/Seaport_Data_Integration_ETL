const {BlobServiceClient}=require("@azure/storage-blob");
const XLSX=require("@e965/xlsx");
const SAS_URL="https://tillachallenge.blob.core.windows.net/challenge-data?sp=rl&st=2026-02-10T07:18:36Z&se=2026-04-01T15:33:36Z&spr=https&sv=2024-11-04&sr=c&sig=hWOx9eiybuxnOIIFwUqtNQF%2FMz5oyAwV8HXJWt6pYjM%3D";
const {prisma}=require("../prisma/client");
const validateSeaport=require("../validator/seaportValidatorCode");
async function syncSeaport(){
    try{
        const containerClient= new BlobServiceClient(SAS_URL).getContainerClient("");
        console.log("Listing blobs..");
        let fileName=null;
        for await(const blob of containerClient.listBlobsFlat()){
            console.log("Found File",blob.name);
            fileName=blob.name;
        }
        if(!fileName){
            throw new Error("No file found in Azure container");
        }
        const blobClient=containerClient.getBlobClient(fileName);
        const download=await blobClient.download();
        const chunks = [];
        for await (const chunk of download.readableStreamBody) {
            chunks.push(chunk);
        }
        const buffer=Buffer.concat(chunks);
        const fs=require("fs");
        fs.writeFileSync("seaport_data_extract.xlsx",buffer);
        const workbook=XLSX.read(buffer,{type:"buffer"});
        const sheet=workbook.Sheets[workbook.SheetNames[0]];
        const rows=XLSX.utils.sheet_to_json(sheet);
        console.log("rows",rows.length);
        for (const row of rows) {
      // console.log("valid row",row);   // DEBUG

        const dataVal = validateSeaport(row);

        if (!dataVal) {
            // console.log("Invalid row skipped:", row);
            continue;
        }
        await prisma.seaport.create({
            data: {
            portName: dataVal.portName,
            locode: dataVal.locode,
            latitude: dataVal.latitude,
            longitude: dataVal.longitude,
            timezoneOlson: "",
            countryIso: dataVal.countryIso || ""
            }
        });

        
        }
    
    // await prisma.seaport.deleteMany();
    // console.log("All rows deleted");
    const count = await prisma.seaport.count();
    console.log("Rows in database:", count);
    // console.log("Seaports synced successfully!");


    }catch(err){
        console.error("ETL error",err.message);
    }
}
module.exports=syncSeaport;