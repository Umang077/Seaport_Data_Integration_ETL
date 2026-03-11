const {prisma}=require("../prisma/client");
async function seaportServices() {
    return prisma.seaport.findMany({
        orderBy:{portName: "asc"}
    });
}
module.exports={
    seaportServices
}