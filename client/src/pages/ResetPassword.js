import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/config";

function ResetPassword({ email: emailProp = "", hideEmailField = false, onSuccess }) {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Frontend validation
        if (!formData.email || !formData.code || !formData.newPassword) {
            setError("Please fill in all fields.");
            return;
        }
        try {
            await axios.post(`${serverEndpoint}/auth/reset-password`, formData);
            setMessage("Password reset successful.");
            setError("");
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                } else {
                    navigate("/");
                }
            }, 1500);
        } catch (err) {
            let backendMsg = err?.response?.data?.message;
            setError(backendMsg || "Failed to reset password. Check code or try again.");
        }
    };

    return (
        <div className="container mt-5 col-md-4">
            <h3>Reset Password</h3>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                {!shouldHideEmail && (
                    <div className="mb-3">
                        <label>Email</label>
                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                )}
                <div className="mb-3">
                    <label>Reset Code</label>
                    <input type="text" className="form-control" name="code" value={formData.code} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label>New Password</label>
                    <input type="password" className="form-control" name="newPassword" value={formData.newPassword} onChange={handleChange} />
                </div>
                <button className="btn btn-primary w-100">Reset Password</button>
            </form>
        </div>
    );
}
export default ResetPassword;