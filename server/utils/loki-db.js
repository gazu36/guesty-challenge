const loki = require('lokijs');

const db = new loki(process.env.DB_PATH || 'db');

const definitions = db.addCollection(
    'definitions',
    { indices: ['treated', 'recurrence.days', 'recurrence.days.hour'] }
);

definitions.insert([
    {
        recipients: [1,2,3,4],
        body: 'wow blah',
        treated: false,
        recurrence: {
            days: [7,3,5], // Sunday, Wednesday, Friday
            hour: 23
        },
        timezone: '-0100'
    },
    {
        recipients: [5],
        body: 'Only for five',
        treated: false,
        recurrence: {
            days: [1], // Monday
            hour: 4
        },
        timezone: '+0400'
    },
    {
        recipients: [1,4],
        body: 'Only 1 and 4 sale',
        treated: false,
        recurrence: {
            days: [1,5], // Monday, Friday
            hour: 15
        },
        timezone: '+0000'
    }
])

module.exports = definitions;