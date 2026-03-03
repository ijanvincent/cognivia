import React from 'react';

function DropdownMegaMenu() {
	return (
		<div className="collapse d-md-block me-auto" id="top-navbar">
			<div className="navbar-nav">
				<div className="navbar-item dropdown dropdown-lg">
					<a href="#/" className="navbar-link dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
						<i className="fa fa-th-large fa-fw me-1"></i>
						<span className="d-lg-inline d-md-none">Mega</span>
						<b className="caret ms-1"></b>
					</a>
					<div className="dropdown-menu dropdown-menu-lg text-gray-900">
						<div className="row">
							<div className="col-lg-4 col-md-4">
								<div className="h5 fw-bolder mb-2">UI Kits</div>
								<div className="row mb-3">
									<div className="col-lg-6">
										<ul className="nav d-block fw-bold">
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> FontAwesome</a></li>
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Ionicons</a></li>
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Simple Line Icons</a></li>
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Typography</a></li>
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Media Object</a></li>
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Widget Boxes</a></li>
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Tabs & Accordions</a></li>
										</ul>
									</div>
									<div className="col-lg-6">
										<ul className="nav d-block fw-bold">
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Unlimited Nav Tabs</a></li>
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Modal & Notification</a></li>
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Buttons</a></li>
										</ul>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-4">
								<div className="h5 fw-bolder mb-2">Page Options <span className="badge bg-pink ms-2">11</span></div>
								<div className="row">
									<div className="col-lg-6">
										<ul className="nav d-block fw-bold">
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Blank Page</a></li>
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Page with Footer <span className="badge bg-success py-1">NEW</span></a></li>
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Page without Sidebar</a></li>
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Page with Right Sidebar</a></li>
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Page with Minified Sidebar</a></li>
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Page with Two Sidebar</a></li>
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Page with Line Icons</a></li>
										</ul>
									</div>
									<div className="col-lg-6">
										<ul className="nav d-block fw-bold">
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Full Height Content</a></li>
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Page with Mega Menu</a></li>
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Page with Light Sidebar</a></li>
											<li><a href="#/" className="text-ellipsis text-dark text-decoration-none"><i className="fa fa-chevron-right fa-fw text-gray-500"></i> Page with Large Sidebar</a></li>
										</ul>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-4 fw-bold">
								<div className="h5 fw-bolder mb-2">Paragraph</div>
								<p>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis libero purus, fermentum at libero convallis, auctor dignissim mauris. Nunc laoreet pellentesque turpis sodales ornare. Nunc vestibulum nunc lorem, at sodales velit malesuada congue. Nam est tortor, tincidunt sit amet eros vitae, aliquam finibus mauris.
								</p>
								<p>
									Fusce ac ligula laoreet ante dapibus mattis. Nam auctor vulputate aliquam. Suspendisse efficitur, felis sed elementum eleifend, ipsum tellus sodales nisi, ut condimentum nisi sem in nibh. Phasellus suscipit vulputate purus at venenatis. Quisque luctus tincidunt tempor.
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="navbar-item">
					<a href="#/" className="navbar-link d-flex align-items-center">
						<i className="fa fa-gem fa-fw me-1"></i>
						<span className="d-lg-inline d-md-none">Client</span>
					</a>
				</div>
				<div className="navbar-item dropdown">
					<a href="#/" className="navbar-link dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
						<i className="fa fa-database fa-fw me-1"></i>
						<span className="d-lg-inline d-md-none">New</span>
						 <b className="caret ms-1"></b>
					</a>
					<div className="dropdown-menu">
						<a href="#/" className="dropdown-item">Action</a>
						<a href="#/" className="dropdown-item">Another action</a>
						<a href="#/" className="dropdown-item">Something else here</a>
						<div className="dropdown-divider"></div>
						<a href="#/" className="dropdown-item">Separated link</a>
						<div className="dropdown-divider"></div>
						<a href="#/" className="dropdown-item">One more separated link</a>
					</div>
				</div>
			</div>
		</div>
	)
}

export default DropdownMegaMenu;
