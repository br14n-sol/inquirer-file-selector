import type { Status } from '#enums/common'

/**
 * Type representing allowed prompt statuses.
 */
export type StatusType = (typeof Status)[keyof typeof Status]

type Success<T> = {
  data: T
  error: null
}

type Failure<E> = {
  data: null
  error: E
}

export type Result<T, E> = Success<T> | Failure<E>
