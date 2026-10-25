import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyAll, selectFeed } from '../src/engine/recommend.js';

const mk = (id, cat) => ({ id, title: `t${id}`, channel: 'c' });
const gate = { id: 'gate', keywords: [] }, ai = { id: 'ai', keywords: [] }, soc = { id: 'sociology', keywords: [] };
const pool = [...classifyAll([mk('g1'), mk('g2')], gate), ...classifyAll([mk('a1'), mk('a2')], ai), ...classifyAll([mk('s1')], soc)];

test('only GATE selected -> only GATE videos', () => {
  const f = selectFeed(pool, ['gate']);
  assert.deepEqual(f.map((v) => v.id), ['g1', 'g2']);
});
test('GATE + AI -> union of both, nothing else', () => {
  const f = selectFeed(pool, ['gate', 'ai']);
  assert.deepEqual(f.map((v) => v.id).sort(), ['a1', 'a2', 'g1', 'g2']);
  assert.ok(f.every((v) => ['gate', 'ai'].includes(v.categoryId)));
});
test('deselecting AI removes AI videos immediately', () => {
  assert.ok(selectFeed(pool, ['gate']).every((v) => v.categoryId !== 'ai'));
});
test('nothing selected -> empty feed, no filler', () => assert.deepEqual(selectFeed(pool, []), []));
test('empty pool / no results does not crash', () => assert.deepEqual(selectFeed([], ['gate']), []));
test('text filter works within selected only', () => {
  assert.deepEqual(selectFeed(pool, ['gate', 'ai'], 'a1').map((v) => v.id), ['a1']);
});
test('keyword classification rejects non-matching', () => {
  assert.equal(classifyAll([mk('x')], { id: 'k', keywords: ['zzz'] }).length, 0);
});
test('duplicates across categories shown once', () => {
  const dup = [{ id: 'd', title: 'd', channel: 'c', categoryId: 'gate' }, { id: 'd', title: 'd', channel: 'c', categoryId: 'ai' }];
  assert.equal(selectFeed(dup, ['gate', 'ai']).length, 1);
});
