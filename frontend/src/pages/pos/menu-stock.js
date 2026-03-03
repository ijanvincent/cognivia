import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';

function PosMenuStock() {
	const context = useContext(AppSettings);
	const [time] = useState(getTime());
	const [stockData, setStockData] = useState();
	
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
  
	useEffect(() => {
		context.handleSetAppHeaderNone(true);
		context.handleSetAppSidebarNone(true);
		context.handleSetAppContentFullHeight(true);
		context.handleSetAppContentClass('p-0');
		
		fetch('/assets/data/pos/menu-stock.json').then(res => res.json()).then((result) => { setStockData(result); });
		
		return () => {
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
				<div className="pos-content-container">
					<div className="row gx-0">
						{stockData && stockData.length > 0 ? (stockData.map((stock, index) => (
						<div className="col-xl-2 col-lg-3 col-md-4 col-sm-6" key={stock.id}>
							<div className="pos-stock-product">
								<div className="pos-stock-product-container"><div className="product">
										<div className="product-img">
											<div className="img" style={{backgroundImage: 'url('+ stock.image +')'}}></div>
										</div>
										<div className="product-info">
											<div className="title">{stock.title}</div>
											<div className="desc">{stock.description}</div>
											
											<div className="product-option">
												<div className="option">
													<div className="option-label">Stock:</div>
													<div className="option-input">
														<input type="text" className="form-control" defaultValue={stock.stock} />
													</div>
												</div>
												<div className="option">
													<div className="option-label">Stock:</div>
													<div className="option-input">
														<div className="form-check form-switch">
															<input className="form-check-input" type="checkbox" name="qty" id="product1" defaultChecked={stock.available} defaultValue="1" />
															<label className="form-check-label" htmlFor="product1"></label>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="product-action">
											<a href="#/" className="btn btn-success"><i className="fa fa-check fa-fw"></i> Update</a>
											<a href="#/" className="btn btn-default"><i className="fa fa-times fa-fw"></i> Cancel</a>
										</div>
									</div>
								</div>
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
		</div>
	)
}

export default PosMenuStock;