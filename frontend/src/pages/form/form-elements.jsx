import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import Highlight from 'react-highlight';

function FormElements() {
	const [code1, setCode1] = useState();
	const [code2, setCode2] = useState();
	const [code3, setCode3] = useState();
	const [code4, setCode4] = useState();
	const [code5, setCode5] = useState();
	const [code6, setCode6] = useState();
	const [code7, setCode7] = useState();
	const [code8, setCode8] = useState();
	const [code9, setCode9] = useState();
	const [code10, setCode10] = useState();
	const [code11, setCode11] = useState();
	const [code12, setCode12] = useState();
	const [code13, setCode13] = useState();
	
	function handleOnChange() {
	
	}
	
	useEffect(() => {
		fetch('/assets/data/form-elements/code-1.json').then(function(response) { return response.text(); }).then((html) => { setCode1(html); });
		fetch('/assets/data/form-elements/code-2.json').then(function(response) { return response.text(); }).then((html) => { setCode2(html); });
		fetch('/assets/data/form-elements/code-3.json').then(function(response) { return response.text(); }).then((html) => { setCode3(html); });
		fetch('/assets/data/form-elements/code-4.json').then(function(response) { return response.text(); }).then((html) => { setCode4(html); });
		fetch('/assets/data/form-elements/code-5.json').then(function(response) { return response.text(); }).then((html) => { setCode5(html); });
		fetch('/assets/data/form-elements/code-6.json').then(function(response) { return response.text(); }).then((html) => { setCode6(html); });
		fetch('/assets/data/form-elements/code-7.json').then(function(response) { return response.text(); }).then((html) => { setCode7(html); });
		fetch('/assets/data/form-elements/code-8.json').then(function(response) { return response.text(); }).then((html) => { setCode8(html); });
		fetch('/assets/data/form-elements/code-9.json').then(function(response) { return response.text(); }).then((html) => { setCode9(html); });
		fetch('/assets/data/form-elements/code-10.json').then(function(response) { return response.text(); }).then((html) => { setCode10(html); });
		fetch('/assets/data/form-elements/code-11.json').then(function(response) { return response.text(); }).then((html) => { setCode11(html); });
		fetch('/assets/data/form-elements/code-12.json').then(function(response) { return response.text(); }).then((html) => { setCode12(html); });
		fetch('/assets/data/form-elements/code-13.json').then(function(response) { return response.text(); }).then((html) => { setCode13(html); });
	});
	
	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link to="/form/elements">Home</Link></li>
				<li className="breadcrumb-item"><Link to="/form/elements">Form Stuff</Link></li>
				<li className="breadcrumb-item active">Form Elements</li>
			</ol>
			<h1 className="page-header">Form Elements <small>header small text goes here...</small></h1>
		
			<div className="row mb-3">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Form Controls</PanelHeader>
						<PanelBody>
							<div className="alert alert-muted">
								Textual form controls—like <code>&lt;input&gt;</code>s, <code>&lt;textarea&gt;</code>s, <code>&lt;select&gt;</code>s are styled with the <code>.form-control</code> and <code>.form-select</code> class. Included are styles for general appearance, focus state, sizing, and more.
							</div>
							<form>
								<div className="row mb-15px">
									<label className="form-label col-form-label col-md-3">Email address</label>
									<div className="col-md-9">
										<input type="email" className="form-control mb-5px" placeholder="Enter email" />
										<small className="fs-12px text-gray-500-darker">We'll never share your email with anyone else.</small>
									</div>
								</div>
								<div className="row mb-15px">
									<label className="form-label col-form-label col-md-3">Example select</label>
									<div className="col-md-9">
										<select className="form-select">
											<option>1</option>
											<option>2</option>
											<option>3</option>
											<option>4</option>
											<option>5</option>
										</select>
									</div>
								</div>
								<div className="row mb-15px">
									<label className="form-label col-form-label col-md-3">Example multiple select</label>
									<div className="col-md-9">
										<select multiple className="form-select">
											<option>1</option>
											<option>2</option>
											<option>3</option>
											<option>4</option>
											<option>5</option>
										</select>
									</div>
								</div>
								<div className="row mb-15px">
									<label className="form-label col-form-label col-md-3">Example textarea</label>
									<div className="col-md-9">
										<textarea className="form-control" rows="3"></textarea>
									</div>
								</div>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code1}</Highlight>
						</div>
					</Panel>
									
					<Panel>
						<PanelHeader>Readonly</PanelHeader>
						<PanelBody>
							<form>
								<div className="row mb-15px">
									<label className="form-label col-form-label col-md-3">Readonly</label>
									<div className="col-sm-9">
										<input className="form-control" type="text" placeholder="Readonly input here…" readOnly />
									</div>
								</div>
								<div className="row mb-15px">
									<label className="form-label col-form-label col-md-3">Readonly Plaintext</label>
									<div className="col-sm-9">
										<input type="text" readOnly className="form-control-plaintext" value="email@example.com" />
									</div>
								</div>
								<div className="row mb-15px">
									<label className="form-label col-form-label col-md-3">Password</label>
									<div className="col-sm-9">
										<input type="password" className="form-control" placeholder="Password" />
									</div>
								</div>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code2}</Highlight>
						</div>
					</Panel>
									
					<Panel>
						<PanelHeader>Form Range <span className="badge bg-success">NEW</span></PanelHeader>
						<PanelBody>
							<form>
								<div className="d-flex align-items-center py-2">
									<div className="w-60px text-end pe-2">Min: <b>0</b></div>
									<div className="d-flex flex-1">
										<input type="range" className="form-range" min="0" max="5" id="customRange" />
									</div>
									<div className="w-60px text-start ps-2">Max: <b>50</b></div>
								</div>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code3}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Floating Label <span className="badge bg-success ms-1">NEW</span></PanelHeader>
						<PanelBody>
							<div className="row">
								<div className="col-md-6">
									<div className="form-floating mb-3 mb-md-0">
										<input type="email" className="form-control fs-15px" id="floatingInput" placeholder="name@example.com" />
										<label htmlFor="floatingInput" className="d-flex align-items-center fs-13px">Email address</label>
									</div>
								</div>
								<div className="col-md-6">
									<form className="form-floating">
										<input type="email" className="form-control fs-15px" id="floatingInputValue" placeholder="name@example.com" defaultValue="test@example.com" />
										<label htmlFor="floatingInputValue" className="d-flex align-items-center fs-13px">Input with value</label>
									</form>
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code4}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Sizing</PanelHeader>
						<PanelBody>
							<div className="row">
								<div className="col-md-6">
									<div className="mb-10px">
										<input className="form-control form-control-lg" type="text" placeholder=".form-control-lg" />
									</div>
									<div className="mb-10px">
										<input className="form-control" type="text" placeholder="default input" />
									</div>
									<div className="mb-3 mb-md-0">
										<input className="form-control form-control-sm" type="text" placeholder=".form-control-sm" />
									</div>
								</div>
								<div className="col-md-6">
									<div className="mb-10px">
										<select className="form-select form-select-lg">
											<option>.form-select-lg</option>
										</select>
									</div>
									<div className="mb-10px">
										<select className="form-select">
											<option>default select</option>
										</select>
									</div>
									<div>
										<select className="form-select form-select-sm">
											<option>.form-select-sm</option>
										</select>
									</div>
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code5}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Validation</PanelHeader>
						<PanelBody>
							<form>
								<div className="row mb-10px">
									<label className="form-label col-form-label col-md-3">Valid Input</label>
									<div className="col-md-9">
										<div className="input-group">
											<div className="input-group-text">@</div>
											<input type="text" className="form-control is-valid" />
											<div className="valid-feedback">Looks good!</div>
										</div>
									</div>
								</div>
								<div className="row mb-10px">
									<label className="form-label col-form-label col-md-3">Invalid Input</label>
									<div className="col-md-9">
										<div className="input-group">
											<div className="input-group-text">@</div>
											<input type="text" className="form-control is-invalid" />
											<div className="invalid-feedback">Please choose a unique and valid username.</div>
										</div>
									</div>
								</div>
								<div className="row form-group">
									<label className="form-label col-form-label col-md-3">Tooltip Message</label>
									<div className="col-md-9">
										<div className="row">
											<div className="col-md-6">
												<div className="input-group">
													<div className="input-group-text">@</div>
													<input type="text" className="form-control is-invalid" />
													<div className="invalid-tooltip">Please choose a unique and valid username.</div>
												</div>
											</div>
											<div className="col-md-6">
												<div className="input-group">
													<div className="input-group-text">@</div>
													<input type="text" className="form-control is-valid" />
													<div className="valid-tooltip">Looks good!</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code6}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
					
			<h3 className="mb-3">Checkboxes and Radios</h3>
			<div className="row mb-3">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Checkboxes <span className="badge bg-success ms-1">NEW</span></PanelHeader>
						<PanelBody>
							<form>
								<div className="row mb-3">
									<label className="form-label col-form-label col-md-3">Checkbox</label>
									<div className="col-md-9">
										<div className="form-check mt-2 mb-2">
											<input className="form-check-input" type="checkbox" onChange={handleOnChange} defaultValue="" id="flexCheckDefault" />
											<label className="form-check-label" htmlFor="flexCheckDefault">
												Default checkbox
											</label>
										</div>
										<div className="form-check mb-2">
											<input className="form-check-input" type="checkbox" onChange={handleOnChange} defaultValue="" id="flexCheckChecked" checked />
											<label className="form-check-label" htmlFor="flexCheckChecked">
												Checked checkbox
											</label>
										</div>
										<div className="form-check mb-2">
											<input className="form-check-input" type="checkbox" onChange={handleOnChange} defaultValue="" id="flexCheckDisabled" disabled />
											<label className="form-check-label" htmlFor="flexCheckDisabled">
												Disabled checkbox
											</label>
										</div>
										<div className="form-check mb-2">
											<input className="form-check-input" type="checkbox" onChange={handleOnChange} defaultValue="" id="flexCheckCheckedDisabled" checked disabled />
											<label className="form-check-label" htmlFor="flexCheckCheckedDisabled">
												Disabled checked checkbox
											</label>
										</div>
										<div className="form-check mb-2">
											<input className="form-check-input is-valid" type="checkbox" onChange={handleOnChange} defaultValue="" id="validCheckbox" />
											<label className="form-check-label" htmlFor="validCheckbox">
												Valid Checkbox
											</label>
										</div>
										<div className="form-check">
											<input className="form-check-input is-invalid" type="checkbox" onChange={handleOnChange} defaultValue="" id="invalidCheckbox" />
											<label className="form-check-label" htmlFor="invalidCheckbox">
												Invalid Checkbox
											</label>
										</div>
									</div>
								</div>
								<div className="row mb-2">
									<label className="form-label col-form-label col-md-3">Inline Checkbox</label>
									<div className="col-md-9 pt-2">
										<div className="form-check form-check-inline">
											<input className="form-check-input" type="checkbox" onChange={handleOnChange} id="inlineCheckbox1" defaultValue="option1" />
											<label className="form-check-label" htmlFor="inlineCheckbox1">1</label>
										</div>
										<div className="form-check form-check-inline">
											<input className="form-check-input" type="checkbox" onChange={handleOnChange} id="inlineCheckbox2" defaultValue="option2" />
											<label className="form-check-label" htmlFor="inlineCheckbox2">2</label>
										</div>
										<div className="form-check form-check-inline">
											<input className="form-check-input" type="checkbox" onChange={handleOnChange} id="inlineCheckbox3" defaultValue="option3" disabled />
											<label className="form-check-label" htmlFor="inlineCheckbox3">3 (disabled)</label>
										</div>
									</div>
								</div>
								<div className="row mb-0">
									<label className="form-label col-form-label col-md-3">Switches</label>
									<div className="col-md-9 pt-2">
										<div className="form-check form-switch mb-2">
											<input className="form-check-input" type="checkbox" onChange={handleOnChange} id="flexSwitchCheckDefault" />
											<label className="form-check-label" htmlFor="flexSwitchCheckDefault">Default switch checkbox input</label>
										</div>
										<div className="form-check form-switch mb-2">
											<input className="form-check-input" type="checkbox" onChange={handleOnChange} id="flexSwitchCheckChecked" checked />
											<label className="form-check-label" htmlFor="flexSwitchCheckChecked">Checked switch checkbox input</label>
										</div>
										<div className="form-check form-switch mb-2">
											<input className="form-check-input" type="checkbox" onChange={handleOnChange} id="flexSwitchCheckDisabled" disabled />
											<label className="form-check-label" htmlFor="flexSwitchCheckDisabled">Disabled switch checkbox input</label>
										</div>
										<div className="form-check form-switch">
											<input className="form-check-input" type="checkbox" onChange={handleOnChange} id="flexSwitchCheckCheckedDisabled" checked disabled />
											<label className="form-check-label" htmlFor="flexSwitchCheckCheckedDisabled">Disabled checked switch checkbox input</label>
										</div>
									</div>
								</div>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code7}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Radios <span className="badge bg-success ms-1">NEW</span></PanelHeader>
						<PanelBody>
							<form>
								<div className="row mb-3">
									<label className="form-label col-form-label col-md-3">Radios</label>
									<div className="col-md-9 pt-2">
										<div className="form-check mb-2">
											<input className="form-check-input" type="radio" onChange={handleOnChange} name="flexRadioDefault" id="flexRadioDefault1" />
											<label className="form-check-label" htmlFor="flexRadioDefault1">
												Default radio
											</label>
										</div>
										<div className="form-check mb-2">
											<input className="form-check-input" type="radio" onChange={handleOnChange} name="flexRadioDefault" id="flexRadioDefault2" checked />
											<label className="form-check-label" htmlFor="flexRadioDefault2">
												Default checked radio
											</label>
										</div>
										<div className="form-check mb-2">
											<input className="form-check-input" type="radio" onChange={handleOnChange} name="flexRadioDisabled" id="flexRadioDisabled" disabled />
											<label className="form-check-label" htmlFor="flexRadioDisabled">
												Disabled radio
											</label>
										</div>
										<div className="form-check mb-2">
											<input className="form-check-input" type="radio" onChange={handleOnChange} name="flexRadioDisabled" id="flexRadioCheckedDisabled" checked disabled />
											<label className="form-check-label" htmlFor="flexRadioCheckedDisabled">
												Disabled checked radio
											</label>
										</div>
										<div className="form-check mb-2">
											<input className="form-check-input is-valid" type="radio" onChange={handleOnChange} name="default_radio" id="validDefaultRadio" defaultValue="" />
											<label className="form-check-label" htmlFor="validDefaultRadio">Success State</label>
										</div>
										<div className="form-check">
											<input className="form-check-input is-invalid" type="radio" onChange={handleOnChange} name="default_radio" id="invalidDefaultRadio" defaultValue="" />
											<label className="form-check-label" htmlFor="invalidDefaultRadio">Error State</label>
										</div>
									</div>
								</div>
								<div className="row">
									<label className="form-label col-form-label col-md-3">Inline Radios</label>
									<div className="col-md-9 pt-2">
										<div className="form-check form-check-inline">
											<input className="form-check-input" type="radio" onChange={handleOnChange} id="inlineRadio1" name="inlineRadio" />
											<label className="form-check-label" htmlFor="inlineRadio1">1</label>
										</div>
										<div className="form-check form-check-inline">
											<input className="form-check-input" type="radio" onChange={handleOnChange} id="customRadio2" name="inlineRadio" />
											<label className="form-check-label" htmlFor="customRadio2">2</label>
										</div>
										<div className="form-check form-check-inline">
											<input className="form-check-input" type="radio" onChange={handleOnChange} id="customRadio3" name="inlineRadio" />
											<label className="form-check-label" htmlFor="customRadio3">3 (disabled)</label>
										</div>
									</div>
								</div>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code8}</Highlight>
						</div>
					</Panel>
				</div>
			</div>

			<h3 className="mb-3">Input Group</h3>
			<div className="row mb-3">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Input Group</PanelHeader>
						<PanelBody>
							<div className="input-group mb-3">
								<div className="input-group-text">@</div>
								<input type="text" className="form-control" placeholder="Username" />
							</div>
							<div className="input-group mb-3">
								<input type="text" className="form-control" />
								<div className="input-group-text"><i className="fa fa-calendar"></i></div>
							</div>
							<div className="input-group mb-3">
								<div className="input-group-text">$</div>
								<input type="text" className="form-control" />
								<div className="input-group-text">.00</div>
							</div>
							<div className="input-group mb-10px">
								<div className="input-group-text">
									<input type="checkbox" onChange={handleOnChange} className="form-check-input" />
								</div>
								<input type="text" className="form-control" placeholder="Checkbox add on" />
							</div>
							<div className="input-group mb-10px">
								<div className="input-group-text">
									<input type="radio" onChange={handleOnChange} className="form-check-input" />
								</div>
								<input type="text" className="form-control" placeholder="Radio button add on" />
							</div>
							<div className="input-group">
								<button type="button" className="btn btn-primary">Action</button>
								<button type="button" className="btn btn-primary" data-bs-toggle="dropdown">
									<span className="caret"></span>
								</button>
								<div className="dropdown-menu">
									<Link to="/form/elements" className="dropdown-item">Action</Link>
									<Link to="/form/elements" className="dropdown-item">Another action</Link>
									<Link to="/form/elements" className="dropdown-item">Something else here</Link>
									<div className="dropdown-divider"></div>
									<Link to="/form/elements" className="dropdown-item">Separated link</Link>
								</div>
								<input type="text" className="form-control" />
								<button type="button" className="btn btn-indigo dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown">
									<span className="caret"></span>
								</button>
								<div className="dropdown-menu dropdown-menu-end">
									<Link to="/form/elements" className="dropdown-item">Action</Link>
									<Link to="/form/elements" className="dropdown-item">Another action</Link>
									<Link to="/form/elements" className="dropdown-item">Something else here</Link>
									<div className="dropdown-divider"></div>
									<Link to="/form/elements" className="dropdown-item">Separated link</Link>
								</div>
								<button type="button" className="btn btn-indigo">Action</button>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code9}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Input Group Sizing</PanelHeader>
						<PanelBody>
							<div className="input-group input-group-lg mb-10px">
								<div className="input-group-text">@</div>
								<input type="text" className="form-control" placeholder="Username" />
							</div>
							<div className="input-group mb-10px">
								<div className="input-group-text">@</div>
								<input type="text" className="form-control" placeholder="Username" />
							</div>
							<div className="input-group input-group-sm">
								<div className="input-group-text">@</div>
								<input type="text" className="form-control" placeholder="Username" />
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code10}</Highlight>
						</div>
					</Panel>
				</div>
			</div>

			<h3 className="mb-3">Form Style</h3>
			<div className="row mb-3">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Default Style</PanelHeader>
						<PanelBody>
							<form action="/" method="POST">
								<fieldset>
									<legend className="mb-3">Legend</legend>
									<div className="mb-3">
										<label className="form-label" htmlFor="exampleInputEmail1">Email address</label>
										<input className="form-control" type="email" id="exampleInputEmail1" placeholder="Enter email" />
									</div>
									<div className="mb-3">
										<label className="form-label" htmlFor="exampleInputPassword1">Password</label>
										<input className="form-control" type="password" id="exampleInputPassword1" placeholder="Password" />
									</div>
									<div className="form-check mb-3">
										<input className="form-check-input" type="checkbox" onChange={handleOnChange} id="nf_checkbox_css_1" />
										<label className="form-check-label" htmlFor="nf_checkbox_css_1">Check me out</label>
									</div>
									<button type="submit" className="btn btn-primary w-100px me-5px">Login</button>
									<button type="submit" className="btn btn-default w-100px">Cancel</button>
								</fieldset>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code11}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Form Horizontal</PanelHeader>
						<PanelBody>
							<form action="/" method="POST">
								<fieldset>
									<legend className="mb-3">Legend</legend>
									<div className="row mb-3">
										<label className="form-label col-form-label col-md-3">Email address</label>
										<div className="col-md-9">
											<input type="email" className="form-control" placeholder="Enter email" />
										</div>
									</div>
									<div className="row mb-3">
										<label className="form-label col-form-label col-md-3">Password</label>
										<div className="col-md-9">
											<input type="password" className="form-control" placeholder="Password" />
										</div>
									</div>
									<div className="row mb-3">
										<div className="col-md-9 offset-md-3">
											<div className="form-check">
												<input className="form-check-input" type="checkbox" onChange={handleOnChange} id="fh_checkbox_css_1" />
												<label className="form-check-label" htmlFor="fh_checkbox_css_1">Check me out</label>
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-md-7 offset-md-3">
											<button type="submit" className="btn btn-primary w-100px me-5px">Login</button>
											<button type="submit" className="btn btn-default w-100px ">Cancel</button>
										</div>
									</div>
								</fieldset>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code12}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
			<div className="row">
				<div className="col-12">
					<Panel>
						<PanelHeader>Inline Form</PanelHeader>
						<PanelBody>
							<form className="row row-cols-lg-auto g-3 align-items-center" action="/" method="POST">
								<div className="col-12">
									<input type="email" className="form-control" id="exampleInputEmail2" placeholder="Enter email" />
								</div>
								<div className="col-12">
									<input type="password" className="form-control" id="exampleInputPassword2" placeholder="Password" />
								</div>
								<div className="col-12">
									<div className="form-check">
										<input className="form-check-input" id="inline_form_checkbox" type="checkbox" onChange={handleOnChange} />
										<label className="form-check-label" htmlFor="inline_form_checkbox">Remember me</label>
									</div>
								</div>
								<button type="submit" className="btn btn-primary w-100px me-5px">Sign in</button>
								<button type="submit" className="btn btn-default w-100px">Register</button>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code13}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
		</div>
	)
}

export default FormElements;