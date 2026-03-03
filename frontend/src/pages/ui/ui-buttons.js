import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import Highlight from 'react-highlight';

function UIButtons() {
	const [code1, setCode1] = useState();
	const [code2, setCode2] = useState();
	const [code3, setCode3] = useState();
	const [code4, setCode4] = useState();
	const [code5, setCode5] = useState();
	const [code6, setCode6] = useState();
	const [code7, setCode7] = useState();
	const [code8, setCode8] = useState();
	
	useEffect(() => {
		fetch('/assets/data/ui-buttons/code-1.json').then(function(response) { return response.text(); }).then((html) => { setCode1(html); });
		fetch('/assets/data/ui-buttons/code-2.json').then(function(response) { return response.text(); }).then((html) => { setCode2(html); });
		fetch('/assets/data/ui-buttons/code-3.json').then(function(response) { return response.text(); }).then((html) => { setCode3(html); });
		fetch('/assets/data/ui-buttons/code-4.json').then(function(response) { return response.text(); }).then((html) => { setCode4(html); });
		fetch('/assets/data/ui-buttons/code-5.json').then(function(response) { return response.text(); }).then((html) => { setCode5(html); });
		fetch('/assets/data/ui-buttons/code-6.json').then(function(response) { return response.text(); }).then((html) => { setCode6(html); });
		fetch('/assets/data/ui-buttons/code-7.json').then(function(response) { return response.text(); }).then((html) => { setCode7(html); });
		fetch('/assets/data/ui-buttons/code-8.json').then(function(response) { return response.text(); }).then((html) => { setCode8(html); });
	});
	
	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link to="/ui/buttons">Home</Link></li>
				<li className="breadcrumb-item"><Link to="/ui/buttons">UI Elements</Link></li>
				<li className="breadcrumb-item active">Buttons</li>
			</ol>
			<h1 className="page-header">Buttons <small>header small text goes here...</small></h1>
			
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Buttons <span className="badge bg-success ms-1">NEW</span></PanelHeader>
						<PanelBody>
							<div className="d-flex flex-wrap">
								<button type="button" className="btn btn-white me-1 mb-1">White</button>
								<button type="button" className="btn btn-default me-1 mb-1">Default</button>
								<button type="button" className="btn btn-gray me-1 mb-1">Gray</button>
								<button type="button" className="btn btn-purple me-1 mb-1">Purple</button>
								<button type="button" className="btn btn-indigo me-1 mb-1">Indigo</button>
								<button type="button" className="btn btn-primary me-1 mb-1">Primary</button>
								<button type="button" className="btn btn-info me-1 mb-1">Info</button>
								<button type="button" className="btn btn-yellow me-1 mb-1">Yellow</button>
								<button type="button" className="btn btn-warning me-1 mb-1">Warning</button>
								<button type="button" className="btn btn-pink me-1 mb-1">Pink</button>
								<button type="button" className="btn btn-danger me-1 mb-1">Danger</button>
								<button type="button" className="btn btn-success me-1 mb-1">Success</button>
								<button type="button" className="btn btn-green me-1 mb-1">Green</button>
								<button type="button" className="btn btn-lime me-1 mb-1">Lime</button>
								<button type="button" className="btn btn-inverse me-1 mb-1">Inverse</button>
								<button type="button" className="btn btn-link">Link</button>
							</div>
							<hr />
							<div className="d-flex flex-wrap">
								<button type="button" className="btn btn-outline-primary me-1 mb-1">Outline Primary</button>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code1}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Button Dropdowns</PanelHeader>
						<PanelBody>
							<div className="btn-group me-1 mb-1">
								<a href="#/" className="btn btn-default">Dropdown</a>
								<a href="#/" data-bs-toggle="dropdown" className="btn btn-default dropdown-toggle"><i className="fa fa-caret-down"></i></a>
								<div className="dropdown-menu dropdown-menu-end">
									<a href="#/" className="dropdown-item">Action 1</a>
									<a href="#/" className="dropdown-item">Action 2</a>
									<a href="#/" className="dropdown-item">Action 3</a>
									<div className="dropdown-divider"></div>
									<a href="#/" className="dropdown-item">Action 4</a>
								</div>
							</div>
							<div className="btn-group dropup me-1 mb-1">
								<a href="#/" className="btn btn-primary">Dropup</a>
								<a href="#/" data-bs-toggle="dropdown" className="btn btn-primary dropdown-toggle"><i className="fa fa-caret-up"></i></a>
								<div className="dropdown-menu">
									<a href="#/" className="dropdown-item">Action 1</a>
									<a href="#/" className="dropdown-item">Action 2</a>
									<a href="#/" className="dropdown-item">Action 3</a>
									<div className="dropdown-divider"></div>
									<a href="#/" className="dropdown-item">Action 4</a>
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code2}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Button Sizes</PanelHeader>
						<PanelBody>
							<Link to="/ui/buttons" className="btn btn-primary btn-lg me-1 mb-1">Large Button</Link>
							<Link to="/ui/buttons" className="btn btn-primary me-1 mb-1">Default Button</Link>
							<Link to="/ui/buttons" className="btn btn-default btn-sm me-1 mb-1">Small Button</Link>
							<Link to="/ui/buttons" className="btn btn-default btn-xs me-1 mb-1">Extra Small</Link>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code3}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Button State</PanelHeader>
						<PanelBody>
							<div className="row">
								<div className="col-md-6">
									<Link to="/ui/buttons" className="btn btn-default disabled me-1 mb-1">Disabled Button</Link>
									<Link to="/ui/buttons" className="btn btn-default active me-1 mb-1">Active Button</Link>
								</div>
								<div className="col-md-6">
									<Link to="/ui/buttons" className="btn btn-primary d-block">Block Button</Link>
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code4}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Button with Icon</PanelHeader>
						<PanelBody>
							<div className="row text-center">
								<div className="col-md-6">
									<div className="mb-2">
										<Link to="/ui/buttons" className="btn btn-lg btn-primary">
											<span className="d-flex align-items-center text-start">
												<i className="fab fa-twitter fa-3x me-3 text-black"></i>
												<span>
													<span className="d-block"><b>Twitter Bootstrap</b></span>
													<span className="d-block fs-12px opacity-7">Version 5.0</span>
												</span>
											</span>
										</Link>
									</div>
								</div>
								<div className="col-md-6">
									<p>
										<Link to="/ui/buttons" className="btn btn-default me-5px"><i className="fa fa-comment"></i> Comment</Link>
										<Link to="/ui/buttons" className="btn btn-default me-5px"><i className="fa fa-cogs"></i> Setting</Link>
										<Link to="/ui/buttons" className="btn btn-default"><i className="fa fa-cog"></i></Link>
									</p>
									<p>
										<Link to="/ui/buttons" className="btn btn-default d-block"><i className="fa fa-list"></i> Button block with icon</Link>
									</p>
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code5}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Button Groups & Toolbars</PanelHeader>
						<PanelBody>
							<div className="row">
								<div className="col-md-6">
									<div className="btn-group">
										<button className="btn btn-white">Left</button>
										<button className="btn btn-white active">Middle</button>
										<button className="btn btn-white">Right</button>
									</div>
									<p></p>
									<div className="btn-group">
										<Link to="/ui/buttons" className="btn btn-white"><i className="fa fa-align-left"></i></Link>
										<Link to="/ui/buttons" className="btn btn-white active"><i className="fa fa-align-center"></i></Link>
										<Link to="/ui/buttons" className="btn btn-white"><i className="fa fa-align-right"></i></Link>
										<Link to="/ui/buttons" className="btn btn-white"><i className="fa fa-align-justify"></i></Link>
									</div>
									<p></p>
								</div>
								<div className="col-md-6">
									<div className="btn-group">
										<button type="button" className="btn btn-white">1</button>
										<button type="button" className="btn btn-white active">2</button>
										<button type="button" className="btn btn-white">3</button>
									</div>
									<div className="btn-group">
										<button type="button" className="btn btn-white">4</button>
										<button type="button" className="btn btn-white">5</button>
										<button type="button" className="btn btn-white">6</button>
									</div>
									<div className="btn-group">
										<button type="button" className="btn btn-white">7</button>
									</div>
									<p></p>
									<div className="btn-group">
										<Link to="/ui/buttons" className="btn btn-inverse"><i className="fa fa-backward"></i></Link>
										<Link to="/ui/buttons" className="btn btn-inverse"><i className="fa fa-fast-backward"></i></Link>
										<Link to="/ui/buttons" className="btn btn-inverse"><i className="fa fa-pause"></i></Link>
										<Link to="/ui/buttons" className="btn btn-inverse active"><i className="fa fa-play"></i></Link>
										<Link to="/ui/buttons" className="btn btn-inverse"><i className="fa fa-forward"></i></Link>
										<Link to="/ui/buttons" className="btn btn-inverse"><i className="fa fa-fast-forward"></i></Link>
									</div>
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code6}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Button Group Vertical & Justified</PanelHeader>
						<PanelBody>
							<div className="row">
								<div className="col-md-4">
									<div className="btn-group-vertical me-5px">
										<button type="button" className="btn btn-indigo"><i className="fa fa-cog"></i> Button</button>
										<button type="button" className="btn btn-indigo active"><i className="fa fa-cog"></i> Button</button>
										<button type="button" className="btn btn-indigo"><i className="fa fa-cog"></i> Button</button>
									</div>
								</div>
								<div className="col-md-8">
									<div className="btn-group w-100">
										<Link to="/ui/buttons" className="btn btn-outline-inverse">Left</Link>
										<Link to="/ui/buttons" className="btn btn-outline-inverse active">Middle</Link>
										<Link to="/ui/buttons" className="btn btn-outline-inverse">Right</Link>
									</div>
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code7}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Button Icon & Sizes</PanelHeader>
						<PanelBody>
							<div className="row">
								<div className="col-md-8">
									<p>
										<Link to="/ui/buttons" className="btn btn-default btn-icon btn-circle btn-lg me-1"><i className="fa fa-expand"></i></Link>
										<Link to="/ui/buttons" className="btn btn-success btn-icon btn-circle btn-lg me-1"><i className="fa fa-redo"></i></Link>
										<Link to="/ui/buttons" className="btn btn-warning btn-icon btn-circle btn-lg me-1"><i className="fa fa-minus"></i></Link>
										<Link to="/ui/buttons" className="btn btn-danger btn-icon btn-circle btn-lg me-1"><i className="fa fa-times"></i></Link>
										<Link to="/ui/buttons" className="btn btn-primary btn-icon btn-circle btn-lg me-1"><i className="fab fa-facebook-f"></i></Link>
										<Link to="/ui/buttons" className="btn btn-info btn-icon btn-circle btn-lg me-1"><i className="fab fa-twitter"></i></Link>
										<Link to="/ui/buttons" className="btn btn-inverse btn-icon btn-circle btn-lg me-1"><i className="fab fa-stack-overflow"></i></Link>
									</p>
									<p>
										<Link to="/ui/buttons" className="btn btn-default btn-icon btn-circle me-1"><i className="fa fa-expand"></i></Link>
										<Link to="/ui/buttons" className="btn btn-success btn-icon btn-circle me-1"><i className="fa fa-redo"></i></Link>
										<Link to="/ui/buttons" className="btn btn-warning btn-icon btn-circle me-1"><i className="fa fa-minus"></i></Link>
										<Link to="/ui/buttons" className="btn btn-danger btn-icon btn-circle me-1"><i className="fa fa-times"></i></Link>
										<Link to="/ui/buttons" className="btn btn-primary btn-icon btn-circle me-1"><i className="fab fa-facebook-f"></i></Link>
										<Link to="/ui/buttons" className="btn btn-info btn-icon btn-circle me-1"><i className="fab fa-twitter"></i></Link>
										<Link to="/ui/buttons" className="btn btn-inverse btn-icon btn-circle me-1"><i className="fab fa-stack-overflow"></i></Link>
									</p>
									<p>
										<Link to="/ui/buttons" className="btn btn-default btn-icon btn-circle btn-sm me-1"><i className="fa fa-expand"></i></Link>
										<Link to="/ui/buttons" className="btn btn-success btn-icon btn-circle btn-sm me-1"><i className="fa fa-redo"></i></Link>
										<Link to="/ui/buttons" className="btn btn-warning btn-icon btn-circle btn-sm me-1"><i className="fa fa-minus"></i></Link>
										<Link to="/ui/buttons" className="btn btn-danger btn-icon btn-circle btn-sm me-1"><i className="fa fa-times"></i></Link>
										<Link to="/ui/buttons" className="btn btn-primary btn-icon btn-circle btn-sm me-1"><i className="fab fa-facebook-f"></i></Link>
										<Link to="/ui/buttons" className="btn btn-info btn-icon btn-circle btn-sm me-1"><i className="fab fa-twitter"></i></Link>
										<Link to="/ui/buttons" className="btn btn-inverse btn-icon btn-circle btn-sm me-1"><i className="fab fa-stack-overflow"></i></Link>
									</p>
									<p>
										<Link to="/ui/buttons" className="btn btn-default btn-icon btn-circle btn-xs me-1"><i className="fa fa-expand"></i></Link>
										<Link to="/ui/buttons" className="btn btn-success btn-icon btn-circle btn-xs me-1"><i className="fa fa-redo"></i></Link>
										<Link to="/ui/buttons" className="btn btn-warning btn-icon btn-circle btn-xs me-1"><i className="fa fa-minus"></i></Link>
										<Link to="/ui/buttons" className="btn btn-danger btn-icon btn-circle btn-xs me-1"><i className="fa fa-times"></i></Link>
										<Link to="/ui/buttons" className="btn btn-primary btn-icon btn-circle btn-xs me-1"><i className="fab fa-facebook-f"></i></Link>
										<Link to="/ui/buttons" className="btn btn-info btn-icon btn-circle btn-xs me-1"><i className="fab fa-twitter"></i></Link>
										<Link to="/ui/buttons" className="btn btn-inverse btn-icon btn-circle btn-xs me-1"><i className="fab fa-stack-overflow"></i></Link>
									</p>
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code8}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
		</div>
	)
}

export default UIButtons;