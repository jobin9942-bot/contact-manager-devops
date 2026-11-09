import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, CalendarDays, Mail, MapPin, Pencil, Phone, Trash2, BriefcaseBusiness } from 'lucide-react';
import ContactForm from '../components/ContactForm.jsx';
import { api } from '../services/api.js';
import { avatarClass, formatDate, initials } from './helpers.js';

export function NewContact() {
  const navigate=useNavigate(),[busy,setBusy]=useState(false),[error,setError]=useState('');
  async function save(data){setBusy(true);setError('');try{const c=await api.create(data);navigate(`/contacts/${c.id}`,{state:{notice:'Contact added successfully.'}});}catch(e){setError(e.message);}finally{setBusy(false);}}
  return <><div className="list-intro"><div><span className="eyebrow">NEW CONNECTION</span><h2>Make an introduction.</h2><p>Add someone to your contacts.</p></div></div><section className="panel form-panel"><ContactForm onSave={save} busy={busy} error={error}/></section></>;
}
export function EditContact() {
  const {id}=useParams(),navigate=useNavigate();const [contact,setContact]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  useEffect(()=>{api.contact(id).then(setContact).catch(e=>setError(e.message));},[id]);
  async function save(data){setBusy(true);setError('');try{await api.update(id,data);navigate(`/contacts/${id}`,{state:{notice:'Changes saved successfully.'}});}catch(e){setError(e.message);}finally{setBusy(false);}}
  return <><div className="list-intro"><div><span className="eyebrow">UPDATE DETAILS</span><h2>Edit contact.</h2><p>Keep this connection up to date.</p></div></div><section className="panel form-panel">{error&&!contact?<div className="error-state"><h3>{error}</h3><Link to="/contacts">Back to contacts</Link></div>:contact?<ContactForm key={contact.id} initial={contact} onSave={save} busy={busy} error={error}/>:<div className="loading-box">Loading contact…</div>}</section></>;
}
export function ContactDetails() {
  const {id}=useParams(),navigate=useNavigate(),location=useLocation();const [contact,setContact]=useState(null),[error,setError]=useState(''),[notice,setNotice]=useState(location.state?.notice||'');
  useEffect(()=>{api.contact(id).then(setContact).catch(e=>setError(e.message));},[id]);
  async function remove(){if(!window.confirm(`Delete ${contact.first_name} ${contact.last_name||''}? This action cannot be undone.`))return;try{await api.remove(id);navigate('/contacts',{state:{notice:'Contact deleted.'}});}catch(e){setError(e.message);}}
  if(error&&!contact)return <div className="error-state"><Link to="/contacts" className="back-link"><ArrowLeft size={16}/> Back to contacts</Link><h2>{error}</h2></div>;
  if(!contact)return <div className="loading-box">Loading contact…</div>;
  return <><Link to="/contacts" className="back-link detail-back"><ArrowLeft size={16}/> Back to contacts</Link>{notice&&<div className="alert alert-success">{notice}<button onClick={()=>setNotice('')}>Dismiss</button></div>}{error&&<div className="alert alert-error">{error}</div>}
    <section className="panel detail-panel"><div className="detail-hero"><span className={`avatar avatar-large ${avatarClass(contact.id)}`}>{initials(contact)}</span><div className="detail-identity"><span className="eyebrow">CONTACT PROFILE</span><h2>{contact.first_name} {contact.last_name||''}</h2><p>{contact.job_title||'Contact'}{contact.company?` · ${contact.company}`:''}</p></div><div className="detail-actions"><Link className="button button-quiet" to={`/contacts/${id}/edit`}><Pencil size={16}/> Edit</Link><button className="button button-danger" onClick={remove}><Trash2 size={16}/> Delete</button></div></div>
      <div className="detail-grid"><article><span className="detail-icon"><Mail size={17}/></span><div><small>EMAIL ADDRESS</small>{contact.email?<a href={`mailto:${contact.email}`}>{contact.email}</a>:<p className="muted">Not provided</p>}</div></article><article><span className="detail-icon"><Phone size={17}/></span><div><small>PHONE NUMBER</small>{contact.phone?<a href={`tel:${contact.phone}`}>{contact.phone}</a>:<p className="muted">Not provided</p>}</div></article><article><span className="detail-icon"><Building2 size={17}/></span><div><small>COMPANY</small><p>{contact.company||'Not provided'}</p></div></article><article><span className="detail-icon"><BriefcaseBusiness size={17}/></span><div><small>JOB TITLE</small><p>{contact.job_title||'Not provided'}</p></div></article><article><span className="detail-icon"><MapPin size={17}/></span><div><small>ADDRESS</small><p>{contact.address||'Not provided'}</p></div></article><article><span className="detail-icon"><CalendarDays size={17}/></span><div><small>DATE ADDED</small><p>{formatDate(contact.created_at)}</p></div></article></div>
      {contact.notes&&<div className="notes-block"><span className="eyebrow">NOTES</span><p>{contact.notes}</p></div>}
    </section></>;
}
export function NotFound(){return <div className="not-found"><div>404</div><h2>This page has wandered off.</h2><p>Let’s get you back to your contacts.</p><Link className="button button-primary" to="/">Go to overview</Link></div>;}
