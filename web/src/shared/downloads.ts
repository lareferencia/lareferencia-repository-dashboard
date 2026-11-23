type Cell = string | number | boolean | null | undefined

export function serializeCsv(rows: Cell[][]) {
  const quote = (value: Cell) => '"' + String(value ?? '').replaceAll('"', '""') + '"'
  return '\uFEFF' + rows.map(row => row.map(quote).join(';')).join('\r\n') + '\r\n'
}

export function downloadCsv(filename: string, headers: string[], rows: Cell[][]) {
  downloadText(filename + '.csv', serializeCsv([headers, ...rows]), 'text/csv;charset=utf-8')
}

export function downloadText(filename: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  // Let the browser start the download before releasing the backing blob.
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
