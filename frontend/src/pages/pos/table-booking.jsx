import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
import { Icon } from '@iconify/react';

function PosTableBooking() {
	const context = useContext(AppSettings);
	const [time] = useState(getTime());
	const [tableData, setTableData] = useState();
	
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
	
	function getStatus(time, text) {
		var timeSplit = time.split(':');
		var clock = timeSplit[1].split('00');
		var ampm = clock[1];
		var hour = parseInt(timeSplit[0]);
		var fullHour = (ampm === 'pm' && hour < 12) ? hour + 12 : hour;
		var today = new Date();
		var currentFullHour = today.getHours();
		
		if (fullHour === currentFullHour && text) {
			return 'in-progress';
		} else if (currentFullHour > fullHour && text) {
			return 'completed';
		} else if (currentFullHour < fullHour && text) {
			return 'upcoming';
		}
		return '';
	}
	
	function checkSameHour(time) {
		var today = new Date();
		var currentFullHour = today.getHours();
		var currentAmPm = (currentFullHour > 12) ? 'pm' : 'am';
		var currentHour = (currentFullHour > 12) ? currentFullHour - 12 : currentFullHour;
		var currentHourFinal = (currentHour < 10) ? '0' + currentHour : currentHour;
		var currentTime = currentHourFinal + ':00' + currentAmPm;
		
		if (currentTime === time) {
			return true;
		}
		return false;
	}
	
	function getAvailableTable() {
		var count = 0;
		var today = new Date();
		var h = today.getHours();
		var a;
		a = (h > 11) ? 'pm' : 'am';
		h = (h > 12) ? h - 12 : h;
		
		var currentHour = checkTime(h) + ":00" + a;
		
		if (tableData) {
			for (var i = 0; i < tableData.length; i++) {
				for (var x = 0; x < tableData[i].reservation.length; x++) {
					if (tableData[i].reservation[x].time === currentHour && !tableData[i].reservation[x].text) {
						count++;
					}
				}
			}
		}
		return count;
	}
	
	function checkAvailable(reservation) {
		for (var x = 0; x < reservation.length; x++) {
			var time = reservation[x].time.split(':');
			var hour = parseInt(time[0]);
			var today = new Date();
			var currentHour = today.getHours();
					currentHour = (currentHour > 12) ? currentHour - 12 : currentHour;
					
			if (currentHour === hour && reservation[x].text) {
				return true;
			}
		}
		return false;
	}
	
	useEffect(() => {
		context.handleSetAppHeaderNone(true);
		context.handleSetAppSidebarNone(true);
		context.handleSetAppContentFullHeight(true);
		context.handleSetAppContentClass('p-0');
		
		fetch('/assets/data/pos/table-booking.json').then(res => res.json()).then((result) => { setTableData(result); });
		
		return function cleanUp() {
			context.handleSetAppHeaderNone(false);
			context.handleSetAppSidebarNone(false);
			context.handleSetAppContentFullHeight(false);
			context.handleSetAppContentClass('');
		};
		
		// eslint-disable-next-line
	}, []);
	
	return (
		<div>
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
					<div className="pos-content-container p-4">
						<div className="d-md-flex align-items-center mb-4">
							<div className="flex-1">
								<div className="fs-24px mb-1">Available Table ({getAvailableTable()}/20)</div>
								<div className="mb-2 mb-md-0 d-flex">
									<div className="d-flex align-items-center me-3">
										<i className="fa fa-circle fa-fw text-body text-opacity-25 fs-9px me-1"></i> Completed
									</div>
									<div className="d-flex align-items-center me-3">
										<i className="fa fa-circle fa-fw text-warning fs-9px me-1"></i> Upcoming
									</div>
									<div className="d-flex align-items-center me-3">
										<i className="fa fa-circle fa-fw text-success fs-9px me-1"></i> In-progress
									</div>
								</div>
							</div>
							<div className="w-200px">
								<input type="date" className="form-control form-control-lg fs-13px" placeholder="Today's" />
							</div>
						</div>
						<div className="row gx-4">
							{tableData && tableData.length > 0 ? (tableData.map((table, index) => (
								<div className="col-xl-2 col-lg-3 col-md-4 col-sm-6" key={index}>
									<div className="pos-table-booking">
										<div className="pos-table-booking-container position-relative">
											<div className="pos-table-booking-header">
												<div className="d-flex align-items-center">
													<div className="flex-1">
														<div className="title">TABLE</div>
														<div className="no">{table.name}</div>
														<div className="desc">max {table.pax} pax</div>
													</div>
													<div className={'display-5 ' + (!checkAvailable(table.reservation) ? 'text-success' : 'text-gray-600')}>
														<Icon icon="solar:check-circle-line-duotone" />
													</div>
												</div>
											</div>
											<div className="pos-table-booking-body">
												{table.reservation.length > 0 ? (table.reservation.map((reservation, index) => (
													<div className={'booking' + ((checkSameHour(reservation.time)) ? ' highlight' : '')} key={index}>
														<div className="time">{reservation.time}</div>
														<div className="info">{(reservation.text) ? reservation.text : '-'}</div>
														<div className={'status '+ getStatus(reservation.time, reservation.text)}>{reservation.text && (<i className="fa fa-circle"></i>)}</div>
													</div>
												))) : (
													<div>
														No records found
													</div>
												)}
											</div>
											<a href="#/" className="stretched-link" data-bs-toggle="modal" data-bs-target="#modalPosBooking"><span className="d-none">&nbsp;</span></a>
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
	
			<div className="modal modal-pos fade" id="modalPosBooking">
				<div className="modal-dialog modal-lg">
					<div className="modal-content border-0">
						<div>
							<div className="p-0">
								<div className="modal-body">
									<div className="d-flex align-items-center mb-3">
										<h4 className="modal-title d-flex align-items-center"><i className="fa fa-bowl-rice fs-2 me-2 my-n1"></i> Table 01 <small className="fs-13px fw-bold ms-2">max 4 pax</small></h4>
										<a href="/#" data-bs-dismiss="modal" className="ms-auto btn-close">&nbsp;</a>
									</div>
									<div className="row">
										<div className="col-lg-6">
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">08:00am</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">09:00am</div>
													<input type="text" className="form-control" placeholder="" defaultValue="Reserved by Sean" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">10:00am</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">11:00am</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">12:00pm</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">01:00pm</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">02:00pm</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">03:00pm</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
										</div>
										<div className="col-lg-6">
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">04:00pm</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">05:00pm</div>
													<input type="text" className="form-control" placeholder="" defaultValue="Reserved by Irene Wong (4pax)" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">06:00pm</div>
													<input type="text" className="form-control" placeholder="" defaultValue="Reserved by Irene Wong (4pax)" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">07:00pm</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">08:00pm</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">09:00pm</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">10:00pm</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="modal-footer">
									<button className="btn btn-default w-100px" data-bs-dismiss="modal">Cancel</button>
									<button type="submit" className="btn btn-success w-100px">Book</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PosTableBooking;