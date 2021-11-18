const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// store comments in-memory (for testing)
// e.g. { "abc123": [ { "id": "def456", "content": "hello world" }, ... ] }
const commentsByPostId = {};

// get all comments for a post
app.get('/posts/:postId/comments', (req, res) => {
	const { postId } = req.params;
	const comments = commentsByPostId[postId] || [];
	res.json(comments);
});

// create a new comment for a post
app.post('/posts/:postId/comments', (req, res) => {
	const { postId } = req.params;
	const { content } = req.body;
	const status = 'pending';

	const commentId = randomBytes(4).toString('hex');
	const comments = commentsByPostId[postId] || [];

	comments.push({ id: commentId, content: content, status: status });
	commentsByPostId[postId] = comments;

	// emit event to bus
	axios.post('http://event-bus-clusterip:4005/events', {
		type: 'CommentCreated',
		data: { postId, commentId, content, status },
	});

	res.status(201).send({ id: commentId });
});

// listen for events
app.post('/events', async (req, res) => {
	console.log('received event:', req.body.type);

	const { type, data } = req.body;

	// a comment has been moderated by Moderator
	if (type === 'CommentModerated') {
		const { commentId, postId, status } = data;
		const comments = commentsByPostId[postId];
		const comment = comments.find((c) => c.id === commentId);
		comment.status = status;

		// emit event to bus
		await axios.post('http://event-bus-clusterip:4005/events', {
			type: 'CommentUpdated',
			data: { commentId, postId, status, content: comment.content },
		});
	}

	res.send({ status: 'OK' });
});

app.listen(4001, () => {
	console.log('listening on 4001');
});

/* (kubectl exec -it SOME_POD_NAME sh)
-- CREATE A POST:
curl -X POST -H "Content-Type: application/json" \
    -d '{"title": "i am a title"}' \
    http://posts-clusterip:4000/posts

-- LIST ALL POSTS:
curl http://posts-clusterip:4000/posts

-- CREATE A COMMENT FOR A POST:
POST_ID=$(pick a random post id)
curl -X POST -H "Content-Type: application/json" \
	-d '{"content": "i am a comment"}' \
	http://comments-clusterip:4001/posts/${POST_ID}/comments

-- LIST ALL COMMENTS FOR A POST:
curl http://comments-clusterip:4001/posts/${POST_ID}/comments
*/
