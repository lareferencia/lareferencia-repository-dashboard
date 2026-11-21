// Widget scripts may be relative to the dashboard. OAI and portal links require an absolute URL.
export function httpUrl(value?: string, base?: string) {
  if (!value || !URL.canParse(value, base)) return null
  const url = new URL(value, base)
  return url.protocol === 'https:' || url.protocol === 'http:' ? url : null
}
