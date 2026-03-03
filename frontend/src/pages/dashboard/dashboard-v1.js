import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody, PanelFooter } from './../../components/panel/panel.jsx';
import Chart from 'chart.js/auto';
import jsVectorMap from 'jsvectormap';
import 'jsvectormap/dist/maps/world.js';
import 'jsvectormap/dist/jsvectormap.min.css';
import Calendar from 'react-calendar';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ApexChart from 'react-apexcharts';
import 'react-calendar/dist/Calendar.css';


function DashboardV1() {
	
	var redColor = (getComputedStyle(document.body).getPropertyValue('--bs-red')).trim();
	var orangeColor = (getComputedStyle(document.body).getPropertyValue('--bs-orange')).trim();
	var tealColor = (getComputedStyle(document.body).getPropertyValue('--bs-teal')).trim();
	var blueColor = (getComputedStyle(document.body).getPropertyValue('--bs-blue')).trim();
	var gray500Color = (getComputedStyle(document.body).getPropertyValue('--bs-gray-500')).trim();
	var componentColor = (getComputedStyle(document.body).getPropertyValue('--bs-component-color')).trim();
	
	var sparkLineOptions = {
		chart: { sparkline: { enabled: true } },
		stroke: { width: 2 },
		colors: [redColor]
	};
	var sparkLineOptions2 = {
		chart: { sparkline: { enabled: true } },
		stroke: { width: 2 },
		colors: [orangeColor]
	};
	var sparkLineOptions3 = {
		chart: { sparkline: { enabled: true } },
		stroke: { width: 2 },
		colors: [tealColor]
	};
	var sparkLineOptions4 = {
		chart: { sparkline: { enabled: true } },
		stroke: { width: 2 },
		colors: [blueColor]
	};
	var sparkLineOptions5 = {
		chart: { sparkline: { enabled: true } },
		stroke: { width: 2 },
		colors: [gray500Color]
	};
	var sparkLineOptions6 = {
		chart: { sparkline: { enabled: true } },
		stroke: { width: 2 },
		colors: [componentColor]
	};
	
	var sparklineData = [{ data: [789, 880, 676, 200, 890, 677, 900] }];
	var sparklineData2 = [{ data: [789, 880, 676, 200, 890, 677, 900] }];
	var sparklineData3 = [{ data: [789, 880, 676, 200, 890, 677, 900] }];
	var sparklineData4 = [{ data: [789, 880, 676, 200, 890, 677, 900] }];
	var sparklineData5 = [{ data: [789, 880, 676, 200, 890, 677, 900] }];
	var sparklineData6 = [{ data: [789, 880, 676, 200, 890, 677, 900] }];
	
	var date = new Date();
	
	var chart1;
	
	function renderChart() {
		var teal = (getComputedStyle(document.body).getPropertyValue('--bs-teal')).trim();
		var tealRgb = (getComputedStyle(document.body).getPropertyValue('--bs-teal-rgb')).trim();
		var blue = (getComputedStyle(document.body).getPropertyValue('--bs-blue')).trim();
		var blueRgb = (getComputedStyle(document.body).getPropertyValue('--bs-blue-rgb')).trim();
		var componentBg = (getComputedStyle(document.body).getPropertyValue('--bs-component-bg')).trim();
		
		var bodyFontFamily = (getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
		var bodyFontWeight = (getComputedStyle(document.body).getPropertyValue('--bs-body-font-weight')).trim();
		var bodyColor = (getComputedStyle(document.body).getPropertyValue('--bs-body-color')).trim();
		var borderColor = (getComputedStyle(document.body).getPropertyValue('--bs-border-color')).trim();
		
		Chart.defaults.font.family = bodyFontFamily;
		Chart.defaults.font.size = 12;
		Chart.defaults.color = bodyColor;
		Chart.defaults.borderColor = borderColor;
		Chart.defaults.plugins.legend.display = true;
		Chart.defaults.plugins.tooltip.padding = { left: 8, right: 12, top: 8, bottom: 8 };
		Chart.defaults.plugins.tooltip.cornerRadius = 8;
		Chart.defaults.plugins.tooltip.titleMarginBottom = 6;
		Chart.defaults.plugins.tooltip.titleFont.family = bodyFontFamily;
		Chart.defaults.plugins.tooltip.titleFont.weight = bodyFontWeight;
		Chart.defaults.plugins.tooltip.footerFont.family = bodyFontFamily;
		Chart.defaults.plugins.tooltip.displayColors = true;
		Chart.defaults.plugins.tooltip.boxPadding = 6;
		Chart.defaults.scale.grid.color = borderColor;
		Chart.defaults.scale.beginAtZero = true;
		Chart.defaults.maintainAspectRatio = false;
		
		var chart1Container = document.getElementById('chart-1');
		if (chart1) {
			chart1.destroy();
		}
		if (chart1Container) {
			chart1Container.innerHTML = '<canvas id="lineChart"></canvas>';
			chart1 = new Chart(document.getElementById('lineChart'), {
				type: 'line',
				data: {
					labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
					datasets: [{
						label: 'Page Views',
						fill: false,
						lineTension: 0.1,
						backgroundColor: 'rgba('+ tealRgb +', 0.25)',
						borderColor: teal,
						borderWidth: 2,
						pointBorderColor: teal,
						pointBackgroundColor: componentBg,
						pointBorderWidth: 2,
						pointHoverRadius: 5,
						pointHoverBackgroundColor: componentBg,
						pointHoverBorderColor: teal,
						pointHoverBorderWidth: 3,
						pointRadius: 3,
						pointHitRadius: 10,
						data: [65, 59, 80, 81, 56, 55, 40, 59, 76, 94, 77, 82]
					},{
						label: 'Visitors',
						fill: false,
						lineTension: 0.1,
						backgroundColor: 'rgba('+ blueRgb +', 0.25)',
						borderColor: blue,
						borderWidth: 2,
						pointBorderColor: blue,
						pointBackgroundColor: componentBg,
						pointBorderWidth: 2,
						pointHoverRadius: 5,
						pointHoverBackgroundColor: componentBg,
						pointHoverBorderColor: blue,
						pointHoverBorderWidth: 3,
						pointRadius: 3,
						pointHitRadius: 10,
						data: [25, 29, 40, 45, 16, 15, 20, 39, 26, 44, 57, 32]
					}]
				}
			});
		}
	}
	
	function renderMap() {
		var componentActiveBg = (getComputedStyle(document.body).getPropertyValue('--bs-component-active-bg')).trim();
		var gray500 = (getComputedStyle(document.body).getPropertyValue('--bs-gray-500')).trim();
		var bodyColor = (getComputedStyle(document.body).getPropertyValue('--bs-body-color')).trim();
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
						fill: componentActiveBg,
						stroke: 'none',
						r: 5,
					},
					hover: {
						fill: componentActiveBg
					}
				},
				markerLabelStyle: {
					initial: {
						fontFamily: bodyFontFamily,
						fontSize: '12px',
						fill: bodyColor
					},
				},
				regionStyle: {
					initial: {
						fill: gray500,
						fillOpacity: 0.5,
						stroke: 'none',
						strokeWidth: 0.4,
						strokeOpacity: 1
					},
					hover: {
						fillOpacity: 0.5
					}
				},
				backgroundColor: 'transparent',
			});
		}
	}
	
	useEffect(() => {
    // eslint-diable-next-line
    renderMap();
		renderChart();
		
		document.addEventListener('theme-reload', () => {
			renderMap();
			renderChart();
		});
		
		// eslint-disable-next-line
	}, []);
	
	function handleOnChange() {
	
	}
	
	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link to="/dashboard/v1">Home</Link></li>
				<li className="breadcrumb-item active">Dashboard</li>
			</ol>
			<h1 className="page-header">Dashboard <small>header small text goes here...</small></h1>
			
			<div className="row">
				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-blue">
						<div className="stats-icon"><i className="fa fa-desktop"></i></div>
						<div className="stats-info">
							<h4>TOTAL VISITORS</h4>
							<p>3,291,922</p>	
						</div>
						<div className="stats-link">
							<Link to="/dashboard/v1">View Detail <i className="fa fa-arrow-alt-circle-right"></i></Link>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-info">
						<div className="stats-icon"><i className="fa fa-link"></i></div>
						<div className="stats-info">
							<h4>BOUNCE RATE</h4>
							<p>20.44%</p>	
						</div>
						<div className="stats-link">
							<Link to="/dashboard/v1">View Detail <i className="fa fa-arrow-alt-circle-right"></i></Link>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-orange">
						<div className="stats-icon"><i className="fa fa-users"></i></div>
						<div className="stats-info">
							<h4>UNIQUE VISITORS</h4>
							<p>1,291,922</p>	
						</div>
						<div className="stats-link">
							<Link to="/dashboard/v1">View Detail <i className="fa fa-arrow-alt-circle-right"></i></Link>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-red">
						<div className="stats-icon"><i className="fa fa-clock"></i></div>
						<div className="stats-info">
							<h4>AVG TIME ON SITE</h4>
							<p>00:12:23</p>	
						</div>
						<div className="stats-link">
							<Link to="/dashboard/v1">View Detail <i className="fa fa-arrow-alt-circle-right"></i></Link>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-xl-8">
					<Panel>
						<PanelHeader>Website Analytics (Last 7 Days)</PanelHeader>
						<PanelBody>
							<div id="chart-1" className="h-300px"></div>
						</PanelBody>
					</Panel>
			
					<ul className="nav nav-tabs nav-tabs-inverse nav-justified" data-sortable-id="index-2">
						<li className="nav-item"><a href="#latest-post" data-bs-toggle="tab" className="nav-link active"><i className="fa fa-camera fa-lg me-5px"></i> <span className="d-none d-md-inline">Latest Post</span></a></li>
						<li className="nav-item"><a href="#purchase" data-bs-toggle="tab" className="nav-link"><i className="fa fa-archive fa-lg me-5px"></i> <span className="d-none d-md-inline">Purchase</span></a></li>
						<li className="nav-item"><a href="#email" data-bs-toggle="tab" className="nav-link"><i className="fa fa-envelope fa-lg me-5px"></i> <span className="d-none d-md-inline">Email</span></a></li>
					</ul>
					<div className="tab-content panel rounded-0 rounded-bottom mb-20px" data-sortable-id="index-3">
						<div className="tab-pane fade active show" id="latest-post">
							<PerfectScrollbar className="h-300px p-3">
								<div className="d-sm-flex">
									<a href="#/" className="w-sm-200px">
										<img className="mw-100 rounded" src="/assets/img/gallery/gallery-1.jpg" alt="" />
									</a>
									<div className="flex-1 ps-sm-3 pt-3 pt-sm-0">
										<h5>Aenean viverra arcu nec pellentesque ultrices. In erat purus, adipiscing nec lacinia at, ornare ac eros.</h5>
										Nullam at risus metus. Quisque nisl purus, pulvinar ut mauris vel, elementum suscipit eros. Praesent ornare ante massa, egestas pellentesque orci convallis ut. Curabitur consequat convallis est, id luctus mauris lacinia vel. Nullam tristique lobortis mauris, ultricies fermentum lacus bibendum id. Proin non ante tortor. Suspendisse pulvinar ornare tellus nec pulvinar. Nam pellentesque accumsan mi, non pellentesque sem convallis sed. Quisque rutrum erat id auctor gravida.
									</div>
								</div>
								<hr className="bg-gray-500" />
								<div className="d-sm-flex">
									<a href="#/" className="w-sm-200px">
										<img className="mw-100 rounded" src="/assets/img/gallery/gallery-10.jpg" alt="" />
									</a>
									<div className="flex-1 ps-sm-3 pt-3 pt-sm-0">
										<h5>Vestibulum vitae diam nec odio dapibus placerat. Ut ut lorem justo.</h5>
										Fusce bibendum augue nec fermentum tempus. Sed laoreet dictum tempus. Aenean ac sem quis nulla malesuada volutpat. Nunc vitae urna pulvinar velit commodo cursus. Nullam eu felis quis diam adipiscing hendrerit vel ac turpis. Nam mattis fringilla euismod. Donec eu ipsum sit amet mauris iaculis aliquet. Quisque sit amet feugiat odio. Cras convallis lorem at libero lobortis, placerat lobortis sapien lacinia. Duis sit amet elit bibendum sapien dignissim bibendum.
									</div>
								</div>
								<hr className="bg-gray-500" />
								<div className="d-sm-flex">
									<a href="#/" className="w-sm-200px">
										<img className="mw-100 rounded" src="/assets/img/gallery/gallery-7.jpg" alt="" />
									</a>
									<div className="flex-1 ps-sm-3 pt-3 pt-sm-0">
										<h5>Maecenas eget turpis luctus, scelerisque arcu id, iaculis urna. Interdum et malesuada fames ac ante ipsum primis in faucibus.</h5>
										Morbi placerat est nec pharetra placerat. Ut laoreet nunc accumsan orci aliquam accumsan. Maecenas volutpat dolor vitae sapien ultricies fringilla. Suspendisse vitae orci sed nibh ultrices tristique. Aenean in ante eget urna semper imperdiet. Pellentesque sagittis a nulla at scelerisque. Nam augue nulla, accumsan quis nisi a, facilisis eleifend nulla. Praesent aliquet odio non imperdiet fringilla. Morbi a porta nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.
									</div>
								</div>
								<hr className="bg-gray-500" />
								<div className="d-sm-flex">
									<a href="#/" className="w-sm-200px">
										<img className="mw-100 rounded" src="/assets/img/gallery/gallery-8.jpg" alt="" />
									</a>
									<div className="flex-1 ps-sm-3 pt-3 pt-sm-0">
										<h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor accumsan rutrum.</h5>
										Fusce augue diam, vestibulum a mattis sit amet, vehicula eu ipsum. Vestibulum eu mi nec purus tempor consequat. Vestibulum porta non mi quis cursus. Fusce vulputate cursus magna, tincidunt sodales ipsum lobortis tincidunt. Mauris quis lorem ligula. Morbi placerat est nec pharetra placerat. Ut laoreet nunc accumsan orci aliquam accumsan. Maecenas volutpat dolor vitae sapien ultricies fringilla. Suspendisse vitae orci sed nibh ultrices tristique. Aenean in ante eget urna semper imperdiet. Pellentesque sagittis a nulla at scelerisque.
									</div>
								</div>
							</PerfectScrollbar>
						</div>
						<div className="tab-pane fade" id="purchase">
							<PerfectScrollbar className="h-300px">
								<table className="table table-panel mb-0">
									<thead>
										<tr>
											<th>Date</th>
											<th className="hidden-sm text-center">Product</th>
											<th></th>
											<th>Amount</th>
											<th>User</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td className="fw-bold text-muted">13/02/2024</td>
											<td className="hidden-sm text-center">
												<a href="#/">
													<img src="/assets/img/product/product-1.png" alt="" width="32px"  />
												</a>
											</td>
											<td className="text-nowrap">
												<h6><a href="#/" className="text-dark text-decoration-none">Nunc eleifend lorem eu velit eleifend, <br />eget faucibus nibh placerat.</a></h6>
											</td>
											<td className="text-blue fw-bold">$349.00</td>
											<td className="text-nowrap"><a href="#/" className="text-dark text-decoration-none">Derick Wong</a></td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">13/02/2024</td>
											<td className="hidden-sm text-center">
												<a href="#/">
													<img src="/assets/img/product/product-2.png" alt="" width="32px" />
												</a>
											</td>
											<td className="text-nowrap">
												<h6><a href="#/" className="text-dark text-decoration-none">Nunc eleifend lorem eu velit eleifend, <br />eget faucibus nibh placerat.</a></h6>
											</td>
											<td className="text-blue fw-bold">$399.00</td>
											<td className="text-nowrap"><a href="#/" className="text-dark text-decoration-none">Derick Wong</a></td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">13/02/2024</td>
											<td className="hidden-sm text-center">
												<a href="#/">
													<img src="/assets/img/product/product-3.png" alt="" width="32px" />
												</a>
											</td>
											<td className="text-nowrap">
												<h6><a href="#/" className="text-dark text-decoration-none">Nunc eleifend lorem eu velit eleifend, <br />eget faucibus nibh placerat.</a></h6>
											</td>
											<td className="text-blue fw-bold">$499.00</td>
											<td className="text-nowrap"><a href="#/" className="text-dark text-decoration-none">Derick Wong</a></td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">13/02/2024</td>
											<td className="hidden-sm text-center">
												<a href="#/">
													<img src="/assets/img/product/product-4.png" alt="" width="32px" />
												</a>
											</td>
											<td className="text-nowrap">
												<h6><a href="#/" className="text-dark text-decoration-none">Nunc eleifend lorem eu velit eleifend, <br />eget faucibus nibh placerat.</a></h6>
											</td>
											<td className="text-blue fw-bold">$230.00</td>
											<td className="text-nowrap"><a href="#/" className="text-dark text-decoration-none">Derick Wong</a></td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">13/02/2024</td>
											<td className="hidden-sm text-center">
												<a href="#/">
													<img src="/assets/img/product/product-5.png" alt="" width="32px" />
												</a>
											</td>
											<td className="text-nowrap">
												<h6><a href="#/" className="text-dark text-decoration-none">Nunc eleifend lorem eu velit eleifend, <br />eget faucibus nibh placerat.</a></h6>
											</td>
											<td className="text-blue fw-bold">$500.00</td>
											<td className="text-nowrap"><a href="#/" className="text-dark text-decoration-none">Derick Wong</a></td>
										</tr>
									</tbody>
								</table>
							</PerfectScrollbar>
						</div>
						<div className="tab-pane fade" id="email">
							<PerfectScrollbar className="h-300px p-3">
								<div className="d-flex">
									<a className="w-60px" href="#/">
										<img src="/assets/img/user/user-1.jpg" alt="" className="mw-100 rounded-pill" />
									</a>
									<div className="flex-1 ps-3">
										<a href="#/" className="text-dark text-decoration-none"><h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h5></a>
										<p className="mb-5px">
											Aenean mollis arcu sed turpis accumsan dignissim. Etiam vel tortor at risus tristique convallis. Donec adipiscing euismod arcu id euismod. Suspendisse potenti. Aliquam lacinia sapien ac urna placerat, eu interdum mauris viverra.
										</p>
										<span className="text-muted fs-11px fw-bold">Received on 04/16/2024, 12.39pm</span>
									</div>
								</div>
								<hr className="bg-gray-500" />
								<div className="d-flex">
									<a className="w-60px" href="#/">
										<img src="/assets/img/user/user-2.jpg" alt="" className="mw-100 rounded-pill" />
									</a>
									<div className="flex-1 ps-3">
										<a href="#/" className="text-dark text-decoration-none"><h5>Praesent et sem porta leo tempus tincidunt eleifend et arcu.</h5></a>
										<p className="mb-5px">
											Proin adipiscing dui nulla. Duis pharetra vel sem ac adipiscing. Vestibulum ut porta leo. Pellentesque orci neque, tempor ornare purus nec, fringilla venenatis elit. Duis at est non nisl dapibus lacinia.
										</p>
										<span className="text-muted fs-11px fw-bold">Received on 04/16/2024, 12.39pm</span>
									</div>
								</div>
								<hr className="bg-gray-500" />
								<div className="d-flex">
									<a className="w-60px" href="#/">
										<img src="/assets/img/user/user-3.jpg" alt="" className="mw-100 rounded-pill" />
									</a>
									<div className="flex-1 ps-3">
										<a href="#/" className="text-dark text-decoration-none"><h5>Ut mi eros, varius nec mi vel, consectetur convallis diam.</h5></a>
										<p className="mb-5px">
											Ut mi eros, varius nec mi vel, consectetur convallis diam. Nullam eget hendrerit eros. Duis lacinia condimentum justo at ultrices. Phasellus sapien arcu, fringilla eu pulvinar id, mattis quis mauris.
										</p>
										<span className="text-muted fs-11px fw-bold">Received on 04/16/2024, 12.39pm</span>
									</div>
								</div>
								<hr className="bg-gray-500" />
								<div className="d-flex">
									<a className="w-60px" href="#/">
										<img src="/assets/img/user/user-4.jpg" alt="" className="mw-100 rounded-pill" />
									</a>
									<div className="flex-1 ps-3">
										<a href="#/" className="text-dark text-decoration-none"><h5>Aliquam nec dolor vel nisl dictum ullamcorper.</h5></a>
										<p className="mb-5px">
											Aliquam nec dolor vel nisl dictum ullamcorper. Duis vel magna enim. Aenean volutpat a dui vitae pulvinar. Nullam ligula mauris, dictum eu ullamcorper quis, lacinia nec mauris.
										</p>
										<span className="text-muted fs-11px fw-bold">Received on 04/16/2024, 12.39pm</span>
									</div>
								</div>
							</PerfectScrollbar>
						</div>
					</div>
					
					<Panel>
						<PanelHeader>
							Quick Post
						</PanelHeader>
						<div className="panel-toolbar">
							<div className="btn-group me-5px">
								<button className="btn btn-white"><i className="fa fa-bold"></i></button>
								<button className="btn btn-white active"><i className="fa fa-italic"></i></button>
								<button className="btn btn-white"><i className="fa fa-underline"></i></button>
							</div>
							<div className="btn-group">
								<button className="btn btn-white"><i className="fa fa-align-left"></i></button>
								<button className="btn btn-white active"><i className="fa fa-align-center"></i></button>
								<button className="btn btn-white"><i className="fa fa-align-right"></i></button>
								<button className="btn btn-white"><i className="fa fa-align-justify"></i></button>
							</div>
						</div>
						<textarea className="form-control rounded-0 border-0 shadow-none bg-light p-3" rows="14" defaultValue="Enter some comment."></textarea>
						<PanelFooter className={"text-end"}>
							<button className="btn btn-white btn-sm">Cancel</button>
							<button className="btn btn-primary btn-sm ms-5px">Action</button>
						</PanelFooter>
					</Panel>
					
					<Panel>
						<PanelHeader>Message</PanelHeader>
						<PanelBody>
							<PerfectScrollbar className="h-300px" options={{suppressScrollX: true}}>
								<div className="d-flex">
									<Link to="/dashboard/v1" className="w-60px">
										<img src="/assets/img/user/user-5.jpg" alt="" className="mw-100 rounded-pill" />
									</Link>
									<div className="flex-1 ps-3">
										<h5>John Doe</h5>
										<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id nunc non eros fermentum vestibulum ut id felis. Nunc molestie libero eget urna aliquet, vitae laoreet felis ultricies. Fusce sit amet massa malesuada, tincidunt augue vitae, gravida felis.</p>
									</div>
								</div>
								<hr className="bg-gray-500" />
								<div className="d-flex">
									<Link to="/dashboard/v1" className="w-60px">
										<img src="/assets/img/user/user-6.jpg" alt="" className="mw-100 rounded-pill" />
									</Link>
									<div className="flex-1 ps-3">
										<h5>Terry Ng</h5>
										<p>Sed in ante vel ipsum tristique euismod posuere eget nulla. Quisque ante sem, scelerisque iaculis interdum quis, eleifend id mi. Fusce congue leo nec mauris malesuada, id scelerisque sapien ultricies.</p>
									</div>
								</div>
								<hr className="bg-gray-500" />
								<div className="d-flex">
									<Link to="/dashboard/v1" className="w-60px">
										<img src="/assets/img/user/user-8.jpg" alt="" className="mw-100 rounded-pill" />
									</Link>
									<div className="flex-1 ps-3">
										<h5>Fiona Log</h5>
										<p>Pellentesque dictum in tortor ac blandit. Nulla rutrum eu leo vulputate ornare. Nulla a semper mi, ac lacinia sapien. Sed volutpat ornare eros, vel semper sem sagittis in. Quisque risus ipsum, iaculis quis cursus eu, tristique sed nulla.</p>
									</div>
								</div>
								<hr className="bg-gray-500" />
								<div className="d-flex">
									<Link to="/dashboard/v1" className="w-60px">
										<img src="/assets/img/user/user-7.jpg" alt="" className="mw-100 rounded-pill" />
									</Link>
									<div className="flex-1 ps-3">
										<h5>John Doe</h5>
										<p>Morbi molestie lorem quis accumsan elementum. Morbi condimentum nisl iaculis, laoreet risus sed, porta neque. Proin mi leo, dapibus at ligula a, aliquam consectetur metus.</p>
									</div>
								</div>
							</PerfectScrollbar>
						</PanelBody>
						<PanelFooter>
							<form>
								<div className="input-group">
									<input type="text" className="form-control bg-light" placeholder="Enter message" />
									<button className="btn btn-primary" type="button"><i className="fa fa-pencil-alt"></i></button>
								</div>
							</form>
						</PanelFooter>
					</Panel>
				</div>
				<div className="col-xl-4">
					<Panel>
						<PanelHeader>Analytics Details</PanelHeader>
						<PanelBody className="p-0">
							<div className="table-responsive">
								<table className="table table-panel align-middle mb-0">
									<thead>
										<tr>	
											<th>Source</th>
											<th>Total</th>
											<th>Trend</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td><label className="badge bg-danger">Unique Visitor</label></td>
											<td>13,203 <span className="text-success"><i className="fa fa-arrow-up"></i></span></td>
											<td className="align-middle">
												<div className="w-100px my-n1">
													<ApexChart type="line" height="20" options={sparkLineOptions} series={sparklineData} />
												</div>
											</td>
										</tr>
										<tr>
											<td><label className="badge bg-warning">Bounce Rate</label></td>
											<td>28.2%</td>
											<td className="align-middle">
												<div className="w-100px my-n1">
													<ApexChart type="line" height="20" options={sparkLineOptions2} series={sparklineData2} />
												</div>
											</td>
										</tr>
										<tr>
											<td><label className="badge bg-success">Total Page Views</label></td>
											<td>1,230,030</td>
											<td className="align-middle">
												<div className="w-100px my-n1">
													<ApexChart type="line" height="20" options={sparkLineOptions3} series={sparklineData3} />
												</div>
											</td>
										</tr>
										<tr>
											<td><label className="badge bg-blue">Avg Time On Site</label></td>
											<td>00:03:45</td>
											<td className="align-middle">
												<div className="w-100px my-n1">
													<ApexChart type="line" height="20" options={sparkLineOptions4} series={sparklineData4} />
												</div>
											</td>
										</tr>
										<tr>
											<td><label className="badge bg-gray-500">% New Visits</label></td>
											<td>40.5%</td>
											<td className="align-middle">
												<div className="w-100px my-n1">
													<ApexChart type="line" height="20" options={sparkLineOptions5} series={sparklineData5} />
												</div>
											</td>
										</tr>
										<tr>
											<td><label className="badge bg-inverse">Return Visitors</label></td>
											<td>73.4%</td>
											<td className="align-middle">
												<div className="w-100px my-n1">
													<ApexChart type="line" height="20" options={sparkLineOptions6} series={sparklineData6} />
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
					</Panel>		
					<Panel>
						<PanelHeader>Todo List</PanelHeader>
						<PanelBody className="p-0">
							<div className="todolist">
								<div className="todolist-item active">
									<div className="todolist-input">
										<div className="form-check">
											<input type="checkbox" onChange={handleOnChange} className="form-check-input" id="todolist1" data-change="todolist" checked />
										</div>
									</div>
									<label className="todolist-label" htmlFor="todolist1">Donec vehicula pretium nisl, id lacinia nisl tincidunt id.</label>
								</div>
								<div className="todolist-item">
									<div className="todolist-input">
										<div className="form-check">
											<input type="checkbox" onChange={handleOnChange} className="form-check-input" id="todolist2" data-change="todolist" />
										</div>
									</div>
									<label className="todolist-label" htmlFor="todolist2">Duis a ullamcorper massa.</label>
								</div>
								<div className="todolist-item">
									<div className="todolist-input">
										<div className="form-check">
											<input type="checkbox" onChange={handleOnChange} className="form-check-input" id="todolist3" data-change="todolist" />
										</div>
									</div>
									<label className="todolist-label" htmlFor="todolist3">Phasellus bibendum, odio nec vestibulum ullamcorper.</label>
								</div>
								<div className="todolist-item">
									<div className="todolist-input">
										<div className="form-check">
											<input type="checkbox" onChange={handleOnChange} className="form-check-input" id="todolist4" data-change="todolist" />
										</div>
									</div>
									<label className="todolist-label" htmlFor="todolist4">Duis pharetra mi sit amet dictum congue.</label>
								</div>
								<div className="todolist-item">
									<div className="todolist-input">
										<div className="form-check">
											<input type="checkbox" onChange={handleOnChange} className="form-check-input" id="todolist5" data-change="todolist" />
										</div>
									</div>
									<label className="todolist-label" htmlFor="todolist5">Duis pharetra mi sit amet dictum congue.</label>
								</div>
								<div className="todolist-item">
									<div className="todolist-input">
										<div className="form-check">
											<input type="checkbox" onChange={handleOnChange} className="form-check-input" id="todolist6" data-change="todolist" />
										</div>
									</div>
									<label className="todolist-label" htmlFor="todolist6">Phasellus bibendum, odio nec vestibulum ullamcorper.</label>
								</div>
								<div className="todolist-item">
									<div className="todolist-input">
										<div className="form-check">
											<input type="checkbox" onChange={handleOnChange} className="form-check-input" id="todolist7" data-change="todolist" />
										</div>
									</div>
									<label className="todolist-label" htmlFor="todolist7">Donec vehicula pretium nisl, id lacinia nisl tincidunt id.</label>
								</div>
							</div>
						</PanelBody>
					</Panel>
					<Panel>
						<PanelHeader>
							Word Visitors
						</PanelHeader>
						<div style={{height: '300px'}}>
							<div id="jvectorMap" style={{height: '300px'}}></div>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>
							Calendar
						</PanelHeader>
						<Calendar value={date} />
					</Panel>
				</div>
			</div>
		</div>
	)
};

export default DashboardV1;