// Пример данных, которые могут быть извлечены из базы данных
const data = {
  nodes: [
    { id: 1, text: 'Вопрос 1' },
    { id: 2, text: 'Вопрос 2' },
    { id: 3, text: 'Вопрос 3' },
    { id: 4, text: 'Ответ 1.1' },
    { id: 5, text: 'Ответ 1.2' },
    { id: 6, text: 'Ответ 2.1' },
    { id: 7, text: 'Ответ 2.2' },
  ],
  links: [
    { source: 1, target: 4 },
    { source: 1, target: 5 },
    { source: 4, target: 2 },
    { source: 5, target: 3 },
    { source: 2, target: 6 },
    { source: 2, target: 7 },
  ],
};

const width = 960;
const height = 600;

const svg = d3
  .select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const simulation = d3
  .forceSimulation(data.nodes)
  .force(
    'link',
    d3
      .forceLink(data.links)
      .id((d) => d.id)
      .distance(150)
  )
  .force('charge', d3.forceManyBody().strength(-400))
  .force('center', d3.forceCenter(width / 2, height / 2));

const link = svg
  .append('g')
  .selectAll('line')
  .data(data.links)
  .enter()
  .append('line')
  .attr('class', 'link');

const node = svg
  .append('g')
  .selectAll('g')
  .data(data.nodes)
  .enter()
  .append('g')
  .attr('class', 'node')
  .call(
    d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended)
  );

node.append('circle').attr('r', 10);

node
  .append('text')
  .attr('dy', -3)
  .attr('x', 12)
  .attr('y', 12)
  .text((d) => d.text);

simulation.on('tick', () => {
  link
    .attr('x1', (d) => d.source.x)
    .attr('y1', (d) => d.source.y)
    .attr('x2', (d) => d.target.x)
    .attr('y2', (d) => d.target.y);

  node.attr('transform', (d) => `translate(${d.x},${d.y})`);
});

function dragstarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragended(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}