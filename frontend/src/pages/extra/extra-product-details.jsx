import React, { useState, useCallback } from 'react';
import { ReactTags } from 'react-tag-autocomplete';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function ExtraProductDetails() {
  const [tagsSize, setTagsSize] = useState([
    { value: 1, label: 'XL' },
    { value: 2, label: 'S' }
  ]);
  const [tagsColor, setTagsColor] = useState([
    { value: 1, label: 'Black' }
  ]);
  const [tagsMaterial, setTagsMaterial] = useState([]);
  const [tagsAll, setTagsAll] = useState([
    { value: 1, label: 'Laptop' },
    { value: 1, label: 'Apple' }
  ]);
  const [text] = useState('');

  const handleDeleteTagsSize = (i) => {
    const newTagsSize = [...tagsSize];
    newTagsSize.splice(i, 1);
    setTagsSize(newTagsSize);
  };
  const handleAddTagsSize = useCallback((newTag) => {
		setTagsSize([...tagsSize, newTag])
	}, [tagsSize]);

  const handleDeleteTagsMaterial = (i) => {
    const newTagsMaterial = [...tagsMaterial];
    newTagsMaterial.splice(i, 1);
    setTagsMaterial(newTagsMaterial);
  };
  const handleAddTagsMaterial = useCallback((newTag) => {
		setTagsMaterial([...tagsMaterial, newTag])
	}, [tagsMaterial]);

  const handleDeleteTagsColor = (i) => {
    const newTagsColor = [...tagsColor];
    newTagsColor.splice(i, 1);
    setTagsColor(newTagsColor);
  };
  const handleAddTagsColor = useCallback((newTag) => {
		setTagsColor([...tagsColor, newTag])
	}, [tagsColor]);

  const handleDeleteTagsAll = (i) => {
    const newTagsAll = [...tagsAll];
    newTagsAll.splice(i, 1);
    setTagsAll(newTagsAll);
  };
  const handleAddTagsAll = useCallback((newTag) => {
		setTagsAll([...tagsAll, newTag])
	}, [tagsAll]);
  
  const handleChange = () => {
  	
  };

  return (
		<div>
			<div className="d-flex align-items-center mb-3">
				<div>
					<ol className="breadcrumb">
						<li className="breadcrumb-item"><a href="#/">Home</a></li>
						<li className="breadcrumb-item"><a href="#/">Extra</a></li>
						<li className="breadcrumb-item active"><i className="fa fa-arrow-back"></i> Product Details</li>
					</ol>
					<h1 className="page-header mb-0">Product Details</h1>
				</div>
			</div>
		
			<div className="row">
				<div className="col-xl-8">
					<div className="card border-0 mb-4">
						<div className="card-header h6 mb-0 bg-none p-3">
							<i className="fa fa-dolly fa-lg fa-fw text-dark text-opacity-50 me-1"></i> Product Information
						</div>
						<div className="card-body">
							<div className="mb-3">
								<label className="form-label">Title</label>
								<input type="text" className="form-control" name="title" placeholder="Product name" />
							</div>
							<div className="">
								<label className="form-label">Description</label>
								<div className="form-control p-0 overflow-hidden">
									<ReactQuill value={text} onChange={handleChange} className="border-0 h-200px mb-40px" />
								</div>
							</div>
						</div>
					</div>
					<div className="card border-0 mb-4">
						<div className="card-header h6 mb-0 bg-none p-3">
							<i className="fa fa-file-image fa-lg fa-fw text-dark text-opacity-50 me-1"></i> Media
						</div>
						<div className="card-body">
							<div id="dropzone">
								<form action="/upload" className="dropzone needsclick" id="demo-upload">
									<div className="dz-message needsclick">
										Drop files <b>here</b> or <b>click</b> to upload.<br />
										<span className="dz-note needsclick">
											(This is just a demo dropzone. Selected files are <strong>not</strong> actually uploaded.)
										</span>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div className="card border-0 mb-4">
						<div className="card-header h6 mb-0 bg-none p-3">
							<i className="fa fa-sitemap fa-lg fa-fw text-dark text-opacity-50 me-1"></i> Variants
						</div>
						<div className="card-body">
							<div className="alert alert-success">
								Add variants if this product comes in multiple versions, like different sizes or colors.
							</div>
							<div className="row mb-3 fw-bold text-dark">
								<div className="col-4">Option name</div>
								<div className="col-8">Option values</div>
							</div>
							<div className="row mb-3 gx-3">
								<div className="col-4"><input type="text" className="form-control" name="variant[0][name]" placeholder="e.g Size" defaultValue="Size" /></div>
								<div className="col-7">
									<ReactTags selected={tagsSize} allowNew={true}  onDelete={handleDeleteTagsSize.bind(this)} onAdd={handleAddTagsSize} />
								</div>
								<div className="col-1">
									<a href="#/" className="btn btn-default d-block"><i className="fa fa-trash"></i></a>
								</div>
							</div>
							<div className="row mb-3 gx-3">
								<div className="col-4"><input type="text" className="form-control" name="variant[1][name]" placeholder="e.g Color" defaultValue="Color" /></div>
								<div className="col-7">
									<ReactTags selected={tagsColor} allowNew={true}  onDelete={handleDeleteTagsColor.bind(this)} onAdd={handleAddTagsColor.bind(this)} />
								</div>
								<div className="col-1">
									<a href="#/" className="btn btn-default d-block"><i className="fa fa-trash"></i></a>
								</div>
							</div>
							<div className="row mb-3 gx-3">
								<div className="col-4"><input type="text" className="form-control" name="variant[1][name]" placeholder="e.g Color" defaultValue="Material" /></div>
								<div className="col-7">
									<ReactTags selected={tagsMaterial} allowNew={true} onDelete={handleDeleteTagsMaterial.bind(this)} onAdd={handleAddTagsMaterial.bind(this)} />
								</div>
								<div className="col-1">
									<a href="#/" className="btn btn-default d-block"><i className="fa fa-trash"></i></a>
								</div>
							</div>
							<p>Modify the variants to be created:</p>
							<table className="table fw-bold">
								<thead>
									<tr>
										<th width="1%"></th>
										<th>Variant</th>
										<th width="150px">SKU</th>
										<th width="150px">Price</th>
										<th width="75px">Quantity</th>
										<th width="150px"></th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className="align-middle">
											<div className="form-check">
												<input type="checkbox" name="variant[0][enabled]" id="variant_0_enabled" value="1" defaultChecked className="form-check-input" />
												<label className="form-check-label">&nbsp;</label>
											</div>
										</td>
										<td className="fs-13px align-middle">
											<span className="text-dark">XL</span>
											<span className="text-muted mx-1"> • </span>
											<span className="text-indigo">Black</span>
										</td>
										<td><input type="text" className="form-control" placeholder="#SKU000001" /></td>
										<td><input type="text" className="form-control" placeholder="0.00" /></td>
										<td><input type="text" className="form-control" placeholder="0" /></td>
										<td><a href="#/" className="btn btn-white d-block">Upload Image</a></td>
									</tr>
									<tr>
										<td className="align-middle">
											<div className="form-check">
												<input type="checkbox" name="variant[1][enabled]" id="variant_1_enabled" value="1" className="form-check-input" />
												<label className="form-check-label">&nbsp;</label>
											</div>
										</td>
										<td className="fs-13px align-middle">
											<span className="text-dark">S</span>
											<span className="text-muted mx-1"> • </span>
											<span className="text-indigo">Black</span>
										</td>
										<td><input type="text" className="form-control" placeholder="#SKU000001" /></td>
										<td><input type="text" className="form-control" placeholder="0.00" /></td>
										<td><input type="text" className="form-control" placeholder="0" /></td>
										<td><a href="#/" className="btn btn-white d-block">Upload Image</a></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<div className="card border-0 mb-4">
						<div className="card-header h6 mb-0 bg-none p-3">
							<i className="fa fa-shield-halved fa-lg fa-fw text-dark text-opacity-50 me-1"></i> Warranty
						</div>
						<div className="card-body">
							<div className="row">
								<div className="col-lg-6">
									<div className="mb-lg-0 mb-3">
										<label className="form-label">Warranty Type</label>
										<select className="form-select" name="warranty_type_id">
											<option>-- Select Warranty Type --</option>
											<option value="1">No Warranty</option>
											<option value="2">Local Supplier Warranty</option>
											<option value="3">Local Manufacturer Warranty</option>
											<option value="4">International Manufacturer Warranty</option>
										</select>
									</div>
								</div>
								<div className="col-lg-6">
									<div className="mb-lg-0 mb-3">
										<label className="form-label">Warranty Period</label>
										<select className="form-select" name="warranty_id">
											<option>-- Select Warranty Period --</option>
											<option value="1">1 Month</option>
											<option value="2">3 Months</option>
											<option value="3">6 Months</option>
											<option value="4">1 Year</option>
											<option value="5">2 Years</option>
											<option value="6">3 Years</option>
											<option value="7">4 Years</option>
											<option value="8">5 Years</option>
											<option value="9">6 Years</option>
											<option value="10">7 Years</option>
											<option value="11">8 Years</option>
											<option value="12">9 Years</option>
											<option value="13">10 Years</option>
										</select>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="card border-0 mb-4">
						<div className="card-header h6 mb-0 bg-none p-3">
							<i className="fa fa-box fa-lg fa-fw text-dark text-opacity-50 me-1"></i> Package Content
						</div>
						<div className="card-body">
							<div className="mb-3">
								<label className="form-label">What's in the box</label>
								<input type="text" className="form-control" name="package_content" />
							</div>
							<div className="row mb-n3">
								<div className="col-lg-6">
									<div className="mb-3">
										<label className="form-label">Weight</label>
										<input type="text" className="form-control" name="weight" placeholder="(kg)" />
									</div>
								</div>
								<div className="col-lg-6">
									<div className="form-group">
										<label className="form-label">Parcel Size</label>
										<div className="row">
											<div className="col-4">
												<div className="input-group">
													<span className="input-group-text">W</span>
													<input type="text" className="form-control" placeholder="(cm)" name="width" />
												</div>
											</div>
											<div className="col-4">
												<div className="input-group">
													<span className="input-group-text">L</span>
													<input type="text" className="form-control" placeholder="(cm)" name="length" />
												</div>
											</div>
											<div className="col-4">
												<div className="input-group">
													<span className="input-group-text">H</span>
													<input type="text" className="form-control" placeholder="(cm)" name="height" />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="card-body bg-light rounded-bottom">
							<div className="form-group mb-0">
								<label className="form-label">Shipping</label>
								<div className="shipping-container">
									<hr className="mt-2 mb-2" />
									<div className="row align-items-center">
										<div className="col-6 pt-1 pb-1">No shipping fee</div>
										<div className="col-6 d-flex align-items-center">
											<div className="form-check form-switch ms-auto">
												<input type="checkbox" className="form-check-input" id="shippingFree" name="shipping_free_enable" defaultChecked value="1" />
												<label className="form-check-label" htmlFor="shippingFree">&nbsp;</label>
											</div>
										</div>
									</div>
									<hr className="mt-2 mb-2" />
									<div className="row align-items-center">
										<div className="col-6 pt-1 pb-1">
											AliExpress
										</div>
										<div className="col-6 d-flex align-items-center">
											<div className="form-check form-switch ms-auto">
												<input type="checkbox" className="form-check-input" id="shippingAliExpress" name="shipping_enable" value="AliExpress" />
												<label className="form-check-label" htmlFor="shippingAliExpress">&nbsp;</label>
											</div>
										</div>
									</div>
									<hr className="mt-2 mb-2" />
									<div className="row align-items-center">
										<div className="col-6 pt-1 pb-1">
											SaleHoo
										</div>
										<div className="col-6 d-flex align-items-center">
											<div className="form-check form-switch ms-auto">
												<input type="checkbox" className="form-check-input" id="shippingSaleHoo" name="shipping_enable" value="SaleHoo" />
												<label className="form-check-label" htmlFor="shippingSaleHoo">&nbsp;</label>
											</div>
										</div>
									</div>
									<hr className="mt-2 mb-2" />
									<div className="row align-items-center">
										<div className="col-6 pt-1 pb-1">
											Megagoods
										</div>
										<div className="col-6 d-flex align-items-center">
											<div className="form-check form-switch ms-auto">
												<input type="checkbox" className="form-check-input" id="shippingMegagoods" name="shipping_enable" value="Megagoods" />
												<label className="form-check-label" htmlFor="shippingMegagoods">&nbsp;</label>
											</div>
										</div>
									</div>
									<hr className="mt-2 mb-2" />
									<div className="row align-items-center">
										<div className="col-6 pt-1 pb-1">
											Wholesale2B
										</div>
										<div className="col-6 d-flex align-items-center">
											<div className="form-check form-switch ms-auto">
												<input type="checkbox" className="form-check-input" id="shippingWholesale2B" name="shipping_enable" value="Wholesale2B" />
												<label className="form-check-label" htmlFor="shippingWholesale2B">&nbsp;</label>
											</div>
										</div>
									</div>
									<hr className="mt-2 mb-2" />
									<div className="row align-items-center">
										<div className="col-6 pt-1 pb-1">
											Sunrise Wholesale
										</div>
										<div className="col-6 d-flex align-items-center">
											<div className="form-check form-switch ms-auto">
												<input type="checkbox" className="form-check-input" id="shippingSunriseWholesale" name="shipping_enable" value="Sunrise Wholesale" />
												<label className="form-check-label" htmlFor="shippingSunriseWholesale">&nbsp;</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-4">
					<div className="card border-0 mb-4">
						<div className="card-header h6 mb-0 bg-none p-3 d-flex">
							<div className="flex-1">
								<div>Sales channels (2/3)</div>
							</div>
							<div><a href="#/" className="text-decoration-none text-gray-500">Manage</a></div>
						</div>
						<div className="card-body fw-bold">
							<div className="d-flex">
								<div className="flex-1 d-flex">
									<div className="me-2"><i className="fa fa-store fa-lg fa-fw text-dark text-opacity-50"></i></div>
									<div>Online Store</div>
									<span className="badge bg-primary bg-opacity-15 text-primary fw-bold fs-12px ms-auto me-2">2024-01-05</span>
								</div>
								<div className="w-50px text-center"><a href="#/" className="text-decoration-none"><i className="fa fa-lg fa-fw fa-calendar"></i></a></div>
							</div>
							<hr />
							<div className="d-flex">
								<div className="flex-1 d-flex">
									<div className="me-2"><i className="fab fa-shopify fa-lg fa-fw text-dark text-opacity-50"></i></div>
									<div>Shopify</div>
									<span className="badge bg-primary bg-opacity-15 text-primary fw-bold fs-12px ms-auto me-2">2024-01-05</span>
								</div>
								<div className="w-50px text-center"><a href="#/" className="text-decoration-none"><i className="fa fa-lg fa-fw fa-calendar"></i></a></div>
							</div>
							<hr />
							<div className="d-flex">
								<div className="flex-1 d-flex">
									<div className="me-2"><i className="fab fa-amazon fa-lg fa-fw text-dark text-opacity-50"></i></div>
									<div>
										<div>Amazon</div>
										<div className="d-flex mt-1 text-gray-600">
											<div><i className="fa fa-circle text-warning fs-6px d-block mt-2"></i></div>
											<div className="flex-1 ps-2">
												<div className="mb-2">
													Amazon is disconnected. Connect your Amazon Seller Central account to continue using this sales channel.
												</div>
												<a href="#/">Learn more</a>
											</div>
										</div>
									</div>
								</div>
								<div className="w-50px text-center"><a href="#/" className="text-decoration-none text-gray-500"><i className="fa fa-lg fa-fw fa-times"></i></a></div>
							</div>
						</div>
					</div>
					<div className="card border-0 mb-4">
						<div className="card-header h6 mb-0 bg-none p-3 d-flex">
							<div className="flex-1">
								<div>Organization</div>
							</div>
						</div>
						<div className="card-body fw-bold">
							<div className="mb-3">
								<label className="form-label">Product type</label>
								<div className="input-group">
									<input type="text" className="form-control" placeholder="Product type" />
									<button className="btn btn-white"><i className="fa fa-search"></i></button>
								</div>
							</div>
							<div className="mb-0">
								<label className="form-label">Vendor</label>
								<div className="input-group">
									<input type="text" className="form-control" placeholder="Apple store supplies" />
									<button className="btn btn-white"><i className="fa fa-search"></i></button>
								</div>
							</div>
						</div>
					</div>
					<div className="card border-0 mb-4">
						<div className="card-header h6 mb-0 bg-none p-3 d-flex">
							<div className="flex-1">
								<div>Collections</div>
							</div>
						</div>
						<div className="card-body">
							<div className="d-flex align-items-center position-relative fw-bold mb-2">
								<span className="position-absolute top-0 bottom-0 start-0 d-flex align-items-center px-10px"><i className="fa fa-search"></i></span>
								<input type="text" className="form-control ps-30px" placeholder="Search for collections" />
							</div>
							<p className="mb-0 fw-bold text-muted">
								<i className="fa fa-question-circle fa-fw"></i> Add this product to a collection so it's easy to find in your store.
							</p>
						</div>
					</div>
					<div className="card border-0 mb-4">
						<div className="card-header h6 mb-0 bg-none p-3 d-flex">
							<div className="flex-1">
								<div>Tags</div>
							</div>
						</div>
						<div className="card-body">
							<div className="fw-bold mb-3"><a href="#/">View all tags</a></div>
							<ReactTags selected={tagsAll} allowNew={true} onDelete={handleDeleteTagsAll} onAdd={handleAddTagsAll} />
						</div>
					</div>
				</div>
			</div>
	
		</div>
	)
}

export default ExtraProductDetails;