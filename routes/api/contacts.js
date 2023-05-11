const express = require("express");
const { isValidId, authenticate } = require("../../middlewares");
const ctrl = require("../../controllers/contacts");
const Contact = require("../../models/contact");

const router = express.Router();

router.get("/", authenticate, ctrl.getAll);

router.get("/:id", authenticate, isValidId, ctrl.getById);

router.post("/", authenticate, ctrl.add);

router.delete("/:id", authenticate, isValidId, ctrl.deleteById);

router.put("/:id", authenticate, isValidId, ctrl.updateById);

router.patch("/:id", authenticate, isValidId, ctrl.updateStatus);

module.exports = router;
