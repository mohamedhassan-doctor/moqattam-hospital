// ============================================================
// مستشفى المقطم التخصصي - نظام الحجز الإلكتروني
// ============================================================

const INITIAL_CLINICS = [
  { id: 'c1', name: 'عيادة القلب والأوعية الدموية', description: 'تشخيص وعلاج شامل لأمراض القلب والشرايين باستخدام أحدث الأجهزة الطبية', price: 300, icon: '🫀', color: '#e74c3c', active: true },
  { id: 'c2', name: 'عيادة العظام والمفاصل', description: 'علاج إصابات وأمراض العظام والمفاصل والعمود الفقري', price: 250, icon: '🦴', color: '#3498db', active: true },
  { id: 'c3', name: 'عيادة الأطفال', description: 'رعاية صحية متكاملة للأطفال منذ الولادة حتى سن المراهقة', price: 200, icon: '👶', color: '#2ecc71', active: true },
  { id: 'c4', name: 'عيادة النساء والتوليد', description: 'متابعة الحمل والولادة وصحة المرأة بأعلى معايير الرعاية', price: 350, icon: '🤱', color: '#9b59b6', active: true },
  { id: 'c5', name: 'عيادة الجلدية والتجميل', description: 'علاج الأمراض الجلدية وخدمات التجميل الطبية المتخصصة', price: 280, icon: '✨', color: '#f39c12', active: true },
  { id: 'c6', name: 'عيادة الباطنة والجهاز الهضمي', description: 'تشخيص وعلاج أمراض الباطنة والجهاز الهضمي', price: 220, icon: '🩺', color: '#1abc9c', active: true }
];

const INITIAL_DOCTORS = [
  { id: 'd1', clinicId: 'c1', name: 'د. أحمد محمود السيد', title: 'استشاري أمراض القلب', experience: '15 سنة خبرة', active: true },
  { id: 'd2', clinicId: 'c1', name: 'د. محمد عبد الله كريم', title: 'أخصائي قلب وأوعية دموية', experience: '10 سنوات خبرة', active: true },
  { id: 'd3', clinicId: 'c2', name: 'د. خالد إبراهيم حسن', title: 'استشاري جراحة العظام', experience: '20 سنة خبرة', active: true },
  { id: 'd4', clinicId: 'c2', name: 'د. عمر فاروق عثمان', title: 'أخصائي العظام والمفاصل', experience: '12 سنة خبرة', active: true },
  { id: 'd5', clinicId: 'c3', name: 'د. سمر محمد علي', title: 'استشارية طب الأطفال', experience: '18 سنة خبرة', active: true },
  { id: 'd6', clinicId: 'c3', name: 'د. هنا أحمد رضا', title: 'أخصائية طب الأطفال', experience: '8 سنوات خبرة', active: true },
  { id: 'd7', clinicId: 'c4', name: 'د. نهال عبد الرحمن', title: 'استشارية نساء وتوليد', experience: '22 سنة خبرة', active: true },
  { id: 'd8', clinicId: 'c4', name: 'د. ريم مصطفى جمال', title: 'أخصائية نساء وتوليد', experience: '9 سنوات خبرة', active: true },
  { id: 'd9', clinicId: 'c5', name: 'د. ياسمين حسام الدين', title: 'استشارية الجلدية والتجميل', experience: '14 سنة خبرة', active: true },
  { id: 'd10', clinicId: 'c5', name: 'د. كريم سامي نصر', title: 'أخصائي الجلدية', experience: '7 سنوات خبرة', active: true },
  { id: 'd11', clinicId: 'c6', name: 'د. طارق عبد الحميد', title: 'استشاري الباطنة والجهاز الهضمي', experience: '17 سنة خبرة', active: true },
  { id: 'd12', clinicId: 'c6', name: 'د. منى صلاح عبد الله', title: 'أخصائية الباطنة', experience: '11 سنة خبرة', active: true }
];


function generateInitialSlots() {
  const slots = [];
  const morningTimes = ['09:00 ص', '10:00 ص', '11:00 ص', '12:00 م'];
  const eveningTimes = ['04:00 م', '05:00 م', '06:00 م', '07:00 م'];
  const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  let slotId = 1;
  const today = new Date();
  INITIAL_DOCTORS.forEach((doctor, dIdx) => {
    for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);
      if (date.getDay() === 5) continue;
      const dateStr = date.toISOString().split('T')[0];
      const dayName = dayNames[date.getDay()];
      const allTimes = dIdx % 2 === 0 ? morningTimes : eveningTimes;
      allTimes.forEach((time, tIdx) => {
        if ((dIdx + tIdx + dayOffset) % 3 !== 0) {
          slots.push({ id: 's' + slotId++, doctorId: doctor.id, clinicId: doctor.clinicId, date: dateStr, dayName, time, maxPatients: 5, bookedCount: 0, active: true });
        }
      });
    }
  });
  return slots;
}

// ---- Storage Keys ----
const KEYS = {
  CLINICS:     'mq_clinics',
  DOCTORS:     'mq_doctors',
  SLOTS:       'mq_slots',
  BOOKINGS:    'mq_bookings',
  INITIALIZED: 'mq_initialized'
};

