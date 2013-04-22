var moment = require("moment");

var states = {
        de : [ 'bw', 'by', 'be', 'bb', 'hb', 'hh', 'he', 'mv', 'ni', 'nw', 'rp', 'sl', 'sn', 'st', 'sh', 'th' ]
    },
    easterOffsets = {
        de : {
            '-2' : [ ],                                  // good friday
            1 : [ ],                                     // easter monday
            39 : [ ],                                    // ascension day
            50 : [ ],                                    // whit monday
            60 : [ 'bw', 'by', 'he', 'nw', 'rp', 'sl' ]  // corpus christi
        }
    },
    holidays = {
        de : {
            '01/01' : [ ],                               // new year's day
            '01/06' : [ 'bw', 'by', 'st' ],              // holy 3 kings
            '05/01' : [ ],                               // labor day
            '08/15' : [ 'by', 'sl' ],                    // assumption day
            '10/03' : [ ],                               // reunion day
            '10/31' : [ 'bb', 'mv', 'sn', 'st', 'th' ],  // reformation day
            '11/01' : [ 'bw', 'by', 'nw', 'rp', 'sl' ],  // holy saints
            '11/20' : [ 'sn' ],                          // penance day
            '12/25' : [ ],                               // christmas day
            '12/26' : [ ]                                // boxing day
        }
    };

workDays = function(country, state, week, year) {
    // validation
    if (country === undefined || country === null )
        throw "country not defined";
    if (states[country] === undefined)
        throw "country not found";
    if (state === undefined || state === null)
        throw "state not defined";
    if (states[country].indexOf(state) < 0)
        throw "state not found";
    if (week === undefined)
        week = moment().isoWeek();
    if (week === null || isNaN(parseInt(week)) || week < 1 || week > 53)
        throw "week has to be a positive number [1..53]";
    if (year === undefined)
        year = moment().year();
    if (year === null || isNaN(parseInt(year)) || year < 0)
        throw("year has to be a positive number");

    // get start of week
    var weekStartDate = moment().year(year).week(week).startOf('week');

    // check monday 'til saturday
    var workingDays = [];
    for (day = 1; day < 7; day++) {
        var date = moment(weekStartDate.day(day));
        if (!isHoliday(country, state, date))
            workingDays.push(date);
    }

    return workingDays;
}

isHoliday = function(country, state, date) {
    console.log("checking date " + date.format());

    // check for fix holiday
    var countryFixHolidays = holidays[country];
    for (var holiday in countryFixHolidays) {
        var holidayDate = moment(date.year() + '/' + holiday);
        if (holidayDate.isSame(date)) {
            // general holidays
            if (countryFixHolidays[holiday].length === 0) {
                console.log(date.format() + " is a fix holiday");
                return true;
            // regional holidays
            } else if (countryFixHolidays[holiday].indexOf(state) > -1) {
                console.log(date.format() + " is a fix holiday");
                return true;
            }
        }
    }

    // check for easter formula depending holidays
    var countryEasterOffsets = easterOffsets[country];
    for (var offset in countryEasterOffsets) {
        var holidayDate = easterSunday(date.year()).add('days', offset);
        if (holidayDate.isSame(date)) {
            // general holidays
            if (countryEasterOffsets[offset].length === 0) {
                console.log(date.format() + " is a variable holiday");
                return true;
            // regional holidays
            } else if (countryEasterOffsets[offset].indexOf(state) > -1) {
                console.log(date.format() + " is a fix holiday");
                return true;
            }
        }
    }

    return false;
}

easterSunday = function(year) {
    if (year === undefined || year === null)
        year = moment().year();

    var a = year % 19,
        b = year % 4,
        c = year % 7,
        k = parseInt(year / 100),
        p = parseInt((8 * k + 13) / 25),
        q = parseInt(k / 4),
        m = (15 + k - p - q) % 30,
        n = (4 + k - q) % 7,
        d = (19 * a + m) % 30,
        e = (2 * b + 4 * c + 6 * d + n) % 7,
        o = 22 + d + e;

    if (o >= 31 + 25)
        o -= 7;

    return moment([year, 2, 1]).date(o);
}

// exports
exports.workDays = workDays;
exports.isHoliday = isHoliday;
exports.easterSunday = easterSunday;