import { toMarkdown } from "./support"
import * as fsCallbacks from "fs"
import * as Path from "path"
import * as process from "process"

const fs = fsCallbacks.promises

it.skip("JUNK", async () => {
  const path = "/Users/scott/Downloads/noteHtmlFiles"
  let files: string[] = await fs.readdir(path)
  for (let file of files) {
    //console.log("processing file:", file)
    const filePath = Path.join(path, file)
    const html: string = await fs.readFile(filePath, { encoding: "utf8" })
    const md = await toMarkdown(html)
    //console.log(md)
    //process.stdout.write(".")
    //expect(md).toEqual(expected)
  }
})
