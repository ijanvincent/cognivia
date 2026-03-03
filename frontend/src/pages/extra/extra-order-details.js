import React from 'react';

function ExtraOrderDetails() {
	return (
		<div>
			<div className="d-flex align-items-center">
				<div>
					<ol className="breadcrumb">
						<li className="breadcrumb-item"><a href="#/">Home</a></li>
						<li className="breadcrumb-item"><a href="#/">Extra</a></li>
						<li className="breadcrumb-item active">Order Details</li>
					</ol>
					<h1 className="page-header">
						Order Details
					</h1>
				</div>
			</div>
			<div className="mb-3 d-md-flex fw-bold">
				<div className="mt-md-0 mt-2"><a href="#/" className="text-decoration-none text-dark"><i className="fa fa-print fa-fw me-1 text-dark text-opacity-50"></i> Print</a></div>
				<div className="ms-md-4 mt-md-0 mt-2"><a href="#/" className="text-decoration-none text-dark"><i className="fa fa-boxes-stacked fa-fw me-1 text-dark text-opacity-50"></i> Restock items</a></div>
				<div className="ms-md-4 mt-md-0 mt-2"><a href="#/" className="text-decoration-none text-dark"><i className="fa fa-pen fa-fw me-1 text-dark text-opacity-50"></i> Edit</a></div>
				<div className="ms-md-4 mt-md-0 mt-2 dropdown-toggle">
					<a href="#/" data-bs-toggle="dropdown" className="text-decoration-none text-dark text-opacity-75"><i className="fa fa-cog fa-fw me-1 text-dark text-opacity-50"></i> More Actions <b className="caret"></b></a>
					<div className="dropdown-menu">
						<a className="dropdown-item" href="#/">Action</a>
						<a className="dropdown-item" href="#/">Another action</a>
						<a className="dropdown-item" href="#/">Something else here</a>
						<div role="separator" className="dropdown-divider"></div>
						<a className="dropdown-item" href="#/">Separated link</a>
					</div>
				</div>
			</div>
			<div className="row gx-4">
				<div className="col-xl-8 mb-xl-0 mb-4">
					<div className="card border-0 mb-4">
						<div className="card-header bg-none p-3 h6 m-0 d-flex align-items-center">
							<i className="fa fa-shopping-bag fa-lg me-2 text-gray text-opacity-50"></i>
							Products (3)
							<a href="#/" className="ms-auto text-decoration-none text-gray-500"><i className="fa fa-truck fa-lg me-1"></i> Add Tracking Link</a>
						</div>
						<div className="card-body p-3 text-dark fw-bold">
							<div className="row align-items-center">
								<div className="col-lg-8 d-flex align-items-center">
									<div className="h-65px w-65px d-flex align-items-center justify-content-center position-relative">
										<img src="/assets/img/product/product-1.jpg" alt="" className="mw-100 mh-100" />
										<span className="w-20px h-20px p-0 d-flex align-items-center justify-content-center badge bg-primary text-white position-absolute end-0 top-0 fw-bold fs-12px rounded-pill mt-n2 me-n2">1</span>
									</div>
									<div className="ps-3 flex-1">
										<div><a href="#/" className="text-decoration-none text-dark">iPhone 13 Pro Max</a></div>
										<div className="text-dark text-opacity-50 small fw-bold">
											SKU: IP13PROMAX-512
										</div>
									</div>
								</div>
								<div className="col-lg-2 m-0 ps-lg-3">
									$999 x 1
								</div>
								<div className="col-lg-2 text-dark fw-bold m-0 text-end">
									$999
								</div>
							</div>
							<hr className="my-4" />
							<div className="row">
								<div className="col-lg-8 d-flex align-items-center">
									<div className="h-65px w-65px d-flex align-items-center justify-content-center position-relative">
										<img src="/assets/img/product/product-2.jpg" alt="" className="mw-100 mh-100" />
										<span className="w-20px h-20px p-0 d-flex align-items-center justify-content-center badge bg-primary text-white position-absolute end-0 top-0 fw-bold fs-12px rounded-pill mt-n2 me-n2">1</span>
									</div>
									<div className="ps-3 flex-1">
										<div className=""><a href="#/" className="text-decoration-none text-dark">Macbook Pro 2024</a></div>
										<div className="text-dark text-opacity-50 small fw-bold">
											SKU: MACBOOKPRO-1TB
										</div>
									</div>
								</div>
								<div className="col-lg-2 m-0 ps-lg-3">
									$1,999 x 1
								</div>
								<div className="col-lg-2 text-dark fw-bold m-0 text-end">
									$1,999
								</div>
							</div>
							<hr className="my-4" />
							<div className="row">
								<div className="col-lg-8 d-flex align-items-center">
									<div className="h-65px w-65px d-flex align-items-center justify-content-center position-relative">
										<img src="/assets/img/product/product-3.jpg" alt="" className="mw-100 mh-100" />
										<span className="w-20px h-20px p-0 d-flex align-items-center justify-content-center badge bg-primary text-white position-absolute end-0 top-0 fw-bold fs-12px rounded-pill mt-n2 me-n2">1</span>
									</div>
									<div className="ps-3 flex-1">
										<div className=""><a href="#/" className="text-decoration-none text-dark">Apple Watch 5</a></div>
										<div className="text-dark text-opacity-50 small fw-bold">
											SKU: APPLEWATCHBLACK
										</div>
									</div>
								</div>
								<div className="col-lg-2 m-0 ps-lg-3">
									$599 x 1
								</div>
								<div className="col-lg-2 text-dark fw-bold m-0 text-end">
									$599
								</div>
							</div>
						</div>
						<div className="card-footer bg-none d-flex p-3">
							<a href="#/" className="btn btn-default ms-auto">More <b className="caret"></b></a>
							<a href="#/" className="btn btn-primary ms-2">Add Tracking</a>
						</div>
					</div>
					<div className="card border-0">
						<div className="card-header bg-none p-3 h6 m-0 d-flex align-items-center">
							<i className="fa fa-credit-card fa-lg me-2 text-gray text-opacity-50"></i>
							Payment Records
							<a href="#/" className="ms-auto text-decoration-none text-gray-500"><i className="fab fa-paypal me-1 fa-lg"></i> View paypal records</a>
						</div>
						<div className="card-body">
							<table className="table table-borderless table-sm fw-bold m-0">
								<tbody>
									<tr>
										<td className="w-150px">Subtotal</td>
										<td>3 items</td>
										<td className="text-end">$3,496.00</td>
									</tr>
									<tr>
										<td>Tax</td>
										<td>GST 5%</td>
										<td className="text-end">$174.80</td>
									</tr>
									<tr>
										<td>Shipping Fee</td>
										<td>promo code: <u className="text-success">FREESHIPPING</u> (<strike>$120.00</strike>)</td>
										<td className="text-end">$0.00</td>
									</tr>
									<tr>
										<td className="pb-2" colSpan="2"><b>Total</b></td>
										<td className="text-end pb-2 text-decoration-underline"><b>$3670.80</b></td>
									</tr>
									<tr>
										<td colSpan="3">
											<hr className="m-0" />
										</td>
									</tr>
									<tr>
										<td className="pt-2 pb-2" nowrap="true">
											Paid by customer
										</td>
										<td className="pt-2 pb-2">
											via <a href="#/" className="text-primary text-decoration-none">Paypal</a> (#IRU9589320)
										</td>
										<td className="pt-2 pb-2 text-end">$3670.80</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="card-footer bg-none d-flex p-3">
							<a href="#/" className="btn btn-primary ms-auto">Mark as paid</a>
						</div>
					</div>
				</div>
				<div className="col-xl-4">
					<div className="card border-0 mb-4">
						<div className="card-header bg-none p-3 h6 m-0 d-flex align-items-center">
							Notes
							<a href="#/" className="ms-auto text-decoration-none text-gray-500">Edit</a>
						</div>
						<div className="card-body">
							No notes from customer
						</div>
					</div>
					<div className="card border-0 mb-4">
						<div className="card-header bg-none p-3 h6 m-0 d-flex align-items-center">
							Customer
							<a href="#/" className="ms-auto text-decoration-none text-gray-500">Edit</a>
						</div>
						<div className="card-body fw-bold">
							<div className="d-flex align-items-center">
								<a href="#/" className="d-block"><img src="/assets/img/user/user-1.jpg" alt="" width="45" className="rounded-pill" /></a>
								<div className="flex-1 ps-3">
									<a href="#/" className="d-block text-decoration-none">John Smith</a>
									johnsmith@gmail.com
								</div>
							</div>
						</div>
					</div>
					<div className="card border-0 mb-4">
						<div className="card-header bg-none p-3 h6 m-0 d-flex align-items-center">
							Shipping Information
							<a href="#/" className="ms-auto text-decoration-none text-gray-500">Edit</a>
						</div>
						<div className="card-body fw-bold">
							<i className="fa fa-phone fa-fw"></i> +916-663-4289<br /><br />
							867 Highland View Drive<br />
							Newcastle, CA<br />
							California<br />
							95658<br />
							<br />
							<a href="#/" className="text-decoration-none text-gray-600"><i className="fa fa-location-dot fa-fw"></i> View map</a>
						</div>
					</div>
					<div className="card border-0 mb-4">
						<div className="card-header bg-none p-3 h6 m-0 d-flex align-items-center">
							Billing Information
							<a href="#/" className="ms-auto text-decoration-none text-gray-500">Edit</a>
						</div>
						<div className="card-body fw-bold">
							867 Highland View Drive<br />
							Newcastle, CA<br />
							California<br />
							95658<br />
						</div>
					</div>
				</div>
			</div>
	
		</div>
	)
}

export default ExtraOrderDetails;