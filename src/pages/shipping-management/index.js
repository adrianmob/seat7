import React, { Component } from "react";
import api from "../../services/api";
import { Redirect, Link } from "react-router-dom";
import { getUserType, logout } from "../../services/auth";

import Header from "../../components/header";
import TitlePage from "../../components/title-page";
import ModalSelectGroups from "../../components/modals/selection-groups";
import ModalMessage from "../../components/modals/modal-wirte-message";
import ModalUnlockFiles from "../../components/modals/modal-unlock-files";

export default class ShippingManagement extends Component {
  state = {
		logoutRedirect: false,

    user_type: "",
    company_id: 0,
		publishers: [],
		categories: [],
		allTags: [],
    loading_lists: true,
    selected_list: 0,
    submission_list: [],
		submissionListSelected: [],
		presets: [],

		//Project
		project_id: 0,
    banner_src: "",
		links: [],

    //Modais
    modal_message: false,
    modal_select_groups: false,
		modal_files: false,
		modal_delete: false,
		modal_send:  false
  };

  constructor() {
    super();
    this.escFunction = this.escFunction.bind(this);
	}

  componentDidMount() {
    //if page reloads without close any modal
    document.querySelector("body").classList.remove("no-scroll");

    const company_id = this.props.match.params.company_id;
    const project_id = this.props.match.params.project_id;

    const currentUser = getUserType();
    this.setState({
      user_type: currentUser,
      company_id: company_id,
			project_id: project_id
    });

		if(currentUser === "admin") {
			this.getTags();
		} else {
			this.getCategories(company_id);
		}

    this.loadApiProject(company_id, project_id);

		document.addEventListener("keydown", this.escFunction, false);
  }

  componentWillUnmount(){
		document.removeEventListener("keydown", this.escFunction, false);
  }

	escFunction(event) {
		if (event.keyCode === 27) {
			this.toggleModal('write-message', false);
			this.toggleModal('files-unlock', false);
			this.toggleModal('send-list', false);
			this.toggleModal('delete-list', false);
		}
	}
	getTags = async () => {
		try {
			const response = await api.get(`tags`);
			await this.setState({
				allTags: response.data
			});

			this.getPublishers();
		} catch (error) {
			console.log(error);
		}
	}

  loadApiProject = async (company_id, project_id) => {
    try {
      const response = await api.get(
        `companies/${company_id}/projects/${project_id}`
      );
      const response2 = await api.get(
        `companies/${company_id}/projects/${project_id}/banner`
      );
      const response3 = await api.get(
        `companies/${company_id}/projects/${project_id}/files`
      );

      await this.setState({
        project_type: response.data.project_type,
        project_title: response.data.title,
        company_name: response.data.company_name,
        company_description: response.data.company_description,
        banner_title: response2.data.title,
        banner_description: response2.data.description,
        links: response3.data,
      });

      if (response.data.logo_url) {
        this.setState({
          logo_src:
            "https://seat7-uploads.s3.amazonaws.com/" + response.data.logo_url,
        });
      }

      if (response2.data.image_url) {
        this.setState({
          banner_src:
            "https://seat7-uploads.s3.amazonaws.com/" +
            response2.data.image_url,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          publisher.groups = [];

          return publisher.collaborators;
        })
      );

      this.setState({publishers});
			this.getCategories();
    } catch (error) {
      console.log(error);

			if (error == "Error: Request failed with status code 401") {
				logout();

				setTimeout(() => {
					this.setState({logoutRedirect: true})
				}, 1000);
			}
    }
  };

