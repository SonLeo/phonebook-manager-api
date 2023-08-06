import axios from "axios";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditContact() {
    const REGEX = {
        email: /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/,
        phone: /^\+?(\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
    }
    const [contacts, setContacts] = useState([])
    const [contact, setContact] = useState({ name: '', email: '', phone: '' })
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        const fetchContacts = async () => {
            const response = await axios.get('http://localhost:3001/contacts')
            setContacts(response.data)
        }
        fetchContacts()
    }, [])

    useEffect(() => {
        axios
            .get(`http://localhost:3001/contacts/${id}`)
            .then(response => {
                setContact({
                    name: response.data.name,
                    email: response.data.email,
                    phone: response.data.phone
                })
                setLoading(false)
            })
    }, [id])

    const validate = values => {
        const errors = {}
        const found = contacts.find(contact => (contact.name === values.name)
            && (contact.email === values.email)
            && (contact.phone === values.phone)
        )

        if (!values.name) {
            errors.name = 'Name required'
        }

        if (values.email && !REGEX.email.test(values.email)) {
            errors.email = 'Email invalid'
        }

        if (values.phone && !REGEX.phone.test(values.phone)) {
            errors.phone = 'Phone number invalid'
        }

        if (found && (values.name !== contact.name) && (values.email !== contact.email) && (values.phone !== contact.phone)) {
            errors.name = 'Contact already exists!'
        }

        return errors
    }

    const handleSubmit = async (values) => {
        await axios.put(`http://localhost:3001/contacts/${id}`, {
            name: values.name,
            email: values.email,
            phone: values.phone
        })
        navigate('/')
    }

    return loading ? ('Loading...') : (
        <Formik
            initialValues={contact}
            validate={validate}
            onSubmit={handleSubmit}
        >
            {({ values, errors, touched, handleChange, handleSubmit, handleBlur }) => (
                <div className='main'>
                    <form className='form' onSubmit={handleSubmit}>
                        <h1 className='heading'>Edit Contact</h1>
                        <div className={`form-group ${errors.name && touched.name ? 'invalid' : ''}`}>
                            <label className='form-label' htmlFor='name'>New name</label>
                            <input
                                type='text'
                                className='form-control'
                                id='name'
                                name='name'
                                placeholder='Enter new name'
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />

                            {errors.name && touched.name && <span className='form-message'>{errors.name}</span>}
                        </div>

                        <div className={`form-group ${errors.email && touched.email ? 'invalid' : ''}`}>
                            <label htmlFor='email' className='form-label'>New email</label>
                            <input
                                type='email'
                                className='form-control'
                                id='email'
                                name='email'
                                placeholder='Enter new email'
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />

                            {errors.email && touched.email && <span className='form-message'>{errors.email}</span>}
                        </div>

                        <div className={`form-group ${errors.phone && touched.phone ? 'invalid' : ''}`}>
                            <label className='form-label' htmlFor='phone'>New phone</label>
                            <input
                                type='phone'
                                className='form-control'
                                id='phone'
                                name='phone'
                                placeholder='Enter new phone number'
                                value={values.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />

                            {errors.phone && touched.phone && <span className='form-message'>{errors.phone}</span>}
                        </div>

                        <button className='btn btn-form-submit' type='submit'>Save</button>
                    </form>
                </div>
            )}
        </Formik>
    )
}
