//@flow

import _ from 'lodash'
import { Runnable } from './Runnable'
import Cat from './Cat'
import Clear from './Clear'
import Help from './Help'
import List from './List'
import Whoami from './Whoami'

const commands = [Cat, Clear, Help, List, Whoami]

class Executor {
  setContents: (Array<any>) => void
  registered: { [s: string]: Runnable }

  constructor(setContents: (Array<any>) => void) {
    this.setContents = setContents
    this.registered = {}
    const self: any = this
    self.register = this.register.bind(this)
    _.each(commands, this.register)
  }

  // class implementing the Runnable and Nameable interfaces
  register(command: any) {
    let initialized = new command()
    this.registered[initialized.name] = initialized
  }

  run(input: string): { halt?: boolean, success: boolean, result: ?string } {
    let parsed = this.parse(input)

    // separate command from arguments
    let runner = this.registered[parsed.command]
    if (runner) {
      let results = runner.run(parsed.arguments)

      if (results.builtins && results.builtins.length > 0) {
        _.each(results.builtins, builtin => {
          this.builtin(builtin)
        })

        return {
          halt: true,
          success: true,
          result: results.result,
        }
      }

      return {
        success: true,
        result: results.result,
      }
    }

    return {
      success: false,
      result: `zsh: command not found: ${parsed.command}`,
    }
  }

  // Helpers

  // splits input string into command and arguments
  parse(input: string): { command: string, arguments: Array<string> } {
    const parts = input.trim().split(' ')
    const args = parts.slice(1, parts.length)
    return {
      command: parts[0] || '',
      arguments: args,
    }
  }

  // Built In Commands

  builtin(command: string) {
    switch (command) {
      case 'clear':
        this.clear()
        break
      default:
        break
    }
  }

  clear() {
    this.setContents([])
  }
}

export default Executor
