import React, { useEffect, useContext, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';

function PosCounterCheckout() {
	const context = useContext(AppSettings);
	const [time] = useState(getTime());
	const [tableData, setTableData] = useState();
	const [posMobileSidebarToggled, setPosMobileSidebarToggled] = useState(false);
	const [selectedTable, setSelectedTable] = useState();
	
	function checkTime(i) {
		if (i < 10) {i = "0" + i};
		return i;
	}
	
	function getTime() {
		var today = new Date();
		var h = today.getHours();
		var m = today.getMinutes();
		var a;
		m = checkTime(m);
		a = (h > 11) ? 'pm' : 'am';
		h = (h > 12) ? h - 12 : h;
	
		setTimeout(() => {
			getTime();
		}, 500);
		return h + ":" + m + a;
	}
	
	
	function toggleMobileSidebar(event, table) {
		event.preventDefault();
		
		setPosMobileSidebarToggled(true);
		setSelectedTable(table);
	}
	
	function dismissMobileSidebar(event) {
		event.preventDefault();
		
		setPosMobileSidebarToggled(false);
		setSelectedTable([]);
	}
	
	function getPrice(type) {
		var price = 0;
		
		if (selectedTable && selectedTable.orders) {
			var orders = selectedTable.orders;
			for (var i = 0; i < orders.length; i++) {
				if (type === 'subtotal') {
					price += parseFloat(orders[i].price);
				} else if (type === 'taxes') {
					price += parseFloat(orders[i].price) * 0.06;
				} else if (type === 'total') {
					price += parseFloat(orders[i].price);
					price += parseFloat(orders[i].price) * 0.06
				}
			}
		}
		
		return price.toFixed(2);
	}
	
	function getTotalPrice(orders) {
		var total = 0;
		if (orders) {
			for (var i = 0; i < orders.length; i++) {
				total += parseFloat(orders[i].price);
			}
		}
		return total.toFixed(2);
	}
	
	useEffect(() => {
		context.handleSetAppHeaderNone(true);
		context.handleSetAppSidebarNone(true);
		context.handleSetAppContentFullHeight(true);
		context.handleSetAppContentClass('p-0');
		
		fetch('/assets/data/pos/counter-checkout.json').then(res => res.json()).then((result) => { setTableData(result); });
		
		return function cleanUp() {
			context.handleSetAppHeaderNone(false);
			context.handleSetAppSidebarNone(false);
			context.handleSetAppContentFullHeight(false);
			context.handleSetAppContentClass('');
		};
		
		// eslint-disable-next-line
	}, []);
	
	return (
		<div className={'pos pos-with-header pos-with-sidebar ' + ((posMobileSidebarToggled) ? 'pos-sidebar-mobile-toggled' : '')} id="pos">
			<div className="pos-header">
				<div className="logo">
					<Link to="/" href="pos_counter_checkout.html">
						<div className="logo-img"><i className="fa fa-bowl-rice fs-2"></i></div>
						<div className="logo-text">Pine & Dine</div>
					</Link>
				</div>
				<div className="time" id="time">{time}</div>
				<div className="nav">
					<div className="nav-item">
						<Link to="/pos/counter-checkout" className="nav-link">
							<i className="far fa-credit-card nav-icon"></i>
						</Link>
					</div>
					<div className="nav-item">
						<Link to="/pos/kitchen-order" className="nav-link">
							<i className="far fa-clock nav-icon"></i>
						</Link>
					</div>
					<div className="nav-item">
						<Link to="/pos/table-booking" className="nav-link">
							<i className="far fa-calendar-check nav-icon"></i>
						</Link>
					</div>
					<div className="nav-item">
						<Link to="/pos/menu-stock" className="nav-link">
							<i className="fa fa-chart-pie nav-icon"></i>
						</Link>
					</div>
				</div>
			</div>
			<div className="pos-content">
				<div className="pos-content-container">
					<div className="d-md-flex align-items-center mb-4">
						<div className="pos-booking-title flex-1">
							<div className="fs-24px mb-1">Available Table (13/20)</div>
							<div className="mb-2 mb-md-0 d-flex">
								<div className="d-flex align-items-center me-3">
									<i className="fa fa-circle fa-fw text-gray-500 fs-9px me-1"></i> Reserved
								</div>
								<div className="d-flex align-items-center me-3">
									<i className="fa fa-circle fa-fw text-warning fs-9px me-1"></i> Table In-use
								</div>
								<div className="d-flex align-items-center me-3">
									<i className="fa fa-circle fa-fw text-theme fs-9px me-1"></i> Table Available
								</div>
							</div>
						</div>
					</div>
					
					<div className="pos-table-row">
						{tableData && tableData.length > 0 ? (tableData.map((table, index) => (
							
							<div key={index} className={'pos-table' + 
								((selectedTable && table.tableNo === selectedTable.tableNo) ? ' selected' : '') + 
								((!table.orders && table.status !== 'Reserved') ? ' available' : '') + 
								((table.orders) ? ' in-use' : '') +
								((table.status === 'Reserved') ? ' disabled' : '')
							}>
								<div className="pos-table-container position-relative">
									<div className="pos-table-status"></div>
									<div className="pos-table-name">
										<div className="name">Table</div>
										<div className="no">{table.tableNo}</div>
										<div className="order">
											{table.orders && (<span>{table.orders.length} orders</span>)}
											{table.status === 'Reserved' && (<span>Reserved for {table.reserveName}</span>)}
											{!table.orders && table.status !== 'Reserved' && (<span>max { table.totalPax } pax</span>)}
										</div>
									</div>
									<div className="pos-table-info-row">
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="far fa-user"></i></span>
												<span className="text">{table.pax} / {table.totalPax}</span>
											</div>
										</div>
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="far fa-clock"></i></span>
												<span className="text">{(table.totalTime) ? table.totalTime : '-'}</span>
											</div>
										</div>
									</div>
									<div className="pos-table-info-row">
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="fa fa-receipt"></i></span>
												<span className="text">${getTotalPrice(table.orders)}</span>
											</div>
										</div>
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="far fa-dollar-sign"></i></span>
												<span className={'text'+ ((table.status === 'Paid') ? ' text-success' : '')}>{(table.status !== 'Reserved') ? table.status : '-'}</span>
											</div>
										</div>
									</div>
									<a href="#/" className="stretched-link" onClick={(event) => toggleMobileSidebar(event, table)}><span className="d-none">&nbsp;</span></a>
								</div>
							</div>
						))) : (
							<div className="col-12">
								No records found
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="pos-sidebar" id="pos-sidebar">
				<div className="pos-sidebar-header">
					<div className="back-btn">
						<button type="button" onClick={dismissMobileSidebar} className="btn">
							<i className="fa fa-chevron-left"></i>
						</button>
					</div>
					<div className="icon"><i className="fa fa-plate-wheat"></i></div>
					<div className="title">Table {(selectedTable && selectedTable.tableNo) ? selectedTable.tableNo : '-'}</div>
					<div className="order">Order: <b>#{ (selectedTable && selectedTable.orderNo) ? selectedTable.orderNo : '-' }</b></div>
				</div>
				<PerfectScrollbar className="pos-sidebar-body">
					<div className="pos-table">
						{selectedTable && selectedTable.orders ? (selectedTable.orders.map((order, index) => (
							<div className="row pos-table-row" key={index}>
								<div className="col-8">
									<div className="pos-product-thumb">
										<div className="img" style={{backgroundImage: 'url('+ order.image +')'}}></div>
										<div className="info">
											<div className="title">{ order.title }</div>
											<div className="desc">
												{order.options && order.options.map((option, index) => (
													<div key={index}>- size: {option}</div>
												))}
											</div>
										</div>
									</div>
								</div>
								<div className="col-1 total-qty">x{ order.quantity }</div>
								<div className="col-3 total-price">${ (parseFloat(order.price) * order.quantity).toFixed(2) }</div>
							</div>
						))) : (
							<div className="pos-order py-3">
								No records found
							</div>
						)}
					</div>
				</PerfectScrollbar>
				
				<div className="pos-sidebar-footer">
					<div className="d-flex align-items-center mb-2">
						<div>Subtotal</div>
						<div className="flex-1 text-end h6 mb-0">${getPrice('subtotal')}</div>
					</div>
					<div className="d-flex align-items-center">
						<div>Taxes (6%)</div>
						<div className="flex-1 text-end h6 mb-0">${getPrice('taxes')}</div>
					</div>
					<hr className="opacity-1 my-10px" />
					<div className="d-flex align-items-center mb-2">
						<div>Total</div>
						<div className="flex-1 text-end h4 mb-0">${getPrice('total')}</div>
					</div>
					<div className="d-flex align-items-center mt-3">
						<a href="#/" className="btn btn-default w-80px rounded-3 text-center me-10px">
							<i className="fab fa-paypal d-block fs-18px my-1"></i>
							E-Wallet
						</a>
						<a href="#/" className="btn btn-default w-80px rounded-3 text-center me-10px">
							<i className="fab fa-cc-visa d-block fs-18px my-1"></i>
							CC
						</a>
						<a href="#/" className="btn btn-theme rounded-3 text-center flex-1">
							<i className="fa fa-wallet d-block fs-18px my-1"></i>
							Pay by Cash
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PosCounterCheckout;