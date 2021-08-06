const express = require('express');
const { param } = require('express-validator');
const { DateTime } = require('luxon');

const validateNoErrors = require('../validators/errors-validate');

const definitions = require('../utils/loki-db');
const { StatusCodes } = require('http-status-codes');

const router = express.Router();

router.get('/:datetime',
    [
        param('datetime')
            .exists({ checkNull: true, checkFalsy: true })
            .withMessage('datetime is required')
            .isISO8601()
            .withMessage('datetime must be a valid ISO8601 date')
    ],
    validateNoErrors,
    (req, res) => {
    const {datetime} = req.params;
    console.log(datetime);
    const dt = DateTime.fromISO(datetime, {setZone: true});
    
    // Get all defs that are un treated - there could be millions
    const defsToTreat = definitions.where(def => !def.treated)

    // Treat them all - write to log and set treated to true
    return Promise.all(defsToTreat.map(async def => {
        console.log(def);
        def.treated = true;
        definitions.update(def);
    }))
    .then(() => res.status(StatusCodes.OK))
    .catch((e) => {
        console.error(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});

module.exports = router;