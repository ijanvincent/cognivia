import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelFooter, PanelBody } from './../../components/panel/panel.jsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Highlight from 'react-highlight';

function UIWidgetBoxes() {
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
	const [code14, setCode14] = useState();
	const [code15, setCode15] = useState();
	const [code16, setCode16] = useState();
	const [code17, setCode17] = useState();
	const [code18, setCode18] = useState();
	const [code19, setCode19] = useState();
	const [code20, setCode20] = useState();
	const [code21, setCode21] = useState();
	const [code22, setCode22] = useState();
	const [code23, setCode23] = useState();
	
	useEffect(() => {
		fetch('/assets/data/ui-widget-boxes/code-1.json').then(function(response) { return response.text(); }).then((html) => { setCode1(html); });
		fetch('/assets/data/ui-widget-boxes/code-2.json').then(function(response) { return response.text(); }).then((html) => { setCode2(html); });
		fetch('/assets/data/ui-widget-boxes/code-3.json').then(function(response) { return response.text(); }).then((html) => { setCode3(html); });
		fetch('/assets/data/ui-widget-boxes/code-4.json').then(function(response) { return response.text(); }).then((html) => { setCode4(html); });
		fetch('/assets/data/ui-widget-boxes/code-5.json').then(function(response) { return response.text(); }).then((html) => { setCode5(html); });
		fetch('/assets/data/ui-widget-boxes/code-6.json').then(function(response) { return response.text(); }).then((html) => { setCode6(html); });
		fetch('/assets/data/ui-widget-boxes/code-7.json').then(function(response) { return response.text(); }).then((html) => { setCode7(html); });
		fetch('/assets/data/ui-widget-boxes/code-8.json').then(function(response) { return response.text(); }).then((html) => { setCode8(html); });
		fetch('/assets/data/ui-widget-boxes/code-9.json').then(function(response) { return response.text(); }).then((html) => { setCode9(html); });
		fetch('/assets/data/ui-widget-boxes/code-10.json').then(function(response) { return response.text(); }).then((html) => { setCode10(html); });
		fetch('/assets/data/ui-widget-boxes/code-11.json').then(function(response) { return response.text(); }).then((html) => { setCode11(html); });
		fetch('/assets/data/ui-widget-boxes/code-12.json').then(function(response) { return response.text(); }).then((html) => { setCode12(html); });
		fetch('/assets/data/ui-widget-boxes/code-13.json').then(function(response) { return response.text(); }).then((html) => { setCode13(html); });
		fetch('/assets/data/ui-widget-boxes/code-14.json').then(function(response) { return response.text(); }).then((html) => { setCode14(html); });
		fetch('/assets/data/ui-widget-boxes/code-15.json').then(function(response) { return response.text(); }).then((html) => { setCode15(html); });
		fetch('/assets/data/ui-widget-boxes/code-16.json').then(function(response) { return response.text(); }).then((html) => { setCode16(html); });
		fetch('/assets/data/ui-widget-boxes/code-17.json').then(function(response) { return response.text(); }).then((html) => { setCode17(html); });
		fetch('/assets/data/ui-widget-boxes/code-18.json').then(function(response) { return response.text(); }).then((html) => { setCode18(html); });
		fetch('/assets/data/ui-widget-boxes/code-19.json').then(function(response) { return response.text(); }).then((html) => { setCode19(html); });
		fetch('/assets/data/ui-widget-boxes/code-20.json').then(function(response) { return response.text(); }).then((html) => { setCode20(html); });
		fetch('/assets/data/ui-widget-boxes/code-21.json').then(function(response) { return response.text(); }).then((html) => { setCode21(html); });
		fetch('/assets/data/ui-widget-boxes/code-22.json').then(function(response) { return response.text(); }).then((html) => { setCode22(html); });
		fetch('/assets/data/ui-widget-boxes/code-23.json').then(function(response) { return response.text(); }).then((html) => { setCode23(html); });
	});
	
	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link to="/ui/widget-boxes">Home</Link></li>
				<li className="breadcrumb-item"><Link to="/ui/widget-boxes">UI Elements</Link></li>
				<li className="breadcrumb-item active">Widget Boxes</li>
			</ol>
			<h1 className="page-header">Widget Boxes <small>header small text goes here...</small></h1>
	
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Panel (Default)</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code1}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader noButton={true}>
							<div className="d-flex align-items-center">
								<div className="flex-1">Panel Header with Dropdown</div>
								<div className="btn-group my-n1">
									<button type="button" className="btn btn-success btn-xs">Action</button>
									<button type="button" className="btn btn-success btn-xs dropdown-toggle" data-bs-toggle="dropdown"><b className="caret"></b></button>
									<div className="dropdown-menu dropdown-menu-end">
										<a href="#/" className="dropdown-item">Action</a>
										<a href="#/" className="dropdown-item">Another action</a>
										<a href="#/" className="dropdown-item">Something else here</a>
										<div className="dropdown-divider"></div>
										<a href="#/" className="dropdown-item">Separated link</a>
									</div>
								</div>
							</div>
						</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
						<Highlight className='html'>{code2}</Highlight>
					</div>
					</Panel>
			
					<Panel>
						<PanelHeader noButton={true}>
							<div className="d-flex align-items-center">
								<div className="flex-1">Panel Header with Radio Button</div>
								<div className="btn-group btn-group-toggle my-n1" data-toggle="buttons">
									<input type="radio" name="options" className="btn-check" id="option1" autoComplete="off" defaultChecked />
									<label className="btn btn-success btn-xs" htmlFor="option1"> Option 1</label>
						
									<input type="radio" name="options" className="btn-check" id="option2" autoComplete="off" />
									<label className="btn btn-success btn-xs" htmlFor="option2"> Option 2</label>
								</div>
							</div>
						</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code3}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader noButton={true}>
							<div className="d-flex align-items-center">
								Panel Header with Progress Bar
								<div className="progress progress-sm ms-auto my-n1 w-150px h-10px bg-gray-700">
									<div className="progress-bar progress-bar-striped bg-success progress-bar-animated" style={{width: '40%'}}>40%</div>
								</div>
							</div>
						</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code4}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader noButton={true}>
							Panel Header with Badge <span className="badge bg-success ms-2">NEW</span> 
						</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code5}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader>
							Panel with Alert Box
						</PanelHeader>
						<div className="alert alert-success alert-dismissible fade show rounded-0 mb-0">
							<div className="d-flex">
								<i className="fa fa-check fa-2x me-1"></i>
								<div className="mb-0 ps-2">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac posuere lacus, quis suscipit sem. Nulla sagittis aliquam erat non convallis.
								</div>
							</div>
							<button type="button" className="btn-close ms-3" data-bs-dismiss="alert"></button>
						</div>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code6}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel className="panel-hover-icon">
						<PanelHeader>
							Hover View Icon
						</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code7}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader>
							Panel with Scrollbar
						</PanelHeader>
						<PanelBody>
							<PerfectScrollbar style={{height: '280px'}} options={{suppressScrollX: true}}>
								<p>
									<span className="fa-stack fa-4x float-start me-10px text-dark">
										<i className="fab fa-twitter fa-stack-1x"></i>
									</span>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed enim arcu. 
									Ut posuere in ligula quis ultricies. In in justo turpis. Donec ut dui at massa gravida 
									interdum nec vitae justo. Quisque ullamcorper vehicula dictum. Nullam hendrerit interdum eleifend. 
									Aenean luctus sed arcu laoreet scelerisque. Vivamus non ullamcorper mauris, id sagittis lorem. 
									Proin tincidunt mauris et dolor mattis imperdiet. Sed facilisis mattis diam elementum adipiscing. 
								</p>
								<p>
									<span className="fa-stack fa-4x float-end ms-10px text-dark">
										<i className="fab fa-google-plus fa-stack-1x"></i>
									</span>
									Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
									Ut ante velit, pretium non nisi a, egestas placerat diam. Nullam aliquet iaculis ultricies. 
									Aliquam volutpat, sapien quis volutpat elementum, ligula purus auctor diam, at vestibulum nulla augue 
									vel purus. Praesent ac nisl a magna tincidunt interdum sed in turpis. Maecenas nec condimentum risus. 
									In congue pretium est, eget euismod tortor ornare quis.
								</p>
								<p>
									<span className="fa-stack fa-4x float-start me-10px text-dark">
										<i className="fab fa-facebook fa-stack-1x"></i>
									</span>
									Praesent eu ultrices justo. Vestibulum ante 
									ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; 
									Cras mattis ipsum quis sapien consectetur fringilla. 
									Etiam sagittis sem tempus purus elementum, vitae pretium sapien porta. Curabitur iaculis ante ut aliquam luctus. 
									Vivamus ullamcorper blandit imperdiet. Ut egestas, orci id rhoncus cursus, orci risus scelerisque enim, eget mattis eros lacus quis ligula. 
									Vivamus ullamcorper urna eget hendrerit laoreet.
								</p>
								<p>
									<span className="fa-stack fa-4x float-end ms-10px text-dark">
										<i className="fab fa-apple fa-stack-1x"></i>
									</span>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. 
									Morbi accumsan velit dolor. Donec convallis eleifend magna, at euismod tellus convallis a. 
									Curabitur in nisi dolor. Cras viverra scelerisque orci, sed interdum ligula volutpat non. 
									Nunc eu enim ac neque tempor feugiat. Duis posuere lacus non magna eleifend, 
									non dictum sem feugiat. Duis eleifend condimentum pulvinar.
								</p>
							</PerfectScrollbar>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code8}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader>
							Panel with Toolbar & Footer
						</PanelHeader>
						<div className="panel-toolbar">
							<div className="btn-group me-5px">
								<button className="btn btn-white"><i className="fa fa-bold"></i></button>
								<button className="btn btn-white active"><i className="fa fa-italic"></i></button>
								<button className="btn btn-white"><i className="fa fa-underline"></i></button>
							</div>
							<div className="btn-group">
								<button className="btn btn-white"><i className="fa fa-align-left"></i></button>
								<button className="btn btn-white active"><i className="fa fa-align-center"></i></button>
								<button className="btn btn-white"><i className="fa fa-align-right"></i></button>
								<button className="btn btn-white"><i className="fa fa-align-justify"></i></button>
							</div>
						</div>
						<textarea className="form-control rounded-0 border-start-0 border-end-0 p-3 bg-light" rows="5" defaultValue="This is a form textarea."></textarea>
						<PanelFooter className="text-end border-0">
							<button className="btn btn-white btn-sm">Cancel</button>
							<button className="btn btn-primary btn-sm ms-5px">Action</button>
						</PanelFooter>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code9}</Highlight>
						</div>
					</Panel>
			
					<Panel theme="default" className="panel-with-tabs">
						<PanelHeader noButton={true} className="pb-0">
							<div className="d-flex align-items-end">
								<div className="flex-1 pb-3">Panel with Tabs</div>
								<ul className="nav nav-tabs">
									<li className="nav-item"><a href="#home" data-bs-toggle="tab" className="nav-link active"><i className="fa fa-home"></i> <span className="d-none d-md-inline">Home</span></a></li>
									<li className="nav-item"><a href="#profile" data-bs-toggle="tab" className="nav-link"><i className="fa fa-user"></i> <span className="d-none d-md-inline">Profile</span></a></li>
								</ul>
							</div>
						</PanelHeader>
						<PanelBody>
							<div className="tab-content">
								<div className="tab-pane fade show active" id="home">
									<p>Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui.</p>
								</div>
								<div className="tab-pane fade" id="profile">
									<p>Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr, vero magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean shorts beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown, tumblr butcher vero sint qui sapiente accusamus tattooed echo park.</p>
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code10}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
	
			<h3 className="mb-3 mt-4">Panel Theme</h3>
	
			<div className="row">
				<div className="col-xl-6">
					<Panel theme="default">
						<PanelHeader>Panel (Default)</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code11}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader className="bg-teal-700 text-white">Panel Success</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code12}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader className="bg-orange-700 text-white">Panel Warning</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code13}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader className="bg-red-700 text-white">Panel Danger</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code14}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Panel Inverse</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code15}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader className="bg-blue-700 text-white">Panel Primary</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code16}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader className="bg-cyan-700 text-white">Panel Info</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code17}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
	
	
			<h3 className="mt-4">Full Color Panel Theme</h3>
			<p className="mb-3">
				You can customize the panel body / header <code>background</code> & <code>text color</code> by adding predefined CSS class. E.g <code>.bg-black</code>. Full list of available predefined background class can be found <a href="helper_css.html">here</a>.
			</p>
	
			<div className="row">
				<div className="col-xl-6">
					<Panel className="bg-gray-700">
						<PanelHeader>Full Color Panel</PanelHeader>
						<PanelBody className="text-white">
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code18}</Highlight>
						</div>
					</Panel>
			
					<Panel className="bg-blue text-white">
						<PanelHeader className="bg-blue-700 text-white">Full Color Panel</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code19}</Highlight>
						</div>
					</Panel>
			
					<Panel className="bg-teal text-white">
						<PanelHeader className="bg-teal-700 text-white">Full Color Panel</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code20}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel className="bg-orange text-white">
						<PanelHeader className="bg-orange-700 text-white">Full Color Panel</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code21}</Highlight>
						</div>
					</Panel>
			
					<Panel className="bg-red text-white">
						<PanelHeader className="bg-red-700 text-white">Full Color Panel</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code22}</Highlight>
						</div>
					</Panel>
			
					<Panel className="bg-cyan text-white">
						<PanelHeader className="bg-cyan-700 text-white">Full Color Panel</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code23}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
		</div>
	)
}

export default UIWidgetBoxes