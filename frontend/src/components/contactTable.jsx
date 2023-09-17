import React, { useState, useEffect } from 'react';
import './contactTable.css';
import { UilTrashAlt } from '@iconscout/react-unicons';
import { UilEditAlt } from '@iconscout/react-unicons';
import { UilDownloadAlt } from '@iconscout/react-unicons'
import { UilSorting } from '@iconscout/react-unicons'

function ContactTable({ searchTerm }) {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [editedData, setEditedData] = useState({ name: '', contact: '', mail: '' });
  const [sortConfig, setSortConfig] = useState({ column: 'name', direction: 'asc' });

  useEffect(() => {
    fetch('https://contact-management-api.vercel.app/contacts')
      .then((response) => response.json())
      .then((data) => setContacts(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleDelete = (contactId) => {
    fetch(`https://contact-management-api.vercel.app/contacts/${contactId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status === 204) {
          setContacts((prevContacts) =>
            prevContacts.filter((contact) => contact.contact_id !== contactId)
          );
        } else {
          console.error('Failed to delete contact');
        }          
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error deleting contact:', error);
      });
  };

  const handleEdit = (contactId) => {
    const contactToEdit = contacts.find((contact) => contact.contact_id === contactId);
    setEditingContact(contactToEdit);
    setEditedData({
      name: contactToEdit.name,
      contact: contactToEdit.contact,
      mail: contactToEdit.mail,
    });
  };

  const handleSave = () => {
    fetch(`https://contact-management-api.vercel.app/contacts/${editingContact.contact_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedData),
    })
      .then((response) => {
        if (response.status === 200) {
          setEditingContact(null);
          window.location.reload();
        } else {
          console.error('Failed to update contact');
        }
      })
      .catch((error) => {
        console.error('Error updating contact:', error);
      });
  };

  const handleSort = (column) => {
    const direction = column === sortConfig.column && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ column, direction });
  };
  
  const sortedContacts = [...contacts].sort((a, b) => {
    const nameA = a[sortConfig.column].toLowerCase().trim();
    const nameB = b[sortConfig.column].toLowerCase().trim();
  
    if (sortConfig.direction === 'asc') {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });
  
  const filteredContacts = sortedContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Name,Mobile Number,Email\n" +
      contacts.map((contact) =>
        `"${contact.name}","${contact.contact}","${contact.mail}"`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contacts.csv");
    document.body.appendChild(link);

    link.click();
  };

  return (
    <div className="box-wrap table-wrap">
      <table>
        <thead>
          <tr>
            <th>Contact Name
              <UilSorting onClick={() => handleSort('name')} style={{ cursor: 'pointer', position: 'absolute' }}/>
            </th>
            <th>Mobile Number</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.map((contact) => (
            <tr key={contact._id}>
              <td>
                {editingContact === contact ? (
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                  />
                ) : (
                  contact.name
                )}
              </td>
              <td>
                {editingContact === contact ? (
                  <input
                    type="text"
                    value={editedData.contact}
                    onChange={(e) => setEditedData({ ...editedData, contact: e.target.value })}
                  />
                ) : (
                  contact.contact
                )}
              </td>
              <td>
                {editingContact === contact ? (
                  <input
                    type="text"
                    value={editedData.mail}
                    onChange={(e) => setEditedData({ ...editedData, mail: e.target.value })}
                  />
                ) : (
                  contact.mail
                )}
              </td>
              <td className="icons">
                {editingContact === contact ? (
                  <button onClick={handleSave}>Save</button>
                ) : (
                  <>
                    <UilTrashAlt
                      size="20"
                      onClick={() => handleDelete(contact.contact_id)}
                      style={{ cursor: 'pointer' }}
                    />
                    <UilEditAlt
                      size="20"
                      onClick={() => handleEdit(contact.contact_id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='csv'>
        <button className="download-button" onClick={() => downloadCSV(contacts)}>Download csv <UilDownloadAlt/></button>
      </div>
    </div>
  );
}

export default ContactTable;
