const express = require("express");
//const Joi = require("joi");
const { isValidId } = require("../../middlewares");
const {
  Contact,
  addSchema,
  updatedContactSchema,
  updateFavoriteSchema,
} = require("../../models/contact");
const HttpError = require("../../helpers/HttpError.js");

const router = express.Router();

// const addSchema = Joi.object({
//   name: Joi.string().required(),
//   email: Joi.string().required(),
//   phone: Joi.string().required(),
// });

// const updatedContactSchema = Joi.object({
//   name: Joi.string(),

//   phone: Joi.string(),

//   email: Joi.string(),
// });

router.get("/", async (req, res, next) => {
  const result = await Contact.find();
  res.json(result);
});

router.get("/:id", isValidId, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findById(id);
    if (!result) {
      throw HttpError(404, "Contact not found");
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "missing required name field");
    }
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", isValidId, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
      throw HttpError(404, "Contact not found");
    }
    res.json({
      message: "Contact deleted",
    });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", isValidId, async (req, res, next) => {
  try {
    const { err, value } = updatedContactSchema.validate(req.body);
    if (err || !Object.keys(value).length) {
      return res.status(400).json({ message: "missing fields" });
    }
    const { id } = req.params;
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedContact) {
      return next();
    }
    res.status(200).json({ updatedContact });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", isValidId, async (req, res, next) => {
  try {
    const { err, value } = updateFavoriteSchema.validate(req.body);
    if (err || !Object.keys(value).length) {
      return res.status(400).json({ message: "missing fields favorite" });
    }
    const { id } = req.params;
    const updateStatusContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updateStatusContact) {
      return next();
    }
    res.status(200).json({ updatedContact });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
