import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactManager = () => {
  const [contacts, setContacts] = useState([]);
  const [deletedContacts, setDeletedContacts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [statusMap, setStatusMap] = useState({});

  const fetchContacts = async () => {
    const response = await axios.get('https://dummyjson.com/users');
    const updatedContacts = response.data.users.map(user => ({
      ...user,
      email: user.email.replace('x.dummyjson.com', 'email.com')
    }));
    setContacts(updatedContacts);
  };

  const handleAddOrUpdate = async () => {
    if (editingId) {
      const updatedContact = { firstName: name, email };
      setContacts(contacts.map(contact => contact.id === editingId ? { ...contact, ...updatedContact } : contact));
      setStatusMap({ ...statusMap, [editingId]: 'updated' });
    } else {
      const newContact = { id: Date.now(), firstName: name, email };
      setContacts([...contacts, newContact]);
      setStatusMap({ ...statusMap, [newContact.id]: 'new' });
    }
    setName('');
    setEmail('');
    setEditingId(null);
  };

  const handleEdit = (contact) => {
    setName(contact.firstName);
    setEmail(contact.email);
    setEditingId(contact.id);
    setStatusMap({ ...statusMap, [contact.id]: 'edited' });
  };

  const handleDelete = (id) => {
    const contactToDelete = contacts.find(contact => contact.id === id);
    setDeletedContacts([...deletedContacts, contactToDelete]);
    setContacts(contacts.filter(contact => contact.id !== id));
    const newStatusMap = { ...statusMap };
    delete newStatusMap[id];
    setStatusMap(newStatusMap);
  };

  const handleRestore = (id) => {
    const contactToRestore = deletedContacts.find(contact => contact.id === id);
    setContacts([...contacts, contactToRestore]);
    setDeletedContacts(deletedContacts.filter(contact => contact.id !== id));
  };

  const handlePermanentDelete = (id) => {
    setDeletedContacts(deletedContacts.filter(contact => contact.id !== id));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const getBackgroundColor = (id) => {
    switch (statusMap[id]) {
      case 'new': return 'lightgreen';
      case 'updated': return 'lightblue';
      case 'edited': return 'lightyellow';
      default: return 'white';
    }
  };

  const buttonStyle = {
    padding: '8px 12px',
    cursor: 'pointer',
    margin: '5px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    width: 'auto',
  };

  const containerStyle = {
    width: '92.5vw',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  };

  const inputStyle = {
    flex: 1,
    padding: '10px',
    marginBottom: '10px',
    width: '100%',
    boxSizing: 'border-box',
  };

  const listItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    borderBottom: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle}>
      <h1>Contact Manager</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', width: '100%' }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleAddOrUpdate} style={buttonStyle}>
          {editingId ? 'Update' : 'Add'} Contact
        </button>
      </div>

      {showRecycleBin ? (
        deletedContacts.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: '0', width: '100%' }}>
            {deletedContacts.map((contact) => (
              <li key={contact.id} style={listItemStyle}>
                <span>{contact.firstName} ({contact.email})</span>
                <div>
                  <button onClick={() => handleRestore(contact.id)} style={buttonStyle}>Restore</button>
                  <button onClick={() => handlePermanentDelete(contact.id)} style={{ ...buttonStyle, backgroundColor: 'red' }}>Permanently Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your bin is empty.</p>
        )
      ) : (
        <ul style={{ listStyleType: 'none', padding: '0', width: '100%' }}>
          {contacts.map((contact) => (
            <li key={contact.id} style={{ ...listItemStyle, backgroundColor: getBackgroundColor(contact.id) }}>
              <span>{contact.firstName} ({contact.email})</span>
              <div>
                <button onClick={() => handleEdit(contact)} style={buttonStyle}>Edit</button>
                <button onClick={() => handleDelete(contact.id)} style={{ ...buttonStyle, backgroundColor: 'orange' }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setShowRecycleBin(!showRecycleBin)} style={buttonStyle}>
          {showRecycleBin ? 'Back to Contacts' : 'Open Recycle Bin'}
        </button>
      </div>
    </div>
  );
};

export default ContactManager;
