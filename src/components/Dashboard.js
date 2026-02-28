import Header from "./Header";
import SideBar from "./SideBar";
import Main from "./Main";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

const Dashboard = () => {
	const navigate = useNavigate();

	console.log(process.env.REACT_APP_API);

	// API GET Request for is-logged
	useEffect(() => {
		document.title = 'CloudVault';
		let url =
		process.env.REACT_APP_API + "/is-logged";
		// get request with fetch
		fetch(url, {
			method: 'GET',
			withCredentials: true,
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (!data.success) {
					setIsLoggedIn(false);
					navigate('/login');
				} else {
					setIsLoggedIn(true);
					setUserName(data.user);
				}
			})
			.catch((err) => console.log(err));
	}, [navigate]);

	// State Variables
	const [userName, setUserName] = useState('');
	const [sideBarOption, setSideBarOption] = useState(0);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [reRender, setReRender] = useState(0);

	if (isLoggedIn)
		return (
			<div className="dashboard-container">
				{/* Header */}
				<Header userName={userName} setIsLoggedIn={setIsLoggedIn} />
				<div className="main-flex">
					{/* Side Bar */}
					<SideBar
						setSideBarOption={setSideBarOption}
						reRender={reRender}
						setReRender={setReRender}
					/>
					{/* Main */}
					<Main
						sideBarOption={sideBarOption}
						reRender={reRender}
						setReRender={setReRender}
					/>
				</div>
			</div>
		);
	else
		return (
			<>
				<h1>Checking Credentials...</h1>
			</>
		);
};

export default Dashboard;
