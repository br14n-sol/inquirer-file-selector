import type { Status } from '#enums/status'

/**
 * Type representing allowed prompt statuses.
 */
export type StatusType = (typeof Status)[keyof typeof Status]
