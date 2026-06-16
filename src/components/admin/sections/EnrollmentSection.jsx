import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserPlus,
  Mail,
  Calendar,
  Phone,
  GraduationCap,
  DollarSign,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const COURSE_SESSIONS = [
  { id: 'mock-1', label: 'Mock Interview #1', type: 'mock-interview', duration: '45 min' },
  { id: 'mock-2', label: 'Mock Interview #2', type: 'mock-interview', duration: '45 min' },
  { id: 'mock-3', label: 'Mock Interview #3', type: 'mock-interview', duration: '45 min' },
  { id: 'mentorship-1', label: '1:1 Mentorship #1', type: 'mentorship', duration: '45 min' },
  { id: 'mentorship-2', label: '1:1 Mentorship #2', type: 'mentorship', duration: '45 min' },
  { id: 'hr-interview', label: 'HR Interview Mock', type: 'hr-mock', duration: '45 min' },
  { id: 'technical-interview', label: 'Technical Interview', type: 'technical', duration: '60 min' },
  { id: 'expert-session', label: 'Expert Session', type: 'expert', duration: '60 min' },
];

export default function EnrollmentSection() {
  const [formData, setFormData] = useState({
    studentName: '',
    feeSubmitted: '',
    college: '',
    dob: '',
    mobileNumber: '',
    collegeYear: '',
    startDate: '',
    endDate: '',
    selectedSessions: [],
  });

  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSessionToggle = (sessionId) => {
    setFormData(prev => ({
      ...prev,
      selectedSessions: prev.selectedSessions.includes(sessionId)
        ? prev.selectedSessions.filter(id => id !== sessionId)
        : [...prev.selectedSessions, sessionId],
    }));
  };

  const validateForm = () => {
    if (!formData.studentName.trim()) return 'Student name is required';
    if (!formData.feeSubmitted) return 'Fee amount is required';
    if (!formData.college.trim()) return 'College is required';
    if (!formData.dob) return 'Date of birth is required';
    if (!formData.mobileNumber.trim()) return 'Mobile number is required';
    if (!formData.collegeYear) return 'College year is required';
    if (!formData.startDate) return 'Start date is required';
    if (!formData.endDate) return 'End date is required';
    if (formData.selectedSessions.length === 0) return 'Select at least one course/session';
    if (new Date(formData.startDate) >= new Date(formData.endDate)) return 'End date must be after start date';
    return null;
  };

  const handleEnroll = async () => {
    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Prepare enrollment data
      const enrollmentData = {
        studentName: formData.studentName,
        feeSubmitted: parseFloat(formData.feeSubmitted),
        college: formData.college,
        dob: formData.dob,
        mobileNumber: formData.mobileNumber,
        collegeYear: formData.collegeYear,
        startDate: formData.startDate,
        endDate: formData.endDate,
        selectedSessions: formData.selectedSessions.map(sessionId =>
          COURSE_SESSIONS.find(s => s.id === sessionId)
        ),
        enrollmentDate: new Date().toISOString(),
      };

      // Simulate backend API call
      // In production, this would call: POST /api/admin/enroll-student
      console.log('Enrollment Data:', enrollmentData);

      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add to enrolled students (simulated)
      const studentId = `STU${Date.now()}`;
      const newStudent = {
        id: studentId,
        ...enrollmentData,
        status: 'Enrolled',
        generatedPassword: Math.random().toString(36).slice(-8),
      };

      setEnrolledStudents(prev => [newStudent, ...prev]);
      setMessage({
        type: 'success',
        text: `Student enrolled successfully! ID: ${studentId}, Temporary password generated.`,
      });

      // Reset form
      setFormData({
        studentName: '',
        feeSubmitted: '',
        college: '',
        dob: '',
        mobileNumber: '',
        collegeYear: '',
        startDate: '',
        endDate: '',
        selectedSessions: [],
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error enrolling student. Please try again.',
      });
      console.error('Enrollment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dashboard-text)' }}>
          Student Enrollment
        </h1>
        <p style={{ color: 'var(--dashboard-text-secondary)' }}>
          Enroll new students and assign courses
        </p>
      </div>

      {/* Alert Messages */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-4 mb-6 flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20'
              : 'bg-red-500/10 border border-red-500/20'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
          )}
          <p
            className="text-sm"
            style={{
              color: message.type === 'success' ? '#10b981' : '#ef4444',
            }}
          >
            {message.text}
          </p>
        </motion.div>
      )}

      {/* Enrollment Form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-8"
        style={{
          borderColor: 'var(--dashboard-border)',
          backgroundColor: 'var(--dashboard-bg-secondary)',
          borderWidth: '1px',
        }}
      >
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--dashboard-text)' }}>
          <UserPlus size={24} style={{ color: '#FF9500' }} /> New Student Enrollment
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Student Name */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dashboard-text)' }}>
              Student Name *
            </label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleInputChange}
              placeholder="Enter full name"
              className="w-full px-4 py-2 rounded-lg bg-white/5 border transition-all focus:outline-none focus:ring-2 focus:ring-[#FF9500]/50"
              style={{
                borderColor: 'var(--dashboard-border)',
                color: 'var(--dashboard-text)',
              }}
            />
          </div>

          {/* Fee Submitted */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dashboard-text)' }}>
              Fee Submitted (₹) *
            </label>
            <input
              type="number"
              name="feeSubmitted"
              value={formData.feeSubmitted}
              onChange={handleInputChange}
              placeholder="Enter amount"
              className="w-full px-4 py-2 rounded-lg bg-white/5 border transition-all focus:outline-none focus:ring-2 focus:ring-[#FF9500]/50"
              style={{
                borderColor: 'var(--dashboard-border)',
                color: 'var(--dashboard-text)',
              }}
            />
          </div>

          {/* College */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dashboard-text)' }}>
              College *
            </label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleInputChange}
              placeholder="e.g., IIT Delhi"
              className="w-full px-4 py-2 rounded-lg bg-white/5 border transition-all focus:outline-none focus:ring-2 focus:ring-[#FF9500]/50"
              style={{
                borderColor: 'var(--dashboard-border)',
                color: 'var(--dashboard-text)',
              }}
            />
          </div>

          {/* College Year */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dashboard-text)' }}>
              College Year *
            </label>
            <select
              name="collegeYear"
              value={formData.collegeYear}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border transition-all focus:outline-none focus:ring-2 focus:ring-[#FF9500]/50"
              style={{
                borderColor: 'var(--dashboard-border)',
                color: 'var(--dashboard-text)',
              }}
            >
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Passed Out">Passed Out</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dashboard-text)' }}>
              Date of Birth *
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border transition-all focus:outline-none focus:ring-2 focus:ring-[#FF9500]/50"
              style={{
                borderColor: 'var(--dashboard-border)',
                color: 'var(--dashboard-text)',
              }}
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dashboard-text)' }}>
              Mobile Number *
            </label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="10-digit mobile number"
              className="w-full px-4 py-2 rounded-lg bg-white/5 border transition-all focus:outline-none focus:ring-2 focus:ring-[#FF9500]/50"
              style={{
                borderColor: 'var(--dashboard-border)',
                color: 'var(--dashboard-text)',
              }}
            />
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-8 pb-8 border-b" style={{ borderColor: 'var(--dashboard-border)' }}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--dashboard-text)' }}>
            <Calendar size={20} style={{ color: '#FF9500' }} /> Program Timeline
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dashboard-text)' }}>
                Program Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border transition-all focus:outline-none focus:ring-2 focus:ring-[#FF9500]/50"
                style={{
                  borderColor: 'var(--dashboard-border)',
                  color: 'var(--dashboard-text)',
                }}
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dashboard-text)' }}>
                Program End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border transition-all focus:outline-none focus:ring-2 focus:ring-[#FF9500]/50"
                style={{
                  borderColor: 'var(--dashboard-border)',
                  color: 'var(--dashboard-text)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Courses & Sessions */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--dashboard-text)' }}>
            Select Courses & Sessions *
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {COURSE_SESSIONS.map(session => (
              <motion.label
                key={session.id}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-white/5"
                style={{
                  backgroundColor: formData.selectedSessions.includes(session.id)
                    ? 'rgba(255, 149, 0, 0.1)'
                    : 'transparent',
                  borderColor: 'var(--dashboard-border)',
                  borderWidth: '1px',
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.selectedSessions.includes(session.id)}
                  onChange={() => handleSessionToggle(session.id)}
                  className="w-4 h-4 rounded accent-[#FF9500] cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--dashboard-text)' }}>
                    {session.label}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
                    {session.duration}
                  </p>
                </div>
              </motion.label>
            ))}
          </div>
        </div>

        {/* Enroll Button */}
        <motion.button
          onClick={handleEnroll}
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full px-6 py-3 rounded-lg bg-[#FF9500] text-black font-bold text-lg transition-all hover:bg-[#FFa520] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <UserPlus size={20} />
          {loading ? 'Enrolling...' : 'Enroll Student'}
        </motion.button>
      </motion.div>

      {/* Enrolled Students List */}
      {enrolledStudents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-2xl p-8"
          style={{
            borderColor: 'var(--dashboard-border)',
            backgroundColor: 'var(--dashboard-bg-secondary)',
            borderWidth: '1px',
          }}
        >
          <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--dashboard-text)' }}>
            Recently Enrolled Students
          </h2>

          <div className="space-y-4">
            {enrolledStudents.map((student, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-lg p-4"
                style={{
                  borderColor: 'var(--dashboard-border)',
                  backgroundColor: 'var(--dashboard-bg)',
                  borderWidth: '1px',
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>Student ID</p>
                    <p className="text-sm font-bold" style={{ color: 'var(--dashboard-text)' }}>{student.id}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>Name</p>
                    <p className="text-sm font-bold" style={{ color: 'var(--dashboard-text)' }}>{student.studentName}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>College</p>
                    <p className="text-sm font-bold" style={{ color: 'var(--dashboard-text)' }}>{student.college}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>Status</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                      ✓ Enrolled
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
