export const darkStates = ['RESERVED', 'DRAFT', 'UPDATE', 'PUBLISHED', 'TOMBSTONE', 'ERROR'] as const
export type DarkRow = { ark: string; oaiId: string; state: typeof darkStates[number]; updatedAt: string }

export function isDarkRow(row: DarkRow) {
  return row != null && typeof row.ark === 'string' && typeof row.oaiId === 'string'
    && darkStates.includes(row.state) && typeof row.updatedAt === 'string' && Number.isFinite(Date.parse(row.updatedAt))
}
