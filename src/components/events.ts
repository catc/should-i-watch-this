function events() {
	const focus = svg.append('g').attr('class', 'focus').style('display', 'none')

	focus.append('circle').attr('r', 4.5)

	focus.append('text').attr('x', 9).attr('dy', '.35em')

	svg.append('rect')
		.attr('class', 'overlay')
		.attr('width', width)
		.attr('height', height)
		.on('mouseover', function() {
			focus.style('display', null)
		})
		.on('mouseout', function() {
			focus.style('display', 'none')
		})
		.on('mousemove', mousemove)

	function mousemove() {
		const x0 = x.invert(d3.mouse(this)[0]),
			i = bisectDate(data, x0, 1),
			d0 = data[i - 1],
			d1 = data[i],
			d = x0 - d0.date > d1.date - x0 ? d1 : d0
		focus.attr('transform', 'translate(' + x(d.date) + ',' + y(d.close) + ')')
		focus.select('text').text(d)
	}
}
