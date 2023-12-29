const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        // Gets all posts and JOIN with user data.
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        // Serialize data so the template can read it.
        const posts = postData.map((post) => post.get({ plain: true }));

        // Pass serialized data and session flag into template.
        // Session flag = variable stored in the user's session to 
        // indicate certain state/condition.
        res.render('homepage', {
            posts,
            logged_in: req.session.logged_in
        });

    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        const post = postData.get({ plain: true });

        res.render('post', {
            // Spread syntax = expands elements of an array/object.
            // Useful for creating a copy where you don't want to 
            // modify the original array/object.
            ...post,
            // Boolean session flag.
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Use withAuth middleware to prevent access to route.
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        // Find the logged in user based on the session ID.
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Post }],
        });

        const user = userData.get({ plain: true });

        res.render('dashboard', {
            ...user,
            // Boolean session flag.
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    // If user is logged in, redirect the request to /dashboard.
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }

    res.render('login');
});

module.exports = router;