# react-math

Format math text into MathML. Uses the [ascii-math](https://github.com/ForbesLindesay/ascii-math) module, please note not all browsers support mathml: [caniuse... mathml](http://caniuse.com/#feat=mathml).

## Installation

```
npm install react-math
```

## Demo

http://cezary.github.io/react-math/

## Example

```javascript
var React = require('react');
var MathML = require('react-math');

var Component = React.createClass({
  render: function() {
    return (
      <MathML text='e^(i pi)=-1'/>
    );
  }
});
```

## License

MIT
