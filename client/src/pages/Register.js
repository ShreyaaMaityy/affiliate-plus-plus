import { useState } from "react";
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { serverEndpoint } from "../config/config";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/actions";

function Register() {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: ""
    });

    const [errors, setErrors] = useState({});

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
        if (formData.username.length === 0) {
            newErrors.username = "Username is mandatory";
            isValid = false;
        }

        if (formData.password.length === 0) {
            newErrors.password = "Password is mandatory";
            isValid = false;
        }

        if (formData.name.length === 0) {
            newErrors.name = "Name is mandatory";
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
                    setErrors({ message: 'User exist with the given email' });
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
            setErrors({ message: 'Something went wrong while google signin' });
        }
    };

    const handleGoogleSigninFailure = async (error) => {
        console.log(error);
        setErrors({ message: 'Something went wrong while google signin' });
    };

    return (
        <div className="container py-5">
  <div className="row justify-content-center">
    <div className="col-md-6 col-lg-5">
      <div className="card shadow border-0 rounded-4 p-4">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Create Your Account</h2>
          <p className="text-muted">Sign up with your details below</p>
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
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              id="name"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            <label htmlFor="name">Name</label>
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

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
              Sign Up
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
              onSuccess={handleGoogleSignin}
              onError={handleGoogleSigninFailure}
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  </div>
</div>

    );
}

export default Register;