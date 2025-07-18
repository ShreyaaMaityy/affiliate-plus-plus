import { useState } from "react";
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { serverEndpoint } from "../config/config"; // Assuming you have this config file
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/actions"; // Assuming you have this redux action
import './Login.css'; // Reusing the same CSS from the login page for consistency

function Register() {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: ""
    });

    const [errors, setErrors] = useState({});

    // --- No changes to the logic, keeping it as is. ---
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        let newErrors = {};
        let isValid = true;
        if (formData.name.length === 0) {
            newErrors.name = "Name is mandatory";
            isValid = false;
        }
        if (formData.username.length === 0) {
            newErrors.username = "Username is mandatory";
            isValid = false;
        }
        if (formData.password.length === 0) {
            newErrors.password = "Password is mandatory";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validate()) {
            const body = {
                username: formData.username,
                password: formData.password,
                name: formData.name
            };
            const configuration = {
                withCredentials: true
            };
            try {
                const response = await axios.post(
                    `${serverEndpoint}/auth/register`,
                    body, configuration);
                dispatch({
                    type: SET_USER,
                    payload: response.data.user
                });

            } catch (error) {
                if (error?.response?.status === 401) {
                    setErrors({ message: 'User already exists with this username' });
                } else {
                    setErrors({ message: 'Something went wrong, please try again' });
                }
            }
        }
    };

    const handleGoogleSignin = async (authResponse) => {
        try {
            const response = await axios.post(`${serverEndpoint}/auth/google-auth`, {
                idToken: authResponse.credential
            }, {
                withCredentials: true
            });

            dispatch({
                type: SET_USER,
                payload: response.data.userDetails
            });
        } catch (error) {
            console.log(error);
            setErrors({ message: 'Error processing Google sign-in. Please try again.' });
        }
    };

    const handleGoogleSigninFailure = async (error) => {
        console.log(error);
        setErrors({ message: 'Something went wrong during Google sign-in.' });
    };
    // --- End of unchanged logic ---

    return (
        <div className="login-container">
            <div className="container-fluid h-100">
                <div className="row h-100">
                    {/* Left Branding Column */}
                    <div className="col-md-6 login-branding-col d-none d-md-flex align-items-center justify-content-center">
                        <div className="text-center text-white">
                            <h1 className="display-4">Join Affiliate++</h1>
                            <p className="lead">Start turning your content into cash. It's free to get started.</p>
                        </div>
                    </div>

                    {/* Right Form Column */}
                    <div className="col-md-6 login-form-col d-flex align-items-center justify-content-center">
                        <div className="login-form-container">
                            <h2 className="text-center mb-4">Create Your Account</h2>

                            {/* Error Alert */}
                            {errors.message && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        id="name"
                                        name="name"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                    {errors.name && (
                                        <div className="invalid-feedback">{errors.name}</div>
                                    )}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="username">email</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                        id="username"
                                        name="username"
                                        placeholder="Enter your email address"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                    {errors.username && (
                                        <div className="invalid-feedback">{errors.username}</div>
                                    )}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        name="password"
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback">{errors.password}</div>
                                    )}
                                </div>

                                <div className="d-grid mb-3">
                                    <button type="submit" className="btn btn-primary btn-block">Create Account</button>
                                </div>

                                <div className="text-center my-3 d-flex align-items-center">
                                    <hr className="flex-grow-1" />
                                    <span className="px-2 text-muted">OR</span>
                                    <hr className="flex-grow-1" />
                                </div>
                                
                                <div className="d-flex justify-content-center">
                                    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
                                        <GoogleLogin
                                            onSuccess={handleGoogleSignin}
                                            onError={handleGoogleSigninFailure}
                                            theme="outline"
                                            size="large"
                                            text="signup_with"
                                            shape="rectangular"
                                        />
                                    </GoogleOAuthProvider>
                                </div>
                            </form>
                            
                            <div className="text-center mt-4">
                                <p className="text-muted">Already have an account? <a href="/login">Sign In</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;