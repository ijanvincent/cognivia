import React from 'react';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';

function ExtraCookieAcceptanceBanner() {
	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><a href="#/">Home</a></li>
				<li className="breadcrumb-item"><a href="#/">Extra</a></li>
				<li className="breadcrumb-item active">Cookie Acceptance Banner</li>
			</ol>
			<h1 className="page-header">Cookie Acceptance Banner <small>header small text goes here...</small></h1>
			<Panel>
				<PanelHeader>Panel Title here</PanelHeader>
				<PanelBody>
					Panel Content Here
				</PanelBody>
			</Panel>
	
			<div className="alert alert-dismissible fade show bg-dark bg-opacity-90 text-white position-fixed rounded-0 m-0 d-lg-flex align-items-center px-lg-5 py-lg-4 pt-4 start-0 end-0 bottom-0" style={{zIndex: 1020}}>
				<div className="flex-fill">
					<h3>This website uses cookies</h3>
					<p className="mb-0">
						We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you’ve provided to them or that they’ve collected from your use of their services.
					</p>
				</div>
				<div className="ps-lg-4 pt-lg-0 pt-3">
					<button className="btn btn-outline-white btn-lg w-150px" data-bs-dismiss="alert">Accept</button>
				</div>
			</div>
		</div>
	)
}

export default ExtraCookieAcceptanceBanner;