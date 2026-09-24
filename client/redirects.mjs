/**
 * Permanent (301) redirects for retired / legacy URLs.
 *
 * `source` paths are written without a trailing slash because Next.js
 * normalizes the incoming path before matching.
 *
 * @type {import('next').NextConfig['redirects']}
 */
const redirects = async () => [
  {
    source:
      "/government-vs-private-nursing-jobs-after-gnm-which-career-path-is-better",
    destination: "/nursing-training-in-kolkata",
    permanent: true,
  },
  {
    source:
      "/physiotherapy-in-neurological-rehabilitation-skills-you-learn-during-training",
    destination: "/physiotherapy-training-institute-in-kolkata",
    permanent: true,
  },
  {
    source:
      "/professional-laboratory-technology-training-in-kolkata-with-practical-exposure-in-clinical-labs-pathology-testing-and-diagnostic-procedures",
    destination: "/lab-technician-training-institute",
    permanent: true,
  },
  {
    source: "/build-your-future-in-healthcare-with-cms-ed-training-in-kol",
    destination: "/cmsed",
    permanent: true,
  },
  {
    source: "/tag/ecg-diploma-course",
    destination: "/ecg-technician-training-kolkata",
    permanent: true,
  },
  {
    source: "/tag/ecg-technician-training-institute-in-kolkata",
    destination: "/ecg-technician-training-kolkata",
    permanent: true,
  },
  {
    source: "/tag/best-cms-ed-course-in-kolkata",
    destination: "/cmsed",
    permanent: true,
  },
  {
    source: "/tag/best-teacher-training-institute-in-kolkata",
    destination: "/teachers-training-institute-kolkata",
    permanent: true,
  },
  {
    source: "/tag/career-opportunities-in-montessori-education/feed",
    destination: "/teachers-training-institute-kolkata",
    permanent: true,
  },
  {
    source: "/tag/operation-theatre-technologist",
    destination: "/ot-technician-training",
    permanent: true,
  },
  {
    source: "/tag/lab-technology-institute-in-kolkata",
    destination: "/lab-technician-training-institute",
    permanent: true,
  },
];

export default redirects;
