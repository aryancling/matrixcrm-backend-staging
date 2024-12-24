const express = require("express");
const router = express.Router();
const ItemController = require("./item-controller");

router.post("/create-item", ItemController.createItem);
router.get("/get-items", ItemController.getAllItems);
router.get("/get-items-by-id/:itemId", ItemController.getItemById);
router.post("/update-item/:itemId", ItemController.updateItemById);
router.delete("/delete-item/:itemId", ItemController.deleteItemById);

module.exports = router;
