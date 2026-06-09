import React, { useEffect, useContext } from 'react';
import { AppSettings } from './../../config/app-settings.js';
import { Icon } from '@iconify/react';

function ExtraDataManagement() {
  const context = useContext(AppSettings);
  
  var handleTableHeight = function() {
		var targetHeight = window.innerHeight - document.getElementById('table').getBoundingClientRect().top;

		document.getElementById('table').style.height = targetHeight + 'px';
	};

	var handleCheckbox = function() {
		document.querySelectorAll('[data-toggle="check-all"]').forEach(function (checkbox) {
			checkbox.addEventListener('change', function () {
				var isChecked = this.checked;
				var table = this.closest('#table');
				var checkboxes = table.querySelectorAll('tbody input[type="checkbox"]');

				checkboxes.forEach(function (checkbox) {
					checkbox.checked = isChecked;
				});
			});
		});
	};

  useEffect(() => {
    context.handleSetAppSidebarMinified(true);
    context.handleSetAppHeaderInverse(true);
    context.handleSetAppContentFullHeight(true);
    context.handleSetAppContentClass('p-0 bg-component');
    handleTableHeight();
    handleCheckbox();

    return () => {
			context.handleSetAppSidebarMinified(false);
			context.handleSetAppHeaderInverse(false);
			context.handleSetAppContentFullHeight(false);
			context.handleSetAppContentClass('');
    };
		
		// eslint-disable-next-line
	}, []);

  return (
  	<div className="h-100">
			<div className="app-content-padding px-4 py-3">
				<div className="d-lg-flex mb-lg-3 mb-2">
					<h1 className="page-header mb-0 flex-1">Data Management</h1>
					<span className="d-none d-lg-flex align-items-center">
						<a href="#/" className="btn btn-secondary btn-sm d-flex me-2 pe-3 rounded-3">
							<Icon className="iconify fs-18px me-2 ms-n1" icon="solar:printer-bold-duotone" />
							Print Result
						</a>
						<a href="#/" className="btn btn-secondary btn-sm d-flex me-2 pe-3 rounded-3">
							<Icon className="iconify fs-18px me-2 ms-n1" icon="solar:archive-down-minimlistic-bold-duotone" />
							Export Excel
						</a>
						<a href="#/" className="btn btn-theme btn-sm d-flex pe-3 rounded-3">
							<Icon className="iconify fs-18px me-2 ms-n1" icon="solar:refresh-bold-duotone" />
							Reload Data
						</a>
					</span>
				</div>
				<div className="row gx-2 pb-10px">
					<div className="col-lg-4">
						<div className="position-relative">
							<input type="text" className="form-control ps-35px rounded-3" placeholder="Search by products title or ID..." />
							<button className="btn position-absolute start-0 top-0 shadow-none"><i className="fa fa-search fa-lg"></i></button>
						</div>
					</div>
					<div className="col-lg-2 d-lg-block d-none">
						<a href="#/" className="btn btn-white d-flex align-items-center rounded-3" data-bs-toggle="dropdown">
							<i className="far fa-lg fa-calendar me-10px text-body text-opacity-50 d-none"></i>
							<Icon className="iconify fs-20px my-n1 me-2 ms-n1 text-theme" icon="solar:calendar-search-linear" />
							Date Range
							<i className="fa ms-auto fa-chevron-down"></i>
						</a>
						<ul className="dropdown-menu">
							<li><a className="dropdown-item d-flex align-items-center" href="#/"><Icon className="iconify fs-20px my-n1 me-2 ms-n1 text-body text-opacity-50" icon="solar:calendar-line-duotone" /> Last 7 Days</a></li>
							<li><a className="dropdown-item d-flex align-items-center" href="#/"><Icon className="iconify fs-20px my-n1 me-2 ms-n1 text-body text-opacity-50" icon="solar:calendar-line-duotone" /> Last 30 Days</a></li>
							<li><a className="dropdown-item d-flex align-items-center" href="#/"><Icon className="iconify fs-20px my-n1 me-2 ms-n1 text-body text-opacity-50" icon="solar:calendar-line-duotone" /> This Month</a></li>
							<li><a className="dropdown-item d-flex align-items-center" href="#/"><Icon className="iconify fs-20px my-n1 me-2 ms-n1 text-body text-opacity-50" icon="solar:calendar-line-duotone" /> Last Month</a></li>
							<li><a className="dropdown-item d-flex align-items-center" href="#/"><Icon className="iconify fs-20px my-n1 me-2 ms-n1 text-body text-opacity-50" icon="solar:calendar-line-duotone" /> Custom Range</a></li>
						</ul>
					</div>
					<div className="col-lg-2 d-lg-block d-none">
						<a href="#/" className="btn btn-white d-flex align-items-center rounded-3" data-bs-toggle="dropdown">
							<i className="fa fa-lg fa-tags me-10px text-body text-opacity-50 d-none"></i>
							<Icon className="iconify fs-20px my-n1 me-2 ms-n1 text-theme" icon="solar:tag-linear" />
							Status
							<i className="fa ms-auto fa-chevron-down"></i>
						</a>
						<ul className="dropdown-menu">
							<li><a className="dropdown-item d-flex align-items-center" href="#/"><i className="fa fa-circle fs-7px me-2 ms-n1 text-success"></i> Active</a></li>
							<li><a className="dropdown-item d-flex align-items-center" href="#/"><i className="fa fa-circle fs-7px me-2 ms-n1 text-body text-opacity-25"></i> Inactive</a></li>
							<li><a className="dropdown-item d-flex align-items-center" href="#/"><i className="fa fa-circle fs-7px me-2 ms-n1 text-danger"></i> Removed</a></li>
							<li><a className="dropdown-item d-flex align-items-center" href="#/"><i className="fa fa-circle fs-7px me-2 ms-n1 text-warning"></i> Pending</a></li>
							<li><a className="dropdown-item d-flex align-items-center" href="#/"><i className="fa fa-circle fs-7px me-2 ms-n1 text-primary"></i> Archived</a></li>
						</ul>
					</div>
					<div className="col-lg-2 d-lg-block d-none">
						<a href="#/" className="btn btn-white d-flex align-items-center rounded-3" data-bs-toggle="dropdown">
							<i className="fa fa-lg fa-location-dot me-10px text-body text-opacity-50 d-none"></i>
							<Icon className="iconify fs-20px my-n1 me-2 ms-n1 text-theme" icon="solar:map-point-linear" />
							Location
							<i className="fa ms-auto fa-chevron-down"></i>
						</a>
						<ul className="dropdown-menu">
							<li><a className="dropdown-item d-flex align-items-center" href="#/"><Icon className="iconify fs-20px my-n1 me-2 ms-n1 text-body text-opacity-50" icon="solar:map-point-linear" /> New York City, New York, USA</a></li>
							<li><a className="dropdown-item d-flex align-items-center" href="#/"><Icon className="iconify fs-20px my-n1 me-2 ms-n1 text-body text-opacity-50" icon="solar:map-point-linear" /> London, United Kingdom</a></li>
							<li><a className="dropdown-item d-flex align-items-center" href="#/"><Icon className="iconify fs-20px my-n1 me-2 ms-n1 text-body text-opacity-50" icon="solar:map-point-linear" /> Tokyo, Japan</a></li>
							<li><a className="dropdown-item d-flex align-items-center" href="#/"><Icon className="iconify fs-20px my-n1 me-2 ms-n1 text-body text-opacity-50" icon="solar:map-point-linear" /> Sydney, Australia</a></li>
							<li><a className="dropdown-item d-flex align-items-center" href="#/"><Icon className="iconify fs-20px my-n1 me-2 ms-n1 text-body text-opacity-50" icon="solar:map-point-linear" /> Paris, France</a></li>
						</ul>
					</div>
					<div className="col-lg-2 d-lg-block d-none">
						<a href="#/" className="btn btn-white d-flex align-items-center rounded-3" data-bs-toggle="dropdown">
							<Icon className="iconify fs-20px my-n1 me-2 ms-n1 text-theme" icon="solar:tuning-linear" />
							More filters
							<i className="fa ms-auto fa-chevron-down"></i>
						</a>
						<ul className="dropdown-menu">
							<li><a className="dropdown-item" href="#/">High Priority</a></li>
							<li><a className="dropdown-item" href="#/">Low Priority</a></li>
							<li><a className="dropdown-item" href="#/">Overdue</a></li>
							<li><a className="dropdown-item" href="#/">Completed</a></li>
							<li><hr className="dropdown-divider" /></li>
							<li><a className="dropdown-item" href="#/">Custom Filter 1</a></li>
							<li><a className="dropdown-item" href="#/">Custom Filter 2</a></li>
						</ul>
					</div>
				</div>
				<div className="d-lg-flex align-items-center mb-n2">
					<div className="d-lg-flex d-none align-items-center text-nowrap">
						Results per page:
						<select defaultValue="30" className="form-select form-select-sm ms-2 h-25px py-0 ps-2 pe-30px">
							<option value="100">100</option>
							<option value="100">50</option>
							<option value="30">30</option>
						</select>
					</div>
					<div className="d-lg-block d-none ms-2 text-body text-opacity-50">
						1,495 results found
					</div>
		
					<ul className="pagination pagination-sm mb-0 ms-auto justify-content-center">
						<li className="page-item disabled"><a href="#/" className="page-link">Previous</a></li>
						<li className="page-item d-lg-block d-none2"><a className="page-link" href="#/">1</a></li>
						<li className="page-item d-lg-block d-none2"><a className="page-link bg-theme text-theme-color border border-theme" href="#/">2</a></li>
						<li className="page-item d-lg-block d-none2"><a className="page-link" href="#/">3</a></li>
						<li className="page-item d-lg-block d-none2"><a className="page-link" href="#/">4</a></li>
						<li className="page-item d-lg-block d-none2"><a className="page-link" href="#/">5</a></li>
						<li className="page-item"><a className="page-link" href="#/">Next</a></li>
					</ul>
				</div>
			</div>
			<div className="table-responsive" id="table">
				<table className="table table-thead-sticky table-tfoot-sticky table-tbody-bordered table-px-10px table-py-4px table-sm table-striped text-nowrap mb-0">
					<thead>
						<tr>
							<th>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" data-toggle="check-all" />
								</div>
							</th>
							<th>No.</th>
							<th>Category</th>
							<th>Item Name</th>
							<th>Status</th>
							<th>Stock</th>
							<th>Price</th>
							<th>Cost /unit</th>
							<th>07/2024</th>
							<th>08/2024</th>
							<th>09/2024</th>
							<th>10/2024</th>
							<th>11/2024</th>
							<th>12/2024</th>
							<th>Total Sales</th>
							<th>Total Cost</th>
							<th>Total Profit</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>1.</td>
							<td>Mobile Phone</td>
							<td>iPhone 14 Pro Max - 256gb - Deep Purple</td>
							<td>Active</td>
							<td>25</td>
							<td>$999</td>
							<td>$899</td>
							<td>5 sold</td>
							<td>6 sold</td>
							<td>10 sold</td>
							<td>4 sold</td>
							<td>5 sold</td>
							<td>25 sold</td>
							<td>$49,950</td>
							<td>$44,950</td>
							<td>$5,000</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>2.</td>
							<td>Mobile Phone</td>
							<td>iPhone 14 Pro Max - 256gb - Space Black</td>
							<td>Active</td>
							<td>50</td>
							<td>$999</td>
							<td>$899</td>
							<td>10 sold</td>
							<td>16 sold</td>
							<td>20 sold</td>
							<td>14 sold</td>
							<td>10 sold</td>
							<td>55 sold</td>
							<td>$124,875</td>
							<td>$112,375</td>
							<td>$12,500</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>3.</td>
							<td>Mobile Phone</td>
							<td>iPhone 14 - 256gb - Space Black</td>
							<td>Inactive</td>
							<td>0</td>
							<td>$599</td>
							<td>$499</td>
							<td>5 sold</td>
							<td>2 sold</td>
							<td>1 sold</td>
							<td>7 sold</td>
							<td>15 sold</td>
							<td>25 sold</td>
							<td>$32,945</td>
							<td>$27,445</td>
							<td>$5,500</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>4.</td>
							<td>Laptop</td>
							<td>MacBook Pro with M2 Chip - 512gb - Space Grey</td>
							<td>Inactive</td>
							<td>5</td>
							<td>$1,999</td>
							<td>$1,799</td>
							<td>3 sold</td>
							<td>5 sold</td>
							<td>2 sold</td>
							<td>10 sold</td>
							<td>5 sold</td>
							<td>20 sold</td>
							<td>$89,955</td>
							<td>$80,955</td>
							<td>$9,000</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>5.</td>
							<td>Laptop</td>
							<td>MacBook Air with M2 Chip - 256gb - Space Grey</td>
							<td>Inactive</td>
							<td>10</td>
							<td>$1,099</td>
							<td>$899</td>
							<td>11 sold</td>
							<td>9 sold</td>
							<td>15 sold</td>
							<td>15 sold</td>
							<td>5 sold</td>
							<td>20 sold</td>
							<td>$82,425</td>
							<td>$67,425</td>
							<td>$15,000</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>6.</td>
							<td>Desktop</td>
							<td>iMac 24-inch - 1Tb - Silver</td>
							<td>Active</td>
							<td>5</td>
							<td>$1,299</td>
							<td>$999</td>
							<td>5 sold</td>
							<td>4 sold</td>
							<td>1 sold</td>
							<td>10 sold</td>
							<td>5 sold</td>
							<td>10 sold</td>
							<td>$45,465</td>
							<td>$34,965</td>
							<td>$10,500</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>7.</td>
							<td>Desktop</td>
							<td>iMac 24-inch - 1Tb - Blue</td>
							<td>Active</td>
							<td>10</td>
							<td>$1,299</td>
							<td>$999</td>
							<td>5 sold</td>
							<td>4 sold</td>
							<td>1 sold</td>
							<td>10 sold</td>
							<td>5 sold</td>
							<td>10 sold</td>
							<td>$45,465</td>
							<td>$34,965</td>
							<td>$10,500</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>8.</td>
							<td>Desktop</td>
							<td>iMac 24-inch - 1Tb - Purple</td>
							<td>Inactive</td>
							<td>0</td>
							<td>$1,299</td>
							<td>$999</td>
							<td>5 sold</td>
							<td>4 sold</td>
							<td>1 sold</td>
							<td>10 sold</td>
							<td>5 sold</td>
							<td>10 sold</td>
							<td>$45,465</td>
							<td>$34,965</td>
							<td>$10,500</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>9.</td>
							<td>Watch</td>
							<td>Apple Watch Ultra</td>
							<td>Active</td>
							<td>10</td>
							<td>$799</td>
							<td>$599</td>
							<td>2 sold</td>
							<td>3 sold</td>
							<td>5 sold</td>
							<td>10 sold</td>
							<td>0 sold</td>
							<td>5 sold</td>
							<td>$19,975</td>
							<td>$14,975</td>
							<td>$5,000</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>10.</td>
							<td>Watch</td>
							<td>Apple Watch Series 8</td>
							<td>Active</td>
							<td>10</td>
							<td>$399</td>
							<td>$299</td>
							<td>1 sold</td>
							<td>5 sold</td>
							<td>4 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>10 sold</td>
							<td>$7,980</td>
							<td>$5,980</td>
							<td>$2,000</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>11.</td>
							<td>Watch</td>
							<td>Apple Watch SE</td>
							<td>Active</td>
							<td>10</td>
							<td>$249</td>
							<td>$149</td>
							<td>1 sold</td>
							<td>2 sold</td>
							<td>4 sold</td>
							<td>8 sold</td>
							<td>0 sold</td>
							<td>10 sold</td>
							<td>$6,225</td>
							<td>$3,725</td>
							<td>$2,500</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>12.</td>
							<td>Watch</td>
							<td>Apple Watch Hermès</td>
							<td>Active</td>
							<td>2</td>
							<td>$1,229</td>
							<td>$1,029</td>
							<td>1 sold</td>
							<td>0 sold</td>
							<td>2 sold</td>
							<td>3 sold</td>
							<td>0 sold</td>
							<td>4 sold</td>
							<td>$12,290</td>
							<td>$10,290</td>
							<td>$2,000</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>13.</td>
							<td>Desktop</td>
							<td>Mac Mini</td>
							<td>Active</td>
							<td>2</td>
							<td>$699</td>
							<td>$599</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>1 sold</td>
							<td>1 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>$1,398</td>
							<td>$1,198</td>
							<td>$200</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>14.</td>
							<td>Desktop</td>
							<td>Mac Studio</td>
							<td>Inactive</td>
							<td>0</td>
							<td>$1,999</td>
							<td>$1,599</td>
							<td>1 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>$1,999</td>
							<td>$1,599</td>
							<td>$400</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>15.</td>
							<td>Desktop</td>
							<td>Studio Display</td>
							<td>Active</td>
							<td>2</td>
							<td>$1,599</td>
							<td>$1,099</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>$0</td>
							<td>$0</td>
							<td>$0</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>16.</td>
							<td>Desktop</td>
							<td>Mac Pro</td>
							<td>Active</td>
							<td>2</td>
							<td>$5,999</td>
							<td>$4,999</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>$0</td>
							<td>$0</td>
							<td>$0</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>17.</td>
							<td>Desktop</td>
							<td>Pro Display XDR</td>
							<td>Active</td>
							<td>2</td>
							<td>$4,999</td>
							<td>$3,999</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>$0</td>
							<td>$0</td>
							<td>$0</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>18.</td>
							<td>Tablet</td>
							<td>iPad Pro 11-inch</td>
							<td>Active</td>
							<td>10</td>
							<td>$799</td>
							<td>$699</td>
							<td>5 sold</td>
							<td>1 sold</td>
							<td>2 sold</td>
							<td>2 sold</td>
							<td>5 sold</td>
							<td>15 sold</td>
							<td>$23,970</td>
							<td>$20,970</td>
							<td>$3,000</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>19.</td>
							<td>Tablet</td>
							<td>iPad Pro 12.9-inch</td>
							<td>Active</td>
							<td>5</td>
							<td>$1,099</td>
							<td>$899</td>
							<td>2 sold</td>
							<td>1 sold</td>
							<td>0 sold</td>
							<td>1 sold</td>
							<td>0 sold</td>
							<td>1 sold</td>
							<td>$5,495</td>
							<td>$4,495</td>
							<td>$1,000</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>20.</td>
							<td>Tablet</td>
							<td>iPad Air</td>
							<td>Active</td>
							<td>33</td>
							<td>$599</td>
							<td>$499</td>
							<td>12 sold</td>
							<td>18 sold</td>
							<td>15 sold</td>
							<td>25 sold</td>
							<td>10 sold</td>
							<td>30 sold</td>
							<td>$65,890</td>
							<td>$54,890</td>
							<td>$11,000</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>21.</td>
							<td>Tablet</td>
							<td>iPad (10th gen.)</td>
							<td>Active</td>
							<td>29</td>
							<td>$449</td>
							<td>$339</td>
							<td>5 sold</td>
							<td>10 sold</td>
							<td>7 sold</td>
							<td>23 sold</td>
							<td>15 sold</td>
							<td>20 sold</td>
							<td>$35,920</td>
							<td>$27,120</td>
							<td>$8,800</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>22.</td>
							<td>Tablet</td>
							<td>iPad (9th gen.)</td>
							<td>Active</td>
							<td>52</td>
							<td>$329</td>
							<td>$219</td>
							<td>51 sold</td>
							<td>23 sold</td>
							<td>43 sold</td>
							<td>23 sold</td>
							<td>30 sold</td>
							<td>15 sold</td>
							<td>$60,865</td>
							<td>$40,515</td>
							<td>$20,350</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>23.</td>
							<td>Tablet</td>
							<td>iPad mini</td>
							<td>Active</td>
							<td>26</td>
							<td>$499</td>
							<td>$399</td>
							<td>5 sold</td>
							<td>10 sold</td>
							<td>3 sold</td>
							<td>2 sold</td>
							<td>10 sold</td>
							<td>15 sold</td>
							<td>$22,455</td>
							<td>$17,955</td>
							<td>$4,500</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>24.</td>
							<td>Earphones</td>
							<td>AirPods (3rd generation)</td>
							<td>Active</td>
							<td>55</td>
							<td>$169</td>
							<td>$129</td>
							<td>129 sold</td>
							<td>91 sold</td>
							<td>55 sold</td>
							<td>67 sold</td>
							<td>85 sold</td>
							<td>73 sold</td>
							<td>$84,500</td>
							<td>$64,500</td>
							<td>$20,000</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>25.</td>
							<td>Earphones</td>
							<td>AirPods (2ND generation)</td>
							<td>Active</td>
							<td>182</td>
							<td>$129</td>
							<td>$99</td>
							<td>43 sold</td>
							<td>26 sold</td>
							<td>74 sold</td>
							<td>55 sold</td>
							<td>25 sold</td>
							<td>67 sold</td>
							<td>$37,410</td>
							<td>$28,710</td>
							<td>$8,700</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>26.</td>
							<td>Earphones</td>
							<td>AirPods Max</td>
							<td>Active</td>
							<td>6</td>
							<td>$499</td>
							<td>$399</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>$0</td>
							<td>$0</td>
							<td>$0</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>27.</td>
							<td>Phone</td>
							<td>iPhone 13 - 128gb - Space Grey</td>
							<td>Active</td>
							<td>6</td>
							<td>$599</td>
							<td>$499</td>
							<td>1 sold</td>
							<td>0 sold</td>
							<td>5 sold</td>
							<td>4 sold</td>
							<td>5 sold</td>
							<td>15 sold</td>
							<td>$17,970</td>
							<td>$14,970</td>
							<td>$3,000</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>28.</td>
							<td>Phone</td>
							<td>iPhone 13 mini - 128gb - Red</td>
							<td>Active</td>
							<td>2</td>
							<td>$499</td>
							<td>$399</td>
							<td>1 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>2 sold</td>
							<td>$1,497</td>
							<td>$1,197</td>
							<td>$300</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>29.</td>
							<td>Phone</td>
							<td>iPhone SE - 64gb - Red</td>
							<td>Active</td>
							<td>5</td>
							<td>$429</td>
							<td>$329</td>
							<td>0 sold</td>
							<td>1 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>$429</td>
							<td>$329</td>
							<td>$100</td>
						</tr>
						<tr>
							<td>
								<div className="form-check d-flex justify-content-center my-0 mx-n1">
									<input type="checkbox" className="form-check-input" />
								</div>
							</td>
							<td>30.</td>
							<td>Phone</td>
							<td>iPhone 12 - 128gb - Purple</td>
							<td>Active</td>
							<td>3</td>
							<td>$649</td>
							<td>$329</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>0 sold</td>
							<td>1 sold</td>
							<td>0 sold</td>
							<td>$649</td>
							<td>$329</td>
							<td>$320</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
							<th>309 sold</th>
							<th>241 sold</th>
							<th>271 sold</th>
							<th>304 sold</th>
							<th>241 sold</th>
							<th>457 sold</th>
							<th>$923,462</th>
							<th>$751,792</th>
							<th>$171,670</th>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
  );
}

export default ExtraDataManagement;