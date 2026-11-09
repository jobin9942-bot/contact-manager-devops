import { useState } from 'react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const fields = [
  ['first_name','First name','text',true],['last_name','Last name','text'],['email','Email address','email'],['phone','Phone number','tel'],['company','Company','text'],['job_title','Job title','text'],['address','Address','text'],['notes','Notes','textarea']
];
export default function ContactForm({ initial = {}, onSave, busy = false, error }) {
  const [form,setForm] = useState(() => Object.fromEntries(fields.map(([key]) => [key, initial[key] || ''])));
  const [validation,setValidation] = useState('');
  async function submit(event) {
    event.preventDefault(); setValidation('');
    const data = Object.fromEntries(Object.entries(form).map(([k,v])=>[k,v.trim()]));
    if (!data.first_name) return setValidation('First name is required.');
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return setValidation('Enter a valid email address.');
    if (data.phone && (data.phone.length < 7 || !/^[+\d(][\d\s().-]*$/.test(data.phone))) return setValidation('Enter a valid phone number.');
    await onSave(data);
  }
  return <form className="contact-form" onSubmit={submit}>
    <Link to="/contacts" className="back-link"><ArrowLeft size={16}/> Back to contacts</Link>
    <div className="form-heading"><div><span className="eyebrow">CONTACT INFORMATION</span><h2>Let’s get the details</h2><p>Fields marked with <b>*</b> are required.</p></div><div className="form-step">01 <span>/</span> 01</div></div>
    {(validation || error) && <div className="alert alert-error" role="alert">{validation || error}</div>}
    <div className="form-grid">{fields.map(([key,label,type,required])=><label className={`field ${type==='textarea'?'field-wide':''}`} key={key}>{label}{required && <em> *</em>}{type==='textarea'?<textarea rows="4" placeholder="A few helpful details…" value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>:<input type={type} placeholder={key==='first_name'?'e.g. Alex':key==='email'?'alex@company.com':key==='phone'?'+1 (555) 000-0000':`Enter ${label.toLowerCase()}`} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} required={required} maxLength={key==='email'?254:key==='phone'?40:150}/>}</label>)}</div>
    <div className="form-footer"><span><i/> Your contact details are private to this workspace.</span><div><Link className="button button-quiet" to="/contacts">Cancel</Link><button className="button button-primary" disabled={busy}>{busy&&<LoaderCircle className="spin" size={16}/>} {busy?'Saving…':'Save contact'}</button></div></div>
  </form>;
}
