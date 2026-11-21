import { screen, within } from '@testing-library/react'
import { expect, it } from 'vitest'
import { fixture, open, source } from './dashboardFixture'

it('opens the legacy statistics bookmark with the authorized source and a relative widget URL', async () => {
  fixture({
    '/dashboard/es/assets/data/appConfig.json': () => Response.json({
      statistics_module: { active: true, historic_stats: { widget_url: './widget.js' } },
    }),
    '/api/v5/dashboard/harvesting/source/AREANDINA': () => Response.json({
      ...source, attributes: { stats_source_id: 'stats-33' },
    }),
  })
  await open('/statistics/statistics')
  const main = within(await screen.findByRole('main'))
  const frame = await main.findByTitle('Estadísticas')
  expect(frame).toHaveAttribute('sandbox', 'allow-scripts')
  expect(frame.getAttribute('srcdoc')).toContain(new URL('./widget.js', document.baseURI).href)
  expect(frame.getAttribute('srcdoc')).toContain('stats-33')
})
