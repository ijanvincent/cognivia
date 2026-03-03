import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { SketchPicker, ChromePicker } from 'react-color';
import { ReactTags } from 'react-tag-autocomplete';
import DatePicker from 'react-datepicker';
import DateTime from 'react-datetime';
import Select from 'react-select';
import InputMask from 'react-input-mask';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker.css';
import Highlight from 'react-highlight';

function FormPlugins() {
	const [code1, setCode1] = useState();
	const [code2, setCode2] = useState();
	const [code3, setCode3] = useState();
	const [code4, setCode4] = useState();
	const [code5, setCode5] = useState();
	const [code6, setCode6] = useState();
	const [code7, setCode7] = useState();
	
	const [maxDateDisabled, setMaxDateDisabled] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [sketchBackgroundColor, setSketchBackgroundColor] = useState('#348fe2');
  const [chromeBackgroundColor, setChromeBackgroundColor] = useState('#8753de');
  const [tags, setTags] = useState([
    { value: 1, label: 'Apples' },
    { value: 2, label: 'Pears' }
  ]);
  const [suggestions] = useState([
    { value: 1, label: 'Apples' },
    { value: 2, label: 'Pears' },
    { value: 3, label: 'Bananas' },
    { value: 4, label: 'Mangos' },
    { value: 5, label: 'Lemons' },
    { value: 6, label: 'Apricots' }
  ]);
  const [text] = useState('');
  const editorRef = useRef(null);

  const minDateRange = (current) => {
    return current.isAfter(DateTime.moment().subtract(1, 'day'));
  };

  const maxDateRange = (current) => {
    return current.isAfter(editorRef.current);
  };

  const minDateChange = (value) => {
    setMaxDateDisabled(false);
    editorRef.current = value;
  };

  const handleChange = (date) => {
    setStartDate(date);
  };

  const handleSketchChangeComplete = (color) => {
    setSketchBackgroundColor(color.hex);
  };

  const handleChromeChangeComplete = (color) => {
    setChromeBackgroundColor(color.hex);
  };

  const handleDelete = (i) => {
    setTags(tags.filter((tag) => tag.id !== i));
  };

  const handleAdd = (newTag) => {
    setTags([...tags, newTag]);
  };

  const selectOptions = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ];
  
	useEffect(() => {
		fetch('/assets/data/form-plugins/code-1.json').then(function(response) { return response.text(); }).then((html) => { setCode1(html); });
		fetch('/assets/data/form-plugins/code-2.json').then(function(response) { return response.text(); }).then((html) => { setCode2(html); });
		fetch('/assets/data/form-plugins/code-3.json').then(function(response) { return response.text(); }).then((html) => { setCode3(html); });
		fetch('/assets/data/form-plugins/code-4.json').then(function(response) { return response.text(); }).then((html) => { setCode4(html); });
		fetch('/assets/data/form-plugins/code-5.json').then(function(response) { return response.text(); }).then((html) => { setCode5(html); });
		fetch('/assets/data/form-plugins/code-6.json').then(function(response) { return response.text(); }).then((html) => { setCode6(html); });
		fetch('/assets/data/form-plugins/code-7.json').then(function(response) { return response.text(); }).then((html) => { setCode7(html); });
	});

	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link to="/form/plugins">Home</Link></li>
				<li className="breadcrumb-item"><Link to="/form/plugins">Form Stuff</Link></li>
				<li className="breadcrumb-item active">Form Plugins</li>
			</ol>
			<h1 className="page-header">Form Plugins <small>header small text goes here...</small></h1>
			
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>
							Bootstrap Date Time Picker
						</PanelHeader>
						<PanelBody className="p-0">
							<form className="form-horizontal form-bordered">
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Default Date Time</label>
									<div className="col-lg-8">
										<DateTime inputProps={{ placeholder: 'Datepicker' }} closeOnSelect={true} />
									</div>
								</div>
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Select Time</label>
									<div className="col-lg-8">
										<DateTime dateFormat={false} inputProps={{ placeholder: 'Timepicker' }} />
									</div>
								</div>
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Range Pickers</label>
									<div className="col-lg-8">
										<div className="row gx-2">
											<div className="col-6">
												<DateTime isValidDate={ minDateRange } inputProps={{ placeholder: 'Min Date' }} closeOnSelect={true} onChange={ minDateChange } />
											</div>
											<div className="col-6">
												<DateTime isValidDate={ maxDateRange } inputProps={{ placeholder: 'Max Date', disabled: maxDateDisabled }} closeOnSelect={true} />
											</div>
										</div>
									</div>
								</div>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{code1}</Highlight>
						</div>
					</Panel>
					
					<Panel>
						<PanelHeader>
							React Select
						</PanelHeader>
						<PanelBody className="p-0">
							<form className="form-horizontal form-bordered">
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">React Select Dropdown</label>
									<div className="col-lg-8">
										<Select options={selectOptions} classNamePrefix="react-select" />
									</div>
								</div>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{code2}</Highlight>
						</div>
					</Panel>
					
					<Panel>
						<PanelHeader>
							Datepicker
						</PanelHeader>
						<PanelBody className="p-0">
							<form className="form-horizontal form-bordered">
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Default Datepicker</label>
									<div className="col-lg-8">
										<DatePicker selected={startDate} onChange={handleChange} className="form-control" />
									</div>
								</div>
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Inline Datepicker</label>
									<div className="col-lg-8">
										<DatePicker inline selected={startDate} onChange={handleChange} />
									</div>
								</div>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{code3}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>
							React Input Mask
						</PanelHeader>
						<PanelBody className="p-0">
							<form className="form-horizontal form-bordered">
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Date</label>
									<div className="col-lg-8">
										<InputMask mask="9999/99/99" className="form-control" placeholder="yyyy/mm/dd"></InputMask>
									</div>
								</div>
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Phone</label>
									<div className="col-lg-8">
										<InputMask mask="(999) 999-999" className="form-control" placeholder="(999) 999-9999"></InputMask>
									</div>
								</div>
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Tax ID</label>
									<div className="col-lg-8">
										<InputMask mask="99-999999" className="form-control" placeholder="99-9999999"></InputMask>
									</div>
								</div>
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Product Key</label>
									<div className="col-lg-8">
										<InputMask mask="a\*-999-a999" className="form-control" placeholder="a*-999-a999"></InputMask>
									</div>
								</div>
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">SSN</label>
									<div className="col-lg-8">
										<InputMask mask="999/99/9999" className="form-control" placeholder="999/99/9999"></InputMask>
									</div>
								</div>
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">SSN</label>
									<div className="col-lg-8">
										<InputMask mask="AAA-1111-A" className="form-control" placeholder="AAA-9999-A"></InputMask>
									</div>
								</div>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{code4}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>
							React Colorpicker
						</PanelHeader>
						<PanelBody className="p-0">
							<form className="form-horizontal form-bordered">
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Sketch Type Colorpicker</label>
									<div className="col-lg-8">
										<div className="input-group">
											<input type="text" className="form-control bg-white" readOnly value={sketchBackgroundColor} />
											<span className="input-group-text">
												<a href="#/" data-bs-toggle="dropdown" className="p-0 border-0">
													<i style={{width: '16px', height: '16px', display: 'block', background: sketchBackgroundColor}}></i>
												</a>
												<div className="dropdown-menu">
													<SketchPicker color={ sketchBackgroundColor } onChangeComplete={ handleSketchChangeComplete } />
												</div>
											</span>
										</div>
									</div>
								</div>
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Chrome Type Colorpicker</label>
									<div className="col-lg-8">
										<div className="input-group">
											<input type="text" className="form-control bg-white" readOnly value={chromeBackgroundColor} />
											<span className="input-group-text">
												<a href="#/" data-bs-toggle="dropdown" className="p-0 border-0">
													<i style={{width: '16px', height: '16px', display: 'block', background: chromeBackgroundColor}}></i>
												</a>
												<div className="dropdown-menu">
													<ChromePicker color={ chromeBackgroundColor } onChangeComplete={ handleChromeChangeComplete } />
												</div>
											</span>
										</div>
									</div>
								</div>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{code5}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>React Quill</PanelHeader>
						<PanelBody>
							<div className="pb-2px">
								<ReactQuill value={text} onChange={handleChange} className="h-200px mb-40px" />
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{code6}</Highlight>
						</div>
					</Panel>
					
					<Panel>
						<PanelHeader>
							React Tags Input
						</PanelHeader>
						<PanelBody className="p-0">
							<form className="form-horizontal form-bordered">
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Default Input Tag</label>
									<div className="col-lg-8">
										<ReactTags selected={tags} suggestions={suggestions} onDelete={handleDelete} onAdd={handleAdd} />
									</div>
								</div>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{code7}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
		</div>
	)
}

export default FormPlugins;