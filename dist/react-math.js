(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["React"], factory);
	else if(typeof exports === 'object')
		exports["MathML"] = factory(require("React"));
	else
		root["MathML"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(2);
	var parse = __webpack_require__(3);
	
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
	      React.createElement("div", {dangerouslySetInnerHTML: {__html: mathML}})
	    );
	  }
	});


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var ml = __webpack_require__(4);
	
	var tokenTypes = __webpack_require__(5);
	var CONST = tokenTypes.CONST;
	var UNARY = tokenTypes.UNARY;
	var BINARY = tokenTypes.BINARY;
	var INFIX = tokenTypes.INFIX;
	var LEFTBRACKET = tokenTypes.LEFTBRACKET;
	var RIGHTBRACKET = tokenTypes.RIGHTBRACKET;
	var SPACE = tokenTypes.SPACE;
	var UNDEROVER = tokenTypes.UNDEROVER;
	var DEFINITION = tokenTypes.DEFINITION;
	var LEFTRIGHT = tokenTypes.LEFTRIGHT;
	var TEXT = tokenTypes.TEXT;
	
	var AMsymbols = __webpack_require__(6);
	var AMnames = AMsymbols.map(function (symbol) {
	  return symbol.input;
	}); //list of input symbols
	
	module.exports = parseMath;
	function parseMath(str) {
	  var frag, node;
	  AMnestingDepth = 0;
	  frag = AMparseExpr(str.replace(/^\s+/g, ""), false)[0];
	  node = createMmlNode("math", frag);
	  node.setAttribute("title", str.replace(/\s+/g, " "));
	  return node;
	}
	
	var useFakes = true;
	
	function createMmlNode(t, frag) {
	  var node = useFakes ? new ml.Node(t) : document.createElementNS("http://www.w3.org/1998/Math/MathML", t);
	  if (typeof frag === 'string') frag = useFakes ? new ml.Text(frag) : document.createTextNode(frag);
	  if (frag) node.appendChild(frag);
	  return node;
	}
	
	function createFragment() {
	  return useFakes ? new ml.Node('fragment') : document.createDocumentFragment();
	}
	
	var AMquote = {
	  input: "\"",
	  tag: "mtext",
	  output: "mbox",
	  tex: null,
	  ttype: TEXT
	};
	
	
	
	function AMremoveCharsAndBlanks(str, n) {
	  //remove n characters and any following blanks
	  var st;
	  if (str.charAt(n) == "\\" && str.charAt(n + 1) != "\\" && str.charAt(n + 1) != " ") st = str.slice(n + 1);
	  else st = str.slice(n);
	  for (var i = 0; i < st.length && st.charCodeAt(i) <= 32; i = i + 1);
	  return st.slice(i);
	}
	
	function position(arr, str, n) {
	  // return position >=n where str appears or would be inserted
	  // assumes arr is sorted
	  if (n == 0) {
	    var h, m;
	    n = -1;
	    h = arr.length;
	    while (n + 1 < h) {
	      m = (n + h) >> 1;
	      if (arr[m] < str) n = m;
	      else h = m;
	    }
	    return h;
	  } else {
	    for (var i = n; i < arr.length && arr[i] < str; i++);
	    return i; // i=arr.length || arr[i]>=str
	  }
	}
	
	function AMgetSymbol(str) {
	  //return maximal initial substring of str that appears in names
	  //return null if there is none
	  var k = 0; //new pos
	  var j = 0; //old pos
	  var mk; //match pos
	  var st;
	  var tagst;
	  var match = "";
	  var more = true;
	  for (var i = 1; i <= str.length && more; i++) {
	    st = str.slice(0, i); //initial substring of length i
	    j = k;
	    k = position(AMnames, st, j);
	    if (k < AMnames.length && str.slice(0, AMnames[k].length) == AMnames[k]) {
	      match = AMnames[k];
	      mk = k;
	      i = match.length;
	    }
	    more = k < AMnames.length && str.slice(0, AMnames[k].length) >= AMnames[k];
	  }
	  AMpreviousSymbol = AMcurrentSymbol;
	  if (match != "") {
	    AMcurrentSymbol = AMsymbols[mk].ttype;
	    return AMsymbols[mk];
	  }
	  // if str[0] is a digit or - return maxsubstring of digits.digits
	  AMcurrentSymbol = CONST;
	  k = 1;
	  st = str.slice(0, 1);
	  var integ = true;
	  while ("0" <= st && st <= "9" && k <= str.length) {
	    st = str.slice(k, k + 1);
	    k++;
	  }
	  if (st == '.') {
	    st = str.slice(k, k + 1);
	    if ("0" <= st && st <= "9") {
	      integ = false;
	      k++;
	      while ("0" <= st && st <= "9" && k <= str.length) {
	        st = str.slice(k, k + 1);
	        k++;
	      }
	    }
	  }
	  if ((integ && k > 1) || k > 2) {
	    st = str.slice(0, k - 1);
	    tagst = "mn";
	  } else {
	    k = 2;
	    st = str.slice(0, 1); //take 1 character
	    tagst = (("A" > st || st > "Z") && ("a" > st || st > "z") ? "mo" : "mi");
	  }
	  if (st == "-" && AMpreviousSymbol == INFIX) {
	    AMcurrentSymbol = INFIX; //trick "/" into recognizing "-" on second parse
	    return {
	      input: st,
	      tag: tagst,
	      output: st,
	      ttype: UNARY,
	      func: true
	    };
	  }
	  return {
	    input: st,
	    tag: tagst,
	    output: st,
	    ttype: CONST
	  };
	}
	
	function AMremoveBrackets(node) {
	  if (node.nodeName == "mrow") {
	    var start = node.firstChild.firstChild.nodeValue;
	    if (start == "(" || start == "[" || start == "{") node.removeChild(node.firstChild);
	    var end = node.lastChild.firstChild.nodeValue;
	    if (end == ")" || end == "]" || end == "}") node.removeChild(node.lastChild);
	  }
	}
	
	/*Parsing ASCII math expressions with the following grammar
	v ::= [A-Za-z] | greek letters | numbers | other constant symbols
	u ::= sqrt | text | bb | other unary symbols for font commands
	b ::= frac | root | stackrel         binary symbols
	l ::= ( | [ | { | (: | {:            left brackets
	r ::= ) | ] | } | :) | :}            right brackets
	S ::= v | lEr | uS | bSS             Simple expression
	I ::= S_S | S^S | S_S^S | S          Intermediate expression
	E ::= IE | I/I                       Expression
	Each terminal symbol is translated into a corresponding mathml node.*/
	
	var AMnestingDepth, AMpreviousSymbol, AMcurrentSymbol;
	
	function AMparseSexpr(str) { //parses str and returns [node,tailstr]
	  var symbol, node, result, i, st; // rightvert = false,
	  str = AMremoveCharsAndBlanks(str, 0);
	  symbol = AMgetSymbol(str); //either a token or a bracket or empty
	  if (symbol == null || symbol.ttype == RIGHTBRACKET && AMnestingDepth > 0) {
	    return [null, str];
	  }
	  if (symbol.ttype == DEFINITION) {
	    str = symbol.output + AMremoveCharsAndBlanks(str, symbol.input.length);
	    symbol = AMgetSymbol(str);
	  }
	  switch (symbol.ttype) {
	    case UNDEROVER:
	    case CONST:
	      str = AMremoveCharsAndBlanks(str, symbol.input.length);
	      //its a constant
	      return [createMmlNode(symbol.tag, symbol.output), str];
	    case LEFTBRACKET:
	      //read (expr+)
	      AMnestingDepth++;
	      str = AMremoveCharsAndBlanks(str, symbol.input.length);
	      result = AMparseExpr(str, true);
	      AMnestingDepth--;
	      if (typeof symbol.invisible == "boolean" && symbol.invisible) node = createMmlNode("mrow", result[0]);
	      else {
	        node = createMmlNode("mo", symbol.output);
	        node = createMmlNode("mrow", node);
	        node.appendChild(result[0]);
	      }
	      return [node, result[1]];
	    case TEXT:
	      var mRow = createMmlNode("mrow");
	      if (symbol != AMquote) str = AMremoveCharsAndBlanks(str, symbol.input.length);
	      if (str.charAt(0) == "{") i = str.indexOf("}");
	      else if (str.charAt(0) == "(") i = str.indexOf(")");
	      else if (str.charAt(0) == "[") i = str.indexOf("]");
	      else if (symbol == AMquote) i = str.slice(1).indexOf("\"") + 1;
	      else i = 0;
	      if (i == -1) i = str.length;
	      st = str.slice(1, i);
	      if (st.charAt(0) == " ") {
	        node = createMmlNode("mspace");
	        node.setAttribute("width", "1ex");
	        mRow.appendChild(node);
	      }
	      mRow.appendChild(
	      createMmlNode(symbol.tag, st));
	      if (st.charAt(st.length - 1) == " ") {
	        node = createMmlNode("mspace");
	        node.setAttribute("width", "1ex");
	        mRow.appendChild(node);
	      }
	      str = AMremoveCharsAndBlanks(str, i + 1);
	      return [mRow, str];
	    case UNARY:
	      str = AMremoveCharsAndBlanks(str, symbol.input.length);
	      result = AMparseSexpr(str);
	      if (result[0] == null) return [createMmlNode(symbol.tag, symbol.output), str];
	      if (typeof symbol.func == "boolean" && symbol.func) { // functions hack
	        st = str.charAt(0);
	        if (st == "^" || st == "_" || st == "/" || st == "|" || st == ",") {
	          return [createMmlNode(symbol.tag, symbol.output), str];
	        } else {
	          node = createMmlNode("mrow", createMmlNode(symbol.tag, symbol.output));
	          node.appendChild(result[0]);
	          return [node, result[1]];
	        }
	      }
	      AMremoveBrackets(result[0]);
	      if (symbol.input == "sqrt") { // sqrt
	        return [createMmlNode(symbol.tag, result[0]), result[1]];
	      } else if (typeof symbol.acc == "boolean" && symbol.acc) { // accent
	        node = createMmlNode(symbol.tag, result[0]);
	        node.appendChild(createMmlNode("mo", symbol.output));
	        return [node, result[1]];
	      } else { // font change command
	        if (typeof symbol.codes != "undefined") {
	          for (i = 0; i < result[0].childNodes.length; i++)
	          if (result[0].childNodes[i].nodeName == "mi" || result[0].nodeName == "mi") {
	            st = (result[0].nodeName == "mi" ? result[0].firstChild.nodeValue : result[0].childNodes[i].firstChild.nodeValue);
	            var newst = [];
	            for (var j = 0; j < st.length; j++)
	            if (st.charCodeAt(j) > 64 && st.charCodeAt(j) < 91) newst = newst + String.fromCharCode(symbol.codes[st.charCodeAt(j) - 65]);
	            else newst = newst + st.charAt(j);
	            if (result[0].nodeName == "mi") result[0] = createMmlNode("mo", newst);
	            else result[0].replaceChild(createMmlNode("mo", newst), result[0].childNodes[i]);
	          }
	        }
	        node = createMmlNode(symbol.tag, result[0]);
	        node.setAttribute(symbol.atname, symbol.atval);
	        return [node, result[1]];
	      }
	    case BINARY:
	      str = AMremoveCharsAndBlanks(str, symbol.input.length);
	      result = AMparseSexpr(str);
	      if (result[0] == null) return [createMmlNode("mo", symbol.input), str];
	      AMremoveBrackets(result[0]);
	      var result2 = AMparseSexpr(result[1]);
	      if (result2[0] == null) return [createMmlNode("mo", symbol.input), str];
	      AMremoveBrackets(result2[0]);
	
	      var binaryTag = createMmlNode(symbol.tag);
	      if (symbol.input == "root" || symbol.input == "stackrel") binaryTag.appendChild(result2[0]);
	      binaryTag.appendChild(result[0]);
	      if (symbol.input == "frac") binaryTag.appendChild(result2[0]);
	      return [binaryTag, result2[1]];
	    case INFIX:
	      str = AMremoveCharsAndBlanks(str, symbol.input.length);
	      return [createMmlNode("mo", symbol.output), str];
	    case SPACE:
	      var mRow = createMmlNode("mrow");
	      str = AMremoveCharsAndBlanks(str, symbol.input.length);
	      node = createMmlNode("mspace");
	      node.setAttribute("width", "1ex");
	      mRow.appendChild(node);
	      mRow.appendChild(createMmlNode(symbol.tag, symbol.output));
	      node = createMmlNode("mspace");
	      node.setAttribute("width", "1ex");
	      mRow.appendChild(node);
	      return [mRow, str];
	    case LEFTRIGHT:
	      AMnestingDepth++;
	      str = AMremoveCharsAndBlanks(str, symbol.input.length);
	      result = AMparseExpr(str, false);
	      AMnestingDepth--;
	      var st = "";
	      if (result[0].lastChild != null) st = result[0].lastChild.firstChild.nodeValue;
	      if (st == "|") { // its an absolute value subterm
	        node = createMmlNode("mo", symbol.output);
	        node = createMmlNode("mrow", node);
	        node.appendChild(result[0]);
	        return [node, result[1]];
	      } else { // the "|" is a \mid so use unicode 2223 (divides) for spacing
	        node = createMmlNode("mo", "\u2223");
	        node = createMmlNode("mrow", node);
	        return [node, str];
	      }
	    default:
	      str = AMremoveCharsAndBlanks(str, symbol.input.length);
	      //symbol.tag is a constant
	      return [createMmlNode(symbol.tag, symbol.output), str];
	  }
	}
	
	function AMparseIexpr(str) {
	  var symbol, sym1, sym2, node, result, underover;
	  str = AMremoveCharsAndBlanks(str, 0);
	  sym1 = AMgetSymbol(str);
	  result = AMparseSexpr(str);
	  node = result[0];
	  str = result[1];
	  symbol = AMgetSymbol(str);
	  if (symbol.ttype == INFIX && symbol.input != "/") {
	    str = AMremoveCharsAndBlanks(str, symbol.input.length);
	    result = AMparseSexpr(str);
	    if (result[0] == null) // show box in place of missing argument
	    result[0] = createMmlNode("mo", "\u25A1");
	    else AMremoveBrackets(result[0]);
	    str = result[1];
	    if (symbol.input == "_") {
	      sym2 = AMgetSymbol(str);
	      underover = (sym1.ttype == UNDEROVER);
	      if (sym2.input == "^") {
	        str = AMremoveCharsAndBlanks(str, sym2.input.length);
	        var res2 = AMparseSexpr(str);
	        AMremoveBrackets(res2[0]);
	        str = res2[1];
	        node = createMmlNode((underover ? "munderover" : "msubsup"), node);
	        node.appendChild(result[0]);
	        node.appendChild(res2[0]);
	        node = createMmlNode("mrow", node); // so sum does not stretch
	      } else {
	        node = createMmlNode((underover ? "munder" : "msub"), node);
	        node.appendChild(result[0]);
	      }
	    } else {
	      node = createMmlNode(symbol.tag, node);
	      node.appendChild(result[0]);
	    }
	  }
	  return [node, str];
	}
	
	function AMparseExpr(str, rightbracket) {
	  var symbol, node, result, i,
	  newFrag = createFragment();
	  do {
	    str = AMremoveCharsAndBlanks(str, 0);
	    result = AMparseIexpr(str);
	    node = result[0];
	    str = result[1];
	    symbol = AMgetSymbol(str);
	    if (symbol.ttype == INFIX && symbol.input == "/") {
	      str = AMremoveCharsAndBlanks(str, symbol.input.length);
	      result = AMparseIexpr(str);
	      if (result[0] == null) // show box in place of missing argument
	      result[0] = createMmlNode("mo", "\u25A1");
	      else AMremoveBrackets(result[0]);
	      str = result[1];
	      AMremoveBrackets(node);
	      node = createMmlNode(symbol.tag, node);
	      node.appendChild(result[0]);
	      newFrag.appendChild(node);
	      symbol = AMgetSymbol(str);
	    } else if (node != undefined) newFrag.appendChild(node);
	  } while ((symbol.ttype != RIGHTBRACKET && (symbol.ttype != LEFTRIGHT || rightbracket) || AMnestingDepth == 0) && symbol != null && symbol.output != "");
	  if (symbol.ttype == RIGHTBRACKET || symbol.ttype == LEFTRIGHT) {
	    var len = newFrag.childNodes.length;
	    if (len > 0 && newFrag.childNodes[len - 1].nodeName == "mrow" && len > 1 && newFrag.childNodes[len - 2].nodeName == "mo" && newFrag.childNodes[len - 2].firstChild.nodeValue == ",") { //matrix
	      var right = newFrag.childNodes[len - 1].lastChild.firstChild.nodeValue;
	      if (right == ")" || right == "]") {
	        var left = newFrag.childNodes[len - 1].firstChild.firstChild.nodeValue;
	        if (left == "(" && right == ")" && symbol.output != "}" || left == "[" && right == "]") {
	          var pos = []; // positions of commas
	          var matrix = true;
	          var m = newFrag.childNodes.length;
	          for (i = 0; matrix && i < m; i = i + 2) {
	            pos[i] = [];
	            node = newFrag.childNodes[i];
	            if (matrix) matrix = node.nodeName == "mrow" && (i == m - 1 || node.nextSibling.nodeName == "mo" && node.nextSibling.firstChild.nodeValue == ",") && node.firstChild.firstChild.nodeValue == left && node.lastChild.firstChild.nodeValue == right;
	            if (matrix) {
	              for (var j = 0; j < node.childNodes.length; j++) {
	                if (node.childNodes[j].firstChild.nodeValue == ",") pos[i][pos[i].length] = j;
	              }
	            }
	            if (matrix && i > 1) matrix = pos[i].length == pos[i - 2].length;
	          }
	          if (matrix) {
	            var n, k, table = createMmlNode("mtable");
	            for (i = 0; i < m; i = i + 2) {
	              var row = createMmlNode("mtr");
	              var tableCell = createMmlNode("mtd");
	              node = newFrag.firstChild; // <mrow>(-,-,...,-,-)</mrow>
	              n = node.childNodes.length;
	              k = 0;
	              node.removeChild(node.firstChild); //remove (
	              for (j = 1; j < n - 1; j++) {
	                if (typeof pos[i][k] != "undefined" && j == pos[i][k]) {
	                  node.removeChild(node.firstChild); //remove ,
	                  row.appendChild(tableCell);
	                  tableCell = createMmlNode('mtd');
	                  k++;
	                } else tableCell.appendChild(node.firstChild);
	              }
	              row.appendChild(tableCell)
	              if (newFrag.childNodes.length > 2) {
	                newFrag.removeChild(newFrag.firstChild); //remove <mrow>)</mrow>
	                newFrag.removeChild(newFrag.firstChild); //remove <mo>,</mo>
	              }
	              table.appendChild(row);
	            }
	            node = table;
	            if (typeof symbol.invisible == "boolean" && symbol.invisible) node.setAttribute("columnalign", "left");
	            newFrag.replaceChild(node, newFrag.firstChild);
	          }
	        }
	      }
	    }
	    str = AMremoveCharsAndBlanks(str, symbol.input.length);
	    if (typeof symbol.invisible != "boolean" || !symbol.invisible) {
	      node = createMmlNode("mo", symbol.output);
	      newFrag.appendChild(node);
	    }
	  }
	  return [newFrag, str];
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var escapeStr = __webpack_require__(7);
	
	exports.Node = Node;
	exports.Text = Text;
	
	function Node(type) {
	  this.firstChild = null;
	  this.lastChild = null;
	  this.nodeName = type;
	  this.childNodes = [];
	  this.attributes = {};
	}
	Node.prototype.toElement = function () {
	  var el = document.createElementNS("http://www.w3.org/1998/Math/MathML", this.nodeName);
	  for (var i = 0; i < this.childNodes.length; i++) {
	    el.appendChild(this.childNodes[i].toElement());
	  }
	  var attributes = Object.keys(this.attributes);
	  for (var i = 0; i < attributes.length; i++) {
	    el.setAttribute(attributes[i], this.attributes[attributes[i]]);
	  }
	  return el;
	}
	
	Node.prototype.toString = function () {
	  var buf = [];
	  buf.push('<', this.nodeName);
	  var attributes = Object.keys(this.attributes);
	  for (var i = 0; i < attributes.length; i++) {
	    buf.push(' ', attributes[i], '="', this.attributes[attributes[i]], '"');
	  }
	  buf.push('>');
	  for (var i = 0; i < this.childNodes.length; i++) {
	    buf.push(this.childNodes[i].toString());
	  }
	
	  buf.push('</' + this.nodeName + '>');
	  return buf.join('');
	}
	
	Node.prototype.setAttribute = function (attr, val) {
	  this.attributes[attr] = val;
	};
	Node.prototype.appendChild = function (child) {
	  if (typeof child === 'string') {
	    this.appendChild(new Text(child), true);
	  } else if (child.nodeName === 'fragment') {
	    var len = child.childNodes.length;
	    for (var i = 0; i < len; i++) {
	      this.appendChild(child.childNodes[0], true);
	    }
	  } else {
	    if (child.parentNode) child.parentNode.removeChild(child);
	    child.parentNode = this;
	    this.childNodes.push(child);
	  }
	  this.updateChildNodes();
	  return child;
	};
	Node.prototype.removeChild = function (child) {
	  child.nextSibling = null;
	  var removed = false;
	  this.childNodes = this.childNodes.filter(function (c) {
	    if (!removed && c === child) {
	      removed = true;
	      return false;
	    } else {
	      return true;
	    }
	  });
	  child.parentNode = null;
	  this.updateChildNodes();
	  return child;
	}
	Node.prototype.replaceChild = function (newChild, oldChild) {
	  if (newChild.parentNode) newChild.parentNode.removeChild(child);
	  newChild.parentNode = this;
	  this.childNodes = this.childNodes.map(function (c) {
	    if (c === oldChild) return newChild;
	    else return c;
	  });
	  oldChild.parentNode = null;
	  this.updateChildNodes();
	  return oldChild;
	};
	Node.prototype.updateChildNodes = function () {
	  if (this.childNodes.length === 0) {
	    this.firstChild = null;
	    this.lastChild = null;
	  } else {
	    this.firstChild = this.childNodes[0];
	    this.lastChild = this.childNodes[this.childNodes.length - 1];
	  }
	  for (var i = 0; i < this.childNodes.length; i++) {
	    this.childNodes[i].nextSibling = this.childNodes[i+1] || null;
	  }
	};
	
	function Text(text) {
	  this.nodeValue = text;
	}
	Text.prototype.toElement = function () {
	  return document.createTextNode(this.nodeValue);
	};
	Text.prototype.toString = function () {
	  return escapeStr(this.nodeValue);
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	exports.CONST = 0;
	exports.UNARY = 1;
	exports.BINARY = 2;
	exports.INFIX = 3;
	exports.LEFTBRACKET = 4;
	exports.RIGHTBRACKET = 5;
	exports.SPACE = 6;
	exports.UNDEROVER = 7;
	exports.DEFINITION = 8;
	exports.LEFTRIGHT = 9;
	exports.TEXT = 10;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var tokenTypes = __webpack_require__(5);
	var CONST = tokenTypes.CONST;
	var UNARY = tokenTypes.UNARY;
	var BINARY = tokenTypes.BINARY;
	var INFIX = tokenTypes.INFIX;
	var LEFTBRACKET = tokenTypes.LEFTBRACKET;
	var RIGHTBRACKET = tokenTypes.RIGHTBRACKET;
	var SPACE = tokenTypes.SPACE;
	var UNDEROVER = tokenTypes.UNDEROVER;
	var DEFINITION = tokenTypes.DEFINITION;
	var LEFTRIGHT = tokenTypes.LEFTRIGHT;
	var TEXT = tokenTypes.TEXT;
	
	// character lists for Mozilla/Netscape fonts
	var AMcal = [0xEF35, 0x212C, 0xEF36, 0xEF37, 0x2130, 0x2131, 0xEF38, 0x210B, 0x2110, 0xEF39, 0xEF3A, 0x2112, 0x2133, 0xEF3B, 0xEF3C, 0xEF3D, 0xEF3E, 0x211B, 0xEF3F, 0xEF40, 0xEF41, 0xEF42, 0xEF43, 0xEF44, 0xEF45, 0xEF46];
	var AMfrk = [0xEF5D, 0xEF5E, 0x212D, 0xEF5F, 0xEF60, 0xEF61, 0xEF62, 0x210C, 0x2111, 0xEF63, 0xEF64, 0xEF65, 0xEF66, 0xEF67, 0xEF68, 0xEF69, 0xEF6A, 0x211C, 0xEF6B, 0xEF6C, 0xEF6D, 0xEF6E, 0xEF6F, 0xEF70, 0xEF71, 0x2128];
	var AMbbb = [0xEF8C, 0xEF8D, 0x2102, 0xEF8E, 0xEF8F, 0xEF90, 0xEF91, 0x210D, 0xEF92, 0xEF93, 0xEF94, 0xEF95, 0xEF96, 0x2115, 0xEF97, 0x2119, 0x211A, 0x211D, 0xEF98, 0xEF99, 0xEF9A, 0xEF9B, 0xEF9C, 0xEF9D, 0xEF9E, 0x2124];
	
	
	var symbols = [
	  //some greek symbols
	
	  {input: "alpha", tag: "mi", output: "\u03B1", tex: null, ttype: CONST}, 
	  {input: "beta", tag: "mi", output: "\u03B2", tex: null, ttype: CONST}, 
	  {input: "chi", tag: "mi", output: "\u03C7", tex: null, ttype: CONST}, 
	  {input: "delta", tag: "mi", output: "\u03B4", tex: null, ttype: CONST}, 
	  {input: "Delta", tag: "mo", output: "\u0394", tex: null, ttype: CONST}, 
	  {input: "epsi", tag: "mi", output: "\u03B5", tex: "epsilon", ttype: CONST}, 
	  {input: "varepsilon", tag: "mi", output: "\u025B", tex: null, ttype: CONST}, 
	  {input: "eta", tag: "mi", output: "\u03B7", tex: null, ttype: CONST}, 
	  {input: "gamma", tag: "mi", output: "\u03B3", tex: null, ttype: CONST}, 
	  {input: "Gamma", tag: "mo", output: "\u0393", tex: null, ttype: CONST}, 
	  {input: "iota", tag: "mi", output: "\u03B9", tex: null, ttype: CONST}, 
	  {input: "kappa", tag: "mi", output: "\u03BA", tex: null, ttype: CONST}, 
	  {input: "lambda", tag: "mi", output: "\u03BB", tex: null, ttype: CONST}, 
	  {input: "Lambda", tag: "mo", output: "\u039B", tex: null, ttype: CONST}, 
	  {input: "mu", tag: "mi", output: "\u03BC", tex: null, ttype: CONST}, 
	  {input: "nu", tag: "mi", output: "\u03BD", tex: null, ttype: CONST}, 
	  {input: "omega", tag: "mi", output: "\u03C9", tex: null, ttype: CONST}, 
	  {input: "Omega", tag: "mo", output: "\u03A9", tex: null, ttype: CONST}, 
	  {input: "phi", tag: "mi", output: "\u03C6", tex: null, ttype: CONST}, 
	  {input: "varphi", tag: "mi", output: "\u03D5", tex: null, ttype: CONST}, 
	  {input: "Phi", tag: "mo", output: "\u03A6", tex: null, ttype: CONST}, 
	  {input: "pi", tag: "mi", output: "\u03C0", tex: null, ttype: CONST}, 
	  {input: "Pi", tag: "mo", output: "\u03A0", tex: null, ttype: CONST}, 
	  {input: "psi", tag: "mi", output: "\u03C8", tex: null, ttype: CONST}, 
	  {input: "Psi", tag: "mi", output: "\u03A8", tex: null, ttype: CONST}, 
	  {input: "rho", tag: "mi", output: "\u03C1", tex: null, ttype: CONST}, 
	  {input: "sigma", tag: "mi", output: "\u03C3", tex: null, ttype: CONST}, 
	  {input: "Sigma", tag: "mo", output: "\u03A3", tex: null, ttype: CONST}, 
	  {input: "tau", tag: "mi", output: "\u03C4", tex: null, ttype: CONST}, 
	  {input: "theta", tag: "mi", output: "\u03B8", tex: null, ttype: CONST}, 
	  {input: "vartheta", tag: "mi", output: "\u03D1", tex: null, ttype: CONST}, 
	  {input: "Theta", tag: "mo", output: "\u0398", tex: null, ttype: CONST}, 
	  {input: "upsilon", tag: "mi", output: "\u03C5", tex: null, ttype: CONST}, 
	  {input: "xi", tag: "mi", output: "\u03BE", tex: null, ttype: CONST}, 
	  {input: "Xi", tag: "mo", output: "\u039E", tex: null, ttype: CONST}, 
	  {input: "zeta", tag: "mi", output: "\u03B6", tex: null, ttype: CONST},
	
	  //binary operation symbols
	  //{input:"-",  tag:"mo", output:"\u0096", tex:null, ttype:CONST},
	
	  {input: "*", tag: "mo", output: "\u22C5", tex: "cdot", ttype: CONST}, 
	  {input: "**", tag: "mo", output: "\u22C6", tex: "star", ttype: CONST}, 
	  {input: "//", tag: "mo", output: "/", tex: null, ttype: CONST}, 
	  {input: "\\\\", tag: "mo", output: "\\", tex: "backslash", ttype: CONST}, 
	  {input: "setminus", tag: "mo", output: "\\", tex: null, ttype: CONST}, 
	  {input: "xx", tag: "mo", output: "\u00D7", tex: "times", ttype: CONST}, 
	  {input: "-:", tag: "mo", output: "\u00F7", tex: "divide", ttype: CONST}, 
	  {input: "@", tag: "mo", output: "\u26AC", tex: "circ", ttype: CONST}, 
	  {input: "o+", tag: "mo", output: "\u2295", tex: "oplus", ttype: CONST}, 
	  {input: "ox", tag: "mo", output: "\u2297", tex: "otimes", ttype: CONST}, 
	  {input: "o.", tag: "mo", output: "\u2299", tex: "odot", ttype: CONST}, 
	  {input: "sum", tag: "mo", output: "\u2211", tex: null, ttype: UNDEROVER}, 
	  {input: "prod", tag: "mo", output: "\u220F", tex: null, ttype: UNDEROVER}, 
	  {input: "^^", tag: "mo", output: "\u2227", tex: "wedge", ttype: CONST}, 
	  {input: "^^^", tag: "mo", output: "\u22C0", tex: "bigwedge", ttype: UNDEROVER}, 
	  {input: "vv", tag: "mo", output: "\u2228", tex: "vee", ttype: CONST}, 
	  {input: "vvv", tag: "mo", output: "\u22C1", tex: "bigvee", ttype: UNDEROVER}, 
	  {input: "nn", tag: "mo", output: "\u2229", tex: "cap", ttype: CONST}, 
	  {input: "nnn", tag: "mo", output: "\u22C2", tex: "bigcap", ttype: UNDEROVER}, 
	  {input: "uu", tag: "mo", output: "\u222A", tex: "cup", ttype: CONST}, 
	  {input: "uuu", tag: "mo", output: "\u22C3", tex: "bigcup", ttype: UNDEROVER},
	
	  //binary relation symbols
	
	  {input: "!=", tag: "mo", output: "\u2260", tex: "ne", ttype: CONST}, 
	  {input: ":=", tag: "mo", output: ":=", tex: null, ttype: CONST}, 
	  {input: "lt", tag: "mo", output: "<", tex: null, ttype: CONST}, 
	  {input: "<=", tag: "mo", output: "\u2264", tex: "le", ttype: CONST}, 
	  {input: "lt=", tag: "mo", output: "\u2264", tex: "leq", ttype: CONST}, 
	  {input: ">=", tag: "mo", output: "\u2265", tex: "ge", ttype: CONST}, 
	  {input: "geq", tag: "mo", output: "\u2265", tex: null, ttype: CONST}, 
	  {input: "-<", tag: "mo", output: "\u227A", tex: "prec", ttype: CONST}, 
	  {input: "-lt", tag: "mo", output: "\u227A", tex: null, ttype: CONST}, 
	  {input: ">-", tag: "mo", output: "\u227B", tex: "succ", ttype: CONST}, 
	  {input: "-<=", tag: "mo", output: "\u2AAF", tex: "preceq", ttype: CONST}, 
	  {input: ">-=", tag: "mo", output: "\u2AB0", tex: "succeq", ttype: CONST}, 
	  {input: "in", tag: "mo", output: "\u2208", tex: null, ttype: CONST}, 
	  {input: "!in", tag: "mo", output: "\u2209", tex: "notin", ttype: CONST}, 
	  {input: "sub", tag: "mo", output: "\u2282", tex: "subset", ttype: CONST}, 
	  {input: "sup", tag: "mo", output: "\u2283", tex: "supset", ttype: CONST}, 
	  {input: "sube", tag: "mo", output: "\u2286", tex: "subseteq", ttype: CONST}, 
	  {input: "supe", tag: "mo", output: "\u2287", tex: "supseteq", ttype: CONST}, 
	  {input: "-=", tag: "mo", output: "\u2261", tex: "equiv", ttype: CONST}, 
	  {input: "~=", tag: "mo", output: "\u2245", tex: "cong", ttype: CONST}, 
	  {input: "~~", tag: "mo", output: "\u2248", tex: "approx", ttype: CONST}, 
	  {input: "prop", tag: "mo", output: "\u221D", tex: "propto", ttype: CONST},
	
	  //logical symbols
	
	  {input: "and", tag: "mtext", output: "and", tex: null, ttype: SPACE}, 
	  {input: "or", tag: "mtext", output: "or", tex: null, ttype: SPACE}, 
	  {input: "not", tag: "mo", output: "\u00AC", tex: "neg", ttype: CONST}, 
	  {input: "=>", tag: "mo", output: "\u21D2", tex: "implies", ttype: CONST}, 
	  {input: "if", tag: "mo", output: "if", tex: null, ttype: SPACE}, 
	  {input: "<=>", tag: "mo", output: "\u21D4", tex: "iff", ttype: CONST}, 
	  {input: "AA", tag: "mo", output: "\u2200", tex: "forall", ttype: CONST}, 
	  {input: "EE", tag: "mo", output: "\u2203", tex: "exists", ttype: CONST}, 
	  {input: "_|_", tag: "mo", output: "\u22A5", tex: "bot", ttype: CONST}, 
	  {input: "TT", tag: "mo", output: "\u22A4", tex: "top", ttype: CONST}, 
	  {input: "|--", tag: "mo", output: "\u22A2", tex: "vdash", ttype: CONST}, 
	  {input: "|==", tag: "mo", output: "\u22A8", tex: "models", ttype: CONST},
	
	  //grouping brackets
	
	  {input: "(", tag: "mo", output: "(", tex: null, ttype: LEFTBRACKET}, 
	  {input: ")", tag: "mo", output: ")", tex: null, ttype: RIGHTBRACKET}, 
	  {input: "[", tag: "mo", output: "[", tex: null, ttype: LEFTBRACKET}, 
	  {input: "]", tag: "mo", output: "]", tex: null, ttype: RIGHTBRACKET}, 
	  {input: "{", tag: "mo", output: "{", tex: null, ttype: LEFTBRACKET}, 
	  {input: "}", tag: "mo", output: "}", tex: null, ttype: RIGHTBRACKET}, 
	  {input: "|", tag: "mo", output: "|", tex: null, ttype: LEFTRIGHT},
	  //{input:"||", tag:"mo", output:"||", tex:null, ttype:LEFTRIGHT},
	
	  {input: "(:", tag: "mo", output: "\u2329", tex: "langle", ttype: LEFTBRACKET},
	  {input: ":)", tag: "mo", output: "\u232A", tex: "rangle", ttype: RIGHTBRACKET},
	  {input: "<<", tag: "mo", output: "\u2329", tex: null, ttype: LEFTBRACKET},
	  {input: ">>", tag: "mo", output: "\u232A", tex: null, ttype: RIGHTBRACKET},
	  {input: "{:", tag: "mo", output: "{:", tex: null, ttype: LEFTBRACKET, invisible: true},
	  {input: ":}", tag: "mo", output: ":}", tex: null, ttype: RIGHTBRACKET, invisible: true},
	
	  //miscellaneous symbols
	
	  {input: "int", tag: "mo", output: "\u222B", tex: null, ttype: CONST}, 
	  {input: "dx", tag: "mi", output: "{:d x:}", tex: null, ttype: DEFINITION}, 
	  {input: "dy", tag: "mi", output: "{:d y:}", tex: null, ttype: DEFINITION}, 
	  {input: "dz", tag: "mi", output: "{:d z:}", tex: null, ttype: DEFINITION}, 
	  {input: "dt", tag: "mi", output: "{:d t:}", tex: null, ttype: DEFINITION}, 
	  {input: "oint", tag: "mo", output: "\u222E", tex: null, ttype: CONST}, 
	  {input: "del", tag: "mo", output: "\u2202", tex: "partial", ttype: CONST}, 
	  {input: "grad", tag: "mo", output: "\u2207", tex: "nabla", ttype: CONST}, 
	  {input: "+-", tag: "mo", output: "\u00B1", tex: "pm", ttype: CONST}, 
	  {input: "O/", tag: "mo", output: "\u2205", tex: "emptyset", ttype: CONST}, 
	  {input: "oo", tag: "mo", output: "\u221E", tex: "infty", ttype: CONST}, 
	  {input: "aleph", tag: "mo", output: "\u2135", tex: null, ttype: CONST}, 
	  {input: "...", tag: "mo", output: "...", tex: "ldots", ttype: CONST}, 
	  {input: ":.", tag: "mo", output: "\u2234", tex: "therefore", ttype: CONST}, 
	  {input: "/_", tag: "mo", output: "\u2220", tex: "angle", ttype: CONST}, 
	  {input: "\\ ", tag: "mo", output: "\u00A0", tex: null, ttype: CONST}, 
	  {input: "quad", tag: "mo", output: "\u00A0\u00A0", tex: null, ttype: CONST}, 
	  {input: "qquad", tag: "mo", output: "\u00A0\u00A0\u00A0\u00A0", tex: null, ttype: CONST}, 
	  {input: "cdots", tag: "mo", output: "\u22EF", tex: null, ttype: CONST}, 
	  {input: "vdots", tag: "mo", output: "\u22EE", tex: null, ttype: CONST}, 
	  {input: "ddots", tag: "mo", output: "\u22F1", tex: null, ttype: CONST}, 
	  {input: "diamond", tag: "mo", output: "\u22C4", tex: null, ttype: CONST}, 
	  {input: "square", tag: "mo", output: "\u25A1", tex: null, ttype: CONST}, 
	  {input: "|__", tag: "mo", output: "\u230A", tex: "lfloor", ttype: CONST}, 
	  {input: "__|", tag: "mo", output: "\u230B", tex: "rfloor", ttype: CONST}, 
	  {input: "|~", tag: "mo", output: "\u2308", tex: "lceiling", ttype: CONST}, 
	  {input: "~|", tag: "mo", output: "\u2309", tex: "rceiling", ttype: CONST}, 
	  {input: "CC", tag: "mo", output: "\u2102", tex: null, ttype: CONST}, 
	  {input: "NN", tag: "mo", output: "\u2115", tex: null, ttype: CONST}, 
	  {input: "QQ", tag: "mo", output: "\u211A", tex: null, ttype: CONST}, 
	  {input: "RR", tag: "mo", output: "\u211D", tex: null, ttype: CONST}, 
	  {input: "ZZ", tag: "mo", output: "\u2124", tex: null, ttype: CONST},
	  {input: "f", tag: "mi", output: "f", tex: null, ttype: UNARY, func: true},
	  {input: "g", tag: "mi", output: "g", tex: null, ttype: UNARY, func: true},
	
	  //standard functions
	
	  {input: "lim", tag: "mo", output: "lim", tex: null, ttype: UNDEROVER}, 
	  {input: "Lim", tag: "mo", output: "Lim", tex: null, ttype: UNDEROVER},
	  {input: "sin", tag: "mo", output: "sin", tex: null, ttype: UNARY, func: true},
	  {input: "cos", tag: "mo", output: "cos", tex: null, ttype: UNARY, func: true},
	  {input: "tan", tag: "mo", output: "tan", tex: null, ttype: UNARY, func: true},
	  {input: "sinh", tag: "mo", output: "sinh", tex: null, ttype: UNARY, func: true},
	  {input: "cosh", tag: "mo", output: "cosh", tex: null, ttype: UNARY, func: true},
	  {input: "tanh", tag: "mo", output: "tanh", tex: null, ttype: UNARY, func: true},
	  {input: "cot", tag: "mo", output: "cot", tex: null, ttype: UNARY, func: true},
	  {input: "sec", tag: "mo", output: "sec", tex: null, ttype: UNARY, func: true},
	  {input: "csc", tag: "mo", output: "csc", tex: null, ttype: UNARY, func: true},
	  {input: "log", tag: "mo", output: "log", tex: null, ttype: UNARY, func: true},
	  {input: "ln", tag: "mo", output: "ln", tex: null, ttype: UNARY, func: true},
	  {input: "det", tag: "mo", output: "det", tex: null, ttype: UNARY, func: true}, 
	  {input: "dim", tag: "mo", output: "dim", tex: null, ttype: CONST}, 
	  {input: "mod", tag: "mo", output: "mod", tex: null, ttype: CONST},
	  {input: "gcd", tag: "mo", output: "gcd", tex: null, ttype: UNARY, func: true},
	  {input: "lcm", tag: "mo", output: "lcm", tex: null, ttype: UNARY, func: true}, 
	  {input: "lub", tag: "mo", output: "lub", tex: null, ttype: CONST}, 
	  {input: "glb", tag: "mo", output: "glb", tex: null, ttype: CONST}, 
	  {input: "min", tag: "mo", output: "min", tex: null, ttype: UNDEROVER}, 
	  {input: "max", tag: "mo", output: "max", tex: null, ttype: UNDEROVER},
	
	  //arrows
	
	  {input: "uarr", tag: "mo", output: "\u2191", tex: "uparrow", ttype: CONST}, 
	  {input: "darr", tag: "mo", output: "\u2193", tex: "downarrow", ttype: CONST}, 
	  {input: "rarr", tag: "mo", output: "\u2192", tex: "rightarrow", ttype: CONST}, 
	  {input: "->", tag: "mo", output: "\u2192", tex: "to", ttype: CONST}, 
	  {input: ">->", tag: "mo", output: "\u21A3", tex: "rightarrowtail", ttype: CONST}, 
	  {input: "->>", tag: "mo", output: "\u21A0", tex: "twoheadrightarrow", ttype: CONST}, 
	  {input: ">->>", tag: "mo", output: "\u2916", tex: "twoheadrightarrowtail", ttype: CONST}, 
	  {input: "|->", tag: "mo", output: "\u21A6", tex: "mapsto", ttype: CONST}, 
	  {input: "larr", tag: "mo", output: "\u2190", tex: "leftarrow", ttype: CONST}, 
	  {input: "harr", tag: "mo", output: "\u2194", tex: "leftrightarrow", ttype: CONST}, 
	  {input: "rArr", tag: "mo", output: "\u21D2", tex: "Rightarrow", ttype: CONST}, 
	  {input: "lArr", tag: "mo", output: "\u21D0", tex: "Leftarrow", ttype: CONST}, 
	  {input: "hArr", tag: "mo", output: "\u21D4", tex: "Leftrightarrow", ttype: CONST},
	  //commands with argument
	
	  {input: "sqrt", tag: "msqrt", output: "sqrt", tex: null, ttype: UNARY}, 
	  {input: "root", tag: "mroot", output: "root", tex: null, ttype: BINARY}, 
	  {input: "frac", tag: "mfrac", output: "/", tex: null, ttype: BINARY}, 
	  {input: "/", tag: "mfrac", output: "/", tex: null, ttype: INFIX}, 
	  {input: "stackrel", tag: "mover", output: "stackrel", tex: null, ttype: BINARY}, 
	  {input: "_", tag: "msub", output: "_", tex: null, ttype: INFIX}, 
	  {input: "^", tag: "msup", output: "^", tex: null, ttype: INFIX},
	  {input: "hat", tag: "mover", output: "^", tex: null, ttype: UNARY, acc: true},
	  {input: "bar", tag: "mover", output: "\u00AF", tex: "overline", ttype: UNARY, acc: true},
	  {input: "vec", tag: "mover", output: "\u2192", tex: null, ttype: UNARY, acc: true},
	  {input: "line", tag: "mover", output: "\u2194", tex: null, ttype: UNARY, acc: true},
	  {input: "dot", tag: "mover", output: ".", tex: null, ttype: UNARY, acc: true},
	  {input: "ddot", tag: "mover", output: "..", tex: null, ttype: UNARY, acc: true},
	  {input: "ul", tag: "munder", output: "\u0332", tex: "underline", ttype: UNARY, acc: true}, 
	  {input: "text", tag: "mtext", output: "text", tex: null, ttype: TEXT}, 
	  {input: "mbox", tag: "mtext", output: "mbox", tex: null, ttype: TEXT},
	  {input: "\"", tag: "mtext", output: "mbox", tex: null, ttype: TEXT},
	  {input: "bb", tag: "mstyle", atname: "fontweight", atval: "bold", output: "bb", tex: null, ttype: UNARY},
	  {input: "mathbf", tag: "mstyle", atname: "fontweight", atval: "bold", output: "mathbf", tex: null, ttype: UNARY},
	  {input: "sf", tag: "mstyle", atname: "fontfamily", atval: "sans-serif", output: "sf", tex: null, ttype: UNARY},
	  {input: "mathsf", tag: "mstyle", atname: "fontfamily", atval: "sans-serif", output: "mathsf", tex: null, ttype: UNARY},
	  {input: "bbb", tag: "mstyle", atname: "mathvariant", atval: "double-struck", output: "bbb", tex: null, ttype: UNARY, codes: AMbbb},
	  {input: "mathbb", tag: "mstyle", atname: "mathvariant", atval: "double-struck", output: "mathbb", tex: null, ttype: UNARY, codes: AMbbb},
	  {input: "cc", tag: "mstyle", atname: "mathvariant", atval: "script", output: "cc", tex: null, ttype: UNARY, codes: AMcal},
	  {input: "mathcal", tag: "mstyle", atname: "mathvariant", atval: "script", output: "mathcal", tex: null, ttype: UNARY, codes: AMcal},
	  {input: "tt", tag: "mstyle", atname: "fontfamily", atval: "monospace", output: "tt", tex: null, ttype: UNARY},
	  {input: "mathtt", tag: "mstyle", atname: "fontfamily", atval: "monospace", output: "mathtt", tex: null, ttype: UNARY},
	  {input: "fr", tag: "mstyle", atname: "mathvariant", atval: "fraktur", output: "fr", tex: null, ttype: UNARY, codes: AMfrk},
	  {input: "mathfrak", tag: "mstyle", atname: "mathvariant", atval: "fraktur", output: "mathfrak", tex: null, ttype: UNARY, codes: AMfrk}
	];
	
	var texsymbols = [];
	for (var i = 0; i < symbols.length; i++) {
	  if (symbols[i].tex) {
	    texsymbols.push({
	      input: symbols[i].tex,
	      tag: symbols[i].tag,
	      output: symbols[i].output,
	      ttype: symbols[i].ttype
	    });
	  }
	}
	symbols = symbols.concat(texsymbols);
	symbols.sort(compareNames);
	
	module.exports = symbols;
	
	function compareNames(s1, s2) {
	  if (s1.input > s2.input) return 1;
	  else return -1;
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*
	
	Generated with the code:
	
	request('http://www.escapecodes.info', function (err, res, body) {
	  if (err) throw err;
	  body = body.toString();
	  var pattern = /<span class=\"tip\">\&amp;([^;]+);<br \/>\&amp;#([^;]+);/g;
	  var match;
	
	  var lookup = {};
	  while (match = pattern.exec(body)) {
	    lookup[match[2]] = match[1];
	  }
	  fs.writeFileSync(path.join(__dirname, 'escape-lookup.json'), JSON.stringify(lookup, null, 2));
	})
	
	*/
	
	var lookup = {
	  34: 'quot',
	  38: 'amp',
	  60: 'lt',
	  62: 'gt',
	  161: 'iexcl',
	  162: 'cent',
	  163: 'pound',
	  164: 'curren',
	  165: 'yen',
	  166: 'brvbar',
	  167: 'sect',
	  168: 'uml',
	  169: 'copy',
	  170: 'ordf',
	  171: 'laquo',
	  172: 'not',
	  173: 'shy',
	  174: 'reg',
	  175: 'macr',
	  176: 'deg',
	  177: 'plusmn',
	  178: 'sup2',
	  179: 'sup3',
	  180: 'acute',
	  181: 'micro',
	  182: 'para',
	  183: 'middot',
	  184: 'cedil',
	  185: 'sup1',
	  186: 'ordm',
	  187: 'raquo',
	  188: 'frac14',
	  189: 'frac12',
	  190: 'frac34',
	  191: 'iquest',
	  192: 'Agrave',
	  193: 'Aacute',
	  194: 'Acirc',
	  195: 'Atilde',
	  196: 'Auml',
	  197: 'Aring',
	  198: 'AElig',
	  199: 'Ccedil',
	  200: 'Egrave',
	  201: 'Eacute',
	  202: 'Ecirc',
	  203: 'Euml',
	  204: 'Igrave',
	  205: 'Iacute',
	  206: 'Icirc',
	  207: 'Iuml',
	  208: 'ETH',
	  209: 'Ntilde',
	  210: 'Ograve',
	  211: 'Oacute',
	  212: 'Ocirc',
	  213: 'Otilde',
	  214: 'Ouml',
	  215: 'times',
	  216: 'Oslash',
	  217: 'Ugrave',
	  218: 'Uacute',
	  219: 'Ucirc',
	  220: 'Uuml',
	  221: 'Yacute',
	  222: 'THORN',
	  223: 'szlig',
	  224: 'agrave',
	  225: 'aacute',
	  226: 'acirc',
	  227: 'atilde',
	  228: 'auml',
	  229: 'aring',
	  230: 'aelig',
	  231: 'ccedil',
	  232: 'egrave',
	  233: 'eacute',
	  234: 'ecirc',
	  235: 'euml',
	  236: 'igrave',
	  237: 'iacute',
	  238: 'icirc',
	  239: 'iuml',
	  240: 'eth',
	  241: 'ntilde',
	  242: 'ograve',
	  243: 'oacute',
	  244: 'ocirc',
	  245: 'otilde',
	  246: 'ouml',
	  247: 'divide',
	  248: 'oslash',
	  249: 'ugrave',
	  250: 'uacute',
	  251: 'ucirc',
	  252: 'uuml',
	  253: 'yacute',
	  255: 'yuml',
	  338: 'OElig',
	  339: 'oelig',
	  352: 'Scaron',
	  353: 'scaron',
	  376: 'Yuml',
	  402: 'fnof',
	  913: 'Alpha',
	  914: 'Beta',
	  915: 'Gamma',
	  916: 'Delta',
	  917: 'Epsilon',
	  918: 'Zeta',
	  919: 'Eta',
	  920: 'Theta',
	  921: 'Iota',
	  922: 'Kappa',
	  923: 'Lambda',
	  925: 'Nu',
	  926: 'Xi',
	  927: 'Omicron',
	  928: 'Pi',
	  929: 'Rho',
	  931: 'Sigma',
	  932: 'Tau',
	  933: 'Upsilon',
	  934: 'Phi',
	  935: 'Chi',
	  936: 'Psi',
	  937: 'Omega',
	  945: 'alpha',
	  946: 'beta',
	  947: 'gamma',
	  948: 'delta',
	  949: 'epsilon',
	  950: 'zeta',
	  951: 'eta',
	  952: 'theta',
	  953: 'iota',
	  954: 'kappa',
	  955: 'lambda',
	  956: 'mu',
	  957: 'nu',
	  958: 'xi',
	  959: 'omicron',
	  960: 'pi',
	  961: 'rho',
	  962: 'sigmaf',
	  963: 'sigma',
	  964: 'tau',
	  965: 'upsilon',
	  966: 'phi',
	  967: 'chi',
	  968: 'psi',
	  969: 'omega',
	  977: 'thetasym',
	  978: 'upsih',
	  982: 'piv',
	  8211: 'ndash',
	  8212: 'mdash',
	  8216: 'lsquo',
	  8217: 'rsquo',
	  8218: 'sbquo',
	  8220: 'ldquo',
	  8221: 'rdquo',
	  8222: 'bdquo',
	  8224: 'dagger',
	  8225: 'Dagger',
	  8240: 'permil',
	  8249: 'lsaquo',
	  8250: 'rsaquo',
	  8364: 'euro',
	  8465: 'image',
	  8472: 'weierp',
	  8476: 'real',
	  8482: 'trade',
	  8501: 'alefsym',
	  8592: 'larr',
	  8593: 'uarr',
	  8594: 'rarr',
	  8595: 'darr',
	  8596: 'harr',
	  8629: 'crarr',
	  8656: 'lArr',
	  8657: 'uArr',
	  8658: 'rArr',
	  8659: 'dArr',
	  8660: 'hArr',
	  8704: 'forall',
	  8706: 'part',
	  8707: 'exist',
	  8709: 'empty',
	  8711: 'nabla',
	  8712: 'isin',
	  8713: 'notin',
	  8715: 'ni',
	  8719: 'prod',
	  8721: 'sum',
	  8722: 'minus',
	  8727: 'lowast',
	  8730: 'radic',
	  8733: 'prop',
	  8734: 'infin',
	  8736: 'ang',
	  8743: 'and',
	  8744: 'or',
	  8745: 'cap',
	  8746: 'cup',
	  8747: 'int',
	  8756: 'there4',
	  8764: 'sim',
	  8773: 'cong',
	  8776: 'asymp',
	  8800: 'ne',
	  8801: 'equiv',
	  8804: 'le',
	  8805: 'ge',
	  8834: 'sub',
	  8835: 'sup',
	  8836: 'nsub',
	  8838: 'sube',
	  8839: 'supe',
	  8853: 'oplus',
	  8855: 'otimes',
	  8869: 'perp',
	  8901: 'sdot',
	  8968: 'lceil',
	  8969: 'rceil',
	  8970: 'lfloor',
	  8971: 'rfloor',
	  9001: 'lang',
	  9002: 'rang',
	  9674: 'loz',
	  9824: 'spades',
	  9827: 'clubs',
	  9829: 'hearts',
	  9830: 'diams'
	};
	
	module.exports = HTMLEncode;
	function HTMLEncode(str){
	  var i = str.length,
	      aRet = [];
	
	  while (i--) {
	    var iC = str.charCodeAt(i);
	    if (lookup[iC]) {
	      aRet[i] = '&' + lookup[iC] + ';';
	    } else if (iC > 127) { //See: http://en.wikipedia.org/wiki/List_of_Unicode_characters for list of unicode characters
	      aRet[i] = '&#' + iC + ';';
	    } else {
	      aRet[i] = str[i];
	    }
	   }
	  return aRet.join('');    
	}

/***/ }
/******/ ])
});

//# sourceMappingURL=react-math.map