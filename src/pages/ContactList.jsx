import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'


export default function ContactList() {
    const [contacts, setContacts] = useState([])

    useEffect(() => {
        getContacts()
    }, [])

    const getContacts = async() => {
        const response = await axios.get('http://localhost:3001/contacts')
        setContacts(response.data)
    }

    const deleteContact = async(id) => {
        await axios.delete(`http://localhost:3001/contacts/${id}`)
        getContacts()
    }

    return (
        <div className='main'>
            <div className='content'>
                <div className='header'>
                    <h1 className='heading'>Contacts</h1>
                    <button className='btn btn--add'><Link to='/add'>Add contact</Link></button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map(contact => (
                            <tr key={contact.id}>
                                <td className='contact-info'>
                                    <span className='contact-avatar'><img src={contact.image} alt='' /></span>
                                    <span className='contact-name'>{contact.name}</span>
                                </td>
                                <td>{contact.email}</td>
                                <td>{contact.phone}</td>
                                <td>
                                    <Link to={`/edit/${contact.id}`}><button className='btn btn--edit'>Edit</button></Link>
                                    <button className='btn btn--delete' onClick={() => deleteContact(contact.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}