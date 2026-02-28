import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/" element={<Dashboard />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