// ---- Init ----
function initData() {
  if (!localStorage.getItem(KEYS.INITIALIZED)) {
    localStorage.setItem(KEYS.CLINICS,   JSON.stringify(INITIAL_CLINICS));
    localStorage.setItem(KEYS.DOCTORS,   JSON.stringify(INITIAL_DOCTORS));
    localStorage.setItem(KEYS.SLOTS,     JSON.stringify(generateInitialSlots()));
    localStorage.setItem(KEYS.BOOKINGS,  JSON.stringify([]));
    localStorage.setItem(KEYS.INITIALIZED, 'true');
  }
}

// ---- Generic helpers ----
function getItems(key) { return JSON.parse(localStorage.getItem(key) || '[]'); }
function setItems(key, items) { localStorage.setItem(key, JSON.stringify(items)); }

// ---- Clinics ----
function getClinics()      { return getItems(KEYS.CLINICS); }
function getClinic(id)     { return getClinics().find(c => c.id === id); }
function saveClinics(c)    { setItems(KEYS.CLINICS, c); }
function addClinic(clinic) { const all = getClinics(); clinic.id = 'c' + Date.now(); clinic.active = true; all.push(clinic); saveClinics(all); return clinic; }
function updateClinic(id, data) { saveClinics(getClinics().map(c => c.id === id ? { ...c, ...data } : c)); }
function deleteClinic(id)  { saveClinics(getClinics().filter(c => c.id !== id)); saveDoctors(getDoctors().filter(d => d.clinicId !== id)); saveSlots(getSlots().filter(s => s.clinicId !== id)); }

// ---- Doctors ----
function getDoctors()              { return getItems(KEYS.DOCTORS); }
function getDoctor(id)             { return getDoctors().find(d => d.id === id); }
function getDoctorsByClinic(cid)   { return getDoctors().filter(d => d.clinicId === cid && d.active); }
function saveDoctors(d)            { setItems(KEYS.DOCTORS, d); }
function addDoctor(doctor)         { const all = getDoctors(); doctor.id = 'd' + Date.now(); doctor.active = true; all.push(doctor); saveDoctors(all); return doctor; }
function updateDoctor(id, data)    { saveDoctors(getDoctors().map(d => d.id === id ? { ...d, ...data } : d)); }
function deleteDoctor(id)          { saveDoctors(getDoctors().filter(d => d.id !== id)); saveSlots(getSlots().filter(s => s.doctorId !== id)); }

// ---- Slots ----
function getSlots()                { return getItems(KEYS.SLOTS); }
function getSlot(id)               { return getSlots().find(s => s.id === id); }
function getAvailableSlots(doctorId) {
  const today = new Date().toISOString().split('T')[0];
  return getSlots().filter(s => s.doctorId === doctorId && s.active && s.date >= today && s.bookedCount < s.maxPatients);
}
function saveSlots(s)              { setItems(KEYS.SLOTS, s); }
function addSlot(slot)             { const all = getSlots(); slot.id = 's' + Date.now(); slot.bookedCount = 0; slot.active = true; all.push(slot); saveSlots(all); return slot; }
function updateSlot(id, data)      { saveSlots(getSlots().map(s => s.id === id ? { ...s, ...data } : s)); }
function deleteSlot(id)            { saveSlots(getSlots().filter(s => s.id !== id)); }

// ---- Bookings ----
function getBookings()    { return getItems(KEYS.BOOKINGS); }
function getBooking(id)   { return getBookings().find(b => b.id === id); }
function saveBookings(b)  { setItems(KEYS.BOOKINGS, b); }
function addBooking(booking) {
  const all = getBookings();
  booking.id        = generateBookingNumber();
  booking.createdAt = new Date().toISOString();
  booking.status    = 'pending';
  all.push(booking);
  saveBookings(all);
  const slots = getSlots();
  const idx = slots.findIndex(s => s.id === booking.slotId);
  if (idx > -1) { slots[idx].bookedCount = (slots[idx].bookedCount || 0) + 1; saveSlots(slots); }
  return booking;
}
function updateBooking(id, data) { saveBookings(getBookings().map(b => b.id === id ? { ...b, ...data } : b)); }

// ---- Admin Auth ----
function isAdminLoggedIn() { return sessionStorage.getItem('mq_admin_session') === 'true'; }
function adminLogin(u, p)  { if (u === 'admin' && p === 'admin123') { sessionStorage.setItem('mq_admin_session', 'true'); return true; } return false; }
function adminLogout()     { sessionStorage.removeItem('mq_admin_session'); }

// ---- Utilities ----
function generateBookingNumber() { return 'MQ' + Date.now().toString().slice(-7); }

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function getStatusBadge(status) {
  return { pending: { label: 'قيد الانتظار', cls: 'badge-warning' }, confirmed: { label: 'مؤكد', cls: 'badge-success' }, cancelled: { label: 'ملغي', cls: 'badge-danger' }, completed: { label: 'مكتمل', cls: 'badge-secondary' } }[status] || { label: status, cls: 'badge-secondary' };
}

function getParam(name) { return new URLSearchParams(window.location.search).get(name); }

function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
}

initData();
