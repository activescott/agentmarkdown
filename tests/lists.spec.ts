import { toMarkdown } from "./support"

it("simple ul", async () => {
  const html = `<ul>
  <li>one</li>
  <li>two</li>
  <li>three</li>
</ul>`
  const md = await toMarkdown(html)
  expect(md).toMatch(` \n* one 
* two 
* three `)
})

it("simple ol", async () => {
  const html = `
<ol>
<li>one</li>
<li>two</li>
<li>three</li>
</ol>
`
  const md = await toMarkdown(html)
  expect(md).toMatch(` 
1. one 
2. two 
3. three `)
})

it("nested ul", async () => {
  const html = `
<ul>
  <li>one</li>
  <li>two
    <ul>
      <li>two.one</li>
      <li>two.two</li>
      <li>two.three</li>
    </ul>
  </li>
  <li>three</li>
</ul>
`
  const md = await toMarkdown(html)
  console.log({md})
  expect(md).toMatch(`  
* one 
* two  
  * two.one 
  * two.two 
  * two.three   
* three `)
})

it.skip("nested ol", () => {})
