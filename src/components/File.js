import { useState } from 'react';

import { TextField } from '@mui/material'
import {
	Card,
	CardContent,
	CardActions,
	IconButton,
	Typography,
	Box
} from "@mui/material";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem";

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	borderRadius: 5,
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
};

const Main = ({ metaData, reRender, setReRender }) => {
	const [open, setOpen] = useState(false);
	const [newFileName, setNewFileName] = useState(metaData.filename);
	const [openShare, setOpenShare] = useState(false);

	const [anchorEl, setAnchorEl] = useState(null);
	const openMenu = Boolean(anchorEl);

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [sasUrl, setSasUrl] = useState("");
	const [expiry, setExpiry] = useState("3600");

	const handleShare = () => {
		setOpenShare(true);
	};

	const copyToClipboard = () => { navigator.clipboard.writeText(sasUrl); };

	// HANDLE DELETE
	const handleDelete = () => {
		const data = {
			filename: metaData.filename,
		};

		fetch(`${process.env.REACT_APP_API}/deleteBlob`, {
			method: 'DELETE',
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
					reRender ? setReRender(0) : setReRender(1);
				}
			})
			.catch((err) => console.log(err));
	};

	// HANDLE RENAME
	const handleRename = () => {
		const data = {
			filename: metaData.filename,
			metadata: {
				filename: newFileName,
				createdate: metaData.createdate,
				lastmodified: new Date(Date.now()).toDateString(),
				filesize: metaData.filesize,
				type: metaData.type,
			},
		};
		fetch(`${process.env.REACT_APP_API}/renameBlob`, {
			method: 'PATCH',
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
					handleClose();
					reRender ? setReRender(0) : setReRender(1);
				}
			})
			.catch((err) => console.log(err));
	};

	// HANDLE DOWNLOAD
	const handleDownload = () => {
		const data = {
			filename: metaData.filename,
		};

		fetch(`${process.env.REACT_APP_API}/getSASUrl`, {
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
					const a = document.createElement('a');
					a.style.display = 'none';
					document.body.appendChild(a);

					// a.href = URL.createObjectURL(blobFile);
					a.href = data.url;

					// Use download attribute to set set desired file name
					a.setAttribute('download', metaData.filename);

					// Trigger the download by simulating click
					a.click();

					// Cleanup
					window.URL.revokeObjectURL(a.href);
					document.body.removeChild(a);

					// getFile(data.url);
				}
			})
			.catch((err) => console.log(err));
	};
	return (
		<div className="file">
			<div className="file-header">
				<InsertDriveFileIcon />
				<p className="file-name" title={metaData.filename}>
					{metaData.filename}
				</p>
				<IconButton onClick={handleMenuOpen}>
					<MoreVertIcon />
				</IconButton>

				<Menu
					anchorEl={anchorEl}
					open={openMenu}
					onClose={handleMenuClose}
					PaperProps={{
						sx: {
							borderRadius: 2,
							boxShadow: 3,
							minWidth: 150,
						},
					}}
				>
					<MenuItem onClick={() => { handleDownload(); handleMenuClose(); }}>
						Download
					</MenuItem>

					<MenuItem onClick={() => { handleOpen(); handleMenuClose(); }}>
						Rename
					</MenuItem>

					<MenuItem onClick={() => { handleDelete(); handleMenuClose(); }}>
						Delete
					</MenuItem>

					<MenuItem onClick={() => { handleShare(); handleMenuClose(); }}>
						Share
					</MenuItem>
				</Menu>
				{/* <IconButton onClick={handleDownload}>
					<DownloadIcon />
				</IconButton> */}
			</div>
			<div className="file-info">
				Created: {metaData.createdate} <br />
				Last Modified: {metaData.lastmodified} <br />
				File Size: {metaData.filesize} MB
				<br />
				<br />
			</div>

			{/* <div className="file-footer">
				<IconButton onClick={handleDelete}>
					<DeleteIcon />
				</IconButton>
				<IconButton onClick={handleOpen}>
					<CreateIcon />
				</IconButton>
			</div> */}
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						<TextField
							required
							id="outlined-full-width"
							label="File Name"
							margin="normal"
							variant="outlined"
							fullWidth
							style={{ margin: 8 }}
							InputLabelProps={{
								shrink: true,
							}}
							defaultValue={metaData.filename}
							onChange={(e) => {
								setNewFileName(e.target.value);
							}}
						/>
					</Typography>

					{/* SAVE / EDIT / UPDATE REQUEST */}
					<Button
						style={{ margin: 8 }}
						variant="contained"
						onClick={handleRename}
					>
						Save
					</Button>
				</Box>
			</Modal>


			<Modal
				open={openShare}
				onClose={() => setOpenShare(false)}
				aria-labelledby="share-modal-title"
			>
				<Box sx={style}>
					<Typography variant="h6" id="share-modal-title">
						Share File
					</Typography>

					<Typography sx={{ mt: 2, mb: 1 }}>
						Expiration
					</Typography>

					<TextField
						select
						fullWidth
						value={expiry}
						onChange={(e) => setExpiry(e.target.value)}
						SelectProps={{ native: true }}
					>
						<option value="900">15 minutes</option>
						<option value="3600">1 hour</option>
						<option value="86400">24 hours</option>
						<option value="604800">7 days</option>
					</TextField>

					{sasUrl && (
						<>
							<Typography sx={{ mt: 3 }}>Shareable Link</Typography>
							<TextField
								fullWidth
								value={sasUrl}
								InputProps={{ readOnly: true }}
								sx={{ mt: 1 }}
							/>

							<Button
								variant="contained"
								fullWidth
								sx={{ mt: 2 }}
								onClick={copyToClipboard}
							>
								Copy Link
							</Button>
						</>
					)}
				</Box>
			</Modal>

		</div>
	);
};
export default Main;
