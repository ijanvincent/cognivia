import React from 'react';
import { Link } from 'react-router-dom';

function ExtraInvoice() {
	const print = () => {
		window.print();
	}
	return (
		<div>
			<ol className="breadcrumb hidden-print float-xl-end">
				<li className="breadcrumb-item"><Link to="/extra/invoice">Home</Link></li>
				<li className="breadcrumb-item active">Invoice</li>
			</ol>
			<h1 className="page-header hidden-print">Invoice <small>header small text goes here...</small></h1>
			<div className="invoice">
				<div className="invoice-company">
					<span className="float-end hidden-print">
						<Link to="/extra/invoice" className="btn btn-sm btn-white mb-10px me-2"><i className="fa fa-file-pdf t-plus-1 text-danger fa-fw fa-lg"></i> Export as PDF</Link>
						<Link to="/extra/invoice" onClick={print} className="btn btn-sm btn-white mb-10px"><i className="fa fa-print t-plus-1 fa-fw fa-lg"></i> Print</Link>
					</span>
					Company Name, Inc
				</div>
				<div className="invoice-header">
					<div className="invoice-from">
						<small>from</small>
						<address className="mt-5px mb-5px">
							<strong className="text-dark">Twitter, Inc.</strong><br />
							Street Address<br />
							City, Zip Code<br />
							Phone: (123) 456-7890<br />
							Fax: (123) 456-7890
						</address>
					</div>
					<div className="invoice-to">
						<small>to</small>
						<address className="mt-5px mb-5px">
							<strong className="text-dark">Company Name</strong><br />
							Street Address<br />
							City, Zip Code<br />
							Phone: (123) 456-7890<br />
							Fax: (123) 456-7890
						</address>
					</div>
					<div className="invoice-date">
						<small>Invoice / July period</small>
						<div className="date text-dark mt-5px">August 3,2024</div>
						<div className="invoice-detail">
							#0000123DSS<br />
							Services Product
						</div>
					</div>
				</div>
				<div className="invoice-content">
					<div className="table-responsive">
						<table className="table table-invoice">
							<thead>
								<tr>
									<th>TASK DESCRIPTION</th>
									<th className="text-center" width="10%">RATE</th>
									<th className="text-center" width="10%">HOURS</th>
									<th className="text-end" width="20%">LINE TOTAL</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<span className="text-dark">Website design &amp; development</span><br />
										<small>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id sagittis arcu.</small>
									</td>
									<td className="text-center">$50.00</td>
									<td className="text-center">50</td>
									<td className="text-end">$2,500.00</td>
								</tr>
								<tr>
									<td>
										<span className="text-dark">Branding</span><br />
										<small>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id sagittis arcu.</small>
									</td>
									<td className="text-center">$50.00</td>
									<td className="text-center">40</td>
									<td className="text-end">$2,000.00</td>
								</tr>
								<tr>
									<td>
										<span className="text-dark">Redesign Service</span><br />
										<small>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id sagittis arcu.</small>
									</td>
									<td className="text-center">$50.00</td>
									<td className="text-center">50</td>
									<td className="text-end">$2,500.00</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="invoice-price">
						<div className="invoice-price-left">
							<div className="invoice-price-row">
								<div className="sub-price">
									<small>SUBTOTAL</small>
									<span className="text-dark">$4,500.00</span>
								</div>
								<div className="sub-price">
									<i className="fa fa-plus text-muted"></i>
								</div>
								<div className="sub-price">
									<small>PAYPAL FEE (5.4%)</small>
									<span className="text-dark">$108.00</span>
								</div>
							</div>
						</div>
						<div className="invoice-price-right">
							<small>TOTAL</small> <span className="fw-bold">$4508.00</span>
						</div>
					</div>
				</div>
				<div className="invoice-note">
					* Make all cheques payable to [Your Company Name]<br />
					* Payment is due within 30 days<br />
					* If you have any questions concerning this invoice, contact  [Name, Phone Number, Email]
				</div>
				<div className="invoice-footer">
					<p className="text-center mb-5px fw-bold">
						THANK YOU FOR YOUR BUSINESS
					</p>
					<p className="text-center">
						<span className="me-10px"><i className="fa fa-fw fa-lg fa-globe"></i> matiasgallipoli.com</span>
						<span className="me-10px"><i className="fa fa-fw fa-lg fa-phone-volume"></i> T:016-18192302</span>
						<span className="me-10px"><i className="fa fa-fw fa-lg fa-envelope"></i> rtiemps@gmail.com</span>
					</p>
				</div>
			</div>
		</div>
	)
}

export default ExtraInvoice;