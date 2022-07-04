const express = require("express");
const router = express.Router();
const { Genre } = require("../db");
router.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Add a New Genre</title></head>
      <body>
        <h1>Add a New Genre</h1>
        <form method="POST" action="/genre">
          <div>
            <label>Name:</label>
            <input type="text" name="theName" />
            <button type="submit">Add Genre</button>
          </div>
        </form>
      </body>
    </html>
    `
  );
})

router.post("/", async (req, res, next) => {
  try {
    const newGenre = await Genre.create({ name: req.body.theName })
    res.redirect("/genre")
  } catch (error) {
    next(error)
  }
})

module.exports = router;
