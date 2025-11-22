const CheckoutRouter = require("express").Router()
const {
    verifyUser,
    verifyAdmin
} = require("../auth/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    getAllRecord,
} = require("../controllers/CheckoutControllers")

CheckoutRouter.post("", verifyUser, createRecord)
CheckoutRouter.get("/", verifyAdmin, getAllRecord)
CheckoutRouter.get("/user/:userid", verifyUser, getRecord)
CheckoutRouter.get("/:_id", verifyUser, getSingleRecord)
CheckoutRouter.put("/:_id", verifyAdmin, updateRecord)
CheckoutRouter.delete("/:_id", verifyAdmin, deleteRecord)


module.exports = CheckoutRouter