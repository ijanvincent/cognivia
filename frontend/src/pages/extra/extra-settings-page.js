import React, { useEffect } from 'react';
import { Icon } from '@iconify/react';

function ExtraSettingsPage() {
  useEffect(() => {
		const sections = document.querySelectorAll('#bsSpyContent > div');
		const navLinks = document.querySelectorAll('#bsSpyTarget > a');

		function activateNavLink(id) {
			navLinks.forEach((link) => {
				if (link && link.classList) {
					link.classList.remove('active');
				}
			});
			var target = document.querySelector(`nav a[href*='${id}']`);
			if (target) {
				target.classList.add('active');
			}
		}

		function isElementInViewport(el) {
			const rect = el.getBoundingClientRect();
			return (
				rect.top >= 0 &&
				rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
			);
		}

		function handleViewport() {
			let activeSection = null;
			for (let i = sections.length - 1; i >= 0; i--) {
				if (isElementInViewport(sections[i])) {
					activeSection = sections[i].getAttribute('id');
					activateNavLink(activeSection);
					break;
				}
			}

			let combinedHeight = 0;
			let sectionIndex = Array.from(sections).findIndex((section) => section.getAttribute('id') === activeSection);
			for (let i = sectionIndex; i < sections.length; i++) {
				combinedHeight += sections[i].offsetHeight;
			}
			if (combinedHeight <= window.innerHeight) {
				activateNavLink(activeSection);
			}
		}

		window.onscroll = handleViewport;
		// eslint-disable-next-line
	}, []);

  return (
    <div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><a href="#/">Home</a></li>
				<li className="breadcrumb-item"><a href="#/">Extra</a></li>
				<li className="breadcrumb-item active">Settings Page</li>
			</ol>
			<h1 className="page-header">Settings Page <small>header small text goes here...</small></h1>
			<hr className="mb-4" />

			<div className="row">
				<div style={{width: '230px'}}>
					<nav className="navbar navbar-sticky d-none d-xl-block my-n4 py-4 h-100 text-end">
						<nav className="nav" id="bsSpyTarget">
							<a className="nav-link active" href="#general" data-toggle="scroll-to">General</a>
							<a className="nav-link" href="#notifications" data-toggle="scroll-to">Notifications</a>
							<a className="nav-link" href="#privacyAndSecurity" data-toggle="scroll-to">Privacy and security</a>
							<a className="nav-link" href="#payment" data-toggle="scroll-to">Payment</a>
							<a className="nav-link" href="#shipping" data-toggle="scroll-to">Shipping</a>
							<a className="nav-link" href="#mediaAndFiles" data-toggle="scroll-to">Media and Files</a>
							<a className="nav-link" href="#languages" data-toggle="scroll-to">Languages</a>
							<a className="nav-link" href="#system" data-toggle="scroll-to">System</a>
							<a className="nav-link" href="#resetSettings" data-toggle="scroll-to">Reset settings</a>
						</nav>
					</nav>
				</div>
				<div className="col-xl-8" id="bsSpyContent">
					<div id="general" className="mb-4 pb-3">
						<h4 className="d-flex align-items-center mb-2">
							<Icon className="iconify fs-24px me-2 text-body text-opacity-75 my-n1" icon="solar:user-bold-duotone" /> General
						</h4>
						<p>View and update your general account information and settings.</p>
						<div className="card">
							<div className="list-group list-group-flush fw-bold">
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Name</div>
										<div className="text-body text-opacity-60">Sean Ngu</div>
									</div>
									<div className="w-100px">
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px">Edit</a>
									</div>
								</div>
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Username</div>
										<div className="text-body text-opacity-60">@seantheme</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px">Edit</a>
									</div>
								</div>
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Phone</div>
										<div className="text-body text-opacity-60">+1-202-555-0183</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px">Edit</a>
									</div>
								</div>
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Email address</div>
										<div className="text-body text-opacity-60">support@seantheme.com</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary disabled w-100px">Edit</a>
									</div>
								</div>
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Password</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px">Edit</a>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div id="notifications" className="mb-4 pb-3">
						<h4 className="d-flex align-items-center mb-2 mt-3">
							<Icon className="iconify fs-24px me-2 text-body text-opacity-75 my-n1" icon="solar:bell-bold-duotone" /> 
							Notifications
						</h4>
						<p>Enable or disable what notifications you want to receive.</p>
						<div className="card">
							<div className="list-group list-group-flush fw-bold">
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Comments</div>
										<div className="text-body text-opacity-60 d-flex align-items-center">
											<i className="fa fa-circle fs-6px mt-1px fa-fw text-success me-2"></i> Enabled (Push, SMS)
										</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px">Edit</a>
									</div>
								</div>
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Tags</div>
										<div className="text-body text-opacity-60 d-flex align-items-center">
											<i className="fa fa-circle fs-6px mt-1px fa-fw text-body text-opacity-25 me-2"></i> Disabled
										</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px">Edit</a>
									</div>
								</div>
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Reminders</div>
										<div className="text-body text-opacity-60 d-flex align-items-center">
											<i className="fa fa-circle fs-6px mt-1px fa-fw text-success me-2"></i> Enabled (Push, Email, SMS)
										</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px">Edit</a>
									</div>
								</div>
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>New orders</div>
										<div className="text-body text-opacity-60 d-flex align-items-center">
											<i className="fa fa-circle fs-6px mt-1px fa-fw text-success me-2"></i> Enabled (Push, Email, SMS)
										</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px">Edit</a>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div id="privacyAndSecurity" className="mb-4 pb-3">
						<h4 className="d-flex align-items-center mb-2 mt-3">
							<Icon className="iconify fs-24px me-2 text-body text-opacity-75 my-n1" icon="solar:lock-password-bold-duotone" /> 
							Privacy and security
						</h4>
						<p>Limit the account visibility and the security settings for your website.</p>
						<div className="card">
							<div className="list-group list-group-flush fw-bold">
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Who can see your future posts?</div>
										<div className="text-body text-opacity-60 d-flex align-items-center">
											Friends only
										</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px">Edit</a>
									</div>
								</div>
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Photo tagging</div>
										<div className="text-body text-opacity-60 d-flex align-items-center">
											<i className="fa fa-circle fs-6px mt-1px fa-fw text-success me-2"></i> Enabled
										</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px">Edit</a>
									</div>
								</div>
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Location information</div>
										<div className="text-body text-opacity-60 d-flex align-items-center">
											<i className="fa fa-circle fs-6px mt-1px fa-fw text-body text-opacity-25 me-2"></i> Disabled
										</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px">Edit</a>
									</div>
								</div>
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Firewall</div>
										<div className="text-body text-opacity-60 d-block d-xl-flex align-items-center">
											<div className="d-flex align-items-center"><i className="fa fa-circle fs-6px mt-1px fa-fw text-body text-opacity-25 me-2"></i> Disabled</div>
											<span className="bg-warning bg-opacity-10 text-warning ms-xl-3 mt-1 d-inline-block mt-xl-0 px-1 rounded-sm">
												<i className="fa fa-exclamation-circle text-warning fs-12px me-1"></i> 
												<span className="text-warning">Please enable the firewall for your website</span>
											</span>
										</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px">Edit</a>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div id="payment" className="mb-4 pb-3">
						<h4 className="d-flex align-items-center mb-2 mt-3">
							<Icon className="iconify fs-24px me-2 text-body text-opacity-75 my-n1" icon="solar:bag-4-bold-duotone" /> 
							Payment
						</h4>
						<p>Manage your website payment provider</p>
						<div className="card">
							<div className="list-group list-group-flush fw-bold">
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Allowed payment method</div>
										<div className="text-body text-opacity-60">
											Paypal, Credit Card, Apple Pay, Amazon Pay, Google Wallet, Alipay, Wechatpay
										</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px">Edit</a>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div id="shipping" className="mb-4 pb-3">
						<h4 className="d-flex align-items-center mb-2 mt-3">
							<Icon className="iconify fs-24px me-2 text-body text-opacity-75 my-n1" icon="solar:box-bold-duotone" /> 
							Shipping
						</h4>
						<p>Allowed shipping area and zone setting</p>
						<div className="card">
							<div className="list-group list-group-flush fw-bold">
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Allowed shipping method</div>
										<div className="text-body text-opacity-60">
											Local, Domestic
										</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px">Edit</a>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div id="mediaAndFiles" className="mb-4 pb-3">
						<h4 className="d-flex align-items-center mb-2 mt-3">
							<Icon className="iconify fs-24px me-2 text-body text-opacity-75 my-n1" icon="solar:camera-bold-duotone" /> 
							Media and Files
						</h4>
						<p>Allowed files and media format upload setting</p>
						<div className="card">
							<div className="list-group list-group-flush fw-bold">
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Allowed files and media format</div>
										<div className="text-body text-opacity-60">
											.png, .jpg, .gif, .mp4
										</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px">Edit</a>
									</div>
								</div>
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Media and files cdn</div>
										<div className="text-body text-opacity-60 d-flex align-items-center">
											<i className="fa fa-circle fs-6px mt-1px fa-fw text-body text-opacity-25 me-2"></i> Disabled
										</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px">Edit</a>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div id="languages" className="mb-4 pb-3">
						<h4 className="d-flex align-items-center mb-2 mt-3">
							<Icon className="iconify fs-24px me-2 text-body text-opacity-75 my-n1" icon="solar:globus-bold-duotone" /> 
							Languages
						</h4>
						<p>Language font support and auto translation enabled</p>
						<div className="card">
							<div className="list-group list-group-flush fw-bold">
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Language enabled</div>
										<div className="text-body text-opacity-60">
											English (default), Chinese, France, Portuguese, Japense
										</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px">Edit</a>
									</div>
								</div>
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Auto translation</div>
										<div className="text-body text-opacity-60 d-flex align-items-center">
											<i className="fa fa-circle fs-6px mt-1px fa-fw text-success me-2"></i> Enabled
										</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px">Edit</a>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div id="system" className="mb-4 pb-3">
						<h4 className="d-flex align-items-center mb-2 mt-3">
							<Icon className="iconify fs-24px me-2 text-body text-opacity-75 my-n1" icon="solar:ssd-round-bold-duotone" /> 
							System
						</h4>
						<p>System storage, bandwidth and database setting</p>
						<div className="card">
							<div className="list-group list-group-flush fw-bold">
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Web storage</div>
										<div className="text-body text-opacity-60">
											40.8gb / 100gb
										</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px">Manage</a>
									</div>
								</div>
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Monthly bandwidth</div>
										<div className="text-body text-opacity-60">
											Unlimited
										</div>
									</div>
								</div>
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Database</div>
										<div className="text-body text-opacity-60">
											MySQL version 8.0.19
										</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-secondary w-100px disabled">Update</a>
									</div>
								</div>
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Platform</div>
										<div className="text-body text-opacity-60">
											PHP 7.4.4, NGINX 1.17.0
										</div>
									</div>
									<div>
										<a href="#modalEdit" data-bs-toggle="modal" className="btn btn-success w-100px">Update</a>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div id="resetSettings" className="mb-4 pb-3">
						<h4 className="d-flex align-items-center mb-2 mt-3">
							<Icon className="iconify fs-24px me-2 text-body text-opacity-75 my-n1" icon="solar:restart-bold-duotone" /> 
							Reset settings
						</h4>
						<p>Reset all website setting to factory default setting.</p>
						<div className="card">
							<div className="list-group list-group-flush fw-bold">
								<div className="list-group-item d-flex align-items-center">
									<div className="flex-fill">
										<div>Reset Settings</div>
										<div className="text-body text-opacity-60">
											This action will clear and reset all the current website setting.
										</div>
									</div>
									<div>
										<a href="#/" className="btn btn-secondary w-100px">Reset</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="modal fade" id="modalEdit">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Edit name</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
						</div>
						<div className="modal-body">
							<div className="mb-3">
								<label className="form-label">Name</label>
								<div className="row">
									<div className="col-4">
										<input className="form-control" placeholder="First" defaultValue="Sean" />
									</div>
									<div className="col-4">
										<input className="form-control" placeholder="Middle" defaultValue="" />
									</div>
									<div className="col-4">
										<input className="form-control" placeholder="Last" defaultValue="Ngu" />
									</div>
								</div>
							</div>
							<div className="alert bg-body">
								<b>Please note:</b> If you change your name, you can't change it again for 60 days. Don't add any unusual capitalization, punctuation, characters or random words. <a href="#/" className="alert-link">Learn more.</a>
							</div>
							<div className="mb-3">
								<label className="form-label">Other Names</label>
								<div>
									<a href="#/" className="btn btn-secondary">
										<i className="fa fa-plus fa-fw"></i> Add other names </a>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-bs-dismiss="modal">Close</button>
							<button type="button" className="btn btn-theme">Save changes</button>
						</div>
					</div>
				</div>
			</div>
    </div>
  );
}

export default ExtraSettingsPage;