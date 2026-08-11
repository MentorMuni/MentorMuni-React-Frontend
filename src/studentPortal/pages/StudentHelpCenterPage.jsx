import HelpCenterView from '../../components/help/HelpCenterView';
import { getStudentSession } from '../auth';
import { studentApi } from '../studentApi';
import { studentHelpApi } from '../helpApi';

export default function StudentHelpCenterPage() {
  const session = getStudentSession();
  const demo = studentApi.isDemoOrLocalToken();
  return (
    <main className="stu-main">
      <HelpCenterView
        sourcePortal="student"
        organizationName={session?.organization_name || session?.organization_code}
        api={studentHelpApi}
        disabledReason={
          demo
            ? 'Help Center needs a real campus student account so MentorMuni can see the college. Demo sessions stay local.'
            : ''
        }
      />
    </main>
  );
}
