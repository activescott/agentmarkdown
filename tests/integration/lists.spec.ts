import { toMarkdown } from "../../tests/support"

it("simple ul", async () => {
  const html = `<ul>
  <li>one</li>
  <li>two</li>
  <li>three</li>
</ul>`
  const expected = `* one
* two
* three`

  const md = await toMarkdown(html)
  expect(md).toMatch(expected)
})

it("simple ol", async () => {
  const html = `<ol>
<li>one</li>
<li>two</li>
<li>three</li>
</ol>
`
  const expected = `1. one
2. two
3. three`
  const md = await toMarkdown(html)
  expect(md).toMatch(expected)
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
  const expected = `* one
* two 
  * two.one
  * two.two
  * two.three
* three`
  expect(md).toMatch(expected)
})

it("nested ol", async () => {
  const html = `<ol>
  <li>one</li>
  <li>two
    <ol>
      <li>two.one</li>
      <li>two.two</li>
      <li>two.three</li>
    </ol>
  </li>
  <li>three</li>
</ol>
`
  const md = await toMarkdown(html)
  const expected = `1. one
2. two 
  1. two.one
  2. two.two
  3. two.three
3. three`
  //console.log({ md })
  //console.log({ ex: expected })
  expect(md).toMatch(expected)
})

it("nested ul / ol", async () => {
  const html = `
<ul>
  <li>one</li>
  <li>two
    <ol>
      <li>two.one</li>
      <li>two.two</li>
      <li>two.three</li>
    </ol>
  </li>
  <li>three</li>
</ul>
`
  const md = await toMarkdown(html)
  const expected = `* one
* two 
  1. two.one
  2. two.two
  3. two.three
* three`
  expect(md).toMatch(expected)
})

it("nested ol / ul", async () => {
  const html = `
<ol>
  <li>one</li>
  <li>two
    <ul>
      <li>two.one</li>
      <li>two.two</li>
      <li>two.three</li>
    </ul>
  </li>
  <li>three</li>
</ol>
`
  const md = await toMarkdown(html)
  const expected = `1. one
2. two 
  * two.one
  * two.two
  * two.three
3. three`
  expect(md).toMatch(expected)
})
