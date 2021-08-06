const express = require('express');
const { param } = require('express-validator');
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
    return res.json(`Hello World ${datetime}`);
});

module.exports = router;