import React, { Component } from 'react';
import api from '../../services/api';

export default class TagManagement extends Component {
	state = {
		textTagField: "Add new tag to the database",
		tag_search: "",
		tag_field: "",
		tagSelected: 0,
		tagList: [],
		tagToDelete: null,
		deleteTagModal: false
	}
	componentDidMount () {
		this.setState({
			tagList: this.props.allTags
		})
	}
	
	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
			fillTagName: ""
		});

		// Load related tags
		const objects = this.props.allTags;

		function trimString(s) {
			var l=0, r=s.length -1;
			while(l < s.length && s[l] == ' ') l++;
			while(r > l && s[r] == ' ') r-=1;
			return s.substring(l, r+1);
		}
		
		function compareObjects(o1, o2) {
			var k = '';
			for(k in o1) if(o1[k] != o2[k]) return false;
			for(k in o2) if(o1[k] != o2[k]) return false;
			return true;
		}
		
		function itemExists(haystack, needle) {
			for(var i=0; i<haystack.length; i++) if(compareObjects(haystack[i], needle)) return true;
			return false;
		}
		
		function searchFor(toSearch) {
			var results = [];
			toSearch = trimString(toSearch); // trim it
			for(var i=0; i<objects.length; i++) {
				if(objects[i].name.toLowerCase().indexOf(toSearch.toLowerCase())!=-1) {
					if(!itemExists(results, objects[i])) results.push(objects[i]);
				}
			}
			return results;
		}

		if(e.target.name === "tag_search") {
			if(e.target.value !== "") {
				this.setState({
					tagList: searchFor(e.target.value)
				})
			} else {
				this.setState({
					tagList: this.props.allTags
				})
			}
		}
	}

	saveTag = async (e) => {
		e.preventDefault();

		const { tagSelected, tag_field } = this.state;

		if(tag_field) {
			try {
				let newTagList = this.props.allTags;
				if(tagSelected === 0) {
					const tagExists = newTagList.filter(item => {
						return item.name === tag_field
					})
	
					if(tagExists.length <= 0) {
						const response = await api.post("tags", { name: tag_field});
						newTagList.push(response.data);
					} else {
						this.setState({
							fillTagName: "This tag already exists"
						})
					}
				} else {
					await api.put(`tags/${tagSelected}`, { name: tag_field});

					newTagList = newTagList.map(item => {
						if(item.id === tagSelected) {
							item.name = tag_field;
						}
						return item
					});
				}

				this.setState({
					tag_field: "",
					textTagField: "Add new tag to the database",
					tagList: newTagList,
					tagSelected: 0
				});

				this.props.updateTags(newTagList);
			} catch (error) {
				console.log(error);
			}
		} else {
			this.setState({
				fillTagName: "Fill in the field"
			})
		}
	}

	deleteTagConfirmation = (e, item, status) => {
		e.preventDefault();

		if(status) {
			this.setState({
				tagToDelete: item,
				deleteTagModal: true
			})
		} else {
			this.setState({
				tagToDelete: null,
				deleteTagModal: false
			})
		}
	}

	hendleDeleteTag = async (e) => {
		e.preventDefault();
		const item = this.state.tagToDelete;

		try {
			await api.delete(`tags/${item.id}`);

			const newTagList = this.state.tagList.filter(map_item => {
				return map_item.id !== item.id;
			});

			this.setState({
				tagList: newTagList,
				fillTagName: "",
				deleteTagModal: false
			});

			const tempTagList = this.props.allTags.filter(map_item => {
				return map_item.id !== item.id;
			});

			this.props.updateTags(tempTagList);
		} catch (error) {
			console.log(error);
		}
	}

	hendleSelectTag = (e, tag) => {
		e.preventDefault();

		this.setState({
			tagSelected: tag.id,
			tag_field: tag.name,
			textTagField: "Edit selected tag",
			fillTagName: ""
		});
	}

	render() {
		return (
			<div data-component="tag-management">
				<span className="overlay"></span>

				<div className="_content">
					{!this.state.deleteTagModal &&
						<button onClick={e => this.props.hendleOpenManageTags(e)}  className="btn btn-close"></button>
					}

					<div className="_header" data-component="form">
						<div className="label">
							<label htmlFor="tag_search">Search tag</label>
							<input
								id="tag_search"
								name="tag_search"
								type="email"
								placeholder="Search for a tag"
								value={this.state.tag_search}
								onChange={e => this.onChange(e)}
							/>
						</div>
						
						<div className="label">
							<label htmlFor="tag_field">{this.state.textTagField}</label>
							<input
								autoComplete="tag_field"
								id="tag_field"
								name="tag_field"
								type="email"
								placeholder="Insert a new tag"
								value={this.state.tag_field}
								onChange={e => this.onChange(e)}
							/>
							
							{this.state.fillTagName !== "" &&
								<span className="tag-alert-message">{this.state.fillTagName}</span>
							}

							<button className="btn with-icon blue-light btn-add-tag" onClick={e => this.saveTag(e)}>
								Save in database
								<svg width="21" height="14">
									<image width="21" height="14" href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAOCAQAAABqD59FAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAHdElNRQfkDBYTHA+ZK0uTAAAA40lEQVQoz32SsUrDYBRGT0OilaiQpSB1chBnB3H3NXwUwcYX6ii6iKuijuqgOIhujdVoaag9DqkEhf7fXQ/3fve7tyVh5Ry2cgFaf9BtNlmi4oshGasMeSalwxtneYVNHfhhran6baVq6UQ96tGAJ4Z0YTuejX5hLWh5HWu0NjykzeIcdEQVATcAdNjldG7XBaKIiEdgQMQdW3PRmAQx81I99jyw1q1xvf2GT4Z134S143sQfTVpct3zM4A+/Bqoa98rBxYWjtVydruRE/W69+8HuixTkpGQMmVCSpcxBSt5H34AwpAcLsJqJbwAAAAASUVORK5CYII="/>
								</svg>
							</button>
						</div>
					</div>

					<div className="_tag-list">
						<div className="_tag-list-content">
							{this.state.tagList.map(item => (
								<div key={`${item.id}`} className="btn btn-tag grey">
									<button onClick={e => this.deleteTagConfirmation(e, item, true)} className="btn btn-tag-delete btn-close"></button>
									<button onClick={e => this.hendleSelectTag(e, item)} className="tag-name">{item.name}</button>
								</div>
							))}
						</div>
					</div>

					{this.state.deleteTagModal &&
						<div data-component="modal" className={`modal-delete-tag ${this.state.deleteTagModal ? "opened" : "closed"}`}>
							<div className="content">
								<p className="text">
									If you delete this tag, you will also be removing it from the contacts who have it.<br/>
									<b>Are you sure you want to delete the <i>{this.state.tagToDelete.name}</i> tag?</b>
								</p>
								<button onClick={e => this.deleteTagConfirmation(e, false)} className="btn grey">Cancel</button>
								<button onClick={e => this.hendleDeleteTag(e)} to="/projects" className="btn blue-light">Yes</button>
							</div>
						</div>
					}
				</div>
			</div>
		);
	}
}