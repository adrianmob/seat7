import React, { Component } from 'react';
import { getUserType } from "../../services/auth";
import { Link } from 'react-router-dom';
import api from '../../services/api';

import Header from '../../components/header';
import TitlePage from '../../components/title-page';
// import Search from '../../components/search';
import EmailPreview from '../../components/email-preview';


import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';

//images
import logoPartner from '../../assets/img/partner/fort-giants/logo-partner.png';

export default class project extends Component {
	state = {
		user_type: "",
		company_id: 0,
		project_id: 0,
		company_name: "",
		company_description: "",
		logo_src: "",
		project_title: "",
		banner_title: "",
		banner_description: "",
		banner_src: "",
		links: [],
		publishers: [],
		list_selections: [],
		new_list: false,
		checkedItens: [],
		contacts: [],
		messages: [],
		available_links: [],
		selected_list: 0,
		modal_publishers: "closed",
		modal_message: "closed",
		modal_unlock_files: "closed",
		modal_delete: "closed",
		modal_send: "closed",
		modal_submitted: "closed",
		modal_preview: 'closed',
		preview_subject: "",
		preview_message: "",
		default_message: "",
		subject: "",
		message: "",
		chat_modal: "closed",
		chat_message: "",
		render_update: false,
		submissionLists: [],
		selectedSubmissionList: null,
		selectedContacts: {},
		loading_lists: true,
		type_list: "publishers"
	}

	async componentDidMount() {
		//if page reloads without close any modal
		document.querySelector('body').classList.remove("no-scroll");

		const company_id = this.props.match.params.company_id;
		const project_id = this.props.match.params.project_id;
		
		await this.setState({ company_id, project_id });
		
		const currentUser = getUserType();
		if(currentUser === "admin") {
			await this.setState({user_type: "admin"});
			await this.loadPublishers(company_id, project_id);
			await this.loadCategories(company_id, project_id);
		} else {
			await this.setState({
				user_type: "normal",
				type_list: "categories"
			});
			await this.loadCategories(company_id, project_id);
		}

		await this.loadApiProject(company_id, project_id);
		await this.loadLists();
	}

	loadApiProject = async (company_id, project_id) => {
		try {
			const response = await api.get(`companies/${company_id}/projects/${project_id}`);
			const response2 = await api.get(`companies/${company_id}/projects/${project_id}/banner`);
			const response3 = await api.get(`companies/${company_id}/projects/${project_id}/files`);

			await this.setState({
				project_type: response.data.project_type,
				project_title: response.data.title, 
				company_name: response.data.company_name,
				company_description: response.data.company_description,
				banner_title: response2.data.title,
				banner_description: response2.data.description,
				links: response3.data,
			});

			if(response.data.logo_url) {
				this.setState({
					logo_src: 'https://seat7-uploads.s3.amazonaws.com/'+response.data.logo_url,
				})
			}

			if(response2.data.image_url) {
				this.setState({
					banner_src: 'https://seat7-uploads.s3.amazonaws.com/'+response2.data.image_url,
				})
			}
		} catch (error) {
			console.log(error);
		}
	}

	// ----------------------------------------------------
	// LOAD PUBLISHER LIST --------------------------------
	// ----------------------------------------------------
	loadPublishers = async (company_id, project_id) => {
		try {
			const response = await api.get(`publishers`);
			const publishers = response.data || []
			await this.loadCollaborators(publishers);

			return this.setState({
				publishers,
				checkedItens: []
			});
		} catch (error) {
			console.log(error);
		}
	}
    
	
	loadCollaborators = async (publishers) => {
		try {
			const collaboratorsPromises = publishers.map(this.loadPublisherCollaborators)
			return Promise.all(collaboratorsPromises);
		} catch (error) {
			console.log(error);
		}
	}
	
	loadPublisherCollaborators = async (publisher) => {
		const collaboratorsRequest = await api.get(`publishers/${publisher.id}/employees`)
		publisher.collaborators = collaboratorsRequest.data || []

		return publisher.collaborators
	}

	// ----------------------------------------------------
	// LOAD CONTACT LIST ----------------------------------
	// ----------------------------------------------------
	loadCategories = async (company_id) => {
		try {
			const response = await api.get(`companies/${company_id}/presses`);
			const categories = response.data || []
			await this.loadContacts(categories);

			const newCategories = categories.map(category => {
				const newCategory = {
					company_id: category.company_id,
					contact_name: category.name,
					name: category.name,
					email: "",
					id: category.id,
					collaborators: category.contacts
				}

				return newCategory;
			})

			return this.setState({
				categories: newCategories,
				checkedItens: []
			});
		} catch (error) {
			console.log(error);
		}
	}
	
	loadContacts = async (categories) => {
		try {
			const contactsPromises = categories.map(this.loadCategoriesContacts)
			return Promise.all(contactsPromises);
		} catch (error) {
			console.log(error);
		}
	}

	loadCategoriesContacts = async (category) => {
		const { company_id } = this.state;
		const contactsRequest = await api.get(`companies/${company_id}/presses/${category.id}/contacts`)
		category.contacts = contactsRequest.data || []

		return category.contacts
	}
	

