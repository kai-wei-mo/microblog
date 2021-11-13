const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

// get events
app.get('/events', (req, res) => {
	res.send(events);
});

// consume events
app.post('/events', (req, res) => {
	const event = req.body;
	console.log('received event:', event);

	// store event in memory
	events.push(event);

	// send event to other microservices
	axios.post('http://localhost:4000/events', event).catch(console.error); // posts
	axios.post('http://localhost:4001/events', event).catch(console.error); // comments
	axios.post('http://localhost:4002/events', event).catch(console.error); // query
	axios.post('http://localhost:4003/events', event).catch(console.error); // moderation

	// assumes requests are unconditionally successful
	res.send({ status: 'OK' });
});

app.listen(4005, () => {
	console.log('listening on 4005');
});

/*
-- MANUAL TEST
1. Create a post (call this Post A).
2. Create a post (call this Post B).
3. Create a comment under Post A.

Then, check that the bus and its subscribers all receive
- PostCreated
- PostCreated
- CommentCreated
*/
