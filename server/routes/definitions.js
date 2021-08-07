const express = require('express');
const { param } = require('express-validator');
const { DateTime } = require('luxon');

const validateNoErrors = require('../validators/errors-validate');
DateTime.tim
const { StatusCodes } = require('http-status-codes');
const { insertDef, handleDefs, fetchDefs } = require('../controllers/definitions');

const router = express.Router();

router.patch('/:datetime',
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
    const dt = DateTime.fromISO(datetime, { setZone: true });

    const fetchDefsFn = def => {
        const defDt = dt.setZone(def.timezone);
        return (!def.lastTreated || def.lastTreated != DateTime.now().toLocaleString()) &&
            (def.recurrence.days.includes(defDt.weekday) && def.recurrence.hour === defDt.hour);
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

router.post('/',
    [
        body('amount')
            .exists({ checkNull: true, checkFalsy: true })
            .withMessage('amount is required')
            .isInteger({gt: 1})
            .withMessage('datetime must be an Integer > 1')
    ],
    validateNoErrors,
    async (req, res) => {
        const {amount: amountToCreate} = req.body;

        return Promise.all(Array(amountToCreate).keys().map(async () => insertDef({
                    recipients: getRandomRecipients(),
                    body: getRandomSentece(),
                    recurrence: {
                        days: getRandomDays(),
                        hour: Math.floor(Math.random() * 24)
                    },
                    timezone: getRandomOffset()
            })
        )).then(defsCreated => res.status(StatusCodes.OK).json(defsCreated))
        .catch(e => {
            console.error(e);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        });
});

router.get('/', (req, res) => res.status(StatusCodes.OK).json(fetchDefs()))

const _getRandomArr = (length) => Array.from(Array(5).keys()).map(v => [v, Math.random() < 0.5]).filter(arr => arr[1]).map(arr => arr[0])

const getRandomRecipients = () => _getRandomArr(5)

const getRandomDays = () => _getRandomArr(7).map(v => v+1)

const getRandomOffset = () => {
    const offset = Math.floor(Math.random() * 26) - 12;
    return `UTC${offset > 0 ? '+' : ''}${offset}`
}

const getRandomSentece = () => {
    const sentences = [
        'Hi hello there',
        'How are you?',
        'This is a notification',
        'Whereas this is quite a long sentence that I\'ve been trying to write for quite a bit of time',
        `This one has a
line break`
    ]

    return sentences[Math.floor(Math.random() * sentences.length)];
}

module.exports = router;