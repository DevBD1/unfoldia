import { select, scaleLinear, axisBottom, axisLeft } from 'd3';

// Presentation adapter: one relation and one selection feed both views.
// The caller owns educational rules and handles onSelect; no storage here.
export function createRelationView(host, onSelect) {
  const root = select(host);
  root.html('<div class="relation-views"><section><h3>Ok diyagramı</h3><div data-map></div></section><section><h3>Aynı eşleşmelerin grafiği</h3><div data-plot></div></section></div>');
  const map = root.select('[data-map]').append('svg').attr('viewBox', '0 0 360 300').attr('role', 'img');
  const plot = root.select('[data-plot]').append('svg').attr('viewBox', '0 0 360 300').attr('role', 'img');
  return {
    update({ domain, codomain, pairs, selected }) {
      map.selectAll('*').remove(); plot.selectAll('*').remove();
      const pos = (items, v) => 62 + items.indexOf(v) * (205 / Math.max(1, items.length - 1));
      map.attr('aria-label', 'Tanım kümesinden değer kümesine oklar. Eşleşmeler aşağıdaki tabloda da verilmiştir.');
      map.append('text').attr('x', 16).attr('y', 22).text('A · Tanım');
      map.append('text').attr('x', 230).attr('y', 22).text('B · Değer');
      for (const p of pairs) {
        const active = p.x === selected;
        map.append('path').attr('d', `M76,${pos(domain,p.x)}L276,${pos(codomain,p.y)}`).attr('stroke', active ? '#b95122' : '#9baaa0').attr('stroke-width', active ? 3 : 1.5);
        map.append('text').attr('x', 264).attr('y', pos(codomain,p.y) + 5).attr('fill', active ? '#b95122' : '#526251').text('›');
      }
      for (const [items, cx] of [[domain, 55], [codomain, 303]]) for (const v of items) {
        const reached = cx === 303 && pairs.some(p => p.y === v);
        map.append('circle').attr('cx', cx).attr('cy', pos(items,v)).attr('r', 19).attr('fill', cx === 55 && v === selected ? '#f6dbc5' : reached ? '#d6e2c9' : '#fffef9').attr('stroke', '#526251');
        map.append('text').attr('x', cx).attr('y', pos(items,v)+6).attr('text-anchor','middle').text(v);
      }
      const x = scaleLinear([-3,3],[38,335]), y = scaleLinear([-1,5],[264,28]);
      plot.append('g').attr('transform',`translate(0,${y(0)})`).call(axisBottom(x).ticks(6));
      plot.append('g').attr('transform',`translate(${x(0)},0)`).call(axisLeft(y).ticks(6));
      plot.append('text').attr('x',330).attr('y',y(0)-12).text('x');
      plot.append('text').attr('x',x(0)+12).attr('y',20).text('y');
      plot.attr('aria-label', `Sonlu ilişkinin ${pairs.length} noktası. Çizgilerle birleştirilmez.`);
      plot.selectAll('circle').data(pairs).join('circle').attr('cx',p=>x(p.x)).attr('cy',p=>y(p.y)).attr('r',p=>p.x===selected?8:6).attr('fill',p=>p.x===selected?'#b95122':'#467354');
    },
    // Selection controls are native buttons for keyboard and touch parity.
    select(value) { onSelect(value); },
    destroy() { root.selectAll('*').remove(); },
  };
}
