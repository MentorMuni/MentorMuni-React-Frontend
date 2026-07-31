import { Navigate, useSearchParams } from 'react-router-dom';
import { studentPaths } from '../paths';

/**
 * Legacy HOD share links used /register.
 * Canonical self-serve path is /enroll (public departments API, no password).
 */
export default function StudentRegisterPage() {
  const [params] = useSearchParams();
  const qs = params.toString();
  return (
    <Navigate
      to={qs ? `${studentPaths.enroll}?${qs}` : studentPaths.enroll}
      replace
    />
  );
}
