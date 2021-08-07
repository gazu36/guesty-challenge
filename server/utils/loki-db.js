const loki = require('lokijs');

const db = new loki(process.env.DB_PATH || 'db');

const definitions = db.addCollection(
    'definitions',
    { indices: ['lastTreated', 'recurrence.days', 'recurrence.days.hour'] }
);

definitions.insert([
    {
        recipients: [1,2,3,4],
        body: 'wow blah',
        recurrence: {
            days: [7,3,5], // Sunday, Wednesday, Friday
            hour: 23
        },
        timezone: 'UTC-1'
    },
    {
        recipients: [5],
        body: `Only for five and lots
and asghdsfhadh
adsfh
adgSDHdshafjadhjadgjadfgkaf`,
        recurrence: {
            days: [1], // Monday
            hour: 4
        },
        timezone: 'UTC+4'
    },
    {
        recipients: [1,4],
        body: 'Only 1 and 4 sale',
        recurrence: {
            days: [1,6], // Monday, Saturday
            hour: 20
        },
        timezone: 'UTC'
    }
])

module.exports = definitions;