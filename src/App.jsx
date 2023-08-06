import {BrowserRouter, Routes, Route } from 'react-router-dom'
import ContactList from './pages/ContactList'
import AddContact from './pages/AddContact'
import EditContact from './pages/EditContact'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ContactList />} />
        <Route path='/add' element={<AddContact />} />
        <Route path='/edit/:id' element={<EditContact />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
