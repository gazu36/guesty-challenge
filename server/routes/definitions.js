const express = require('express');
const { param } = require('express-validator');
const { DateTime } = require('luxon');

const validateNoErrors = require('../validators/errors-validate');

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
    
    return res.json(`Hello World ${dt.weekdayShort} (${dt.weekday % 7}) - ${dt.hour}:00 @ ${dt.zoneName}`);
});

module.exports = router;