	loadLists = async _ => {
		try {
			const {company_id, project_id} = this.state
			const responseList = await api.get(`/companies/${company_id}/projects/${project_id}/submission-lists`)

			const submissionLists = responseList.data || []
			const contactsPromises = submissionLists.map(this.loadSubmissionListContacts)
			let contacts = await Promise.all(contactsPromises);

			const tempList = await responseList.data.filter( item => {
				if(item.contacts.length > 0) {
					return item;
				}
			});

			await this.setState({
				submissionLists: tempList,
				contacts,
				loading_lists: false
			});
		} catch (error) {
			console.log(error);
		}
	}

	loadSubmissionListContacts = async (submissionList) => {
		const contactsRequest = await api.get(`/project_submission_lists/${submissionList.id}/contacts`)
		submissionList.contacts = contactsRequest.data || []

		return submissionList.contacts;
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	async setSelectedSubmissionList (selectedSubmissionList) {
		return this.setState({
			selectedSubmissionList
		})
	}

	// Functions to modal Publisher
	async modalPublishers (status, submissionList = null) {
		await this.setSelectedSubmissionList(submissionList || this.newSubmissionListObject())
		const {selectedSubmissionList} = this.state
		const {contacts} = selectedSubmissionList

		await this.setState({
			selectedContacts: []
		})

		for (const contact of contacts) {
			await this.toggleSelectContact(contact.contact_type, contact.contact_id, contact.contact_email, true)
		}

		this.setState({
			// new_list: id === 0 ? true : false,
			modal_publishers: status,
			// selected_list: id
		});
	}

	closePublishersModal () {
		document.querySelector('.modal-list-publishers .save-container .link').classList.remove("load");
		this.setState({
			modal_publishers: 'closed'
		})
	}

	async toggleSelectContact (contact_type, contact_id, contact_email, forceSelected = null) {
		const {selectedContacts} = this.state
		const contactKey = `${contact_type}-${contact_id}`
		const contact = selectedContacts[contactKey]
		const newCheckedState = forceSelected !== null ? forceSelected : !!contact === false

		if (!newCheckedState) {
			delete selectedContacts[contactKey]
		} else {
			selectedContacts[contactKey] = {
				contact_type,
				contact_id,
				contact_email
			}
		}

		await this.setState({
			selectedContacts
		})
	}

	toggleListType = (type) => {
		this.setState({ type_list: type })
	}

	async toggleAllPublisherContacts (publisher) {
		const allChecked = this.publisherAllContactsSelected(publisher)
		await this.toggleSelectContact('publisher', publisher.id, publisher.email, !allChecked)
		for (const collaborator of publisher.collaborators) {
			await this.toggleSelectContact('publisher_employee', collaborator.id, collaborator.email, !allChecked)
		}
	}

	publisherAllContactsSelected (publisher) {
		const {selectedContacts} = this.state
		const checkedPublisherCollaborators = publisher.collaborators.filter(
			collaborator => 
				!!selectedContacts[`publisher_employee-${collaborator.id}`]
			)
		const allChecked = checkedPublisherCollaborators.length === publisher.collaborators.length && !!selectedContacts[`publisher-${publisher.id}`]
		return allChecked
	}

	async toggleAllCategoryContacts (category) {
		const allChecked = this.categoryAllContactsSelected(category)
		for (const collaborator of category.collaborators) {
			await this.toggleSelectContact('press_contact', collaborator.id, collaborator.email, !allChecked)
		}
	}

	categoryAllContactsSelected (category) {
		const {selectedContacts} = this.state
		const checkedCategoryContacts = category.collaborators.filter(
			collaborator => 
				!!selectedContacts[`press_contact-${collaborator.id}`]
			)
		const allChecked = checkedCategoryContacts.length === category.collaborators.length
		return allChecked
	}

	async insertContact (submission_list_id, contact) {
		try {
			const response = await api.post(`/project_submission_lists/${submission_list_id}/contacts`, contact)
			return response.data
		} catch (error) {
			console.log(error);
		}
	}

	async removeContact (contact) {
		if (contact.id && contact.list_id) {
			try {
				const response = api.delete(`/project_submission_lists/${contact.list_id}/contacts/${contact.id}`)
				
				return response
			} catch (error) {
				console.log(error);
			}
		}
	}

    async saveListContacts () {
			document.querySelector('.modal-list-publishers .save-container .link').classList.add("load");
			let {selectedSubmissionList, selectedContacts} = this.state
			const contactsWithEmail = Object.values(selectedContacts).filter(contact => contact.contact_email)
			const contacts2Delete = selectedSubmissionList.contacts.filter(oldContact => !!selectedContacts[`${oldContact.contact_type}-${oldContact.contact_id}`] === false)
			const contacts2Insert = contactsWithEmail.filter(
				selectedContact => !!selectedSubmissionList.contacts.find(
					old => old.contact_id === selectedContact.contact_id && old.contact_type === selectedContact.contact_type
				) === false
			)

			if (!contacts2Insert.length && !contacts2Delete.length) {
				this.closePublishersModal()
				return;
			}
			
			if (selectedSubmissionList.id === 0) {
				selectedSubmissionList = await this.saveNewList()
			}

			const insertPromises = contacts2Insert.map(contact => this.insertContact(selectedSubmissionList.id, contact))
			const deletePromises = contacts2Delete.map(this.removeContact)

			await Promise.all([...insertPromises, ...deletePromises])
			await this.loadLists()
			this.closePublishersModal()
    }

	closeMessageModal () {
		document.querySelector('.modal-write-message .btn-save').classList.remove("load");

		this.setState({
			subject: "",
			message: "",
			modal_message: 'closed'
		})
	}

	modal_message (submissionList) {
		const {subject, message} = submissionList
		this.setSelectedSubmissionList(submissionList)
		// console.log(submissionList);

		let name;
		let temp_default_message = "";
		const contacts = submissionList.contacts.map(item => {
			return item;
		})

		console.log(contacts[0].contact_type);

		if(contacts.length > 1) {
			name = "!";
		} else {
			if(contacts[0].contact_type === "press_contact") {
				this.state.categories.map( category => {
					category.collaborators.map( collaborator => {
						if(collaborator.id === contacts[0].contact_id) {
							name = collaborator.name + "!"
						}
					})
				})
			} else if(contacts[0].contact_type === "publisher") {
				this.state.publishers.map( publisher => {
					if(publisher.id === contacts[0].contact_id) {
						name = publisher.contact_name + "!"
					}
				})
			} else if(contacts[0].contact_type === "publisher_employee") {
				this.state.publishers.map( publisher => {
					publisher.collaborators.map( collaborator => {
						if(collaborator.id === contacts[0].contact_id) {
							name = collaborator.name + "!"
						}
					})
				})
			}
		}

		if(this.state.project_type === "finished"){
			console.log('teste');
			console.log(name);
			temp_default_message = `<p>Hello ${name}<br><br><p>I am pleased to submit to you the materials of <strong>${this.state.project_title}</strong> in development by <strong>${this.state.company_name}</strong>. Below you will find the link to list of materials included</p>`
			this.setState({
				default_message: `<p>Hello ${name}<br><br><p>I am pleased to submit to you the materials of <strong>${this.state.project_title}</strong> in development by <strong>${this.state.company_name}</strong>. Below you will find the link to list of materials included</p>`
			});
		} else if(this.state.project_type === "production") {
			temp_default_message = `<p>Hello ${name}<br><br><p>I am pleased to submit to you the materials of <strong>${this.state.project_title}</strong> in development by <strong>${this.state.company_name}</strong>. Below you will find the link to list of materials included</p>`
			this.setState({
				default_message: `<p>Hello ${name}<br><br><p>I am pleased to submit to you the materials of <strong>${this.state.project_title}</strong> in development by <strong>${this.state.company_name}</strong>. Below you will find the link to list of materials included</p>`
			});
		}

		this.setState({
			modal_message: 'opened',
			subject: subject || '',
			message: message || temp_default_message,
		})
	}

	modal_preview (submissionList) {
		const {subject, message} = submissionList
		this.setSelectedSubmissionList(submissionList);

		this.setState({
			modal_preview: 'opened',
			preview_subject: subject || '',
			preview_message: message || '',
		})
	}

	closePreviewEmailModal () {
		this.setState({
			preview_subject: "",
			modal_preview: 'closed'
		})
	}

	
	async saveMessage (e, status) {
		e.preventDefault();
		document.querySelector('.modal-write-message .btn-save').classList.add("load");
		const {selectedSubmissionList, project_id, subject, default_message, message} = this.state
		try {
			await api.put(`/project_submission_lists/${selectedSubmissionList.id}`, {project_id, subject, message})

			await this.loadLists();
			this.closeMessageModal();
		} catch (err) {
			console.log(err);
		}
	}

    async loadSubmissionListFiles (submissionList) {
        try {
            const response = await api.get(`/project_submission_lists/${submissionList.id}/files`);
            submissionList.files = response.data || []
            return submissionList.files
        } catch (err) {
            console.log(err)
        }
    }

	closeUnlockFilesModal () {
		document.querySelector('.modal-unlock-files .save-container .link').classList.remove("load");
		this.setState({
			modal_unlock_files: 'closed'
		});
	}

	async modal_unlock_files (submissionList) {
		await this.setSelectedSubmissionList(submissionList)
		await this.loadSubmissionListFiles(submissionList)

		let {available_links} = this.state
		available_links = submissionList.files.map(listFile => listFile.file_id)

		this.setState({
			modal_unlock_files: 'opened',
			available_links
		});
	}

	avaliableLink (link, status) {
		//Change Array Selected itens
        const {available_links} = this.state
        const index = available_links.indexOf(link.id)
        if (index > -1) {
            delete available_links[index]
        }

        if (status) {
            available_links.push(link.id)
        }
        
		this.setState({
			available_links
		})
	}

	async saveNewList () {
		const { project_id } = this.state;
		try {
			const response = await api.post(`/project_submission_lists`, { project_id })

			return response.data
		} catch (error) {
			console.log(error);
		}
	}

    async insertFile (list_id, file_id) {
        try {
            return api.post(`/project_submission_lists/${list_id}/files`, {file_id})
        } catch (err) {
            console.log(err);
        }
    }

    async removeFile (listFile) {
        try {
            return api.delete(`/project_submission_lists/${listFile.list_id}/files/${listFile.id}`)
        } catch (err) {
            console.log(err);
        }
    }

	async saveAvaliableLinks () {
		document.querySelector('.modal-unlock-files .save-container .link').classList.add("load");
		const {available_links, selectedSubmissionList} = this.state;
		const _files2Remove = selectedSubmissionList.files.filter(listFile => !available_links.includes(listFile.file_id))
		const _files2Insert = available_links.filter(
			file_id => (!!selectedSubmissionList.files.find(listFile => listFile.file_id === file_id) === false)
		)

		const insertPromises = _files2Insert.map(file_id => this.insertFile(selectedSubmissionList.id, file_id))
		const deletePromises = _files2Remove.map(this.removeFile)
		const filesPromises = [...insertPromises, ...deletePromises]
		await Promise.all(filesPromises)
		this.closeUnlockFilesModal()
	}

	async deleteDataList (list_id) {
		try {
			return api.delete(`/project_submission_lists/${list_id}`);
		} catch (error) {
			console.log(error);
		}
	}

	//Functions to modal chat
	modal_chat (status) {
		this.setState({chat_modal: status});
	}

	//Functions to modal delete
	modalDelete (status, submissionList) {
    this.setSelectedSubmissionList(submissionList)
		this.setState({
			modal_delete: status
		});
	}

	modalconfirmSend (status) {
		this.setState({
			modal_send: status
		});
	}

	async deleteList (status) {
		const {selectedSubmissionList} = this.state
		this.setState({
			modal_delete: status
		})

		await this.deleteDataList(selectedSubmissionList.id)
		this.setSelectedSubmissionList(null)
		this.loadLists()
	}

	async sendSubmissionListEmail (submissionList) {
		try {
			return api.post(`/project_submission_lists/${submissionList.id}/send`)
		} catch (err) {
			console.log(err)
		}
	}

	//Functions to send the project
	async sendToPublishers () {
		document.querySelector('.project-content .actions .btn-send').classList.add("load");
		await Promise.all(this.state.submissionLists.map(this.sendSubmissionListEmail));
		await document.querySelector('.project-content .actions .btn-send').classList.remove("load");
		await this.setState({
			modal_send: "closed",
			modal_submitted: "opened"
		})
		setTimeout(() => {
			this.setState({
				modal_submitted: "closed"
			})
		}, 3000);
		return this.loadLists();
	}

	newSubmissionListObject () {
		return {
			id: 0,
			project_id: this.state.project_id,
			contacts: [],
		}
	}

	render() {
		const {state} = this
		const userType = this.state.user_type;

		let banner;
		if(this.state.banner_src) {
			banner = <img src={this.state.banner_src} alt={this.state.banner_title}/>
		} else {
			banner = <span className="without-banner">Without banner</span>
		}

		//Check itens list
		/* eslint-disable */
		function Check(props) {
			if(state.type_list === "publishers") {
				const {selectedContacts} = state
				const key = `${props.contact_type}-${props.contact_id}`
				let checked = !!selectedContacts[key] ? 'checked' : ''

				if (props.contact_type === 'publisher_all') {
					const publisher = state.publishers.find(publisher => publisher.id === props.contact_id)
					const checkedPublisherCollaborators = publisher.collaborators.filter(
						collaborator => 
							!!selectedContacts[`publisher_employee-${collaborator.id}`]
						)
					const allChecked = checkedPublisherCollaborators.length === publisher.collaborators.length && !!selectedContacts[`publisher-${publisher.id}`]
					checked = allChecked ? 'checked' : ''
				}

				const bt2 = <button className={`check ${checked}`} key={`${key}-btn`} onClick={props.onClick}>
					<p className="text">{props.label}</p>
				</button>

				return bt2;
			} else if(state.type_list === "categories") {
				const {selectedContacts} = state
				const key = `${props.contact_type}-${props.contact_id}`
				let checked = !!selectedContacts[key] ? 'checked' : ''

				if (props.contact_type === 'publisher_all') {
					const categories = state.categories.find(category => category.id === props.contact_id)
					const checkedPublisherCollaborators = categories.collaborators.filter(
						collaborator => 
							!!selectedContacts[`publisher_employee-${collaborator.id}`]
						)
					const allChecked = checkedPublisherCollaborators.length === categories.collaborators.length && !!selectedContacts[`publisher-${categories.id}`]
					checked = allChecked ? 'checked' : ''
				}

				const bt2 = <button className={`check ${checked}`} key={`${key}-btn`} onClick={props.onClick}>
					<p className="text">{props.label}</p>
				</button>

				return bt2;
			}
		}

		//Unlock files butons
		const availableLinks = this.state.available_links;
		function LinkAvaliable(props) {
			const {link, onClickAvaliable, onClickUnavaliable} = props
			const available =  availableLinks.includes(link.id)//!!selectedSubmissionList.files.find(listFile => listFile.file_id === link.id)
			const bts = <div className="link-col" key={link.id}>
				<button onClick={onClickAvaliable} className={`btn grey ${available ? "avaliable" : ""}`}>Avaliable</button>
				<button onClick={onClickUnavaliable} className={`btn grey ${!available ? "unavaliable" : ""}`}>Unavaliable</button>
			</div>
			return bts
		}

		//List of contacts selecteds of Publishers
		function ButtonPublisherList (props) {
			const {submissionList} = props
			if (!submissionList.contacts.length) {
				return null;
			}

			const typesNameResolver = {
				publisher: (contact) => {
					const publisher = state.publishers.find((publisher) => publisher.id === contact.contact_id)
					if (publisher) {
						return publisher.contact_name || publisher.name || ''
					}
				},
				publisher_employee: (contact) => {
					for (const publisher of state.publishers) {
						const employee = publisher.collaborators.find(collaborator => collaborator.id === contact.contact_id)
						if (employee) {
							return employee.name
						}
					}
					return ''
				},
				press_contact: (contact) => {
					for (const category of state.categories) {
						const employee = category.collaborators.find(collaborator => collaborator.id === contact.contact_id)
						if (employee) {
							return employee.name
						}
					}
				}
			}

			const contactsName = submissionList.contacts.map((contact) => {
				const name = typesNameResolver[contact.contact_type](contact)
				return name || ''
			})

			return <button className="link-col btn btn-publishers" key={submissionList.id} onClick={props.onClick}>
				{contactsName.join(', ')}
			</button>;
		}

		return (
			<div data-page="project">
				<Header />

				<TitlePage title="Project Manager"/>

				<div className="container-fluid" data-component="project-content">
					<div className="container">
						<div className="project-header row">
							<h1 className="title">{this.state.project_title}</h1>

							{/* <button className="btn btn-blue with-icon btn-chat" onClick={e => this.modal_chat('opened')}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M258.648 0C116.512 0 .883 100.323.883 223.632c0 86.175 53.419 163.746 137.122 200.704v70.009a17.659 17.659 0 0010.199 16.007 17.665 17.665 0 0018.815-2.495l72.321-60.81c5.826.218 11.941.218 17.543.218 140.182 0 254.234-100.323 254.234-223.632S397.859 0 258.648 0zm-1.765 411.954c-7.38 0-15.743 0-22.081-.518-4.649-.441-9.257 1.077-12.824 4.078l-48.669 40.919v-43.891c0-7.297-4.49-13.848-11.299-16.472-77.607-29.931-125.817-96.009-125.817-172.438 0-102.082 101.87-188.322 222.455-188.322 119.737 0 217.159 84.48 217.159 188.322s-98.204 188.322-218.924 188.322z"/><path d="M355.752 132.414H155.66c-9.752 0-17.655 7.904-17.655 17.655s7.904 17.655 17.655 17.655h200.092c9.752 0 17.655-7.904 17.655-17.655s-7.904-17.655-17.655-17.655zM355.752 203.034H155.66c-9.752 0-17.655 7.904-17.655 17.655 0 9.752 7.904 17.655 17.655 17.655h200.092c9.752 0 17.655-7.904 17.655-17.655 0-9.751-7.904-17.655-17.655-17.655zM355.752 273.655H155.66c-9.752 0-17.655 7.904-17.655 17.655 0 9.752 7.904 17.655 17.655 17.655h200.092c9.752 0 17.655-7.904 17.655-17.655 0-9.751-7.904-17.655-17.655-17.655z"/></svg>
								<p className="text">Chat</p>
							</button> */}

							<div className={`chat-modal ${this.state.chat_modal}`}>
								<div className="chat-container">
									<div className="chat-header">
										<p className="chat-name">Jhon Doe</p>
										<button onClick={e => this.modal_chat('closed')} className="btn btn-close"></button>
									</div>

									<div className="chat-content">
										<div className="message-received">
											<div className="profile-image">
												<img src={logoPartner} alt={`logo ${this.state.company_name}`}/>
											</div>

											<div className="message">
												<p className="text">Lorem ipsum dollor?</p>
												<span className="date">24/10/2020</span>
											</div>
										</div>

										<div className="message-sent">
											<div className="message">
												<span className="date">24/10/2020</span>
												<p className="text">Lorem ipsum dollor?</p>
											</div>
										</div>
									</div>

									<form className="chat-form">
										<input
											id="chat-message"
											name="chat_message"
											type="text"
											placeholder="Type your message here"
											value={this.state.chat_message}
											onChange={e => this.onChange(e)}
										/>

										<button className="btn blue btn-send">
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448.011 448.011"><path d="M438.731 209.463l-416-192c-6.624-3.008-14.528-1.216-19.136 4.48a15.911 15.911 0 00-.384 19.648l136.8 182.4-136.8 182.4c-4.416 5.856-4.256 13.984.352 19.648 3.104 3.872 7.744 5.952 12.448 5.952 2.272 0 4.544-.48 6.688-1.472l416-192c5.696-2.624 9.312-8.288 9.312-14.528s-3.616-11.904-9.28-14.528z"/></svg>
										</button>
									</form>
								</div>
							</div>
						</div>

						<div className={`project-banner row ${!this.state.banner_src ? "no-banner" : ""}`}>
							<div className="banner-image">
								{banner}

								<div className="banner-actions">
									<Link to={`/landing-page-preview/${this.state.company_id}/${this.state.project_id}`} className="btn-preview" title="Preview Project">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.999 511.999"><path d="M508.745 246.041c-4.574-6.257-113.557-153.206-252.748-153.206S7.818 239.784 3.249 246.035a16.896 16.896 0 000 19.923c4.569 6.257 113.557 153.206 252.748 153.206s248.174-146.95 252.748-153.201a16.875 16.875 0 000-19.922zM255.997 385.406c-102.529 0-191.33-97.533-217.617-129.418 26.253-31.913 114.868-129.395 217.617-129.395 102.524 0 191.319 97.516 217.617 129.418-26.253 31.912-114.868 129.395-217.617 129.395z"/><path d="M255.997 154.725c-55.842 0-101.275 45.433-101.275 101.275s45.433 101.275 101.275 101.275S357.272 311.842 357.272 256s-45.433-101.275-101.275-101.275zm0 168.791c-37.23 0-67.516-30.287-67.516-67.516s30.287-67.516 67.516-67.516 67.516 30.287 67.516 67.516-30.286 67.516-67.516 67.516z"/></svg>
									</Link>

									<Link to={`/edit-project/${this.state.company_id}/${this.state.project_id}`} className="btn-edit" title="Edit Project">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M352.459 220c0-11.046-8.954-20-20-20h-206c-11.046 0-20 8.954-20 20s8.954 20 20 20h206c11.046 0 20-8.954 20-20zM126.459 280c-11.046 0-20 8.954-20 20s8.954 20 20 20H251.57c11.046 0 20-8.954 20-20s-8.954-20-20-20H126.459z"/><path d="M173.459 472H106.57c-22.056 0-40-17.944-40-40V80c0-22.056 17.944-40 40-40h245.889c22.056 0 40 17.944 40 40v123c0 11.046 8.954 20 20 20s20-8.954 20-20V80c0-44.112-35.888-80-80-80H106.57c-44.112 0-80 35.888-80 80v352c0 44.112 35.888 80 80 80h66.889c11.046 0 20-8.954 20-20s-8.954-20-20-20z"/><path d="M467.884 289.572c-23.394-23.394-61.458-23.395-84.837-.016l-109.803 109.56a20.005 20.005 0 00-5.01 8.345l-23.913 78.725a20 20 0 0024.476 25.087l80.725-22.361a19.993 19.993 0 008.79-5.119l109.573-109.367c23.394-23.394 23.394-61.458-.001-84.854zM333.776 451.768l-40.612 11.25 11.885-39.129 74.089-73.925 28.29 28.29-73.652 73.514zM439.615 346.13l-3.875 3.867-28.285-28.285 3.862-3.854c7.798-7.798 20.486-7.798 28.284 0 7.798 7.798 7.798 20.486.014 28.272zM332.459 120h-206c-11.046 0-20 8.954-20 20s8.954 20 20 20h206c11.046 0 20-8.954 20-20s-8.954-20-20-20z"/></svg>
									</Link>
								</div>
							</div>
						</div>

						<div className="project-content row">
							<div className="title-content">Send to</div>

							<div className="project-content-header">
								<div className="col flex align-center sm-12 md-5 lg-3">
									{ this.state.user_type === "admin" &&
										<p className="title">Publishers</p>
									}
									{ this.state.user_type === "normal" &&
										<p className="title">Contacts</p>
									}
								</div>
								<div className="col flex align-center sm-4 md-2 lg-3">
									<p className="title">Message</p>
								</div>
								<div className="col flex align-center sm-4 md-2 lg-3">
									<p className="title">Files to send</p>
								</div>
								<div className="col flex align-center sm-4 md-3 lg-2 header-actions"></div>
							</div>

							{ this.state.loading_lists &&
								<span className="laoding-lists"></span>
							}

							{ !this.state.loading_lists &&
								<div className="project-content-body">
									{ this.state.submissionLists.map(submissionList => (
										<div className="publisher-selection" key={submissionList.id}>
											<div className="col flex align-center sm-12 md-5 lg-3">
												<ButtonPublisherList id={submissionList.id} submissionList={submissionList} onClick={(e) => this.modalPublishers("opened", submissionList)}/>
											</div>

											<div className="col flex align-center sm-4 md-2 lg-3">
												<button className="btn-icon btn-message" onClick={(e) => this.modal_message(submissionList)} title="Write messsage">
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="-21 -47 682.667 682"><path d="M552.012-1.332H87.988C39.473-1.332 0 38.133 0 86.656V370.63c0 48.414 39.3 87.816 87.676 87.988V587.48l185.191-128.863h279.145c48.515 0 87.988-39.472 87.988-87.988V86.656c0-48.523-39.473-87.988-87.988-87.988zm50.488 371.96c0 27.837-22.648 50.49-50.488 50.49h-290.91l-135.926 94.585v-94.586H87.988c-27.84 0-50.488-22.652-50.488-50.488V86.656c0-27.843 22.648-50.488 50.488-50.488h464.024c27.84 0 50.488 22.645 50.488 50.488zm0 0" data-original="#000000"/><path d="M171.293 131.172h297.414v37.5H171.293zm0 0M171.293 211.172h297.414v37.5H171.293zm0 0M171.293 291.172h297.414v37.5H171.293zm0 0" data-original="#000000"/></svg>
												</button>
											</div>

											<div className="col flex align-center sm-3 md-2 lg-3">
												<button className="btn-icon btn-unlock" onClick={(e) => this.modal_unlock_files(submissionList)} title="Unlock Files">
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M334.974 0c-95.419 0-173.049 77.63-173.049 173.049 0 21.213 3.769 41.827 11.211 61.403L7.672 399.928a12.613 12.613 0 00-3.694 8.917v90.544c0 6.965 5.646 12.611 12.611 12.611h74.616a12.61 12.61 0 008.91-3.686l25.145-25.107a12.61 12.61 0 003.701-8.925v-30.876h30.837c6.965 0 12.611-5.646 12.611-12.611v-12.36h12.361c6.964 0 12.611-5.646 12.611-12.611v-27.136h27.136c3.344 0 6.551-1.329 8.917-3.694l40.121-40.121c19.579 7.449 40.196 11.223 61.417 11.223 95.419 0 173.049-77.63 173.049-173.049C508.022 77.63 430.393 0 334.974 0zm0 320.874c-20.642 0-40.606-4.169-59.339-12.393-4.844-2.126-10.299-.956-13.871 2.525-.039.037-.077.067-.115.106l-42.354 42.354h-34.523c-6.965 0-12.611 5.646-12.611 12.611v27.136H159.8c-6.964 0-12.611 5.646-12.611 12.611v12.36h-30.838c-6.964 0-12.611 5.646-12.611 12.611v38.257l-17.753 17.725H29.202v-17.821l154.141-154.14c4.433-4.433 4.433-11.619 0-16.051s-11.617-4.434-16.053 0L29.202 436.854V414.07l167.696-167.708c.038-.038.067-.073.102-.11 3.482-3.569 4.656-9.024 2.53-13.872-8.216-18.732-12.38-38.695-12.38-59.33 0-81.512 66.315-147.827 147.827-147.827S482.802 91.537 482.802 173.05c-.002 81.51-66.318 147.824-147.828 147.824z"/><path d="M387.638 73.144c-26.047 0-47.237 21.19-47.237 47.237s21.19 47.237 47.237 47.237 47.237-21.19 47.237-47.237-21.189-47.237-47.237-47.237zm0 69.252c-12.139 0-22.015-9.876-22.015-22.015s9.876-22.015 22.015-22.015 22.015 9.876 22.015 22.015-9.876 22.015-22.015 22.015z"/></svg>
												</button>
											</div>

											<div className="col flex align-center sm-5 md-3 lg-2 body-actions">
												<button className="btn dark-grey" onClick={(e) => this.modal_preview(submissionList)}>Preview</button>
												<button className="btn dark-grey" onClick={(e) => this.modalDelete("opened", submissionList)}>Delete</button>
											</div>
										</div>
									))}

									<div className="new-selection">
										<div className="col flex align-center sm-12 md-3 lg-3">
											<button className="btn blue" onClick={(e) => this.modalPublishers("opened")}>
												+ New group
											</button>
										</div>
									</div>
								</div>
							}

							<div className="actions">
								<div className="col flex align-center sm-12 md-5 lg-6">
									<Link to="/projects" className="btn">Exit</Link>
									<button className="btn blue btn-send" onClick={e => this.modalconfirmSend('opened')}>Send</button>
								</div>
							</div>
						</div>
					</div>
				</div>

        { this.state.modal_publishers === 'opened' && 
				  <div data-component="modal" className={`modal-project-management opened`}>
						<div className="modal-container">
							<div className="modal-header">
								{ this.state.user_type === "admin" &&
									<p className="text">Select Publisher</p>
								}
								{ this.state.user_type === "normal" &&
									<p className="text">Select Contacts</p>
								}
								<button onClick={e => this.modalPublishers('closed')} className="btn btn-close"></button>
							</div>

							<div className="modal-content modal-list-publishers">
								<div className="list-publishers-header">
									{ this.state.user_type === "admin" &&
										<div>
											<button className="btn toggle-type-list" onClick={() => this.toggleListType('publishers')}>Publishers</button>
											<button className="btn toggle-type-list" onClick={() => this.toggleListType('categories')}>Contacts</button>
										</div>
									}
									{/* <button className="btn">Publishers</button> */}
									{/* <button className="check">
										<p className="text">Select all publishers</p>
									</button> */}

									{/* <div className="search">
										<Search onSubmit={e => this.hendleSearch(e)} placeholder="Search..." value={this.state.value} onChange={e => this.onChange(e)}/>
									</div> */}
								</div>

								{ this.state.type_list === "publishers" &&
									<div className={`list-publishers-content new-list`}>
										{ this.state.publishers.map( publisher => (
											<div key={publisher.id} className={`item`}>
												<Check
													key={`publisher-all-${publisher.id}`}
													onClick={() => this.toggleAllPublisherContacts(publisher)}
													label={publisher.name}
													contact_type={'publisher_all'}
													contact_id={publisher.id}
												/>

												{ this.state.user_type === "admin" &&
													<div className="collaborators-list">
														<Check
															key={`publisher-${publisher.id}`}
															data_collaborator={0}
															onClick={() => this.toggleSelectContact('publisher', publisher.id, publisher.email)}
															label={`${publisher.contact_name || publisher.name} - ${publisher.email}`}
															contact_type={'publisher'}
															contact_id={publisher.id}
														/>

														{
															publisher.collaborators.map( collaborator => (
															<Check
																	key={`publisher_employee-${collaborator.id}`}
																	data_collaborator={collaborator.id}
																	onClick={() => this.toggleSelectContact('publisher_employee', collaborator.id, collaborator.email)}
																	label={`${collaborator.name} - ${collaborator.email}`}
																	contact_type={'publisher_employee'}
																	contact_id={collaborator.id}
																/>
															))
														}
													</div>
												}
											</div>
										))}
									</div>
								}

								{ this.state.type_list === "categories" &&
									<div className={`list-publishers-content new-list`}>
										{ this.state.categories.map( publisher => (
											<div key={publisher.id} className={`item`}>
												<Check
													key={`press_contact-all-${publisher.id}`}
													onClick={() => this.toggleAllCategoryContacts(publisher)}
													label={publisher.name}
													contact_type={'press_contact_all'}
													contact_id={publisher.id}
												/>

												<div className="collaborators-list categories-list">
													{ publisher.collaborators.map( collaborator => (
														<Check
																key={`press_contact-${collaborator.id}`}
																data_collaborator={collaborator.id}
																onClick={() => this.toggleSelectContact('press_contact', collaborator.id, collaborator.email)}
																label={`${collaborator.name} - ${collaborator.email}`}
																contact_type={'press_contact'}
																contact_id={collaborator.id}
															/>
														))
													}
												</div>
											</div>
										))}
									</div>
								}

								<div className="save-container">
									<button className="link" onClick={e => this.saveListContacts()}>Save</button>
								</div>
							</div>
						</div>
					</div>
        }
				{this.state.modal_message === 'opened' &&
					<div data-component="modal" className={`modal-project-management opened`}>				
						<div className="modal-container">
							<div className="modal-header">
								<p className="text">Message</p>
								<button onClick={e => this.closeMessageModal()} className="btn btn-close"></button>
							</div>

							<div className="modal-content modal-write-message with-ck-editor">
								<form action="">
									<input
										id="subject"
										name="subject"
										type="text"
										placeholder="Subject"
										value={this.state.subject}
										onChange={e => this.onChange(e)}
									/>

									<CKEditor
										editor={ ClassicEditor }
										data={this.state.message}
										onInit={ editor => {
											// You can store the "editor" and use when it is needed.
											console.log( 'Editor is ready to use!', editor );
										}}
										onChange={ ( event, editor ) => {
											const data = editor.getData();
											this.setState({message: data});
											{/* console.log( { event, editor, data } ); */}
										}}
										onBlur={ ( event, editor ) => {
											console.log( 'Blur.', editor );
										}}
										onFocus={ ( event, editor ) => {
											console.log( 'Focus.', editor );
										}}
									/>

									<button type="submit" className="btn blue btn-save" onClick={(e) => this.saveMessage(e)}>Save</button>
								</form>
							</div>
						</div>
					</div>
				}
				{
					this.state.modal_unlock_files === 'opened' &&
					<div data-component="modal" className={`modal-project-management opened`}>
						<div className="modal-container">
							<div className="modal-header">
								<p className="text">Unlock Files</p>
								<button onClick={e => this.closeUnlockFilesModal()} className="btn btn-close"></button>
							</div>

							<div className="modal-content modal-unlock-files">
								<div className="files-header">
									<div className="col flex align-center sm-12 lg-3">
											<p className="title">Title</p>
									</div>
									<div className="col flex align-center sm-12 lg-5">
									<p className="title">Description</p>
									</div>
									<div className="col flex align-center header-action sm-12 lg-4">
											<p className="title">Action</p>
									</div>
								</div>
								<div className="list-files">
									{this.state.links.map(link => (
										<div className="link-container" key={`collaborator-${link.id}`}>
											<div className="col flex align-center sm-12 md-6 lg-3">
												<div className="link-col"><p className="text">{link.title}</p></div>
											</div>
											<div className="col flex align-center sm-12 md-12 lg-5">
												<div className="link-col description">
													<p className="text">{link.description}</p>
													<a href={link.file_url} target="blank" className="btn view">View</a>
												</div>
											</div>
											<div className="col flex align-center body-action sm-12 md-6 lg-4">
												<LinkAvaliable
													link={link}
													onClickAvaliable={e => this.avaliableLink(link, true)}
													onClickUnavaliable={e => this.avaliableLink(link, false)}
												/>
											</div>
										</div>
									))}
								</div>

								<div className="save-container">
									<button className="link" onClick={e => this.saveAvaliableLinks("closed")}>Save</button>
								</div>
							</div>
						</div>
					</div>
				}

				{ this.state.modal_preview === 'opened' &&
					<div data-component="modal" className={`modal-preview opened`}>
						<div className="content">
							<button onClick={e => this.closePreviewEmailModal()} className="btn btn-close"></button>
							<EmailPreview project_title={this.state.project_title} company={this.state.company_name} subject={this.state.preview_subject} default_message={this.state.default_message} message={this.state.preview_message}/>
						</div>
					</div>
				}

				{ this.state.modal_send === 'opened' &&
					<div data-component="modal" className={`modal-cancel opened`}>
						<div className="content">
							<p className="text">
								You are about to send this email to the accounts selected. <br/>
								<span className="red-text">This action cannot be undone.</span> <br/>
								<b>Are you sure you want to continue?</b>
							</p>
							<button onClick={e => this.modalconfirmSend('closed')} className="btn grey">No</button>
							<button onClick={(e) => this.sendToPublishers()} to="/projects" className="btn blue-light">Yes</button>
						</div>
					</div>
				}

				{ this.state.modal_delete === 'opened' &&
					<div data-component="modal" className={`modal-cancel opened`}>
						<div className="content">
							<p className="text">If you proceed you will lose all data saved in this list!<br /><b>Are you sure you want to delete this group?</b></p>
							<button onClick={e => this.modalDelete('closed')} className="btn grey">No</button>
							<button onClick={e => this.deleteList('closed', this.state.selectedSubmissionList)} to="/projects" className="btn blue-light">Yes</button>
						</div>
					</div>
				}
				
				{ this.state.modal_submitted === 'opened' &&
					<div data-component="modal" className={`modal-cancel modal_submitted opened`}>
						<div className="content">
							<p className="text">
								<b>Sending emails successfully</b>
							</p>
						</div>
					</div>
				}
			</div>
		)
	};
}