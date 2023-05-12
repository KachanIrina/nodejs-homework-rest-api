const Joi = require("joi");
const {
  Contact,
  addSchema,
  updatedContactSchema,
  updateFavoriteSchema,
} = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;

  const skip = (page - 1) * limit;

  const contacts = await Contact.find({ owner }, "", { skip, limit });
  res.json(contacts);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOne({ _id: id, owner });
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
  const result = await Contact.findOneAndRemove({ _id: id, owner });
  if (!result) {
    throw HttpError(404, "Contact not found");
  }
  res.json({
    message: "Contact deleted",
  });
};

const updateById = async (req, res, next) => {
  const { error } = updatedContactSchema.validate(req.body);
  if (error) {
    HttpError(400, error.message);
  }
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate(
    { _id: id, owner },
    { ...req.body },
    { new: true }
  );
  console.log(result);
  if (result === null) {
    next(HttpError(404, "Contact not found"));
  }
  if (!result) {
    HttpError(404, "Contact not found");
  }
  res.status(200).json(result);
};

const updateStatus = async (req, res) => {
  const { err, value } = updateFavoriteSchema.validate(req.body);
  if (err || !Object.keys(value).length) {
    return res.status(400).json({ message: "missing fields favorite" });
  }
  const { id } = req.params;
  const { _id: owner } = req.user;
  const updateStatusContact = await Contact.findOneAndUpdate(
    { _id: id, owner },
    { ...req.body },
    { new: true }
  );

  if (!updateStatusContact) {
    return next();
  }
  res.status(200).json({ updateStatusContact });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
  updateById: ctrlWrapper(updateById),
  updateStatus: ctrlWrapper(updateStatus),
};
