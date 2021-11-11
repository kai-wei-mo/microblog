const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// store posts in-memory (for testing)
const posts = {};

// get all posts
app.get('/posts', (req, res) => {
	res.json(posts);
});

// create a new post
app.post('/posts', async (req, res) => {
	const id = randomBytes(4).toString('hex');
	const { title } = req.body;
	posts[id] = {
		id,
		title,
	};

	// emit event to bus
	await axios.post('http://localhost:4005/events', {
		type: 'PostCreated',
		data: { id, title },
	});

	res.status(201).json(posts[id]);
});

// listen for events
app.post('/events', (req, res) => {
	console.log('received event:', req.body.type);
	res.send({ status: 'OK' });
});

app.listen(4000, () => {
	console.log('listening on 4000');
});

/*
manual testing:

curl -X POST -H "Content-Type: application/json" \
    -d '{"title": "i am a title"}' \
    http://localhost:4000/posts
xdg-open http://localhost:4000/posts
*/
