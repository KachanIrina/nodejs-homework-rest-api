const Joi = require("joi");
const {
  Contact,
  addSchema,
  updatedContactSchema,
  updateFavoriteSchema,
} = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");

const FAVORITES = ["true", "false"];

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const { favorite = undefined } = req.query;

  const skip = (page - 1) * limit;

  !favorite || !FAVORITES.includes(favorite)
    ? res.json(await Contact.find({ owner }, "", { skip, limit }))
    : res.json(await Contact.find({ owner, favorite }, "", { skip, limit }));
};

const getById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findById(id, owner);
  if (!result) {
    throw HttpError(404, "Contact not found");
  }
  res.status(200).json(result);
};

const add = async (req, res) => {
  const { error } = addSchema.validate(req.body);
  if (error) {
    throw HttpError(400, "missing required name field");
  }
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findByIdAndDelete(id, owner);
  if (!result) {
    throw HttpError(404, "Contact not found");
  }
  res.json({
    message: "Contact deleted",
  });
};

const update = async (req, res) => {
  const { err, value } = updatedContactSchema.validate(req.body);
  if (err || !Object.keys(value).length) {
    return res.status(400).json({ message: "missing fields" });
  }
  const { _id: owner } = req.user;
  const { id } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(id, req.body, owner, {
    new: true,
  });

  if (!updatedContact) {
    return next();
  }
  res.status(200).json({ updatedContact });
};

const updateStatus = async (req, res) => {
  const { err, value } = updateFavoriteSchema.validate(req.body);
  if (err || !Object.keys(value).length) {
    return res.status(400).json({ message: "missing fields favorite" });
  }
  const { id } = req.params;
  const { _id: owner } = req.user;
  const updateStatusContact = await Contact.findByIdAndUpdate(
    id,
    req.body,
    owner,
    {
      new: true,
    }
  );

  if (!updateStatusContact) {
    return next();
  }
  res.status(200).json({ updatedContact });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
  update: ctrlWrapper(update),
  updateStatus: ctrlWrapper(updateStatus),
};
