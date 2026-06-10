import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import Highlight from 'react-highlight';

function UIMediaObject() {
	const [code1, setCode1] = useState();
	const [code2, setCode2] = useState();
	const [code3, setCode3] = useState();
	const [code4, setCode4] = useState();
	
	useEffect(() => {
		fetch('/assets/data/ui-media-object/code-1.json').then(function(response) { return response.text(); }).then((html) => { setCode1(html); });
		fetch('/assets/data/ui-media-object/code-2.json').then(function(response) { return response.text(); }).then((html) => { setCode2(html); });
		fetch('/assets/data/ui-media-object/code-3.json').then(function(response) { return response.text(); }).then((html) => { setCode3(html); });
		fetch('/assets/data/ui-media-object/code-4.json').then(function(response) { return response.text(); }).then((html) => { setCode4(html); });
	});
	
	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link to="/ui/media-object">Home</Link></li>
				<li className="breadcrumb-item"><Link to="/ui/media-object">UI Elements</Link></li>
				<li className="breadcrumb-item active">Media Object</li>
			</ol>
			<h1 className="page-header">Media Object <small>header small text goes here...</small></h1>
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Default Media Object</PanelHeader>
						<PanelBody>
							<div className="d-flex">
								<Link to="/ui/media-object" className="w-60px">
									<img src="/assets/img/user/user-1.jpg" alt="" className="mw-100 rounded" />
								</Link>
								<div className="ps-3 flex-1">
									<h5 className="mb-1">Media heading</h5>
									<p className="mb-0">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.</p>
								</div>
							</div>
						
							<hr className="bg-gray-500" />
						
							<div className="d-flex">
								<Link to="/ui/media-object" className="w-60px">
									<img src="/assets/img/user/user-2.jpg" alt="" className="mw-100 rounded" />
								</Link>
								<div className="ps-3 flex-1">
									<h5 className="mb-1">Media heading</h5>
									<p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.</p>
								
									<hr className="bg-gray-500" />
								
									<div className="d-flex">
										<Link to="/ui/media-object" className="w-60px">
											<img src="/assets/img/user/user-3.jpg" alt="" className="mw-100 rounded" />
										</Link>
										<div className="ps-3 flex-1">
											<h5 className="mb-1">Nested media heading</h5>
											<p className="mb-0">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.</p>
										</div>
									</div>
								</div>
							</div>
						
							<hr className="bg-gray-500" />
						
							<div className="d-flex">
								<Link to="/ui/media-object" className="w-60px">
									<img src="/assets/img/user/user-4.jpg" alt="" className="mw-100 rounded" />
								</Link>
								<div className="ps-3 flex-1">
									<h5 className="mb-1">Media heading</h5>
									<p className="mb-0">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.</p>
								</div>
							</div>
						
							<hr className="bg-gray-500" />
						
							<div className="d-flex">
								<Link to="/ui/media-object" className="w-60px">
									<img src="/assets/img/user/user-10.jpg" alt="" className="mw-100 rounded" />
								</Link>
								<div className="ps-3 flex-1">
									<h5 className="mb-1">Media heading</h5>
									<p className="mb-0">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.</p>
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
						<PanelHeader>Media List</PanelHeader>
						<PanelBody>
							<div className="d-flex">
								<Link to="/ui/media-object" className="w-60px">
									<img src="/assets/img/user/user-5.jpg" alt="" className="mw-100 rounded-pill" />
								</Link>
								<div className="flex-1 ps-3">
									<h5 className="mb-1">Media heading</h5>
									<p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.</p>
								
									<hr className="bg-gray-500" />
								
									<div className="d-flex">
										<Link to="/ui/media-object" className="w-60px">
											<img src="/assets/img/user/user-6.jpg" alt="" className="mw-100 rounded-pill" />
										</Link>
										<div className="flex-1 ps-3">
											<h5 className="mb-1">Nested media heading</h5>
											<p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.</p>
										
											<hr className="bg-gray-500" />
										
											<div className="d-flex">
												<Link to="/ui/media-object" className="w-60px">
													<img src="/assets/img/user/user-7.jpg" alt="" className="mw-100 rounded-pill" />
												</Link>
											
												<div className="flex-1 ps-3">
													<h5 className="mb-1">Nested media heading</h5>
													<p className="mb-0">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.</p>
												</div>
											</div>
										</div>
									</div>
								
									<hr className="bg-gray-500" />
								
									<div className="d-flex">
										<Link to="/ui/media-object" className="w-60px">
											<img src="/assets/img/user/user-8.jpg" alt="" className="mw-100 rounded-pill" />
										</Link>
										<div className="flex-1 ps-3">
											<h5 className="mb-1">Nested media heading</h5>
											<p className="mb-0">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.</p>
										</div>
									</div>
								</div>
							</div>
						
							<hr className="bg-gray-500" />
						
							<div className="d-flex">
								<div className="flex-1 pe-3">
									<h5 className="mb-1">Media heading</h5>
									<p className="mb-0">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.</p>
								</div>
								<Link to="/ui/media-object" className="w-60px">
									<img src="/assets/img/user/user-9.jpg" alt="" className="mw-100 rounded-pill" />
								</Link>
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
						<PanelHeader>Media Object Sizes</PanelHeader>
						<PanelBody>
							<div className="d-flex">
								<Link to="/ui/media-object" className="w-lg-250px w-100px">
									<img src="/assets/img/gallery/gallery-1.jpg" alt="" className="mw-100 rounded" />
								</Link>
								<div className="flex-1 ps-3">
									<h5 className="mb-1">Media heading</h5>
									Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
								</div>
							</div>
						
							<hr className="bg-gray-500" />
						
							<div className="d-flex">
								<Link to="/ui/media-object" className="w-lg-200px w-80px">
									<img src="/assets/img/gallery/gallery-2.jpg" alt="" className="mw-100 rounded" />
								</Link>
								<div className="flex-1 ps-3">
									<h5 className="mb-1">Media heading</h5>
									Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
								</div>
							</div>
						
							<hr className="bg-gray-500" />
								
							<div className="d-flex">
								<Link to="/ui/media-object" className="w-lg-150px w-60px">
									<img src="/assets/img/gallery/gallery-3.jpg" alt="" className="mw-100 rounded" />
								</Link>
								<div className="flex-1 ps-3">
									<h5 className="mb-1">Media heading</h5>
									Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.
								</div>
							</div>
						
							<hr className="bg-gray-500" />
								
							<div className="d-flex">
								<Link to="/ui/media-object" className="w-lg-100px w-40px">
									<img src="/assets/img/gallery/gallery-4.jpg" alt="" className="mw-100 rounded" />
								</Link>
								<div className="flex-1 ps-3">
									<h5 className="mb-1">Media heading</h5>
									Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code3}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Media List with Button</PanelHeader>
						<PanelBody>
							<div className="d-flex mb-3">
								<Link to="/ui/media-object" className="w-60px">
									<img src="/assets/img/user/user-5.jpg" alt="" className="mw-100 rounded-pill" />
								</Link>
								<div className="flex-1 ps-3">
									<h5 className="mb-1">Media heading</h5>
									<p className="mb-2">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, tempus viverra turpis.</p>
									<p className="mb-0">
										<Link to="/ui/media-object" className="btn btn-sm btn-danger me-5px">Reject</Link>
										<Link to="/ui/media-object" className="btn btn-sm btn-default">Cancel</Link>
									</p>
								</div>
							</div>
						
							<hr className="bg-gray-500" />
						
							<div className="d-flex mb-3">
								<div className="flex-1 pe-3 text-end">
									<h5 className="mb-1">Nested media heading</h5>
									<p className="mb-2">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio,  tempus viverra turpis.</p>
									<p className="mb-0">
										<Link to="/ui/media-object" className="btn btn-sm btn-success me-5px">Published</Link>
										<Link to="/ui/media-object" className="btn btn-sm btn-default">Cancel</Link>
									</p>
								</div>
								<Link to="/ui/media-object" className="w-60px">
									<img src="/assets/img/user/user-6.jpg" alt="" className="mw-100 rounded-pill" />
								</Link>
							</div>
						
							<hr className="bg-gray-500" />
						
							<div className="d-flex mb-3">
								<Link to="/ui/media-object" className="w-60px">
									<img src="/assets/img/user/user-8.jpg" alt="" className="mw-100 rounded-pill" />
								</Link>
								<div className="flex-1 ps-3">
									<h5 className="mb-1">Nested media heading</h5>
									<p className="mb-2">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, tempus viverra turpis.</p>
									<p className="mb-0">
										<Link to="/ui/media-object" className="btn btn-sm btn-primary me-5px">Confirm</Link>
										<Link to="/ui/media-object" className="btn btn-sm btn-default">Cancel</Link>
									</p>
								</div>
							</div>
						
							<hr className="bg-gray-500" />
						
							<div className="d-flex">
								<div className="flex-1 pe-3 text-end">
									<h5 className="mb-1">Nested media heading</h5>
									<p className="mb-2">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio,  tempus viverra turpis.</p>
									<p className="mb-0">
										<Link to="/ui/media-object" className="btn btn-sm btn-warning me-5px">Edit</Link>
										<Link to="/ui/media-object" className="btn btn-sm btn-default">Cancel</Link>
									</p>
								</div>
								<Link to="/ui/media-object" className="w-60px">
									<img src="/assets/img/user/user-7.jpg" alt="" className="mw-100 rounded-pill" />
								</Link>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code4}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
		</div>
	)
}

export default UIMediaObject;