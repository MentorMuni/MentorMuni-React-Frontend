import HelpCenterView from '../../components/help/HelpCenterView';
import { getOrgSession } from '../../orgPortal';
import { isDemoSession } from '../demoAuth';
import { orgHelpApi } from '../helpApi';

export default function HelpCenterPage() {
  const session = getOrgSession();
  const demo = isDemoSession(session);
  return (
    <HelpCenterView
      sourcePortal="organization"
      organizationName={session?.organization_name || session?.organization_code}
      api={orgHelpApi}
      hideTitle
      disabledReason={
        demo
          ? 'Help Center needs a live campus account. Demo Organization sessions stay on this device.'
          : ''
      }
    />
  );
}
