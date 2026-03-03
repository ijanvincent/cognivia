import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';

function PosKitchenOrder() {
	const context = useContext(AppSettings);
	const [time] = useState(getTime());
	const [orderData, setOrderData] = useState();
	
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
	
	function getTotalCompletedItems(items) {
		var count = 0;
		for (var i = 0; i < items.length; i++) {
			if (items[i].status === 'Completed') {
				count++;
			}
		}
		return count;
	}
  
	useEffect(() => {
		context.handleSetAppHeaderNone(true);
		context.handleSetAppSidebarNone(true);
		context.handleSetAppContentFullHeight(true);
		context.handleSetAppContentClass('p-0');
		
		fetch('/assets/data/pos/kitchen-order.json').then(res => res.json()).then((result) => { setOrderData(result); });
		
		return function cleanUp() {
			context.handleSetAppHeaderNone(false);
			context.handleSetAppSidebarNone(false);
			context.handleSetAppContentFullHeight(false);
			context.handleSetAppContentClass('');
		};
		
		// eslint-disable-next-line
	}, []);

	return (
		<div className="pos pos-with-header" id="pos">
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
				<div className="pos-task-row">
					{orderData && orderData.length > 0 ? (orderData.map((order, index) => (
						<div className="pos-task" key={index}>
							<div className="pos-task-info">
								<div className="table-no">Table <b>{order.tableNo}</b></div>
								<div className="order-no">Order No: #{order.orderNo}</div>
								<div className="order-type">
									<span className={'badge' +
										((order.orderStatus !== 'Completed') ? ' bg-theme text-theme-color' : '') + 
										((order.orderStatus === 'Completed') ? ' bg-gray-500' : '')
									}>{order.orderType}</span>
								</div>
								<div className="time-pass">
									{order.orderTime && (<div className={((order.urgent) ? 'text-danger fw-bold' : '')}>{order.orderTime} time</div>)}
									{order.totalOrderTime && (<div>All dish served<br />{ order.totalOrderTime } total time</div>)}
								</div>
							</div>
							<div className="pos-task-body">
								<div className="pos-task-completed">
									Completed: ({getTotalCompletedItems(order.items)}/{order.items.length})
								</div>
								<div className="pos-task-product-row">
									{order.items && order.items.length > 0 ? (order.items.map((item, index) => (
										<div className={'pos-task-product' + ((item.status === 'Completed' || item.status === 'Cancelled') ? ' completed' : '')} key={index}>
											<div className="pos-task-product-img">
												<div className="cover" style={{backgroundImage: 'url('+ item.image +')'}}></div>
												{item.status === 'Completed' && (<div className="caption"><div>Completed</div></div>)}
												{item.status === 'Cancelled' && (<div className="caption"><div>Cancelled</div></div>)}
											</div>
											<div className="pos-task-product-info">
												<div className="info">
													<div className="title">{item.title}</div>
													<div className="desc">
														{item.note.length > 0 && (item.note.map((note, index) => (
															<div key={index}> - {note}</div>
														)))}
													</div>
												</div>
												<div className="qty">
													x{item.quantity}
												</div>
											</div>
											<div className="pos-task-product-action">
												<a href="#/" className={'btn btn-success' + ((item.status === 'Completed' || item.status === 'Cancelled') ? ' disabled' : '')}>Complete</a>
												<a href="#/" className={'btn btn-outline-inverse' + ((item.status === 'Completed' || item.status === 'Cancelled') ? ' disabled' : '')}>Cancel</a>
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
					))) : (
						<div>
							No records found
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default PosKitchenOrder;