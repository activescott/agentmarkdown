#!/usr/bin/env node
import { EventEmitter } from "events"
import { AgentMarkdown } from "../"
import { promises as fs } from "fs"

const EXIT_SUCCESS = 0
const EXIT_ERR_CONVERTING = 2
const EXIT_ERR_STDOUT = 3

export class Cli {
  public async run(): Promise<void> {
    ;(await this.processArgs()) ||
      (await this.processStdin()) ||
      this.showHelp()
  }

  private async processHtml(html: string): Promise<boolean> {
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
    } catch (err) {
      console.error("Error writing to stdout.")
      process.exit(EXIT_ERR_STDOUT)
      return false
    }
    return true
  }

  private async processStdin(): Promise<boolean> {
    let stdinContent = ""
    process.stdin.on("readable", () => {
      process.stdin.setEncoding("utf8")
      let chunk: string
      while ((chunk = process.stdin.read() as string) !== null) {
        stdinContent += chunk
      }
    })

    await EventEmitter.once(process.stdin, "end")
    if (stdinContent) {
      return this.processHtml(stdinContent)
    } else {
      return false
    }
  }

  private async processArgs(): Promise<boolean> {
    const args = process.argv.slice(2)
    if (args.length > 0) {
      const filePath = args[0]
      const html: string = await fs.readFile(filePath, { encoding: "utf8" })
      return this.processHtml(html)
    } else {
      return false
    }
  }

  private showHelp(exitCode: number = 1): void {
    const help = `Usage: agent-markdown [filePath]

An application to convert HTML to markdown.

  filePath: The file to use as input.

If no file arguments are specified, the standard input is used.
`
    console.log(help)
    process.exit(exitCode)
  }
}

new Cli().run()
