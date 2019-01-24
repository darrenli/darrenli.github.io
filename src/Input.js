//@flow

import React, { Component } from 'react'
import _ from 'lodash'
import './Input.css'
import Row from './Row'
import Executor from './Executor'

type Props = {}
type State = {
  contents: Array<any>,
}

class Input extends Component<Props, State> {
  focus: () => void
  onKeyPress: Event => void
  onKeyDown: Event => void
  parseRow: (any, number) => void
  setContents: (Array<any>) => void
  inputRef: ?HTMLInputElement
  executor: Executor

  constructor(props: Props) {
    super(props)

    this.focus = this.focus.bind(this)
    this.onKeyPress = this.onKeyPress.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.parseRow = this.parseRow.bind(this)
    this.setContents = this.setContents.bind(this)
    this.executor = new Executor(this.setContents)

    this.state = {
      contents: [],
    }
  }

  componentDidMount() {
    this.focus()
    // $FlowIgnore
    document.body.addEventListener('click', this.focus)
  }

  componentWillUnmount() {
    // $FlowIgnore
    document.body.removeEventListener('click', this.focus)
  }

  setContents(contents: Array<any>) {
    this.setState({ contents: contents }, () => {
      // $FlowIgnore
      window.scrollTo(0, document.body.scrollHeight)
    })
  }

  parseRow(content: any, index: number) {
    return <Row content={content} key={index} />
  }

  contentRows() {
    let rows = _.map(this.state.contents, this.parseRow)
    return <div>{rows}</div>
  }

  input() {
    return (
      <input
        type="text"
        className="input"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        onKeyPress={this.onKeyPress}
        onKeyDown={this.onKeyDown}
        ref={input => {
          this.inputRef = input
        }}
      />
    )
  }

  focus() {
    if (this.inputRef) this.inputRef.focus()
  }

  run(command: any) {
    let response = this.executor.run(command)
    if (response && !response.halt) {
      this.setContents([
        ...this.state.contents,
        { type: 'command', body: command, success: response.success },
        { type: 'result', body: response.result },
      ])
    }
  }

  onKeyPress(e: SyntheticKeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (this.inputRef) this.run(this.inputRef.value)
      if (this.inputRef) this.inputRef.value = ''
    }
  }

  onKeyDown(e: SyntheticKeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Tab') {
      e.preventDefault()
    }
  }

  render() {
    return (
      <div className="input">
        <div className="row">&nbsp;</div>
        {this.contentRows()}
        <div className="row">
          <span className="indicator">❯</span>&nbsp;{this.input()}
        </div>
      </div>
    )
  }
}

export default Input
