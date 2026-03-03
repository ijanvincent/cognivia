import React from 'react';
import { Link } from 'react-router-dom';

function ExtraOrders() {
	return (
		<div>
			<div className="d-flex align-items-center mb-3">
				<div>
					<ul className="breadcrumb">
						<li className="breadcrumb-item"><a href="#/">Home</a></li>
						<li className="breadcrumb-item"><a href="#/">Extra</a></li>
						<li className="breadcrumb-item active">Orders</li>
					</ul>
					<h1 className="page-header mb-0">Orders</h1>
				</div>
				<div className="ms-auto">
					<a href="#/" className="btn btn-success btn-rounded px-4 rounded-pill"><i className="fa fa-plus fa-lg me-2 ms-n2 text-success-900"></i> Create Orders</a>
				</div>
			</div>
		
			<div className="mb-3 d-md-flex fw-bold">
				<div className="mt-md-0 mt-2"><a href="#/" className="text-dark text-decoration-none"><i className="fa fa-download fa-fw me-1 text-dark text-opacity-50"></i> Export</a></div>
				<div className="ms-md-4 mt-md-0 mt-2 dropdown-toggle">
					<a href="#/" data-bs-toggle="dropdown" className="text-dark text-decoration-none">More Actions <b className="caret"></b></a>
					<div className="dropdown-menu">
						<a href="#/" className="dropdown-item">Action</a>
						<a href="#/" className="dropdown-item">Another action</a>
						<a href="#/" className="dropdown-item">Something else here</a>
						<div role="separator" className="dropdown-divider"></div>
						<a href="#/" className="dropdown-item">Separated link</a>
					</div>
				</div>
			</div>
		
			<div className="card border-0">
				<ul className="nav nav-tabs nav-tabs-v2 px-3">
					<li className="nav-item me-2"><a href="#/" className="nav-link px-2 active">All</a></li>
					<li className="nav-item me-2"><a href="#/" className="nav-link px-2">Unfulfilled</a></li>
					<li className="nav-item me-2"><a href="#/" className="nav-link px-2">Unpaid</a></li>
					<li className="nav-item me-2"><a href="#/" className="nav-link px-2">Open</a></li>
					<li className="nav-item me-2"><a href="#/" className="nav-link px-2">Closed</a></li>
					<li className="nav-item me-2"><a href="#/" className="nav-link px-2">Local delivery</a></li>
				</ul>
				<div className="tab-content p-3">
					<div className="tab-pane fade show active" id="allTab">
						<div className="input-group mb-3">
							<button className="btn btn-white dropdown-toggle" type="button" data-bs-toggle="dropdown"><span className="d-none d-md-inline">Filter orders</span><span className="d-inline d-md-none"><i className="fa fa-credit-card"></i></span> <b className="caret"></b></button>
							<div className="dropdown-menu">
								<a href="#/" className="dropdown-item">Action</a>
								<a href="#/" className="dropdown-item">Another action</a>
								<a href="#/" className="dropdown-item">Something else here</a>
								<div role="separator" className="dropdown-divider"></div>
								<a href="#/" className="dropdown-item">Separated link</a>
							</div>
							<div className="flex-fill position-relative">
								<div className="input-group">
									<div className="input-group-text position-absolute top-0 bottom-0 bg-none border-0 start-0" style={{zIndex: 10}}>
										<i className="fa fa-search opacity-5"></i>
									</div>
									<input type="text" className="form-control px-35px bg-light" placeholder="Search orders..." />
								</div>
							</div>
						</div>
						
						<div className="table-responsive mb-3">
							<table className="table table-hover table-panel text-nowrap align-middle mb-0">
								<thead>
									<tr>
										<th></th>
										<th>Order</th>
										<th>Date</th>
										<th>Customer</th>
										<th>Total</th>
										<th>Payment status</th>
										<th>Fulfillment status</th>
										<th>Items</th>
										<th>Delivery method</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product1" />
												<label className="form-check-label" htmlFor="product1"></label>
											</div>
										</td>
										<td><Link to="/extra/order-details" className="fw-bold">#1950</Link></td>
										<td>Thu 26 Nov, 12:23pm</td>
										<td>Amanda Lee</td>
										<td>$398.00</td>
										<td><span className="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Paid</span></td>
										<td><span className="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Fulfilled</span></td>
										<td>3 items</td>
										<td>Free shipping</td>
									</tr>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product2" />
												<label className="form-check-label" htmlFor="product2"></label>
											</div>
										</td>
										<td><Link to="/extra/order-details" className="fw-bold">#1949</Link></td>
										<td>Thu 26 Nov, 11:54am</td>
										<td>Leonard Oii</td>
										<td>$496.00</td>
										<td><span className="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Paid</span></td>
										<td><span className="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Fulfilled</span></td>
										<td>1 item</td>
										<td>Local pickup</td>
									</tr>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product3" />
												<label className="form-check-label" htmlFor="product3"></label>
											</div>
										</td>
										<td><Link to="/extra/order-details" className="fw-bold">#1948</Link></td>
										<td>Thu 25 Nov, 11:54pm</td>
										<td>John Doe</td>
										<td>$195.00</td>
										<td><span className="badge border border-warning text-warning px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Pending</span></td>
										<td><span className="badge border border-warning text-warning px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Unfulfilled</span></td>
										<td>2 items</td>
										<td>Express</td>
									</tr>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product4" />
												<label className="form-check-label" htmlFor="product4"></label>
											</div>
										</td>
										<td><Link to="/extra/order-details" className="fw-bold">#1947</Link></td>
										<td>Thu 25 Nov, 11:53pm</td>
										<td>Terry Ng</td>
										<td>$195.00</td>
										<td><span className="badge border border-warning text-warning px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Pending</span></td>
										<td><span className="badge border border-warning text-warning px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Unfulfilled</span></td>
										<td>2 items</td>
										<td>Express</td>
									</tr>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product5" />
												<label className="form-check-label" htmlFor="product5"></label>
											</div>
										</td>
										<td><Link to="/extra/order-details" className="fw-bold">#1946</Link></td>
										<td>Thu 25 Nov, 11:52pm</td>
										<td>Terry Ng</td>
										<td>$195.00</td>
										<td><span className="badge border border-warning text-warning px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Pending</span></td>
										<td><span className="badge border border-yellow text-warning px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Unfulfilled</span></td>
										<td>2 items</td>
										<td>Express</td>
									</tr>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product6" />
												<label className="form-check-label" htmlFor="product6"></label>
											</div>
										</td>
										<td><Link to="/extra/order-details" className="fw-bold">#1945</Link></td>
										<td>Thu 24 Nov, 2:43pm</td>
										<td>Lelouch Wong</td>
										<td>$900.00</td>
										<td><span className="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Paid</span></td>
										<td><span className="badge border border-primary text-primary px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Ready for pickup</span></td>
										<td>2 items</td>
										<td>Local pickup</td>
									</tr>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product7" />
												<label className="form-check-label" htmlFor="product7"></label>
											</div>
										</td>
										<td><Link to="/extra/order-details" className="fw-bold">#1944</Link></td>
										<td>Thu 23 Nov, 2:43pm</td>
										<td>Cynthia Ting</td>
										<td>$625.00</td>
										<td><span className="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Paid</span></td>
										<td><span className="badge border border-primary text-primary px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Ready for delivery</span></td>
										<td>1 item</td>
										<td>Local pickup</td>
									</tr>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product8" />
												<label className="form-check-label" htmlFor="product8"></label>
											</div>
										</td>
										<td><Link to="/extra/order-details" className="fw-bold">#1943</Link></td>
										<td>Thu 23 Nov, 11:59am</td>
										<td>Richard Leong</td>
										<td>$195.00</td>
										<td><span className="badge border border-gray-300 text-gray-300 px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Partially refunded</span></td>
										<td><span className="badge border border-danger text-danger px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Partially fulfilled</span></td>
										<td>2 items</td>
										<td>Express</td>
									</tr>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product9" />
												<label className="form-check-label" htmlFor="product9"></label>
											</div>
										</td>
										<td><Link to="/extra/order-details" className="fw-bold">#1942</Link></td>
										<td>Thu 22 Nov, 8:12am</td>
										<td>Clement Tang</td>
										<td>$195.00</td>
										<td><span className="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Paid</span></td>
										<td><span className="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Fulfilled</span></td>
										<td>1 item</td>
										<td>Express</td>
									</tr>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product10" />
												<label className="form-check-label" htmlFor="product10"></label>
											</div>
										</td>
										<td><Link to="/extra/order-details" className="fw-bold">#1941</Link></td>
										<td>Thu 22 Nov, 7:42am</td>
										<td>Richard Leong</td>
										<td>$195.00</td>
										<td><span className="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Paid</span></td>
										<td><span className="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> Fulfilled</span></td>
										<td>1 item</td>
										<td>Express</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="d-md-flex align-items-center">
							<div className="me-md-auto text-md-left text-center mb-2 mb-md-0">
								Showing 1 to 10 of 57 entries
							</div>
							<ul className="pagination mb-0 justify-content-center">
								<li className="page-item disabled"><a href="#/" className="page-link">Previous</a></li>
								<li className="page-item"><a href="#/" className="page-link">1</a></li>
								<li className="page-item active"><a href="#/" className="page-link">2</a></li>
								<li className="page-item"><a href="#/" className="page-link">3</a></li>
								<li className="page-item"><a href="#/" className="page-link">4</a></li>
								<li className="page-item"><a href="#/" className="page-link">5</a></li>
								<li className="page-item"><a href="#/" className="page-link">6</a></li>
								<li className="page-item"><a href="#/" className="page-link">Next</a></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
	
		</div>
	)
}

export default ExtraOrders;