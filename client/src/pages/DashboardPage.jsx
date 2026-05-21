import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';
import ConfirmDialog from '../components/common/ConfirmDialog';
import DashboardLayout from '../components/layout/DashboardLayout';
import EmployeeModal from '../components/employee/EmployeeModal';
import EmployeeTable from '../components/employee/EmployeeTable';
import Pagination from '../components/employee/Pagination';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './DashboardPage.css';

const PAGE_SIZE = 10;

const DashboardPage = () => {
  const { handleSessionExpired } = useAuth();
  const { showError, showSuccess } = useToast();

  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [lookups, setLookups] = useState({ departments: [], designations: [], genders: [] });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLookups = useCallback(async () => {
    try {
      const { data } = await api.get('/employees/lookups');
      setLookups(data.data);
    } catch (err) {
      if (err.status === 401) handleSessionExpired(err.message);
      else showError(err.message);
    }
  }, [handleSessionExpired, showError]);

  const fetchEmployees = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: PAGE_SIZE,
          ...(search.trim() && { search: search.trim() }),
        };
        const { data } = await api.get('/employees', { params });
        setEmployees(data.data.employees);
        setPagination(data.data.pagination);
      } catch (err) {
        if (err.status === 401) {
          handleSessionExpired(err.message);
        } else {
          showError(err.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [search, handleSessionExpired, showError]
  );

  useEffect(() => {
    fetchLookups();
  }, [fetchLookups]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchEmployees]);

  const handlePageChange = (page) => {
    fetchEmployees(page);
  };

  const handleCreate = () => {
    setEditingEmployee(null);
    setModalOpen(true);
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/employees/${deleteTarget._id}`);
      showSuccess('Employee deleted successfully');
      setDeleteTarget(null);
      const nextPage =
        employees.length === 1 && pagination.page > 1
          ? pagination.page - 1
          : pagination.page;
      fetchEmployees(nextPage);
    } catch (err) {
      showError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const toolbar = (
    <div className="dashboard-toolbar">
      <div className="dashboard-toolbar__search">
        <img src="/assets/search_icon.svg" alt="" className="dashboard-toolbar__search-icon" />
        <input
          type="search"
          className="dashboard-toolbar__search-input"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search employees"
        />
      </div>
      <button
        type="button"
        className="dashboard-toolbar__create-btn"
        onClick={handleCreate}
        aria-label="Create"
      >
        <img src="/assets/create.svg" alt="" width="71" height="25" />
      </button>
    </div>
  );

  return (
    <DashboardLayout title="Employee Setup" subHeader={toolbar}>
      <div className="dashboard-content">
        {loading ? (
          <div className="dashboard-content__loading">Loading employees...</div>
        ) : (
          <EmployeeTable
            employees={employees}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
          />
        )}
      </div>

      <footer className="dashboard-footer">
        <div className="dashboard-footer__total">
          Total Records -&gt; {pagination.total}
        </div>
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </footer>

      <EmployeeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => fetchEmployees(pagination.page)}
        employee={editingEmployee}
        lookups={lookups}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteTarget?.fullName}? This action cannot be undone.`}
        loading={deleting}
      />
    </DashboardLayout>
  );
};

export default DashboardPage;
