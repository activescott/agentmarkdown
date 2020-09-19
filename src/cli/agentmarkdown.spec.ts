import { Readable, Writable } from "stream"
import path from "path"
import { Cli, CliProcess } from "./agentmarkdown"
import { StringDecoder } from "string_decoder"

describe("CLI", () => {
  /**
   * Represents the following command:
   * ./node_modules/.bin/ts-node --compiler-options "{ \"downlevelIteration\": true }" src/cli/agentmarkdown.ts
   */
  it("should show error without options", async () => {
    const mockStdOut: MockWritable = new MockWritable()
    const mockProcess: CliProcess = {
      exit: jest.fn(),
      argv: ["/usr/local/bin/node", "file.js"],
      stdin: new MockReadable(null, true),
      stdout: mockStdOut,
    }
    await new Cli().run(mockProcess)
    expect(mockStdOut.data).toMatch(/^Usage: agentmarkdown \[filePath\]/)
  })

  /**
   * represents the following command:
   * ./node_modules/.bin/ts-node --compiler-options "{ \"downlevelIteration\": true }" src/cli/agentmarkdown.ts test-data/emphasis.fragment.html
   */
  it("should process filename on arg", async () => {
    const contentPath: string = path.join(
      __dirname,
      "../../test-data/emphasis.fragment.html"
    )
    const mockStdOut: MockWritable = new MockWritable()
    const mockProcess: CliProcess = {
      exit: jest.fn(),
      argv: ["/usr/local/bin/node", "file.js", contentPath],
      stdin: new MockReadable(null, true),
      stdout: mockStdOut,
    }
    await new Cli().run(mockProcess)
    expect(mockStdOut.data).toEqual("*emphasis*")
  })

  /**
   * Represents the following command:
   * echo "<em>emphasis</em>" | ./node_modules/.bin/ts-node --compiler-options "{ \"downlevelIteration\": true }" src/cli/agentmarkdown.ts
   */
  it("should accept stdin", async () => {
    const mockStdOut: MockWritable = new MockWritable()
    const mockProcess: CliProcess = {
      exit: jest.fn(),
      argv: ["/usr/local/bin/node", "file.js"],
      stdin: new MockReadable("<em>emphasis</em>", false),
      stdout: mockStdOut,
    }
    await new Cli().run(mockProcess)
    expect(mockStdOut.data).toEqual("*emphasis*")
  })
})

class MockWritable extends Writable {
  public data = ""
  private _decoder = new StringDecoder()
  public constructor() {
    super()
  }
  public _write(
    chunk: string | Buffer,
    encoding: string,
    callback: (error?: Error | null) => void
  ): void {
    if (encoding === "buffer") {
      chunk = this._decoder.write(chunk as Buffer)
    }
    this.data += chunk
    callback()
  }
}

class MockReadable extends Readable {
  public constructor(public _data: string, public isTTY: boolean) {
    super()
    _data && this.push(_data)
    this.push(null)
  }
}
