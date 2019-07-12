import { AgentMarkdown } from "../../dist/es/index"

window.addEventListener("load", docLoad)

let htmlElement
function docLoad() {
  console.log("docLoad!")
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
    console.log("e", e)
    e.value = markdown
  }
}
