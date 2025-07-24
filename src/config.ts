import type { PromptConfig } from '#types/config'

// Note: The `message` property is intentionally omitted,
//       as it should be defined by the consumer.
export const baseConfig = {
  basePath: process.cwd(),
  multiple: false,
  pageSize: 10,
  loop: false,
  filter: () => true,
  showExcluded: false,
  allowCancel: false
} as unknown as PromptConfig
