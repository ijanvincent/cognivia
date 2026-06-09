import React, { useState, useEffect } from 'react';
import Highlight from 'react-highlight';

function UITabsAccordion() {
	const [code1, setCode1] = useState();
	const [code2, setCode2] = useState();
	const [code3, setCode3] = useState();
	
	useEffect(() => {
		fetch('/assets/data/ui-tabs-accordions/code-1.json').then(function(response) { return response.text(); }).then((html) => { setCode1(html); });
		fetch('/assets/data/ui-tabs-accordions/code-2.json').then(function(response) { return response.text(); }).then((html) => { setCode2(html); });
		fetch('/assets/data/ui-tabs-accordions/code-3.json').then(function(response) { return response.text(); }).then((html) => { setCode3(html); });
	});
	
	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><a href="#/">Home</a></li>
				<li className="breadcrumb-item"><a href="#/">UI Elements</a></li>
				<li className="breadcrumb-item active">Tabs & Accordions</li>
			</ol>
			<h1 className="page-header">Tabs & Accordions <small>header small text goes here...</small></h1>
			
			<div className="row">
				<div className="col-xl-6">
					<ul className="nav nav-tabs">
						<li className="nav-item">
							<a href="#default-tab-1" data-bs-toggle="tab" className="nav-link active">
								<span className="d-sm-none">Tab 1</span>
								<span className="d-sm-block d-none">Default Tab 1</span>
							</a>
						</li>
						<li className="nav-item">
							<a href="#default-tab-2" data-bs-toggle="tab" className="nav-link">
								<span className="d-sm-none">Tab 2</span>
								<span className="d-sm-block d-none">Default Tab 2</span>
							</a>
						</li>
						<li className="nav-item">
							<a href="#default-tab-3" data-bs-toggle="tab" className="nav-link">
								<span className="d-sm-none">Tab 3</span>
								<span className="d-sm-block d-none">Default Tab 3</span>
							</a>
						</li>
					</ul>
					<div className="tab-content panel rounded-0 p-3 m-0">
						<div className="tab-pane fade active show" id="default-tab-1">
							<h3 className="mt-10px"><i className="fa fa-cog"></i> Lorem ipsum dolor sit amet</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
								Integer ac dui eu felis hendrerit lobortis. Phasellus elementum, nibh eget adipiscing porttitor, 
								est diam sagittis orci, a ornare nisi quam elementum tortor. Proin interdum ante porta est convallis 
								dapibus dictum in nibh. Aenean quis massa congue metus mollis fermentum eget et tellus. 
								Aenean tincidunt, mauris ut dignissim lacinia, nisi urna consectetur sapien, nec eleifend orci eros id lectus.
							</p>
							<p className="text-end mb-0">
								<a href="#/" className="btn btn-white me-5px">Default</a>
								<a href="#/" className="btn btn-primary">Primary</a>
							</p>
						</div>
						<div className="tab-pane fade" id="default-tab-2">
							<blockquote className="blockquote">
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
							</blockquote>
							<figcaption className="blockquote-footer">
								Someone famous in <cite title="Source Title">Source Title</cite>
							</figcaption>
							<h4>Lorem ipsum dolor sit amet</h4>
							<p>
								Nullam ac sapien justo. Nam augue mauris, malesuada non magna sed, feugiat blandit ligula. 
								In tristique tincidunt purus id iaculis. Pellentesque volutpat tortor a mauris convallis, 
								sit amet scelerisque lectus adipiscing.
							</p>
						</div>
						<div className="tab-pane fade" id="default-tab-3">
							<p>
								<span className="fa-stack fa-4x float-start me-10px">
									<i className="fa fa-square fa-stack-2x"></i>
									<i className="fab fa-twitter text-white fa-stack-1x"></i>
								</span>
								Praesent tincidunt nulla ut elit vestibulum viverra. Sed placerat magna eget eros accumsan elementum. 
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam quis lobortis neque. 
								Maecenas justo odio, bibendum fringilla quam nec, commodo rutrum quam. 
								Donec cursus erat in lacus congue sodales. Nunc bibendum id augue sit amet placerat. 
								Quisque et quam id felis tempus volutpat at at diam. Vivamus ac diam turpis.Sed at lacinia augue. 
								Nulla facilisi. Fusce at erat suscipit, dapibus elit quis, luctus nulla. 
								Quisque adipiscing dui nec orci fermentum blandit.
								Sed at lacinia augue. Nulla facilisi. Fusce at erat suscipit, dapibus elit quis, luctus nulla. 
								Quisque adipiscing dui nec orci fermentum blandit.
							</p>
						</div>
					</div>
					<div className="hljs-wrapper rounded-0 rounded-bottom mb-4">
						<Highlight className='html'>{code1}</Highlight>
					</div>
					<ul className="nav nav-pills mb-2">
						<li className="nav-item">
							<a href="#nav-pills-tab-1" data-bs-toggle="tab" className="nav-link active">
								<span className="d-sm-none">Pills 1</span>
								<span className="d-sm-block d-none">Pills Tab 1</span>
							</a>
						</li>
						<li className="nav-item">
							<a href="#nav-pills-tab-2" data-bs-toggle="tab" className="nav-link">
								<span className="d-sm-none">Pills 2</span>
								<span className="d-sm-block d-none">Pills Tab 2</span>
							</a>
						</li>
						<li className="nav-item">
							<a href="#nav-pills-tab-3" data-bs-toggle="tab" className="nav-link">
								<span className="d-sm-none">Pills 3</span>
								<span className="d-sm-block d-none">Pills Tab 3</span>
							</a>
						</li>
						<li className="nav-item">
							<a href="#nav-pills-tab-4" data-bs-toggle="tab" className="nav-link">
								<span className="d-sm-none">Pills 4</span>
								<span className="d-sm-block d-none">Pills Tab 4</span>
							</a>
						</li>
					</ul>
					<div className="tab-content p-3 rounded-top panel rounded-0 m-0">
						<div className="tab-pane fade active show" id="nav-pills-tab-1">
							<h3 className="mt-10px">Nav Pills Tab 1</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
								Integer ac dui eu felis hendrerit lobortis. Phasellus elementum, nibh eget adipiscing porttitor, 
								est diam sagittis orci, a ornare nisi quam elementum tortor. 
								Proin interdum ante porta est convallis dapibus dictum in nibh. 
								Aenean quis massa congue metus mollis fermentum eget et tellus. 
								Aenean tincidunt, mauris ut dignissim lacinia, nisi urna consectetur sapien, 
								nec eleifend orci eros id lectus.
							</p>
						</div>
						<div className="tab-pane fade" id="nav-pills-tab-2">
							<h3 className="mt-10px">Nav Pills Tab 2</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
								Integer ac dui eu felis hendrerit lobortis. Phasellus elementum, nibh eget adipiscing porttitor, 
								est diam sagittis orci, a ornare nisi quam elementum tortor. 
								Proin interdum ante porta est convallis dapibus dictum in nibh. 
								Aenean quis massa congue metus mollis fermentum eget et tellus. 
								Aenean tincidunt, mauris ut dignissim lacinia, nisi urna consectetur sapien, 
								nec eleifend orci eros id lectus.
							</p>
						</div>
						<div className="tab-pane fade" id="nav-pills-tab-3">
							<h3 className="mt-10px">Nav Pills Tab 3</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
								Integer ac dui eu felis hendrerit lobortis. Phasellus elementum, nibh eget adipiscing porttitor, 
								est diam sagittis orci, a ornare nisi quam elementum tortor. 
								Proin interdum ante porta est convallis dapibus dictum in nibh. 
								Aenean quis massa congue metus mollis fermentum eget et tellus. 
								Aenean tincidunt, mauris ut dignissim lacinia, nisi urna consectetur sapien, 
								nec eleifend orci eros id lectus.
							</p>
						</div>
						<div className="tab-pane fade" id="nav-pills-tab-4">
							<h3 className="mt-10px">Nav Pills Tab 4</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
								Integer ac dui eu felis hendrerit lobortis. Phasellus elementum, nibh eget adipiscing porttitor, 
								est diam sagittis orci, a ornare nisi quam elementum tortor. 
								Proin interdum ante porta est convallis dapibus dictum in nibh. 
								Aenean quis massa congue metus mollis fermentum eget et tellus. 
								Aenean tincidunt, mauris ut dignissim lacinia, nisi urna consectetur sapien, 
								nec eleifend orci eros id lectus.
							</p>
						</div>
					</div>
					<div className="hljs-wrapper rounded-0 rounded-bottom mb-4">
						<Highlight className='html'>{code2}</Highlight>
					</div>
				</div>
				<div className="col-xl-6">
					<div className="accordion" id="accordion">
						<div className="accordion-item border-0">
							<div className="accordion-header" id="headingOne">
								<button className="accordion-button bg-gray-900 text-white px-3 py-10px pointer-cursor" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
									<i className="fa fa-circle fa-fw text-blue me-2 fs-8px"></i> Collapsible Group Item #1
								</button>
							</div>
							<div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordion">
								<div className="accordion-body bg-gray-800 text-white">
									Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
								</div>
							</div>
						</div>
						<div className="accordion-item border-0">
							<div className="accordion-header" id="headingTwo">
								<button className="accordion-button bg-gray-900 text-white px-3 pt-10px pb-10px pointer-cursor collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
									<i className="fa fa-circle fa-fw text-indigo me-2 fs-8px"></i> Collapsible Group Item #2
								</button>
							</div>
							<div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordion">
								<div className="accordion-body bg-gray-800 text-white">
									Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
								</div>
							</div>
						</div>
						<div className="accordion-item border-0">
							<div className="accordion-header" id="headingThree">
								<button className="accordion-button bg-gray-900 text-white px-3 pt-10px pb-10px pointer-cursor collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
									<i className="fa fa-circle fa-fw text-teal me-2 fs-8px"></i> Collapsible Group Item #3
								</button>
							</div>
							<div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordion">
								<div className="accordion-body bg-gray-800 text-white">
									Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
								</div>
							</div>
						</div>
						<div className="accordion-item border-0">
							<div className="accordion-header" id="headingFour">
								<button className="accordion-button bg-gray-900 text-white px-3 pt-10px pb-10px pointer-cursor collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour">
									<i className="fa fa-circle fa-fw text-info me-2 fs-8px"></i> Collapsible Group Item #4
								</button>
							</div>
							<div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#accordion">
								<div className="accordion-body bg-gray-800 text-white">
									Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
								</div>
							</div>
						</div>
						<div className="accordion-item border-0">
							<div className="accordion-header" id="headingFive">
								<button className="accordion-button bg-gray-900 text-white px-3 pt-10px pb-10px pointer-cursor collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive">
									<i className="fa fa-circle fa-fw text-warning me-2 fs-8px"></i> Collapsible Group Item #5
								</button>
							</div>
							<div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#accordion">
								<div className="accordion-body bg-gray-800 text-white">
									Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
								</div>
							</div>
						</div>
						<div className="accordion-item border-0">
							<div className="accordion-header" id="headingSix">
								<button className="accordion-button bg-gray-900 text-white px-3 pt-10px pb-10px pointer-cursor collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix">
									<i className="fa fa-circle fa-fw text-danger me-2 fs-8px"></i> Collapsible Group Item #6
								</button>
							</div>
							<div id="collapseSix" className="accordion-collapse collapse" data-bs-parent="#accordion">
								<div className="accordion-body bg-gray-800 text-white">
									Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
								</div>
							</div>
						</div>
						<div className="accordion-item border-0">
							<div className="accordion-header" id="headingSeven">
								<button className="accordion-button bg-gray-900 text-white px-3 pt-10px pb-10px pointer-cursor collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven">
									<i className="fa fa-circle fa-fw text-muted me-2 fs-8px"></i> Collapsible Group Item #7
								</button>
							</div>
							<div id="collapseSeven" className="accordion-collapse collapse" data-bs-parent="#accordion">
								<div className="accordion-body bg-gray-800 text-white">
									Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
								</div>
							</div>
						</div>
						<div className="hljs-wrapper rounded-0 rounded-bottom mb-4">
						<Highlight className='html'>{code3}</Highlight>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UITabsAccordion