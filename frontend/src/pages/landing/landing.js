import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import 'lity';
import 'lity/dist/lity.min.css';
import { AppSettings } from './../../config/app-settings.js';
import { Icon } from '@iconify/react';

function Landing() {
	const context = useContext(AppSettings);
 
  useEffect(() => {
		context.handleSetAppSidebarNone(true);
    context.handleSetAppHeaderNone(true);
    context.handleSetAppContentClass('p-0');

    return function cleanUp() {
      context.handleSetAppSidebarNone(false);
      context.handleSetAppHeaderNone(false);
      context.handleSetAppContentClass('');
    };
    
    // eslint-disable-next-line
  }, []);
  
	return (
		<div>
			<div id="header" className="app-header navbar navbar-expand-lg p-0">
				<div className="container-xxl px-3 px-lg-5 d-flex align-items-center flex-1">
					<button type="button" className="navbar-mobile-toggler px-0 me-3" data-bs-toggle="collapse" data-bs-target="#navbarContent">
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
					</button>
					<Link to="/" className="navbar-brand px-0 ms-0 justify-content-start">
						<span className="navbar-logo d-md-block d-none"></span> <b className="me-3px">Color</b> Admin
					</Link>
					<div className="collapse navbar-collapse ms-auto d-md-flex align-items-center" id="navbarContent">
						<div className="navbar-nav ms-auto fw-500 d-md-flex justify-content-end">
							<div className="nav-item me-md-3 me-lg-2">
								<a href="#home" className="nav-link text-body">Home</a>
							</div>
							<div className="nav-item me-md-3 me-lg-2">
								<a href="#about" className="nav-link text-body">About</a>
							</div>
							<div className="nav-item me-md-3 me-lg-2">
								<a href="#features" className="nav-link text-body">Features</a>
							</div>
							<div className="nav-item me-md-3 me-lg-2">
								<a href="#pricing" className="nav-link text-body">Pricing</a>
							</div>
							<div className="nav-item me-md-3 me-lg-2">
								<a href="#testimonials" className="nav-link text-body">Testimonials</a>
							</div>
							<div className="nav-item me-md-3 me-lg-2">
								<a href="#blog" className="nav-link text-body">Blog</a>
							</div>
							<div className="nav-item me-md-3 me-lg-2">
								<a href="#contact" className="nav-link text-body">Contact</a>
							</div>
						</div>
					</div>
					<div className="ms-3">
						<Link to="/" className="btn btn-theme fw-bold rounded-pill px-3 py-2 text-nowrap">Get started <i className="fa fa-arrow-right ms-2 opacity-5"></i></Link>
					</div>
				</div>
			</div>
			
			<div id="home" className="py-5 position-relative bg-black bg-size-cover" data-bs-theme="dark">
				<div className="container-xxl p-3 p-lg-5">
					<div className="div-hero-content z-3 position-relative">
						<div className="row">
							<div className="col-lg-6">
								<h1 className="display-6 fw-light mb-2 mt-4 text-white">
									Built with <span className="fw-bold border-bottom">Color Admin</span> Template
								</h1>
								<div className="fs-18px text-body text-opacity-75 mb-4">
									Join thousands of users worldwide who rely on Color Admin Template <span className="d-xl-inline d-none"><br /></span>
									to kickstart their startups, enhance company projects, hone creative skills, <span className="d-xl-inline d-none"><br /></span>
									or tackle freelance tasks.
								</div>
								
								<div className="text-body text-opacity-35 h5 mb-4">
									<i className="fab fa-bootstrap fa-2x fa-fw"></i>
									<i className="fab fa-node-js fa-2x fa-fw"></i>
									<i className="fab fa-vuejs fa-2x fa-fw"></i>
									<i className="fab fa-angular fa-2x fa-fw"></i>
									<i className="fab fa-react fa-2x fa-fw"></i>
									<i className="fab fa-laravel fa-2x fa-fw"></i>
									<i className="fab fa-npm fa-2x fa-fw"></i>
								</div>
								
								<div className="mb-2">
									<Link to="/" className="btn btn-lg btn-theme px-3">Discover Our Template <i className="fa fa-arrow-right ms-2 opacity-5"></i></Link>
								</div>
								
								<hr className="my-4" />
								
								<div className="row text-body mt-4 mb-4">
									<div className="col-6 mb-3 mb-lg-0">
										<div className="d-flex align-items-center">
											<div className="h1 text-body text-opacity-25 me-3"><Icon icon="bi:download" /></div>
											<div>
												<div className="fw-500 mb-0 h3">1.8k+</div>
												<div className="fw-500 text-body text-opacity-75">Downloads / Purchases</div>
											</div>
										</div>
									</div>
									<div className="col-6">
										<div className="d-flex align-items-center">
											<div className="h1 text-body text-opacity-25 me-3"><Icon icon="bi:bootstrap" /></div>
											<div>
												<div className="fw-500 mb-0 h3">5.3.3</div>
												<div className="fw-500 text-body text-opacity-75">Bootstrap Version</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				
					
				<div className="position-absolute top-0 bottom-0 end-0 w-50 p-5 overflow-hidden d-none d-lg-flex align-items-center z-2">
					<img className="w-100 d-block position-relative" alt="Color Admin" src="/assets/img/landing/mockup-1-default.jpg" />
				</div>
				<div className="position-absolute bg-size-cover bg-position-center bg-no-repeat top-0 start-0 w-100 h-100" style={{ backgroundImage: 'url(/assets/img/coming-soon/coming-soon.jpg)'}}></div>
				<div className="position-absolute top-0 start-0 d-none2 w-100 h-100 bg-gray-900 bg-opacity-80"></div>	
			</div>
			
			<div id="about" className="py-5 bg-component">
				<div className="container-xxl p-3 p-lg-5 text-center">
					<h1 className="mb-3">About Color Admin</h1>
					<p className="fs-16px text-body text-opacity-50 mb-5">Color Admin Template crafts high-performance web applications for <span className="d-none d-md-inline"><br /></span>developers, designers, and entrepreneurs, enabling effortless unleashing of creativity.</p>
					<div className="row text-start g-3 gx-lg-5 gy-lg-4">
						<div className="col-xl-3 col-lg-4 col-sm-6 d-flex">
							<div className="w-50px h-50px rounded-3 bg-primary bg-opacity-15 text-primary fs-32px d-flex align-items-center justify-content-center">
								<Icon icon="solar:monitor-smartphone-bold-duotone" />
							</div>
							<div className="flex-1 ps-3">
								<h4>Responsive Design</h4>
								<p className="mb-0">Optimized for all devices, ensuring a seamless and exceptional user experience everywhere.</p>
							</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6 d-flex">
							<div className="w-50px h-50px rounded-3 bg-indigo bg-opacity-15 text-indigo fs-32px d-flex align-items-center justify-content-center">
								<Icon icon="solar:settings-bold-duotone" />
							</div>
							<div className="flex-1 ps-3">
								<h4>Highly Customizable</h4>
								<p className="mb-0">Modify layouts, colors, and more with ease. Color Admin Template offers unparalleled flexibility to adapt to your specific needs.</p>
							</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6 d-flex">
							<div className="w-50px h-50px rounded-3 bg-warning bg-opacity-15 text-warning fs-32px d-flex align-items-center justify-content-center">
								<Icon icon="solar:bolt-bold-duotone" />
							</div>
							<div className="flex-1 ps-3">
								<h4>High Performance</h4>
								<p className="mb-0">Fast loading times and efficient coding practices ensure a smooth user experience, even under heavy traffic.</p>
							</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6 d-flex">
							<div className="w-50px h-50px rounded-3 bg-info bg-opacity-15 text-info fs-32px d-flex align-items-center justify-content-center">
								<Icon icon="solar:lock-keyhole-bold-duotone" />
							</div>
							<div className="flex-1 ps-3">
								<h4>Secure</h4>
								<p className="mb-0">Built with security in mind, protecting your data and ensuring your complete peace of mind.</p>
							</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6 d-flex">
							<div className="w-50px h-50px rounded-3 bg-green bg-opacity-15 text-green fs-32px d-flex align-items-center justify-content-center">
								<Icon icon="solar:dialog-2-bold-duotone" />
							</div>
							<div className="flex-1 ps-3">
								<h4>Community Support</h4>
								<p className="mb-0">Join our vibrant community of developers and designers, sharing insights and support.</p>
							</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6 d-flex">
							<div className="w-50px h-50px rounded-3 bg-red bg-opacity-15 text-red fs-32px d-flex align-items-center justify-content-center">
								<Icon icon="solar:help-bold-duotone" />
							</div>
							<div className="flex-1 ps-3">
								<h4>24/7 Support</h4>
								<p className="mb-0">Our dedicated support team is always here to assist you with any questions or issues you encounter.</p>
							</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6 d-flex">
							<div className="w-50px h-50px rounded-3 bg-pink bg-opacity-15 text-pink fs-32px d-flex align-items-center justify-content-center">
								<Icon icon="solar:tuning-bold-duotone" />
							</div>
							<div className="flex-1 ps-3">
								<h4>Scalable Infrastructure</h4>
								<p className="mb-0">Flexible and scalable infrastructure to meet diverse business needs, ensuring reliability and performance.</p>
							</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6 d-flex">
							<div className="w-50px h-50px rounded-3 bg-gray-500 bg-opacity-15 text-gray-500 fs-32px d-flex align-items-center justify-content-center">
								<Icon icon="solar:widget-5-bold-duotone" />
							</div>
							<div className="flex-1 ps-3">
								<h4>Intuitive User Interface</h4>
								<p className="mb-0">Streamlined, intuitive interface designed for enhanced productivity and creativity.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<div id="features" className="py-5 position-relative" data-bs-theme="dark">
				<div className="container-xxl p-3 p-lg-5 z-2 position-relative">
					<div className="text-center mb-5">
						<h1 className="mb-3 text-white">Our Unique Features</h1>
						<p className="fs-16px text-body text-opacity-50 mb-5">
							Explore Color Admin Admin Template's standout features. <span className="d-none d-md-inline"><br /></span>
							With advanced customization and seamless integration, create powerful and stunning <span className="d-none d-md-inline"><br /></span>
							admin interfaces, enhancing productivity and user satisfaction.
						</p>
					</div>
					<div className="row g-3 g-lg-5">
						<div className="col-xl-3 col-lg-4 col-sm-6">
							<a href="/assets/img/landing/mockup-1-default.jpg" data-lity className="shadow d-block"><img src="/assets/img/landing/mockup-1-default-thumb.jpg" alt="" className="mw-100" /></a>
							<div className="text-center my-3 text-body fw-bold">Theme Dashboard</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6">
							<a href="/assets/img/landing/mockup-2-default.jpg" data-lity className="shadow d-block"><img src="/assets/img/landing/mockup-2-default-thumb.jpg" alt="" className="mw-100" /></a>
							<div className="text-center my-3 text-body fw-bold">POS System UI</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6">
							<a href="/assets/img/landing/mockup-3-default.jpg" data-lity className="shadow d-block"><img src="/assets/img/landing/mockup-3-default-thumb.jpg" alt="" className="mw-100" /></a>
							<div className="text-center my-3 text-body fw-bold">Color Admin Widgets</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6">
							<a href="/assets/img/landing/mockup-4-default.jpg" data-lity className="shadow d-block"><img src="/assets/img/landing/mockup-4-default-thumb.jpg" alt="" className="mw-100" /></a>
							<div className="text-center my-3 text-body fw-bold">Pricing Page</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6">
							<a href="/assets/img/landing/mockup-5-default.jpg" data-lity className="shadow d-block"><img src="/assets/img/landing/mockup-5-default-thumb.jpg" alt="" className="mw-100" /></a>
							<div className="text-center my-3 text-body fw-bold">Settings Page</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6">
							<a href="/assets/img/landing/mockup-6-default.jpg" data-lity className="shadow d-block"><img src="/assets/img/landing/mockup-6-default-thumb.jpg" alt="" className="mw-100" /></a>
							<div className="text-center my-3 text-body fw-bold">Data Management</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6">
							<a href="/assets/img/landing/mockup-7-default.jpg" data-lity className="shadow d-block"><img src="/assets/img/landing/mockup-7-default-thumb.jpg" alt="" className="mw-100" /></a>
							<div className="text-center my-3 text-body fw-bold">User Profile</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6">
							<a href="/assets/img/landing/frontend-one-page-parallax.jpg" data-lity className="shadow d-block"><img src="/assets/img/landing/frontend-one-page-parallax-thumb.jpg" alt="" className="mw-100" /></a>
							<div className="text-center my-3 text-body fw-bold">Frontend - One Page Parallax</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6">
							<a href="/assets/img/landing/frontend-e-commerce.jpg" data-lity className="shadow d-block"><img src="/assets/img/landing/frontend-e-commerce-thumb.jpg" alt="" className="mw-100" /></a>
							<div className="text-center my-3 text-body fw-bold">Frontend - E-Commerce</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6">
							<a href="/assets/img/landing/frontend-blog.jpg" data-lity className="shadow d-block"><img src="/assets/img/landing/frontend-blog-thumb.jpg" alt="" className="mw-100" /></a>
							<div className="text-center my-3 text-body fw-bold">Frontend - Blog</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6">
							<a href="/assets/img/landing/frontend-forum.jpg" data-lity className="shadow d-block"><img src="/assets/img/landing/frontend-forum-thumb.jpg" alt="" className="mw-100" /></a>
							<div className="text-center my-3 text-body fw-bold">Frontend - Forum</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6">
							<a href="/assets/img/landing/frontend-corporate.jpg" data-lity className="shadow d-block"><img src="/assets/img/landing/frontend-corporate-thumb.jpg" alt="" className="mw-100" /></a>
							<div className="text-center my-3 text-body fw-bold">Frontend - Corporate</div>
						</div>
					</div>
				</div>
				<div className="position-absolute bg-size-cover bg-position-center bg-no-repeat top-0 start-0 w-100 h-100" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-1.jpg)'}}></div>
				<div className="position-absolute bg-gray-900 bg-opacity-80 top-0 start-0 w-100 h-100"></div>
			</div>
			
			<div id="pricing" className="py-5 bg-component">
				<div className="container-xxl p-3 p-lg-5">
					<h1 className="mb-3 text-center">Our Pricing Plans</h1>
					<p className="fs-16px text-body text-opacity-50 text-center mb-0">Choose the perfect plan that suits your needs. <span className="d-none d-md-inline"><br /></span>Our pricing is designed to be flexible and affordable, providing value for businesses of all sizes. <span className="d-none d-md-inline"><br /></span>Explore our plans to find the best fit for your requirements.</p>
					
					<div className="row g-3 py-3 gx-lg-5 py-lg-5" data-bs-theme="dark">
						<div className="col-xl-3 col-md-4 col-sm-6 py-xl-5">
							<div className="card border-0 rounded-4 h-100 bg-gray-900">
								<div className="card-body fs-14px p-30px d-flex flex-column">
									<div className="d-flex align-items-center">
										<div className="flex-1">
											<div className="h5 font-monospace text-body">Starter Plan</div>
											<div className="display-6 fw-bold mb-0 text-white">$5 <small className="h6 text-body">/month*</small></div>
										</div>
										<div>
											<Icon icon="solar:usb-bold-duotone" className="display-4 text-gray-400 rounded-3" />
										</div>
									</div>
									<hr className="my-4" />
									<div className="mb-5 text-body flex-1">
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check fa-lg text-gray-400"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Storage:</span> <b className="text-white small">10 GB</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check fa-lg text-gray-400"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Bandwidth:</span> <b className="text-white small">100 GB</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check fa-lg text-gray-400"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Domain Names:</span> <b className="text-white small">1</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check fa-lg text-gray-400"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">SSL Certificate:</span> <b className="text-white small"> Shared</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check fa-lg text-gray-400"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Email Accounts:</span> <b className="text-white small"> 5</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check fa-lg text-gray-400"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">24/7 Support:</span> <b className="text-white small"> Yes</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-times fa-lg text-body text-opacity-25"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Backup:</span> <b className="text-white small"> Daily</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-times fa-lg text-body text-opacity-25"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Uptime Guarantee:</span> <b className="text-white small"> 99.9%</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-times fa-lg text-body text-opacity-25"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">FTP Access:</span> <b className="text-white small"> Yes</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-times fa-lg text-body text-opacity-25"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Control Panel:</span> <b className="text-white small"> cPanel</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-times fa-lg text-body text-opacity-25"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Free Domain:</span> <b className="text-white small"> No</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-times fa-lg text-body text-opacity-25"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Firewall:</span> <b className="text-white small"> No</b></div>
										</div>
									</div>
									<div className="mx-n2">
										<a href="#/" className="btn btn-default btn-lg w-100 font-monospace">Get Started <i className="fa fa-arrow-right"></i></a>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-md-4 col-sm-6 py-xl-5">
							<div className="card border-0 rounded-4 h-100 bg-gray-900">
								<div className="card-body fs-14px p-30px d-flex flex-column">
									<div className="d-flex align-items-center">
										<div className="flex-1">
											<div className="h5 font-monospace text-body">Booster Plan</div>
											<div className="display-6 fw-bold mb-0 text-white">$10 <small className="h6 text-body">/month*</small></div>
										</div>
										<div>
											<Icon icon="solar:map-arrow-up-bold-duotone" className="display-4 text-gray-400 rounded-3" />
										</div>
									</div>
									<hr className="my-4" />
									<div className="mb-5 text-body flex-1">
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check fa-lg text-gray-400"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Storage:</span> <b className="text-white small">20 GB</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check fa-lg text-gray-400"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Bandwidth:</span> <b className="text-white small">200 GB</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check fa-lg text-gray-400"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Domain Names:</span> <b className="text-white small">2</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check fa-lg text-gray-400"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">SSL Certificate:</span> <b className="text-white small"> Free</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check fa-lg text-gray-400"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Email Accounts:</span> <b className="text-white small"> 10</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check fa-lg text-gray-400"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">24/7 Support:</span> <b className="text-white small"> Yes</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-times fa-lg text-body text-opacity-25"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Backup:</span> <b className="text-white small"> Daily</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-times fa-lg text-body text-opacity-25"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Uptime Guarantee:</span> <b className="text-white small"> 99.9%</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-times fa-lg text-body text-opacity-25"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">FTP Access:</span> <b className="text-white small"> Yes</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-times fa-lg text-body text-opacity-25"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Control Panel:</span> <b className="text-white small"> cPanel</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-times fa-lg text-body text-opacity-25"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Free Domain:</span> <b className="text-white small"> No</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-times fa-lg text-body text-opacity-25"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Firewall:</span> <b className="text-white small"> No</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-times fa-lg text-body text-opacity-25"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">45-Day Money-Back Guarantee</span></div>
										</div>
									</div>
									<div className="mx-n2">
										<a href="#/" className="btn btn-default btn-lg w-100 font-monospace">Get Started <i className="fa fa-arrow-right"></i></a>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-md-4 col-sm-6 py-xl-0">
							<div className="card border-0 rounded-4 shadow-lg bg-gradient-cyan-blue text-white h-100">
								<div className="card-body fs-15px p-30px h-100 d-flex flex-column">
									<div className="d-flex align-items-center">
										<div className="flex-1">
											<div className="h5 font-monospace text-white text-opacity-75">Premium Plan</div>
											<div className="display-6 fw-bold mb-0 text-white">$15 <small className="h6 text-white text-opacity-75">/month*</small></div>
										</div>
										<div>
											<Icon icon="solar:cup-first-bold-duotone" className="display-3 text-black text-opacity-50 rounded-3" />
										</div>
									</div>
									<hr className="my-4 border-black" />
									<div className="mb-5 text-white text-opacity-75 flex-1">
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-white text-opacity-50 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Storage:</span> <b className="text-white small">50 GB</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-white text-opacity-50 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Bandwidth:</span> <b className="text-white small">500 GB</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-white text-opacity-50 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Domain Names:</span> <b className="text-white small">Unlimited</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-white text-opacity-50 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">SSL Certificate:</span> <b className="text-white small">Free</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-white text-opacity-50 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Email Accounts:</span> <b className="text-white small">Unlimited</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-white text-opacity-50 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">24/7 Support:</span> <b className="text-white small">Yes</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-white text-opacity-50 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Backup:</span> <b className="text-white small">Daily</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-white text-opacity-50 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Uptime Guarantee:</span> <b className="text-white small">99.9%</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-white text-opacity-50 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">FTP Access:</span> <b className="text-white small">Yes</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-white text-opacity-50 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Control Panel:</span> <b className="text-white small">cPanel</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-white text-opacity-50 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Free Domain:</span> <b className="text-white small">No</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-white text-opacity-50 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Firewall:</span> <b className="text-white small">Yes</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-white text-opacity-50 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">E-commerce Support</span></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-white text-opacity-50 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">45-Day Money-Back Guarantee</span></div>
										</div>
									</div>
									<a href="#/" className="btn btn-outline-white btn-lg w-100 font-monospace">Get Started <i className="fa fa-arrow-right"></i></a>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-md-4 col-sm-6 py-xl-5">
							<div className="card border-0 rounded-4 h-100 bg-gray-900">
								<div className="card-body fs-14px p-30px d-flex flex-column">
									<div className="d-flex align-items-center">
										<div className="flex-1">
											<div className="h5 font-monospace text-body">Business Plan</div>
											<div className="display-6 fw-bold mb-0 text-white">$99 <small className="h6 text-body">/month*</small></div>
										</div>
										<div>
											<Icon icon="solar:buildings-bold-duotone" className="display-4 text-gray-400 rounded-3" />
										</div>
									</div>
									<hr className="my-4" />
									<div className="mb-5 text-white text-opacity-75 flex-1">
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check fa-lg text-gray-400"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Storage:</span> <b className="text-white small">1 TB</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check fa-lg text-gray-400"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Bandwidth:</span> <b className="text-white small">20 TB</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check fa-lg text-gray-400"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Domain Names:</span> <b className="text-white small">Unlimited</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check fa-lg text-gray-400"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">SSL Certificate:</span> <b className="text-white small">Free</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check fa-lg text-gray-400"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Email Accounts:</span> <b className="text-white small">Unlimited</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check fa-lg text-gray-400"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">24/7 Support:</span> <b className="text-white small">Yes</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-gray-400 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Backup:</span> <b className="text-white small"> Daily</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-gray-400 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Uptime Guarantee:</span> <b className="text-white small">99.9%</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-gray-400 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">FTP Access:</span> <b className="text-white small">Yes</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-gray-400 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Control Panel:</span> <b className="text-white small">cPanel</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-gray-400 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Free Domain:</span> <b className="text-white small">Yes</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-gray-400 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">Firewall:</span> <b className="text-white small">Yes</b></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-gray-400 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">E-commerce Support</span></div>
										</div>
										<div className="d-flex align-items-center mb-1">
											<i className="fa fa-check text-gray-400 fa-lg"></i> 
											<div className="flex-1 ps-3"><span className="font-monospace small">45-Day Money-Back Guarantee</span></div>
										</div>
									</div>
									<div className="mx-n2">
										<a href="#/" className="btn btn-default btn-lg w-100 font-monospace">Get Started <i className="fa fa-arrow-right"></i></a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<div id="testimonials" className="py-5">
				<div className="container-xxl p-3 p-lg-5">
					<div className="text-center mb-5">
						<h1 className="mb-3 text-center">What Our Clients Say</h1>
						<p className="fs-16px text-body text-opacity-50 text-center mb-0">
							Read testimonials from our satisfied customers. <span className="d-none d-md-inline"><br /></span>
							Discover how Color Admin Admin Template enhances productivity and exceeds expectations <span className="d-none d-md-inline"><br /></span>
							with its ease of use, advanced features, and exceptional support.
						</p>
					</div>
					<div className="row g-3 g-lg-4 mb-4">
						<div className="col-xl-4 col-md-6">
							<div className="card p-4 border-0 h-100 rounded-5">
								<div className="d-flex align-items-center mb-3">
									<img src="/assets/img/user/user-1.jpg" className="rounded-circle me-3 w-50px" alt="Client 1" />
									<div>
										<h5 className="mb-0">John Doe</h5>
										<small className="text-muted">CEO, Company</small>
									</div>
								</div>
								<div className="mb-4 d-flex">
									<i className="fa fa-quote-left fa-2x text-body text-opacity-15"></i>
									<div className="p-3 fs-5">
										<div className="text-warning d-flex mb-2">
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
										</div>
										Color Admin Admin Template transformed our workflow. 
										The customization options are unparalleled, and the support team is incredibly responsive.
									</div>
									<div className="d-flex align-items-end">
										<i className="fa fa-quote-right fa-2x text-body text-opacity-15"></i>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-4 col-md-6">
							<div className="card p-4 border-0 h-100 rounded-5">
								<div className="d-flex align-items-center mb-3">
									<img src="/assets/img/user/user-3.jpg" className="rounded-circle me-3 w-50px" alt="Client 1" />
									<div>
										<h5 className="mb-0">Michael Brown</h5>
										<small className="text-muted">CTO, Innovate Corp</small>
									</div>
								</div>
								<div className="mb-4 d-flex">
									<i className="fa fa-quote-left fa-2x text-body text-opacity-15"></i>
									<div className="p-3 fs-5">
										<div className="text-warning d-flex mb-2">
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
										</div>
										Our productivity has soared since adopting this template. 
										The features are top-notch, and the user experience is outstanding.
									</div>
									<div className="d-flex align-items-end">
										<i className="fa fa-quote-right fa-2x text-body text-opacity-15"></i>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-4 col-md-6">
							<div className="card p-4 border-0 h-100 rounded-5">
								<div className="d-flex align-items-center mb-3">
									<img src="/assets/img/user/user-13.jpg" className="rounded-circle me-3 w-50px" alt="Client 1" />
									<div>
										<h5 className="mb-0">Emily Johnson</h5>
										<small className="text-muted">Project Manager, Creative Agency</small>
									</div>
								</div>
								<div className="mb-4 d-flex">
									<i className="fa fa-quote-left fa-2x text-body text-opacity-15"></i>
									<div className="p-3 fs-5">
										<div className="text-warning d-flex mb-2">
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
										</div>
										This template is a game-changer. 
										It's intuitive, flexible, and the seamless integration 
										has made our projects run smoother than ever.
									</div>
									<div className="d-flex align-items-end">
										<i className="fa fa-quote-right fa-2x text-body text-opacity-15"></i>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-2 d-none d-xl-block"></div>
						<div className="col-xl-4 col-md-6">
							<div className="card p-4 border-0 h-100 rounded-5">
								<div className="d-flex align-items-center mb-3">
									<img src="/assets/img/user/user-8.jpg" className="rounded-circle me-3 w-50px" alt="Client 1" />
									<div>
										<h5 className="mb-0">David Lee</h5>
										<small className="text-muted">Founder, Startup Hub</small>
									</div>
								</div>
								<div className="mb-4 d-flex">
									<i className="fa fa-quote-left fa-2x text-body text-opacity-15"></i>
									<div className="p-3 fs-5">
										<div className="text-warning d-flex mb-2">
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
										</div>
										Color Admin Admin Template has exceeded all our expectations. 
										The advanced features and excellent support make it a standout choice.
									</div>
									<div className="d-flex align-items-end">
										<i className="fa fa-quote-right fa-2x text-body text-opacity-15"></i>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-4 col-md-6">
							<div className="card p-4 border-0 h-100 rounded-5">
								<div className="d-flex align-items-center mb-3">
									<img src="/assets/img/user/user-5.jpg" className="rounded-circle me-3 w-50px" alt="Client 1" />
									<div>
										<h5 className="mb-0">John Doe</h5>
										<small className="text-muted">CEO, Company</small>
									</div>
								</div>
								<div className="mb-4 d-flex">
									<i className="fa fa-quote-left fa-2x text-body text-opacity-15"></i>
									<div className="p-3 fs-5">
										<div className="text-warning d-flex mb-2">
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
											<Icon icon="ic:baseline-star" className="fs-18px" />
										</div>
										Color Admin Admin Template transformed our workflow. 
										The customization options are unparalleled, and the support team is incredibly responsive.
									</div>
									<div className="d-flex align-items-end">
										<i className="fa fa-quote-right fa-2x text-body text-opacity-15"></i>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<div id="blog" className="py-5 bg-component">
				<div className="container-xxl p-3 p-lg-5">
					<div className="text-center mb-5">
						<h1 className="mb-3 text-center">Our Latest Insights</h1>
						<p className="fs-16px text-body text-opacity-50 text-center mb-0">
							Dive into our blog for the latest trends, tips, and updates <span className="d-none d-md-inline"><br /></span>
							on web development, design, and industry best practices. Stay informed and inspired <span className="d-none d-md-inline"><br /></span>
							with expert insights and valuable resources.
						</p>
					</div>
					<div className="row g-3 g-xl-4 mb-5">
						<div className="col-xl-3 col-lg-4 col-sm-6">
							<div className="d-flex flex-column h-100 rounded-4 overflow-hidden shadow-lg mb-5 mb-lg-0">
								<div>
									<img src="/assets/img/landing/blog-1.jpg" alt="" className="object-fit-cover h-200px w-100 d-block" />
								</div>
								<div className="flex-1 p-3 pb-0">
									<div className="mb-2">
										<span className="bg-theme bg-opacity-15 text-theme px-2 py-1 rounded small fw-bold">Web Design</span>
									</div>
									<h5>Mastering Responsive Design: A Guide for Beginners</h5>
									<p>Explore the fundamentals of responsive web design and learn essential tips to create websites that look great on any device.</p>
								</div>
								<div className="p-3 pt-0 text-body text-opacity-50">July 15, 2024</div>
							</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6">
							<div className="d-flex flex-column h-100 rounded-4 overflow-hidden shadow-lg mb-5 mb-lg-0">
								<div>
									<img src="/assets/img/landing/blog-2.jpg" alt="" className="object-fit-cover h-200px w-100 d-block" />
								</div>
								<div className="flex-1 p-3 pb-0">
									<div className="mb-2">
										<span className="bg-theme bg-opacity-15 text-theme px-2 py-1 rounded small fw-bold">UXUI Design</span>
									</div>
									<h5>The Future of UI/UX Trends in 2024</h5>
									<p>Discover the latest trends shaping user interface and experience design in the digital landscape this year.</p>
								</div>
								<div className="p-3 pt-0 text-body text-opacity-50">July 11, 2024</div>
							</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6">
							<div className="d-flex flex-column h-100 rounded-4 overflow-hidden shadow-lg mb-5 mb-lg-0">
								<div>
									<img src="/assets/img/landing/blog-3.jpg" alt="" className="object-fit-cover h-200px w-100 d-block" />
								</div>
								<div className="flex-1 p-3 pb-0">
									<div className="mb-2">
										<span className="bg-theme bg-opacity-15 text-theme px-2 py-1 rounded small fw-bold">Search Engine</span>
									</div>
									<h5>Effective SEO Strategies for 2024</h5>
									<p>Dive into actionable SEO strategies and tips to boost your website’s visibility and drive organic traffic.</p>
								</div>
								<div className="p-3 pt-0 text-body text-opacity-50">June 29, 2024</div>
							</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-sm-6">
							<div className="d-flex flex-column h-100 rounded-4 overflow-hidden shadow-lg mb-5 mb-lg-0">
								<div>
									<img src="/assets/img/landing/blog-4.jpg" alt="" className="object-fit-cover h-200px w-100 d-block" />
								</div>
								<div className="flex-1 p-3 pb-0">
									<div className="mb-2">
										<span className="bg-theme bg-opacity-15 text-theme px-2 py-1 rounded small fw-bold">Cyber Security</span>
									</div>
									<h5>Security Essentials: Protecting Your Website from Cyber Threats</h5>
									<p>Essential security measures and best practices to safeguard your website and user data from cyber threats.</p>
								</div>
								<div className="p-3 pt-0 text-body text-opacity-50">June 27, 2024</div>
							</div>
						</div>
					</div>
					<div className="text-center">
						<a href="#/" className="text-decoration-none text-body text-opacity-50 h6">See More Company Stories <i className="fa fa-arrow-right ms-3"></i></a>
					</div>
				</div>
			</div>
			
			<div id="contact" className="py-5">
				<div className="container-xl p-3 p-lg-5">
					<div className="text-center mb-5">
						<h1 className="mb-3 text-center">Get in Touch</h1>
						<p className="fs-16px text-body text-opacity-50 text-center mb-0">
							Contact us today to explore how our team can assist you. <br />
							Whether you have inquiries, need support, or want to discuss a partnership, <br />
							we're here to help. Reach out to us and let's start a conversation!
						</p>
					</div>
					<div className="row gx-3 gx-lg-5">
						<div className="col-lg-6">
							<h4>Contact Us to Discuss Your Project</h4>
							<p>
								Do you have a project in mind? We’re eager to discuss it with you. Whether you’re looking for advice, have questions, or want to share your ideas, feel free to reach out. 
							</p>
							<p>
								<span className="fw-bolder">SeanTheme Color Admin, Inc</span><br /> 
								795 Folsom Ave, Suite 600<br />
								San Francisco, CA 94107<br /><br /> 
								
								Monday - Friday: 9:00 AM - 6:00 PM<br /> 
								Saturday - Sunday: Closed<br /> <br /> 
								
								Phone: <a href="#/" className="text-theme">(123) 456-7890</a><br /> 
								International: <a href="#/" className="text-theme">+11 (0) 123 456 78</a><br /> 
								Email:
								<a href="#/" className="text-theme">support@seantheme.com</a>
							</p>
						</div>
						<div className="col-lg-6">
							<form action="" method="GET" name="form_contact_us">
								<div className="row gy-3 mb-3">
									<div className="col-6">
										<label className="form-label">First Name <span className="text-theme">*</span></label>
										<input type="text" className="form-control form-control-lg fs-15px" />
									</div>
									<div className="col-6">
										<label className="form-label">Last Name <span className="text-theme">*</span></label>
										<input type="text" className="form-control form-control-lg fs-15px" />
									</div>
									<div className="col-6">
										<label className="form-label">Email <span className="text-theme">*</span></label>
										<input type="text" className="form-control form-control-lg fs-15px" />
									</div>
									<div className="col-6">
										<label className="form-label">Phone <span className="text-theme">*</span></label>
										<input type="text" className="form-control form-control-lg fs-15px" />
									</div>
									<div className="col-12">
										<label className="form-label">Message <span className="text-theme">*</span></label>
										<textarea className="form-control form-control-lg fs-15px" rows="8"></textarea>
									</div>
									<div className="col-12">
										<button type="submit" className="btn btn-theme btn-lg btn-block px-4 fs-15px">Send Message</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			
			<div id="footer" className="py-5 bg-gray-800 text-body text-opacity-75" data-bs-theme="dark">
				<div className="container-xxl px-3 px-lg-5">
					<div className="row gx-lg-5 gx-3 gy-lg-4 gy-3">
						<div className="col-lg-3 col-md-6">
							<div className="mb-3 fw-800 fs-24px text-white">Color Admin</div>
							<p className="mb-4">
								Color Admin is your go-to solution for creating stunning, responsive, and high-performance web applications. Designed for developers, designers, and entrepreneurs, it provides the tools and flexibility needed to bring your creative visions to life.
							</p>
							<h5>Follow Us</h5>
							<div className="d-flex">
								<a href="#/" className="me-2 text-body text-opacity-50"><i className="fab fa-lg fa-facebook fa-fw"></i></a>
								<a href="#/" className="me-2 text-body text-opacity-50"><i className="fab fa-lg fa-instagram fa-fw"></i></a>
								<a href="#/" className="me-2 text-body text-opacity-50"><i className="fab fa-lg fa-twitter fa-fw"></i></a>
								<a href="#/" className="me-2 text-body text-opacity-50"><i className="fab fa-lg fa-youtube fa-fw"></i></a>
								<a href="#/" className="me-2 text-body text-opacity-50"><i className="fab fa-lg fa-linkedin fa-fw"></i></a>
							</div>
						</div>
						<div className="col-lg-3 col-md-6">
							<h5>Quick Links</h5>
							<ul className="list-unstyled">
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Newsroom</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Company Info</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Careers</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">For Investors</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Brand Resources</a></li>
							</ul>
							<hr className="text-body text-opacity-50" />
							<h5>Services</h5>
							<ul className="list-unstyled">
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Web Development</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">App Development</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">SEO</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Marketing</a></li>
							</ul>
						</div>
						<div className="col-lg-3 col-md-6">
							<h5>Resources</h5>
							<ul className="list-unstyled">
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Documentation</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Support</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">FAQs</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Community</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Tutorials</a></li>
							</ul>
							<hr className="text-body text-opacity-50" />
							<h5>Legal</h5>
							<ul className="list-unstyled">
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Privacy Policy</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Terms of Service</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Cookie Policy</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Compliance</a></li>
							</ul>
						</div>
						<div className="col-lg-3 col-md-6">
							<h5>Help Center</h5>
							<ul className="list-unstyled">
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Contact Form</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Live Chat Support</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Portal Help Center</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Email Support</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Technical Documentation</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Service Updates</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Developer API</a></li>
								<li className="mb-3px"><a href="#/" className="text-decoration-none text-body text-opacity-75">Knowledge Base</a></li>
							</ul>
						</div>
					</div>
					<hr className="text-body text-opacity-50" />
					<div className="row">
						<div className="col-sm-6 mb-3 mb-lg-0">
							<div className="footer-copyright-text">&copy; 2024 SeanTheme All Rights Reserved</div>
						</div>
						<div className="col-sm-6 text-sm-end">
							<div className="dropdown me-4 d-inline">
								<a href="#/" className="text-decoration-none dropdown-toggle text-body text-opacity-50" data-bs-toggle="dropdown">United States (English)</a>
								<ul className="dropdown-menu">
									<li><a href="#/" className="dropdown-item">United States (English)</a></li>
									<li><a href="#/" className="dropdown-item">China (简体中文)</a></li>
									<li><a href="#/" className="dropdown-item">Brazil (Português)</a></li>
									<li><a href="#/" className="dropdown-item">Germany (Deutsch)</a></li>
									<li><a href="#/" className="dropdown-item">France (Français)</a></li>
									<li><a href="#/" className="dropdown-item">Japan (日本語)</a></li>
									<li><a href="#/" className="dropdown-item">Korea (한국어)</a></li>
									<li><a href="#/" className="dropdown-item">Latin America (Español)</a></li>
									<li><a href="#/" className="dropdown-item">Spain (Español)</a></li>
								</ul>
							</div>
							<a href="#/" className="text-decoration-none text-body text-opacity-50">Sitemap</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Landing;