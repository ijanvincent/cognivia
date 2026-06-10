import React from 'react';

function ExtraSearch() {
	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><a href="#/">Home</a></li>
				<li className="breadcrumb-item"><a href="#/">Extra</a></li>
				<li className="breadcrumb-item active">Search Results</li>
			</ol>
			<h1 className="page-header">Search Results <small>3 results found</small></h1>
			<div className="row">
				<div className="col-md-12">
					<div className="input-group input-group-lg mb-3">
						<input type="text" className="form-control input-white" placeholder="Enter keywords here..." />
						<button type="button" className="btn btn-primary"><i className="fa fa-search fa-fw"></i> Search</button>
						<button type="button" className="btn btn-primary dropdown-toggle no-caret" data-bs-toggle="dropdown">
							<i className="fa fa-cog fa-fw"></i>
						</button>
						<div className="dropdown-menu dropdown-menu-end">
							<a href="#/" className="dropdown-item">Action</a>
							<a href="#/" className="dropdown-item">Another action</a>
							<a href="#/" className="dropdown-item">Something else here</a>
							<div className="dropdown-divider"></div>
							<a href="#/" className="dropdown-item">Separated link</a>
						</div>
					</div>
				
					<div className="d-block d-md-flex align-items-center mb-3">
						<div className="d-flex">
							<div className="dropdown me-2">
								<a href="#/" className="btn btn-white dropdown-toggle" data-bs-toggle="dropdown">
									Filters by <b className="caret"></b>
								</a>
								<div className="dropdown-menu dropdown-menu-start" role="menu">
									<a href="#/" className="dropdown-item">Posted Date</a>
									<a href="#/" className="dropdown-item">View Count</a>
									<a href="#/" className="dropdown-item">Total View</a>
									<div className="dropdown-divider"></div>
									<a href="#/" className="dropdown-item">Location</a>
								</div>
							</div>
							<div className="btn-group">
								<a href="#/" className="btn btn-white"><i className="fa fa-list"></i></a>
								<a href="#/" className="btn btn-white"><i className="fa fa-th"></i></a>
								<a href="#/" className="btn btn-white"><i className="fa fa-th-large"></i></a>
							</div>
						</div>
						<div className="ms-auto d-none d-lg-block">
							<ul className="pagination mb-0">
								<li className="page-item disabled"><a href="#/" className="page-link">«</a></li>
								<li className="page-item active"><a href="#/" className="page-link">1</a></li>
								<li className="page-item"><a href="#/" className="page-link">2</a></li>
								<li className="page-item"><a href="#/" className="page-link">3</a></li>
								<li className="page-item"><a href="#/" className="page-link">4</a></li>
								<li className="page-item"><a href="#/" className="page-link">5</a></li>
								<li className="page-item"><a href="#/" className="page-link">6</a></li>
								<li className="page-item"><a href="#/" className="page-link">7</a></li>
								<li className="page-item"><a href="#/" className="page-link">»</a></li>
							</ul>
						</div>
					</div>
					
					<div className="result-list">
						<div className="result-item">
							<a href="#/" className="result-image" style={{backgroundImage: 'url(/assets/img/gallery/gallery-51.jpg)'}}> </a>
							<div className="result-info">
								<h4 className="title"><a href="#/">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</a></h4>
								<p className="location">United State, BY 10089</p>
								<p className="desc">
									Nunc et ornare ligula. Aenean commodo lectus turpis, eu laoreet risus lobortis quis. Suspendisse vehicula mollis magna vel aliquet. Donec ac tempor neque, convallis euismod mauris. Integer dictum dictum ipsum quis viverra.
								</p>
								<div className="btn-row">
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Analytics"><i className="fa fa-fw fa-chart-bar"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Tasks"><i className="fa fa-fw fa-tasks"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Configuration"><i className="fa fa-fw fa-cog"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Performance"><i className="fa fa-fw fa-tachometer"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Users"><i className="fa fa-fw fa-user"></i></a>
								</div>
							</div>
							<div className="result-price">
								$92,101 <small>PER MONTH</small>
								<a href="#/" className="btn btn-yellow d-block w-100">View Details</a>
							</div>
						</div>
						<div className="result-item">
							<a href="#/" className="result-image" style={{backgroundImage: 'url(/assets/img/gallery/gallery-52.jpg)'}}> </a>
							<div className="result-info">
								<h4 className="title"><a href="#/">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</a></h4>
								<p className="location">United State, BY 10089</p>
								<p className="desc">
									Nunc et ornare ligula. Aenean commodo lectus turpis, eu laoreet risus lobortis quis. Suspendisse vehicula mollis magna vel aliquet. Donec ac tempor neque, convallis euismod mauris. Integer dictum dictum ipsum quis viverra.
								</p>
								<div className="btn-row">
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Analytics"><i className="fa fa-fw fa-chart-bar"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Tasks"><i className="fa fa-fw fa-tasks"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Configuration"><i className="fa fa-fw fa-cog"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Performance"><i className="fa fa-fw fa-tachometer"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Users"><i className="fa fa-fw fa-user"></i></a>
								</div>
							</div>
							<div className="result-price">
								$102,232 <small>PER MONTH</small>
								<a href="#/" className="btn btn-yellow d-block w-100">View Details</a>
							</div>
						</div>
						<div className="result-item">
							<a href="#/" className="result-image" style={{backgroundImage: 'url(/assets/img/gallery/gallery-53.jpg)'}}> </a>
							<div className="result-info">
								<h4 className="title"><a href="#/">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</a></h4>
								<p className="location">United State, BY 10089</p>
								<p className="desc">
									Nunc et ornare ligula. Aenean commodo lectus turpis, eu laoreet risus lobortis quis. Suspendisse vehicula mollis magna vel aliquet. Donec ac tempor neque, convallis euismod mauris. Integer dictum dictum ipsum quis viverra.
								</p>
								<div className="btn-row">
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Analytics"><i className="fa fa-fw fa-chart-bar"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Tasks"><i className="fa fa-fw fa-tasks"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Configuration"><i className="fa fa-fw fa-cog"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Performance"><i className="fa fa-fw fa-tachometer"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Users"><i className="fa fa-fw fa-user"></i></a>
								</div>
							</div>
							<div className="result-price">
								$183,921 <small>PER MONTH</small>
								<a href="#/" className="btn btn-yellow d-block w-100">View Details</a>
							</div>
						</div>
						<div className="result-item">
							<a href="#/" className="result-image" style={{backgroundImage: 'url(/assets/img/gallery/gallery-54.jpg)'}}> </a>
							<div className="result-info">
								<h4 className="title"><a href="#/">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</a></h4>
								<p className="location">United State, BY 10089</p>
								<p className="desc">
									Nunc et ornare ligula. Aenean commodo lectus turpis, eu laoreet risus lobortis quis. Suspendisse vehicula mollis magna vel aliquet. Donec ac tempor neque, convallis euismod mauris. Integer dictum dictum ipsum quis viverra.
								</p>
								<div className="btn-row">
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Analytics"><i className="fa fa-fw fa-chart-bar"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Tasks"><i className="fa fa-fw fa-tasks"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Configuration"><i className="fa fa-fw fa-cog"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Performance"><i className="fa fa-fw fa-tachometer"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Users"><i className="fa fa-fw fa-user"></i></a>
								</div>
							</div>
							<div className="result-price">
								$82,991 <small>PER MONTH</small>
								<a href="#/" className="btn btn-yellow d-block w-100">View Details</a>
							</div>
						</div>
						<div className="result-item">
							<a href="#/" className="result-image" style={{backgroundImage: 'url(/assets/img/gallery/gallery-55.jpg)'}}> </a>
							<div className="result-info">
								<h4 className="title"><a href="#/">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</a></h4>
								<p className="location">United State, BY 10089</p>
								<p className="desc">
									Nunc et ornare ligula. Aenean commodo lectus turpis, eu laoreet risus lobortis quis. Suspendisse vehicula mollis magna vel aliquet. Donec ac tempor neque, convallis euismod mauris. Integer dictum dictum ipsum quis viverra.
								</p>
								<div className="btn-row">
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Analytics"><i className="fa fa-fw fa-chart-bar"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Tasks"><i className="fa fa-fw fa-tasks"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Configuration"><i className="fa fa-fw fa-cog"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Performance"><i className="fa fa-fw fa-tachometer"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Users"><i className="fa fa-fw fa-user"></i></a>
								</div>
							</div>
							<div className="result-price">
								$422,999 <small>PER MONTH</small>
								<a href="#/" className="btn btn-yellow d-block w-100">View Details</a>
							</div>
						</div>
						<div className="result-item">
							<a href="#/" className="result-image" style={{backgroundImage: 'url(/assets/img/gallery/gallery-56.jpg)'}}> </a>
							<div className="result-info">
								<h4 className="title"><a href="#/">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</a></h4>
								<p className="location">United State, BY 10089</p>
								<p className="desc">
									Nunc et ornare ligula. Aenean commodo lectus turpis, eu laoreet risus lobortis quis. Suspendisse vehicula mollis magna vel aliquet. Donec ac tempor neque, convallis euismod mauris. Integer dictum dictum ipsum quis viverra.
								</p>
								<div className="btn-row">
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Analytics"><i className="fa fa-fw fa-chart-bar"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Tasks"><i className="fa fa-fw fa-tasks"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Configuration"><i className="fa fa-fw fa-cog"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Performance"><i className="fa fa-fw fa-tachometer"></i></a>
									<a href="#/" data-toggle="tooltip" data-container="body" data-title="Users"><i className="fa fa-fw fa-user"></i></a>
								</div>
							</div>
							<div className="result-price">
								$891,872 <small>PER MONTH</small>
								<a href="#/" className="btn btn-yellow d-block w-100">View Details</a>
							</div>
						</div>
					</div>
					<div className="d-flex mt-20px">
						<ul className="pagination ms-auto me-auto me-lg-0">
							<li className="page-item disabled"><a href="#/" className="page-link">«</a></li>
							<li className="page-item active"><a href="#/" className="page-link">1</a></li>
							<li className="page-item"><a href="#/" className="page-link">2</a></li>
							<li className="page-item"><a href="#/" className="page-link">3</a></li>
							<li className="page-item"><a href="#/" className="page-link">4</a></li>
							<li className="page-item"><a href="#/" className="page-link">5</a></li>
							<li className="page-item"><a href="#/" className="page-link">6</a></li>
							<li className="page-item"><a href="#/" className="page-link">7</a></li>
							<li className="page-item"><a href="#/" className="page-link">»</a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ExtraSearch;