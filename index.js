'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function selectInputText(element) {
  element.setSelectionRange(0, element.value.length);
}

var InlineEdit = function (_React$Component) {
  _inherits(InlineEdit, _React$Component);

  function InlineEdit() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, InlineEdit);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = InlineEdit.__proto__ || Object.getPrototypeOf(InlineEdit)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      editing: _this.props.editing,
      text: _this.props.text,
      minLength: _this.props.minLength,
      maxLength: _this.props.maxLength,
      asyncStatus: false,
      inputWidth: 0,
      inputHeight: null
    }, _this.startEditing = function (e) {
      if (_this.props.stopPropagation) {
        e.stopPropagation();
      }
      _this.setState({
        editing: true,
        text: _this.props.text,
        inputWidth: _this.refs.inlineText.offsetWidth
      });
    }, _this.finishEditing = function () {
      if (_this.isInputValid(_this.state.text) && _this.props.text != _this.state.text) {
        _this.commitEditing();
      } else if (_this.props.text === _this.state.text || !_this.isInputValid(_this.state.text)) {
        _this.cancelEditing();
      }
    }, _this.cancelEditing = function () {
      _this.setState({ editing: false, text: _this.props.text });
    }, _this.commitEditing = function () {
      _this.setState({ editing: false, text: _this.state.text });
      var newProp = {};
      var paramName = _this.props.paramName ? _this.props.paramName : 'value';
      newProp[paramName] = _this.state.text;
      if (_this.props.asyncChange) {
        _this.props.asyncChange.call(_this, newProp);
      } else {
        _this.props.change(newProp);
      }
    }, _this.clickWhenEditing = function (e) {
      if (_this.props.stopPropagation) {
        e.stopPropagation();
      }
    }, _this.isInputValid = function (text) {
      return text.length >= _this.state.minLength && text.length <= _this.state.maxLength;
    }, _this.keyDown = function (event) {
      if (event.keyCode === 13) {
        _this.finishEditing();
      } else if (event.keyCode === 27) {
        _this.cancelEditing();
      }
    }, _this.textChanged = function (event) {
      _this.setState({
        text: event.target.value.trim()
      });
    }, _this.getEditBtn = function () {
      var asyncClass = _this.state.asyncStatus ? 'async-' + _this.state.asyncStatus : '';
      if (!_this.props.editBtn) {
        return _react2.default.createElement('div', { className: 'edit ' + (_this.props.element || _this.props.staticElement) + ' ' + asyncClass,
          onClick: _this.startEditing });
      } else {
        return null;
      }
    }, _this.updateParentStateHandler = function (state) {
      _this.setState(state);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(InlineEdit, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.isInputValid = this.props.validate || this.isInputValid;
      // Warn about deprecated elements
      if (this.props.element) {
        console.warn('`element` prop is deprecated: instead pass editingElement or staticElement to InlineEdit component');
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var isTextChanged = nextProps.text !== this.props.text;
      var isEditingChanged = nextProps.editing !== this.props.editing;
      var nextState = {};
      if (isTextChanged) {
        nextState.text = nextProps.text;
      }
      if (isEditingChanged) {
        nextState.editing = nextProps.editing;
      }
      if (isTextChanged || isEditingChanged) {
        this.setState(nextState);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var inputElem = _reactDom2.default.findDOMNode(this.refs.input);
      if (this.state.editing && !prevState.editing) {
        inputElem.focus();
        if (this.props.selectAllOnEdit) {
          selectInputText(inputElem);
        }
      } else if (this.state.editing && prevProps.text != this.props.text) {
        this.finishEditing();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var EditBtn = this.getEditBtn();
      if (this.props.isDisabled) {
        var Element = this.props.element || this.props.staticElement;
        return _react2.default.createElement(
          'div',
          { className: 'inline-edit ' + (this.props.className ? 'inline-edit-' + this.props.className : '') },
          _react2.default.createElement(
            Element,
            { className: this.props.className,
              style: this.props.style },
            this.state.text || this.props.placeholder
          ),
          EditBtn
        );
      } else if (!this.state.editing) {
        var _Element = this.props.element || this.props.staticElement;
        return _react2.default.createElement(
          'div',
          { className: 'inline-edit ' + (this.props.className ? 'inline-edit-' + this.props.className : '') },
          _react2.default.createElement(
            _Element,
            { className: this.props.className,
              onClick: this.startEditing,
              tabIndex: this.props.tabIndex,
              style: this.props.style,
              ref: 'inlineText' },
            this.state.text || this.props.placeholder
          ),
          EditBtn
        );
      } else {
        /* Just a random name to avoid namespace collisions.
         * "Ghost element" is needed to render for finding
         * the right length for the input.
         *
         * Ghost fires update event after the parent element
         * is updated - and thne sets the parent state width.
         *
         * Dangerous method, since firing setState to parent on
         * render easily causes infinite loop, but also very
         * hacky solution.
         */

        var _Element2 = this.props.element || this.props.editingElement;
        var isTextArea = this.props.editingElement == 'textarea';
        var setInlineEditWidth = isTextArea ? {} : { width: this.state.inputWidth + 1 + 'px' };
        var setInputHeight = isTextArea ? { height: this.state.inputHeight } : {};
        return _react2.default.createElement(
          'div',
          { className: 'inline-edit ' + (this.props.activeClassName ? this.props.activeClassName : 'editing') + ' ' + (this.props.className ? 'inline-edit-' + this.props.className : ''),
            style: setInlineEditWidth },
          _react2.default.createElement(GhostElem, { className: this.props.className + ' ' + (isTextArea ? 'ghost-textarea' : ''),
            style: _extends({}, this.props.style),
            setParentState: this.updateParentStateHandler,
            editingElement: this.props.editingElement // is this needed?
            , staticElem: this.props.staticElement,
            inputValue: this.state.text || this.props.placeholder,
            inputDimensions: { width: this.state.inputWidth, height: this.state.inputHeight } }),
          _react2.default.createElement(_Element2, { className: (this.props.className ? this.props.className : '') + ' ' + this.props.staticElement,
            onClick: this.clickWhenEditing,
            onKeyDown: this.keyDown,
            onBlur: this.finishEditing,
            placeholder: this.props.placeholder,
            defaultValue: this.state.text,
            onChange: this.textChanged,
            style: _extends({}, this.props.style, setInputHeight),
            ref: 'input' }),
          EditBtn
        );
      }
    }
  }]);

  return InlineEdit;
}(_react2.default.Component);

