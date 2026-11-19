const express = require("express");
const { eq, like, and } = require("drizzle-orm");
const { potions } = require("../db/schema");
const db = require("../db/db");
const renderErrorHandler = require("../utilities/renderErrorHandler");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { name, effect } = req.query;
    let isDangeorus = req.query.isDangeorus;
    // if (isDangeorus === "true"){
    //     isDangeorus = true
    // }
    // else{
    //     isDangeorus = false
    // }

    if (!name || !effect || !isDangeorus) {
      const allPotions = await db.select().from(potions);
      return res.status(200).json(allPotions);
    }
    isDangeorus = isDangeorus === "true";

    const queryPotions = await db
      .select()
      .from(potions)
      .where(
        and(
          like(potions.name, `%${name}%`),
          like(potions.effect, `%${effect}%`),
          eq(isDangeorus, potions.isDangeorus),
        ),
      );
    return res.status(200).json(queryPotions);
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

router.delete("/:id", async (req, res) => {
  try {
    const [entry] = await db
      .select()
      .from(potions)
      .where(eq(potions.id, +req.params.id));
    if (!entry) {
      return res.status(400).json({ message: "Nincs szevasz" });
    }

    await db.delete(potions).where(eq(potions.id, +req.params.id));

    return res.status(200).json({ message: "sikeres torles" });
  } catch (err) {
    return renderErrorHandler(res, err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, effect, isDangeorus } = req.body;
    const [updating] = await db
      .select()
      .from(potions)
      .where(eq(potions.id, req.params.id));
    if (!updating) {
      return res.status(404).json({
        message: "nincs ilyen id",
      });
    }

    await db
      .update(potions)
      .set({ name, effect, isDangeorus })
      .where(eq(potions.id, req.params.id));
    return res.status(200).json({
      message: "sikeres update",
    });
  } catch (err) {
    return renderErrorHandler(res, err);
  }
});

module.exports = router;
