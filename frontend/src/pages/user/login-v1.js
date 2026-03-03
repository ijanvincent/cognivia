import React, { useEffect, useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';

function LoginV1() {
	const context = useContext(AppSettings);
	const [redirect, setRedirect] = useState(false);
	
	useEffect(() => {
		context.handleSetAppHeaderNone(true);
		context.handleSetAppSidebarNone(true);
		context.handleSetAppContentClass('p-0');
		
		return function cleanUp() {
			context.handleSetAppHeaderNone(false);
			context.handleSetAppSidebarNone(false);
			context.handleSetAppContentClass('');
		};
		
		// eslint-disable-next-line
	}, []);
	
	function handleSubmit(event) {
		event.preventDefault();
		
		setRedirect(true);
  }
  
	if (redirect) {
		return <Navigate to='/' />;
	}
  
	return (
		<div className="login login-v1">
			<div className="login-container">
				<div className="login-header">
					<div className="brand">
						<div className="d-flex align-items-center">
							<span className="logo"></span> <b>Color</b> Admin
						</div>
						<small>Bootstrap 5 Responsive Admin Template</small>
					</div>
					<div className="icon">
						<i className="fa fa-lock"></i>
					</div>
				</div>
				<div className="login-body">
					<div className="login-content fs-13px">
						<form onSubmit={handleSubmit}>
							<div className="form-floating mb-20px">
								<input type="email" className="form-control fs-13px h-45px" id="emailAddress" placeholder="Email Address" />
								<label htmlFor="emailAddress" className="d-flex align-items-center py-0">Email Address</label>
							</div>
							<div className="form-floating mb-20px">
								<input type="password" className="form-control fs-13px h-45px" id="password" placeholder="Password" />
								<label htmlFor="password" className="d-flex align-items-center py-0">Password</label>
							</div>
							<div className="form-check mb-20px">
								<input className="form-check-input" type="checkbox" value="" id="rememberMe" />
								<label className="form-check-label" htmlFor="rememberMe">
									Remember Me
								</label>
							</div>
							<div className="login-buttons">
								<button type="submit" className="btn h-45px btn-theme d-block w-100 btn-lg">Sign me in</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default LoginV1;