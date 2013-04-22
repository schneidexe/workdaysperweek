work days per week
=====

A node.js library for getting the work days in a week.

install & test
------

Checkout project with git and run

    npm install
    npm test

in project root.

use
-----

The workDays() API returns a list of moment.js objects representing the work days for given country, region and week.
Country and state are mandatory. If no week/year given current week/year will be used.

   workDays('de', 'by');
   workDays('de', 'by', '10', 2013);