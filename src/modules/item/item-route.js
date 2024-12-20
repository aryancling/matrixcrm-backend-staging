const express = require("express");
const router = express.Router();
const ItemController = require("./item-controller");

router.post("/createItems", ItemController.createItem);
router.get("/items", ItemController.getAllItems);
router.get("/items/:itemId", ItemController.getItemById);
router.put("/items/:itemId", ItemController.updateItemById);
router.delete("/items/:itemId", ItemController.deleteItemById);

module.exports = router;
