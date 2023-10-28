const { Router, json, urlencoded } = require('express'),
    { user, blocklist, friendship, tasklist, events } = require('../services'),

    router = Router();
router.use(json());
router.use(urlencoded({ extended: true }));

router.get('/', async (_, res) => res.json({ status: process.env.TEST }));

// *********************************************************************************************** ROUTES

// *********************************************************************************************** POINTS ROUTES

router.post('/increase-points', async (req, res) => {
    const data = await user.increasePoints(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

router.post('/decrease-points', async (req, res) => {
    const data = await user.decreasePoints(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

// *********************************************************************************************** USER ROUTES
router.post('/signin-user', async (req, res) => {
    const data = await user.signIn(req.body);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message, user: data.user } : data)
});

router.post('/new-user', async (req, res) => {
    const data = await user.newUser(req.body);
    res.status(!!data.status ? data.status : 200).json(data)
});

router.post('/new-child', async (req, res) => {
    const data = await user.newChild(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(data)
});

router.post('/update-user', async (req, res) => {
    const data = await user.updateUser(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

router.post('/delete-user', async (req, res) => {
    const data = await user.deleteUser(req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});


// *********************************************************************************************** BLOCK ROUTES
router.get('/get-block', async (req, res) => {
    const data = await blocklist.getBlock(req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

router.post('/block-user', async (req, res) => {
    const data = await blocklist.addBlock(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

router.post('/remove-user', async (req, res) => {
    const data = await blocklist.removeBlock(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

// *********************************************************************************************** FRIEND ROUTES
router.get('/get-friends', async (req, res) => {
    const data = await friendship.getFriend(req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

router.post('/add-friend', async (req, res) => {
    const data = await friendship.addFriend(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

router.post('/remove-friend', async (req, res) => {
    const data = await friendship.removeFriend(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

// *********************************************************************************************** LIST ROUTES
router.post('/new-list', async (req, res) => {

    const data = await tasklist.createList(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

router.post('/update-list', async (req, res) => {

    const data = await tasklist.updateList(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

router.post('/delete-list', async (req, res) => {

    const data = await tasklist.deleteList(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

// *********************************************************************************************** TASK ROUTES
router.post('/new-task', async (req, res) => {

    const data = await tasklist.createTask(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

router.post('/update-task', async (req, res) => {

    const data = await tasklist.updateTask(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

router.post('/delete-task', async (req, res) => {

    const data = await tasklist.deleteTask(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

// *********************************************************************************************** CATEGORY ROUTES
router.get('/get-category', async (req, res) => {

    const data = await events.getCategory(req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

router.post('/create-category', async (req, res) => {

    const data = await events.createCategory(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

router.post('/update-category', async (req, res) => {

    const data = await events.updateCategory(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

router.post('/delete-category', async (req, res) => {

    const data = await events.deleteCategory(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

// *********************************************************************************************** EVENTS ROUTES
router.get('/get-events', async (req, res) => {

    const data = await events.getEvents(req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

router.post('/create-events', async (req, res) => {

    const data = await events.createEvent(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

router.post('/update-events', async (req, res) => {

    const data = await events.updateEvent(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});

router.post('/delete-events', async (req, res) => {

    const data = await events.deleteEvent(req.body, req.headers.authorization);
    res.status(!!data.status ? data.status : 200).json(!!data.status ? { message: data.message } : data)
});


module.exports = router