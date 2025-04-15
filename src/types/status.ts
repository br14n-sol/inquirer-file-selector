import type { Status } from '#consts'

/** Type representing possible prompt statuses. */
export type StatusType = (typeof Status)[keyof typeof Status]
