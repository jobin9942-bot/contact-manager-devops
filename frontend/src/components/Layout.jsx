import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, UsersRound, Plus, Search, Bell, ChevronDown, ContactRound } from 'lucide-react';
const titles = { '/': 'Overview', '/contacts': 'All contacts', '/contacts/new': 'Add contact' };
export default function Layout() {
  const { pathname } = useLocation();
  const title = pathname.startsWith('/contacts/') && pathname !== '/contacts/new' ? (pathname.endsWith('/edit') ? 'Edit contact' : 'Contact details') : titles[pathname] || 'Contacts';
  return <div className="shell">
    <aside className="sidebar"><Link to="/" className="brand"><span className="brand-mark"><ContactRound size={19}/></span><span>northstar<span className="brand-sub">CONTACTS</span></span></Link>
      <div className="nav-label">WORKSPACE</div><nav><NavLink end to="/"><LayoutDashboard size={18}/> Overview</NavLink><NavLink to="/contacts"><UsersRound size={18}/> All contacts<span className="nav-dot"/></NavLink></nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon">✦</div><strong>Keep in touch</strong><p>Your people, all in one place.</p><Link to="/contacts/new">Add someone <span>→</span></Link></div><div className="profile"><div className="avatar avatar-purple">JD</div><div><b>Jordan Davis</b><small>Workspace owner</small></div><ChevronDown size={16}/></div></div>
    </aside>
    <main className="main"><header className="topbar"><div><div className="breadcrumb">Workspace <span>/</span> <b>{title}</b></div><h1>{title}</h1></div><div className="top-actions"><Link className="icon-btn search-shortcut" to="/contacts" aria-label="Search contacts"><Search size={18}/></Link><button className="icon-btn" aria-label="Notifications"><Bell size={18}/><i/></button><Link className="button button-primary top-add" to="/contacts/new"><Plus size={17}/> Add contact</Link></div></header><div className="content"><Outlet/></div></main>
  </div>;
}
