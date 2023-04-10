const express = require("express");
const Joi = require("joi");
const contacts = require("../../models/contacts.js");
const HttpError = require("../../helpers/HttpError.js");

const router = express.Router();

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.getContactById(id);
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
    const { err } = addSchema.validate(req.body);
    if (err) {
      throw HttpError(400, "missing required name field");
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.removeContact(id);
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

router.put("/:id", async (req, res, next) => {
  try {
    const { err } = addSchema.validate(req.body);
    if (err) {
      throw HttpError(400, "missing fields");
    }
    const { id } = req.params;
    const result = await contacts.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404, "Contact not found");
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
