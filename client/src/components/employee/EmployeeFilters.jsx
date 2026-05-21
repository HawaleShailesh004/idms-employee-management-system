import Select from '../common/Select';
import './EmployeeFilters.css';

const EmployeeFilters = ({ filters, lookups, onChange }) => {
  const handleSelect = (name) => (e) => {
    onChange({ ...filters, [name]: e.target.value });
  };

  return (
    <div className="employee-filters">
      <Select
        label="Department"
        name="department"
        value={filters.department}
        onChange={handleSelect('department')}
        options={lookups.departments}
        placeholder="All Departments"
      />
      <Select
        label="Designation"
        name="designation"
        value={filters.designation}
        onChange={handleSelect('designation')}
        options={lookups.designations}
        placeholder="All Designations"
      />
      <Select
        label="Gender"
        name="gender"
        value={filters.gender}
        onChange={handleSelect('gender')}
        options={lookups.genders}
        placeholder="All Genders"
      />
    </div>
  );
};

export default EmployeeFilters;
