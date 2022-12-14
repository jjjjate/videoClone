const express = require('express');
const router = express.Router();
const multer = require('multer');
let ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const { Video } = require("../models/Video");
// const { Subscriber } = require("../models/Subscriber");
const { auth } = require("../middleware/auth");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    console.log(file.mimetype);
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.mp4') {
      console.log('it is not mp4');
      return cb(new Error('only mp4 is allowed'), false);
    }
    cb(null, true);
  },
}).single('file');

//=================================
//             Video
//=================================

router.post("/uploadfiles", (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.json({ success: false, err })
    }
    return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
  })
});


router.post("/thumbnail", (req, res) => {
  let thumbsFilePath ="";
  let fileDuration ="";
  ffmpeg.ffprobe(req.body.filePath, function(err, metadata){
    fileDuration = metadata.format.duration;
  })

  ffmpeg(req.body.filePath)
    .on('filenames', function (filenames) {
      console.log('Will generate ' + filenames.join(', '))
      thumbsFilePath = "uploads/thumbnails/" + filenames[0];
    })
    .on('end', function () {
      console.log('Screenshots taken');
      return res.json({ success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration})
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 1,
      folder: 'uploads/thumbnails',
      size:'320x240',
      // %b input basename ( filename w/o extension )
      filename:'thumbnail-%b.png'
    });
});

router.post("/uploadVideo", (req, res) => {
  const video = new Video(req.body)
  video.save((err, video) => {
    if(err) return res.status(400).json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
});

router.get("/getVideos", (req, res) => {
  //???????????? DB?????? ???????????? ?????????????????? ?????????.
  Video.find()
    .populate('writer')
    .exec((err, videos) => {
      if(err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos })
    })
});

router.post("/getVideoDetail", (req, res) => {
  Video.findOne({ "_id": req.body.videoId })
    .populate('writer')
    .exec((err, video) => {
      if(err) return res.status(400).send(err)
      return res.status(200).json({ success: true, video })
    })
});

//
// router.post("/getSubscriptionVideos", (req, res) => {
//
//
//   //Need to find all of the Users that I am subscribing to From Subscriber Collection
//
//   Subscriber.find({ 'userFrom': req.body.userFrom })
//     .exec((err, subscribers)=> {
//       if(err) return res.status(400).send(err);
//
//       let subscribedUser = [];
//
//       subscribers.map((subscriber, i)=> {
//         subscribedUser.push(subscriber.userTo)
//       })
//
//
//       //Need to Fetch all of the Videos that belong to the Users that I found in previous step.
//       Video.find({ writer: { $in: subscribedUser }})
//         .populate('writer')
//         .exec((err, videos) => {
//           if(err) return res.status(400).send(err);
//           res.status(200).json({ success: true, videos })
//         })
//     })
// });

module.exports = router;