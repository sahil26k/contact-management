const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const shortid = require('shortid');

const app = express();

app.use(cors());
app.get("/",(req,res) =>{
  res.setHeader("Access-control-Allow-Credentials","true");
  res.send("api is running")
})
mongoose.connect('mongodb+srv://sahil:sahil@cluster0.m6jwpzg.mongodb.net/contact', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(bodyParser.json());

app.get('/contacts', async (req, res) => {
  try {
    const collection = mongoose.connection.db.collection('contact-info');
    const fetchedData = await collection.find({}).toArray();
    res.json(fetchedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/contacts/:_id', async (req, res) => {
  try {
    const _id = req.params._id;
    const contact = await ContactInfo.findOne({ contact_id: _id });
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const contactInfoSchema = new mongoose.Schema({
  name: String,
  contact: String,
  mail: String,
  contact_id: {
    type: String,
    default: shortid.generate,
    unique: true,
  }
}, { collection: 'contact-info' });

const ContactInfo = mongoose.model('contact-info', contactInfoSchema);

app.post('/contacts', async (req, res) => {
  try {
    const newContact = new ContactInfo(req.body);
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/contacts/:_id', (req, res) => {
  const _id = req.params._id;
  ContactInfo.findOneAndDelete({ contact_id: _id })
    .then(() => {
      res.send("Contact deleted successfully");
    })
    .catch((error) => {
      res.send(error.message);
    });
});

app.put('/contacts/:_id', async (req, res) => {
  try {
    const _id = req.params._id;
    const updatedData = req.body;
    const updatedContact = await ContactInfo.findOneAndUpdate(
      { contact_id: _id },
      updatedData,
      { new: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(updatedContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use(express.static('public'));

app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});
