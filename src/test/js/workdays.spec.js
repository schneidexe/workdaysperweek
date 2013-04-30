var workDays = require('../../main/js/workdays'),
    moment = require('moment');

describe('test suite for work days per week', function () {
    describe('test arguments', function () {
        describe('country', function () {
            it('throw exception if no country given', function () {
                expect(function () {
                    workDays.workDays()
                }).toThrow("country not defined");
            })
            it('throw exception if country is null', function () {
                expect(function () {
                    workDays.workDays(null)
                }).toThrow("country not defined");
            })
            it('throw exception if country is not existing', function () {
                expect(function () {
                    workDays.workDays('XX')
                }).toThrow("country not found");
            })
        })
        describe('state', function () {
            it('throw exception if no state given', function () {
                expect(function () {
                    workDays.workDays('DE')
                }).toThrow("state not defined");
            })
            it('throw exception if state is null', function () {
                expect(function () {
                    workDays.workDays('DE', null)
                }).toThrow("state not defined");
            })
            it('throw exception if state is not existing', function () {
                expect(function () {
                    workDays.workDays('DE', 'xx')
                }).toThrow("state not found");
            })
        })
        describe('week', function () {
            it('throw exception if week is null', function () {
                expect(function () {
                    workDays.workDays('DE', 'BY', null)
                }).toThrow("week has to be a positive number [1..53]");
            })
            it('throw exception if week is NaN', function () {
                expect(function () {
                    workDays.workDays('DE', 'BY', 'abc')
                }).toThrow("week has to be a positive number [1..53]");
            })
            it('throw exception if week is zero', function () {
                expect(function () {
                    workDays.workDays('DE', 'BY', 0)
                }).toThrow("week has to be a positive number [1..53]");
            })
            it('throw exception if week is negative', function () {
                expect(function () {
                    workDays.workDays('DE', 'BY', -1)
                }).toThrow("week has to be a positive number [1..53]");
            })
            it('throw exception if week is to big', function () {
                expect(function () {
                    workDays.workDays('DE', 'BY', 54)
                }).toThrow("week has to be a positive number [1..53]");
            })
            it('allow valid week values', function () {
                expect(workDays.workDays('DE', 'BY', 1).length).toBeGreaterThan(0);
                expect(workDays.workDays('DE', 'BY', 53).length).toBeGreaterThan(0);
                expect(workDays.workDays('DE', 'BY', '20').length).toBeGreaterThan(0);
            })
            it('use current week if no week given', function () {
                expect(workDays.workDays('DE', 'BY').length).toBeGreaterThan(0);
            })
        })
        describe('year', function () {
            it('throw exception if year is null', function () {
                expect(function () {
                    workDays.workDays('DE', 'BY', '1', null)
                }).toThrow("year has to be a positive number");
            })
            it('throw exception if week is NaN', function () {
                expect(function () {
                    workDays.workDays('DE', 'BY', '1', 'abc')
                }).toThrow("year has to be a positive number");
            })
            it('throw exception if year is negative', function () {
                expect(function () {
                    workDays.workDays('DE', 'BY', 1, -1000)
                }).toThrow("year has to be a positive number");
            })
            it('use current year if no year given', function () {
                expect(workDays.workDays('DE', 'BY', 1).length).toBeGreaterThan(0);
            })
        })
    })
    describe('easter formula', function () {
        it('easter sunday in 1954 is April 18th', function () {
            expect(workDays.easterSunday(1954).format()).toEqual(moment('1954/04/18').format());
        })
        it('easter sunday in 1981 is April 19th', function () {
            expect(workDays.easterSunday(1981).format()).toEqual(moment('1981/04/19').format());
        })
        it('easter sunday in 2013 is March 31st', function () {
            expect(workDays.easterSunday(2013).format()).toEqual(moment('2013/03/31').format());
        })
    })
    describe('general holiday functionality', function () {
        it('week 52/2012 has 4 working days (christmas)', function () {
            expect(workDays.workDays('DE', 'BY', 52, 2012).length).toEqual(4);
        })
        it('week 1/2013 has 5 working days (new year\'s day)', function () {
            expect(workDays.workDays('DE', 'BY', 1, 2013).length).toEqual(5);
        })
        it('week 13/2013 has 5 working days (good friday)', function () {
            expect(workDays.workDays('DE', 'BY', 13, 2013).length).toEqual(5);
        })
        it('week 14/2013 has 5 working days (easter monday)', function () {
            expect(workDays.workDays('DE', 'BY', 14, 2013).length).toEqual(5);
        })
        it('week 19/2013 has 5 working days (ascension)', function () {
            expect(workDays.workDays('DE', 'BY', 19, 2013).length).toEqual(5);
        })
        it('working days in week 19/2013 are May 6-8th and 10-11th', function () {
            var result = workDays.workDays('DE', 'BY', 19, 2013);
            expect(result[0].format()).toEqual(moment('2013/05/06').format());
            expect(result[1].format()).toEqual(moment('2013/05/07').format());
            expect(result[2].format()).toEqual(moment('2013/05/08').format());
            expect(result[3].format()).toEqual(moment('2013/05/10').format());
            expect(result[4].format()).toEqual(moment('2013/05/11').format());
        })
    })
    describe('regional holiday functionality', function () {
        it('week 1/2012 has 5 working days in bavaria (holy 3 kings)', function () {
            expect(workDays.workDays('DE', 'BY', 1, 2012).length).toEqual(5);
        })
        it('week 1/2012 has 6 working days in hamburg (no holy 3 kings)', function () {
            expect(workDays.workDays('DE', 'HH', 1, 2012).length).toEqual(6);
        })
    })
})
