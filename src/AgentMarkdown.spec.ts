import { AgentMarkdown } from "./index"

it("should  have version", () => {
  expect(AgentMarkdown).toHaveProperty("version")
  expect(AgentMarkdown.version).toMatch(/^(\d+\.)?(\d+\.)?(\*|\d+)$/)
})
