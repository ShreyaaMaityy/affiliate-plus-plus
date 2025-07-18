import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ForgetPassword.css'; // Import the new CSS file

const ForgetPassword = () => {
    // --- All existing logic is preserved without changes ---
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Added for better UX
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        // This endpoint needs to be updated to your actual server endpoint
        const serverEndpoint = 'http://localhost:5001'; // Example endpoint

        try {
            const response = await fetch(`${serverEndpoint}/api/password/send-reset-password-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset token.');
            }

            setMessage(data.message);
            // On success, navigate to the reset password page
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 2000);

        } catch (err) {
            setError(err.message);
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
                            <h1 className="display-4">Forgot Password?</h1>
                            <p className="lead">No worries, we'll help you get back on track.</p>
                        </div>
                    </div>

                    {/* Right Form Column */}
                    <div className="col-md-6 login-form-col d-flex align-items-center justify-content-center">
                        <div className="login-form-container">
                            <h2 className="text-center mb-3">Reset Your Password</h2>
                            <p className="text-center text-muted mb-4">Enter your email address and we will send you a code to reset your password.</p>

                            {/* Success/Error Messages */}
                            {message && <div className="alert alert-success">{message}</div>}
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Send Reset Code'}
                                    </button>
                                </div>
                            </form>
                            
                            <div className="text-center mt-4">
                                <p className="text-muted">
                                    Remember your password? <Link to="/login">Sign In</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
