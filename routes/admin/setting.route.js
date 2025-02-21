const express = require("express");
const multer = require("multer");

const router = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/setting.controller");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get(
  "/general",
  upload.single("logo"),
  uploadCloud.upload,
  controller.general
);

router.patch("/general", controller.generalPatch);

module.exports = router;
