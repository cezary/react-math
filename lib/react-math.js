var React = require('react');
var parse = require('ascii-math');

module.exports = React.createClass({
  displayName: 'MathML',

  getDefaultProps: function() {
    return {
      text: ''
    };
  },

  render: function () {
    var mathML = parse(this.props.text).toString();
    return (
      <div dangerouslySetInnerHTML={{__html: mathML}}></div>
    );
  }
});
