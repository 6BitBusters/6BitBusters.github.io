
import { describe, it, expect } from 'vitest'
import filterOptionReducer, {
  toggleIsGrater,
  FilterOptionState,
} from '../../../src/features/FilterOption/FilterOptionSlice'

describe('filterOptionSlice', () => {
  const initialState: FilterOptionState = {
    isGrater: false,
  }

  it('should return the initial state when passed an empty action', () => {
    const result = filterOptionReducer(undefined, { type: '' })
    expect(result).toEqual(initialState)
  })

  it('should toggle isGrater from false to true', () => {
    const result = filterOptionReducer(initialState, toggleIsGrater())
    expect(result.isGrater).toBe(true)
  })

  it('should toggle isGrater back to false if called twice', () => {
    const intermediateState = filterOptionReducer(initialState, toggleIsGrater())
    const result = filterOptionReducer(intermediateState, toggleIsGrater())
    expect(result.isGrater).toBe(false)
  })
})
