import IconButton from '@mui/material/IconButton';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { serverEndpoint } from "../../config/config";
import { Modal, Button } from 'react-bootstrap';
import './ManageUsers.css'; // Import the new CSS file

const USER_ROLES = ['viewer', 'developer'];

function ManageUsers() {
    // --- All existing logic is preserved without changes ---
    const [errors, setErrors] = useState({});
    const [usersData, setUsersData] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        email: '',
        name: '',
        role: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleModalShow = (isEdit, data = {}) => {
        setErrors({});
        if (isEdit) {
            setFormData({
                id: data._id,
                email: data.email,
                role: data.role,
                name: data.name
            });
        } else {
            setFormData({
                id: null,
                email: '',
                role: '',
                name: ''
            });
        }
        setIsEdit(isEdit);
        setShowModal(true);
    };

    const handleModalClose = () => setShowModal(false);

    const handleDeleteModalShow = (userId) => {
        setFormData(prev => ({ ...prev, id: userId }));
        setShowDeleteModal(true);
    };

    const handleDeleteModalClose = () => setShowDeleteModal(false);

    const handleDeleteSubmit = async () => {
        try {
            setFormLoading(true);
            await axios.delete(`${serverEndpoint}/users/${formData.id}`, { withCredentials: true });
            await fetchUsers();
            handleDeleteModalClose();
        } catch (error) {
            setErrors({ message: 'Something went wrong, please try again' });
        } finally {
            setFormLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        let newErrors = {};
        let isValid = true;
        if (!formData.email) {
            newErrors.email = "Email is mandatory";
            isValid = false;
        }
        if (!formData.name) {
            newErrors.name = "Name is mandatory";
            isValid = false;
        }
        if (!formData.role) {
            newErrors.role = "Role is mandatory";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validate()) {
            setFormLoading(true);
            const body = {
                email: formData.email,
                name: formData.name,
                role: formData.role
            };
            const config = { withCredentials: true };
            try {
                if (isEdit) {
                    await axios.put(`${serverEndpoint}/users/${formData.id}`, body, config);
                } else {
                    await axios.post(`${serverEndpoint}/users`, body, config);
                }
                await fetchUsers();
                handleModalClose();
            } catch (error) {
                const message = error.response?.data?.message || 'Something went wrong, please try again';
                setErrors({ message });
            } finally {
                setFormLoading(false);
            }
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${serverEndpoint}/users`, { withCredentials: true });
            setUsersData(response.data);
        } catch (error) {
            setErrors({ message: 'Unable to fetch users at the moment, please try again' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const columns = [
        { field: 'name', headerName: 'Name', flex: 2 },
        { field: 'email', headerName: 'Email', flex: 3 },
        { field: 'role', headerName: 'Role', flex: 2, renderCell: (params) => <span className={`role-badge role-${params.value}`}>{params.value}</span> },
        {
            field: 'action', headerName: 'Actions', flex: 1, align: 'center', headerAlign: 'center', sortable: false, renderCell: (params) => (
                <div className="action-buttons">
                    <IconButton aria-label="edit user" onClick={() => handleModalShow(true, params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete user" onClick={() => handleDeleteModalShow(params.row._id)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            )
        },
    ];
    // --- End of preserved logic ---

    return (
        <div className="manage-users-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Manage Team Users</h1>
                <Button variant="primary" onClick={() => handleModalShow(false)} className="add-user-btn">
                    + Add New User
                </Button>
            </div>

            {errors.message && !showModal && (
                <div className="alert alert-danger mx-4" role="alert">
                    {errors.message}
                </div>
            )}

            <div className="dashboard-content">
                <DataGrid
                    getRowId={(row) => row._id}
                    rows={usersData}
                    columns={columns}
                    loading={loading}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10, page: 0 } },
                    }}
                    pageSizeOptions={[10, 20, 50]}
                    disableRowSelectionOnClick
                    autoHeight
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f8f9fa',
                            color: '#343a40',
                            fontWeight: 'bold',
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid #dee2e6',
                        },
                    }}
                />
            </div>

            {/* Add/Edit User Modal */}
            <Modal show={showModal} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Edit User' : 'Add a New User'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.message && (
                        <div className="alert alert-danger" role="alert">
                            {errors.message}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group mb-3">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} id="name" name="name" value={formData.name} onChange={handleChange} />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} id="email" name="email" value={formData.email} onChange={handleChange} />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="role">User Role</label>
                            <select name="role" value={formData.role} onChange={handleChange} className={`form-select ${errors.role ? 'is-invalid' : ''}`}>
                                <option value="">Select a role</option>
                                {USER_ROLES.map((role) => (
                                    <option key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                        </div>
                        <div className="d-grid mt-4">
                            <Button variant="primary" type="submit" disabled={formLoading} className="w-100">
                                {formLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : (isEdit ? 'Save Changes' : 'Add User')}
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to remove this user? This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteModalClose}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteSubmit} disabled={formLoading}>
                        {formLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ManageUsers;
