const { DateTime } = require('luxon');
const definitions = require("../utils/loki-db");

const _fetchFromDB = (fetchFn) => fetchFn ? definitions.where(fetchFn) : definitions.find();

const fetchDefs = (fetchFn) => _fetchFromDB(fetchFn).map(def => ({...def, id: def.$loki}));

// Treat them all - write to log and set treated to true
// TODO: split logging and updating
const handleDefs = (defs) => Promise.all(defs.map(async def => {
    console.log(def);
    def.lastTreated = DateTime.now().toLocaleString();
    definitions.update(def);
    return def;
}));

module.exports = {fetchDefs, handleDefs};