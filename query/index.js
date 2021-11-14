const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { application } = require('express');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// store posts in-memory (for testing)
// e.g. { "xxx": { id: "xxx", title: "hello", comments: [ { id: "xxx", content: "world!" }, ... ] } }
const posts = {};

const handleEvent = (event) => {
	const { type, data } = event;
	if (type === 'PostCreated') {
		const { id, title, content } = data;
		posts[id] = {
			id,
			title,
			content,
			comments: [],
		};
	}

	if (type === 'CommentCreated') {
		const { postId, commentId, content, status } = data;
		posts[postId].comments.push({ commentId, content, status });
	}

	if (type === 'CommentUpdated') {
		const { postId, commentId, status, content } = data;
		const comments = posts[postId].comments;
		const comment = comments.find((c) => c.commentId === commentId);
		comment.status = status;
		comment.content = content;
	}
};

// get all posts
app.get('/posts', (req, res) => {
	res.json(posts);
});

// listen for events
app.post('/events', (req, res) => {
	console.log('received event:', req.body.type);

	handleEvent(req.body);

	res.send({});
});

app.listen(4002, async () => {
	console.log('listening on 4002');

    // dead letter queue
	const res = await axios.get('http://localhost:4005/events');
	for (let event of res.data) {
		console.log(`processing event: ${event.type}`);
		handleEvent(event);
	}
});

/*
-- MANUAL TEST (for dlq)
1. Kill the Query service
2. Create some Posts and/or Comments
3. Restart the Query service
4. Check that the queued events are processed
*/