import { EventEmitter } from "events"
import {
  exec as _exec,
  spawn,
  ChildProcessWithoutNullStreams
} from "child_process"
import path from "path"
import util from "util"

const exec = util.promisify(_exec)

describe.only("CLI", () => {
  const tsNodePath: string = path.join(
    __dirname,
    "../../node_modules/.bin/ts-node"
  )
  const tsNodeOptions: string[] = [
    "--compiler-options",
    `"{ \\"downlevelIteration\\": true }"`
  ]
  const tsNodePathAndOptions: string =
    tsNodePath + " " + tsNodeOptions.join(" ")
  const binScriptPath: string = path.join(__dirname, "agent-markdown.ts")
  const exePath = tsNodePathAndOptions + " " + binScriptPath

  it("should accept stdin", async () => {
    const proc: ChildProcessWithoutNullStreams = spawn(
      tsNodePath,
      tsNodeOptions.concat([binScriptPath]),
      {}
    )
    let markdown = ""
    proc.stdout.on("data", data => {
      markdown += data
    })

    proc.stdin.write("<em>emphasis</em>")
    proc.stdin.end()

    const exitResult = await EventEmitter.once(proc, "exit")
    console.log("exitResult:", exitResult)

    expect(markdown).toEqual("*emphasis*")
  })

  it("should process filename on arg", async () => {
    const contentPath: string = path.join(
      __dirname,
      "../../test-data/emphasis.fragment.html"
    )
    const result: { stdout: string; stderr: string } = await exec(
      exePath + " " + contentPath,
      { timeout: 5000 }
    )

    expect(result.stdout).toEqual("*emphasis*")
  })
})
