import React, { useState, useEffect } from 'react';
import Navbar from './components/navBar';
import axios from 'axios';
import ContactTable from './components/contactTable';

function App() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  useEffect(() => {
    axios
      .get('https://contact-management-api.vercel.app/contacts')
      .then((response) => {
        setContacts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <Navbar onSearch={handleSearch} />
      <ContactTable contacts={contacts} searchTerm={searchTerm} />
    </div>
  );
}

export default App;
