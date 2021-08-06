const definitions = require("../utils/loki-db");

const fetchDefs = (fetchFn) => definitions.where(fetchFn);

// Treat them all - write to log and set treated to true
// TODO: split logging and updating
const handleDefs = (defs) => Promise.all(defs.map(async def => {
    console.log(def);
    def.treated = true;
    definitions.update(def);
    return def;
}));

module.exports = {fetchDefs, handleDefs};