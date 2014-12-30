# react-math

Format math text into MathML

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

### License

MIT
