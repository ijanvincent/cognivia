import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import Highlight from 'react-highlight';

function FormWizards() {
	const [code1, setCode1] = useState();
	const [code2, setCode2] = useState();
	const [code3, setCode3] = useState();
	
	useEffect(() => {
		fetch('/assets/data/form-wizards/code-1.json').then(function(response) { return response.text(); }).then((html) => { setCode1(html); });
		fetch('/assets/data/form-wizards/code-2.json').then(function(response) { return response.text(); }).then((html) => { setCode2(html); });
		fetch('/assets/data/form-wizards/code-3.json').then(function(response) { return response.text(); }).then((html) => { setCode3(html); });
	});
	
	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link to="/form/wizards">Home</Link></li>
				<li className="breadcrumb-item"><Link to="/form/wizards">Form Stuff</Link></li>
				<li className="breadcrumb-item active">Wizards</li>
			</ol>
			<h1 className="page-header">Wizards <small>header small text goes here...</small></h1>
	
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>
							Wizard layout 1
						</PanelHeader>
						<PanelBody>
							<p>Wizard layout include the number of step and text. Please do note that all the wizard is for uxui ONLY but do not include any javascript or backend logic.</p>
							<div className="nav-wizards-container">
								<nav className="nav nav-wizards-1 mb-2">
									<div className="nav-item col">
										<Link to="/form/wizards" className="nav-link completed">
											<div className="nav-no">1</div>
											<div className="nav-text">Completed step</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link to="/form/wizards" className="nav-link completed">
											<div className="nav-no">2</div>
											<div className="nav-text">Second step</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link to="/form/wizards" className="nav-link active">
											<div className="nav-no">3</div>
											<div className="nav-text">Active step</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link to="/form/wizards" className="nav-link disabled">
											<div className="nav-no">4</div>
											<div className="nav-text">Disabled step</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link to="/form/wizards" className="nav-link disabled">
											<div className="nav-no">5</div>
											<div className="nav-text">Last step</div>
										</Link>
									</div>
								</nav>
							</div>
							<div className="card">
								<div className="card-body">
									wizard content here
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code1}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>
							Wizard layout 2
						</PanelHeader>
						<PanelBody>
							<p>Wizard layout include the number of step and text. Please do note that all the wizard is for uxui ONLY but do not include any javascript or backend logic.</p>
							<div className="nav-wizards-container">
								<nav className="nav nav-wizards-2 mb-3">
									<div className="nav-item col">
										<Link to="/form/wizards" className="nav-link completed">
											<div className="nav-text">1. Completed step</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link to="/form/wizards" className="nav-link active">
											<div className="nav-text">2. Active step text</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link to="/form/wizards" className="nav-link disabled">
											<div className="nav-text">3. Disabled step text</div>
										</Link>
									</div>
								</nav>
							</div>
							<div className="card">
								<div className="card-body">
									wizard content here
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code2}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>
							Wizard layout 3
						</PanelHeader>
						<PanelBody>
							<p>Wizard layout include the number of step and text. Please do note that all the wizard is for uxui ONLY but do not include any javascript or backend logic.</p>
							<div className="nav-wizards-container">
								<nav className="nav nav-wizards-3 mb-2">
									<div className="nav-item col">
										<Link to="/form/wizards" className="nav-link completed">
											<div className="nav-dot"></div>
											<div className="nav-title">Step 1</div>
											<div className="nav-text">Completed step</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link to="/form/wizards" className="nav-link completed">
											<div className="nav-dot"></div>
											<div className="nav-title">Step 2</div>
											<div className="nav-text">Second step</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link to="/form/wizards" className="nav-link active">
											<div className="nav-dot"></div>
											<div className="nav-title">Step 3</div>
											<div className="nav-text">Active step</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link to="/form/wizards" className="nav-link disabled">
											<div className="nav-dot"></div>
											<div className="nav-title">Step 4</div>
											<div className="nav-text">Disabled step</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link to="/form/wizards" className="nav-link disabled">
											<div className="nav-dot"></div>
											<div className="nav-title">Step 5</div>
											<div className="nav-text">Last step</div>
										</Link>
									</div>
								</nav>
							</div>
							<div className="card">
								<div className="card-body">
									wizard content here
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code3}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
		</div>
	)
}

export default FormWizards;