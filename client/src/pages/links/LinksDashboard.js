import IconButton from '@mui/material/IconButton';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { serverEndpoint } from '../../config/config'; // Assuming you have this config file
import { Modal, Button } from 'react-bootstrap';
import { usePermission } from '../../rbac/userPermissions'; // Assuming you have this custom hook
import { useNavigate } from 'react-router-dom';
import './LinksDashboard.css'; // Import the new CSS file

function LinksDashboard() {
    // --- All existing logic is preserved without changes ---
    const [errors, setErrors] = useState({});
    const [linksData, setLinksData] = useState([]);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const permission = usePermission() || { canCreateLink: true, canEditLink: true, canDeleteLink: true, canViewLink: true }; // Fallback for Storybook/testing

    const [formData, setFormData] = useState({
        id: null,
        campaignTitle: "",
        originalUrl: "",
        category: ""
    });

    const handleShowDeleteModal = (linkId) => {
        setFormData(prev => ({ ...prev, id: linkId }));
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${serverEndpoint}/links/${formData.id}`, {
                withCredentials: true
            });
            await fetchLinks();
            handleCloseDeleteModal();
        } catch (error) {
            setErrors({ message: 'Unable to delete the link, please try again' });
        }
    };

    const handleOpenModal = (isEdit, data = {}) => {
        setErrors({});
        if (isEdit) {
            setFormData({
                id: data._id,
                campaignTitle: data.campaignTitle,
                originalUrl: data.originalUrl,
                category: data.category
            });
        } else {
            setFormData({
                id: null,
                campaignTitle: "",
                originalUrl: "",
                category: ""
            });
        }
        setIsEdit(isEdit);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        let newErrors = {};
        let isValid = true;
        if (!formData.campaignTitle) {
            newErrors.campaignTitle = "Campaign Title is mandatory";
            isValid = false;
        }
        if (!formData.originalUrl) {
            newErrors.originalUrl = "URL is mandatory";
            isValid = false;
        }
        if (!formData.category) {
            newErrors.category = "Category is mandatory";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validate()) {
            const body = {
                campaign_title: formData.campaignTitle,
                original_url: formData.originalUrl,
                category: formData.category
            };
            const configuration = {
                withCredentials: true
            };
            try {
                if (isEdit) {
                    await axios.put(
                        `${serverEndpoint}/links/${formData.id}`,
                        body, configuration);
                } else {
                    await axios.post(
                        `${serverEndpoint}/links`,
                        body, configuration);
                }

                await fetchLinks();
                setFormData({
                    campaignTitle: "",
                    originalUrl: "",
                    category: ""
                });
                // --- FIX: Close modal only on success ---
                handleCloseModal();
            } catch (error) {
                // --- FIX: Log the detailed error and display a better message ---
                console.error("API Error:", error.response); // This will show the full error from the server in the console
                const message = error.response?.data?.message || 'Unable to save the link. Please try again.';
                setErrors({ message });
            }
        }
    };


    const fetchLinks = async () => {
        try {
            const response = await axios.get(`${serverEndpoint}/links`, {
                withCredentials: true
            });
            setLinksData(response.data.data);
        } catch (error) {
            console.log(error);
            setErrors({ message: 'Unable to fetch links at the moment. Please try again' });
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const columns = [
        { field: 'campaignTitle', headerName: 'Campaign', flex: 2 },
        {
            field: 'originalUrl', headerName: 'Short Link', flex: 3, renderCell: (params) => (
                <a href={`${serverEndpoint}/links/r/${params.row._id}`} target='_blank' rel="noopener noreferrer" className="datagrid-link">
                    {`${serverEndpoint}/r/${params.row.shortCode || params.row._id}`}
                </a>
            )
        },
        { field: 'category', headerName: 'Category', flex: 2 },
        { field: 'clickCount', headerName: 'Clicks', flex: 1, align: 'center', headerAlign: 'center' },
        {
            field: 'action', headerName: 'Actions', flex: 2, align: 'center', headerAlign: 'center', sortable: false, renderCell: (params) => (
                <div className="action-buttons">
                    {permission.canViewLink && (
                        <IconButton aria-label="view analytics" onClick={() => navigate(`/analytics/${params.row._id}`)}>
                            <AssessmentIcon />
                        </IconButton>
                    )}
                    {permission.canEditLink && (
                        <IconButton aria-label="edit link" onClick={() => handleOpenModal(true, params.row)}>
                            <EditIcon />
                        </IconButton>
                    )}
                    {permission.canDeleteLink && (
                        <IconButton aria-label="delete link" onClick={() => handleShowDeleteModal(params.row._id)}>
                            <DeleteIcon />
                        </IconButton>
                    )}
                </div>
            )
        },
    ];
    // --- End of preserved logic ---

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Manage Affiliate Links</h1>
                {permission.canCreateLink && (
                    <Button variant="primary" onClick={() => handleOpenModal(false)} className="add-link-btn">
                        + Create New Link
                    </Button>
                )}
            </div>

            {errors.message && (
                <div className="alert alert-danger mx-4" role="alert">
                    {errors.message}
                </div>
            )}

            <div className="dashboard-content">
                <DataGrid
                    getRowId={(row) => row._id}
                    rows={linksData}
                    columns={columns}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10, page: 0 } }
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

            {/* Add/Edit Link Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Update Link' : 'Create a New Link'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Display the server error message inside the modal */}
                    {errors.message && (
                        <div className="alert alert-danger" role="alert">
                            {errors.message}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group mb-3">
                            <label htmlFor="campaignTitle">Campaign Title</label>
                            <input type="text" className={`form-control ${errors.campaignTitle ? 'is-invalid' : ''}`} id="campaignTitle" name="campaignTitle" value={formData.campaignTitle} onChange={handleChange} />
                            {errors.campaignTitle && <div className="invalid-feedback">{errors.campaignTitle}</div>}
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="originalUrl">Original URL</label>
                            <input type="text" className={`form-control ${errors.originalUrl ? 'is-invalid' : ''}`} id="originalUrl" name="originalUrl" value={formData.originalUrl} onChange={handleChange} />
                            {errors.originalUrl && <div className="invalid-feedback">{errors.originalUrl}</div>}
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="category">Category</label>
                            <input type="text" className={`form-control ${errors.category ? 'is-invalid' : ''}`} id="category" name="category" value={formData.category} onChange={handleChange} />
                            {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                        </div>
                        <div className="d-grid mt-4">
                            <Button variant="primary" type="submit" className="w-100">{isEdit ? 'Save Changes' : 'Create Link'}</Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to permanently delete this link? This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default LinksDashboard;
