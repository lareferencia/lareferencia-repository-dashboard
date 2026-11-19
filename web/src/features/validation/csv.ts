type Cell = string | number | boolean | null | undefined

export function serializeCsv(rows: Cell[][]) {
  const quote = (value: Cell) => '"' + String(value ?? '').replaceAll('"', '""') + '"'
  return '\uFEFF' + rows.map(row => row.map(quote).join(';')).join('\r\n') + '\r\n'
}

export function downloadCsv(filename: string, headers: string[], rows: Cell[][]) {
  const url = URL.createObjectURL(new Blob([serializeCsv([headers, ...rows])], { type: 'text/csv;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename + '.csv'
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
