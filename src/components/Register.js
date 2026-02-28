import {
	TextField,
	Button,
	Box,
	Paper,
	Typography
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";

const Register = () => {
	// useeffect
	useEffect(() => {
		document.title = 'Register - CloudVault';
	}, []);

	// State Variables
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isValidated, setIsValidated] = useState(false);
	const [isClicked, setIsclicked] = useState(false);
	const emailRegex =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	// password regex
	const passwordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

	const nameRegex = /^[a-z ,.'-]+$/i;

	// functions
	const useStyles = makeStyles((theme) => ({
		margin: {
			margin: theme.spacing(1),
		},
	}));
	const classes = useStyles();
	const navigate = useNavigate();

	const validateCreds = (e) => {
		e.preventDefault();
		if (
			emailRegex.test(email) &&
			passwordRegex.test(password) &&
			nameRegex.test(name)
		) {
			setIsValidated(true);
			postRegister(e, email, password);
		} else {
			setIsValidated(false);
		}
		setIsclicked(true);
	};

	const postRegister = (e) => {
		e.preventDefault();
		const data = {
			username: name,
			email: email,
			password: password,
		};
		fetch(`${process.env.REACT_APP_API}/register`, {
			method: 'POST',
			withCredentials: true,
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setIsValidated(true);
					navigate('/login');
				} else {
					setIsValidated(false);
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
					<h3 className="form-title">Register</h3>
				</div>
				<TextField
					id="outlined-full-width"
					label="Name"
					style={{ margin: 8 }}
					{...(!isValidated && isClicked ? {
						error: true, helperText:
							name === ""
								? "Name is required"
								: !nameRegex.test(name)
									? "Invalid name format"
									: "",
					} : {})}
					placeholder="Name"
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
					id="outlined-full-width"
					label="Email"
					style={{ margin: 8 }}
					{...(!isValidated && isClicked ? {
						error: true,
						helperText:
							email === ""
								? "Email is required"
								: !emailRegex.test(
									email
								) ? "Invalid email address" : "",
					} : {})}
					placeholder="Email"
					fullWidth
					margin="normal"
					InputLabelProps={{
						shrink: true,
					}}
					autoComplete="off"
					variant="outlined"
					onChange={(e) => {
						setEmail(e.target.value);
					}}
				/>
				<TextField
					id="outlined-full-width"
					type="password"
					label="Password"
					style={{ margin: 8 }}
					{...(!isValidated && isClicked ? {
						error: true,
						helperText:
							password === ""
								? "Password is required"
								: !passwordRegex.test(
									password
								) ? "Password must be 8+ chars, include uppercase, lowercase, number, special char" : "",
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
					<a href="/login" className="forgot-password">
						Already Have an Account? Login.
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
					Register
				</Button>
			</form>
		</div>
	);
};

export default Register;
