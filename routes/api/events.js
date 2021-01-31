const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Events = require("../../models/Events");
var moment = require("moment");
var cloudinary = require("cloudinary");
var multer = require("multer");

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

var upload = multer({ storage: storage });

// @route   POST api/events/add
// @desc    Add New Event
// @access  private
router.post(
  "/add",
  auth,
  upload.any([{ name: "file" }, { name: "pdfFile" }]),
  async (req, res) => {
    try {
      var files = req.files;
      if (req.files != undefined) {
        const all_paths = [];
        var file_Arr = new Array();

        // const pdfs = files.filter(
        //   (a) => !a.originalname.match(/\.(jpg|jpeg|png|gif)$/i)
        // );
        // const images = files.filter((a) =>
        //   a.originalname.match(/\.(jpg|jpeg|png|gif)$/i)
        // );

        // if (pdfs) {
        //   pdfs.forEach( async function (el) {
        //     const fileContent = (el.originalname)
        //     const name = el.originalname.slice(0,el.originalname.indexOf('.'))
        //     const response =
        //      await cloudinary.v2.uploader.upload(fileContent,{
        //       transformation:{format:'pdf'}
        //     })
        //     console.log("response",response)
        //   });
        // }

        if (files) {
          files.forEach((file) => all_paths.push(file.path));
        }
        if (all_paths) {
          all_paths.forEach(function (path) {
            cloudinary.uploader.upload(path, async function (result) {
              file_Arr.push({ img: result.secure_url });
            });
          });
        }
        setTimeout(async function () {
          var event = new Events({
            name: req.body.name,
            description: req.body.description,
            timeStart: req.body.timeStart,
            timeEnd: req.body.timeEnd,
            location: req.body.location,
            date: req.body.date,
            note: req.body.note,
            birthdate: req.body.birthday == undefined ? "" : req.body.birthday,
            user: req.body.user == undefined ? "" : req.body.user,
            file: file_Arr,
          });
          await event.save();
        }, 3000);
      } else {
        setTimeout(async function () {
          var event = new Events({
            name: req.body.name,
            description: req.body.description,
            timeStart: req.body.timeStart,
            timeEnd: req.body.timeEnd,
            location: req.body.location,
            date: req.body.date,
            note: req.body.note,
            birthdate: req.body.birthday == undefined ? "" : req.body.birthday,
            user: req.body.user == undefined ? "" : req.body.user,
            file: "",
          });
          await event.save();
        }, 3000);
      }
      setTimeout(async function () {
        res.status(200).json({ msg: "Event Added Successfully" });
      }, 3500);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  }
);

// @route    POST api/events/:id
//@desc      update events.
router.post("/:id", auth, upload.any("file"), async (req, res) => {
  try {
      var files = req.files;
      if(files !=undefined){
      const all_paths = [];
      let event = await Events.findById(req.params.id);
      if (files) {
        files.forEach((file) => all_paths.push(file.path));
      }
      const images = new Array();
      if (all_paths) {
        all_paths.forEach(function (path) {
          setTimeout(async function () {

          cloudinary.uploader.upload(path, async function (result) {
            images.push({ img: result.secure_url });

        });
      }, 1000);
    });
        setTimeout(async function () {
        let all_images = event.file.concat(images);
        event.file = all_images;
        event.name=req.body.name;
        event.date=req.body.date;
        event.timeEnd=req.body.timeEnd;
        event.timeStart=req.body.timeStart;
        event.note=req.body.note;
        event.location=req.body.location;
        event.save();
      }, 2800);

      }
    }
    else{
      let event = await Events.findByIdAndUpdate({_id:req.params.id},{...req.body});
    }
   
    setTimeout(async function () {
      return res.status(200).json({ msg: "Event updated successfully!" });
    }, 3000);
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
    res.status(500).send("Server Error!");
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
