import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik } from 'formik'

export default function AddContact() {
    const [contacts, setContacts] = useState([])
    const navigate = useNavigate()
    const REGEX = {
        email: /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/,
        phone: /^\+?(\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
    }

    useEffect(() => {
        const fetchContacts = async () => {
            const response = await axios.get('http://localhost:3001/contacts')
            setContacts(response.data)
        }
        fetchContacts()
    }, [])

    const validate = (values) => {
        const errors = {}
        const found = contacts.find(contact => (contact.name === values.name)
            && (contact.email === values.email)
            && (contact.phone === values.phone)
        )

        if (!values.name) {
            errors.name = 'Name required!'
        }

        if (values.email && !REGEX.email.test(values.email)) {
            errors.email = 'Email invalid!'
        }

        if (values.phone && !REGEX.phone.test(values.phone)) {
            errors.phone = 'Phone number invalid!'
        }

        if (found) {
            alert('Contact already exists!')
        }

        return errors
    }

    const handleSubmit = async (values) => {
        try {
            await axios.post('http://localhost:3001/contacts', {
                name: values.name,
                email: values.email,
                phone: values.phone
            })

            alert('Add contact successfully!')
            navigate('/')
        } catch (error) {
            alert(error)
        }
    }

    return (
        <Formik
            initialValues={{
                name: '',
                email: '',
                phone: ''
            }}
            validate={validate}
            onSubmit={handleSubmit}
        >
            {({ values, errors, touched, handleChange, handleSubmit, handleBlur }) => (
                <div className='main'>
                    <form className='form' onSubmit={handleSubmit}>
                        <h1 className='heading'>Add contact</h1>
                        <div className={`form-group ${errors.name && touched.name ? 'invalid' : ''}`}>
                            <label className='form-label' htmlFor="name">Name</label>
                            <input
                                type="text"
                                id='name'
                                className='form-control'
                                name='name'
                                placeholder='Input name'
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />

                            {errors.name && touched.name && <span className='form-message'>{errors.name}</span>}
                        </div>

                        <div className={`form-group ${errors.email && touched.email ? 'invalid' : ''}`}>
                            <label className='form-label' htmlFor='email'>Email</label>
                            <input
                                type='email'
                                id='email'
                                className='form-control'
                                name='email'
                                placeholder='Input email'
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />

                            {errors.email && touched.email && <span className='form-message'>{errors.email}</span>}
                        </div>

                        <div className={`form-group ${errors.phone && touched.phone ? 'invalid' : ''}`}>
                            <label className='form-label' htmlFor='phone'>Phone number</label>
                            <input
                                type='phone'
                                id='phone'
                                className='form-control'
                                name='phone'
                                placeholder='Input phone number'
                                value={values.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />

                            {errors.phone && touched.phone && <span className="form-message">{errors.phone}</span>}
                        </div>

                        <button className='btn btn-form-submit' type='submit'>Add contact</button>
                    </form>
                </div>
            )}
        </Formik>
    )
}
