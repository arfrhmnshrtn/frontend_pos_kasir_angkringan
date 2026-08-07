import React, { useState, useEffect, useCallback } from 'react';
import { userService } from '../../services/user.service';
import { roleService } from '../../services/role.service';
import { useToast } from '../../contexts/ToastContext';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Pagination } from '../../components/common/Pagination';
import { PinInput } from '../../components/common/PinInput';
import { Loading } from '../../components/common/Loading';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Key,
  Trash2,
  CheckCircle,
  XCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const UsersPage = () => {
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPinModalOpen, setIsResetPinModalOpen] = useState(false);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Data States
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    roleId: '',
    pin: '',
    status: 'ACTIVE',
  });
  const [resetPinValue, setResetPinValue] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Fetch roles for dropdown
  const fetchRoles = async () => {
    try {
      const res = await roleService.getRoles();
      const roleList = res?.data || res || [];
      setRoles(Array.isArray(roleList) ? roleList : []);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  // Fetch users with search and pagination
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: search.trim() || undefined,
      };
      const res = await userService.getUsers(params);
      
      const data = res?.data || res;
      if (Array.isArray(data)) {
        setUsers(data);
        setTotalItems(data.length);
        setTotalPages(1);
      } else if (data?.users || data?.items) {
        const list = data.users || data.items || [];
        setUsers(list);
        setTotalItems(data.total || data.meta?.totalItems || list.length);
        setTotalPages(data.totalPages || data.meta?.totalPages || Math.ceil((data.total || list.length) / itemsPerPage));
      } else {
        setUsers([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (err) {
      toast.error('Gagal mengambil daftar user/kasir');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, toast]);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  // Form Validation
  const validateForm = (isEdit = false) => {
    const errors = {};
    if (!formData.name || formData.name.trim().length < 3) {
      errors.name = 'Nama minimal 3 karakter';
    }
    if (!isEdit) {
      if (!formData.pin || !/^\d{4}$/.test(formData.pin)) {
        errors.pin = 'PIN harus 4 digit angka';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData({
      name: '',
      username: '',
      roleId: roles[0]?.id || roles[0]?._id || '',
      pin: '',
      status: 'ACTIVE',
    });
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  // Create User Submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(false)) return;

    setSubmitting(true);
    try {
      const res = await userService.createUser(formData);
      toast.success(res?.message || 'User/Kasir berhasil ditambahkan');
      setIsCreateModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err?.message || 'Gagal menambahkan User');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      username: user.username || user.code || '',
      roleId: user.roleId || user.role?.id || user.role || '',
      status: user.status || 'ACTIVE',
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Edit User Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    setSubmitting(true);
    try {
      const userId = selectedUser.id || selectedUser._id;
      const res = await userService.updateUser(userId, {
        name: formData.name,
        roleId: formData.roleId,
        status: formData.status,
      });
      toast.success(res?.message || 'User berhasil diperbarui');
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err?.message || 'Gagal memperbarui User');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Reset PIN Modal
  const handleOpenResetPin = (user) => {
    setSelectedUser(user);
    setResetPinValue('');
    setIsResetPinModalOpen(true);
  };

  // Reset PIN Submit
  const handleResetPinSubmit = async (e) => {
    e.preventDefault();
    if (!resetPinValue || !/^\d{4}$/.test(resetPinValue)) {
      toast.error('PIN baru harus terdiri dari 4 digit angka');
      return;
    }

    setSubmitting(true);
    try {
      const userId = selectedUser.id || selectedUser._id;
      const res = await userService.resetUserPin(userId, resetPinValue);
      toast.success(res?.message || 'PIN berhasil di-reset');
      setIsResetPinModalOpen(false);
    } catch (err) {
      toast.error(err?.message || 'Gagal mereset PIN');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Status Confirm
  const handleOpenStatusConfirm = (user) => {
    setSelectedUser(user);
    setIsStatusConfirmOpen(true);
  };

  const handleToggleStatus = async () => {
    setSubmitting(true);
    try {
      const userId = selectedUser.id || selectedUser._id;
      const newStatus = selectedUser.status === 'ACTIVE' || selectedUser.status === 'aktif' ? 'INACTIVE' : 'ACTIVE';
      const res = await userService.updateUserStatus(userId, newStatus);
      toast.success(res?.message || `Status user diubah menjadi ${newStatus}`);
      setIsStatusConfirmOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err?.message || 'Gagal mengubah status user');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete User Confirm
  const handleOpenDeleteConfirm = (user) => {
    setSelectedUser(user);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteUser = async () => {
    setSubmitting(true);
    try {
      const userId = selectedUser.id || selectedUser._id;
      const res = await userService.deleteUser(userId);
      toast.success(res?.message || 'User berhasil dihapus');
      setIsDeleteConfirmOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err?.message || 'Gagal menghapus user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text mb-1 tracking-tight">Kelola Kasir & User</h1>
          <p className="text-sm text-text-secondary">Manajemen akun kasir, role, hak akses, dan keamanan PIN.</p>
        </div>
        <Button onClick={handleOpenCreate} icon={Plus} size="md" className="font-semibold shadow-md">
          Tambah Kasir
        </Button>
      </div>

      {/* Action Bar / Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Cari nama kasir..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            leftIcon={Search}
          />
        </div>
        <Button variant="ghost" size="sm" onClick={fetchUsers} icon={RefreshCw}>
          Muat Ulang
        </Button>
      </div>

      {/* Users Data Table */}
      {loading ? (
        <Loading text="Memuat data kasir..." />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Tidak Ada User / Kasir"
          description={search ? `Tidak ada kasir yang cocok dengan kata kunci "${search}"` : 'Belum ada data kasir yang didaftarkan.'}
          actionLabel="Tambah Kasir Baru"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="space-y-4">
          <Table headers={['No', 'Nama Kasir', 'Role', 'Status', 'Tanggal Buat', 'Aksi']}>
            {users.map((item, index) => {
              const roleText = typeof item.role === 'string' ? item.role : item.role?.name || 'Kasir';
              const isActive = item.status === 'ACTIVE' || item.status === 'aktif' || item.status === true;
              return (
                <tr key={item.id || item._id || index} className="hover:bg-main transition-colors border-b border-border last:border-b-0">
                  <td className="px-6 py-4 text-xs font-semibold text-text-secondary">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-text">{item.fullname || item.name}</div>
                    {item.username && <div className="text-xs text-text-secondary">@{item.username}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={roleText.toUpperCase() === 'OWNER' ? 'primary' : 'purple'} size="sm">
                      {roleText}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={isActive ? 'success' : 'danger'} size="sm">
                      {isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-xs text-text-secondary">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <button
                         onClick={() => handleOpenEdit(item)}
                         title="Edit User"
                         className="p-1.5 rounded-lg text-text-secondary hover:text-primary transition-colors cursor-pointer"
                       >
                         <Edit2 className="w-4 h-4" />
                       </button>
                       <button
                         onClick={() => handleOpenResetPin(item)}
                         title="Reset PIN"
                         className="p-1.5 rounded-lg text-text-secondary hover:text-amber-500 transition-colors cursor-pointer"
                       >
                         <Key className="w-4 h-4" />
                       </button>
                       <button
                         onClick={() => handleOpenStatusConfirm(item)}
                         title={isActive ? 'Nonaktifkan Kasir' : 'Aktifkan Kasir'}
                         className={`p-1.5 rounded-lg transition-colors cursor-pointer text-text-secondary ${
                           isActive ? 'hover:text-rose-500' : 'hover:text-emerald-500'
                         }`}
                       >
                         {isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                       </button>
                       <button
                         onClick={() => handleOpenDeleteConfirm(item)}
                         title="Hapus User"
                         className="p-1.5 rounded-lg text-text-secondary hover:text-rose-500 transition-colors cursor-pointer"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal Create User */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Tambah Kasir / User Baru">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap"
            placeholder="Masukkan nama kasir"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
          />

          <Input
            label="Username / Kode (Opsional)"
            placeholder="misal: kasir1"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />

          {roles.length > 0 && (
            <Select
              label="Role Access"
              value={formData.roleId}
              onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
              options={roles.map((r) => ({ value: r.id || r._id, label: r.name }))}
            />
          )}

          <div className="pt-2">
            <PinInput
              label="Set 4-Digit PIN Log in"
              value={formData.pin}
              onChange={(val) => setFormData({ ...formData, pin: val })}
              error={formErrors.pin}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)} disabled={submitting}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              Simpan Kasir
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit User */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Data User">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
          />

          {roles.length > 0 && (
            <Select
              label="Role Access"
              value={formData.roleId}
              onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
              options={roles.map((r) => ({ value: r.id || r._id, label: r.name }))}
            />
          )}

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'ACTIVE', label: 'Aktif' },
              { value: 'INACTIVE', label: 'Nonaktif' },
            ]}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)} disabled={submitting}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              Update User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Reset PIN */}
      <Modal isOpen={isResetPinModalOpen} onClose={() => setIsResetPinModalOpen(false)} title={`Reset PIN - ${selectedUser?.name}`}>
        <form onSubmit={handleResetPinSubmit} className="space-y-4">
          <p className="text-xs text-text-secondary">Masukkan 4 digit PIN baru untuk kasir ini.</p>
          <PinInput
            label="PIN Baru (4 Digit)"
            value={resetPinValue}
            onChange={setResetPinValue}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setIsResetPinModalOpen(false)} disabled={submitting}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              Simpan PIN Baru
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Status Change */}
      <ConfirmDialog
        isOpen={isStatusConfirmOpen}
        onClose={() => setIsStatusConfirmOpen(false)}
        onConfirm={handleToggleStatus}
        title="Ubah Status Kasir"
        message={`Apakah Anda yakin ingin mengubah status ${selectedUser?.name} menjadi ${
          selectedUser?.status === 'ACTIVE' || selectedUser?.status === 'aktif' ? 'NONAKTIF' : 'AKTIF'
        }?`}
        variant="warning"
        isLoading={submitting}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteUser}
        title="Hapus Kasir"
        message={`Apakah Anda yakin ingin menghapus kasir "${selectedUser?.name}" secara permanen? Data yang telah dihapus tidak dapat dikembalikan.`}
        variant="danger"
        isLoading={submitting}
      />
    </div>
  );
};
