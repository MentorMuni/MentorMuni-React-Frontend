/**
 * College vs Individual student helpers.
 * Flag comes from auth /me: organization_type === 'PUBLIC' or is_individual.
 */

export function isIndividualStudent(sessionOrUser) {
  if (!sessionOrUser) return false;
  if (sessionOrUser.is_individual === true || sessionOrUser.isIndividual === true) return true;
  const type = String(sessionOrUser.organization_type || '').toUpperCase();
  if (type === 'PUBLIC') return true;
  const code = String(sessionOrUser.organization_code || '').toUpperCase();
  return code === 'PUBLIC';
}

export function isCollegeStudent(sessionOrUser) {
  return !isIndividualStudent(sessionOrUser);
}

/** Label for campus chip / profile org line. */
export function studentCampusLabel(sessionOrUser) {
  if (isIndividualStudent(sessionOrUser)) {
    const college = String(sessionOrUser.college_name || '').trim();
    const course = String(sessionOrUser.course_or_branch || '').trim();
    if (college && course) return { primary: college, secondary: course };
    if (college) return { primary: college, secondary: 'Individual' };
    return { primary: 'Individual', secondary: course || null };
  }
  return {
    primary: sessionOrUser?.organization_name || '',
    secondary: sessionOrUser?.department_name || null,
  };
}
