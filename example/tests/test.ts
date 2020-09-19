const test_url = process.env.TEST_URL
if (!test_url) {
  throw new Error("The environment variable TEST_URL must be provided!")
}

describe(`example test of ${test_url}`, () => {
  beforeAll(async () => {
    await page.goto(test_url)
  })

  it("should have an initial value for html", async () => {
    // this just makes sure we're in a sane state
    const htmlValue = await page.$eval("#html", (node) => node.value)
    expect(htmlValue).toMatch(/<h1>Formatting<\/h1>/)
  })

  it("should have an initial value for markdown", async () => {
    // assuming the other test passed, this is the real test
    const markdownValue = await page.$eval("#markdown", (node) => node.value)
    expect(markdownValue).toMatch(/# Formatting #/)
  })
})
