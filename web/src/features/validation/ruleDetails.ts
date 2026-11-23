import type { Rule } from '../../api/dashboard'

export function ruleRequirement(rule?: Rule) {
  if (rule?.mandatory == null) return 'unknownRequirement'
  return rule.mandatory ? 'mandatory' : 'optional'
}

export function occurrenceCountsUnavailable(rule?: Rule) {
  // The saved capture setting takes precedence. Older snapshots can supply storage evidence instead.
  return (rule?.occurrenceCaptureEnabled ?? rule?.storedOccurrencesAvailable) === false
}

export function emptyEvidence(rule?: Rule) {
  if (occurrenceCountsUnavailable(rule)) return 'captureOff'
  if (rule?.occurrenceCaptureEnabled === true || rule?.storedOccurrencesAvailable === true) return 'noOccurrences'
  return 'captureUnknown'
}
