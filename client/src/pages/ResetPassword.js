import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import './ResetPassword.css'; // Import the new CSS file

function ResetPassword({ email: emailProp = "", hideEmailField = false, onSuccess }) {
    // --- All existing logic is preserved without changes ---
    const location = useLocation();
    const navigate = useNavigate();
    const emailFromState = location.state?.email || emailProp;
    const shouldHideEmail = hideEmailField || !!emailProp || !!location.state?.email;

    const [formData, setFormData] = useState({
        email: emailFromState,
        code: "",
        newPassword: ""
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!formData.email || !formData.code || !formData.newPassword) {
            setError("Please fill in all fields.");
            return;
        }
        setLoading(true);
        
        // This endpoint needs to be updated to your actual server endpoint
        const serverEndpoint = 'http://localhost:5001'; // Example endpoint

        try {
            await axios.post(`${serverEndpoint}/api/auth/reset-password`, formData);
            setMessage("Password reset successful! Redirecting...");
            setError("");
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                } else {
                    navigate("/login");
                }
            }, 2000);
        } catch (err) {
            let backendMsg = err?.response?.data?.message;
            setError(backendMsg || "Failed to reset password. Check the code or try again.");
        } finally {
            setLoading(false);
        }
    };
    // --- End of preserved logic ---

    return (
        <div className="login-container">
            <div className="container-fluid h-100">
                <div className="row h-100">
                    {/* Left Branding Column */}
                    <div className="col-md-6 login-branding-col d-none d-md-flex align-items-center justify-content-center">
                        <div className="text-center text-white">
                            <h1 className="display-4">Set a New Password</h1>
                            <p className="lead">Create a new, strong password to secure your account.</p>
                        </div>
                    </div>

                    {/* Right Form Column */}
                    <div className="col-md-6 login-form-col d-flex align-items-center justify-content-center">
                        <div className="login-form-container">
                            <h2 className="text-center mb-4">Reset Password</h2>

                            {message && <div className="alert alert-success">{message}</div>}
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                {!shouldHideEmail && (
                                    <div className="form-group mb-3">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} />
                                    </div>
                                )}
                                <div className="form-group mb-3">
                                    <label htmlFor="code">Reset Code</label>
                                    <input type="text" className="form-control" id="code" name="code" placeholder="Enter the code from your email" value={formData.code} onChange={handleChange} />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="newPassword">New Password</label>
                                    <input type="password" className="form-control" id="newPassword" name="newPassword" placeholder="Enter your new password" value={formData.newPassword} onChange={handleChange} />
                                </div>
                                <div className="d-grid">
                                    <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Reset Password'}
                                    </button>
                                </div>
                            </form>
                             <div className="text-center mt-4">
                                <p className="text-muted">
                                    <Link to="/login">Back to Sign In</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
