const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
	console.log('received event:', req.body.type);

    const { type, data } = req.body;

    if (type === 'CommentCreated') {
        // moderation middleware
        const status = data.content.includes('reject') ? 'rejected' : 'approved';
        
        await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data: {
                commentId: data.commentId,
                postId: data.postId,
                status: status,
            }
        });
    }
});

app.listen(4003, () => {
	console.log('listening on 4003');
});
