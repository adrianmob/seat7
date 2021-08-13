import React, { Component } from 'react';
import { Grid } from "@material-ui/core";
import api from '../../../services/api';

import TagManagement from "../../tag-management";
import TagsField from "../../TagsField";

export default class PressEdit extends Component {
	constructor(props){
		super(props);
    this.state = {
			user_type: this.props.user_type,
			companyId: this.props.companyId,
			allTags: this.props.allTags,
			categories: this.props.categories,
			selected: this.props.selected.type === "categories" ? this.props.selected : {id: 0},
			category_name_field: this.props.selected.type === "categories" ? this.props.selected.name || "" : "",
			success_category: "",
			error_category: "",

			contact_form: "",
			contact_selected: 0,
			contact_name: "",
			contact_email: "",
			contact_tags: [],

			clearTags: false,
			reloadTags: false,
			openManageTags: false
    }
	}

	componentDidMount() {
	}

	getCategories = async (companyId) => {
		const company_id = companyId ? companyId : this.state.companyId;
		const allTags = this.state.allTags;

    try {
      const response = await api.get(`companies/${company_id}/presses`);
      const categories = response?.data ?? [];

      await Promise.all(
        categories.map(async (category) => {
          const contactsRequest = await api.get(
            `companies/${company_id}/presses/${category.id}/contacts`
          );

					const updatedList = contactsRequest.data.map(item => {
						let contactTags = [];
						if(item.tags) {
							contactTags = item.tags.split(",").map( subitem => {
								return parseInt(subitem, 10);
							});
						}
						
						const tags = [];
						for(let i=0; i<=contactTags.length; i++) {
							for (let j = 0; j < allTags.length; j++) {
								if(contactTags[i] === allTags[j].id) {
									tags.push(allTags[j]);
								}
							}
						}
						
						item.tags = tags;
						return item;
					});

					category.contacts = updatedList || [];

          return category.contacts;
        })
      );

      const newCategories = categories.map((category) => {
        return {
          company_id: category.company_id,
          contact_name: category.name,
          name: category.name,
          email: "",
          id: category.id,
          collaborators: category.contacts,
          groups: [],
        };
      });

      this.setState({categories: newCategories});
			return newCategories;
    } catch (error) {
      console.log(error);
    }
  }

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	setSelected = (item) => {
		if(item === 0) {
			this.setState({
				category_name_field: "",
				selected: {
					id: 0,
					name: "",
					contact_name: "",
					email: "",
					phone: "",
					index: 0,
					type: ""
				}
			})
		} else {
			this.setState({
				category_name_field: item.name,
				selected: {
					id: item.id,
					name: item.name,
					contact_name: item.contact_name,
					email: item.email,
					phone: item.phone,
					index: 0,
					type: "publisher"
				}
			})
		}

		this.setState({
			contact_form: "",
			contact_selected: 0,
			contact_name: "",
			contact_email: "",
			contact_tags: [],
			clearTags: true
		})
	}

	saveCategory = async (e) => {
		e.preventDefault();
		const { selected, companyId, category_name_field } = this.state;

		this.setState({
			success_category: "",
			error_category: ""
		})

		if(category_name_field !== "") {
			try {
				document.querySelector('[data-component="form"].categorie-form .btn-save').classList.add("load");

				if(selected.id !== 0) {
					await api.put(`companies/${companyId}/presses/${selected.id}`, {
						'name': category_name_field
					});

					selected.name = category_name_field;
					this.setState({success_category: "Category updated successfully"})
				} else {
					const response = await api.post(`companies/${companyId}/presses`, {
						'name': category_name_field
					});

					selected.id = response.data.id;
					selected.name = category_name_field;
					this.setState({success_category: "Category successfully registered"});
				}
				this.setState({ selected: selected });

				this.reloadCategories(companyId);

				setTimeout(() => {
					this.setState({success_category: ""});
				}, 2000);
				document.querySelector('[data-component="form"].categorie-form .btn-save').classList.remove("load");
			} catch (error) {
				console.log(error);
			}
		} else {
			this.setState({error_category: "Fill in the category name"});

			setTimeout(() => {
				this.setState({error_category: ""});
			}, 2000);
		}
	}

	reloadCategories = async (companyId, contact) => {
		const newCategories = await this.getCategories(companyId);
		this.props.handleCategories(await newCategories, contact);
		await this.props.setInitialCategories(newCategories);
	}

