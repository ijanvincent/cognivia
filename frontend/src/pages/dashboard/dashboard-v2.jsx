import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import jsVectorMap from 'jsvectormap';
import 'jsvectormap/dist/maps/world.js';
import 'jsvectormap/dist/jsvectormap.min.css';
import Calendar from 'react-calendar';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Chart from 'react-apexcharts';
import { Panel, PanelHeader, PanelFooter } from './../../components/panel/panel.jsx';

function DashboardV2() {
	var chartSeries = [{ 
		name: 'Unique Visitors', 
		data: [
			[handleGetDate(77), 13], [handleGetDate(76), 13], [handleGetDate(75), 6 ], 
			[handleGetDate(73), 6 ], [handleGetDate(72), 6 ], [handleGetDate(71), 5 ], [handleGetDate(70), 5 ], 
			[handleGetDate(69), 5 ], [handleGetDate(68), 6 ], [handleGetDate(67), 7 ], [handleGetDate(66), 6 ], 
			[handleGetDate(65), 9 ], [handleGetDate(64), 9 ], [handleGetDate(63), 8 ], [handleGetDate(62), 10], 
			[handleGetDate(61), 10], [handleGetDate(60), 10], [handleGetDate(59), 10], [handleGetDate(58), 9 ], 
			[handleGetDate(57), 9 ], [handleGetDate(56), 10], [handleGetDate(55), 9 ], [handleGetDate(54), 9 ], 
			[handleGetDate(53), 8 ], [handleGetDate(52), 8 ], [handleGetDate(51), 8 ], [handleGetDate(50), 8 ], 
			[handleGetDate(49), 8 ], [handleGetDate(48), 7 ], [handleGetDate(47), 7 ], [handleGetDate(46), 6 ], 
			[handleGetDate(45), 6 ], [handleGetDate(44), 6 ], [handleGetDate(43), 6 ], [handleGetDate(42), 5 ], 
			[handleGetDate(41), 5 ], [handleGetDate(40), 4 ], [handleGetDate(39), 4 ], [handleGetDate(38), 5 ], 
			[handleGetDate(37), 5 ], [handleGetDate(36), 5 ], [handleGetDate(35), 7 ], [handleGetDate(34), 7 ], 
			[handleGetDate(33), 7 ], [handleGetDate(32), 10], [handleGetDate(31), 9 ], [handleGetDate(30), 9 ], 
			[handleGetDate(29), 10], [handleGetDate(28), 11], [handleGetDate(27), 11], [handleGetDate(26), 8 ], 
			[handleGetDate(25), 8 ], [handleGetDate(24), 7 ], [handleGetDate(23), 8 ], [handleGetDate(22), 9 ], 
			[handleGetDate(21), 8 ], [handleGetDate(20), 9 ], [handleGetDate(19), 10], [handleGetDate(18), 9 ], 
			[handleGetDate(17), 10], [handleGetDate(16), 16], [handleGetDate(15), 17], [handleGetDate(14), 16], 
			[handleGetDate(13), 17], [handleGetDate(12), 16], [handleGetDate(11), 15], [handleGetDate(10), 14], 
			[handleGetDate(9) , 24], [handleGetDate(8) , 18], [handleGetDate(7) , 15], [handleGetDate(6) , 14], 
			[handleGetDate(5) , 16], [handleGetDate(4) , 16], [handleGetDate(3) , 17], [handleGetDate(2) , 7 ], 
			[handleGetDate(1) , 7 ], [handleGetDate(0) , 7 ]
		]
	}, { 
		name: 'Page Views', 
		data: [
			[handleGetDate(77), 14], [handleGetDate(76), 13], [handleGetDate(75), 15], 
			[handleGetDate(73), 14], [handleGetDate(72), 13], [handleGetDate(71), 15], [handleGetDate(70), 16], 
			[handleGetDate(69), 16], [handleGetDate(68), 14], [handleGetDate(67), 14], [handleGetDate(66), 13], 
			[handleGetDate(65), 12], [handleGetDate(64), 13], [handleGetDate(63), 13], [handleGetDate(62), 15], 
			[handleGetDate(61), 16], [handleGetDate(60), 16], [handleGetDate(59), 17], [handleGetDate(58), 17], 
			[handleGetDate(57), 18], [handleGetDate(56), 15], [handleGetDate(55), 15], [handleGetDate(54), 15], 
			[handleGetDate(53), 19], [handleGetDate(52), 19], [handleGetDate(51), 18], [handleGetDate(50), 18], 
			[handleGetDate(49), 17], [handleGetDate(48), 16], [handleGetDate(47), 18], [handleGetDate(46), 18], 
			[handleGetDate(45), 18], [handleGetDate(44), 16], [handleGetDate(43), 14], [handleGetDate(42), 14], 
			[handleGetDate(41), 13], [handleGetDate(40), 14], [handleGetDate(39), 13], [handleGetDate(38), 10], 
			[handleGetDate(37), 9 ], [handleGetDate(36), 10], [handleGetDate(35), 11], [handleGetDate(34), 11], 
			[handleGetDate(33), 11], [handleGetDate(32), 10], [handleGetDate(31), 9 ], [handleGetDate(30), 10], 
			[handleGetDate(29), 13], [handleGetDate(28), 14], [handleGetDate(27), 14], [handleGetDate(26), 13], 
			[handleGetDate(25), 12], [handleGetDate(24), 11], [handleGetDate(23), 13], [handleGetDate(22), 13], 
			[handleGetDate(21), 13], [handleGetDate(20), 13], [handleGetDate(19), 14], [handleGetDate(18), 13], 
			[handleGetDate(17), 13], [handleGetDate(16), 19], [handleGetDate(15), 21], [handleGetDate(14), 22],
			[handleGetDate(13), 25], [handleGetDate(12), 24], [handleGetDate(11), 24], [handleGetDate(10), 22], 
			[handleGetDate(9) , 16], [handleGetDate(8) , 15], [handleGetDate(7) , 12], [handleGetDate(6) , 12], 
			[handleGetDate(5) , 15], [handleGetDate(4) , 15], [handleGetDate(3) , 15], [handleGetDate(2) , 18], 
			[handleGetDate(2) , 18], [handleGetDate(0) , 17]
		] 
	}];
	var chartOptions = {
		colors: ['#00acac', '#348fe2'],
		fill: {
			opacity: .75,
			type: 'solid'
		},
		legend: {
			position: 'top',
			horizontalAlign: 'right',
			offsetY: 15,
			offsetX: 500,
			labels: {
				colors: '#ffffff'
			}
		},
		xaxis: {
			type: 'datetime',
			tickAmount: 6,
			labels: {
				style: {
					colors: '#ffffff'
				}
			}
		},
		yaxis: {
			labels: {
				style: {
					colors: '#ffffff'
				}
			}
		},
		tooltip: { y: { formatter: function (val) { return "$ " + val + " thousands" } } },
		chart: { height: '100%', type: 'area', toolbar: { show: false }, stacked: true },
		plotOptions: { bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' } },
		dataLabels: { enabled: false },
		grid: { 
			show: true, borderColor: 'rgba(255,255,255, .15)',
			xaxis: {
				lines: {
					show: true
				}
			},   
			yaxis: {
				lines: {
					show: true
				}
			},
			padding: {
					top: -40,
					right: 3,
					bottom: 0,
					left: 10
			},
		},
		stroke: { 
			show: false,
			curve: 'straight'
		}
	};
	
	var pieChartSeries = [416747,784466];
	var pieChartOptions = {
		labels: ['New Visitors', 'Return Visitors'],
		chart: { type: 'donut' },
		dataLabels: { dropShadow: { enabled: false }, style: { colors: ['#fff'] } },
		stroke: { show: false },
		colors: [ '#348fe2', '#00acac' ],
		legend: { show: false }
	};
	
	var date = new Date();	
	
	function handleGetDate(minusDate) {
		var d = new Date();
				d = d.setDate(d.getDate() - minusDate);
		return d;
	};
	
	function renderMap() {
		var theme = (getComputedStyle(document.body).getPropertyValue('--bs-app-theme')).trim();
		var gray900 = (getComputedStyle(document.body).getPropertyValue('--bs-gray-900')).trim();
		var gray700 = (getComputedStyle(document.body).getPropertyValue('--bs-gray-700')).trim();
		var white = (getComputedStyle(document.body).getPropertyValue('--bs-white')).trim();
		var bodyFontFamily = (getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
		const map = document.getElementById('jvectorMap');
		const mapElm = document.querySelectorAll('.jvm-tooltip');
		
		if (map) {
			for (let i = 0; i < mapElm.length; i++) {
				mapElm[i].remove();
			}
			map.innerHTML = '';
		
			var markers = [
				{ name: "Egypt", coords: [26.8206, 30.8025] },
				{ name: "Russia", coords: [61.524, 105.3188] },
				{ name: "Canada", coords: [56.1304, -106.3468] },
				{ name: "Greenland", coords: [71.7069, -42.6043] },
				{ name: "Brazil", coords: [-14.235, -51.9253] }
			];
			new jsVectorMap({
				selector: '#jvectorMap',
				map: 'world',
				zoomButtons: true,
				normalizeFunction: 'polynomial',
				hoverOpacity: 0.5,
				hoverColor: false,
				zoomOnScroll: false,
				series: {
					regions: [{
						normalizeFunction: 'polynomial'
					}]
				},
				labels: {
					markers: {
						render: (marker) => marker.name
					}
				},
				focusOn: {
					x: 0.5,
					y: 0.5,
					scale: 1
				},
				markers: markers,
				markerStyle: {
					initial: {
						fill: theme,
						stroke: 'none',
						r: 5,
					},
					hover: {
						fill: theme
					}
				},
				markerLabelStyle: {
					initial: {
						fontFamily: bodyFontFamily,
						fontSize: '12px',
						fill: white
					},
				},
				regionStyle: {
					initial: {
						fill: gray700,
						fillOpacity: 0.5,
						stroke: 'none',
						strokeWidth: 0.4,
						strokeOpacity: 1
					},
					hover: {
						fillOpacity: 0.5
					}
				},
				backgroundColor: gray900,
			});
		}
	}
	
	useEffect(() => {
    // eslint-diable-next-line
    renderMap();
	}, []);
	
	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link to="/dashboard/v2">Home</Link></li>
				<li className="breadcrumb-item"><Link to="/dashboard/v2">Dashboard</Link></li>
				<li className="breadcrumb-item active">Dashboard v2</li>
			</ol>
			<h1 className="page-header">Dashboard v2 <small>header small text goes here...</small></h1>
			<div className="row">
				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-teal">
						<div className="stats-icon stats-icon-lg"><i className="fa fa-globe fa-fw"></i></div>
						<div className="stats-content">
							<div className="stats-title">TODAY'S VISITS</div>
							<div className="stats-number">7,842,900</div>
							<div className="stats-progress progress">
								<div className="progress-bar" style={{width: '70.1%'}}></div>
							</div>
							<div className="stats-desc">Better than last week (70.1%)</div>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-blue">
						<div className="stats-icon stats-icon-lg"><i className="fa fa-dollar-sign fa-fw"></i></div>
						<div className="stats-content">
							<div className="stats-title">TODAY'S PROFIT</div>
							<div className="stats-number">180,200</div>
							<div className="stats-progress progress">
								<div className="progress-bar" style={{width: '40.5%'}}></div>
							</div>
							<div className="stats-desc">Better than last week (40.5%)</div>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-indigo">
						<div className="stats-icon stats-icon-lg"><i className="fa fa-archive fa-fw"></i></div>
						<div className="stats-content">
							<div className="stats-title">NEW ORDERS</div>
							<div className="stats-number">38,900</div>
							<div className="stats-progress progress">
								<div className="progress-bar" style={{width: '76.3%'}}></div>
							</div>
							<div className="stats-desc">Better than last week (76.3%)</div>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-dark">
						<div className="stats-icon stats-icon-lg"><i className="fa fa-comment-alt fa-fw"></i></div>
						<div className="stats-content">
							<div className="stats-title">NEW COMMENTS</div>
							<div className="stats-number">3,988</div>
							<div className="stats-progress progress">
								<div className="progress-bar" style={{width: '54.9%'}}></div>
							</div>
							<div className="stats-desc">Better than last week (54.9%)</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-xl-8">
					<div className="widget-chart with-sidebar inverse-mode">
						<div className="widget-chart-content bg-gray-800">
							<h4 className="chart-title">
								Visitors Analytics
								<small>Where do our visitors come from</small>
							</h4>
							<div className="widget-chart-full-width dark-mode overflow-hidden pe-3 mb-n3 pt-3">
								<Chart type="area" height="244" width="100%" options={chartOptions} series={chartSeries} />
							</div>
						</div>
						<div className="widget-chart-sidebar bg-gray-900">
							<div className="chart-number">
								1,225,729
								<small>Total visitors</small>
							</div>
							<div className="flex-grow-1 d-flex align-items-center dark-mode">
								<Chart type="donut" height={'180'} options={pieChartOptions} series={pieChartSeries} />
							</div>
							<ul className="chart-legend fs-11px">
								<li><i className="fa fa-circle fa-fw text-blue fs-9px me-5px t-minus-1"></i> 34.0% <span>New Visitors</span></li>
								<li><i className="fa fa-circle fa-fw text-teal fs-9px me-5px t-minus-1"></i> 56.0% <span>Return Visitors</span></li>
							</ul>
						</div>
					</div>
				</div>
				<div className="col-xl-4">
					<Panel>
						<PanelHeader noButton={true}>
							Visitors Origin
						</PanelHeader>
						<div style={{height: '170px'}}>
							<div id="jvectorMap" style={{height: '170px'}}></div>
						</div>
						<div className="list-group" data-bs-theme="dark">
							<div className="list-group list-group-flush "  data-bs-theme="dark">
								<a href="#/" className="list-group-item list-group-item-action d-flex">
									<span className="flex-1">1. United State</span>
									<span className="badge bg-teal fs-10px">20.95%</span>
								</a>
								<a href="#/" className="list-group-item list-group-item-action d-flex">
									<span className="flex-1">2. India</span>
									<span className="badge bg-blue fs-10px">16.12%</span>
								</a>
								<a href="#/" className="list-group-item list-group-item-action d-flex rounded-bottom">
									<span className="flex-1">3. Mongolia</span>
									<span className="badge bg-gray-600 fs-10px">14.99%</span>
								</a>
							</div>
						</div>
					</Panel>
				</div>
			</div>
			<div className="row">
				<div className="col-xl-4 col-lg-6">
					<Panel className="bg-light">
						<PanelHeader noButton={true}>
							<div className="d-flex">
								Chat History <span className="badge bg-teal ms-auto">4 message</span>
							</div>
						</PanelHeader>
						<PerfectScrollbar className="chats" style={{height: '260px'}} options={{suppressScrollX: true}}>
							<div className="chats-item start">
								<span className="date-time">yesterday 11:23pm</span>
								<Link to="/dashboard/v2" className="name">Sowse Bawdy</Link>
								<Link to="/dashboard/v2" className="image"><img alt="" src="../assets/img/user/user-12.jpg" /></Link>
								<div className="message">
									Lorem ipsum dolor sit amet, consectetuer adipiscing elit volutpat. Praesent mattis interdum arcu eu feugiat.
								</div>
							</div>
							<div className="chats-item end">
								<span className="date-time">08:12am</span>
								<Link to="/dashboard/v2" className="name"><span className="badge bg-blue">ADMIN</span> Me</Link>
								<Link to="/dashboard/v2" className="image"><img alt="" src="../assets/img/user/user-13.jpg" /></Link>
								<div className="message">
									Nullam posuere, nisl a varius rhoncus, risus tellus hendrerit neque.
								</div>
							</div>
							<div className="chats-item start">
								<span className="date-time">09:20am</span>
								<Link to="/dashboard/v2" className="name">Neck Jolly</Link>
								<Link to="/dashboard/v2" className="image"><img alt="" src="../assets/img/user/user-10.jpg" /></Link>
								<div className="message">
									Euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
								</div>
							</div>
							<div className="chats-item start">
								<span className="date-time">11:15am</span>
								<Link to="/dashboard/v2" className="name">Shag Strap</Link>
								<Link to="/dashboard/v2" className="image"><img alt="" src="../assets/img/user/user-14.jpg" /></Link>
								<div className="message">
									Nullam iaculis pharetra pharetra. Proin sodales tristique sapien mattis placerat.
								</div>
							</div>
						</PerfectScrollbar>
						<PanelFooter>
							<form name="send_message_form" data-id="message-form">
								<div className="input-group">
									<input type="text" className="form-control" name="message" placeholder="Enter your message here." />
									<button className="btn btn-primary" type="button"><i className="fa fa-camera"></i></button>
									<button className="btn btn-primary" type="button"><i className="fa fa-link"></i></button>
								</div>
							</form>
						</PanelFooter>
					</Panel>
				</div>
				<div className="col-xl-4 col-lg-6">
					<Panel>
						<PanelHeader noButton={true}>
							Today's Schedule
						</PanelHeader>
						<div>
							<Calendar value={date} />
						</div>
						<hr className="m-0 bg-gray-500" />
						<div className="list-group list-group-flush">
							<Link to="/dashboard/v2" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center text-ellipsis">
								Sales Reporting
								<span className="badge bg-teal fs-10px">9:00 am</span>
							</Link> 
							<Link to="/dashboard/v2" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center text-ellipsis rounded-bottom">
								Have a meeting with sales team
								<span className="badge bg-blue fs-10px">2:45 pm</span>
							</Link>
						</div>
					</Panel>
				</div>
				<div className="col-xl-4 col-lg-6">
					<Panel>
						<PanelHeader noButton={true}>
							<div className="d-flex">
								New Registered Users 
								<span className="badge bg-teal ms-auto">24 new users</span>
							</div>
						</PanelHeader>
						<ul className="registered-users-list clearfix">
							<li>
								<Link to="/dashboard/v2"><img src="/assets/img/user/user-5.jpg" alt="" /></Link>
								<h4 className="username text-ellipsis">
									Savory Posh
									<small>Algerian</small>
								</h4>
							</li>
							<li>
								<Link to="/dashboard/v2"><img src="/assets/img/user/user-3.jpg" alt="" /></Link>
								<h4 className="username text-ellipsis">
									Ancient Caviar
									<small>Korean</small>
								</h4>
							</li>
							<li>
								<Link to="/dashboard/v2"><img src="/assets/img/user/user-1.jpg" alt="" /></Link>
								<h4 className="username text-ellipsis">
									Marble Lungs
									<small>Indian</small>
								</h4>
							</li>
							<li>
								<Link to="/dashboard/v2"><img src="/assets/img/user/user-8.jpg" alt="" /></Link>
								<h4 className="username text-ellipsis">
									Blank Bloke
									<small>Japanese</small>
								</h4>
							</li>
							<li>
								<Link to="/dashboard/v2"><img src="/assets/img/user/user-2.jpg" alt="" /></Link>
								<h4 className="username text-ellipsis">
									Hip Sculling
									<small>Cuban</small>
								</h4>
							</li>
							<li>
								<Link to="/dashboard/v2"><img src="/assets/img/user/user-6.jpg" alt="" /></Link>
								<h4 className="username text-ellipsis">
									Flat Moon
									<small>Nepalese</small>
								</h4>
							</li>
							<li>
								<Link to="/dashboard/v2"><img src="/assets/img/user/user-4.jpg" alt="" /></Link>
								<h4 className="username text-ellipsis">
									Packed Puffs
									<small>Malaysian></small>
								</h4>
							</li>
							<li>
								<Link to="/dashboard/v2"><img src="/assets/img/user/user-9.jpg" alt="" /></Link>
								<h4 className="username text-ellipsis">
									Clay Hike
									<small>Swedish</small>
								</h4>
							</li>
						</ul>
						<PanelFooter className="text-center">
							<Link to="/dashboard/v2" className="text-decoration-none text-body">View All</Link>
						</PanelFooter>
					</Panel>
				</div>
			</div>
		</div>
	)
};

export default DashboardV2;