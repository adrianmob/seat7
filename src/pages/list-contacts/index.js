import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import api from '../../services/api';
import { getUserType, getToken } from "../../services/auth";
// import { calculateLimitAndOffset, paginate } from 'paginate-info';
// import data from './data.js'

//Componentes
import Header from '../../components/header';
import TitlePage from '../../components/title-page';
// import Search from '../../components/search';
// import Paginaion from '../../components/pagination';
// import Dropdown from '../../components/dropdown';

export default class ListContacts extends Component {
	state = {
		search: "Company name",
		filter: "All Clients",
		view: "10",
		Viewing: "1-1",
		page: 1,
		currentPos: 1,
		clients: [],
		all_checked: "",
		clients_checked: [],
		checkedItens: [],
		totalUsers: 0,
		totalPages: 1,
		notAdmin: false,
		id_to_delete: "",
		modal_delete: "closed",
		modal_delete_selected: "closed" 
	}
	
	componentDidMount(props) {
		//if page reloads without close any modal
		document.querySelector('body').classList.remove("no-scroll");

		const page = this.props.match.params.page;
		// this.countUsers(page, this.state.view, this.state.filter);
	}

	countUsers = async(page, view, filter) => {
		try {
			const token = getToken();
			let countResponse;
			let active;
			
			if(filter === "All Clients"){
				countResponse = await api.get(`app_users/count?access_token=${token}`);
			} else {
				if(filter === "Active"){
					active = true;
				} else if(filter === "Inactive"){
					active = false;
				} else if(filter === "New Request"){
					active = null;
				}

				countResponse = await api.get(`app_users/count?where={"active":${active}}&access_token=${token}`);
			}

			this.setState({
				filter: filter,
				totalUsers: countResponse.data.count,
				totalPages: Math.ceil(countResponse.data.count / view)
			});

			if(page > Math.ceil(countResponse.data.count / view)) {
				page = Math.ceil(countResponse.data.count / view);
				this.props.history.push(`/list-users/${page}`);
				this.setState({page: page});
			}

			this.loadUsers(view, page, this.state.totalUsers);
		} catch(error) {
			console.log(error);
		}
	}
	
	loadUsers = async(view, page, totalusers) => {
		//loads the users of the current page, taking into account the quantity displayed on that page and the display fiter
		const token = getToken();
		let response;
		let active;

		const currentPos = (view * page) - view;
		let viewing = parseInt(currentPos) + parseInt(view);

		if(viewing > totalusers) {
			viewing = (parseInt(currentPos)+1) + "-" + totalusers
		} else {
			viewing = (parseInt(currentPos)+1) + "-" + viewing
		}

		this.setState({ view, page, currentPos, viewing});
		
		try {
			if(this.state.filter === "All Clients"){
				response = await api.get(`app_users/?filter[limit]=${view}&filter[skip]=${currentPos}&filter[include]=companies&access_token=${token}`);
			} else {
				if(this.state.filter === "Active"){
					active = true;
				} else if(this.state.filter === "Inactive"){
					active = false;
				} else if(this.state.filter === "New Request"){
					active = null;
				}
	
				let jsonFilter = {
					"limit": view,
					"skip": currentPos,
					"include": [
						"companies"
					],
					"where": {
						"active": active
					}
				}
				response = await api.get(`app_users?filter=${JSON.stringify(jsonFilter)}&access_token=${token}`);
			}

			this.setState({
				clients: response.data
			});

			this.addCheckedItem();
		} catch(error) {
			console.log(error);
		}
	}

