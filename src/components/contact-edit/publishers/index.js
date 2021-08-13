import React, { Component } from 'react';
import { Grid } from "@material-ui/core";
import api from '../../../services/api';

import PublisherForm from "../../forms/publisher-form";
import TagManagement from "../../tag-management";
import TagsField from "../../TagsField";

export default class PublisherEdit extends Component {
	constructor(props){
		super(props);
    this.state = {
			id: 0,
			publisher_name: "",
			general_name: "",
			general_email: "",
			general_phone: "",
			companyId: this.props.companyId,
			allTags: this.props.allTags,
			publishers: this.props.publishers,
			selected: this.props.selected.type === "publisher" ? this.props.selected : {id: 0},
			publisherName: this.props.selected.type === "publisher" ? this.props.selected.name || "" : "",

			action_collaborator_form: "",
			collaborator_id: 0,
			collaborator_name: "",
			collaborator_email: "",
			collaborator_office: [],
			collaborator_phone: "",
			clearTags: false,
			reloadTags: false,
			openManageTags: false,

			contact_update: {}
    }
	}

	componentDidMount() {
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	handleSavePublisher = () => {
	}

	hendleDropdown = () => {
		this.setState({
			dropdown: this.state.dropdown ? false : true
		})
	}

	getPublishers = async () => {
		const allTags = this.state.allTags;

    try {
      const response = await api.get(`publishers`);
      const publishers = response?.data ?? [];

      await Promise.all(
        publishers.map(async (publisher) => {
          const collaboratorsRequest = await api.get(
            `publishers/${publisher.id}/employees`
          );

					const updatedList = collaboratorsRequest.data.map(item => {
						let officeTags = [];
						if(item.office_post) {
							officeTags = item.office_post.split(",").map( subitem => {
								return parseInt(subitem, 10);
							});
						}
						
						const tags = [];
						for(let i=0; i<=officeTags.length; i++) {
							for (let j = 0; j < allTags.length; j++) {
								if(officeTags[i] === allTags[j].id) {
									tags.push(allTags[j]);
								}
							}
						}
						
						item.tags = tags;
						return item;
					});

          publisher.collaborators = updatedList ?? [];

          return publisher.collaborators;
        })
      );

			this.setState({publishers});
      return publishers;
    } catch (error) {
      console.log(error);
    }
  };

	setPublishers = async () => {
		const newPublishers = await this.getPublishers();
		this.props.handlePublishers(await newPublishers);
		await this.props.setInitialPublishers(newPublishers);

	}

	setSelected = (item) => {
		this.closeFormCollaborator();

		if(item === 0) {
			this.setState({
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
	}

	// FUNCTIONS TO REMOVE CONTACTS FROM GROUPS -----------------------
	updateGroupShippings = async (contact, del) => {
		this.setState({contact_update: contact});
		try {
			const emails = await api.get(`group_shipping_emails?filter={"where": {"contact_id": ${contact.id}, "contact_type": "publisher_employee"}}`);

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

	// FUNCTIONS TO COLLABORRATORS ------------------------------------
	hendleDelete = async (id) => {
		try {
			await api.delete(`publishers/${this.state.selected.id}/employees/${id}`);

			this.updateGroupShippings({id}, true);
			const newPublishers = await this.getPublishers();
			this.props.handlePublishers(await newPublishers, {id:id, del: true});
			await this.props.setInitialPublishers(newPublishers);
			await this.closeFormCollaborator();
		} catch(error) {
			console.log(error);
		}
	}

	hendleCollaborator = async (e, id) => {
		e.preventDefault();

		const { collaborator_name, collaborator_email, collaborator_office, collaborator_phone } = this.state;

		if (!collaborator_name || !collaborator_email || !collaborator_office || !collaborator_phone) {
			//empty fills
			this.setState({ success_collaborator: "" });
			this.setState({ error_collaborator: "Fill in all fields" });
		} else {
			const tags = collaborator_office.toString();
			try {
				if(this.state.action_collaborator_form === "Add New Collaborator") {
					this.setState({ error_collaborator: "" });
					document.querySelector('[data-component="form"].collaborator-form .btn-save').classList.add("load");
					await api.post(`publishers/${this.state.selected.id}/employees`, { name: collaborator_name, email: collaborator_email, office_post:tags, phone: collaborator_phone });
					document.querySelector('[data-component="form"].collaborator-form .btn-save').classList.remove("load");
					this.setState({ success_collaborator: "Collaborator added successfully" });
				}
				else {
					document.querySelector('[data-component="form"].collaborator-form .btn-save').classList.add("load");
					await api.put(`publishers/${this.state.selected.id}/employees/${id}`, { name: collaborator_name, email: collaborator_email, office_post:tags, phone: collaborator_phone });
					document.querySelector('[data-component="form"].collaborator-form .btn-save').classList.remove("load");
					this.setState({ success_collaborator: "Collaborator updated successfully" });
				}

				await this.updateGroupShippings({id, name: collaborator_name, email: collaborator_email});
				const newPublishers = await this.getPublishers();
				this.props.handlePublishers(await newPublishers, {id: id, email: collaborator_email});
				// this.props.setMainPublishers(await newPublishers);
				await this.props.setInitialPublishers(newPublishers);
				await this.closeFormCollaborator();
			} catch (error) {
				console.log(error);
			}
		}
	}

	openFormCollaborator = (id, action) => {
		this.setState({
			success_collaborator: "",
			error_collaborator: "",
			clearTags: true
		});

		if(action === "edit") {
			const publisher = this.state.publishers.filter( item => {
				return item.id === this.state.selected.id;
			});

			const collaborator = publisher[0].collaborators.filter( item => {
				return item.id === id;
			})

			let tags = [];
			if(collaborator[0].office_post) {
				tags = collaborator[0].office_post.split(",").map( item => {
					return parseInt(item, 10);
				});
			}

			this.setState({
				action_collaborator_form: "Edit Collaborator",
				collaborator_id: collaborator[0].id,
				collaborator_name: collaborator[0].name,
				collaborator_email: collaborator[0].email,
				collaborator_office: tags,
				collaborator_phone: collaborator[0].phone
			});
		} else {
			this.setState({
				action_collaborator_form: "Add New Collaborator",
				collaborator_id: 0,
				collaborator_name: "",
				collaborator_email: "",
				collaborator_office: [],
				collaborator_phone: "",
				clearTags: true
			});
		}
	}
	
	closeFormCollaborator = () => {
		this.setState({
			action_collaborator_form: "",
			collaborator_id: 0,
			collaborator_name: "",
			collaborator_email: "",
			collaborator_office: [],
			collaborator_phone: "",
			clearTags: true
		});
	}

	render() {
		const state = this.state;

		let publisherForm;
		if(state.selected.id !== 0) {
			publisherForm =
				<div key={state.selected.id}>
					<PublisherForm
						id={state.selected.id}
						name={state.selected.name}
						contactName={state.selected.contact_name}
						email={state.selected.email}
						phone={state.selected.phone}
						finish={this.setPublishers}
					/>
				</div>
		} else {
			publisherForm =
				<PublisherForm
					id={0}
					name={""}
					contactName={""}
					email={""}
					finish={this.setPublishers}
				/>
		}

		//COLLABORRATOR FORM
		const hendleTagdSaved = (status) => {
			this.setState({
				clearTags: status
			})
		}

		const hendleOnChangeTags = (list) => {
			this.setState({
				collaborator_office: list
			});
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


		let newCollaborator;
		if(state.selected.id !== 0) {
			const currentPublisher = state.publishers.filter( item => {
				return item.id === state.selected.id;
			});

			//Button submit form collaborator
			let buttonSaveNewCollaborator;
			if(this.state.action_collaborator_form === "Add New Collaborator") {
				buttonSaveNewCollaborator = <button type="submit" className="btn blue-light btn-save">Add</button>
			} else if(this.state.action_collaborator_form === "Edit Collaborator") {
				buttonSaveNewCollaborator = <button type="submit"className="btn blue-light btn-save">Save</button>
			}
			
			let buttonCancelNewCollaborator;
			if(currentPublisher[0].collaborators.length > 0){
				buttonCancelNewCollaborator = <span className="btn grey btn-delete" onClick={() => this.closeFormCollaborator("new")}>Cancel</span>
			}

			let formCollaboratorMessage;
			if(this.state.success_collaborator) {
				formCollaboratorMessage =
					<div className="label col sm-12 md-12 lg-12 collaborator-form-message">
						<p className="text text-success">{this.state.success_collaborator}</p>
					</div>
			}

			if(this.state.error_collaborator) {
				formCollaboratorMessage =
					<div className="label col sm-12 md-12 lg-12 collaborator-form-message">
						<p className="text text-error">{this.state.error_collaborator}</p>
					</div>
			}

			//Form collaborator
			if(this.state.action_collaborator_form === "Add New Collaborator" || this.state.action_collaborator_form === "Edit Collaborator") {
				newCollaborator = 
					<div className="new-collaborator">
						<strong className="collaborators-title">{this.state.action_collaborator_form}</strong>

						<form className="row flex collaborator-form" data-component="form" onSubmit={(e) => this.hendleCollaborator(e, this.state.collaborator_id)}>
							<div className="label col sm-12 md-6 lg-6">
								<label htmlFor="collaborator_name">Collaborator name</label>
								<input
									autoComplete="collaborator_name"
									id="collaborator_name"
									name="collaborator_name"
									type="text"
									placeholder="Publisher collaborator name"
									value={this.state.collaborator_name}
									onChange={e => this.onChange(e)}
								/>
							</div>
							<div className="label col sm-12 md-6 lg-6">
								<label htmlFor="collaborator_email">Collaborator Email</label>
								<input
									id="collaborator_email"
									autoComplete="collaborator_email"
									name="collaborator_email"
									type="email"
									placeholder="Publisher collaborator email"
									value={this.state.collaborator_email}
									onChange={e => this.onChange(e)}
								/>
							</div>
							<div className="label col sm-12 md-6 lg-6">
								<TagsField
									allTags={this.state.allTags}
									updateTags={updateTags}
									reloadTags={this.state.reloadTags}
									reloadedTags={reloadedTags}
									clearTags={this.state.clearTags}
									contactId={this.state.collaborator_id}
									contactTags={this.state.collaborator_office}
									hendleTagdSaved={hendleTagdSaved}
									hendleOnChangeTags={hendleOnChangeTags}
									hendleOpenManageTags={hendleOpenManageTags}
								/>
							</div>
							<div className="label col sm-12 md-6 lg-6">
								<label htmlFor="collaborator_phone">Collaborator Phone number</label>
								<input
									autoComplete="collaborator_phone"
									id="collaborator_phone"
									name="collaborator_phone"
									type="tel"
									placeholder="Publisher collaborator phone"
									value={this.state.collaborator_phone}
									onChange={e => this.onChange(e)}
								/>
							</div>

							<div className="label col sm-12 md-12 lg-12 actions">
								{buttonCancelNewCollaborator}
								{buttonSaveNewCollaborator}
							</div>
							
							{formCollaboratorMessage}
						</form>
					</div>
			} else {
				newCollaborator = "";
			}
		}

		//Collaborator list
		let collaboratorList;
		if(state.selected.id !== 0) {
			const currentPublisher = state.publishers.filter( item => {
				return item.id === state.selected.id;
			});

			if(currentPublisher[0].collaborators.length){
				collaboratorList = 
					<div data-component="collaborators-list" className="collaborators">
						{/* <strong className="collaborators-title">Collaborators</strong> */}

						<div data-component="collaborators-table">
							<div className="collaborators-table-header">
								<div className="col-inverse flex align-center sm-4 md-4 lg-4">
									<strong className="body-title">Collaborators</strong>
								</div>
								<div className="col-inverse flex align-center sm-4 md-4 lg-3">
									<strong className="body-title">Emails</strong>
								</div>
								<div className="col-inverse flex align-center sm-8 md-6 lg-6 header-actions">
									<strong className="body-title">Action</strong>
								</div>
							</div>

							<div className="collaborators-table-body">
								{currentPublisher[0].collaborators.map(collaborator => (
									<div className="table-item" key={`collaborator-${collaborator.id}`}>
										<div className="col-inverse flex align-center sm-1 md-1 lg-4">
											<p className="body-text">{collaborator.name}</p>
										</div>
										<div className="col-inverse flex align-center sm-1 md-1 lg-12">
											<a className="body-text link" href={"mailto:"+collaborator.email}>{collaborator.email}</a>
										</div>
										<div className="col-inverse flex align-center sm-4 md-4 lg-3"></div>
										<div className="col-inverse flex align-center justfy-center sm-2 md-2 lg-6 body-actions">
											<button onClick={() => this.hendleDelete(collaborator.id)} className="btn grey btn-delete">delete</button>
											<button onClick={() => this.openFormCollaborator(collaborator.id, "edit")} className="btn grey btn-edit">edit</button>
										</div>
									</div>
								))}
							</div>
						</div>

						<button className="btn blue register-collaborator" onClick={() => this.openFormCollaborator("new")}>Register new collaborator</button>
					</div>
			} else {
				collaboratorList =
					<div data-component="collaborators-list" className="empty">
						<p className="text">This publisher doesn't have any contacts yet, add one via the button below</p>
						<button className="btn blue register-collaborator" onClick={() => this.openFormCollaborator("new")}>Register new collaborator</button>
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
					>New Publisher</button>

					<div className="scrollable-area">
						{state.publishers.map(item => (
							<button
								key={item.id}
								className={`btn btn-publisher ${item.id === state.selected.id ? "active" : ""}`}
								onClick={(e) => this.setSelected(item)}
							>{item.name}</button>
						))}
					</div>
				</Grid>

				<Grid item xs={10} className={`content`}>
					<div className="container gutter">
						{publisherForm}
						{collaboratorList}
						{newCollaborator}
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