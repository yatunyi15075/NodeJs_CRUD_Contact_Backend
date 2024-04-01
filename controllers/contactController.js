const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
//@desc Get all contacts
//@route Get  /api/contacts
//@access private
const getContacts = asyncHandler (async (req, res) => {
    //added (user_id: req.user.id)  so as fetch it appropriately 
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
});

//@desc Create all contacts
//@route POST /api/contacts
//@access private
const createContact = asyncHandler (async (req, res) => {
        console.log('The Request Body is:', req.body );
        const {name, email, phone} = req.body;
        if (!name || !email || !phone) {
            res.status(400);
            throw new Error("All fields are mandatory");
        }
        const contact = await Contact.create({
            name,
            email,
            phone,
            user_id: req.user.id 
        });

        res.status(201).json(contact);
});

//@desc Get all contacts
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler (async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json({ message: `Get the Contact ${req.params.id}`});
});

//@desc Update all contacts
//@route POST /api/contacts/:id
//@accessprivate
const updateContact = asyncHandler (async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to change contact")
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json({ message: `Updated the Contact ${req.params.id}`});
});

//@desc Delete all contacts
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler (async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to delete contact")
    }
    await Contact.deleteOne({ _id: req.params.id });
    res.status(200).json(contact);
});

module.exports = { getContacts, createContact, getContact, updateContact, deleteContact };
