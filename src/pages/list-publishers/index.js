import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import api from '../../services/api';
import { getUserType } from "../../services/auth";

//Componentes
import Header from '../../components/header';
import TitlePage from '../../components/title-page';
// import Search from '../../components/search';
// import Dropdown from '../../components/dropdown';

export default class ListPublishers extends Component {
	state = {
		search: "",
		order: "First",
		view: "10",
		Viewing: "1-1",
		page: 1,
		currentPos: 1,
		all_checked: "",
		publishers: [
		],
		publisher_checked: [
		],
		checkedItens: [],
		totalPublishers: "",
		totalPages: "",
		notAdmin: false,
		id_to_delete: "",
		modal_delete: "closed",
		modal_delete_selected: "closed"
	}

	componentDidMount() {
		//if page reloads without close any modal
		document.querySelector('body').classList.remove("no-scroll");

		if(getUserType() !== "admin") {
			this.setState({notAdmin: true});
		} else {
			const page = this.props.match.params.page;
			this.countPublishers(page, this.state.view);
		}
	}

	countPublishers = async(page, view) => {
		//makes publishers count
		//from the counting it does the division of pages
		//uploads publishers for the current page

		try {
			const countResponse = await api.get(`publishers/count`);
			this.setState({
				totalPublishers: countResponse.data.count,
				totalPages: Math.ceil(countResponse.data.count / view)
			});

			if(page > Math.ceil(countResponse.data.count / view)) {
				page = Math.ceil(countResponse.data.count / view);
				this.props.history.push(`/list-publishers/${page}`);
			}

			this.loadApiPublishers(view, page, this.state.totalPublishers, this.state.order);
		} catch(error) {
			console.log(error);
		}
	}

