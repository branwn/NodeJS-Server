const express = require('express');
const bodyParse = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');


const storage = multer.diskStorage ( {
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    if (! file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        return cb(new Error("You can upload only image files!"), false);
    }
    cb (null, true);
};

const upload = multer({
    storage: storage, fileFilter: imageFileFilter
});


const uploadRouter = express.Router();

uploadRouter.use(bodyParse.json());

uploadRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { // preflight options
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin,
        (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /imageUpload');
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,
        (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /imageUpload');
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,
        upload.single('imageFile'), (req, res, next) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(req.file);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,
        (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /imageUpload');
    })

module.exports = uploadRouter;