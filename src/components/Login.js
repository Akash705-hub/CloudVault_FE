import { TextField, Button, Box, Paper, Typography, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";

const Login = () => {
	const navigate = useNavigate();

	// useEffect
	useEffect(() => {
		document.title = 'Login - cloudVault';

		// get request with fetch
		fetch(`${process.env.REACT_APP_API}/is-logged`, {
			method: 'GET',
			withCredentials: true,
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					navigate('/');
				}
			})
			.catch((err) => console.log(err));
	}, [navigate]);

	// state Variables
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [isValidated, setIsValidated] = useState(false);
	const [isClicked, setIsclicked] = useState(false);
	const [serverError, setServerError] = useState("");

	// Functions
	const useStyles = makeStyles((theme) => ({
		margin: {
			margin: theme.spacing(1),
		},
	}));
	const classes = useStyles();

	const validateCreds = (e) => {
		e.preventDefault();

		// Username regex
		const nameRegex = /^[a-z ,.'-]+$/i;

		// Password Regex
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

		if (nameRegex.test(name) && passwordRegex.test(password)) {
			setIsValidated(true);

			// Posting to the API
			e.preventDefault();
			postLogin(name, password);
		} else {
			setIsValidated(false);
		}
		setIsclicked(true);
	};

	const postLogin = (name, password) => {
		const data = {
			username: name,
			password: password,
		};
		fetch(`${process.env.REACT_APP_API}/login`, {
			method: 'POST',
			withCredentials: true,
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then((res) => {
				console.log(res);
				return res.json()
			})
			.then((data) => {
				console.log(data);
				if (data.success) {
					navigate('/');
				} else {
					setIsValidated(false);
					setServerError("Invalid username or password")
				}
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="login-container">
			<form className="login-form">
				<div className="form-header">
					<img
						className="form-logo"
						src={process.env.PUBLIC_URL + '/Static/CloudVault.svg'}
						alt="Drive Logo"
					/>
					<h3 className="form-title">Login</h3>
				</div>

				{serverError && (
					<Alert severity="error" style={{ marginBottom: "16px" }}>
						{serverError}
					</Alert>
				)}


				<TextField
					id="outlined-full-width login-email"
					label="Username"
					style={{ margin: 8 }}
					{...(!isValidated && isClicked ? {
						error: true,
						helperText: name === "" ? "Username is required" : ""
					} : {})}
					placeholder="Username"
					fullWidth
					margin="normal"
					InputLabelProps={{
						shrink: true,
					}}
					autoComplete="off"
					variant="outlined"
					onChange={(e) => {
						setName(e.target.value);
					}}
				/>
				<TextField
					id="outlined-full-width login-password"
					type="password"
					label="Password"
					style={{ margin: 8 }}
					{...(!isValidated && isClicked ? {
						error: true,
						helperText: password === "" ? "Password is required" : ""
					} : {})}
					placeholder="Password"
					fullWidth
					margin="normal"
					InputLabelProps={{
						shrink: true,
					}}
					autoComplete="off"
					variant="outlined"
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>

				<div className="links-div">
					<a href="/register" className="forgot-password">
						Dont have an Account? Register Now.
					</a>
				</div>

				<Button
					type="submit"
					variant="contained"
					size="medium"
					color="primary"
					className={classes.margin}
					onClick={validateCreds}
				>
					Login
				</Button>
			</form>
		</div>
	);
};

export default Login;
