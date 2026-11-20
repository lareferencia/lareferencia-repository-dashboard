import type { Rule } from '../../api/dashboard'

export function occurrenceCountsUnavailable(rule?: Rule) {
  return rule?.occurrenceCaptureEnabled === false ||
    (rule?.occurrenceCaptureEnabled == null && rule?.storedOccurrencesAvailable === false)
}

export function emptyEvidence(rule?: Rule) {
  if (occurrenceCountsUnavailable(rule)) return 'captureOff'
  if (rule?.occurrenceCaptureEnabled === true || rule?.storedOccurrencesAvailable === true) return 'noOccurrences'
  return 'captureUnknown'
}
