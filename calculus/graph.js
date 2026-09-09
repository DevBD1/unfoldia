import { select, scaleLinear, axisBottom, axisLeft, line } from 'd3';

// Reusable SVG graph: no lesson rules or persistence belong in this component.
export function createGraph(host, { xDomain, yDomain, label }) {
  const width = 640, height = 400;
  const x = scaleLinear(xDomain, [48, width - 22]);
  const y = scaleLinear(yDomain, [height - 38, 24]);
  const svg = select(host).append('svg').attr('viewBox', `0 0 ${width} ${height}`).attr('role', 'img').attr('aria-label', label);
  svg.append('title').text(label);
  svg.append('g').attr('class', 'grid').attr('transform', `translate(0,${height - 38})`).call(axisBottom(x).ticks(8).tickSize(-(height - 62)).tickFormat(''));
  svg.append('g').attr('transform', `translate(0,${y(0)})`).call(axisBottom(x).ticks(4));
  svg.append('g').attr('transform', `translate(${x(0)},0)`).call(axisLeft(y).ticks(6));
  svg.append('text').attr('x', width - 18).attr('y', y(0) - 12).text('x');
  svg.append('text').attr('x', x(0) + 12).attr('y', 16).text('f(x)');
  const curve = svg.append('path').attr('class', 'curve');
  const guide = svg.append('path').attr('class', 'point-guide');
  const point = svg.append('circle').attr('r', 7).attr('class', 'point');
  return {
    update({ points, selected }) {
      curve.attr('d', line().x(d => x(d.x)).y(d => y(d.y))(points));
      point.attr('cx', x(selected.x)).attr('cy', y(selected.y));
      guide.attr('d', `M${x(selected.x)},${y(0)}V${y(selected.y)}H${x(0)}`);
      svg.attr('aria-label', `${label}. Seçili nokta: (${selected.x}, ${selected.y}).`);
    },
    destroy() { svg.remove(); },
  };
}
