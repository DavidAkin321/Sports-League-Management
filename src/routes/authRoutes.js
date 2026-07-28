import express from 'express'; 

const router = express.Router()

router.get("/hello", (req, res) => {
    res.json({httpMethod: "get"});
});

export default router;