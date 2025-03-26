import type { Status } from '#enums/status'

/** Type representing possible prompt statuses. */
export type StatusType = (typeof Status)[keyof typeof Status]
