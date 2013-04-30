work days per week
=====

A node.js module for getting the work days in a week.

install & test
------

Checkout project with git and run

    npm install
    npm test

in project root.

usage
-----

The workDays() API returns a list of [moment.js](http://momentjs.com) objects representing the work days for given country, region and week.
Country and state are mandatory. If no week/year given current week/year will be used.

    workDays('DE', 'BY');
    workDays('DE', 'BY', '14');
    workDays('DE', 'BY', '14', 2013);