  getCategories = async (companyId) => {
		const company_id = companyId ? companyId : this.state.company_id;
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
			this.loadLists(this.state.company_id, this.state.project_id);
			this.loadPresets(this.state.company_id);
    } catch (error) {
      console.log(error);
    }
  }

	loadPresets = async (company_id) => {
		try {
			const responseGorup = await api.get(`/companies/${company_id}/groupProjects`);

			const groupPromises = responseGorup.data.map(this.loadPresetGroups);
			const presetGroups = await Promise.all(groupPromises);

			await this.setState({ presets: presetGroups})
		} catch (error) {
			console.log(error);
		}
	}

	loadLists = async (company_id, project_id) => {
		const user_type = this.state.user_type;

		try {
			const responseList = await api.get(`/companies/${company_id}/projects/${project_id}/submission-lists`);

			const groupPromises = responseList.data.map(this.loadSubmissionListgroups);
			const tempList = await Promise.all(groupPromises);

			let submissionLists = [];
			tempList.map(listItem => {
				if(listItem.length){
					let status = {};

					responseList.data.map( item => {
						let dataTime = null;

						if(item.sent_at) {
							const fullData = item.sent_at.split("T");
							const data = new Date(fullData[0]);
							const time = fullData[1].split(":");
							dataTime = data.toLocaleDateString() + " at " + time[0]+":"+time[1]
						}

						if(item.id === listItem[0].__data.list_id) {
							status = {
								created_at: item.created_at,
								id: item.id,
								subject: item.subject,
								message: item.message,
								project_id: item.project_id,
								sent_at: dataTime
							}
						}
					});

					const item = {
						list_id: listItem[0].__data.list_id,
						id: listItem[0].__data.id,
						preset_name: listItem[0].__data.preset_name,
						completed: listItem[0].__data.completed,
						status
					}

					const groups = listItem[0].groups.map( group => {
						const newGroup = {
							id: group.__data.id,
							type: group.__data.contact_type,
							group_project_id: group.__data.group_project_id,
							refer_id: group.__data.refer_id,
							emails: group.emails
						}

						return newGroup;
					})

					item.groups = groups;

					if(user_type === "normal") {
						const checkType = item.groups.filter(group => {
							return group.type === "publisher_employee"
						});

						if(!checkType.length) {	
							submissionLists.push(item);
						}
					} else {
						submissionLists.push(item);
					}
				}
			});

			await this.setState({
				submission_list: submissionLists,
				loading_lists: false
			});
		} catch (error) {
			console.log(error);
		}
	}

	loadSubmissionListgroups = async (submissionList) => {
		const groupsRequest = await api.post(`/group_projects/${submissionList.id}`);
		submissionList.group = groupsRequest.data || []

		return submissionList.group;
	}

	loadPresetGroups = async (groupproject) => {
		const groupsRequest = await api.get(`/group_shippings?filter={"where": {"group_project_id": ${groupproject.id}}}`);
		groupproject.group = await groupsRequest.data || [];
		
		const emailsPromises = await groupproject.group.map(this.loadPresetGroupsEmails);
		const tempEmailList = await Promise.all(emailsPromises);

		return groupproject;
	}
	
	loadPresetGroupsEmails = async (groupShipping) => {
		const emailsRequest = await api.get(`/group_shipping_emails?filter={"where": {"group_shipping_id": ${groupShipping.id}}}`);
		groupShipping.emails = await emailsRequest.data.map( item => {
			return item;
		}) || [];

		return groupShipping;
	}

  toggleModal = (modal, status, item) => {
    if (modal === "write-message") {
      this.setState({
				modal_message: status,
				submissionListSelected: item || null
			});
    }

		if (modal === "files-unlock") {
      this.setState({
				modal_files: status,
				submissionListSelected: item || null
			});
    }
		
    if (modal === "send-list") {
      this.setState({
				modal_send: status,
				submissionListSelected: item || null
			});
    }

    if (modal === "delete-list") {
      this.setState({
				modal_delete: status,
				selected_list: item ? item : 0
			});
    }

    if (modal === "select-groups") {
      this.setState({
				modal_select_groups: status,
				submissionListSelected: item || ""
			});
    }
  };

  handleAddItem = (listItem) => {
    const allItemslist = this.state.submission_list.map((i) => ({ ...i }));

    allItemslist.push(listItem);
    this.setState({ submission_list: allItemslist });
  };

	handleUpdateItem = (list_id, listItem) => {
    const allItemslist = this.state.submission_list.map( item => {
			if(item.list_id === list_id) {
				item = listItem;
			}

			return item;
		});

		console.log(allItemslist);
    this.setState({ submission_list: allItemslist });
  };

	changeMessage = (subject, message, list_id) => {
    const allItemslist = this.state.submission_list.map( item => {
			if(item.list_id === list_id) {
				item.status.subject = subject;
				item.status.message = message
			}

			return item
		});

    this.setState({ submission_list: allItemslist });
		this.toggleModal('write-message', false)
	}

	async submitList (list) {
		const submissionList = this.state.submission_list;

		try {
			//put
			const grpup = await api.get(`/project_submission_lists/${list.list_id}/groups`);
			const groupPromises = grpup.data.map(this.updateBeforeSend);
			const updatedGroups = await Promise.all(groupPromises);

			await api.post(`/project_submission_lists/${list.list_id}/send`);
			const response = await api.get(`/companies/${this.state.company_id}/projects/${this.state.project_id}/submission-lists/${list.list_id}`);
			const updatedList = await submissionList.map( item => {
				if(item.list_id === response.data.id) {
					let dataTime = null;
					if(response.data.sent_at) {
						const fullData = response.data.sent_at.split("T");
						const data = new Date(fullData[0]);
						const time = fullData[1].split(":");
						dataTime = data.toLocaleDateString() + " at " + time[0]+":"+time[1]
					}

					item.status.sent_at = dataTime;
				}
				return item;
			});

			this.toggleModal("send-list", false);
			await this.setState({ submission_list: updatedList });
		} catch (error) {
			console.log(error);
		}
	}

	updateBeforeSend = async (group) => {
		const groupsRequest = await api.put(`/project_submission_lists/${group.list_id}/groups/${group.id}`, {
			"id": group.id,
			"preset_name": group.preset_name,
			"list_id": group.list_id,
			"completed": true
		});
		return groupsRequest;
	}

	async deleteList (list_id) {
		const submissionList = this.state.submission_list;
		
		try {
			// await api.delete(`/project_submission_lists/${list_id}/files`); // error 401 (Unauthorized)
			await api.delete(`/companies/${this.state.company_id}/projects/${this.state.project_id}/submission-lists/${list_id}`);

			const newList = submissionList.filter( item => {
				return item.list_id !== list_id
			})

			this.setState({
				submission_list: newList
			});

			this.toggleModal('delete-list', false);
		} catch (error) {
			console.log(error);
		}
	}

  render() {		
		if (this.state.logoutRedirect) {
			return <Redirect to='/Login' />
		}

    let banner;
    if (this.state.banner_src) {
      banner = (
        <img src={this.state.banner_src} alt={this.state.banner_title} />
      );
    } else {
      banner = <span className="without-banner">Without banner</span>;
    }

		const notSentList = this.state.submission_list.filter( item => {
			return item.status.sent_at === null
		});

		const sentList = this.state.submission_list.filter( item => {
			return item.status.sent_at !== null
		});

		const setMainPublishers = (publishers) => {
			this.setState({publishers});
		}
		
		const setMainCategories = (categories) => {
			this.setState({categories});
		}

    return (
      <div data-page="shipping-management">
        <Header />

        <TitlePage title="Shipping Management" />

        <div
          className="container-fluid"
          data-component="shipping-management-content"
        >
          <div className="container">
            <div className="shipping-management-header row">
              <h1 className="title">{this.state.project_title}</h1>
            </div>

            <div
              className={`shipping-management-banner row ${
                !this.state.banner_src ? "no-banner" : ""
              }`}
            >
              <div className="banner-image">
                {banner}

                <div className="banner-actions">
                  <Link
                    to={`/landing-page-preview/${this.state.company_id}/${this.state.project_id}`}
                    className="btn-preview"
                    title="Preview Project"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 511.999 511.999"
                    >
                      <path d="M508.745 246.041c-4.574-6.257-113.557-153.206-252.748-153.206S7.818 239.784 3.249 246.035a16.896 16.896 0 000 19.923c4.569 6.257 113.557 153.206 252.748 153.206s248.174-146.95 252.748-153.201a16.875 16.875 0 000-19.922zM255.997 385.406c-102.529 0-191.33-97.533-217.617-129.418 26.253-31.913 114.868-129.395 217.617-129.395 102.524 0 191.319 97.516 217.617 129.418-26.253 31.912-114.868 129.395-217.617 129.395z" />
                      <path d="M255.997 154.725c-55.842 0-101.275 45.433-101.275 101.275s45.433 101.275 101.275 101.275S357.272 311.842 357.272 256s-45.433-101.275-101.275-101.275zm0 168.791c-37.23 0-67.516-30.287-67.516-67.516s30.287-67.516 67.516-67.516 67.516 30.287 67.516 67.516-30.286 67.516-67.516 67.516z" />
                    </svg>
                  </Link>

                  <Link
                    to={`/edit-project/${this.state.company_id}/${this.state.project_id}`}
                    className="btn-edit"
                    title="Edit Project"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M352.459 220c0-11.046-8.954-20-20-20h-206c-11.046 0-20 8.954-20 20s8.954 20 20 20h206c11.046 0 20-8.954 20-20zM126.459 280c-11.046 0-20 8.954-20 20s8.954 20 20 20H251.57c11.046 0 20-8.954 20-20s-8.954-20-20-20H126.459z" />
                      <path d="M173.459 472H106.57c-22.056 0-40-17.944-40-40V80c0-22.056 17.944-40 40-40h245.889c22.056 0 40 17.944 40 40v123c0 11.046 8.954 20 20 20s20-8.954 20-20V80c0-44.112-35.888-80-80-80H106.57c-44.112 0-80 35.888-80 80v352c0 44.112 35.888 80 80 80h66.889c11.046 0 20-8.954 20-20s-8.954-20-20-20z" />
                      <path d="M467.884 289.572c-23.394-23.394-61.458-23.395-84.837-.016l-109.803 109.56a20.005 20.005 0 00-5.01 8.345l-23.913 78.725a20 20 0 0024.476 25.087l80.725-22.361a19.993 19.993 0 008.79-5.119l109.573-109.367c23.394-23.394 23.394-61.458-.001-84.854zM333.776 451.768l-40.612 11.25 11.885-39.129 74.089-73.925 28.29 28.29-73.652 73.514zM439.615 346.13l-3.875 3.867-28.285-28.285 3.862-3.854c7.798-7.798 20.486-7.798 28.284 0 7.798 7.798 7.798 20.486.014 28.272zM332.459 120h-206c-11.046 0-20 8.954-20 20s8.954 20 20 20h206c11.046 0 20-8.954 20-20s-8.954-20-20-20z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="shipping-management-content row">
              <div className="title-content">Send to</div>

              <div className="shipping-management-content-header">
                <div className="col flex align-center sm-12 md-5 lg-3">
                  {this.state.user_type === "admin" && (
                    <p className="title">Publishers</p>
                  )}
                  {this.state.user_type === "normal" && (
                    <p className="title">Contacts</p>
                  )}
                </div>
                <div className="col flex align-center sm-4 md-2 lg-3">
                  <p className="title">Message</p>
                </div>
                <div className="col flex align-center sm-4 md-2 lg-3">
                  <p className="title">Files to send</p>
                </div>
                <div className="col flex align-center sm-4 md-3 lg-2 header-actions"></div>
              </div>

              {this.state.loading_lists ? (
                <span className="laoding-lists" />
              ) : (
                <div className="shipping-management-content-body">
                  {notSentList.map((item) => (
                    <div key={item.id} className="publisher-selection">
                      <div className="col flex align-center sm-12 md-5 lg-3">
                        <button
                          className="link-col btn btn-publishers"
                          onClick={() => this.toggleModal("select-groups", true, item)}
                        >
													{item.preset_name || "Selection"}
                          {/* {item.publishers.map((publisher, index) => {
                            if (index + 1 === item.publishers.length) {
                              return `${publisher.name}`;
                            }
                            return `${publisher.name}, `;
                          })} */}
                        </button>
                      </div>

                      <div className="col flex align-center sm-4 md-2 lg-3">
                        <button
                          className="btn-icon btn-message"
                          title="Write messsage"
                          onClick={() => this.toggleModal("write-message", true, item)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-21 -47 682.667 682">
                            <path d="M552.012-1.332H87.988C39.473-1.332 0 38.133 0 86.656V370.63c0 48.414 39.3 87.816 87.676 87.988V587.48l185.191-128.863h279.145c48.515 0 87.988-39.472 87.988-87.988V86.656c0-48.523-39.473-87.988-87.988-87.988zm50.488 371.96c0 27.837-22.648 50.49-50.488 50.49h-290.91l-135.926 94.585v-94.586H87.988c-27.84 0-50.488-22.652-50.488-50.488V86.656c0-27.843 22.648-50.488 50.488-50.488h464.024c27.84 0 50.488 22.645 50.488 50.488zm0 0" data-original="#000000" />
                            <path d="M171.293 131.172h297.414v37.5H171.293zm0 0M171.293 211.172h297.414v37.5H171.293zm0 0M171.293 291.172h297.414v37.5H171.293zm0 0" data-original="#000000" />
                          </svg>
                        </button>
                      </div>

                      <div className="col flex align-center sm-3 md-2 lg-3">
                        <button
                          className="btn-icon btn-unlock"
                          title="Unlock Files"
                          onClick={() => this.toggleModal("files-unlock", true, item)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" >
                            <path d="M334.974 0c-95.419 0-173.049 77.63-173.049 173.049 0 21.213 3.769 41.827 11.211 61.403L7.672 399.928a12.613 12.613 0 00-3.694 8.917v90.544c0 6.965 5.646 12.611 12.611 12.611h74.616a12.61 12.61 0 008.91-3.686l25.145-25.107a12.61 12.61 0 003.701-8.925v-30.876h30.837c6.965 0 12.611-5.646 12.611-12.611v-12.36h12.361c6.964 0 12.611-5.646 12.611-12.611v-27.136h27.136c3.344 0 6.551-1.329 8.917-3.694l40.121-40.121c19.579 7.449 40.196 11.223 61.417 11.223 95.419 0 173.049-77.63 173.049-173.049C508.022 77.63 430.393 0 334.974 0zm0 320.874c-20.642 0-40.606-4.169-59.339-12.393-4.844-2.126-10.299-.956-13.871 2.525-.039.037-.077.067-.115.106l-42.354 42.354h-34.523c-6.965 0-12.611 5.646-12.611 12.611v27.136H159.8c-6.964 0-12.611 5.646-12.611 12.611v12.36h-30.838c-6.964 0-12.611 5.646-12.611 12.611v38.257l-17.753 17.725H29.202v-17.821l154.141-154.14c4.433-4.433 4.433-11.619 0-16.051s-11.617-4.434-16.053 0L29.202 436.854V414.07l167.696-167.708c.038-.038.067-.073.102-.11 3.482-3.569 4.656-9.024 2.53-13.872-8.216-18.732-12.38-38.695-12.38-59.33 0-81.512 66.315-147.827 147.827-147.827S482.802 91.537 482.802 173.05c-.002 81.51-66.318 147.824-147.828 147.824z" />
                            <path d="M387.638 73.144c-26.047 0-47.237 21.19-47.237 47.237s21.19 47.237 47.237 47.237 47.237-21.19 47.237-47.237-21.189-47.237-47.237-47.237zm0 69.252c-12.139 0-22.015-9.876-22.015-22.015s9.876-22.015 22.015-22.015 22.015 9.876 22.015 22.015-9.876 22.015-22.015 22.015z" />
                          </svg>
                        </button>
                      </div>

                      <div className="col flex align-center sm-5 md-3 lg-2 body-actions">
                        {/* <button className="btn dark-grey">Preview</button> */}
                        {/* <button className="btn dark-grey">Delete</button>
                        <button className="btn blue">Send</button> */}

												<button className="btn delete rounded with-icon" onClick={() => this.toggleModal("delete-list", true, item.status.id)}>
													{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 384"><path d="M64 341.333C64 364.907 83.093 384 106.667 384h170.667C300.907 384 320 364.907 320 341.333v-256H64v256zM266.667 21.333L245.333 0H138.667l-21.334 21.333H42.667V64h298.666V21.333z"/></svg> */}
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 384"><path d="M64 341.333C64 364.8 83.2 384 106.667 384h170.667C300.8 384 320 364.8 320 341.333v-256H64v256zm52.587-151.893l30.187-30.187L192 204.48l45.227-45.227 30.187 30.187-45.227 45.227 45.227 45.227-30.187 30.187L192 264.853l-45.227 45.227-30.187-30.187 45.227-45.227-45.226-45.226zM266.667 21.333L245.333 0H138.667l-21.334 21.333H42.667V64h298.666V21.333z"/></svg>
													{/* <p className="text">Delete</p> */}
												</button>

												<button className="btn send rounded with-icon" onClick={() => this.toggleModal("send-list", true, item)}>
													<p className="text">Send</p>
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448.011 448.011"><path d="M438.731 209.463l-416-192c-6.624-3.008-14.528-1.216-19.136 4.48a15.911 15.911 0 00-.384 19.648l136.8 182.4-136.8 182.4c-4.416 5.856-4.256 13.984.352 19.648 3.104 3.872 7.744 5.952 12.448 5.952 2.272 0 4.544-.48 6.688-1.472l416-192c5.696-2.624 9.312-8.288 9.312-14.528s-3.616-11.904-9.28-14.528z"/></svg>
												</button>
                      </div>
                    </div>
                  ))}

                  <div className="new-selection">
                    <div className="col flex align-center sm-12 md-3 lg-3">
                      <button
                        className="btn blue-dark"
                        onClick={() => this.toggleModal("select-groups", true)}
                      >
                        + New group
                      </button>
                    </div>
                  </div>
                </div>
              )}

              { !this.state.loading_lists && sentList.length > 0  &&
								<div className="historic">
									<div className="shipping-management-content-header">
		                <div className="col flex align-center sm-12 md-5 lg-3"><p className="title">Historic</p></div>
										<div className="col flex align-center sm-4 md-2 lg-3"></div>
										<div className="col flex align-center sm-4 md-2 lg-3"></div>
										<div className="col flex align-center sm-4 md-3 lg-2 header-actions"></div>
									</div>

									<div className="shipping-management-content-body">
										{sentList.map((item) => (
											<div key={item.id} className="publisher-selection">
												<div className="col flex align-center sm-12 md-5 lg-3 sent-at">
													<p className="text"><b>Sent at:</b> {item.status.sent_at}</p>
												</div>

												<div className="col flex align-center sm-12 md-5 lg-3">
													<button className="link-col btn btn-publishers"
														onClick={() => this.toggleModal("select-groups", true, item)}
													>
														{item.preset_name || "Selection"}
													</button>
												</div>

												<div className="col flex align-center sm-4 md-2 lg-1">
													<button className="btn-icon btn-message" title="Write messsage"
														onClick={() => this.toggleModal("write-message", true, item)}
													>
														<svg xmlns="http://www.w3.org/2000/svg" viewBox="-21 -47 682.667 682"> <path d="M552.012-1.332H87.988C39.473-1.332 0 38.133 0 86.656V370.63c0 48.414 39.3 87.816 87.676 87.988V587.48l185.191-128.863h279.145c48.515 0 87.988-39.472 87.988-87.988V86.656c0-48.523-39.473-87.988-87.988-87.988zm50.488 371.96c0 27.837-22.648 50.49-50.488 50.49h-290.91l-135.926 94.585v-94.586H87.988c-27.84 0-50.488-22.652-50.488-50.488V86.656c0-27.843 22.648-50.488 50.488-50.488h464.024c27.84 0 50.488 22.645 50.488 50.488zm0 0" data-original="#000000" /> <path d="M171.293 131.172h297.414v37.5H171.293zm0 0M171.293 211.172h297.414v37.5H171.293zm0 0M171.293 291.172h297.414v37.5H171.293zm0 0" data-original="#000000" /> </svg>
													</button>
												</div>

												<div className="col flex align-center sm-3 md-2 lg-1">
													<button className="btn-icon btn-unlock" title="Unlock Files"
	                          onClick={() => this.toggleModal("files-unlock", true, item)}
													>
														<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" > <path d="M334.974 0c-95.419 0-173.049 77.63-173.049 173.049 0 21.213 3.769 41.827 11.211 61.403L7.672 399.928a12.613 12.613 0 00-3.694 8.917v90.544c0 6.965 5.646 12.611 12.611 12.611h74.616a12.61 12.61 0 008.91-3.686l25.145-25.107a12.61 12.61 0 003.701-8.925v-30.876h30.837c6.965 0 12.611-5.646 12.611-12.611v-12.36h12.361c6.964 0 12.611-5.646 12.611-12.611v-27.136h27.136c3.344 0 6.551-1.329 8.917-3.694l40.121-40.121c19.579 7.449 40.196 11.223 61.417 11.223 95.419 0 173.049-77.63 173.049-173.049C508.022 77.63 430.393 0 334.974 0zm0 320.874c-20.642 0-40.606-4.169-59.339-12.393-4.844-2.126-10.299-.956-13.871 2.525-.039.037-.077.067-.115.106l-42.354 42.354h-34.523c-6.965 0-12.611 5.646-12.611 12.611v27.136H159.8c-6.964 0-12.611 5.646-12.611 12.611v12.36h-30.838c-6.964 0-12.611 5.646-12.611 12.611v38.257l-17.753 17.725H29.202v-17.821l154.141-154.14c4.433-4.433 4.433-11.619 0-16.051s-11.617-4.434-16.053 0L29.202 436.854V414.07l167.696-167.708c.038-.038.067-.073.102-.11 3.482-3.569 4.656-9.024 2.53-13.872-8.216-18.732-12.38-38.695-12.38-59.33 0-81.512 66.315-147.827 147.827-147.827S482.802 91.537 482.802 173.05c-.002 81.51-66.318 147.824-147.828 147.824z" /> <path d="M387.638 73.144c-26.047 0-47.237 21.19-47.237 47.237s21.19 47.237 47.237 47.237 47.237-21.19 47.237-47.237-21.189-47.237-47.237-47.237zm0 69.252c-12.139 0-22.015-9.876-22.015-22.015s9.876-22.015 22.015-22.015 22.015 9.876 22.015 22.015-9.876 22.015-22.015 22.015z" /> </svg>
													</button>
												</div>

												<div className="col flex align-center sm-5 md-3 lg-1 body-actions">
													<button className="btn delete rounded with-icon" onClick={() => this.toggleModal("delete-list", true, item.id)}>
														<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 384"><path d="M64 341.333C64 364.8 83.2 384 106.667 384h170.667C300.8 384 320 364.8 320 341.333v-256H64v256zm52.587-151.893l30.187-30.187L192 204.48l45.227-45.227 30.187 30.187-45.227 45.227 45.227 45.227-30.187 30.187L192 264.853l-45.227 45.227-30.187-30.187 45.227-45.227-45.226-45.226zM266.667 21.333L245.333 0H138.667l-21.334 21.333H42.667V64h298.666V21.333z"/></svg>
													</button>
												</div>
											</div>
										))}
									</div>
								</div>
							}

              <div className="actions">
                <div className="col flex align-center sm-12 md-5 lg-6">
                  <Link to="/projects" className="btn">Exit</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {this.state.modal_select_groups && (
          <ModalSelectGroups
						allTags={this.state.allTags}
            modalOpen={this.state.modal_select_groups}
            handleClose={() => this.setState({ modal_select_groups: false })}
            id_list={this.state.selected_list}
            user_type={this.state.user_type}
						project_id={this.state.project_id}
            company_id={this.state.company_id}
            addListItem={this.handleAddItem}
            updateListItem={this.handleUpdateItem}
						listSelected={this.state.submissionListSelected}
						setMainPublishers={setMainPublishers}
						setMainCategories={setMainCategories}
						reloadMainPresets={this.loadPresets}
						propsPublishers= {this.state.publishers}
						propsCategories= {this.state.categories}
						presets= {this.state.presets}
          />
        )}

        {this.state.modal_message && (
          <div
            data-component="modal"
            className={`modal-project-management opened`}
          >
            <div className="modal-container">
              <div className="modal-header">
                <p className="text">Message</p>
                <button
                  onClick={() => this.toggleModal("write-message", false)}
                  className="btn btn-close"
                ></button>
              </div>

              <ModalMessage
								companyId={this.state.company_id}
								projectId={this.state.project_id}
								list={this.state.submissionListSelected}
								changeMessage={this.changeMessage}
								projectTitle={this.state.project_title}
								companyName={this.state.company_name}
							/>
            </div>
          </div>
        )}

        {this.state.modal_files && (
          <div
            data-component="modal"
            className={`modal-project-management opened`}
          >
            <div className="modal-container">
              <div className="modal-header">
                <p className="text">Unlock Files</p>
                <button
                  onClick={() => this.toggleModal("files-unlock", false)}
                  className="btn btn-close"
                ></button>
              </div>

              <ModalUnlockFiles
								companyId={this.state.company_id}
								projectId={this.state.project_id}
								list={this.state.submissionListSelected}
								links={this.state.links}
							/>
            </div>
          </div>
        )}

				{ this.state.modal_delete &&
					<div data-component="modal" className={`modal-cancel opened`}>
						<div className="content">
							<p className="text">If you proceed you will lose all data saved in this list!<br /><b>Are you sure you want to delete this group?</b></p>
							<button onClick={e => this.toggleModal('delete-list', false)} className="btn grey">No</button>
							<button onClick={e => this.deleteList(this.state.selected_list)} to="/projects" className="btn blue-light">Yes</button>
						</div>
					</div>
				}

				{ this.state.modal_send &&
					<div data-component="modal" className={`modal-cancel opened`}>
						<div className="content">
							<p className="text">
								You are about to send this email to the accounts selected. <br/>
								<span className="red-text">This action cannot be undone.</span> <br/>
								<b>Are you sure you want to continue?</b>
							</p>
							<button onClick={e => this.toggleModal('send-list', false)} className="btn grey">No</button>
							<button onClick={e => this.submitList(this.state.submissionListSelected)} to="/projects" className="btn blue-light">Yes</button>
						</div>
					</div>
				}
				
				{/* { this.state.modal_submitted === 'opened' &&
					<div data-component="modal" className={`modal-cancel modal_submitted opened`}>
						<div className="content">
							<p className="text">
								<b>Sending emails successfully</b>
							</p>
						</div>
					</div>
				} */}
      </div>
    );
  }
}
