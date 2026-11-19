const express = require("express");
const { eq } = require("drizzle-orm");
const { potions } = require("../db/schema");
const db = require("../db/db");
const renderErrorHandler = require("../utilities/renderErrorHandler");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allPotions = await db.select().from(potions);
    return res.status(200).json(allPotions);
  } catch (err) {
    return renderErrorHandler(res, err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [entry] = await db
      .select()
      .from(potions)
      .where(eq(potions.id, +req.params.id));

    if (!entry) {
      return res.status(404).json({
        message: "potion gatya",
      });
    }

    return res.status(200).json(entry);
  } catch (err) {
    return renderErrorHandler(res, err);
  }
});
router.post("/", async (req, res) => {
  try {
    const { name, effect, isDangeorus } = req.body;

    if (!name) return res.status(404).json({ message: "'name' is required" });
    if (!effect)
      return res.status(404).json({ message: "'effect' is required" });
    if (isDangeorus === undefined)
      return res.status(404).json({ message: "'isDangeorus' is required" });

    await db.insert(potions).values({
      name: name,
      effect: effect,
      isDangeorus: isDangeorus,
    });
    return res.status(201).json({ message: "Posted succesfully" });
  } catch (err) {
    return renderErrorHandler(res, err);
  }
});

module.exports = router;
