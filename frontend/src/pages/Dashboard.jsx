import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, Phone, Plus, UsersRound, ArrowRight, BriefcaseBusiness, MoreHorizontal } from 'lucide-react';
import { api } from '../services/api.js';
import { formatDate, initials, avatarClass } from './helpers.js';
const cards = [
  ['total','Total contacts','All the people you know',UsersRound,'violet'],
  ['recentCount','Added recently','Last 30 days',ArrowUpRight,'mint'],
  ['withEmail','With email','Ready to reach out',Mail,'peach'],
  ['withPhone','With phone','Always within reach',Phone,'blue'],
];
export default function Dashboard() {
  const [stats,setStats]=useState(null),[error,setError]=useState('');
  useEffect(()=>{api.stats().then(setStats).catch(e=>setError(e.message));},[]);
  return <>
    <div className="welcome-row"><div><span className="eyebrow">{new Intl.DateTimeFormat(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'}).format(new Date()).toUpperCase()}</span><h2>A little hello goes a long way.</h2><p>Here’s what’s happening with your contacts.</p></div><Link className="button button-primary" to="/contacts/new"><Plus size={17}/> Add a contact</Link></div>
    {error&&<div className="alert alert-error">{error} <button onClick={()=>{setError('');api.stats().then(setStats).catch(e=>setError(e.message));}}>Try again</button></div>}
    <div className="stat-grid">{cards.map(([key,title,caption,Icon,color])=><section className="stat-card" key={key}><div className="stat-top"><span className={`stat-icon ${color}`}><Icon size={18}/></span><button aria-label={`${title} options`} className="more-btn"><MoreHorizontal size={19}/></button></div><span className="stat-caption">{caption}</span><div className="stat-value">{stats ? (stats[key]??0).toLocaleString() : <span className="skeleton skeleton-number"/>}</div><div className="stat-bottom"><strong>{title}</strong><span>↗</span></div></section>)}</div>
    <section className="panel recent-panel"><div className="panel-head"><div><span className="eyebrow">YOUR NETWORK</span><h3>Recently added</h3><p>A few of your newest connections.</p></div><Link to="/contacts" className="text-link">View all contacts <ArrowRight size={15}/></Link></div>
      {!stats&&!error?<div className="loading-box">Loading your contacts…</div>:stats?.recentContacts?.length?<div className="table-wrap"><table><thead><tr><th>NAME</th><th>EMAIL</th><th>COMPANY</th><th>ADDED</th><th/></tr></thead><tbody>{stats.recentContacts.map(c=><tr key={c.id}><td><Link className="person-cell" to={`/contacts/${c.id}`}><span className={`avatar ${avatarClass(c.id)}`}>{initials(c)}</span><span><b>{c.first_name} {c.last_name||''}</b><small>{c.job_title||'Contact'}</small></span></Link></td><td>{c.email||<span className="muted">—</span>}</td><td>{c.company||<span className="muted">—</span>}</td><td>{formatDate(c.created_at)}</td><td><Link className="row-open" to={`/contacts/${c.id}`} aria-label={`View ${c.first_name}`}><ArrowUpRight size={16}/></Link></td></tr>)}</tbody></table></div>:<div className="empty-state"><div className="empty-illustration"><UsersRound size={26}/></div><h3>Your people are waiting</h3><p>Add your first contact and start building your network.</p><Link className="button button-primary" to="/contacts/new"><Plus size={16}/> Add your first contact</Link></div>}
    </section><div className="bottom-note"><BriefcaseBusiness size={14}/> A thoughtful follow-up can make someone’s day.</div>
  </>;
}
