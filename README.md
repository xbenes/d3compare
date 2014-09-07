# D3 compare
A small single-purpose visualization library written using d3.js. I wrote it to visualize arbitrary values per month in different years.
![Example](https://github.com/xbenes/d3compare/raw/master/img/example.png "Example")

## Usage
1. Load d3.js ([http://d3js.org](http://d3js.org/)) and d3compare.min.js (dist/d3compare.min.js) files.
2. Create a DOM element with width/height assigned into which the chart will be rendered.
```
<div class="vis" style="width: 930px; height: 300px;"></div>
```
3. prepare data
```
var data = [
    { monthName: 'January', values: [ { year: 2008, value: 4 }, { year: 2009, value: 6 }, { year: 2010, value: 8 } ] },
    { monthName: 'February', values: [ { year: 2008, value: 5 }, { year: 2009, value: 8 }, { year: 2010, value: 11 } ] },
    { monthName: 'March', values: [ { year: 2008, value: 4 }, { year: 2009, value: 10 }, { year: 2010, value: 13 } ] },
    { monthName: 'April', values: [ { year: 2008, value: 7}, { year: 2009, value: 12 }, { year: 2010, value: 16 } ] },
    { monthName: 'May', values: [ { year: 2008, value: 9 }, { year: 2009, value: 11 }, { year: 2010, value: 14 } ] },
    { monthName: 'June', values: [ { year: 2008, value: 6 }, { year: 2009, value: 10 }, { year: 2010, value: 14 } ] },
    { monthName: 'July', values: [ { year: 2008, value: 6 }, { year: 2009, value: 10 }, { year: 2010, value: 14 } ] },
    { monthName: 'August', values: [ { year: 2008, value: 5 }, { year: 2009, value: 9 }, { year: 2010, value: 15 } ] },
    { monthName: 'September', values: [ { year: 2008, value: 7 }, { year: 2009, value: 12 }, { year: 2010, value: 14 } ] },
    { monthName: 'October', values: [ { year: 2008, value: 9 }, { year: 2009, value: 12 }, { year: 2010, value: 17 } ] },
    { monthName: 'November', values: [ { year: 2008, value: 11 }, { year: 2009, value: 11 }, { year: 2010, value: 15 } ] },
    { monthName: 'December', values: [ { year: 2008, value: 10 }, { year: 2009, value: 12 }, { year: 2010, value: 15 } ] },
];
```
4. Call the library to show a chart, pass the DOM element selector and the data and options eventually.
```
d3compare.visualize('.vis', data, {
    legendMouse: true,
    color: '#ff0000'
});

```

## Options
`legendMouse` fade unselected bars on legend mouseover

`color` use given color as the base color, use hex format, default #ff0000

For complete examples, see the examples directory.

## Set-up for examples preview or development

```
npm install -g gulp
npm install
bower install
```

Build the distribution and examples

```
gulp dist
```

Library is placed into `dist/` directory, examples into `dist-examples/`.


Run the development server and try examples

```
gulp serve
```

and then visit [http://localhost:5001/](http://localhost:5001/)


