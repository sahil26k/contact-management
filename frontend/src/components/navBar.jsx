import React, { useState } from 'react';
import './navBar.css';
import axios from 'axios';

function Navbar({ onSearch, onAddContact }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', mail: '' });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://contact-management-api.vercel.app/contacts', formData);
      setFormData({ name: '', contact: '', mail: '' });
      setShowForm(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <p className="brand">PHONEBOOK</p>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search By Name"
            className="searchInput"
            onChange={(e) => onSearch(e.target.value)}
          />
          <button onClick={() => setShowForm(!showForm)} className="add-contact-button">
            Add Contact
          </button>
        </div>
        {showForm && (
          <form className="contact-form" onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.mail}
              onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
            />
            <button type="submit">Save</button>
          </form>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
