const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const bodyParser = require('body-parser');

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

	const commentId = randomBytes(4).toString('hex');
	const comments = commentsByPostId[postId] || [];

	comments.push({ id: commentId, content: content });
	commentsByPostId[postId] = comments;

	res.status(201).send({ id: commentId });
});

app.listen(4001, () => {
	console.log('listening on 4001');
});

/*
-- CREATE A POST:
curl -X POST -H "Content-Type: application/json" \
    -d '{"title": "i am a title"}' \
    http://localhost:4000/posts

-- LIST ALL POSTS:
curl http://localhost:4000/posts

-- CREATE A COMMENT FOR A POST:
POST_ID=$(pick a random post id)
curl -X POST -H "Content-Type: application/json" \
	-d '{"content": "i am a comment"}' \
	http://localhost:4001/posts/${POST_ID}/comments

-- LIST ALL COMMENTS FOR A POST:
curl http://localhost:4001/posts/${POST_ID}/comments
*/
