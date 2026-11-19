const express = require("express");
const { eq } = require("drizzle-orm");
const { potions } = require("../db/schema");
const db = require("../db/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allPotions = await db.select().from(potions);
    return res.status(200).json(allPotions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
