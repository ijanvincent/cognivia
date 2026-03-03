import React, { useEffect } from 'react';
import Masonry from 'masonry-layout';

function Bootstrap5() {
	useEffect(() => {
		new Masonry('[data-masonry]');
	});
  
	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><a href="#/">Home</a></li>
				<li className="breadcrumb-item active">Bootstrap 5</li>
			</ol>
			<h1 className="page-header mb-10px">Bootstrap 5 <small>header small text goes here...</small></h1>
	
			<p className="mb-20px">
				A card is a flexible and extensible content container. It includes options for headers and footers, a wide variety of content, contextual background colors, and powerful display options. If you’re familiar with Bootstrap 3, cards replace our old panels, wells, and thumbnails. Similar functionality to those components is available as modifier classes for cards.
			</p>
	
			<div className="row">
				<div className="col-xl-3 col-sm-6">
					<div className="mb-10px fs-10px mt-10px"><b className="text-dark">EXAMPLE</b></div>
					<div className="card border-0">
						<img className="card-img-top" src="/assets/img/gallery/gallery-1.jpg" alt="" />
						<div className="card-body">
							<h4 className="card-title mb-10px">Card title</h4>
							<p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
							<a href="#/" className="btn btn-sm btn-default">Go somewhere</a>
						</div>
					</div>
			
					<div className="mb-10px fs-10px mt-20px"><b className="text-dark">IMAGE OVERLAYS</b></div>
					<div className="card bg-dark border-0 text-white">
						<img className="card-img" src="/assets/img/gallery/gallery-15.jpg" alt="" />
						<div className="card-img-overlay bg-gray-900 bg-opacity-50 rounded">
							<h4 className="card-title">Card title</h4>
							<p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
							<p className="card-text">Last updated 3 mins ago</p>
						</div>
					</div>
			
					<div className="mb-10px fs-10px mt-20px"><b className="text-dark">INVERTED TEXT</b></div>
					<div className="card bg-dark border-0 text-white">
						<div className="card-body">
							<h4 className="card-title">Special title treatment</h4>
							<p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
							<a href="#/" className="btn btn-sm btn-warning">Go somewhere</a>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-sm-6">
					<div className="mb-10px fs-10px mt-10px"><b className="text-dark">BLOCKS</b></div>
					<div className="card border-0">
						<div className="card-body">
							This is some text within a card block.
						</div>
					</div>
			
					<div className="mb-10px fs-10px mt-20px"><b className="text-dark">TITLE, TEXT & LINKS</b></div>
					<div className="card border-0">
						<div className="card-body">
							<h4 className="card-title">Card title</h4>
							<h6 className="card-subtitle mb-10px text-muted">Card subtitle</h6>
							<p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
							<a href="#/" className="card-link">Card link</a>
							<a href="#/" className="card-link">Another link</a>
						</div>
					</div>
			
					<div className="mb-10px fs-10px mt-20px"><b className="text-dark">WITH IMAGES</b></div>
			
					<div className="card border-0">
						<img className="card-img-top" src="/assets/img/gallery/gallery-2.jpg" alt="" />
						<div className="card-body">
							<p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
						</div>
					</div>
			
					<div className="mb-10px fs-10px mt-20px"><b className="text-dark">LIST GROUPS</b></div>
					<div className="card mb-4 border-0">
						<ul className="list-group list-group-flush">
							<li className="list-group-item">Cras justo odio</li>
							<li className="list-group-item">Dapibus ac facilisis in</li>
							<li className="list-group-item">Vestibulum at eros</li>
						</ul>
					</div>
				</div>
				<div className="col-xl-3 col-sm-6">
					<div className="mb-10px fs-10px mt-10px"><b className="text-dark">HEADER & FOOTER</b></div>
					<div className="card text-center border-0">
						<div className="card-header fw-bold">
							Featured
						</div>
						<div className="card-body">
							<h4 className="card-title">Special title treatment</h4>
							<p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
							<a href="#/" className="btn btn-sm btn-primary">Go somewhere</a>
						</div>
						<div className="card-footer fw-bold">
							2 days ago
						</div>
					</div>
			
					<div className="mb-10px fs-10px mt-20px"><b className="text-dark">NAVIGATION</b></div>
			
					<div className="card text-center border-0">
						<div className="card-header">
							<ul className="nav nav-tabs card-header-tabs">
								<li className="nav-item">
									<a className="nav-link active" data-bs-toggle="tab" href="#card-tab-1">Active</a>
								</li>
								<li className="nav-item">
									<a className="nav-link" data-bs-toggle="tab" href="#card-tab-2">Link</a>
								</li>
								<li className="nav-item">
									<a className="nav-link disabled" href="#/">Disabled</a>
								</li>
							</ul>
						</div>
						<div className="card-body">
							<div className="tab-content p-0 m-0">
								<div className="tab-pane fade active show" id="card-tab-1">
									<h4 className="card-title">Special title treatment</h4>
									<p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
									<a href="#/" className="btn btn-sm btn-default">Go somewhere</a>
								</div>
								<div className="tab-pane fade" id="card-tab-2">
									<h4 className="card-title">Special title treatment 2</h4>
									<p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
									<a href="#/" className="btn btn-sm btn-yellow">Go somewhere</a>
								</div>
							</div>
						</div>
					</div>

					<div className="mb-10px fs-10px mt-20px"><b className="text-dark">NAVIGATION PILLS</b></div>
			
					<div className="card text-center border-0">
						<div className="card-header">
							<ul className="nav nav-pills card-header-pills">
								<li className="nav-item"><a className="nav-link active" data-bs-toggle="tab" href="#card-pill-1">Active</a></li>
								<li className="nav-item"><a className="nav-link" data-bs-toggle="tab" href="#card-pill-2">Link</a></li>
								<li className="nav-item"><a className="nav-link disabled" data-bs-toggle="tab" href="#/">Disabled</a></li>
							</ul>
						</div>
						<div className="card-body">
							<div className="tab-content p-0 m-0">
								<div className="tab-pane fade active show" id="card-pill-1">
									<h4 className="card-title">Special title treatment</h4>
									<p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
									<a href="#/" className="btn btn-sm btn-primary">Go somewhere</a>
								</div>
								<div className="tab-pane fade" id="card-pill-2">
									<h4 className="card-title">Special title treatment 2</h4>
									<p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
									<a href="#/" className="btn btn-sm btn-success">Go somewhere</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-sm-6">
					<div className="mb-10px fs-10px mt-10px"><b className="text-dark">BACKGROUND VARIANTS</b></div>
			
					<div className="card text-white border-0 bg-teal text-center mb-2">
						<div className="card-body">
							<blockquote className="blockquote">
								<p>Make it so that <br />everything becomes your<br /> spiritual advisor</p>
							</blockquote>
							<figcaption className="blockquote-footer mt-n2 mb-1 text-white text-opacity-75">
								Someone famous in <cite title="Source Title">Source Title</cite>
							</figcaption>
						</div>
					</div>
			
					<div className="card text-white border-0 bg-blue text-center mb-2">
						<div className="card-body">
							<blockquote className="blockquote">
								<p className="mb-2">You don't have <br />to invade a country in order<br /> to be happy</p>
							</blockquote>
							<figcaption className="blockquote-footer mt-n2 mb-1 text-white text-opacity-75">
								Someone famous in <cite title="Source Title">Source Title</cite>
							</figcaption>
						</div>
					</div>
			
					<div className="card text-white border-0 bg-indigo text-center mb-4">
						<div className="card-body">
							<blockquote className="blockquote">
								<p className="mb-2">Imagination is to <br />never pretend to be <br /> handicapped</p>
							</blockquote>
							<figcaption className="blockquote-footer mt-n2 mb-1 text-white text-opacity-75">
								Someone famous in <cite title="Source Title">Source Title</cite>
							</figcaption>
						</div>
					</div>
			
					<div className="mb-10px fs-10px mt-20px"><b className="text-dark">BORDER CARDS</b></div>
			
					<div className="card border-warning text-warning mb-10px">
						<div className="card-body">
							<blockquote className="blockquote">
								<p className="mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
							</blockquote>
							<figcaption className="blockquote-footer mt-n2 mb-1 text-orange-700">
								Someone famous in <cite title="Source Title">Source Title</cite>
							</figcaption>
						</div>
					</div>
			
					<div className="card border-danger text-danger mb-10px">
						<div className="card-body">
							<blockquote className="blockquote">
								<p className="mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
							</blockquote>
							<figcaption className="blockquote-footer mt-n2 mb-1 text-red-700">
								Someone famous in <cite title="Source Title">Source Title</cite>
							</figcaption>
						</div>
					</div>
				</div>
			</div>
	
			<div className="row">
				<div className="col-xl-12">
					<div className="mb-10px fs-10px mt-20px"><b className="text-dark">CARD GROUPS</b></div>
					<div className="card-group">
						<div className="card">
							<img className="card-img-top" src="/assets/img/gallery/gallery-6.jpg" alt="Card cap" />
							<div className="card-body">
								<h4 className="card-title">Card title</h4>
								<p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
								<p className="card-text text-gray">Last updated 3 mins ago</p>
							</div>
						</div>
						<div className="card">
							<img className="card-img-top" src="/assets/img/gallery/gallery-7.jpg" alt="Card cap" />
							<div className="card-body">
								<h4 className="card-title">Card title</h4>
								<p className="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
								<p className="card-text text-gray">Last updated 3 mins ago</p>
							</div>
						</div>
						<div className="card">
							<img className="card-img-top" src="/assets/img/gallery/gallery-8.jpg" alt="Card cap" />
							<div className="card-body">
								<h4 className="card-title">Card title</h4>
								<p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
								<p className="card-text text-gray">Last updated 3 mins ago</p>
							</div>
						</div>
						<div className="card">
							<img className="card-img-top" src="/assets/img/gallery/gallery-9.jpg" alt="Card cap" />
							<div className="card-body">
								<h4 className="card-title">Card title</h4>
								<p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
								<p className="card-text text-gray">Last updated 3 mins ago</p>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-12">
					<div className="mb-10px fs-10px mt-20px"><b className="text-dark">CARD COLUMNS</b></div>
					<div className="row" data-masonry='{"percentPosition": true }'>
						<div className="col-sm-6 col-lg-4 mb-4">
							<div className="card border-0">
								<div className="h-250px rounded-top" style={{backgroundImage: 'url(/assets/img/gallery/gallery-11.jpg)', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}></div>
								<div className="card-body">
									<h5 className="card-title mb-2">Card title that wraps to a new line</h5>
									<p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
								</div>
							</div>
						</div>
						<div className="col-sm-6 col-lg-4 mb-4">
							<div className="card border-0">
								<div className="card-body">
									<blockquote className="blockquote mb-0">
										<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
										<footer className="blockquote-footer text-gray">
											Someone famous in <cite title="Source Title">Source Title</cite>
										</footer>
									</blockquote>
								</div>
							</div>
						</div>
						<div className="col-sm-6 col-lg-4 mb-4">
							<div className="card border-0 bg-dark text-white">
								<div className="h-250px rounded-top card-img" style={{backgroundImage: 'url(/assets/img/gallery/gallery-10.jpg)', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}></div>
								<div className="card-img-overlay">
									<h4 className="card-title">Card title</h4>
									<p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
									<p className="card-text">Last updated 3 mins ago</p>
								</div>
							</div>
						</div>
						<div className="col-sm-6 col-lg-4 mb-4">
							<div className="card border-0 bg-indigo text-white text-center">
								<div className="card-body">
									<blockquote className="blockquote mb-0">
										<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat.</p>
										<footer className="blockquote-footer text-white text-opacity-75">
											Someone famous in <cite title="Source Title">Source Title</cite>
										</footer>
									</blockquote>
								</div>
							</div>
						</div>
						<div className="col-sm-6 col-lg-4 mb-4">
							<div className="card border-0 text-white">
								<div className="h-250px rounded-top card-img" style={{backgroundImage: 'url(/assets/img/gallery/gallery-17.jpg)', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}></div>
								<div className="card-img-overlay">
									<h4 className="card-title">Card title</h4>
									<p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
									<p className="card-text">Last updated 3 mins ago</p>
								</div>
							</div>
						</div>
						<div className="col-sm-6 col-lg-4 mb-4">
							<div className="card border-0 text-white bg-dark text-center">
								<div className="card-body">
									<blockquote className="blockquote mb-0">
										<p>Fusce finibus sed augue quis volutpat. Duis non cursus felis. Nunc tristique lacinia orci, vel iaculis ipsum pretium at. Nullam ac mattis eros. Quisque a mauris in ex vulputate accumsan.</p>
										<footer className="blockquote-footer text-white text-opacity-75">
											Someone famous in <cite title="Source Title">Source Title</cite>
										</footer>
									</blockquote>
								</div>
							</div>
						</div>
						<div className="col-sm-6 col-lg-4 mb-4">
							<div className="card border-0">
								<div className="card-body">
									<h4 className="card-title">Card title</h4>
									<p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
									<p className="card-text text-gray">Last updated 3 mins ago</p>
								</div>
							</div>
						</div>
						<div className="col-sm-6 col-lg-4 mb-4">
							<div className="card border-0 text-white">
								<div className="h-250px rounded-top card-img" style={{backgroundImage: 'url(/assets/img/gallery/gallery-13.jpg)', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}></div>
								<div className="card-img-overlay">
									<h4 className="card-title">Card title</h4>
									<p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
									<p className="card-text">Last updated 3 mins ago</p>
								</div>
							</div>
						</div>
						<div className="col-sm-6 col-lg-4 mb-4">
							<div className="card border-0 text-center">
								<div className="card-body">
									<h4 className="card-title">Card title</h4>
									<p className="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
									<p className="card-text text-gray">Last updated 3 mins ago</p>
								</div>
							</div>
						</div>
						<div className="col-sm-6 col-lg-4 mb-4">
							<div className="card border-0">
								<div className="h-250px rounded-top" style={{backgroundImage: 'url(/assets/img/gallery/gallery-14.jpg)', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}></div>
								<div className="card-body">
									<h4 className="card-title">Card title</h4>
									<p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Bootstrap5;