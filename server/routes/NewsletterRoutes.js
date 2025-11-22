// routes/NewsletterRouter.js
const NewsletterRouter = require("express").Router();
const { verifyAll, verifyAdmin, verifySuperAdmin } = require("../auth/authentication");
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/NewsletterControllers");

// POST - Subscribe → public (verifyAll = public allowed)
NewsletterRouter.post("", verifyAll, createRecord);

// GET - Sabko dikhe → NO MIDDLEWARE
NewsletterRouter.get("", getRecord);

// GET single → admin only
NewsletterRouter.get("/:_id", verifyAdmin, getSingleRecord);

// PUT, DELETE → admin/superadmin
NewsletterRouter.put("/:_id", verifyAdmin, updateRecord);
NewsletterRouter.delete("/:_id", verifySuperAdmin, deleteRecord);

module.exports = NewsletterRouter;