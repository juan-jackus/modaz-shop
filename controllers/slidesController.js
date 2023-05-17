const Slide = require('../models/slide');
const userPolicies = require('../policies/userPolicies');
const { deleteFromGoogleDrive } = require('../utils/googleDriveFileHandler');
const {
  slideResourceArray,
  slideResource,
} = require('../resources/slideResource');

const getSlides = async (req, res) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  const allSlides = await Slide.find().sort({ order: 1, created_at: -1 });
  const publishedSlides = await Slide.find({ status: true }).sort({
    order: 1,
    created_at: -1,
  });
  const draftedSlides = await Slide.find({ status: false }).sort({
    order: 1,
    created_at: -1,
  });

  const data = {
    allSlides: slideResourceArray(allSlides),
    publishedSlides: slideResourceArray(publishedSlides),
    draftedSlides: slideResourceArray(draftedSlides),
    publishedSlidesCount: publishedSlides.length,
    slidesCount: allSlides.length,
  };
  res.status(200).send(data);
};

const getSlide = async (req, res) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  const slide = await Slide.findOne({ _id: req.params.id });
  if (!slide) return res.sendStatus(404);
  res.status(200).send(slideResource(slide));
};

const create = async (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  const slidesCount = await Slide.count().exec();
  if (slidesCount >= 10) {
    return res.status(401).json({ message: 'Max limit of 10 slides reached' });
  }
  const data = req.body;
  const publishedCount = await Slide.count({ where: { status: true } });
  if (!['0', 'false'].includes(data.status) && publishedCount <= 5) {
    data.status = true;
  } else {
    data.status = false;
  }
  data.order = 0;

  const model = new Slide(data);
  model
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      next(err);
      deleteFromGoogleDrive(req.body.image);
    });
};

const update = async (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  const data = req.body;
  const foundSlide = await Slide.findOne({ _id: req.params.id }).exec();
  if (!foundSlide) return res.status(422).send({ message: 'Slide not found' });
  const publishedCount = await Slide.find({ status: true }).count().exec();
  if (
    ['1', 'true', true].includes(data.status) &&
    publishedCount >= 5 &&
    !foundSlide.status
  ) {
    return res.status(422).send({ message: 'Max published slide reached' });
  }

  Slide.findOneAndUpdate({ _id: req.params.id }, { $set: data })
    .then((result) => {
      res.sendStatus(200);
      if (!req.deletePreviousImg) return;
      deleteFromGoogleDrive(result.image);
    })
    .catch((err) => next(err));
};

const updateOrder = async (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  const data = req.body.slides;
  if (!data.length) {
    res.status(422).send({ message: 'Provide valid field(s) to update' });
  }
  const bulkWriteOperations = [];
  data.forEach((slide, i) => {
    bulkWriteOperations.push({
      updateOne: {
        filter: { _id: slide.id },
        update: { $set: { order: i } },
      },
    });
  });
  try {
    Slide.bulkWrite(bulkWriteOperations);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const destroy = (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  const { id = null, imgUrl = null } = req.body;
  if (!id) return res.sendStatus(422);
  Slide.deleteOne({ _id: id })
    .then((result) => {
      res.sendStatus(200);
      deleteFromGoogleDrive(imgUrl);
    })
    .catch((err) => next(err));
};

module.exports = {
  create,
  update,
  destroy,
  getSlide,
  getSlides,
  updateOrder,
};
