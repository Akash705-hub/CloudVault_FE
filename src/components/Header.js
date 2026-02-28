import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";

function Header({ userName, setIsLoggedIn }) {
	const useStyles = makeStyles((theme) => ({
		margin: {
			margin: 10,
		},
		avatar: {
			backgroundColor: 'red',
		},
	}));
	const navigate = useNavigate();

	const handleLogout = () => {
		// Logout Post Request
		fetch(`${process.env.REACT_APP_API}/logout`, {
			method: 'POST',
			withCredentials: true,
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					navigate('/login');
				}
			})
			.catch((err) => console.log(err));
	};

	const classes = useStyles();
	return (
		<div className="header">
			<div className="logo">
				<img
					src={process.env.PUBLIC_URL + '/Static/CloudVault.svg'}
					alt="Logo"
				/>
				<h1>CloudVault</h1>
			</div>

			<div className="avatar">
				<Button
					type="submit"
					variant="contained"
					size="small"
					color="primary"
					className={classes.margin}
					onClick={handleLogout}
				>
					Logout
				</Button>
				<Avatar className={classes.avatar}>{userName[0]}</Avatar>
			</div>
		</div>
	);
}

export default Header;
