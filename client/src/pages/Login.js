import { useState } from "react";
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { serverEndpoint } from "../config/config"; // Assuming you have this config file
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/actions"; // Assuming you have this redux action
import './Login.css'; // Import the new CSS file
import { Link } from "react-router-dom";

function Login() {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    // No changes to the logic, keeping it as is.
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        let isValid = true;
        let newErrors = {};

        if (formData.username.length === 0) {
            isValid = false;
            newErrors.username = "Username is mandatory";
        }

        if (formData.password.length === 0) {
            isValid = false;
            newErrors.password = "Password is mandatory";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            const body = {
                username: formData.username,
                password: formData.password
            };
            const config = {
                withCredentials: true
            };
            try {
                const response = await axios.post(`${serverEndpoint}/auth/login`, body, config);
                dispatch({
                    type: SET_USER,
                    payload: response.data.user
                });
            } catch (error) {
                console.log(error);
                setErrors({ message: "Invalid username or password. Please try again." });
            }
        }
    };

    const handleGoogleSuccess = async (authResponse) => {
        try {
            const response = await axios.post(`${serverEndpoint}/auth/google-auth`, {
                idToken: authResponse.credential
            }, {
                withCredentials: true
            });
            dispatch({
                type: SET_USER,
                payload: response.data.user
            });
        } catch (error) {
            console.log(error);
            setErrors({ message: 'Error processing Google auth. Please try again.' });
        }
    };

    const handleGoogleError = async (error) => {
        console.log(error);
        setErrors({ message: 'Error in Google authorization flow. Please try again.' });
    }

    return (
        <div className="login-container">
            <div className="container-fluid h-100">
                <div className="row h-100">
                    {/* Left Branding Column */}
                    <div className="col-md-6 login-branding-col d-none d-md-flex align-items-center justify-content-center">
                        <div className="text-center text-white">
                            <h1 className="display-4">Welcome Back!</h1>
                            <p className="lead">Manage your affiliate links and maximize your earnings with Affiliate++.</p>
                        </div>
                    </div>

                    {/* Right Form Column */}
                    <div className="col-md-6 login-form-col d-flex align-items-center justify-content-center">
                        <div className="login-form-container">
                            <h2 className="text-center mb-4">Sign in to Continue</h2>

                            {/* Error Alert */}
                            {errors.message && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                        id="username"
                                        name="username"
                                        placeholder="Enter your username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                    {errors.username && (
                                        <div className="invalid-feedback">
                                            {errors.username}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>

                                <div className="d-grid mb-3">
                                    <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                                </div>

                                <div className="text-center my-3 d-flex align-items-center">
                                    <hr className="flex-grow-1" />
                                    <span className="px-2 text-muted">OR</span>
                                    <hr className="flex-grow-1" />
                                </div>
                                
                                <div className="d-flex justify-content-center">
                                    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={handleGoogleError}
                                            theme="outline"
                                            size="large"
                                            text="signin_with"
                                            shape="rectangular"
                                        />
                                    </GoogleOAuthProvider>
                                </div>
                            </form>
                            

                              <div className="text-center mt-3">
                        <Link to="/forget-password">Forgot Password?</Link>
                    </div>

                            <div className="text-center mt-4">
                                <p className="text-muted">Don't have an account? <a href="./register">Sign Up</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
