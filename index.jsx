import React from 'react';
import ReactDOM from 'react-dom';

function selectInputText(element) {
  element.setSelectionRange(0, element.value.length);
}

export default class InlineEdit extends React.Component {
  static propTypes = {
    text: React.PropTypes.string,
    paramName: React.PropTypes.string.isRequired,
    change: React.PropTypes.func,
    asyncChange: React.PropTypes.func,
    placeholder: React.PropTypes.string,
    className: React.PropTypes.string,
    activeClassName: React.PropTypes.string,
    minLength: React.PropTypes.number,
    maxLength: React.PropTypes.number,
    validate: React.PropTypes.func,
    style: React.PropTypes.object,
    editingElement: React.PropTypes.string,
    staticElement: React.PropTypes.string,
    tabIndex: React.PropTypes.number,
    isDisabled: React.PropTypes.bool,
    editing: React.PropTypes.bool
  };

  static defaultProps = {
    minLength: 1,
    maxLength: 256,
    editingElement: 'input',
    staticElement: 'span',
    tabIndex: 0,
    isDisabled: false,
    editing: false
  };

  state = {
    editing: this.props.editing,
    text: this.props.text,
    minLength: this.props.minLength,
    maxLength: this.props.maxLength,
    asyncStatus: false,
    inputWidth: 0,
    inputHeight: null
  };

  componentWillMount() {
    this.isInputValid = this.props.validate || this.isInputValid;
    // Warn about deprecated elements
    if (this.props.element) {
      console.warn('`element` prop is deprecated: instead pass editingElement or staticElement to InlineEdit component');
    }
  }

