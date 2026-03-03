import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import Highlight from 'react-highlight';
import DataTable from 'react-data-table-component';


function TablePlugins() {
	const [code1, setCode1] = useState();
	const columns = [
		{ name: 'Name', selector: row => row.name, sortable: true },
		{ name: 'Email', selector: row => row.email, sortable: true }, 
		{ name: 'Address', selector: row => row.address, sortable: true }
	];

	const data = [
		{id: 1, name: 'Anne Nader', email: 'Rahul.Dare@hotmail.com', address: '4512 Nolan Brooks'},
		{id: 2, name: 'Amber Leffler', email: 'Mia58@gmail.com', address: '405 Emmy Radial'},
		{id: 3, name: 'Andres Bosco', email: 'Amir.Anderson@hotmail.com', address: '15853 Conroy Plains'},
		{id: 4, name: 'Elvira Bruen', email: 'Kariane11@gmail.com', address: '66784 Considine Islands'},
		{id: 5, name: 'Paul Cole', email: 'Shannon_Beer@hotmail.com', address: '9110 Mann Route'},
		{id: 6, name: 'Loretta Bednar', email: 'Kenyatta_Heller@hotmail.com', address: '97767 McDermott Freeway'},
		{id: 7, name: 'Marcia Hauck', email: 'Joyce_Yost@gmail.com', address: '08173 Skyla Heights'},
		{id: 8, name: 'Austin OKon III', email: 'Michele62@hotmail.com', address: '408 Jerde Place'},
		{id: 9, name: 'Karen Murphy', email: 'Abigail96@gmail.com', address: '61596 OKon Stream'},
		{id: 10, name: 'Nellie Luettgen V', email: 'Jeramie_Mosciski40@gmail.com', address: '24398 Conrad Haven'},
		{id: 11, name: 'Tara Weimann', email: 'Tre_Heidenreich@hotmail.com', address: '105 Beahan River'},
		{id: 12, name: 'Gina Treutel', email: 'Alisha95@gmail.com', address: '53821 Borer Light'},
		{id: 13, name: 'Roberta Jaskolski', email: 'Barrett.Stamm@yahoo.com', address: '756 Lilyan Curve'},
		{id: 14, name: 'Heather Terry', email: 'Orin_Hilll32@yahoo.com', address: '39951 Kirlin Crossing'},
		{id: 15, name: 'Alfredo Kilback', email: 'Breana.Gleason@yahoo.com', address: '747 Jade Gardens'},
		{id: 16, name: 'Mr. Eric Hoppe', email: 'Tyshawn_Carroll@gmail.com', address: '6044 Lola Rapid'},
		{id: 17, name: 'Kellie Lueilwitz', email: 'Eryn48@hotmail.com', address: '833 Jada Freeway'},
		{id: 18, name: 'Stacey Breitenberg', email: 'Jacklyn4@hotmail.com', address: '3574 Winifred Trace'},
		{id: 19, name: 'Kristy Buckridge', email: 'Cali_Schulist93@yahoo.com', address: '732 Malinda Walk'},
		{id: 20, name: 'Maureen Schaden', email: 'Clay.Gleichner@hotmail.com', address: '4161 Keara Lodge'},
		{id: 21, name: 'Malcolm Schimmel', email: 'Dean.Gottlieb@gmail.com', address: '36619 Gottlieb Lights'},
		{id: 22, name: 'Yvonne Carroll', email: 'Lavina_Sawayn@hotmail.com', address: '7624 Alf Plain'},
		{id: 23, name: 'Hugh Emard', email: 'Erna_Streich51@gmail.com', address: '84938 Bette Mount'},
		{id: 24, name: 'Alice Christiansen', email: 'Erika_Larson12@yahoo.com', address: '58814 Gene Trafficway'},
		{id: 25, name: 'Blanche Kautzer', email: 'Brock_Bernhard@hotmail.com', address: '1431 Emory Freeway'},
		{id: 26, name: 'Johnnie Gutkowski', email: 'Lexie43@gmail.com', address: '90789 Prince Mills'},
		{id: 27, name: 'Sheila Thompson', email: 'Joel_Cartwright22@yahoo.com', address: '8915 Chadrick Wells'},
		{id: 28, name: 'Edwin Krajcik', email: 'Ervin.Wyman34@yahoo.com', address: '0605 Koepp Fort'},
		{id: 29, name: 'Barry Walsh', email: 'Vesta_Hauck93@hotmail.com', address: '4215 Wisozk Centers'},
		{id: 30, name: 'Kyle Monahan', email: 'Sterling46@gmail.com', address: '290 Johnston Knoll'}
	]

	const rowDisabledCriteria = row => row.isOutOfStock;
	const rowPreDisabled = row => row.disabled;
	const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;
	
	useEffect(() => {
		fetch('/assets/data/table-plugins/code-1.json').then(function(response) { return response.text(); }).then((html) => { setCode1(html); });
	});
	
	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link to="/table/data">Home</Link></li>
				<li className="breadcrumb-item"><Link to="/table/data">Tables</Link></li>
				<li className="breadcrumb-item active">Data Tables</li>
			</ol>
			<h1 className="page-header">Table Plugins <small>header small text goes here...</small></h1>
			<Panel>
				<PanelHeader>
					React Table
				</PanelHeader>
				<PanelBody>
					<DataTable title="React DataTable Component" 
						columns={columns} 
						data={data} 
						selectableRows
						selectableRowDisabled={rowDisabledCriteria}
						expandableRows
						expandableRowDisabled={rowPreDisabled}
						expandableRowsComponent={ExpandedComponent}
						pagination />
				</PanelBody>
				<div className="hljs-wrapper">
					<Highlight className='typescript'>{code1}</Highlight>
				</div>
			</Panel>
		</div>
	)
}

export default TablePlugins;