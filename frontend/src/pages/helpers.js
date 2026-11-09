export function initials(c) { return `${c.first_name?.[0]||''}${c.last_name?.[0]||c.first_name?.[1]||''}`.toUpperCase(); }
export function avatarClass(id) { return ['avatar-purple','avatar-orange','avatar-green','avatar-blue','avatar-rose'][Number(id)%5]; }
export function formatDate(value) { if (!value) return '—'; return new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric'}).format(new Date(value)); }
