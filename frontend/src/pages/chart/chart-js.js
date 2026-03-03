import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import Chart from 'chart.js/auto';
import Highlight from 'react-highlight';

function ChartJs() {
	const [code1, setCode1] = useState();
	const [code2, setCode2] = useState();
	const [code3, setCode3] = useState();
	const [code4, setCode4] = useState();
	const [code5, setCode5] = useState();
	const [code6, setCode6] = useState();
	
	var chart1, chart2, chart3, chart4, chart5, chart6 = '';
	
	function renderChart() {
		var themeColor = (getComputedStyle(document.body).getPropertyValue('--bs-app-theme')).trim();
		var themeColorRgb = (getComputedStyle(document.body).getPropertyValue('--bs-app-theme-rgb')).trim();
		var gray900 = (getComputedStyle(document.body).getPropertyValue('--bs-gray-900')).trim();
		var gray900Rgb = (getComputedStyle(document.body).getPropertyValue('--bs-gray-900-rgb')).trim();
		var gray800Rgb = (getComputedStyle(document.body).getPropertyValue('--bs-gray-800-rgb')).trim();
		var gray500 = (getComputedStyle(document.body).getPropertyValue('--bs-gray-500')).trim();
		var gray500Rgb = (getComputedStyle(document.body).getPropertyValue('--bs-gray-500-rgb')).trim();
		var gray300Rgb = (getComputedStyle(document.body).getPropertyValue('--bs-gray-300-rgb')).trim();
		
		var bodyBg = (getComputedStyle(document.body).getPropertyValue('--bs-body-bg')).trim();
		var bodyFontFamily = (getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
		var bodyFontWeight = (getComputedStyle(document.body).getPropertyValue('--bs-body-font-weight')).trim();
		var bodyColor = (getComputedStyle(document.body).getPropertyValue('--bs-body-color')).trim();
		var borderColor = (getComputedStyle(document.body).getPropertyValue('--bs-border-color')).trim();
		var inverse = (getComputedStyle(document.body).getPropertyValue('--bs-inverse')).trim();
		var inverseRgb = (getComputedStyle(document.body).getPropertyValue('--bs-inverse-rgb')).trim();
		
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
		
		var chart1Container = document.getElementById('chart-1');
		if (chart1) {
			chart1.destroy();
		}
		if (chart1Container) {
			chart1Container.innerHTML = '<canvas id="lineChart"></canvas>';
			chart1 = new Chart(document.getElementById('lineChart'), {
				type: 'line',
				data: {
					labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
					datasets: [{
						color: themeColor,
						backgroundColor: 'rgba('+ themeColorRgb +', .2)',
						borderColor: themeColor,
						borderWidth: 1.5,
						pointBackgroundColor: bodyBg,
						pointBorderWidth: 1.5,
						pointRadius: 4,
						pointHoverBackgroundColor: themeColor,
						pointHoverBorderColor: bodyBg,
						pointHoverRadius: 7,
						label: 'Total Sales',
						data: [12, 19, 4, 5, 2, 3]
					}]
				}
			});
		}
	
		var chart2Container = document.getElementById('chart-2');
		if (chart2) {
			chart2.destroy();
		}
		if (chart2Container) {
			chart2Container.innerHTML = '<canvas id="barChart"></canvas>';
			chart2 = new Chart(document.getElementById('barChart'), {
				type: 'bar',
				data: {
					labels: ['Jan','Feb','Mar','Apr','May','Jun'],
					datasets: [{
						label: 'Total Visitors',
						data: [37,31,36,34,43,31],
						backgroundColor: 'rgba('+ themeColorRgb +', .5)',
						borderColor: themeColor,
						borderWidth: 1.5
					},{
						label: 'New Visitors',
						data: [12,16,20,14,23,21],
						backgroundColor: 'rgba('+ inverseRgb +', .2)',
						borderColor: 'rgba('+ inverseRgb +', .65)',
						borderWidth: 1.5
					}]
				}
			});
		}
	
		var chart3Container = document.getElementById('chart-3');
		if (chart3) {
			chart3.destroy();
		}
		if (chart3Container) {
			chart3Container.innerHTML = '<canvas id="radarChart"></canvas>';
			chart3 = new Chart(document.getElementById('radarChart'), {
				type: 'radar',
				data: {
					labels: ['United States', 'Canada', 'Australia', 'Netherlands', 'Germany', 'New Zealand', 'Singapore'],
					datasets: [
						{
							label: 'Mobile',
							backgroundColor: 'rgba('+ themeColorRgb +', .2)',
							borderColor: themeColor,
							pointBackgroundColor: bodyBg,
							pointBorderColor: themeColor,
							pointHoverBackgroundColor: bodyBg,
							pointHoverBorderColor: themeColor,
							data: [65, 59, 90, 81, 56, 55, 40],
							borderWidth: 1.5
						},
						{
							label: 'Desktop',
							backgroundColor: 'rgba('+ gray500Rgb +', .2)',
							borderColor: gray500,
							pointBackgroundColor: bodyBg,
							pointBorderColor: gray500,
							pointHoverBackgroundColor: bodyBg,
							pointHoverBorderColor: gray500,
							data: [28, 48, 40, 19, 96, 27, 100],
							borderWidth: 1.5
						}
					]
				}
			});
		}
		
		var chart4Container = document.getElementById('chart-4');
		if (chart4) {
			chart4.destroy();
		}
		if (chart4Container) {
			chart4Container.innerHTML = '<canvas id="polarAreaChart"></canvas>';
			chart4 = new Chart(document.getElementById('polarAreaChart'), {
				type: 'polarArea',
				data: {
					datasets: [{
						data: [11, 16, 7, 3, 14],
						backgroundColor: ['rgba('+ themeColorRgb +', .5)', 'rgba('+ inverseRgb +', .2)', 'rgba('+ gray300Rgb+', .5)', 'rgba('+ gray500Rgb +', .5)', 'rgba('+ gray800Rgb +', .5)'],
						borderWidth: 0
					}],
					labels: ['IE', 'Safari', 'Chrome', 'Firefox', 'Opera']
				}
			});
		}
	
		var chart5Container = document.getElementById('chart-5');
		if (chart5) {
			chart5.destroy();
		}
		if (chart5Container) {
			chart5Container.innerHTML = '<canvas id="pieChart"></canvas>';
			chart5 = new Chart(document.getElementById('pieChart'), {
				type: 'pie',
				data: {
					labels: ['Total Visitor', 'New Visitor', 'Returning Visitor'],
					datasets: [{
						data: [300, 50, 100],
						backgroundColor: ['rgba('+ themeColorRgb +', .5)', 'rgba('+ inverseRgb +', .2)', 'rgba('+ themeColorRgb +', .5)'],
						hoverBackgroundColor: ['rgba('+ themeColorRgb +', 1)', 'rgba('+ inverseRgb +', 1)', 'rgba('+ gray900Rgb +', 1)'],
						borderWidth: 0
					}]
				}
			});
		}
	
		var chart6Container = document.getElementById('chart-6');
		if (chart6) {
			chart6.destroy();
		}
		if (chart6Container) {
			chart6Container.innerHTML = '<canvas id="doughnutChart"></canvas>';
			chart6 = new Chart(document.getElementById('doughnutChart'), {
				type: 'doughnut',
				data: {
					labels: ['Total Visitor', 'New Visitor', 'Returning Visitor'],
					datasets: [{
						data: [300, 50, 100],
						backgroundColor: ['rgba('+ themeColorRgb +', .25)', 'rgba('+ inverseRgb +', .2)', 'rgba('+ themeColorRgb +', .5)'],
						hoverBackgroundColor: [themeColor, inverse, gray900],
						borderWidth: 0
					}]
				}
			});
		}
	}
	
	useEffect(() => {
		fetch('/assets/data/chart-js/code-1.json').then(function(response) { return response.text(); }).then((html) => { setCode1(html); });
		fetch('/assets/data/chart-js/code-2.json').then(function(response) { return response.text(); }).then((html) => { setCode2(html); });
		fetch('/assets/data/chart-js/code-3.json').then(function(response) { return response.text(); }).then((html) => { setCode3(html); });
		fetch('/assets/data/chart-js/code-4.json').then(function(response) { return response.text(); }).then((html) => { setCode4(html); });
		fetch('/assets/data/chart-js/code-5.json').then(function(response) { return response.text(); }).then((html) => { setCode5(html); });
		fetch('/assets/data/chart-js/code-6.json').then(function(response) { return response.text(); }).then((html) => { setCode6(html); });
		
		renderChart();
		
		document.addEventListener('theme-reload', () => {
			renderChart();
		});
		
		// eslint-disable-next-line
	}, []);

	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link to="/chart/js">Home</Link></li>
				<li className="breadcrumb-item"><Link to="/chart/js">Chart</Link></li>
				<li className="breadcrumb-item active">Chart JS</li>
			</ol>
			<h1 className="page-header">Chart JS <small>header small text goes here...</small></h1>
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Line Chart</PanelHeader>
						<PanelBody>
							<p>
								A line chart is a way of plotting data points on a line.
								Often, it is used to show trend data, and the comparison of two data sets.
							</p>
							<div id="chart-1"></div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{code1}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Bar Chart</PanelHeader>
						<PanelBody>
							<p>
								A bar chart is a way of showing data as bars.
								It is sometimes used to show trend data, and the comparison of multiple data sets side by side.
							</p>
							<div id="chart-2"></div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{code2}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Radar Chart</PanelHeader>
						<PanelBody>
							<p>
								A radar chart is a way of showing multiple data points and the variation between them.
								They are often useful for comparing the points of two or more different data sets.
							</p>
							<div className="w-300px h-300px mx-auto">
								<div id="chart-3"></div>
							</div>
						</PanelBody>
						
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{code3}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Polar Area Chart</PanelHeader>
						<PanelBody>
							<p>
								Polar area charts are similar to pie charts, but each segment has the same angle - the radius of the segment 
								differs depending on the value.
							</p>
							<div className="w-300px h-300px mx-auto">
								<div id="chart-4"></div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{code4}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
			<div className="row">
				<div className="col-md-6">
					<Panel>
						<PanelHeader>Pie Chart</PanelHeader>
						<PanelBody>
							<p>
								Pie and doughnut charts are probably the most commonly used chart there are. They are divided into segments, the arc of each segment shows the proportional value of each piece of data.
							</p>
							<div className="w-300px h-300px mx-auto">
								<div id="chart-5"></div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{code5}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-md-6">
					<Panel>
						<PanelHeader>Doughnut Chart</PanelHeader>
						<PanelBody>
							<p>
								Pie and doughnut charts are registered under two aliases in the Chart core. Other than their different default value, and different alias, they are exactly the same.
							</p>
							<div className="w-300px h-300px mx-auto">
								<div id="chart-6"></div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{code6}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
		</div>
	)
}

export default ChartJs;