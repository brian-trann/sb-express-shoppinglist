const express = require('express');
const router = new express.Router();
const ExpressError = require('../expressError');
const items = require('../fakeDb');

/**
 * GET /items 
 * Should render a list of shopping items
 * [{“name”: “popsicle”, “price”: 1.45}, {“name”:”cheerios”, “price”: 3.40}]
 */
router.get('/', (req, res) => {
	res.json({ items });
});
/**
 * GET /items/:name
 * Should display a single item's name and price
 {“name”: “popsicle”, “price”: 1.45}
 */
router.get('/:name', (req, res) => {
	const foundItem = items.find((item) => item.name === req.params.name);
	if (!foundItem) throw new ExpressError('Item does not exist', 404);
	res.json(foundItem);
});

/**
 * POST /items
 * Should accept JSON data and add it to the shopping list
 * {“name”:”popsicle”, “price”: 1.45} => {“added”: {“name”: “popsicle”, “price”: 1.45}}
 */
router.post('/', (req, res) => {
	// getUserItem
	if (!req.body.name || !req.body.price) throw new ExpressError('Somethign went wrong!', 404);
	const newItem = { name: req.body.name, price: req.body.price };
	//try
	items.push(newItem);
	//catch
	res.status(201).json({ added: newItem });
});
/**
 * PATCH /items/:name, 
 * this route should modify a single item’s name and/or price.
 * {“name”:”new popsicle”, “price”: 2.45} => {“updated”: {“name”: “new popsicle”, “price”: 2.45}}
 */

router.patch('/:name', (req, res) => {
	// getUserItem

	const foundItem = items.find((item) => item.name === req.params.name);
	if (!foundItem) throw new ExpressError('Item Not Found', 404);
	if (!req.body.price) throw new ExpressError('Price not entered', 404);
	foundItem.name = req.body.name;
	foundItem.price = req.body.price;
	return res.json({ updated: foundItem });
});
/**
 * DELETE /items/:name
 * this route should allow you to delete a specific item from the array.
 * {message: “Deleted”}
 */

router.delete('/:name', (req, res) => {
	const foundItem = items.find((item) => item.name === req.params.name);
	if (!foundItem) throw new ExpressError('Item Not Found', 404);
	items.splice(foundItem, 1);
	return res.json({ message: 'Deleted' });
});

module.exports = router;