	addCheckedItem = () => {
		const itensCopy = [];
		this.state.clients.map(client => (
			itensCopy.push({id: client.user_id, checked: ""})
		));

		this.setState({
			clients_checked: itensCopy
		})
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	hendleSearch = (e) => {
		e.preventDefault();
	}

	checkItens = (item) => {
		this.setState({ checkedItens: [] });
		const itensCopy = [];

		const el = this;

		this.state.clients_checked.forEach(function (checked_item) {
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
		console.log('teste');
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
		const token = getToken();
		this.state.checkedItens.map(async (item) => {
			try {
				await api.delete(`app_users/${item.id}?access_token=${token}`);
				await localStorage.removeItem("company_selected");
			} catch {
				console.log('Error');
			}

			this.setState({all_checked: ""});
			this.countUsers(this.state.page, this.state.view, this.state.filter);
		})

		this.setState({modal_delete_selected: "closed"});
	}

	hendleDelete = async (id) => {
		const token = getToken();
		try {
			await api.delete(`app_users/${id}?access_token=${token}`);
			await localStorage.removeItem("company_selected");
			this.countUsers(this.state.page, this.state.view, this.state.filter);
		} catch {
			console.log('Error');
		}
	}

	render() {
		// redirect  if not admin user
		if(this.state.notAdmin) {
			return <Redirect to='/projects' />
		}

		function Status(props) {
			if(props.status === true){
			 return <span className={`btn active`}> active </span>
			} else if(props.status === false) {
				return <span className={`btn inactive`}> inactive </span>
			} else {
				return <span className={`btn new-request`}> new request </span>
			}
		}

		/* eslint-disable */
		const clients_checked = this.state.clients_checked;
		function Check(props) {
			const bt = clients_checked.map((item) => {
				if(item.id === props.id) {
					return <button key={item.id} className={`check ${item.checked}`} onClick={props.onClick}></button>
				}
			});

			return bt;
		}

		//Pagination
		const totalUsers = this.state.totalUsers;
		const totalPages = this.state.totalPages;
		const currentPage = this.state.page;
		let listPages = [];
		if((currentPage > 0 && currentPage < 3)) {
			for (var a = 1; a <= totalPages; a++) {
				if(a < 6)
				listPages.push(a);
			};
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
		// let pagination = <Paginaion totalPages={this.state.clientInfo.totalPages} page={this.state.page} onClick={() => this.changeView(this.state.view, page)}/>;

		return (
			<div data-page="list-contacts">
				<Header />
				
				<TitlePage title="Contacts list"/>

				<div className="container-fluid" data-component="page-list-content">
					<div className="container">
						<div data-component="content-list-header">
							<div className="row">
								<div className="actions">
									<Link to="/create-contacts/0" className="btn blue">New Contacts</Link>

									<div data-component="dropdown">
										<p className="dropdown-text"> Viewing: {this.state.view} </p>
										<div className="dropdown-submenu">
											<button className="link" onClick={() => this.loadUsers("10", this.state.page, this.state.totalUsers)}>View 10</button>
											<button className="link" onClick={() => this.loadUsers("20", this.state.page, this.state.totalUsers)}>View 20</button>
											<button className="link" onClick={() => this.loadUsers("50", this.state.page, this.state.totalUsers)}>View 50</button>
											<button className="link" onClick={() => this.loadUsers("100", this.state.page, this.state.totalUsers)}>View 100</button>
										</div>
									</div>
								</div>

								{/* <div className="search">
									<Search onSubmit={e => this.hendleSearch(e)} placeholder="Search by company name or user name" value={this.state.value} onChange={e => this.onChange(e)}/>
								</div> */}
							</div>

							<div className="row">
								<p className="text">Displaying results {this.state.viewing} of {this.state.totalUsers} total</p>
							</div>
						</div>

						<div data-component="content-list-body">
							<div className="list-body-header">
								<div className="desktop">
									<div className="col-inverse flex align-center lg-4">
										<button className={`check ${this.state.all_checked}`} onClick={() => this.checkItens("all")}></button>
										<strong className="body-title">Name</strong>
									</div>
									<div className="col-inverse flex align-center lg-4">
										<strong className="body-title">Email</strong>
									</div>
									<div className="col-inverse flex align-center lg-4 header-actions">
										<strong className="body-title">Action</strong>
									</div>
								</div>

								<div className="mobile">
									<button onClick={() => this.modalDeleteSelected("opened")} className="btn with-icon">
										<svg height="427pt" viewBox="-40 0 427 427.001" width="427pt" xmlns="http://www.w3.org/2000/svg"><path d="M232.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0M114.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0"/><path d="M28.398 127.121V373.5c0 14.563 5.34 28.238 14.668 38.05A49.246 49.246 0 0078.796 427H268a49.233 49.233 0 0035.73-15.45c9.329-9.812 14.668-23.487 14.668-38.05V127.121c18.543-4.922 30.559-22.836 28.079-41.863-2.485-19.024-18.692-33.254-37.88-33.258h-51.199V39.5a39.289 39.289 0 00-11.539-28.031A39.288 39.288 0 00217.797 0H129a39.288 39.288 0 00-28.063 11.469A39.289 39.289 0 0089.398 39.5V52H38.2C19.012 52.004 2.805 66.234.32 85.258c-2.48 19.027 9.535 36.941 28.078 41.863zM268 407H78.797c-17.098 0-30.399-14.688-30.399-33.5V128h250v245.5c0 18.813-13.3 33.5-30.398 33.5zM109.398 39.5a19.25 19.25 0 015.676-13.895A19.26 19.26 0 01129 20h88.797a19.26 19.26 0 0113.926 5.605 19.244 19.244 0 015.675 13.895V52h-128zM38.2 72h270.399c9.941 0 18 8.059 18 18s-8.059 18-18 18H38.199c-9.941 0-18-8.059-18-18s8.059-18 18-18zm0 0"/><path d="M173.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0"/></svg>
										<p className="text">Delete Selected</p>
									</button>

									<button className={`check check-all ${this.state.all_checked}`} onClick={() => this.checkItens("all")}>Select All</button>
								</div>
							</div>

							<div className="list-body-content">
								{this.state.clients.map(client => (
									<div className="list-item" key={client.user_id}>
										<div className="col-inverse flex align-center sm-1 md-1 lg-4 body-name" data-title="Name:">
											<Check id={client.user_id} onClick={() => this.checkItens(client.user_id)}/>
											<p className="body-text name">{client.name}</p>
										</div>
										<div className="col-inverse flex align-center sm-1 md-1 lg-4 body-email" data-title="Email:">
											<a className="body-text link" href={"mailto:"+client.email}>{client.email}</a>
										</div>
										<div className="col-inverse flex align-center justfy-center sm-2 md-2 lg-11 body-actions" data-title="Actions:">
											<Link to={`/user/${client.user_id}`} className="btn-icon">
												<svg height="401pt" viewBox="0 -1 401.523 401" width="401pt" xmlns="http://www.w3.org/2000/svg"><path d="M370.59 250.973c-5.524 0-10 4.476-10 10v88.789c-.02 16.562-13.438 29.984-30 30H50c-16.563-.016-29.98-13.438-30-30V89.172c.02-16.559 13.438-29.98 30-30h88.79c5.523 0 10-4.477 10-10 0-5.52-4.477-10-10-10H50c-27.602.031-49.969 22.398-50 50v260.594c.031 27.601 22.398 49.968 50 50h280.59c27.601-.032 49.969-22.399 50-50v-88.793c0-5.524-4.477-10-10-10zm0 0"/><path d="M376.629 13.441c-17.574-17.574-46.067-17.574-63.64 0L134.581 191.848a9.997 9.997 0 00-2.566 4.402l-23.461 84.7a9.997 9.997 0 0012.304 12.308l84.7-23.465a9.997 9.997 0 004.402-2.566l178.402-178.41c17.547-17.587 17.547-46.055 0-63.641zM156.37 198.348L302.383 52.332l47.09 47.09-146.016 146.016zm-9.406 18.875l37.62 37.625-52.038 14.418zM374.223 74.676L363.617 85.28l-47.094-47.094 10.61-10.605c9.762-9.762 25.59-9.762 35.351 0l11.739 11.734c9.746 9.774 9.746 25.59 0 35.36zm0 0"/></svg>
											</Link>
											<button onClick={e => this.modalDelete('opened', client.user_id)} className="btn-icon">
												<svg height="427pt" viewBox="-40 0 427 427.001" width="427pt" xmlns="http://www.w3.org/2000/svg"><path d="M232.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0M114.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0"/><path d="M28.398 127.121V373.5c0 14.563 5.34 28.238 14.668 38.05A49.246 49.246 0 0078.796 427H268a49.233 49.233 0 0035.73-15.45c9.329-9.812 14.668-23.487 14.668-38.05V127.121c18.543-4.922 30.559-22.836 28.079-41.863-2.485-19.024-18.692-33.254-37.88-33.258h-51.199V39.5a39.289 39.289 0 00-11.539-28.031A39.288 39.288 0 00217.797 0H129a39.288 39.288 0 00-28.063 11.469A39.289 39.289 0 0089.398 39.5V52H38.2C19.012 52.004 2.805 66.234.32 85.258c-2.48 19.027 9.535 36.941 28.078 41.863zM268 407H78.797c-17.098 0-30.399-14.688-30.399-33.5V128h250v245.5c0 18.813-13.3 33.5-30.398 33.5zM109.398 39.5a19.25 19.25 0 015.676-13.895A19.26 19.26 0 01129 20h88.797a19.26 19.26 0 0113.926 5.605 19.244 19.244 0 015.675 13.895V52h-128zM38.2 72h270.399c9.941 0 18 8.059 18 18s-8.059 18-18 18H38.199c-9.941 0-18-8.059-18-18s8.059-18 18-18zm0 0"/><path d="M173.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0"/></svg>
											</button>
										</div>
									</div>
								))}
							</div>
						</div>

						<div data-component="content-list-footer">
							<button onClick={() => this.modalDeleteSelected("opened")} className="btn with-icon">
								<svg height="427pt" viewBox="-40 0 427 427.001" width="427pt" xmlns="http://www.w3.org/2000/svg"><path d="M232.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0M114.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0"/><path d="M28.398 127.121V373.5c0 14.563 5.34 28.238 14.668 38.05A49.246 49.246 0 0078.796 427H268a49.233 49.233 0 0035.73-15.45c9.329-9.812 14.668-23.487 14.668-38.05V127.121c18.543-4.922 30.559-22.836 28.079-41.863-2.485-19.024-18.692-33.254-37.88-33.258h-51.199V39.5a39.289 39.289 0 00-11.539-28.031A39.288 39.288 0 00217.797 0H129a39.288 39.288 0 00-28.063 11.469A39.289 39.289 0 0089.398 39.5V52H38.2C19.012 52.004 2.805 66.234.32 85.258c-2.48 19.027 9.535 36.941 28.078 41.863zM268 407H78.797c-17.098 0-30.399-14.688-30.399-33.5V128h250v245.5c0 18.813-13.3 33.5-30.398 33.5zM109.398 39.5a19.25 19.25 0 015.676-13.895A19.26 19.26 0 01129 20h88.797a19.26 19.26 0 0113.926 5.605 19.244 19.244 0 015.675 13.895V52h-128zM38.2 72h270.399c9.941 0 18 8.059 18 18s-8.059 18-18 18H38.199c-9.941 0-18-8.059-18-18s8.059-18 18-18zm0 0"/><path d="M173.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0"/></svg>
								<p className="text">Delete Selected</p>
							</button>

							<div data-component="pagination">
								<Link to="/list-users/1" className="link" onClick={() =>this.loadUsers(this.state.view, 1, totalUsers)}>First page</Link>
								{listPages.map(page => (
									<Link to={`/list-users/${page}`} key={page} className={`link ${page} ${parseInt(page) === parseInt(currentPage) ? "active": ""}`} onClick={() =>this.loadUsers(this.state.view, page, totalUsers)}>{page}</Link>
								))}
								<Link to={`/list-users/${this.state.totalPages}`} className="link" onClick={() =>this.loadUsers(this.state.view, this.state.totalPages, totalUsers)}>Last page</Link>
							</div>
						</div>
					</div>
				</div>

				<div data-component="modal" className={`modal-cancel ${this.state.modal_delete}`}>
					<div className="content">
						<p className="text">If you continue, you will also delete all projects that were created for this user.<br /><b>Are you sure you want to delete this user</b></p>
						<button onClick={(e) => this.modalDelete('closed')} className="btn grey">No</button>
						<button onClick={(e) => this.modalDelete('yes')} to="/projects" className="btn blue-light">Yes</button>
					</div>
				</div>

				<div data-component="modal" className={`modal-cancel ${this.state.modal_delete_selected}`}>
					<div className="content">
						<p className="text">If you continue to delete all projects that were created for these users as well.<br /><b>Are you sure you want to delete the selected users</b></p>
						<button onClick={(e) => this.modalDeleteSelected('closed')} className="btn grey">No</button>
						<button onClick={(e) => this.hendleDeleteSelected()} to="/projects" className="btn blue-light">Yes</button>
					</div>
				</div>
			</div>
		)
	};
}