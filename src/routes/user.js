const router = require("express").Router();

router.get("/usertest", (req,res)=> {
    res.send("usertest");
});

router.post("userpost", (req,res)=> {
    const username = req.body.username;
})

module.exports = router;