  componentWillReceiveProps(nextProps) {
    const isTextChanged = (nextProps.text !== this.props.text);
    const isEditingChanged = (nextProps.editing !== this.props.editing);
    let nextState = {};
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

  componentDidUpdate(prevProps, prevState) {
    let inputElem = ReactDOM.findDOMNode(this.refs.input);
    if (this.state.editing && !prevState.editing) {
      inputElem.focus();
      if(this.props.selectAllOnEdit) {
        selectInputText(inputElem);
      }
    } else if (this.state.editing && prevProps.text != this.props.text) {
      this.finishEditing();
    }
  }

  startEditing = (e) => {
    if (this.props.stopPropagation) {
      e.stopPropagation()
    }
    this.setState({
      editing: true,
      text: this.props.text,
      inputWidth: this.refs.inlineText.offsetWidth
    });
  };

  finishEditing = () => {
    if (this.isInputValid(this.state.text) && this.props.text != this.state.text){
      this.commitEditing();
    } else if (this.props.text === this.state.text || !this.isInputValid(this.state.text)) {
      this.cancelEditing();
    }
  };

  cancelEditing = () => {
    this.setState({editing: false, text: this.props.text});
  };

  commitEditing = () => {
    this.setState({editing: false, text: this.state.text});
    let newProp = {};
    let paramName = this.props.paramName ? this.props.paramName : 'value';
    newProp[paramName] = this.state.text;
    if (this.props.asyncChange) {
      this.props.asyncChange.call(this, newProp)
    }
    else {
      this.props.change(newProp);
    }
  };

  clickWhenEditing = (e) => {
    if (this.props.stopPropagation) {
      e.stopPropagation();
    }
  };

  isInputValid = (text) => {
    return (text.length >= this.state.minLength && text.length <= this.state.maxLength);
  };

  keyDown = (event) => {
    if (event.keyCode === 13) {
      this.finishEditing();
    } else if (event.keyCode === 27) {
      this.cancelEditing();
    }
  };

  textChanged = (event) => {
    this.setState({
      text: event.target.value.trim(),
    });
  };

  getEditBtn = () => {
    let asyncClass = this.state.asyncStatus ? `async-${this.state.asyncStatus }` : '';
    if (!this.props.editBtn) {
      return <div className={ 
                    `edit ${this.props.element || this.props.staticElement} ${ asyncClass }` 
                  } 
                  onClick={ this.startEditing } />
    }
    else {
      return null;
    }
  }

  updateParentStateHandler = (state) => {
    this.setState(state)
  }

  render() {
    const EditBtn = this.getEditBtn();
    if (this.props.isDisabled) {
      const Element = this.props.element || this.props.staticElement;
      return <div className={ `inline-edit ${this.props.className ? 'inline-edit-' + this.props.className : ''}` }>
                <Element className={this.props.className}
                     style={this.props.style} >
                     {this.state.text || this.props.placeholder}
                </Element>
                { EditBtn }
            </div>
    } else if (!this.state.editing) {
      const Element = this.props.element || this.props.staticElement;
      return  <div className={ `inline-edit ${this.props.className ? 'inline-edit-' + this.props.className : ''}` } >
            <Element className={this.props.className}
                 onClick={this.startEditing}
                 tabIndex={this.props.tabIndex}
                 style={this.props.style}
                 ref="inlineText">
                 {this.state.text || this.props.placeholder}
            </Element>
            { EditBtn }
          </div>
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

      const Element = this.props.element || this.props.editingElement;
      let isTextArea = this.props.editingElement=='textarea'
      let setInlineEditWidth =  isTextArea ? {} : { width: `${ this.state.inputWidth + 1 }px`} 
      let setInputHeight = isTextArea ? { height: this.state.inputHeight } : {}
      return  <div className={ `inline-edit ${ this.props.activeClassName ? this.props.activeClassName : 'editing'} ${this.props.className ? 'inline-edit-' + this.props.className : ''}` }
                   style={ setInlineEditWidth } >
            <GhostElem className={ `${this.props.className} ${ isTextArea ? 'ghost-textarea' : '' }`}
                       style={ { ...this.props.style } }
                       setParentState={ this.updateParentStateHandler }
                       editingElement={ this.props.editingElement } // is this needed?
                       staticElem={ this.props.staticElement }
                       inputValue={ this.state.text || this.props.placeholder }
                       inputDimensions={ { width: this.state.inputWidth, height: this.state.inputHeight } }>
            </GhostElem>
            <Element className={ `${this.props.className ? this.props.className : ''} ${this.props.staticElement}` }
                 onClick={this.clickWhenEditing}
                 onKeyDown={this.keyDown}
                 onBlur={this.finishEditing}
                 placeholder={this.props.placeholder}
                 defaultValue={this.state.text}
                 onChange={ this.textChanged }
                 style={ {...this.props.style, ...setInputHeight } }
                 ref="input" />
            { EditBtn }
          </div>
    }
  }
}

/* Ghost elem mimics the parent element as
 * good as possible to get the most accurate
 * width.
 */

const GhostElem = class GhostElem extends React.Component {

  constructor(props) {
    super(props);
    this.setParentState = this.props.setParentState
  }

  state = {
    text: this.props.inputValue,
  }

  updateParentDimensions() {
    let ghostWidth = this.refs.measureDimensions.offsetWidth
    let ghostHeight = this.refs.measureDimensions.offsetHeight
    let inputWidth = this.props.inputDimensions.width
    let inputHeight = this.props.inputDimensions.height
    if(inputHeight!=ghostHeight||inputWidth!=ghostWidth) {
      this.props.setParentState({
        inputWidth:  ghostWidth,
        inputHeight: ghostHeight
      })
    }
  }

  componentDidMount() {
    this.updateParentDimensions()
  }

  componentDidUpdate() {
    /* Danger zone! Updating state quite a lot in componentDidUpdate.
     * Careful if changing conditionals.
     */
    if (!this.props.inputValue&&this.state.text!='\u00a0') {
      this.setState({text: "\u00a0" })
    } else if(this.props.inputValue&&this.props.inputValue!=this.state.text) {
      this.setState({text: this.props.inputValue })
    } else {
      this.updateParentDimensions()
    }
  }
  
  render() {
    /* This is rendered somewhat three times to exchange data enough
     * times with the parent. Not the most efficient way, but I suppose
     * does the job
     */
    const StaticElem = this.props.staticElem;
    const inputValue = this.props.inputValue;
    let getWidth = this.props.editingElement=='textarea' ? { width: '100%'} : {}
    return (
        <StaticElem className={ `${this.props.className} measure-length ghost-elem`}
                    style={ { ...this.props.style, ...getWidth }}
                    ref='measureDimensions'>
          { this.state.text }
        </StaticElem>
    );
  }
};
