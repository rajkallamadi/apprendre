/* ============================================================
   courses.js — homepage ongoing-courses preview only
   (All courses-page logic lives inline in courses.html)
   ============================================================ */

/* ── Staggered animation for dynamically added cards ── */
function animateNewCards(grid) {
  grid.querySelectorAll('.course-card').forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity .4s ease ${i * 0.07}s, transform .4s ease ${i * 0.07}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }));
  });
}

/* ── Date formatter ── */
function formatMonthYear(ym) {
  if (!ym) return null;
  const [year, month] = ym.split('-');
  const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${names[parseInt(month, 10) - 1]} ${year}`;
}

/* ── Build a single ongoing-preview card ── */
function buildOngoingCard(course) {
  const start     = formatMonthYear(course.startDate);
  const end       = formatMonthYear(course.endDate);
  const dateRange = (start && end) ? `${start} – ${end}` : (start || 'Ongoing');
  return `
    <div class="course-card ongoing-preview-card">
      <div class="course-card-body">
        <h3>${course.title}</h3>
        <p>📅 ${dateRange}</p>
      </div>
      <div class="course-card-footer">
        <a href="contact.html" class="btn btn-primary"
           style="padding:.55rem 1.25rem;font-size:.82rem">Express Interest</a>
      </div>
    </div>`;
}

/* ── Load first 4 ongoing-batch courses into homepage preview ── */
async function loadOngoingCoursesPreview() {
  const grid = document.getElementById('ongoingCoursesPreview');
  if (!grid) return;

  try {
    const res = await fetch('data/courses.json');
    if (!res.ok) throw new Error('Failed to load courses');
    const data    = await res.json();
    const ongoing = data.courses.filter(c => c.type === 'ongoing-batch').slice(0, 4);

    if (ongoing.length === 0) {
      grid.innerHTML = '<p style="color:var(--text-mid);grid-column:1/-1;text-align:center;padding:3rem 0">No ongoing courses at this time. Please check back soon.</p>';
      return;
    }

    grid.innerHTML = ongoing.map(buildOngoingCard).join('');
    animateNewCards(grid);
  } catch (err) {
    console.error(err);
    grid.innerHTML = '<p style="color:var(--text-mid);grid-column:1/-1;text-align:center;padding:3rem 0">Unable to load courses. Please try again later.</p>';
  }
}

if (document.getElementById('ongoingCoursesPreview')) {
  loadOngoingCoursesPreview();
}
