import { calcSpacing } from '../../components/chart/utils'

describe('calcSpacing', () => {
	it('increases spacing if total items width less than chart width', () => {
		const dotSize = 10
		const items = 3
		const svgWidth = 200

		const minSpacing = 40
		const spacing = calcSpacing({
			svgWidth,
			dotSize,
			minSpacing,
			items,
		})

		expect(spacing).toBeGreaterThan(minSpacing)
		const width = dotSize * items + spacing * (items - 1)
		expect(width).toEqual(svgWidth)
	})

	it('increases spacing if total items width less than chart width and supports padding', () => {
		const dotSize = 10
		const items = 3
		const svgWidth = 200
		const padding = 20

		const minSpacing = 40
		const spacing = calcSpacing({
			svgWidth,
			dotSize,
			minSpacing,
			items,
			padding,
		})

		expect(spacing).toBeGreaterThan(minSpacing)
		const width = dotSize * items + spacing * (items - 1) + padding * 2
		expect(width).toEqual(svgWidth)
	})

	it('uses the min spacing if total items width greater than chart width', () => {
		const minSpacing = 40
		const dotSize = 10
		const svgWidth = 200
		const items = 20

		const spacing = calcSpacing({
			svgWidth,
			dotSize,
			minSpacing,
			items,
		})

		expect(spacing).toEqual(minSpacing)
	})
})
