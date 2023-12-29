const router = require('express').Router();
const { Posts, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        // Gets all posts and JOIN with user data.
        const postsData = await Posts.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        // Serialize data so the template can read it.
        const posts = postsData.map((post) => project.get({ plain: true }));

        // Pass serialized data and session flag into template.
        res.render('homepage', {
            projects,
            logged_in: req.session.logged_in
        });

    } catch (err) {
        res.status(500).json(err);
    }
});