import { readdirSync, Dirent, promises as fsPromises } from "fs"
import path from "path"
import { toMarkdown } from "../../tests/support"

function isSnapshotExt(fileName: string): boolean {
  //return /escaping.mrkdwn$/.test(fileName)
  return fileName.endsWith(".mrkdwn")
}
function getAllSnapshots(dir: string = __dirname): string[] {
  const entries: Dirent[] = readdirSync(dir, { withFileTypes: true })
  let snapshotPaths: string[] = []
  for (const entry of entries) {
    if (entry.isFile() && isSnapshotExt(entry.name)) {
      snapshotPaths.push(path.join(dir, entry.name))
    } else if (entry.isDirectory()) {
      const kids: string[] = getAllSnapshots(path.join(dir, entry.name))
      snapshotPaths = snapshotPaths.concat(kids)
    } else {
      //console.warn("unexpected file type in snapshots:", entry)
    }
  }
  return snapshotPaths
}

const table = getAllSnapshots()

describe("snapshots", () => {
  // NOTE: many of the tests were originally from https://github.com/integrations/html-to-mrkdwn/tree/master/test/fixtures, but they were crazy wrong (like headings wrapped in * instead of #). So they're fixed herein.
  test.each(table)("%s", async snapshotPath => {
    const snapshot: string = await fsPromises.readFile(snapshotPath, {
      encoding: "utf8"
    })
    const [html, expected] = snapshot.split("\n====\n")
    const md = await toMarkdown(html)
    /*
    console.log({
      expected,
      ______md: md
    })
    */
    return expect(md).toEqual(expected)
  })
})
