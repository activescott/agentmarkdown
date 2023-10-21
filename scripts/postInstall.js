/*global require, process*/
const EOL = require("os").EOL

const UNDERLINE = "\x1b[4m"
const FG_BLUE = "\x1b[34m"
const FG_WHITE = "\x1b[37m"
const BG_BLACK = "\x1b[40m"

const RESET = "\x1b[0m"

const package = require("../package.json")

function info(msg, url) {
  process.stdout.write(
    `${BG_BLACK}${FG_WHITE}${package.name}${RESET} ${BG_BLACK}${FG_BLUE}notice${RESET} ${msg}`,
  )
  // NOTE: During install npm will update a `repository: "https://github.com/..."` to be an object with a url property.
  url = url && url.url ? url.url : url
  url && process.stdout.write(`${UNDERLINE}${url}${RESET}`)
  process.stdout.write(EOL)
}

info(`Did ${package.name} help you? Please add a ⭐ at `, package.repository)
info("Not helpful? Please share your feedback 📣 at ", package.bugs.url)