	// FUNCTIONS TO REMOVE CONTACTS FROM GROUPS -----------------------
	updateGroupShippings = async (contact, del) => {
		this.setState({contact_update: contact});
		try {
			const emails = await api.get(`group_shipping_emails?filter={"where": {"contact_id": ${contact.id}, "contact_type": "press_contact"}}`);

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

	//Contacts funcsions ------------------------------------------------------------------------
	formCollaborator = (e, status) => {
		e.preventDefault();

		this.setState({
			contact_form: status,
			contact_selected: 0,
			contact_name: "",
			contact_email: "",
			contact_tags: [],
			clearTags: true
		});
	}

	editContact = async (contact_id) => {
		const currentCategory = this.state.categories.filter( item => {
			return item.id === this.state.selected.id;
		});

		const contact = currentCategory[0].collaborators.filter( item => {
			return item.id === contact_id
		});

		let tags = [];
		if(contact[0].tags) {
			contact[0].tags.map( item => {
				tags.push(item.id);
			});
		}

		this.setState({
			contact_form: "edit",
			contact_selected: contact[0].id,
			contact_name: contact[0].name,
			contact_email: contact[0].email,
			contact_tags: tags,
			clearTags: true
		});

		// document.querySelector('#contact_name').focus();
	}

	hendleDelete = async (contact_id) => {
		const { companyId, selected } = this.state;
		try {
			await api.delete(`companies/${companyId}/presses/${selected.id}/contacts/${contact_id}`);
			this.setState({
				contact_form: "",
				contact_selected: 0,
				contact_name: "",
				contact_email: "",
				contact_tags: [],
				clearTags: true
			});

			await this.updateGroupShippings({id: contact_id}, true);
			this.reloadCategories(companyId, {id: contact_id, del: true});
		} catch(error) {
			console.log(error);
		}
	}

	
	saveContactData = async (e) => {
		e.preventDefault();

		const { contact_form, companyId, selected, contact_selected, contact_name, contact_email, contact_tags } = this.state;

		if(contact_email && contact_name){
			try {
				let response;
				if(contact_form === "insert") {
					response = await api.post(`companies/${companyId}/presses/${selected.id}/contacts`, {
						"name": contact_name,
						"email": contact_email,
						"tags": contact_tags || [null]
					});
				} else if(contact_form === "edit") {
					response = await api.put(`companies/${companyId}/presses/${selected.id}/contacts/${contact_selected}`, {
						"name": contact_name,
						"email": contact_email,
						"tags": contact_tags || [null]
					});
				}
	
				this.setState({
					contact_form: "",
					contact_name: "",
					contact_email: "",
					contact_tags: [],
					clearTags: true
				});
	
				await this.updateGroupShippings({id: contact_selected, name: contact_name, email: contact_email});
				this.reloadCategories(companyId, {id:contact_selected, email: contact_email});
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

	render() {
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

		const updateTags = (list) => {
			this.setState({
				reloadTags: true,
				allTags: list
			})
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


		let collaboratorList;
		if(this.state.selected.id !== 0) {
			const currentCategory = this.state.categories.filter( item => {
				return item.id === this.state.selected.id;
			});

			if(currentCategory[0].collaborators.length){
				collaboratorList = 
					<div data-component="collaborators-list" className="collaborators">
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
								{currentCategory[0].collaborators.map(contact => (
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

						<button className="btn blue register-collaborator" onClick={(e) => this.formCollaborator(e, "insert")}>Register new contact</button>
					</div>
			} else {
				collaboratorList =
					<div data-component="collaborators-list" className="empty">
						<p className="text">This publisher doesn't have any contacts yet, add one via the button below</p>
						<button className="btn blue register-collaborator" onClick={(e) => this.formCollaborator(e, "insert")}>Register new contact</button>
					</div>
			}
		}

		return (
			<Grid container data-component="contacts-edit" className="contacts">
				<Grid item xs={2} className={`side-bar-list`}>
					<button className="btn blue-light with-icon btn-back" onClick={e => this.props.handleBack(false)}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.837 0 0 114.837 0 256s114.837 256 256 256 256-114.837 256-256S397.163 0 256 0zm57.749 347.584c8.341 8.341 8.341 21.824 0 30.165A21.275 21.275 0 01298.666 384a21.277 21.277 0 01-15.083-6.251L176.917 271.083c-8.341-8.341-8.341-21.824 0-30.165l106.667-106.667c8.341-8.341 21.824-8.341 30.165 0s8.341 21.824 0 30.165L222.165 256l91.584 91.584z"/></svg>
						<p className="text">List groups</p>
					</button>

					<button
						className="link"
						onClick={(e) => this.setSelected(0)}
					>New Category</button>

					<div className="scrollable-area">
						{this.state.categories.map(item => (
							<button
								key={item.id}
								className={`btn btn-publisher ${item.id === this.state.selected.id ? "active" : ""}`}
								onClick={(e) => this.setSelected(item)}
							>{item.name}</button>
						))}
					</div>
				</Grid>

				<Grid item xs={10} className={`content`}>
					<div className="container">
						<form className="row flex categorie-form" data-component="form" onSubmit={(e) => this.saveCategory(e)}>
							<div className="label col sm-12 md-12 lg-12">
								<label htmlFor="generalName">{this.state.selected.id === 0 ? "New Category:" : "Edit category:"}</label>
								<div className="categorie-form-field">
									<input
										autoComplete="off"
										name="category_name_field"
										id="category_name_field"
										type="text"
										placeholder="Category name"
										value={this.state.category_name_field}
										onChange={e => this.onChange(e)}
									/>

									<button type="submit" className="btn blue-light btn-save">
										{this.state.selected.id !== 0 ? "Update" : "Save"}
									</button>
								</div>
							</div>

							{this.state.success_category &&
								<div className="label col sm-12 md-12 lg-12">
									<p className="text text-success">{this.state.success_category}</p>
								</div>
							}

							{this.state.error_category &&
								<div className="label col sm-12 md-12 lg-12">
									<p className="text text-error">{this.state.error_category}</p>
								</div>
							}
						</form>

						{collaboratorList}

						{this.state.contact_form !== "" &&
							<div className="new-collaborator container gutter">
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
										<button onClick={(e) => this.formCollaborator(e, "")} className="btn grey">Cancel</button>
										<button type="submit" className="btn blue-light btn-save">
											{ this.state.contact_form === "insert" ? "Save" : "Update"}
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
							</div>
						}
					</div>
				</Grid>

				{this.state.openManageTags &&
					<TagManagement
						allTags={this.state.allTags}
						hendleOpenManageTags={hendleOpenManageTags}
						updateTags={updateTags}
					/>
				}
			</Grid>
		)
	};
}