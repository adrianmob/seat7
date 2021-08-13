import React, { useState, useEffect, useCallback } from "react";
import { Grid, Dialog, DialogContent, Container } from "@material-ui/core";
import {
  AddToPhotosOutlined,
  PlaylistAddCheckOutlined,
} from "@material-ui/icons";

import {
  SectionGroupsHeader,
  ModalHeader,
  Loader,
  LoaderContent,
  Title,
  AddButton,
  EmailsHeader,
  LabelContent,
  Label,
  ActionButtom
} from "./styles";
import Groups from "./components/Groups";
import Contact from "./components/Contact";
import ContactEdit from "./components/ContactEdit";
import FormPublisherContact from "./components/FormPublisherContact";
import SideMenuItem from "./components/MenuItem";
import Presets from "./components/Presets";
import ModalFooter from "./components/ModalFooter";
// import { presets } from "./utils/data";

import PublisherEdit from "../../contact-edit/publishers";
import PressEdit from "../../contact-edit/press";

import api from "services/api";

const SelectionGroupsContent = ({
	user_type,
	company_id,
	project_id,
	modalOpen,
	handleClose,
	addListItem,
	setMainPublishers,
	setMainCategories,
	updateListItem,
	allTags,
	listSelected,
	propsPublishers,
	propsCategories,
	presets,
	reloadMainPresets
	}) => {
  const [loadPublishers, setLoadPublishers] = useState(false);
  const [loadCategories, setLoadCategories] = useState(false);
  const [hasPreselection, setHasPreselection] = useState(false);
  // const [selectionByTag, setSelectionByTag] = useState(false);
	const [tagsList, setTagsList] = useState([]);
	const [editMode, setEditMode] = useState(false);
	const [updateMode, setUpdateMode] = useState(listSelected ? true : false);
	const [emailList, setEmailList] = useState(false);
	const [publisherEditMode, setPublisherEditMode] = useState(false);
	const [contactsEditMode, setContactsEditMode] = useState(false);
	const [publisherEdit, setPublisherEdit] = useState(false);
	const [contactEdit, setContactEdit] = useState(false);
	const [textSubmitPublisherContact, setTextSubmitPublisherContact] = useState("Add e-mail to Database");
	const [contactType, setContactType] = useState("");
	const [contactName, setContactName] = useState("");
	const [contactEmail, setContactEmail] = useState("");
	const [selectedTags, setSelectedTags] = useState([]);
	const [clearTags, setClearTags] = useState("");
  const [saveTags, setSaveTags] = useState("");
  const [openManageTags, setOpenManageTags] = useState(false);
	const [categoryName, setCategoryName] = useState("");
	const [publisherName, setPublisherName] = useState("");
	const [publisherListOpened, setPublisherListOpened] = useState(false);
	const [publisherSelected, setPublisherSelected] = useState([]);
	const [formColaboratorEnabled, setFormColaboratorEnabled] = useState(true);
	const [selectedContactToEdit, setSelectedContactToEdit] = useState();
  const [selectedPreset, setSelectedPreset] = useState("");
  const [presetsData, setPresetsData] = useState(presets);
  const [contacts, setContacts] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [deletedGroups, setDeletedGroups] = useState([]);
  const [deletedPresetGroups, setDeletedPresetGroups] = useState([]);
  const [selected, setSelected] = useState({});
  const [categoriesSelected, setCategoriesSelected] = useState([]);
	
  const [selectedList, setSelectedList] = useState([]);
  const [publishers, setPublishers] = useState(propsPublishers);
  const [categories, setCategories] = useState(propsCategories);

  const allPublishers = publishers.map((p) => ({ ...p }));
  const allCategories = categories.map((c) => ({ ...c }));

  const setInitialPublishers = async () => {
    try {
      setLoadPublishers(false);
    } catch (error) {
      console.log(error);
    }
  };

  const setInitialCategories = useCallback(async () => {
    try {
			setLoadCategories(false);
    } catch (error) {
      console.log(error);
    }
  }, [company_id]);

	const updatePublishers = async (pub, contact) =>  {
		// updatePresetData(pub, contact);

		const newPub = await pub.map(pubItem => {
			const newGroups = [];
			allPublishers.map(allItem => {
				if(allItem.id === pubItem.id) {
					const cleanGroups = allItem.groups.filter(group => {
						if(contact) {
							const updatedEmails = group.emails.filter(email => {
								const contactId = email.contact_id || email.id;
								if(contactId === contact.id){
									if(!contact.del){
										email.email = contact.email;
										return email;
									}
								} else {
									return email;
								}
							});

							group.emails = updatedEmails || [];
						}

						return group;
					});

					const removeEmptyGroups = cleanGroups.filter(cleanGroup => {
						if(cleanGroup.emails.length) {
							return cleanGroup;
						}
					});

					newGroups.push(removeEmptyGroups);
				}
			});

			pubItem.groups = newGroups[0].length ? newGroups[0] : [];
			pubItem.checked = newGroups[0].length ? true : false;
			pubItem.preset = false;
			pubItem.preselection = false;
			pubItem.color = newGroups[0].length ? "#0056a7" : "";

			return pubItem;
		});

		await setPublishers(newPub);

		let newGroups = await[];
		await newPub.map( item=>{ item.groups.map( group => { newGroups.push(group);})});
		await allCategories.map( item=>{ item.groups.map( group => { newGroups.push(group);});});
	
		const theList = await selectedList;
		theList.groups = await newGroups;
		await setSelectedList(theList);
		reloadMainPresets(company_id);
		await handleSelect(selectedList, newPub, allCategories);
	};

	const updateCategories = useCallback(async (cat, contact) =>  {
		// updatePresetData(cat, contact);

		const newCat = await cat.map(catItem => {
			const newGroups = []
			allCategories.map(allItem => {
				if(allItem.id === catItem.id) {
					const cleanGroups = allItem.groups.map(group => {
						if(contact) {
							const updatedEmails = group.emails.filter(email => {
								const contactId = email.contact_id || email.id;
								if(contactId === contact.id){
									if(!contact.del){
										email.email = contact.email;
										return email;
									}
								} else {
									return email;
								}
							});

							group.emails = updatedEmails || [];
						}

						return group;
					});

					const removeEmptyGroups = cleanGroups.filter(cleanGroup => {
						if(cleanGroup.emails.length) {
							return cleanGroup;
						}
					});

					newGroups.push(removeEmptyGroups);
				}
			});

			catItem.groups = newGroups[0] || [];
			catItem.checked = newGroups[0].length ? true : false;
			catItem.preset = false;
			catItem.preselection = false;
			catItem.color = newGroups[0].length ? "#0056a7" : "";

			return catItem;
		});

		await setCategories(newCat.map((c) => ({ ...c })));

		let newGroups = await[];
		await newCat.map( item=>{ item.groups.map( group => { newGroups.push(group); }) });
		await allPublishers.map( item=>{ item.groups.map( group => { newGroups.push(group); }); });

		const theList = selectedList;
		theList.groups = newGroups;
		setSelectedList(theList);
		reloadMainPresets(company_id);
		await handleSelect(theList, allPublishers, newCat);
	}, [selectedList, allPublishers, allCategories, setCategories]);

	const handleSelect = useCallback((target, newPub, newCat) => {
		let listPublisher = publishers;
		let listCategories = categories;
	
		if(newPub) {
			listPublisher = newPub;
		}
		if(newCat) {
			listCategories = newCat;
		}

		const clearPublishers = listPublisher.map((p) => ({
			...p,
			checked: false,
			preset: false,
			preselection: false,
			color: "",
			groups: [],
		}));

		const clearCategories = listCategories.map((c) => ({
			...c,
			checked: false,
			preset: false,
			preselection: false,
			color: "",
			groups: [],
		}));

		setHasPreselection(true);
		
		if (target) {
			const groups = target.groups || [];
			let selectedGroup = [];

			groups.map((group) => {
				const type = group.contact_type || group.type;
				if (type === "publisher_employee") {
					listPublisher.map((publisher, index) => {
						if (publisher.id === group.refer_id) {
							clearPublishers[index].groups.push(group);
							clearPublishers[index].checked = true;
							clearPublishers[index].color = "#0056a7";
							clearPublishers[index].preset = false;
						}
					});
				} else {
					listCategories.map((category, index) => {
						if (category.id === group.refer_id) {
							clearCategories[index].groups.push(group);
							clearCategories[index].checked = true;
							clearCategories[index].color = "#0056a7";
							clearCategories[index].preset = false;
						}
					});
				}
			});

			let selected = {};

			let getSelected = clearPublishers.filter( item => {
				if(item.groups.length > 0) {
					return item;
				}
			});

			if(getSelected.length > 0) {
				setContacts(getSelected[0].collaborators);
				selectedGroup = getSelected[0].groups;
				selected = {
					id: getSelected[0].id,
					name: getSelected[0].name,
					contact_name: getSelected[0].contact_name,
					email: getSelected[0].email,
					phone: getSelected[0].phone,
					index: 0,
					type: "publisher",
				}
			} else {
				getSelected = clearCategories.filter( item => {
					if(item.groups.length > 0) {
						return item;
					}
				});
				
				if(getSelected.length > 0) {
					setContacts(getSelected[0].collaborators);
					selectedGroup = getSelected[0].groups;
					selected = {
						id: getSelected[0].id,
						name: getSelected[0].name,
						contact_name: getSelected[0].contact_name,
						email: getSelected[0].email,
						index: 0,
						type: "categories",
					}
				} else {
					if(user_type === "admin") {
						selected = {
							id: clearPublishers[0].id,
							name: clearPublishers[0].name,
							contact_name: clearPublishers[0].contact_name,
							email: clearPublishers[0].email,
							phone: clearPublishers[0].phone,
							index: 0,
							type: "publisher"
						}
						setContacts(clearPublishers[0].collaborators);
					} else {
						selected = {
							id: clearCategories[0].id,
							name: clearCategories[0].name,
							contact_name: clearCategories[0].contact_name,
							email: clearCategories[0].email,
							index: 0,
							type: "categories"
						}
						setContacts(clearCategories[0].collaborators);
					}
				}
			}

			setSelected(selected);
			setSelectedGroups(selectedGroup);
			
			setCategories(clearCategories);
			if(user_type === "admin") {
				setPublishers(clearPublishers);
			}
		} else {
			if(user_type === "admin") {
				setPublishers(clearPublishers);
				setContacts(clearPublishers[0].collaborators);
			} else {
				setContacts(clearCategories[0].collaborators);
			}
			setCategories(clearCategories);
			setSelectedGroups([]);
		}
	}, [publishers, categories, setPublishers, setCategories]);

	const setNewPublishers = (pub) => {
		setMainPublishers(pub);
	}

	const setNewCategories = (cat) => {
		setMainCategories(cat);
	}

  useEffect(() => {
    user_type === "admin" && setInitialPublishers();
    setInitialCategories();

		if(!listSelected) {
			listSelected = user_type === "admin" ? allPublishers[0] : allCategories[0];
		}

		setSelectedList(listSelected);
		handleSelect(listSelected);

  }, [setInitialCategories, user_type, listSelected]);

  const handleSelectedContact = (index, value) => {
    const allContacts = contacts.map((g) => ({ ...g }));
    allContacts[index].shipping_field = value;

    setContacts(allContacts);
  };

  const handleSelectedPublisher = (type, selected, index) => {
		setSelected({
			id: selected.id,
			name: selected.name,
			contact_name: selected.contact_name,
			email: selected.email,
			phone: selected.phone ? selected.phone : "",
			index,
			type
		});

    if (type === "publisher" && user_type === "admin") {
      setContacts(publishers[index].collaborators);
      setSelectedGroups(publishers[index]?.groups ?? []);
    } else {
      setContacts(categories[index].collaborators);
      setSelectedGroups(categories[index]?.groups ?? []);
    }
  };

  const handleChecked = (type, checked, selectedItem, index) => {
    const allContacts =
      type === "publisher"
        ? publishers[index].collaborators || []
        : categories[index].collaborators || [];

    if (selectedItem.preset && !editMode) {
      if (type === "publisher") {
        allPublishers[index].color = "#0056a7";
        allPublishers[index].preselection = true;
      } else {
        allCategories[index].color = "#0056a7";
        allCategories[index].preselection = true;
      }
      setHasPreselection(true);
    }

    if (selectedItem.preset && editMode) {
      if (type === "publisher") {
        allPublishers[index].color = "red";
        allPublishers[index].groups = [];
      } else {
        allCategories[index].color = "red";
        allCategories[index].groups = [];
      }
      if (selectedItem.id === selected.id) {
        setSelectedGroups([]);
      }
    }

    const allowChange =
      type === "publisher"
        ? !allPublishers[index].preset
        : !allCategories[index].preset;

    if (allowChange) {
      if (checked) {
        allContacts.map((c) => (c.shipping_field = "to"));

        if (type === "publisher") {
          allPublishers[index].checked = true;
          setSelectedGroups(publishers[index]?.groups ?? []);
        } else {
          allCategories[index].checked = true;
          setSelectedGroups(categories[index]?.groups ?? []);
        }
      } else {
        if (type === "publisher") {
          allPublishers[index].checked = false;
        } else {
          allCategories[index].checked = false;
        }
        allContacts.map((c) => (c.shipping_field = ""));
      }
    }

    setCategories(allCategories);
		if(user_type === "admin") {
			setPublishers(allPublishers);
		}

		setSelected({
			id: selectedItem.id,
			name: selectedItem.name,
			contact_name: selectedItem.contact_name,
			email: selectedItem.email,
			phone: selectedItem.phone ? selectedItem.phone : "",
			index,
			type
		});

		setSelectedGroups(selectedItem.groups);
    setContacts(allContacts);
  };

  const disableAddGroupButton = () => {
    const hasSelectd = contacts.filter((e) => e.shipping_field);

    return hasSelectd.length === 0;
  };

  const handleSaveSelectionGroup = () => {
    const emails = contacts.filter((e) => e.shipping_field);
    const allContacts = contacts.map((e) => ({ ...e, shipping_field: "" }));

    if (selected.type === "publisher") {
			allPublishers.map((item, index) => {
				if(item.id === selected.id) {
					selected.index = index;
				}
			});

      const group = {
        refer_id: allPublishers[selected.index].id,
        id: allPublishers[selected.index].groups.length + 1,
        emails,
        type: "publisher_employee",
      };
      const editColor = allPublishers[selected.index].preset
        ? "#ffeb3b"
        : "#43a047";

      allPublishers[selected.index].groups.push(group);
      allPublishers[selected.index].checked = true;
      allPublishers[selected.index].color = editMode ? editColor : "#0056a7";
      if (allPublishers[selected.index].preset)
        allPublishers[selected.index].preselection = true;
      setSelectedGroups(allPublishers[selected.index].groups);
      setPublishers(allPublishers);
    } else {
			allCategories.map( (item, index) => {
				if(item.id === selected.id) {
					selected.index = index;
				}
			});

      const group = {
        refer_id: allCategories[selected.index].id,
        id: allCategories[selected.index].groups.length + 1,
        emails,
        type: "press_contact",
      };
      const editColor = allCategories[selected.index].preset
        ? "#ffeb3b"
        : "#43a047";

      allCategories[selected.index].groups.push(group);
      allCategories[selected.index].checked = true;
      allCategories[selected.index].color = editMode ? editColor : "#0056a7";
      if (allCategories[selected.index].preset)
        allCategories[selected.index].preselection = true;
      setSelectedGroups(allCategories[selected.index].groups);
      setCategories(allCategories);
    }

    setContacts(allContacts);
  };
	
	const handlePreset = useCallback(({ target }) => {
		const clearPublishers = publishers.map((p) => ({
			...p,
			checked: false,
			preset: false,
			preselection: false,
			color: "",
			groups: [],
		}));
		const clearCategories = categories.map((c) => ({
			...c,
			checked: false,
			preset: false,
			preselection: false,
			color: "",
			groups: [],
		}));

		setSelectedPreset(target.value !== 0 ? target.value : "");
		setHasPreselection(false);
		setEditMode(false);
		setDeletedPresetGroups([]);

		if (target.value && target.value !== 0) {
			handleSelect(target.value);
			const groups = target.value?.group ?? [];
			let selectedGroup = [];

			const newList = selectedList;
			newList.groups = groups;
			setSelectedList(newList);

			groups.map((group) => {
				if (group.contact_type === "publisher_employee") {
					publishers.map((publisher, index) => {
						if (publisher.id === group.refer_id) {
							clearPublishers[index].groups.push(group);
							clearPublishers[index].checked = true;
							clearPublishers[index].color = "";
							clearPublishers[index].preset = true;
						}
					});
				} else {
					categories.map((category, index) => {
						if (category.id === group.refer_id) {
							clearCategories[index].groups.push(group);
							clearCategories[index].checked = true;
							clearCategories[index].color = "";
							clearCategories[index].preset = true;
						}
					});
				}
			});

			let selected = {};

			let getSelected = clearPublishers.filter( item => {
				if(item.groups.length > 0) {
					return item;
				}
			});

			if(getSelected.length > 0) {
				setContacts(getSelected[0].collaborators);
				selectedGroup = getSelected[0].groups;
				selected = {
					id: getSelected[0].id,
					name: getSelected[0].name,
					contact_name: getSelected[0].contact_name,
					email: getSelected[0].email,
					phone: getSelected[0].phone,
					index: 0,
					type: "publisher",
				}
			} else {
				getSelected = clearCategories.filter( item => {
					if(item.groups.length > 0) {
						return item;
					}
				});
				
				if(getSelected.length > 0) {
					setContacts(getSelected[0].collaborators);
					selectedGroup = getSelected[0].groups;
					selected = {
						id: getSelected[0].id,
						name: getSelected[0].name,
						contact_name: getSelected[0].contact_name,
						email: getSelected[0].email,
						index: 0,
						type: "categories",
					}
				} else {
					if(user_type === "admin") {
						selected = {
							id: clearPublishers[0].id,
							name: clearPublishers[0].name,
							contact_name: clearPublishers[0].contact_name,
							email: clearPublishers[0].email,
							phone: clearPublishers[0].phone,
							index: 0,
							type: "publisher"
						}
						setContacts(clearPublishers[0].collaborators);
					} else {
						selected = {
							id: clearCategories[0].id,
							name: clearCategories[0].name,
							contact_name: clearCategories[0].contact_name,
							email: clearCategories[0].email,
							index: 0,
							type: "categories"
						}
						setContacts(clearCategories[0].collaborators);
					}
				}
			}
			
			setSelected(selected);
			setSelectedGroups(selectedGroup);

			setCategories(clearCategories);
			if(user_type === "admin") {
				setPublishers(clearPublishers);
			}
		} else {
			handleSelect(listSelected);
			setPublishers(clearPublishers);
			setContacts(clearPublishers[0].collaborators);
			setCategories(clearCategories);
			setSelectedGroups([]);
		}
	}, [categories, publishers, selected, selectedList]);

  const handleDeleteGroup = useCallback((group) => {
		selectedList.groups.map( item => {
			if(item.id === group.id) {
				const removedGroups = deletedGroups;
				removedGroups.push(group);
				setDeletedGroups(removedGroups);
				console.log(removedGroups);
				setDeletedPresetGroups(removedGroups);
			}
		});

    if (group.type === "publisher_employee" || group.contact_type === "publisher_employee") {
      const groups = publishers.find((p) => p.id === group.refer_id).groups.filter((g) => g.id !== group.id);

      allPublishers.map((publisher) => {
        if (publisher.id === group.refer_id) {
          publisher.groups = groups;
          publisher.color = editMode ? "#ffeb3b" : "#0056a7";
          if (publisher.preset && groups.length !== 0) {
            publisher.preselection = true;
          }
          if (groups.length === 0) publisher.color = editMode ? "#e73e33" : "";
        }
      });

      setSelectedGroups(groups);
      setPublishers(allPublishers);
    } else {
      const groups = categories
        .find((c) => c.id === group.refer_id)
        .groups.filter((g) => g.id !== group.id);

      allCategories.map((category) => {
        if (category.id === group.refer_id) {
          category.groups = groups;
          category.color = editMode ? "#ffeb3b" : "#0056a7";
          if (category.preset && groups.length !== 0) {
            category.preselection = true;
          }
          if (groups.length === 0) category.color = "";
        }
      });

      setSelectedGroups(groups);
      setCategories(allCategories);
    }
  }, [deletedPresetGroups, deletedGroups, selectedList, publishers, categories]);

  const handleEditGroup = (index, value, group) => {
    if (selected.type === "publisher") {
      const groups = publishers.find((p) => p.id === group.refer_id).groups;
      const groupContacts = groups.find((g) => g.id === group.id).emails;

      groupContacts[index].shipping_field = value;
      allPublishers
        .find((p) => p.id === group.refer_id)
        .groups.find((g) => g.id === group.id).emails = groupContacts;
      allPublishers.find((p) => p.id === group.refer_id).color = "#ffeb3b";

      setPublishers(allPublishers);
    } else {
      const groups = categories.find((c) => c.id === group.refer_id).groups;
      const groupContacts = groups.find((g) => g.id === group.id).emails;

      groupContacts[index].shipping_field = value;
      allCategories
        .find((c) => c.id === group.refer_id)
        .groups.find((g) => g.id === group.id).emails = groupContacts;
      allCategories.find((c) => c.id === group.refer_id).color = "#ffeb3b";

      setCategories(allCategories);
    }
  };

  const handleSavePreset = async (preset_name) => {
    const presetGroups = [];
    const allPresets = presetsData.map((preset) => ({ ...preset }));
		const items = [];
    let listItem = {};

    publishers.map((publisher) => {
      if (publisher.checked) {
        presetGroups.push(...publisher.groups);
      }

			const isPreselection = !publisher.preset || publisher.preselection;
      if (isPreselection && publisher.groups.length) {
        items.push(publisher);
      }
    });

    categories.map((category) => {
      if (category.checked) {
        presetGroups.push(...category.groups);
      }

      const isPreselection = !category.preset || category.preselection;
      if (isPreselection && category.groups.length) {
        items.push(category);
      }
    });

    const newPreset = {
      preset_name,
      presetGroups,
      id: allPresets.length + 1,
    };

		setSelectedPreset(newPreset);
		allPresets.push(newPreset);
		setPresetsData(allPresets);

		try {
			//2 - Create Group with Preset name empty
			const createGroups = await api.post(`companies/${company_id}/groupProjects`, {
				"preset_name": preset_name,
				"company_id": company_id,
				"completed": false
			});

			listItem = createGroups.data;

			//3 - Create Groups shipping (insert all groups created in the database)
			const groups = [];
			await items.map( item => {
				if(item.groups.length) {
					item.groups.map( group => {
						const groupItem = {
							'group_project_id': createGroups.data.id,
							'refer_id': item.id,
							'contact_type': group.type === "press_contact" || group.type === "publisher_employee" ? group.type : (group.type === "publisher" ? "publisher_employee" : "press_contact")
						}
						groups.push(groupItem);
					})
				}
			});
		
			// const createGroupsShipping = await api.post(`group_shippings/create-groups`, groups); // não retorna nada, por isso não foi usado;
			const responseGroupsShipping = await createGroupsShipping(groups);
			let groupsShipping = [];
			
			// 4 - Create Emails to group shipping (get all emails from groups)
			if(responseGroupsShipping.length) {
				responseGroupsShipping.map( item => {
					groupsShipping.push(item.data);
				});
			} else {
				groupsShipping.push(responseGroupsShipping.data)
			}

			listItem.groups = [];

			let ind = 0;
			const emails = [];
			await items.map( item => {
				if(item.groups.length) {
					item.groups.map( group => {
						groupsShipping.map((savedGroup, index) => {
							if(index === ind) {
								group.id = savedGroup.id;
								group.group_project_id = savedGroup.group_project_id;
								group.refer_id = savedGroup.refer_id;
								group.type = savedGroup.contact_type;

								group.emails.map( em => {
									const emailItem = {
										"email": em.email,
										"shipping_field": em.shipping_field,
										"group_shipping_id": savedGroup.id,
										"contact_id": em.id,
										"contact_type": savedGroup.contact_type,
										"name": em.name
									}

									emails.push(emailItem);

									em.group_shipping_id = savedGroup.id;
									em.contact_type = savedGroup.contact_type;
									return em;
								})
							}
						});

						listItem.groups.push(group);

						ind++;
						return group;
					})
				}

				return item;
			});

			await api.post(`group_shipping_emails/create-emails`, emails);
			
			await reloadMainPresets(company_id);
		} catch (error) {
			console.log(error);
		}
  };

  const handleSaveEditPreset = useCallback(async () => {
		const allGroups = [];
		const newGroups = [];
    const allPresets = presetsData.map((preset) => ({ ...preset }));

    publishers.map((publisher) => {
		  if (publisher.checked) {
		    allGroups.push(...publisher.groups);
		    newGroups.push(...publisher.groups.filter(g=>{return !g.group_project_id}));
		  }
		});
		categories.map((category) => {
		  if (category.checked) {
		    allGroups.push(...category.groups);
		    newGroups.push(...category.groups.filter(g=>{return !g.group_project_id}));
		  }
		});

		setEditMode(false);
		allPresets.find((p) => p.id === selectedPreset.id).group = allGroups;

		setPresetsData(allPresets);
		setHasPreselection(false);
		setPublishers(publishers.map((p) => ({ ...p, color: p.groups.length ? "orange" : "", preselection: false, checked: p.groups.length ? true : false, preset: p.groups.length ? true : false })));
		setCategories(categories.map((c) => ({ ...c, color: c.groups.length ? "orange" : "", preselection: false, checked: c.groups.length ? true : false, preset: c.groups.length ? true : false })));

		try {
			if(newGroups.length) {
				const addGroups = await [];
				await newGroups.map( item => {
					const groupItem = {
						'group_project_id': selectedPreset.id,
						'refer_id': item.refer_id,
						'contact_type': item.type
					}

					addGroups.push(groupItem);
				});

				const responseGroupsShipping = await createGroupsShipping(addGroups);
				let groupsShipping = [];

				if(responseGroupsShipping.length) {
					responseGroupsShipping.map( item => {
						groupsShipping.push(item.data);
					});
				} else {
					groupsShipping.push(responseGroupsShipping.data)
				}

				const emails = [];
				newGroups.map((item, newGroupsIndex) => {
					groupsShipping.map((savedGroup, savedGroupsIndex) => {
						if(newGroupsIndex === savedGroupsIndex) {
							item.emails.map( email => {
								const emailItem = {
									"email": email.email,
									"shipping_field": email.shipping_field,
									"group_shipping_id": savedGroup.id,
									"contact_id": email.id,
									"contact_type": savedGroup.contact_type,
									"name": email.name
								}

								emails.push(emailItem);
							})
						}
					});
				});

				await api.post(`group_shipping_emails/create-emails`, emails);
			}

			if(deletedPresetGroups.length > 0) {
				const removedEmails = [];
				deletedPresetGroups.map(group => {
					group.emails.map(email => {
						removedEmails.push(email);
					});
				});

				await deleteGroupsShippingEmails(removedEmails);
				await deleteGroupsShipping(deletedGroups);
			}

			await setDeletedPresetGroups([]);
			await reloadMainPresets(company_id);
		} catch (error) {
			console.log(error);
		}
	}, [deletedPresetGroups, deletedGroups, publishers, categories, company_id]);

	const handlePreselection = ({ target }) => {
		allPublishers.map((publisher) => {
			publisher.color = target.checked ? "#0056a7" : "";
			publisher.preselection = target.checked;
		});
		allCategories.map((category) => {
			category.color = target.checked ? "#0056a7" : "";
			category.preselection = target.checked;
		});

		console.log(target.checked);
		setHasPreselection(target.checked);
		setCategories(allCategories);
		setPublishers(allPublishers);
	};
					
	const handleEditPreset = () => {
		setEditMode(true);

    allPublishers.map((publisher) => {
      if (publisher.preset) {
        publisher.color = "#0056a7";
      }
    });
    allCategories.map((category) => {
      if (category.preset) {
        category.color = "#0056a7";
      }
    });

    setPublishers(allPublishers);
    setCategories(allCategories);
  };

  const handleDeletePreset = async (preset) => {
		try {
			await api.delete(`companies/${preset.company_id}/groupProjects/${preset.id}`);
			const newPresets = await presetsData.filter(item =>{
				return item.id !== preset.id;
			});

			const target = await { value: 0 };
			await setDeletedPresetGroups([]);
			await setSelectedPreset("");
			await setHasPreselection(false);
			await setEditMode(false);
			await setPresetsData(newPresets.map((p) => ({ ...p })));
			await handlePreset({target});
			await reloadMainPresets(preset.company_id);
		} catch (error) {
			console.log(error);
		}
  };

  const handleByTag = (tagId, selectedTags, status) => {
		setSelectedTags(selectedTags);

		const clearPublishers = publishers.map((p) => ({ ...p }));
		const clearCategories = categories.map((c) => ({ ...c }));

		clearPublishers.map((publisher) => {
			if(status === "add") {
				let emails = [];
				let group = {
					id: publisher.groups.length,
					refer_id: publisher.id,
					type: "publisher_employee",
					tag_selected: tagId,
					emails: []
				}

				publisher.collaborators.map( collaborator => {
					collaborator.tags.map( tag => {
						if(tag.id === tagId) {
							const email = {
								email: collaborator.email,
								id: collaborator.id,
								name: collaborator.name,
								office_post: collaborator.office_post,
								phone: collaborator.phone,
								publisher_id: publisher.id,
								shipping_field: "to"
							}

							emails.push(email);
						}
					});
				});

				group.emails = emails;
				if(group.emails.length > 0) {
					publisher.groups.push(group);
					publisher.checked = true;
					publisher.color = "#0056a7";
					publisher.preset = false;
				}
			} else {
				if(publisher.groups.length > 0) {
					publisher.groups = publisher.groups.filter(group => {
						return group.tag_selected !== tagId;
					})
				}
			}

			if(publisher.groups.length <= 0) {
				publisher.checked = false;
				publisher.active = false;
				publisher.color = "";
			}

			return publisher;
		});

		clearCategories.map( (categories) => {
			if(status === "add") {
				let emails = [];
				let group = {
					id: categories.groups.length,
					refer_id: categories.id,
					type: "press_contact",
					tag_selected: tagId,
					emails: []
				}

				categories.collaborators.map( collaborator => {
					collaborator.tags.map( tag => {
						if(tag.id === tagId) {
							const email = {
								email: collaborator.email,
								id: collaborator.id,
								name: collaborator.name,
								press_id: categories.id,
								shipping_field: "to"
							}

							emails.push(email);
						}
					});
				});

				group.emails = emails; 
				if(group.emails.length > 0) {
					categories.groups.push(group);
					categories.checked = true;
					categories.color = "#0056a7";
					categories.preset = false;
				}
			} else {
				if(categories.groups.length > 0) {
					categories.groups = categories.groups.filter(group => {
						return group.tag_selected !== tagId;
					})
				} else {
					categories.checked = false;
					categories.color = "#ffffff";
				}
			}

			if(categories.groups.length <= 0) {
				categories.checked = false;
				categories.active = false;
				categories.color = "";
			}

			return categories;
		});

		let selected = {};
		let selectedGroup = [];

		let getSelected = clearPublishers.filter( item => {
			if(item.groups.length) {
				return item;
			}
		});

		if(getSelected.length) {
			setContacts(getSelected[0].collaborators);
			selectedGroup = getSelected[0].groups;
			selected = {
				id: getSelected[0].id,
				name: getSelected[0].name,
				contact_name: publishers[0].contact_name,
				email: publishers[0].email,
				phone: publishers[0].phone,
				index: 0,
				type: "publisher",
			}
		} else {
			getSelected = clearCategories.filter( item => {
				if(item.groups.length) {
					return item;
				}
			});

			if(getSelected.length) {
				setContacts(getSelected[0].collaborators);
				selectedGroup = getSelected[0].groups;
				selected = {
					id: getSelected[0].id,
					name: getSelected[0].name,
					contact_name: getSelected[0].contact_name,
					email: getSelected[0].email,
					index: 0,
					type: "categories",
				}
			} else {
				if(user_type === "admin") {
					selected = {
						id: clearPublishers[0].id,
						name: clearPublishers[0].name,
						contact_name: clearPublishers[0].contact_name,
						email: clearPublishers[0].email,
						phone: clearPublishers[0].phone,
						index: 0,
						type: "publisher",
					}
					setContacts(clearPublishers[0].collaborators);
				} else {
					selected = {
						id: clearCategories[0].id,
						name: clearCategories[0].name,
						contact_name: clearPublishers[0].contact_name,
						email: clearPublishers[0].email,
						index: 0,
						type: "categories",
					}
					setContacts(clearCategories[0].collaborators);
				}
			}
		}

		setSelected(selected);
		setSelectedGroups(selectedGroup);
		setPublishers(clearPublishers);
		setCategories(clearCategories);
	};

  const handleSaveSubmissionList = async (groupName) => {
    const items = [];
    let listItem = {};

    publishers.map((publisher) => {
      const isPreselection = !publisher.preset || publisher.preselection;

      if (isPreselection && publisher.groups.length) {
        items.push(publisher);
      }
    });
    categories.map((category) => {
      const isPreselection = !category.preset || category.preselection;

      if (isPreselection && category.groups.length) {
        items.push(category);
      }
    });

		try {
			// 1 - Create the submission List
			const createSubmissionList = await api.post(`companies/${company_id}/projects/${project_id}/submission-lists`, {
				'project_id': project_id,
				'subject': '',
				'message': ''
			});

			const status = await {
				created_at: createSubmissionList.data.created_at,
				id: createSubmissionList.data.id,
				message: createSubmissionList.data.message,
				project_id: createSubmissionList.data.project_id,
				sent_at: null
			}

			// await items.submittionList = createSubmissionList.data;

			const list_id = await createSubmissionList.data.id;

			//2 - Create Group with Preset name empty
			const createGroups = await api.post(`project_submission_lists/${list_id}/groups`, {
				"preset_name": groupName,
				"list_id": list_id,
				"completed": false
			});

			listItem = createGroups.data;
			listItem.status = status;
			console.log(items);

			//3 - Create Groups shipping (insert all groups created in the database)
			const groups = [];
			await items.map( item => {
				if(item.groups.length) {
					item.groups.map( group => {
						let groupItem = {};
						if(group.contact_type) {
							groupItem = {
								'group_project_id': createGroups.data.id,
								'refer_id': item.id,
								'contact_type': group.contact_type === "press_contact" || group.contact_type === "publisher_employee" ? group.contact_type : (group.contact_type === "publisher" ? "publisher_employee" : "press_contact")
							}
						} else {
							groupItem = {
								'group_project_id': createGroups.data.id,
								'refer_id': item.id,
								'contact_type': group.type === "press_contact" || group.type === "publisher_employee" ? group.type : (group.type === "publisher" ? "publisher_employee" : "press_contact")
							}
						}
						groups.push(groupItem);
					})
				}
			});

			console.log(groups);

			// const createGroupsShipping = await api.post(`group_shippings/create-groups`, groups); // não retorna nada, por isso não foi usado;
			const responseGroupsShipping = await createGroupsShipping(groups);
			let groupsShipping = [];
			
			// 4 - Create Emails to group shipping (get all emails from groups)
			if(responseGroupsShipping.length) {
				responseGroupsShipping.map( item => {
					groupsShipping.push(item.data);
				});
			} else {
				groupsShipping.push(responseGroupsShipping.data)
			}

			listItem.groups = [];

			let ind = 0;
			const emails = [];
			await items.map( item => {
				if(item.groups.length) {
					item.groups.map( group => {
						groupsShipping.map((savedGroup, index) => {
							if(index === ind) {
								group.id = savedGroup.id;
								group.group_project_id = savedGroup.group_project_id;
								group.refer_id = savedGroup.refer_id;
								group.type = savedGroup.contact_type;

								group.emails.map( em => {
									const emailItem = {
										"email": em.email,
										"shipping_field": em.shipping_field,
										"group_shipping_id": savedGroup.id,
										"contact_id": em.id,
										"contact_type": savedGroup.contact_type,
										"name": em.name
									}

									emails.push(emailItem);

									em.group_shipping_id = savedGroup.id;
									em.contact_type = savedGroup.contact_type;
									return em;
								})
							}
						});

						listItem.groups.push(group);

						ind++;
						return group;
					})
				}

				return item;
			});

			await api.post(`group_shipping_emails/create-emails`, emails);

			// 5 - Atualiza o project submission list group para completed para criar os grupos definitivos de envios
			await api.put(`project_submission_lists/${list_id}/groups/${listItem.id}`, {
				"id": listItem.id,
				"preset_name": groupName,
				"list_id": list_id,
				"completed": true
			});
		} catch (error) {
			console.log(error);
		}

		console.log("listItem");
		console.log(listItem);

    addListItem(listItem);
    handleClose();
  };

	const handleEditSubmissionList = useCallback(async (groupName) => {
    const items = [];
    let listItem = {};

    publishers.map((publisher) => {
      const isPreselection = !publisher.preset || publisher.preselection;

      if (isPreselection && publisher.groups.length) {
        items.push(publisher);
      }
    });
    categories.map((category) => {
      const isPreselection = !category.preset || category.preselection;

      if (isPreselection && category.groups.length) {
        items.push(category);
      }
    });

		try {
			const currentGroups = [];

			listSelected.groups.map( item => {
				currentGroups.push(item.id);
			});

			const status = {
				created_at: listSelected.status.created_at,
				id: listSelected.status.id,
				message: listSelected.status.message,
				project_id: listSelected.status.project_id,
				sent_at: null
			}

			const list_id = await listSelected.status.id;
			const group_id = await listSelected.id;

			//1 - Create Group with Preset name empty
			const createGroups = await api.put(`project_submission_lists/${list_id}/groups/${group_id}`, {
				"preset_name": groupName,
				"list_id": list_id,
				"completed": false
			});

			listItem = await createGroups.data;
			listItem.groups = [];
			listItem.status = await status;

			//2 - Create Groups shipping (insert all groups created in the database)
			const newGroups = await [];
			await items.map( item => {
				if(item.groups.length) {
					item.groups.map( group => {
						if(currentGroups.indexOf(group.id) < 0) {
							const groupItem = {
								'group_project_id': createGroups.data.id,
								'refer_id': item.id,
								'contact_type': group.type === "press_contact" || group.type === "publisher_employee" ? group.type : (group.type === "publisher" ? "publisher_employee" : "press_contact")
							}
							newGroups.push(groupItem);
						}

						listItem.groups.push(group);
					});
				}
			});

			if(deletedGroups.length > 0) {
				const removedEmails = [];
				deletedGroups.map(group => {
					group.emails.map(email => {
						removedEmails.push(email);
					});
				});

				await deleteGroupsShippingEmails(removedEmails);
				await deleteGroupsShipping(deletedGroups);
			}

			if(newGroups.length > 0) {
				// const createGroupsShipping = await api.post(`group_shippings/create-groups`, groups); // não retorna nada, por isso não foi usado;
				const responseGroupsShipping = await createGroupsShipping(newGroups);
				let groupsShipping = [];

				// 3 - Create Emails to group shipping (get all emails from groups)
				if(responseGroupsShipping.length) {
					responseGroupsShipping.map( item => {
						groupsShipping.push(item.data);
					});
				} else {
					groupsShipping.push(responseGroupsShipping.data)
				}

				let ind = 0;
				const emails = [];
				await items.map( item => {
					if(item.groups.length) {
						item.groups.map( group => {
							if(currentGroups.indexOf(group.id) < 0) {
								groupsShipping.map((savedGroup, index) => {
									if(index === ind) {
										group.id = savedGroup.id;
										group.group_project_id = savedGroup.group_project_id;
										group.refer_id = savedGroup.refer_id;
										group.type = savedGroup.contact_type;

										group.emails.map( em => {
											const emailItem = {
												"email": em.email,
												"shipping_field": em.shipping_field,
												"group_shipping_id": savedGroup.id,
												"contact_id": em.id,
												"contact_type": savedGroup.contact_type,
												"name": em.name
											}

											emails.push(emailItem);

											em.group_shipping_id = savedGroup.id;
											em.contact_type = savedGroup.contact_type;
											return em;
										})
									}
								});

								ind++;
							}

							return group;
						})
					}

					return item;
				});

				await api.post(`group_shipping_emails/create-emails`, emails);
			}

			// 4 - Atualiza o project submission list group para completed para criar os grupos definitivos de envios
			await api.put(`project_submission_lists/${list_id}/groups/${listItem.id}`, {
				"id": listItem.id,
				"preset_name": groupName,
				"list_id": list_id,
				"completed": true
			});
		} catch (error) {
			console.log(error);
		}

    updateListItem(listItem.list_id, listItem);
    handleClose();
  }, [listSelected, publishers, categories, deletedGroups]);

	const createGroupsShipping = (groups) => {
		if(groups.length > 1) {
			const groupPromisses = groups.map(group => {
				return api.post( `group_shippings`, {
					"group_project_id": group.group_project_id,
					"refer_id": group.refer_id,
					"contact_type": group.contact_type
				});
			})

			return Promise.all(groupPromisses);
		} else {
			return api.post( `group_shippings`, {
				"group_project_id": groups[0].group_project_id,
				"refer_id": groups[0].refer_id,
				"contact_type": groups[0].contact_type
			});
		}
	}

	const deleteGroupsShipping = (groups) => {
		if(groups.length > 1) {
			const groupPromisses = groups.map(group => {
				return api.delete(`group_shippings/${group.id}`);
			})

			return Promise.all(groupPromisses);
		} else {
			return api.delete(`group_shippings/${groups[0].id}`);
		}
	}

	const deleteGroupsShippingEmails = (emails) => {
		if(emails.length > 1) {
			const emailPromisses = emails.map(email => {
				return api.delete(`group_shipping_emails/${email.id}`);
			})

			return Promise.all(emailPromisses);
		} else {
			return api.delete(`group_shipping_emails/${emails[0].id}`);
		}
	}

	const handleEditionMode = (type) => {
		if(type === "publisher"){
			setPublisherEditMode(true);
		} else {
			setContactsEditMode(true);
		}
	}

  return (
    <Dialog className="modal-select-groups" maxWidth="lg" fullWidth open={modalOpen} onClose={handleClose}>
      <ModalHeader>
        <div>
          <h3>Select Contacts</h3>
					{editMode && !contactsEditMode && !publisherEditMode && <p>/Preset Edit Mode</p>}
					{updateMode && !contactsEditMode && !publisherEditMode && <p>/Update Mode</p>}
					{contactsEditMode && <p>/Press contacts Edit Mode</p>}
					{publisherEditMode && <p>/Publishers Edit Mode</p>}
        </div>

        <button onClick={handleClose}>X</button>
      </ModalHeader>

			{!contactsEditMode && !publisherEditMode &&
				<DialogContent className="modal-select-groups-container">
					{!updateMode && emailList === false &&
						<Presets
							allTags={allTags}
							selectedTags={selectedTags}
							presets={presetsData}
							preset={selectedPreset}
							hasPreselection={hasPreselection ? true : false}
							editMode={editMode}
							handlePreset={handlePreset}
							handleDeletePreset={handleDeletePreset}
							handleEditPreset={handleEditPreset}
							handlePreselection={handlePreselection}
							handleByTag={handleByTag}
						/>
					}

					<Grid container className={`modal-select-groups-content ${updateMode ? "update-mode" : ""}`}>
						<Grid item xs={2} className={`side-bar-list ${emailList ? "contact-edit" : ""}`}>
							{ user_type === "admin" &&
								<div className="publisher-list">
									<SectionGroupsHeader>
										<p className="text">Publishers</p>
										{editMode  ? (
											<AddButton disabled> Add or edit publisher <AddToPhotosOutlined style={{ fontSize: 15, marginLeft: 4 }} /> </AddButton>
										) : (
											<AddButton onClick={e => handleEditionMode("publisher")}>
												Add or edit publisher
												<AddToPhotosOutlined style={{ fontSize: 15, marginLeft: 4 }} />
											</AddButton>
										)}
									</SectionGroupsHeader>

									<div className="publisher-list-content">
										{ user_type === "admin" && loadPublishers ? (
											<LoaderContent>
												<Loader />
											</LoaderContent>
										) : (
											publishers.map((publisher, i) => (
												<SideMenuItem
													key={"publisher-" + publisher.id}
													index={i}
													type="publisher"
													item={publisher}
													selected={selected}
													emailListOpen={emailList}
													handleChecked={handleChecked}
													handleSelected={handleSelectedPublisher}
												/>
											))
										)}
									</div>
								</div>
							}

							<div className={`contact-list ${user_type === "normal" ? "full-height" : ""}`}>
								<SectionGroupsHeader>
									<p className="text">Contacts</p>
									{editMode  ? (
										<AddButton disabled> Add new category <AddToPhotosOutlined style={{ fontSize: 15, marginLeft: 4 }} /></AddButton>
									) : (
										<AddButton onClick={e => handleEditionMode("press")}>
											Add new category
											<AddToPhotosOutlined style={{ fontSize: 15, marginLeft: 4 }} />
										</AddButton>
									)}
								</SectionGroupsHeader>

								<div className="publisher-list-content">
									{loadCategories ? (
										<LoaderContent>
											<Loader />
										</LoaderContent>
									) : (
										categories.map((category, index) => (
											<SideMenuItem
												key={"categories-" + category.id}
												index={index}
												type="categories"
												item={category}
												selected={selected}
												emailListOpen={emailList}
												handleChecked={handleChecked}
												handleSelected={handleSelectedPublisher}
											/>
										))
									)}
								</div>
							</div>
						</Grid>

						<Grid item xs={10} className="modal-select-groups-content-right">
							<Container container>
								<Title>{selected?.name ?? ""} database </Title>

								{editMode  ? (
									<AddButton disabled> Add or edit this mail list <AddToPhotosOutlined style={{ fontSize: 15, marginLeft: 4 }} /> </AddButton>
								) : (
									<AddButton onClick={e => handleEditionMode(selected.type === "publisher" ? "publisher" : "press")}>
										Add or edit this mail list
										<AddToPhotosOutlined style={{ fontSize: 15, marginLeft: 4 }} />
									</AddButton>
								)}

								{selectedGroups.map((group, index) => (
									<Groups
										key={group.id}
										groupName={index + 1}
										group={group}
										handleDelete={handleDeleteGroup}
										handleEdit={handleEditGroup}
										noEdit={!editMode}
									/>
								))}

								<EmailsHeader>
									<p>Email Group {selectedGroups.length + 1}</p>
								</EmailsHeader>

								{contacts.length > 0 && (
									<LabelContent>
										<Label>to:</Label>
										<Label>cc:</Label>
										<Label>bcc:</Label>
									</LabelContent>
								)}

								{contacts.map((contact, index) => (
									<Contact
										key={index}
										index={index}
										contact={contact}
										handleSelected={handleSelectedContact}
									/>
								))}

								{contacts.length > 0 && (
									<ActionButtom
										onClick={handleSaveSelectionGroup}
										disabled={disableAddGroupButton()}
									>
										SAVE SELECTION GROUP
										<PlaylistAddCheckOutlined style={{ marginLeft: 5 }} />
									</ActionButtom>
								)}
							</Container>
						</Grid>
					</Grid>
				</DialogContent>
			}

			{!contactsEditMode && !publisherEditMode &&
				<ModalFooter
					handleSavePreset={handleSavePreset}
					handleSaveSubmissionList={!updateMode ? handleSaveSubmissionList : handleEditSubmissionList}
					groupName={listSelected ? listSelected.preset_name : ""}
					handleSaveEdit={handleSaveEditPreset}
					publishers={publishers}
					categories={categories}
					editMode={editMode}
					updateMode={updateMode}
					displayOff={emailList}
				/>
			}

			{publisherEditMode &&
				<PublisherEdit
					companyId={company_id}
					allTags={allTags}
					publishers={publishers}
					selected={selected}
					setInitialPublishers={setNewPublishers}
					handlePublishers={updatePublishers}
					handleBack={setPublisherEditMode}
				/>
			}

			{contactsEditMode &&
				<PressEdit
					user_type={user_type}
					companyId={company_id}
					allTags={allTags}
					categories={categories}
					selected={selected}
					setInitialCategories={setNewCategories}
					handleCategories={updateCategories}
					handleBack={setContactsEditMode}
				/>
			}
    </Dialog>
  );
};

export default SelectionGroupsContent;
