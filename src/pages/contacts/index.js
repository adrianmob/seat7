import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import api from '../../services/api';
import { getUserType, getToken, getUserId } from "../../services/auth";

import Header from '../../components/header';
import TitlePage from '../../components/title-page';
import TagsField from "../../components/TagsField";
import TagManagement from "../../components/tag-management";

export default class 	Contacts extends Component {
	state = {
		page: 1,
		user_type: "",
		contact_id: 0,
		category_name: "",
		contact_name: "",
		contact_email: "",
		contact_tags: [],
		company_list: [],
		company_id: 0,
		company_name: '',
		company_selected: 0,
		category_list: [],
		category_id: 0,
		category_name_field: '',
		category_selected: 0,
		contact_form: "insert",
		contact_list: [],
		contact_selected: 0,
		redirect: false,
		category_form: "closed",
		category_form_type: "",
		company_list_opened: false,
		category_list_opened: false,
		clearTags: false,
		allTags: [],
		reloadTags: false,
		openManageTags: false,

		contact_update: {}
	}

	componentDidMount () {
		const user_type  = getUserType();
		const page = this.props.match.params.page;
		const selectedCompany = localStorage.getItem("company_selected");
		const selectedCaegory = localStorage.getItem("categorie_selected");

		this.setState({
			user_type,
			page
		});

		
		if(user_type === "admin") {
			this.loadTags();
			this.loadCompanies(selectedCompany, selectedCaegory);
		} else {
			this.loadCompany(selectedCaegory);
		}
	}

	loadTags = async () => {
		try {
			const response = await api.get("tags");

			this.setState({
				allTags: response.data
			})
		} catch (error) {
			console.log(error);
		}
	}

	loadCompanies = async (selectedCompany, selectedCaegory) => {
		try {
			const response = await api.get(`app_users?filter[include]=companies`);
			const list = [];
			response.data.map(company => {
				if (company.active) {
					company.companies.map(companie => (
						list.push(companie)
					))
				}
			});

			if(selectedCompany === null)
				selectedCompany = 0;

			let selected_item = [];
			if(selectedCompany !== 0) {
				selected_item = list.filter( item =>{
					if(parseInt(item.id) === parseInt(selectedCompany)) {
						return item;
					}
				});
				selected_item = selected_item[0];
			} else {
				selected_item = list[0];
			}

			this.setState({
				company_list: list,
				company_id: selected_item.id,
				company_name: selected_item.name,
				company_selected: selected_item.id
			})

			this.loadCategories(selected_item.id, selectedCaegory);
		} catch(error) {
			localStorage.removeItem("company_selected");
			const selectedCompany = localStorage.getItem("company_selected");
			this.loadCompanies(selectedCompany);
			console.log(error);
		}
	}

	loadCompany = async (selectedCaegory) => {
		const token = getToken();
		const userId = getUserId();

		try {
			const response = await api.get(`app_users/${userId}?filter[include]=companies&access_token=${token}`);
			this.setState({
				company_id: response.data.companies[0].id,
				company_selected: response.data.companies[0].id
			})

			this.loadCategories(response.data.companies[0].id, selectedCaegory);
		} catch (error) {
			console.log(error);
		}
	}

	loadCategories = async (company_id, selectedCaegory) => {
		try {
			const response = await api.get(`companies/${company_id}/presses`);
			const list = response.data;

			if(list.length > 0) {
				if(selectedCaegory === null)
					selectedCaegory = 0;

				let selected_item = [];
				if(selectedCaegory !== 0) {
					selected_item = list.filter( item =>{
						if(parseInt(item.id) === parseInt(selectedCaegory)) {
							return item;
						}
					});
					selected_item = selected_item[0];
				} else {
					selected_item = list[0];
				}

				this.setState({
					category_list: list,
					category_id: selected_item.id,
					category_name: selected_item.name,
					category_selected: selected_item.id
				})
				
				this.setState({
					category_form: "closed",
					category_form_type: 'insert',
				});
				this.loadContacts(company_id, selected_item.id);
			} else {
				this.setState({category_form: "opened"});
			}
		} catch(error) {
			console.log(error);
		}
	}

