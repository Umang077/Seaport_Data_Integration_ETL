function validateSeaport(row){
    let portName=row.portName || row.port_name || row["Port Name"];
    portName=portName.split("{")[0].trim().toUpperCase();
    const locode=row.unLocCode ? row.unLocCode : null;
    const latitude=parseFloat(row.latitude);
    const longitude=parseFloat(row.longitude);
    const countryIso=row.portCode.substring(0,2);
    if(!portName || !locode) return null;
    if(isNaN(latitude) || isNaN(longitude)) return null;
    return{
        portName,
        locode,
        latitude,
        longitude,
        timezoneOlson: row.timezoneOlson || "",
        countryIso: countryIso || "",
    }  

}
module.exports=validateSeaport;