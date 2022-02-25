const express = require('express');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Topics = require('../models/topics');

const topicRouter = express.Router();

topicRouter.use(bodyParse.json());

topicRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { // preflight options
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res,next) => {
        Topics.find({})
            .populate('comments.author')
            .then((topics) => {
                console.log('Topics Get ', topics);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(topics);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Topics.create(req.body)
            .then((topic) => {
                console.log('Topic Created ', topic);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(topic);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /topics');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Topics.remove({})
            .then((resp) => {
                console.log('Topics Deleted');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

topicRouter.route('/:topicId')
    .options(cors.corsWithOptions, (req, res) => { // preflight options
        res.sendStatus(200);
    })
    .get( cors.cors, (req, res,next) => {
       Topics.findById(req.params.topicId)
           .populate('comments.author')
           .then((topic) => {
           res.statusCode = 200;
           res.setHeader('Content-Type', 'application/json');
           res.json(topic);
       }, (err) => next(err))
           .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser,  (req, res,next) => {
       res.statusCode = 403;
       res.end('POST operation not supported on /topic' + req.params.topicId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Topics.findByIdAndUpdate(req.params.topicId, {
            $set: req.body
        }, { new: true})
            .then((topic) => {
            console.log('Topic Updated ', topic);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(topic);
        }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser,  (req, res,next) => {
        Topics.findByIdAndRemove(req.params.topicId)
            .then((topic) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
        }, (err) => next(err))
            .catch((err) => next(err));
    });




topicRouter.route('/:topicId/comments')
    .options(cors.corsWithOptions, (req, res) => { // preflight options
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res,next) => {
        Topics.findById(req.params.topicId)
            .populate('comments.author')
            .then((topic) => {
                if (topic != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(topic.comments);
                } else {
                    err = new Error('Topic ' + req.params.topicId + ' not found!')
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Topics.findById(req.params.topicId)
            .then((topic) => {
                if (topic != null) {
                    req.body.author = req.user._id;
                    topic.comments.push(req.body);
                    topic.save()
                        .then((topic) => {
                            Topics.findById(topic._id)
                                .populate('comments.author')
                                .then((topic) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(topic.comments);
                            })
                        })
                } else {
                    err = new Error('Topic ' + req.params.topicId + ' not found!')
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /topics/' + req.params.topicId + '/comments');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Topics.findById(req.params.topicId)
            .then((topic) => {
                if (topic != null) {
                    for (var i = (topic.comments.length - 1); i >= 0; i--) {
                        topic.comments.id(topic.comments[i]._id).remove();
                    }
                    topic.save()
                        .then((topic) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(topic.comments);
                        }, (err) => next(err));
                } else {
                    err = new Error('Topic ' + req.params.topicId + ' not found!')
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

topicRouter.route('/:topicId/comments/:commentId')
    .options(cors.corsWithOptions, (req, res) => { // preflight options
        res.sendStatus(200);
    })
    .get(cors.cors,  (req, res, next) => {
        Topics.findById(req.params.topicId)
            .populate('comments.author')
            .then((topic) => {
                if (topic != null && topic.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(topic.comments.id(req.params.commentId));
                } else if (topic == null) {
                    err = new Error('Topic ' + req.params.topicId + ' not found!')
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Comment ' + req.params.commentId + ' not found!')
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /topics/' + req.params.topicId + '/comments/' + req.params.commentId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.commentsOwner, (req, res, next) => {
        Topics.findById(req.params.topicId)
            .then((topic) => {
                if (topic != null && topic.comments.id(req.params.commentId) != null) {
                    if (req.body.rating) {
                        topic.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.comment) {
                        topic.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    topic.save()
                        .then((topic) => {
                            Topics.findById(topic._id)
                                .populate('comments.author')
                                .then((topic) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(topic);
                                })
                        }, (err) => next(err));
                }
                else if (topic == null) {
                    err = new Error('Topic ' + req.params.topicId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.commentsOwner,  (req, res, next) => {
        Topics.findById(req.params.topicId)
            .then((topic) => {
                if (topic != null && topic.comments.id(req.params.commentId) != null) {
                    topic.comments.id(req.params.commentId).remove();
                    topic.save()
                        .then((topic) => {
                            Topics.findById(topic._id)
                                .populate('comments.author')
                                .then((topic) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(topic);
                                })
                        }, (err) => next(err));
                } else if (topic == null) {
                    err = new Error('Topic ' + req.params.topicId + ' not found!')
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Comment ' + req.params.commentId + ' not found!')
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });




module.exports = topicRouter;