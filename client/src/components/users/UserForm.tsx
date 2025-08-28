import React, { useState, useEffect } from 'react';
import type { User } from '../../types/user';
import { useRoles } from '../../hooks/useRole';

interface UserFormProps {
  initial?: Partial<User>;
  onSubmit: (user: Partial<User>) => void;
  onCancel: () => void;
}

const getGeneralPassword = () => {
  return localStorage.getItem('generalPassword') || '';
};

const UserForm: React.FC<UserFormProps> = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState<Partial<User>>(initial || {});
  const { roles } = useRoles();

  useEffect(() => {
    setForm(initial || {});
  }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = { ...form };
    if (!initial?._id) {
      userData.password = getGeneralPassword();
    }
    onSubmit(userData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow border border-gray-200 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{initial?._id ? 'Edit User' : 'Add User'}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            name="name"
            value={form.name || ''}
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email || ''}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Office</label>
          <input
            name="office"
            value={form.office || ''}
            onChange={handleChange}
            placeholder="Office"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            name="role"
            value={form.role as string || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Role</option>
            {roles.map(role => (
              <option key={role._id} value={role._id}>{role.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          {initial?._id ? 'Update' : 'Add'}
        </button>
        <button type="button" onClick={onCancel} className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
          Cancel
        </button>
      </div>
      {!initial?._id && (
        <p className="text-xs text-gray-500 mt-2">Password will be set to the general password automatically.</p>
      )}
    </form>
  );
};

export default UserForm;