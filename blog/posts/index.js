const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const bodyParser = require('body-parser');

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
app.post('/posts', (req, res) => {
	const id = randomBytes(4).toString('hex');
	const { title } = req.body;
	posts[id] = {
		id,
		title,
	};
	res.status(201).json(posts[id]);
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