/* Ghost elem mimics the parent element as
 * good as possible to get the most accurate
 * width.
 */

InlineEdit.propTypes = {
  text: _react2.default.PropTypes.string,
  paramName: _react2.default.PropTypes.string.isRequired,
  change: _react2.default.PropTypes.func,
  asyncChange: _react2.default.PropTypes.func,
  placeholder: _react2.default.PropTypes.string,
  className: _react2.default.PropTypes.string,
  activeClassName: _react2.default.PropTypes.string,
  minLength: _react2.default.PropTypes.number,
  maxLength: _react2.default.PropTypes.number,
  validate: _react2.default.PropTypes.func,
  style: _react2.default.PropTypes.object,
  editingElement: _react2.default.PropTypes.string,
  staticElement: _react2.default.PropTypes.string,
  tabIndex: _react2.default.PropTypes.number,
  isDisabled: _react2.default.PropTypes.bool,
  editing: _react2.default.PropTypes.bool
};
InlineEdit.defaultProps = {
  minLength: 1,
  maxLength: 256,
  editingElement: 'input',
  staticElement: 'span',
  tabIndex: 0,
  isDisabled: false,
  editing: false
};
exports.default = InlineEdit;
var GhostElem = function (_React$Component2) {
  _inherits(GhostElem, _React$Component2);

  function GhostElem(props) {
    _classCallCheck(this, GhostElem);

    var _this2 = _possibleConstructorReturn(this, (GhostElem.__proto__ || Object.getPrototypeOf(GhostElem)).call(this, props));

    _this2.state = {
      text: _this2.props.inputValue
    };

    _this2.setParentState = _this2.props.setParentState;
    return _this2;
  }

  _createClass(GhostElem, [{
    key: 'updateParentDimensions',
    value: function updateParentDimensions() {
      var ghostWidth = this.refs.measureDimensions.offsetWidth;
      var ghostHeight = this.refs.measureDimensions.offsetHeight;
      var inputWidth = this.props.inputDimensions.width;
      var inputHeight = this.props.inputDimensions.height;
      if (inputHeight != ghostHeight || inputWidth != ghostWidth) {
        this.props.setParentState({
          inputWidth: ghostWidth,
          inputHeight: ghostHeight
        });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.updateParentDimensions();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      /* Danger zone! Updating state quite a lot in componentDidUpdate.
       * Careful if changing conditionals.
       */
      if (!this.props.inputValue && this.state.text != '\xA0') {
        this.setState({ text: '\xA0' });
      } else if (this.props.inputValue && this.props.inputValue != this.state.text) {
        this.setState({ text: this.props.inputValue });
      } else {
        this.updateParentDimensions();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      /* This is rendered somewhat three times to exchange data enough
       * times with the parent. Not the most efficient way, but I suppose
       * does the job
       */
      var StaticElem = this.props.staticElem;
      var inputValue = this.props.inputValue;
      var getWidth = this.props.editingElement == 'textarea' ? { width: '100%' } : {};
      return _react2.default.createElement(
        StaticElem,
        { className: this.props.className + ' measure-length ghost-elem',
          style: _extends({}, this.props.style, getWidth),
          ref: 'measureDimensions' },
        this.state.text
      );
    }
  }]);

  return GhostElem;
}(_react2.default.Component);
