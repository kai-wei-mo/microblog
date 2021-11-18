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
	axios.post('http://posts-clusterip:4000/events', event).catch(console.error);
	axios.post('http://comments-clusterip:4001/events', event).catch(console.error);
	axios.post('http://query-clusterip:4002/events', event).catch(console.error);
	axios.post('http://moderation-clusterip:4003/events', event).catch(console.error);

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
