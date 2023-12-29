const withAuth = (req, res, next) => {
    // If the user is not logged in, redirect the request to the login route
    if (!req.session.logged_in) {
        res.redirect('/login');
    } else {
        // Serves dual purpose as parameter and function.
        next();
    }
};

module.exports = withAuth;