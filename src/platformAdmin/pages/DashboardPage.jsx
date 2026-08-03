import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  UserCheck,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Rocket,
} from 'lucide-react';
import { getDashboardMetrics, statusLabel, isActiveStatus } from '../store';
import { platformAdminPaths } from '../paths';

const EASE = [0.22, 1, 0.36, 1];

function formatNumber(n) {
  return new Intl.NumberFormat('en-IN').format(n);
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    organizations: 0,
    studentsPurchased: 0,
    studentsRegistered: 0,
    activePlans: 0,
    expiringThisMonth: 0,
    featureUsage: [],
    recentOrgs: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refresh = async () => {
      try {
        setLoading(true);
        const result = await getDashboardMetrics();
        setMetrics(result);
        setError('');
      } catch (e) {
        setError(e.message || 'Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    refresh();
    window.addEventListener('mm-platform-db-updated', refresh);
    return () => window.removeEventListener('mm-platform-db-updated', refresh);
  }, []);

  useEffect(() => {
    if (!error) return undefined;
    const timer = window.setTimeout(() => setError(''), 3500);
    return () => window.clearTimeout(timer);
  }, [error]);

  const cards = [
    { label: 'Organizations', value: metrics.organizations, icon: Building2 },
    { label: 'Students Purchased', value: metrics.studentsPurchased, icon: Users },
    { label: 'Students Registered', value: metrics.studentsRegistered, icon: UserCheck },
    { label: 'Active Plans', value: metrics.activePlans, icon: CreditCard },
    { label: 'Expiring This Month', value: metrics.expiringThisMonth, icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      {error && <div className="mm-pa-inline-toast mm-pa-inline-toast--error">{error}</div>}
      <div className="mm-pa-hero-strip">
        <motion.div
          className="mm-pa-hero-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <span className="mm-pa-pill">
            <Sparkles size={12} /> Control plane
          </span>
          <h2>
            Spin up campuses.
            <span className="block text-sky-300">Hand off in minutes.</span>
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-slate-300">
            Create organization → assign subscription → enable features → invite Org Admin.
            MentorMuni Platform stops where the Organization Portal begins.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to={platformAdminPaths.organizations} className="mm-pa-btn mm-pa-btn--primary">
              <Rocket size={15} /> Create Organization
            </Link>
            <Link to={platformAdminPaths.subscriptions} className="mm-pa-btn mm-pa-btn--ghost">
              View subscriptions
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="mm-pa-panel flex flex-col justify-between"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.5, ease: EASE }}
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-300">
              This month pulse
            </p>
            <p className="mt-3 text-4xl font-black tracking-tight text-white">
              {loading ? '...' : metrics.expiringThisMonth}
              <span className="ml-2 text-base font-bold text-slate-400">plans expiring</span>
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {loading ? 'Loading utilization...' : `${formatNumber(metrics.studentsRegistered)} of ${formatNumber(metrics.studentsPurchased)} purchased seats filled.`}
            </p>
          </div>
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs text-slate-400">
              <span>Seat utilization</span>
              <span>
                {metrics.studentsPurchased
                  ? Math.round((metrics.studentsRegistered / metrics.studentsPurchased) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="mm-pa-progress">
              <motion.div
                className="mm-pa-progress__bar"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    metrics.studentsPurchased
                      ? Math.min(
                          100,
                          Math.round((metrics.studentsRegistered / metrics.studentsPurchased) * 100)
                        )
                      : 0
                  }%`,
                }}
                transition={{ duration: 0.9, ease: EASE }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              className="mm-pa-stat"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.4, ease: EASE }}
              whileHover={{ y: -4 }}
            >
              <div className="relative z-10 flex items-start justify-between">
                <p className="mm-pa-stat__label">{card.label}</p>
                <Icon size={16} className="text-sky-300" />
              </div>
              <p className="mm-pa-stat__value relative z-10">{loading ? '...' : formatNumber(card.value)}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <motion.section
          className="mm-pa-panel lg:col-span-3"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease: EASE }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="mm-pa-panel__title">Feature Usage</h2>
            <Link to={platformAdminPaths.features} className="mm-pa-panel__link">
              Manage features →
            </Link>
          </div>
          <div className="space-y-4">
            {(loading ? Array.from({ length: 4 }, (_, i) => ({ feature_code: `loading-${i}`, feature_name: '', orgs_enabled: 0, pct: 0 })) : metrics.featureUsage).map((f, i) => (
              <div key={f.feature_code}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="mm-pa-feature-row__title">{loading ? 'Loading feature...' : f.feature_name}</span>
                  <span className="text-slate-400">{loading ? '...' : `${f.orgs_enabled} orgs · ${f.pct}%`}</span>
                </div>
                <div className="mm-pa-progress">
                  <motion.div
                    className="mm-pa-progress__bar"
                    initial={{ width: 0 }}
                    animate={{ width: `${loading ? 42 : f.pct}%` }}
                    transition={{ duration: 0.7, delay: 0.05 * i, ease: EASE }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="mm-pa-panel lg:col-span-2"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: EASE }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="mm-pa-panel__title">Recent Organizations</h2>
            <Link to={platformAdminPaths.organizations} className="mm-pa-panel__link">
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {(loading ? Array.from({ length: 5 }, (_, i) => ({ id: `loading-org-${i}` })) : metrics.recentOrgs).map((org, i) => (
              <motion.li
                key={org.id}
                className="mm-pa-list-row"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.22 + i * 0.05 }}
              >
                <div>
                  <p className="mm-pa-table__title">{loading ? 'Loading organization...' : org.name}</p>
                  <p className="mm-pa-list-row__meta">{loading ? 'Loading...' : `${org.code} · ${String(org.organization_type || '').toUpperCase()}`}</p>
                </div>
                <span className={`mm-pa-badge ${isActiveStatus(org.status) ? 'mm-pa-badge--active' : 'mm-pa-badge--suspended'}`}>
                  {loading ? '...' : statusLabel(org.status)}
                </span>
              </motion.li>
            ))}
          </ul>

          <Link
            to={platformAdminPaths.organizations}
            className="mm-pa-btn mm-pa-btn--primary mt-5 w-full"
          >
            Create Organization <ArrowRight size={15} />
          </Link>
        </motion.section>
      </div>

      <motion.section
        className="mm-pa-panel"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4, ease: EASE }}
      >
        <h2 className="mm-pa-panel__title mb-3">Complete provisioning flow</h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            'Create Organization',
            'Assign Subscription',
            'Enable Features',
            'Create Org Admin',
            'Send Activation',
          ].map((step, i) => (
            <motion.li
              key={step}
              className="mm-pa-step-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 + i * 0.05 }}
              whileHover={{ y: -3, scale: 1.01 }}
            >
              <p className="mm-pa-step-card__label">
                Step {String(i + 1).padStart(2, '0')}
              </p>
              <p className="mt-2 text-sm font-bold mm-pa-strong">{step}</p>
            </motion.li>
          ))}
        </ol>
      </motion.section>
    </div>
  );
}
