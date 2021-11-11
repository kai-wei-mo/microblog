const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { application } = require('express');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// store posts in-memory (for testing)
// e.g. { "xxx": { id: "xxx", title: "hello", comments: [ { id: "xxx", content: "world!" }, ... ] } }
const posts = {};

// get all posts
app.get('/posts', (req, res) => {
    res.json(posts);
});

// listen for events
app.post('/events', (req, res) => {
	console.log('received event:', req.body.type);
	
    const { type, data } = req.body;

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

    res.send({});
});


app.listen(4002, () => {
	console.log('listening on 4002');
});
