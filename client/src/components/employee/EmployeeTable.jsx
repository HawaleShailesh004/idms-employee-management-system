import { formatDisplayDate } from '../../utils/formatDate';
import ActionMenu from './ActionMenu';
import './EmployeeTable.css';

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
  if (!employees.length) {
    return (
      <div className="employee-table__empty">
        <img src="/assets/no_records.svg" alt="" className="employee-table__empty-icon" />
        <p>No Records to be displayed</p>
      </div>
    );
  }

  return (
    <div className="employee-table__wrap">
      <div className="employee-table__scroll">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Photo</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.fullName}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td>{emp.gender}</td>
              <td>{formatDisplayDate(emp.dateOfBirth)}</td>
              <td>{emp.department}</td>
              <td>{emp.designation}</td>
              <td>
                <div className="employee-table__photo">
                  {emp.photoUrl ? (
                    <img src={emp.photoUrl} alt={emp.fullName} />
                  ) : (
                    <img src="/assets/photo.svg" alt="" className="employee-table__photo-placeholder" />
                  )}
                </div>
              </td>
              <td>
                <ActionMenu onEdit={() => onEdit(emp)} onDelete={() => onDelete(emp)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
