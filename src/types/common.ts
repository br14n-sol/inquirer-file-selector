import type { Status } from '#enums/common'

/**
 * Type representing allowed prompt statuses.
 */
export type StatusType = (typeof Status)[keyof typeof Status]
