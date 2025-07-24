import type { PromptTheme } from '#types/theme'

/**
 * Helper function to mutate theme properties as needed before usage.
 *
 * This function performs in-place transformations on the provided theme object,
 * allowing properties to be adjusted or formatted prior to being used by the prompt.
 * The specific mutations applied may evolve over time as requirements change.
 *
 * @param theme - The theme object to be mutated in place.
 */
export function prepareTheme(theme: PromptTheme): void {
  // Reference for easy access
  const style = theme.style
  const keys = theme.labels.keys
  const hints = theme.labels.hints
  const messages = theme.labels.messages

  // 1. Apply styles to keys labels
  for (const [key, value] of Object.entries(keys)) {
    const keyTyped = key as keyof typeof keys
    keys[keyTyped] = style.key(value)
  }

  // 2. Replace placeholders in hints with actual key labels
  for (const [hintKey, hintValue] of Object.entries(hints)) {
    const hintKeyTyped = hintKey as keyof typeof hints
    hints[hintKeyTyped] = hintValue.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      if (Object.hasOwn(keys, key)) {
        const keyTyped = key as keyof typeof keys
        return keys[keyTyped]
      } else {
        return match
      }
    })
  }

  // 3. Apply styles to other static labels
  messages.cancel = style.messages.cancel(messages.cancel)
  messages.empty = style.messages.empty(messages.empty)
}
