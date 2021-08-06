const express = require('express');
const { param } = require('express-validator');
const { DateTime } = require('luxon');

const validateNoErrors = require('../validators/errors-validate');

const { StatusCodes } = require('http-status-codes');
const { handleDefs, fetchDefs } = require('../controllers/definitions');

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

    const fetchDefsFn = def => {
        const defDt = dt.setZone(def.timezone);
        return !def.lastTreated &&
            def.recurrence.days.includes(defDt.weekday) &&
            def.recurrence.hour === defDt.hour;
    }

    return handleDefs(fetchDefs(fetchDefsFn))
        .then((results) => res.status(StatusCodes.OK).json({
            date: {
                weekday: dt.weekday,
                hour: dt.hour,
                timezone: dt.zoneName
            },
            results
        }))
        .catch((e) => {
            console.error(e);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        });;
});

module.exports = router;