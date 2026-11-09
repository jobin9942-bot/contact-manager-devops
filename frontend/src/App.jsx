import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Contacts from './pages/Contacts.jsx';
import { ContactDetails, EditContact, NewContact, NotFound } from './pages/ContactPages.jsx';
import './styles.css';

export default function App(){return <BrowserRouter><Routes><Route element={<Layout/>}><Route index element={<Dashboard/>}/><Route path="contacts" element={<Contacts/>}/><Route path="contacts/new" element={<NewContact/>}/><Route path="contacts/:id" element={<ContactDetails/>}/><Route path="contacts/:id/edit" element={<EditContact/>}/><Route path="*" element={<NotFound/>}/></Route></Routes></BrowserRouter>;}
