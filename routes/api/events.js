const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Events = require("../../models/Events");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
var moment = require("moment");
var cloudinary = require("cloudinary");
var multer = require('multer')

var storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
const imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are accepted!"), false);
  }
  cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter });

// @route   POST api/events/add
// @desc    Add New Event
// @access  private
router.post("/add", auth, upload.single("file"), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    // const body = JSON.parse(JSON.stringify(req.body));
    const body = req.body;

    // const file = req.file.path;
    // cloudinary.uploader.upload(file, async function (result) {
      console.log(body)
      let event = new Events({
        name: body.name,
        description: body.description,
        timeStart: body.timeStart,
        timeEnd: body.timeEnd,
        location: body.location,
        date: body.date,
        note: body.note,
        birthdate: body.birthday,
        // file: result.secure_url,
      });
      await event.save();
      res.status(200).json({ event, msg: "Event Added Successfully" });
    // });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// @route    POST api/events/:id
//@desc      update events.
router.post("/:id", auth, async (req, res) => {
  try {
    let event = await Events.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!event) {
      return res
        .status(400)
        .json({ errors: [{ msg: "No event found with this id." }] });
    }

    return res.status(200).json({ msg: "Event updated successfully!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
  }
});

// @route   GET api/events
// @desc    Get all events
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const events = await Events.find();
    res.json(events);
  } catch (err) {
    console.log(err);
    res.statu(500).send("Server Error!");
  }
});

// @route  GET api/events/:id
// @desc   Get events by id
// @access Private
router.get("/:id", auth, async (req, res) => {
  try {
    const event = await Events.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: "No Customer found" });
    }

    res.json(event);
  } catch (err) {
    console.error(err.message);
    // Check if id is not valid
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No Customer found" });
    }
    res
      .status(500)
      .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
  }
});

module.exports = router;
