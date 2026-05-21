import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'employee', label: 'Employee', icon: '/assets/employee.svg', active: true },
  { id: 'leaves', label: 'Leaves', icon: '/assets/leaves.svg' },
  { id: 'holidays', label: 'Holidays', icon: '/assets/holidays.svg' },
  { id: 'outdoor', label: 'Outdoor Duty', icon: '/assets/outdoor_duty.svg' },
  { id: 'expense', label: 'Expense', icon: '/assets/expense.svg' },
  { id: 'attendance', label: 'Attendance', icon: '/assets/attendance.svg' },
  { id: 'it', label: 'IT Computation', icon: '/assets/it_computation.svg' },
  { id: 'salary', label: 'Salary', icon: '/assets/salary.svg' },
  { id: 'documents', label: 'Documents', icon: '/assets/documents.svg' },
  { id: 'training', label: 'Training & Dev.', icon: '/assets/training.svg' },
  { id: 'performance', label: 'Performance', icon: '/assets/performance.svg' },
  { id: 'policies', label: 'HR Policies', icon: '/assets/policies.svg' },
  { id: 'reports', label: 'Reports', icon: '/assets/reports.svg' },
  { id: 'support', label: 'Support', icon: '/assets/support.svg' },
];

const Sidebar = () => (
  <aside className="sidebar">
    <nav className="sidebar__nav">
      {NAV_ITEMS.map((item) => (
        <div
          key={item.id}
          className={`sidebar__item ${item.active ? 'sidebar__item--active' : ''}`}
          aria-current={item.active ? 'page' : undefined}
        >
          <span className="sidebar__indicator" />
          <img src={item.icon} alt="" className="sidebar__icon" />
          <span className="sidebar__label">{item.label}</span>
        </div>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
