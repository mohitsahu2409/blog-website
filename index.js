import express from 'express';

const app = express();
const port = 3000;

var titles = [];
var posts = [];

// Middleware to handle form data
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', {posts});
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/new', (req, res) =>{
    const title = req.body.title;
    const content = req.body.content;
    const newPost = {id: Date.now(), title, content};
    posts.push(newPost);
    res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
    const postID = req.params.id;
    const post = posts.find(p => Number(p.id) == Number(postID));
    if (!post) return res.status(404).send("post not found...");
    res.render('edit', {post});
});

app.post('/edit/:id', (req, res) => {
    const postID = Number(req.params.id); // Convert to number
    const postIndex = posts.findIndex((p) => p.id === postID);

    if (postIndex === -1) {
        return res.status(404).send("Post not found");
    }

    // Update post details
    posts[postIndex].title = req.body.title;
    posts[postIndex].content = req.body.content;

    res.redirect('/');
});


app.post('/delete/:id', (req, res) =>{
    const postID = Number(req.params.id);
    posts = posts.filter(post => post.id !== postID);
    res.redirect('/');

});

app.listen(port, () => {
    console.log('listening on port ' + port);
});