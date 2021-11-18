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
        
        await axios.post('http://event-bus-clusterip:4005/events', {
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

/*
-- MANUAL TEST
1. Create a post (call this Post A).
2. Create a comment under Post A containing the word "reject".
3. Check that the comment is rejected.
4. Kill the Moderation service.
5. Create a comment under Post A.
6. Check that the comment is pending approval.
*/