	loadApiPublishers = async(view, page, totalPublishers, order) => {
		//loads the publishers of the current page, taking into account the quantity displayed on that page and the display order

		const currentPos = (view * page) - view;
		let viewing = parseInt(currentPos) + parseInt(view);

		if(viewing > totalPublishers) {
			viewing = (parseInt(currentPos)+1) + "-" + totalPublishers
		} else if(totalPublishers > 0) {
			viewing = (parseInt(currentPos)+1) + "-" + viewing
		} else {
			viewing = 0 + "-" + 0
		}

		let filterOrder;
		if(order === "First")
			filterOrder = "filter[order]=id ASC";
		else if(order === "Latest")
			filterOrder = "filter[order]=id DESC";
		else if(order === "A-Z")
			filterOrder = "filter[order]=name ASC"
		else if(order === "Z-A")
			filterOrder = "filter[order]=name DESC"

		this.setState({ view, page, currentPos, viewing, order});

		try {
			const response = await api.get(`publishers/?filter[limit]=${view}&filter[skip]=${currentPos}&${filterOrder}`);
			this.setState({
				publishers: response.data
			});

			this.addCheckedItem();
		} catch(error) {
			console.log(error);
		}
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});

	}
	
	hendleSearch = async (e) => {
		e.preventDefault();

		// if(this.state.search !== "") {
		// 	try {
		// 		const response = await api.get(`publishers?filter[where][name]=${e.target.value}`);
		// 		console.log(response.data.lenght);
		// 		this.setState({
		// 			publishers: response.data,
		// 			totalPublishers: 1,
		// 			page: 1
		// 		});

		// 		this.props.history.push(`/list-publishers/1`);

		// 		this.addCheckedItem();
		// 	} catch(error) {
		// 		console.log(error);
		// 	}
		// } else {
		// 	this.countPublishers(this.state.view, this.state.page);
		// }
	}

	addCheckedItem = () => {
		const itensCopy = [];
		this.state.publishers.map(publisher => (
			itensCopy.push({id: publisher.id, checked: ""})
		));

		this.setState({
			publisher_checked: itensCopy
		})
	}
	
	checkItens = (item) => {
		this.setState({ checkedItens: [] });
		const itensCopy = [];

		const el = this;

		this.state.publisher_checked.forEach(function (checked_item) {
			if(item === "all") {
				if(el.state.all_checked === "checked"){
					el.setState({all_checked: ""});
					checked_item.checked = "";
				} else {
					el.setState({all_checked: "checked"});
					checked_item.checked = "checked";
				}
			} else {
				el.setState({all_checked: ""});

				if(checked_item.id === item){
					checked_item.checked = checked_item.checked === "" ? "checked" : "";
				}
			}

			if (checked_item.checked === "checked") {
				itensCopy.push({id: checked_item.id});
			}
		})

		this.setState({
			checkedItens: itensCopy
		})
	}

	modalDelete = (status, id) => {
		if(status === "yes") {
			document.querySelector('body').classList.remove("no-scroll");
			this.setState({modal_delete: "closed"});
			this.hendleDelete(this.state.id_to_delete);
		} else {
			this.setState({modal_delete: status});
			if(status === "opened") {
				this.setState({id_to_delete: id});
				document.querySelector('body').classList.add("no-scroll");
			} else {
				document.querySelector('body').classList.remove("no-scroll");
			}
		}
	}
	

	modalDeleteSelected = (status) => {
		this.setState({modal_delete_selected: status});
	}

	hendleDeleteSelected = () => {
		this.state.checkedItens.map(async (item) => {
			try {
				await api.delete(`publishers/${item.id}`);
			} catch {
				console.log('Error');
			}
			
			this.setState({all_checked: ""});
			this.countPublishers(this.state.page, this.state.view);
		})

		this.setState({modal_delete_selected: "closed"});
	}

	hendleDelete = async (id) => {
		
		try {
			await api.delete(`publishers/${id}`);
			await this.deleteGroupShippings({id: id}, true);
			await this.countPublishers(this.state.page, this.state.view);
		} catch {
			console.log('Error');
		}
	}


	// ----------------------------------------------------------------
	// FUNCTIONS TO REMOVE CONTACTS FROM GROUPS -----------------------
	// ----------------------------------------------------------------
	deleteGroupShippings = async (contact) => {
		try {
			const groups = await api.get(`group_shippings?filter={"where": {"refer_id": ${contact.id}, "contact_type": "publisher_employee"}}`);

			const deletedGroups = await groups.data.map(this.deleteGroups);
			const deletedGroupsList = await Promise.all(deletedGroups);
			return true;
		} catch (error) {
			console.log(error)
		}
	}

	deleteGroups = async (group) => {
		const groupShippingRequest = await api.delete(`group_shippings/${group.id}`);
		return groupShippingRequest;
	}

	render() {
		// redirect  if not admin user
		if(this.state.notAdmin) {
			return <Redirect to='/projects' />
		}

		//Publishers
		let { publishers } = this.state;

		//Check itens
		/* eslint-disable */
		const publisher_checked = this.state.publisher_checked;
		function Check(props) {
			const bt = publisher_checked.map((item) => {
				if(item.id === props.id) {
					return <button key={item.id} className={`check ${item.checked}`} onClick={props.onClick}></button>
				}
			});

			return bt;
		}

		//Pagination
		const totalPublishers = this.state.totalPublishers;
		const totalPages = this.state.totalPages;
		const currentPage = this.state.page;
		let listPages = [];
		if((currentPage > 0 && currentPage < 3)) {
			for (var a = 1; a <= totalPages; a++) {
				if(a < 6)
				listPages.push(a);
			};
		} else if(currentPage <= 0) {
			listPages.push(0);
		} else {
			if(currentPage <= totalPages-2) {
				if (currentPage-2 > 0)
					listPages.push(currentPage-2);
					listPages.push(currentPage-1);
					listPages.push(currentPage);
					listPages.push(currentPage+1);
					listPages.push(currentPage+2);
			} else if(currentPage <= totalPages-1) {
				if (currentPage-3 > 0)
					listPages.push(currentPage-3);
					listPages.push(currentPage-2);
					listPages.push(currentPage-1);
					listPages.push(currentPage);
					listPages.push(currentPage+1);
			} else if(currentPage <= totalPages) {
				if (currentPage-4 > 0)
					listPages.push(currentPage-4);
				if (currentPage-3 > 0)
					listPages.push(currentPage-3);
					listPages.push(currentPage-2);
					listPages.push(currentPage-1);
					listPages.push(currentPage);
			}
		}

		return (
			<div data-page="list-publishers">
				<Header />

				<TitlePage title="Publisher list"/>

				<div className="container-fluid" data-component="page-list-content">
					<div className="container">

						<div data-component="content-list-header">
							<div className="row">
								<div className="actions">
									<Link to="/publisher/0" className="btn blue">New Publisher</Link>

									<div data-component="dropdown">
										<p className="dropdown-text"> Order: {this.state.order} </p>
										<div className="dropdown-submenu">
											<button className="link" onClick={() => this.loadApiPublishers(this.state.view, this.state.page, totalPublishers, "First")}>View First Records</button>
											<button className="link" onClick={() => this.loadApiPublishers(this.state.view, this.state.page, totalPublishers, "Latest")}>View Latest Records</button>
											<button className="link" onClick={() => this.loadApiPublishers(this.state.view, this.state.page, totalPublishers, "A-Z")}>View A-Z</button>
											<button className="link" onClick={() => this.loadApiPublishers(this.state.view, this.state.page, totalPublishers, "Z-A")}>View Z-A</button>
										</div>
									</div>

									<div data-component="dropdown">
										<p className="dropdown-text"> Viewing: {this.state.view} </p>
										<div className="dropdown-submenu">
											<button className="link" onClick={() => this.countPublishers(this.state.page, "10")}>View 10</button>
											<button className="link" onClick={() => this.countPublishers(this.state.page, "20")}>View 20</button>
											<button className="link" onClick={() => this.countPublishers(this.state.page, "50")}>View 50</button>
											<button className="link" onClick={() => this.countPublishers(this.state.page, "100")}>View 100</button>
										</div>
									</div>
								</div>

								<div className="search">
									{/* <Search onSubmit={e => this.hendleSearch(e)} placeholder="Search by position or company" value={this.state.value} onChange={e => this.onChange(e)}/> */}
								</div>
							</div>

							<div className="row">
								<p className="text">Displaying results {this.state.viewing} of {totalPublishers} total</p>
							</div>
						</div>

						<div data-component="content-list-body">
							<div className="list-body-header">
								<div className="desktop">
									<div className="col-inverse flex align-center sm-3 md-3 lg-4">
										<button className={`check ${this.state.all_checked}`} onClick={() => this.checkItens("all")}></button>
										<strong className="body-title">Name</strong>
									</div>
									<div className="col-inverse flex align-center sm-3 md-3 lg-4">
										<strong className="body-title">Email</strong>
									</div>
									<div className="col-inverse flex align-center sm-4 md-4 lg-6">
										<strong className="body-title">Contact Name</strong>
									</div>
									<div className="col-inverse flex align-center sm-4 md-4 lg-6">
										<strong className="body-title">Phone</strong>
									</div>
									<div className="col-inverse flex align-center sm-12 md-12 lg-11 header-actions">
										<strong className="body-title">Action</strong>
									</div>
								</div>

								<div className="mobile">
									<button onClick={(e) => this.modalDeleteSelected("opened")} className="btn with-icon">
										<svg height="427pt" viewBox="-40 0 427 427.001" width="427pt" xmlns="http://www.w3.org/2000/svg"><path d="M232.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0M114.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0"/><path d="M28.398 127.121V373.5c0 14.563 5.34 28.238 14.668 38.05A49.246 49.246 0 0078.796 427H268a49.233 49.233 0 0035.73-15.45c9.329-9.812 14.668-23.487 14.668-38.05V127.121c18.543-4.922 30.559-22.836 28.079-41.863-2.485-19.024-18.692-33.254-37.88-33.258h-51.199V39.5a39.289 39.289 0 00-11.539-28.031A39.288 39.288 0 00217.797 0H129a39.288 39.288 0 00-28.063 11.469A39.289 39.289 0 0089.398 39.5V52H38.2C19.012 52.004 2.805 66.234.32 85.258c-2.48 19.027 9.535 36.941 28.078 41.863zM268 407H78.797c-17.098 0-30.399-14.688-30.399-33.5V128h250v245.5c0 18.813-13.3 33.5-30.398 33.5zM109.398 39.5a19.25 19.25 0 015.676-13.895A19.26 19.26 0 01129 20h88.797a19.26 19.26 0 0113.926 5.605 19.244 19.244 0 015.675 13.895V52h-128zM38.2 72h270.399c9.941 0 18 8.059 18 18s-8.059 18-18 18H38.199c-9.941 0-18-8.059-18-18s8.059-18 18-18zm0 0"/><path d="M173.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0"/></svg>
										<p className="text">Delete Selected</p>
									</button>

									<button className={`check check-all ${this.state.all_checked}`} onClick={() => this.checkItens("all")}>Select All</button>
								</div>
							</div>

							<div className="list-body-content">
								{publishers.map(publisher => (
									<div className="list-item" key={publisher.id}>
										<div className="col-inverse flex align-center sm-1 md-1 lg-4 body-name">
											<Check id={publisher.id} onClick={() => this.checkItens(publisher.id)}/>
											<p className="body-text name">{publisher.name}</p>
										</div>
										<div className="col-inverse flex align-center sm-1 md-1 lg-4 body-email name">
											<a className="body-text link" href={"mailto:"+publisher.email}>{publisher.email}</a>
										</div>
										<div className="col-inverse flex align-center sm-1 md-1 lg-6 body-phone">
											<p className="body-text"> {publisher.contact_name} </p>
										</div>
										<div className="col-inverse flex align-center sm-2 md-2 lg-6 body-phone">
											<a href={`tel:${publisher.phone}`} className="body-text tel"> {publisher.phone} </a>
										</div>
										<div className="col-inverse flex align-center justfy-center sm-2 md-2 lg-11 body-actions">
											<Link to={`/publisher/${publisher.id}`} className="btn-icon">
												<svg height="401pt" viewBox="0 -1 401.523 401" width="401pt" xmlns="http://www.w3.org/2000/svg"><path d="M370.59 250.973c-5.524 0-10 4.476-10 10v88.789c-.02 16.562-13.438 29.984-30 30H50c-16.563-.016-29.98-13.438-30-30V89.172c.02-16.559 13.438-29.98 30-30h88.79c5.523 0 10-4.477 10-10 0-5.52-4.477-10-10-10H50c-27.602.031-49.969 22.398-50 50v260.594c.031 27.601 22.398 49.968 50 50h280.59c27.601-.032 49.969-22.399 50-50v-88.793c0-5.524-4.477-10-10-10zm0 0"/><path d="M376.629 13.441c-17.574-17.574-46.067-17.574-63.64 0L134.581 191.848a9.997 9.997 0 00-2.566 4.402l-23.461 84.7a9.997 9.997 0 0012.304 12.308l84.7-23.465a9.997 9.997 0 004.402-2.566l178.402-178.41c17.547-17.587 17.547-46.055 0-63.641zM156.37 198.348L302.383 52.332l47.09 47.09-146.016 146.016zm-9.406 18.875l37.62 37.625-52.038 14.418zM374.223 74.676L363.617 85.28l-47.094-47.094 10.61-10.605c9.762-9.762 25.59-9.762 35.351 0l11.739 11.734c9.746 9.774 9.746 25.59 0 35.36zm0 0"/></svg>
											</Link>
											<button onClick={e => this.modalDelete('opened', publisher.id)} className="btn-icon">
												<svg height="427pt" viewBox="-40 0 427 427.001" width="427pt" xmlns="http://www.w3.org/2000/svg"><path d="M232.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0M114.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0"/><path d="M28.398 127.121V373.5c0 14.563 5.34 28.238 14.668 38.05A49.246 49.246 0 0078.796 427H268a49.233 49.233 0 0035.73-15.45c9.329-9.812 14.668-23.487 14.668-38.05V127.121c18.543-4.922 30.559-22.836 28.079-41.863-2.485-19.024-18.692-33.254-37.88-33.258h-51.199V39.5a39.289 39.289 0 00-11.539-28.031A39.288 39.288 0 00217.797 0H129a39.288 39.288 0 00-28.063 11.469A39.289 39.289 0 0089.398 39.5V52H38.2C19.012 52.004 2.805 66.234.32 85.258c-2.48 19.027 9.535 36.941 28.078 41.863zM268 407H78.797c-17.098 0-30.399-14.688-30.399-33.5V128h250v245.5c0 18.813-13.3 33.5-30.398 33.5zM109.398 39.5a19.25 19.25 0 015.676-13.895A19.26 19.26 0 01129 20h88.797a19.26 19.26 0 0113.926 5.605 19.244 19.244 0 015.675 13.895V52h-128zM38.2 72h270.399c9.941 0 18 8.059 18 18s-8.059 18-18 18H38.199c-9.941 0-18-8.059-18-18s8.059-18 18-18zm0 0"/><path d="M173.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0"/></svg>
											</button>
										</div>
									</div>
								))}
							</div>
						</div>

						<div data-component="content-list-footer">
							<button onClick={(e) => this.modalDeleteSelected("opened")} className="btn with-icon">
								<svg height="427pt" viewBox="-40 0 427 427.001" width="427pt" xmlns="http://www.w3.org/2000/svg"><path d="M232.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0M114.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0"/><path d="M28.398 127.121V373.5c0 14.563 5.34 28.238 14.668 38.05A49.246 49.246 0 0078.796 427H268a49.233 49.233 0 0035.73-15.45c9.329-9.812 14.668-23.487 14.668-38.05V127.121c18.543-4.922 30.559-22.836 28.079-41.863-2.485-19.024-18.692-33.254-37.88-33.258h-51.199V39.5a39.289 39.289 0 00-11.539-28.031A39.288 39.288 0 00217.797 0H129a39.288 39.288 0 00-28.063 11.469A39.289 39.289 0 0089.398 39.5V52H38.2C19.012 52.004 2.805 66.234.32 85.258c-2.48 19.027 9.535 36.941 28.078 41.863zM268 407H78.797c-17.098 0-30.399-14.688-30.399-33.5V128h250v245.5c0 18.813-13.3 33.5-30.398 33.5zM109.398 39.5a19.25 19.25 0 015.676-13.895A19.26 19.26 0 01129 20h88.797a19.26 19.26 0 0113.926 5.605 19.244 19.244 0 015.675 13.895V52h-128zM38.2 72h270.399c9.941 0 18 8.059 18 18s-8.059 18-18 18H38.199c-9.941 0-18-8.059-18-18s8.059-18 18-18zm0 0"/><path d="M173.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0"/></svg>
								<p className="text">Delete Selected</p>
							</button>

							<div data-component="pagination">
								<Link to="/list-publishers/1" className="link" onClick={() =>this.countPublishers(1, this.state.view)}>First page</Link>
								{listPages.map(page => (
									<Link to={`/list-publishers/${page}`} key={page} className={`link ${page} ${parseInt(page) === parseInt(currentPage) ? "active": ""}`} onClick={() =>this.countPublishers(page, this.state.view)}>{page}</Link>
								))}
								<Link to={`/list-publishers/${this.state.totalPages}`} className="link" onClick={() =>this.countPublishers(this.state.totalPages, this.state.view)}>Last page</Link>
							</div>
						</div>
					</div>
				</div>

				<div data-component="modal" className={`modal-cancel ${this.state.modal_delete}`}>
					<div className="content">
						<p className="text">If you continue to delete all collaborators registered for that publisher.<br /><b>Are you sure you want to delete this publisher?</b></p>
						<button onClick={(e) => this.modalDelete('closed')} className="btn grey">No</button>
						<button onClick={(e) => this.modalDelete('yes')} to="/projects" className="btn blue-light">Yes</button>
					</div>
				</div>

				<div data-component="modal" className={`modal-cancel ${this.state.modal_delete_selected}`}>
					<div className="content">
						<p className="text">If you continue to delete all registered employees for these publishers as well.<br /><b>Are you sure you want to delete the selected publishers?</b></p>
						<button onClick={(e) => this.modalDeleteSelected('closed')} className="btn grey">No</button>
						<button onClick={(e) => this.hendleDeleteSelected()} to="/projects" className="btn blue-light">Yes</button>
					</div>
				</div>
			</div>
		)
	};
}