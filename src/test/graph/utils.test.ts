import { calcSpacing } from '../../components/graph/utils'

describe('calcSpacing', () => {
	it('increases spacing if total items width less than chart width', () => {
		const minSpacing = 40
		const spacing = calcSpacing({
			chartWidth: 200,
			dotSize: 10,
			minSpacing,
			items: 3,
		})

		expect(spacing).toBeGreaterThan(minSpacing)
	})

	it('uses the min spacing if total items width greater than chart width', () => {
		const minSpacing = 40
		const spacing = calcSpacing({
			chartWidth: 200,
			dotSize: 10,
			minSpacing,
			items: 20,
		})

		expect(spacing).toEqual(minSpacing)
	})
})
