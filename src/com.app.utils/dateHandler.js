var define = require('node-requirejs-define');

define(function() {

    function DateFormatter() {
        var d = new Date(),
            month = d.toLocaleString('default', { month: 'long' }),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join(' ');
    }

    return {
        DateFormatter: DateFormatter
    }
});