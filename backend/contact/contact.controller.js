const Contact = require("./constact.model");

const addContact = async (req, res) => {
  try {
    const contact = {
      ...req.body,
    };
    const newContact = await Contact(contact);
    await newContact.save();
    res.status(200).send({
      message: "Poruka je uspješno poslana",
      contact: newContact,
    });
  } catch (error) {
    console.error("Error while sending a message");
    res.status(500).json({ message: "Failed to add a contact" });
  }
};
const allContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).send(contacts);
  } catch (error) {
    console.error("Error fetching contacts", error);
    res.status(500).send({ message: "Failed to fetch contacts" });
  }
};

module.exports = {
  addContact,
  allContacts,
};
