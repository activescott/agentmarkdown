#!/usr/bin/env node
import { AgentMarkdown } from "../"
import { promises as fs } from "fs"

const EXIT_SUCCESS = 0
const EXIT_ERR_USAGE = 1
const EXIT_ERR_CONVERTING = 2
const EXIT_ERR_STDOUT = 3

export interface CliProcess {
  argv: string[]
  stdin: StdInStream
  stdout: StdOutStream
  exit(code?: number): void
}

export interface StdOutStream {
  write(data: string): void
  end(): void
}

export interface StdInStream {
  isTTY?: boolean
  on(eventName: string, callback: () => void): this
  setEncoding(encoding: string): void
  read(size?: number): string | Buffer
}

export class Cli {
  public async run(process: CliProcess): Promise<void> {
    ;(await this.processArgs(process)) ||
      (await this.processStdin(process)) ||
      this.showHelp(process, EXIT_ERR_USAGE)
    process.exit(EXIT_SUCCESS)
  }

  private async processHtml(
    process: CliProcess,
    html: string
  ): Promise<boolean> {
    let markdown = ""
    try {
      markdown = await AgentMarkdown.produce(html)
    } catch (err) {
      console.error("Error converting HTML to markdown.")
      process.exit(EXIT_ERR_CONVERTING)
      return false
    }
    try {
      process.stdout.write(markdown)
      process.stdout.end()
    } catch (err) {
      console.error("Error writing to stdout.")
      process.exit(EXIT_ERR_STDOUT)
      return false
    }
    return true
  }

  private async processStdin(process: CliProcess): Promise<boolean> {
    if (process.stdin.isTTY === true) {
      return false
    } else {
      return new Promise(resolve => {
        let stdinContent: string = null
        // See example at https://nodejs.org/api/process.html#process_a_note_on_process_i_o for this:
        process.stdin.on("readable", () => {
          process.stdin.setEncoding("utf8")
          stdinContent = process.stdin.read() as string
          if (stdinContent === null) {
            // no data was piped in
            resolve(false)
          } else {
            resolve(this.processHtml(process, stdinContent))
          }
        })
      })
    }
  }

  private async processArgs(process: CliProcess): Promise<boolean> {
    const DEFAULT_ARGS = 2
    const args = process.argv.slice(DEFAULT_ARGS)
    if (args.length > 0) {
      const filePath = args[0]
      const html: string = await fs.readFile(filePath, { encoding: "utf8" })
      return this.processHtml(process, html)
    } else {
      return false
    }
  }

  private showHelp(process: CliProcess, exitCode: number = EXIT_SUCCESS): void {
    const help = `Usage: agentmarkdown [filePath]

An application to convert HTML to markdown.

  filePath: The file to use as input.

If no file arguments are specified, the standard input is used.
`
    process.stdout.write(help)
    process.stdout.end()
    process.exit(exitCode)
  }
}

if (require.main === module) {
  new Cli().run(process)
}
