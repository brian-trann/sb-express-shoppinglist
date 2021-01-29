process.env.NODE_ENV = 'TEST';
const request = require('supertest');
const app = require('../app');
const items = require('../fakeDb');

let popsicle = { name: 'popsicle', price: 1.45 };
let cheerios = { name: 'cheerios', price: 3.4 };
beforeEach(() => {
	items.push(popsicle);
	items.push(cheerios);
});
afterEach(() => {
	items.length = 0;
});

describe('GET /items', () => {
	test('get the list of items', async () => {
		const res = await request(app).get('/items');
		expect(res.statusCode).toBe(200);

		expect(res.body).toEqual({ items: [ popsicle, cheerios ] });
	});
});

describe('GET /items/:name', () => {
	test('get a popsicle', async () => {
		const res = await request(app).get(`/items/${popsicle.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(popsicle);
	});
	test('get cheerios', async () => {
		const res = await request(app).get(`/items/${cheerios.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(cheerios);
	});
	test('get wrong name', async () => {
		const res = await request(app).get('/items/nothing');
		expect(res.statusCode).toBe(404);
	});
});

describe('POST /items', () => {
	test('post a new item', async () => {
		const testItem = { name: 'testItem', price: 99 };
		const res = await request(app).post('/items').send(testItem);
		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual({ added: testItem });
		expect(items.length).toBe(3);
	});
});

describe('PATCH /items/:name', () => {
	test('update a single item', async () => {
		const res = await request(app).patch(`/items/${cheerios.name}`).send({ name: 'cheerios', price: 999 });
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ updated: { name: 'cheerios', price: 999 } });
		expect(cheerios.price).toBe(999);
	});
	test('updating an item that doesnt exist', async () => {
		const res = await request(app).patch('/items/badpatch').send({ name: 'badpatch', price: 1 });
		expect(res.statusCode).toBe(404);
	});
});
describe('DELETE /items/:name', () => {
	test('deleting an item', async () => {
		const res = await request(app).delete(`/items/${cheerios.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: 'Deleted' });
		expect(items.length).toBe(1);
	});
	test('deleting an item that doesnt exist', async () => {
		const res = await request(app).delete('/items/nothing');
		expect(res.statusCode).toBe(404);
	});
});
