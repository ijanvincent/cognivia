import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import Highlight from 'react-highlight';

function TableElements() {
	const [code1, setCode1] = useState();
	const [code2, setCode2] = useState();
	const [code3, setCode3] = useState();
	const [code4, setCode4] = useState();
	const [code5, setCode5] = useState();
	const [code6, setCode6] = useState();
	const [code7, setCode7] = useState();
	const [code8, setCode8] = useState();
	const [code9, setCode9] = useState();
	
	function handleOnChange() {
	
	}
	
	useEffect(() => {
		fetch('/assets/data/table-elements/code-1.json').then(function(response) { return response.text(); }).then((html) => { setCode1(html); });
		fetch('/assets/data/table-elements/code-2.json').then(function(response) { return response.text(); }).then((html) => { setCode2(html); });
		fetch('/assets/data/table-elements/code-3.json').then(function(response) { return response.text(); }).then((html) => { setCode3(html); });
		fetch('/assets/data/table-elements/code-4.json').then(function(response) { return response.text(); }).then((html) => { setCode4(html); });
		fetch('/assets/data/table-elements/code-5.json').then(function(response) { return response.text(); }).then((html) => { setCode5(html); });
		fetch('/assets/data/table-elements/code-6.json').then(function(response) { return response.text(); }).then((html) => { setCode6(html); });
		fetch('/assets/data/table-elements/code-7.json').then(function(response) { return response.text(); }).then((html) => { setCode7(html); });
		fetch('/assets/data/table-elements/code-8.json').then(function(response) { return response.text(); }).then((html) => { setCode8(html); });
		fetch('/assets/data/table-elements/code-9.json').then(function(response) { return response.text(); }).then((html) => { setCode9(html); });
	});
	
	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link to="/table/basic">Home</Link></li>
				<li className="breadcrumb-item"><Link to="/table/basic">Tables</Link></li>
				<li className="breadcrumb-item active">Table Elements</li>
			</ol>
			<h1 className="page-header">Table Elements <small>header small text goes here...</small></h1>
			
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Default Table</PanelHeader>
						<PanelBody>
							<div className="table-responsive">
								<table className="table mb-0">
									<thead>
										<tr>
											<th>#</th>
											<th>Username</th>
											<th>Email Address</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>1</td>
											<td>Nicky Almera</td>
											<td>nicky@hotmail.com</td>
										</tr>
										<tr>
											<td>2</td>
											<td>Edmund Wong</td>
											<td>edmund@yahoo.com</td>
										</tr>
										<tr>
											<td>3</td>
											<td>Harvinder Singh</td>
											<td>harvinder@gmail.com</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code1}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Hover Table</PanelHeader>
						<PanelBody>
							<div className="table-responsive">
								<table className="table table-hover mb-0">
									<thead>
										<tr>
											<th>#</th>
											<th>Username</th>
											<th>Email Address</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>1</td>
											<td>Nicky Almera</td>
											<td>nicky@hotmail.com</td>
										</tr>
										<tr>
											<td>2</td>
											<td>Edmund Wong</td>
											<td>edmund@yahoo.com</td>
										</tr>
										<tr>
											<td>3</td>
											<td>Harvinder Singh</td>
											<td>harvinder@gmail.com</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code2}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Table Small</PanelHeader>
						<PanelBody>
							<div className="table-responsive">
								<table className="table table-sm mb-0">
									<thead>
										<tr>
											<th>#</th>
											<th>Username</th>
											<th>Email Address</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>1</td>
											<td>Nicky Almera</td>
											<td>nicky@hotmail.com</td>
										</tr>
										<tr>
											<td>2</td>
											<td>Edmund Wong</td>
											<td>edmund@yahoo.com</td>
										</tr>
										<tr>
											<td>3</td>
											<td>Harvinder Singh</td>
											<td>harvinder@gmail.com</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code3}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Responsive Table</PanelHeader>
						<PanelBody>
							<div className="table-responsive">
								<table className="table">
									<thead>
										<tr>
											<th>#</th>
											<th nowrap="true">Table heading</th>
											<th nowrap="true">Table heading</th>
											<th nowrap="true">Table heading</th>
											<th nowrap="true">Table heading</th>
											<th nowrap="true">Table heading</th>
											<th nowrap="true">Table heading</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>1</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
										</tr>
										<tr>
											<td>2</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
										</tr>
										<tr>
											<td>3</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code4}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Table Striped</PanelHeader>
						<PanelBody>
							<div className="table-responsive">
								<table className="table table-striped mb-0">
									<thead>
										<tr>
											<th>#</th>
											<th>Username</th>
											<th>Email Address</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>1</td>
											<td>Nicky Almera</td>
											<td>nicky@hotmail.com</td>
										</tr>
										<tr>
											<td>2</td>
											<td>Edmund Wong</td>
											<td>edmund@yahoo.com</td>
										</tr>
										<tr>
											<td>3</td>
											<td>Harvinder Singh</td>
											<td>harvinder@gmail.com</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code5}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Bordered Table</PanelHeader>
						<PanelBody>
							<div className="table-responsive">
								<table className="table table-bordered mb-0">
									<thead>
										<tr>
											<th>#</th>
											<th>Username</th>
											<th>Email Address</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>1</td>
											<td>Nicky Almera</td>
											<td>nicky@hotmail.com</td>
										</tr>
										<tr>
											<td>2</td>
											<td>Edmund Wong</td>
											<td>edmund@yahoo.com</td>
										</tr>
										<tr>
											<td>3</td>
											<td>Harvinder Singh</td>
											<td>harvinder@gmail.com</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code6}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>UI Elements in Table <span className="badge bg-success ms-5px">NEW</span></PanelHeader>
						<PanelBody>
							<div className="table-responsive">
								<table className="table table-striped mb-0 align-middle">
									<thead>
										<tr>
											<th>#</th>
											<th>Username</th>
											<th>Email Address</th>
											<th width="1%"></th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>
												<img src="../assets/img/user/user-1.jpg" alt="" className="rounded h-30px" />
											</td>
											<td>Nicky Almera</td>
											<td>nicky@hotmail.com</td>
											<td nowrap="true">
												<Link to="/table/basic" className="btn btn-sm btn-primary w-60px me-1">Edit</Link>
												<Link to="/table/basic" className="btn btn-sm btn-white w-60px">Delete</Link>
											</td>
										</tr>
										<tr>
											<td>
												<img src="../assets/img/user/user-2.jpg" alt="" className="rounded h-30px" />
											</td>
											<td>Edmund Wong</td>
											<td>edmund@yahoo.com</td>
											<td nowrap="true">
												<div className="btn-group">
													<Link to="/table/basic" className="btn btn-white btn-sm w-90px">Settings</Link>
													<Link to="/table/basic" className="btn btn-white btn-sm dropdown-toggle w-30px no-caret" data-bs-toggle="dropdown">
													<span className="caret"></span>
													</Link>
													<div className="dropdown-menu dropdown-menu-end">
														<Link to="/table/basic" className="dropdown-item">Action 1</Link>
														<Link to="/table/basic" className="dropdown-item">Action 2</Link>
														<Link to="/table/basic" className="dropdown-item">Action 3</Link>
														<div className="dropdown-divider"></div>
														<Link to="/table/basic" className="dropdown-item">Action 4</Link>
													</div>
												</div>
											</td>
										</tr>
										<tr>
											<td>
												<img src="../assets/img/user/user-3.jpg" alt="" className="rounded h-30px" />
											</td>
											<td>Harvinder Singh</td>
											<td>harvinder@gmail.com</td>
											<td className="with-btn" nowrap="true">
												<Link to="/table/basic" className="btn btn-sm btn-primary w-60px me-1">Edit</Link>
												<Link to="/table/basic" className="btn btn-sm btn-white w-60px">Delete</Link>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code7}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Form Elements in Table <span className="badge bg-success ms-1">NEW</span></PanelHeader>
						<PanelBody>
							<div className="table-responsive">
								<table className="table table-striped align-middle mb-0">
									<thead>
										<tr>
											<th>
												<div className="form-check">
													<input type="checkbox" value="" onChange={handleOnChange} id="table_checkbox_1" className="form-check-input" />
													<label htmlFor="table_checkbox_1" className="form-check-label">&nbsp;</label>
												</div>
											</th>
											<th>Username</th>
											<th>Email Address</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>
												<div className="form-check">
													<input type="checkbox" value="" onChange={handleOnChange} id="table_checkbox_2" className="form-check-input" />
													<label htmlFor="table_checkbox_2" className="form-check-label">&nbsp;</label>
												</div>
											</td>
											<td>Nicky Almera</td>
											<td>nicky@hotmail.com</td>
										</tr>
										<tr>
											<td>
												<div className="form-check">
													<input type="radio" value="" onChange={handleOnChange} id="table_radio_1" className="form-check-input" />
													<label htmlFor="table_radio_1" className="form-check-label">&nbsp;</label>
												</div>
											</td>
											<td>Edmund Wong</td>
											<td>edmund@yahoo.com</td>
										</tr>
										<tr>
											<td>
												<div className="form-check">
													<input type="radio" value="" onChange={handleOnChange} id="table_radio_2" className="form-check-input" />
													<label htmlFor="table_radio_2" className="form-check-label">&nbsp;</label>
												</div>
											</td>
											<td><input type="text" className="form-control my-n1" defaultValue="Harvinder Singh" /></td>
											<td>harvinder@gmail.com</td>
										</tr>
										<tr>
											<td>
												<div className="form-check">
													<input type="radio" value="" onChange={handleOnChange} id="table_radio_3" className="form-check-input" />
													<label htmlFor="table_radio_3" className="form-check-label">&nbsp;</label>
												</div>
											</td>
											<td>
												<div className="input-group my-n1">
													<div className="input-group-text">@</div>
													<input type="text" className="form-control" placeholder="Terry" />
												</div>
											</td>
											<td>terry@gmail.com</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code8}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Table Row Classes</PanelHeader>
						<PanelBody>
							<div className="table-responsive">
								<table className="table mb-0">
									<thead>
										<tr>
											<th>#</th>
											<th>Username</th>
											<th>Email Address</th>
										</tr>
									</thead>
									<tbody>
										<tr className="table-active">
											<td>1</td>
											<td>Nicky Almera</td>
											<td>nicky@hotmail.com</td>
										</tr>
										<tr className="table-info">
											<td>2</td>
											<td>Terry Khoo</td>
											<td>terry@gmail.com</td>
										</tr>
										<tr className="table-success">
											<td>3</td>
											<td>Edmund Wong</td>
											<td>edmund@yahoo.com</td>
										</tr>
										<tr className="table-warning">
											<td>4</td>
											<td>Harvinder Singh</td>
											<td>harvinder@gmail.com</td>
										</tr>
										<tr className="table-danger">
											<td>5</td>
											<td>Terry Khoo</td>
											<td>terry@gmail.com</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code9}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
		</div>
	)
}

export default TableElements;