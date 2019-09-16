import { AgentMarkdown } from "agentmarkdown"

window.addEventListener("load", docLoad)

let htmlElement
function docLoad() {
  console.log("docLoad!")
  console.log("Using AgentMarkdown version", AgentMarkdown.version)
  htmlElement = document.querySelector("#html")
  htmlElement.addEventListener("input", htmlUpdate)
  htmlUpdate()
}

async function htmlUpdate() {
  const html = htmlElement.value
  console.log("HTML change:", html)
  const markdown = await AgentMarkdown.produce(html)
  console.log("markdown:", markdown)
  const outputs /*: NodeListOf<HTMLDivElement>*/ = document.querySelectorAll(
    ".panel.output .content"
  )
  for (const e of outputs) {
    e.value = markdown
  }
}
