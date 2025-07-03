import { useState } from "react";
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { serverEndpoint } from "../config/config";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/actions";

function Login() {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

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
            // Data to be sent to the server
            const body = {
                username: formData.username,
                password: formData.password
            };
            const config = {
                // Tells axios to include cookie in the request + some other auth headers
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
                setErrors({ message: "Something went wrong, please try again" });
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
            setErrors({ message: 'Error processing google auth, please try again' });
        }
    };

    const handleGoogleError = async (error) => {
        console.log(error);
        setErrors({ message: 'Error in google authorization flow, please try again' });
    }

    return (
        <div className="container py-5">
  <div className="row justify-content-center">
    <div className="col-md-6 col-lg-5">
      <div className="card shadow border-0 rounded-4 p-4">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Welcome Back</h2>
          <p className="text-muted">Sign in to continue</p>
        </div>

        {/* Error Alert */}
        {errors.message && (
          <div className="alert alert-danger" role="alert">
            {errors.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              id="username"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <label htmlFor="username">Username</label>
            {errors.username && (
              <div className="invalid-feedback">{errors.username}</div>
            )}
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <label htmlFor="password">Password</label>
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-primary btn-lg shadow-sm">
              Sign In
            </button>
          </div>
        </form>

        <div className="text-center">
          <div className="my-4 d-flex align-items-center text-muted">
            <hr className="flex-grow-1" />
            <span className="px-2 small">OR</span>
            <hr className="flex-grow-1" />
          </div>
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  </div>
</div>

    );
}

export default Login;