	loadContacts = async (company_id, category_id) => {
		try {
			const response = await api.get(`companies/${company_id}/presses/${category_id}/contacts`);

			const updatedList = response.data.map(item => {
				let tags = [];
				if(item.tags) {
					tags = item.tags.split(",").map( subitem => {
						return parseInt(subitem, 10);
					});
				}

				item.tags = tags;
				return item;
			})

			this.setState({
				contact_list: updatedList
			})
		} catch(error) {
			console.log(error);
		}
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	openSelectionList = (selection) => {
		if(selection === "companies") {
			if(this.state.company_list_opened) {
				this.setState({company_list_opened: false})
			} else {
				this.setState({company_list_opened: true})
			}
		} else if(selection == "categories") {
			if(this.state.category_list_opened) {
				this.setState({category_list_opened: false})
			} else {
				this.setState({category_list_opened: true})
			}
		}
	}

	changeCompany = (id) => {
		let company_name = "";

		this.state.company_list.forEach(function (company) {
			if(company.id === id) {
				company_name = company.name;
			}
		});

		this.setState({
			company_selected: id,
			company_id: id,
			company_name: company_name,
			category_list: [],
			contact_list: [],
			category_id: 0,
			category_name: "",
			category_selected: 0,
			contact_form: "insert",
			contact_selected: 0,
			contact_name: "",
			contact_email: "",
			contact_tags: [],
			clearTags: true
		});

		localStorage.setItem("company_selected", id);
		localStorage.removeItem("categorie_selected");
		this.loadCategories(id, 0);
	}

	changeCategory = (id) => {
		let category_name = "";

		this.state.category_list.forEach(function (category) {
			if(category.id === id) {
				category_name = category.name;
			}
		});
		this.setState({
			category_selected: id,
			category_id: id,
			category_name: category_name,
			contact_form: "insert",
			contact_selected: 0,
			contact_name: "",
			contact_email: "",
			contact_tags: [],
			clearTags: true
		})

		localStorage.setItem("category_selected", id);
		this.loadContacts(this.state.company_selected, id);
	}

	formNewCategory = (status) => {
		this.setState({
			category_form: status,
			category_form_type: 'insert',
			category_name_field: ""
		});
	}

	editCategory = (id) => {
		this.setState({
			category_form: 'opened',
			category_form_type: 'edit',
			category_name_field: this.state.category_name
		});
	}

	deleteCategory =  async () => {
		const { company_id, category_id } = this.state;

		try {
			await api.delete(`companies/${company_id}/presses/${category_id}`);
			await this.updateGroupShippings({id_category: category_id}, true);

			this.setState({
				category_list: [],
				category_id: 0,
				category_name: "",
				category_selected: 0
			});
			this.formNewCategory('closed');
			this.loadCategories(company_id, 0);
		} catch (error) {
			console.log(error);			
		}
	}

	saveCategory = async (e) => {
		e.preventDefault();
		const { category_form_type, company_id, category_id, category_name_field } = this.state;
		let category_selected = this.state.category_selected;

		try {
			if(category_form_type === "edit") {
				await api.put(`companies/${company_id}/presses/${category_id}`, {
					'name': category_name_field
				});
				this.setState({
					category_name: category_name_field
				});
			} else {
				const response = await api.post(`companies/${company_id}/presses`, {
					'name': category_name_field
				});

				category_selected = response.data.id;
			}

			this.setState({category_name_field: ""});
			document.querySelector('#category_name_field').blur();
			this.formNewCategory('closed');
			this.loadCategories(company_id, category_selected);
		} catch (error) {
			console.log(error);
		}
	}

	saveContactData = async (e) => {
		e.preventDefault();

		const { contact_form, company_id, category_selected, contact_selected, contact_name, contact_email, contact_tags } = this.state;
		this.updateGroupShippings({id: contact_selected, name: contact_name, email: contact_email});
		
		// const tags = contact_tags.toString();

		if(contact_email && contact_name){
			try {
				let response;
				if(contact_form === "insert") {
					response = await api.post(`companies/${company_id}/presses/${category_selected}/contacts`, {
						"name": contact_name,
						"email": contact_email,
						"tags": contact_tags || [null]
					});
				} else if(contact_form === "edit") {
					response = await api.put(`companies/${company_id}/presses/${category_selected}/contacts/${contact_selected}`, {
						"name": contact_name,
						"email": contact_email,
						"tags": contact_tags || [null]
					});
				}
	
				let tempList = this.state.contact_list;
				let tags = [];
				if(response.data.tags) {
					tags = response.data.tags.split(",").map( item => {
						return parseInt(item, 10);
					});
				}
				response.data.tags = tags;

				if(contact_form === "insert") {
					tempList.push(response.data);
				} else {
					tempList = tempList.map(item=> {
						if(item.id === response.data.id) {
							item = response.data
						}

						return item;
					})
				}
	
				this.setState({
					contact_list: tempList,
					contact_form: "insert",
					contact_name: "",
					contact_email: "",
					contact_tags: [],
					clearTags: true
				});
	
	
				document.querySelector('#contact_name', '#contact_email').blur();
				//this.loadContacts(company_id, category_selected);
			} catch (error) {
				console.log(error);
			}
		} else {
			if(!contact_name && !contact_email)
				this.setState({error_contact: "fill in all fields"});
			else if(!contact_name)
				this.setState({error_contact: "fill in the name field"});
			else if(!contact_email)
				this.setState({error_contact: "fill in the email field"});
		}
	}

	editContact = async (contact_id) => {
		const contact_list = this.state.contact_list.filter( item => {
			return item.id ===  contact_id
		});

		this.setState({
			contact_form: "edit",
			contact_selected: contact_list[0].id,
			contact_name: contact_list[0].name,
			contact_email: contact_list[0].email,
			contact_tags: contact_list[0].tags,
			clearTags: true
		});

		document.querySelector('#contact_name').focus();
	}

	hendleDelete = async (contact_id) => {
		const { company_id, category_selected } = this.state;
		this.updateGroupShippings({id: contact_id}, true);

		try {
			await api.delete(`companies/${company_id}/presses/${category_selected}/contacts/${contact_id}`);
			this.setState({
				contact_form: "insert",
				contact_selected: 0,
				contact_name: "",
				contact_email: "",
				contact_tags: [],
				clearTags: true
			});

			this.loadContacts(company_id, category_selected);
		} catch(error) {
			console.log(error);
		}
	}

	
	// ----------------------------------------------------------------
	// FUNCTIONS TO REMOVE CONTACTS FROM GROUPS -----------------------
	// ----------------------------------------------------------------
	updateGroupShippings = async (contact, del) => {
		this.setState({contact_update: contact});
		try {
			if(contact.id_category) {
				const groups = await api.get(`group_shippings?filter={"where": {"refer_id": ${contact.id_category}, "contact_type": "press_contact"}}`);

				if(del) {
					const deletedGroups = await groups.data.map(this.deleteGroupShipping);
					const deletedGroupsList = await Promise.all(deletedGroups);
				}
			} else {
				const emails = await api.get(`group_shipping?filter={"where": {"contact_id": ${contact.id}, "contact_type": "press_contact"}}`);

				if(del) {
					const emailsRequest = await emails.data.map(this.deleteEmailsShipping);
					const tempEmailsList = await Promise.all(emailsRequest);
					
					const checkEmails = await emails.data.map(this.getEmailsShipping);
					const checkEmailsList = await Promise.all(checkEmails);
				} else {
					const emailsRequest = emails.data.map(this.updateEmailsShipping);
					const tempEmailsList = await Promise.all(emailsRequest);
					
					const groupShippingIDSTemp = await tempEmailsList.map( item => {
						return item.group_shipping_id
					});
					
					const groupShippingIDS = groupShippingIDSTemp.filter((current, i) => groupShippingIDSTemp.indexOf(current) === i);
					
					const groupsRequest = groupShippingIDS.map(this.getGroupShipping);
					const tempGroupsList = await Promise.all(groupsRequest);

					const groupsIDSTemp = await tempGroupsList.map( item => {
						return item.group_project_id
					});
					const groupsIDS = groupsIDSTemp.filter((current, i) => groupsIDSTemp.indexOf(current) === i);
					const presetsRequest = groupsIDS.map(this.getGroups);
					const tempPresetsList = await Promise.all(presetsRequest);

					const presetsIDSTemp = await tempPresetsList.filter( item => {
						if(item.list_id) {
							return item;
						}
					});

					const submissionUpdated = presetsIDSTemp.map(this.updateGroup);
					const submissionUpdatedList = await Promise.all(submissionUpdated);
				}
			}

			return true;
		} catch (error) {
			console.log(error)
		}
	}

	getEmailsShipping = async (emailsGroup) => {
		const emailsRequest = await api.get(`group_shipping_emails
			?filter={"where": {"group_shipping_id": ${emailsGroup.group_shipping_id}}}`);

		if(emailsRequest.data.length) {
			return emailsGroup;
		} else {
			await api.delete(`group_shippings/${emailsGroup.group_shipping_id}`);
			return null;
		}
	}

	deleteEmailsShipping = async (emailsGroup) => {
		const emailsRequest = await api.delete(`group_shipping_emails/${emailsGroup.id}`);
		return emailsGroup;
	}

	deleteGroupShipping = async (group) => {
		const groupShippingRequest = await api.delete(`group_shippings/${group.id}`);
		return groupShippingRequest;
	}

	updateEmailsShipping = async (emailsGroup) => {
		const contact_update = this.state.contact_update;

		const emailsRequest = await api.put(`group_shipping_emails/${emailsGroup.id}`, {
			"id": emailsGroup.id,
			"email": contact_update.email,
			"shipping_field": emailsGroup.shipping_field,
			"group_shipping_id": emailsGroup.group_shipping_id,
			"contact_id": contact_update.id,
			"name": contact_update.name,
			"contact_type": emailsGroup.contact_type
		});

		return emailsRequest.data;
	}

	getGroupShipping = async (id) => {
		const groupShippingRequest = await api.get(`group_shippings/${id}`);
		return groupShippingRequest.data;
	}
	
	getGroups = async (id) => {
		const groupRequest = await api.get(`group_projects/${id}`);
		return groupRequest.data;
	}
	
	updateGroup = async (group) => {
		const groupRequest = await api.put(`project_submission_lists/${group.list_id}/groups/${group.id}`, {
			"preset_name": group.preset_name,
			"list_id": group.list_id,
			"completed": true
		});
		return groupRequest.data;
	}

	render() {
		//Redirect to publisher edit page
		if (this.state.redirect) {
			return <Redirect to={`/projects`} />
		}

		let company_selection;
		if(this.state.user_type === "admin") {
			company_selection =
				<div className="selections">
					<div data-component="company-selection" className={`company-list-container ${this.state.company_list_opened === true ? "active" : ""}`} onClick={(e) => this.openSelectionList('companies')}>
						<p className="company-text"> {this.state.company_name} </p>

						<div className="company-list">
							{this.state.company_list.map(company => (
								<button className={`company-item ${this.state.company_id === company.id ? "active" : ''}`} key={`company-${company.id}`} onClick={e => this.changeCompany(company.id)}>
									{company.name}
								</button>
							))}
						</div>
					</div>
				</div>
			;
		}

		let category_selection;
		if(this.state.category_list.length > 0) {
			category_selection =
				<div className="selections">
					<div data-component="company-selection" className={`company-list-container ${this.state.category_list_opened === true ? "active" : ""}`} onClick={(e) => this.openSelectionList('categories')}>
						<p className="company-text"> {this.state.category_name} </p>

						<div className="company-list">
							{this.state.category_list.map(category => (
								<button className={`company-item ${this.state.category_id === category.id ? "active" : ''}`} key={`category-${category.id}`} onClick={e => this.changeCategory(category.id)}>
									{category.name}
								</button>
							))}
						</div>
					</div>
				</div>
			;
		} else {
			category_selection = '';
		}

		const updateTags = (list) => {
			this.setState({
				reloadTags: true,
				allTags: list
			})
		}
		
		const reloadedTags = (status) => {
			this.setState({
				reloadTags: status
			})
		}

		const hendleTagdSaved = (status) => {
			this.setState({
				clearTags: status
			})
		}

		const hendleOnChangeTags = (list) => {
			this.setState({
				contact_tags: list
			});
		}

		const hendleOpenManageTags = (e) => {
			e.preventDefault();

			if(this.state.openManageTags) {
				document.querySelector('body').classList.remove("no-scroll");
				this.setState({openManageTags: false});
			} else {
				document.querySelector('body').classList.add("no-scroll");
				this.setState({openManageTags: true});
			}
		}

		return (
			<div data-page="contacts">
				<Header/>

				<TitlePage title="Contacts"/>

				<div className="container-fluid" data-component="content-contact">
					<div className="container gutter">
						<div className="type-selection">
							{company_selection}
							{category_selection}

							<button className="btn new-category" onClick={() => this.formNewCategory('opened')}>Add new category</button>
							{ this.state.category_selected !== 0 &&
								<button className="btn edit-category" onClick={() => this.editCategory(this.state.category_selected)}>Edit category</button>
							}
						</div>

						{ this.state.category_form === "opened" &&
							<div className={`categorie-form-container`}>
								<p className="title">{this.state.category_form_type === "edit" ? "Edit Category" : "New Category"}</p>

								<form className="row flex categorie-form" data-component="form" onSubmit={(e) => this.saveCategory(e)}>
									<div className="label col sm-12 md-6 lg-6">
										<label htmlFor="generalName">Category name</label>
										<input
											autoComplete="off"
											name="category_name_field"
											id="category_name_field"
											type="text"
											placeholder="Enter a name for the new category"
											value={this.state.category_name_field}
											onChange={e => this.onChange(e)}
										/>
									</div>

									<div className="label col sm-12 md-12 lg-12 actions">
										<div onClick={() => this.formNewCategory('closed')} className="btn grey with-icon">
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.001 512.001"><path d="M284.286 256.002L506.143 34.144c7.811-7.811 7.811-20.475 0-28.285-7.811-7.81-20.475-7.811-28.285 0L256 227.717 34.143 5.859c-7.811-7.811-20.475-7.811-28.285 0-7.81 7.811-7.811 20.475 0 28.285l221.857 221.857L5.858 477.859c-7.811 7.811-7.811 20.475 0 28.285a19.938 19.938 0 0014.143 5.857 19.94 19.94 0 0014.143-5.857L256 284.287l221.857 221.857c3.905 3.905 9.024 5.857 14.143 5.857s10.237-1.952 14.143-5.857c7.811-7.811 7.811-20.475 0-28.285L284.286 256.002z"/></svg>
											<p className="text">Cancel</p>
										</div>
										<button type="submit" className="btn blue-light btn-save">
											{this.state.category_form_type === "edit" ? "Edit" : "Save"}
										</button>
										{this.state.category_form_type === "edit" &&
											<div onClick={() => this.deleteCategory(this.state.category_selected)} className="btn grey with-icon">
												<svg height="427pt" viewBox="-40 0 427 427.001" width="427pt" xmlns="http://www.w3.org/2000/svg"><path d="M232.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0M114.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0"/><path d="M28.398 127.121V373.5c0 14.563 5.34 28.238 14.668 38.05A49.246 49.246 0 0078.796 427H268a49.233 49.233 0 0035.73-15.45c9.329-9.812 14.668-23.487 14.668-38.05V127.121c18.543-4.922 30.559-22.836 28.079-41.863-2.485-19.024-18.692-33.254-37.88-33.258h-51.199V39.5a39.289 39.289 0 00-11.539-28.031A39.288 39.288 0 00217.797 0H129a39.288 39.288 0 00-28.063 11.469A39.289 39.289 0 0089.398 39.5V52H38.2C19.012 52.004 2.805 66.234.32 85.258c-2.48 19.027 9.535 36.941 28.078 41.863zM268 407H78.797c-17.098 0-30.399-14.688-30.399-33.5V128h250v245.5c0 18.813-13.3 33.5-30.398 33.5zM109.398 39.5a19.25 19.25 0 015.676-13.895A19.26 19.26 0 01129 20h88.797a19.26 19.26 0 0113.926 5.605 19.244 19.244 0 015.675 13.895V52h-128zM38.2 72h270.399c9.941 0 18 8.059 18 18s-8.059 18-18 18H38.199c-9.941 0-18-8.059-18-18s8.059-18 18-18zm0 0"/><path d="M173.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0"/></svg>
												<p className="text">Delete</p>
											</div>
										}
									</div>

									{this.state.success_publisher &&
										<div className="label col sm-12 md-12 lg-12">
											<p className="text text-success">{this.state.success_publisher}</p>
										</div>
									}

									{this.state.error_publisher &&
										<div className="label col sm-12 md-12 lg-12">
											<p className="text text-error">{this.state.error_publisher}</p>
										</div>
									}
								</form>
							</div>
						}

						{ this.state.category_selected !== 0 && (this.state.category_form_type !== "edit" && this.state.category_form !== "opened") &&
							<form className="row flex contacts-form" data-component="form" onSubmit={(e) => this.saveContactData(e)}>
								<div className="label col sm-12 md-12 lg-12">
									<p className="title">{ this.state.contact_form === "insert" ? "New Contact" : "Edit Contact"}</p>
								</div>

								<div className="label col sm-12 md-6 lg-6">
									<label htmlFor="contact_name">Contact name</label>
									<input
										autoComplete="off"
										id="contact_name"
										name="contact_name"
										type="text"
										placeholder="Contact name"
										value={this.state.contact_name}
										onChange={e => this.onChange(e)}
									/>
								</div>
								<div className="label col sm-12 md-6 lg-6">
									<label htmlFor="contact_email">Email</label>
									<input
										autoComplete="contact_email"
										id="contact_email"
										name="contact_email"
										type="email"
										placeholder="Contact email"
										value={this.state.contact_email}
										onChange={e => this.onChange(e)}
									/>
								</div>
								{ this.state.user_type === "admin"  &&
									<div className="label col sm-12 md-6 lg-6">
										<TagsField
											allTags={this.state.allTags}
											updateTags={updateTags}
											reloadTags={this.state.reloadTags}
											reloadedTags={reloadedTags}
											clearTags={this.state.clearTags}
											contactId={this.state.contact_selected}
											contactTags={this.state.contact_tags}
											hendleTagdSaved={hendleTagdSaved}
											hendleOnChangeTags={hendleOnChangeTags}
											hendleOpenManageTags={hendleOpenManageTags}
										/>
									</div>
								}

								<div className="label col sm-12 md-12 lg-12 actions">
									<Link to="/projects" className="btn grey with-icon">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 407.436 407.436"><path d="M315.869 21.178L294.621 0 91.566 203.718l203.055 203.718 21.248-21.178-181.945-182.54z"/></svg>
										<p className="text">Cancel</p>
									</Link>
									<button type="submit" className="btn blue-light btn-save">
										{ this.state.contact_form === "insert" ? "Save" : "Save"}
									</button>
								</div>

								{this.state.success_contact &&
									<div className="label col sm-12 md-12 lg-12">
										<p className="text text-success">{this.state.success_contact}</p>
									</div>
								}

								{this.state.error_contact &&
									<div className="label col sm-12 md-12 lg-12">
										<p className="text text-error">{this.state.error_contact}</p>
									</div>
								}
							</form>
						}

						{ this.state.contact_list.length > 0 &&
							<div className="collaborators">
								<div data-component="collaborators-table">
									<div className="collaborators-table-header">
										<div className="col-inverse flex align-center sm-4 md-4 lg-4">
											<strong className="body-title">Contact name</strong>
										</div>
										<div className="col-inverse flex align-center sm-4 md-4 lg-4">
											<strong className="body-title">Email</strong>
										</div>
										<div className="col-inverse flex align-center sm-8 md-6 lg-6 header-actions">
											<strong className="body-title">Action</strong>
										</div>
									</div>

									<div className="collaborators-table-body">
										{this.state.contact_list.map(contact => (
											<div className="table-item" key={`contact-${contact.id}`}>
												<div className="col-inverse flex align-center sm-1 md-1 lg-4">
													<p className="body-text">{contact.name}</p>
												</div>
												<div className="col-inverse flex align-center sm-1 md-1 lg-4">
													<a className="body-text link" href={"mailto:"+contact.email}>{contact.email}</a>
												</div>
												<div className="col-inverse flex align-center justfy-center sm-2 md-2 lg-6 body-actions">
													<button onClick={() => this.hendleDelete(contact.id)} className="btn grey">delete</button>
													<button onClick={() => this.editContact(contact.id)} className="btn grey">edit</button>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						}
					</div>
				</div>

				{this.state.openManageTags &&
					<TagManagement
						allTags={this.state.allTags}
						hendleOpenManageTags={hendleOpenManageTags}
						updateTags={updateTags}
					/>
				}
			</div>
		)
	};
}