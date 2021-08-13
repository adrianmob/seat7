import React, { Component } from 'react';
import api from '../../services/api';

export default class TagsField extends Component {
	state = {
		contactId: 0,
		contactTags: this.props.contactTags || [],
		contactTag: "",
		allTags: [],
		tagsList: [],
		relatedTags: [],
		messageTagExists: ""
	}

	componentDidMount () {
		// this.loadTags();
		this.setState({
			allTags: this.props.allTags
		});

		if(this.props.contactId !== 0) {
			this.setState({
				contactId: this.props.contactId,
				contactTags: this.props.contactTags.length > 0 ? this.props.contactTags : []
			});

			if(this.props.contactTags.length > 0) {
				this.loadContactTags();
			}
		}
	}

	loadTags = async () => {
		try {
			const response = await api.get("tags");

			this.setState({
				allTags: response.data
			})

			if(this.props.contactId !== 0 && this.props.contactTags.length > 0) {
				this.loadContactTags();
			}
		} catch (error) {
			console.log(error);
		}
	}

	loadContactTags = () => {
		const allTags = this.props.allTags;
		const contactTags = this.props.contactTags;
		const newContactTags = [];
		const newTagsList = [];

		for(let i=0; i<contactTags.length; i++) {
			for (let j=0; j<allTags.length; j++) {
				if(allTags[j].id === contactTags[i]) {
					newContactTags.push(allTags[j].id);
					newTagsList.push(allTags[j]);
				}
			}
		}

		this.setState({
			contactTags: newContactTags,
			tagsList: newTagsList
		});
	}

	onChangeTags = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
			messageTagExists: ""
		});

		if(e.target.value !== "") {
			this.setState({
				relatedTags: this.findRelated(e.target.value)
			})
		} else {
			this.setState({
				relatedTags: []
			})
		}
	}
	
	findRelated = (toSearch) => {
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

		var results = [];
		toSearch = trimString(toSearch); // trim it
		for(var i=0; i<objects.length; i++) {
			if(objects[i].name.toLowerCase().indexOf(toSearch.toLowerCase())!=-1) {
				if(!itemExists(results, objects[i])) results.push(objects[i]);
			}
		}

		return results;
	}

	addTag = async (e) => {
		e.preventDefault();
		// Add Tag to database
		const tagName = this.state.contactTag;

		if(tagName !== "") {
			let response;

			try {
				// const tagExists = await api.get(`tags?filter[where][name]=${tagName}`);
				const tagExists = this.state.allTags.filter(item => {
					return item.name === tagName
				})

				if(tagExists.length <= 0) {
					response = await api.post("tags", { name: tagName});

					const tagsListTemp = this.state.tagsList;
					const allTagsTemp = this.state.allTags;
					const tagItem = {
						id: response.data.id,
						name: tagName
					}
					tagsListTemp.push(tagItem);
					allTagsTemp.push(tagItem);
					const contactTagsTemp = this.state.contactTags;
					contactTagsTemp.push(response.data.id);

					this.setState({
						allTags: allTagsTemp,
						tagsList: tagsListTemp,
						contactTags: contactTagsTemp,
						relatedTags: [],
						contactTag: ""
					});

					this.props.updateTags(allTagsTemp);
					this.props.hendleOnChangeTags(contactTagsTemp);
				} else {
					this.setState({
						messageTagExists: "This tag already exists"
					})
				}
			} catch (error) {
				console.log(error);
			}

		}
	}

	addRelatedTag = (e, id, name) => {
		e.preventDefault();
		const tagsListTemp = this.state.tagsList;
		const tagItem = {
			id: id,
			name: name
		}
		tagsListTemp.push(tagItem);

		const contactTagsTemp = this.state.contactTags;
		contactTagsTemp.push(id);

		this.setState({
			tagsList: tagsListTemp,
			contactTags: contactTagsTemp
		});

		this.props.hendleOnChangeTags(this.state.contactTags);
	}

	removeTag = (id_remove) => {
		const tagsListTemp = this.state.tagsList.filter( item => {
			return item.id !== id_remove
		});

		const contactTagsTemp = this.state.contactTags.filter( item => {
			return item !== id_remove
		});
		
		this.setState({
			tagsList: tagsListTemp,
			contactTags: contactTagsTemp
		});

		this.props.hendleOnChangeTags(contactTagsTemp);
	}

	saveTags = () => {
		this.setState({contactTag: ""});
		this.props.hendleTagdSaved(false);
	}
	
	ReloadTags = () => {
		this.setState({
			allTags: this.props.allTags,
			relatedTags: this.findRelated(this.state.contactTag)
		});
		this.loadContactTags();
		this.props.reloadedTags(false);
	}

	clearTags = () => {
		if(this.props.contactId !== 0) {
			this.loadContactTags();

			this.setState({
				relatedTags: [],
				contactTag: ""
			});

			this.props.hendleTagdSaved(false);
		} else {
			this.setState({
				tagsList: [],
				relatedTags: [],
				contactTag: ""
			});

			this.props.hendleTagdSaved(false);
		}
	}

	render() {
		if(this.props.clearTags) {
			this.clearTags();
		}
		if(this.props.reloadTags) {
			this.ReloadTags();
		}
		// if(this.props.saveTags) {
		// 	this.clearTags();
		// }

		const tagList = this.state.tagsList;

		function ButtonTag(props) {	
			const tagSelected = tagList.filter(item => {
				return item.id === props.id
			});

			let bts;
			if(tagSelected.length === 0){
				bts = <button className="btn dark-grey btn-tag" onClick={props.onclick}>{props.name}</button>
			} else {
				bts = <button className="btn blue btn-tag" onClick={e => e.preventDefault()}>{props.name}</button>
			}

			return bts
		}

		return (
			<div data-component="tag-field">
				<div className="add-tags-field">
					<label className="label">Employee Tags:</label>

					<div className="input-container">
						<input
							id="tag-field"
							autoComplete="off"
							placeholder="2D material"
							className="input"
							type="text"
							name="contactTag"
							value={this.state.contactTag}
							onChange={e => this.onChangeTags(e)}
						/>

						{this.state.messageTagExists !== "" &&
							<span className="tag-alert-message">{this.state.messageTagExists}</span>
						}

						<button
							className="btn with-icon blue-light btn-add-tag"
							onClick={e => this.addTag(e)}
						>
							Add Tags
							<svg width="21" height="14">
								<image width="21" height="14" href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAOCAQAAABqD59FAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAHdElNRQfkDBYTHA+ZK0uTAAAA40lEQVQoz32SsUrDYBRGT0OilaiQpSB1chBnB3H3NXwUwcYX6ii6iKuijuqgOIhujdVoaag9DqkEhf7fXQ/3fve7tyVh5Ry2cgFaf9BtNlmi4oshGasMeSalwxtneYVNHfhhran6baVq6UQ96tGAJ4Z0YTuejX5hLWh5HWu0NjykzeIcdEQVATcAdNjldG7XBaKIiEdgQMQdW3PRmAQx81I99jyw1q1xvf2GT4Z134S143sQfTVpct3zM4A+/Bqoa98rBxYWjtVydruRE/W69+8HuixTkpGQMmVCSpcxBSt5H34AwpAcLsJqJbwAAAAASUVORK5CYII="/>
							</svg>
						</button>

						{this.state.relatedTags.length > 0 &&
							<div className="related-tags">
								{this.state.relatedTags.map( item => (
									<ButtonTag
										key={item.id}
										id={item.id}
										name={item.name}
										onclick={e => this.addRelatedTag(e, item.id, item.name)}
									/>
								))}

								<button onClick={e => this.props.hendleOpenManageTags(e)}  className="btn with-icon blue-light btn-manage-tags">Manege Tags Database</button>
							</div>
						}
					</div>
				</div>

				<div className="tags-list">
					{this.state.tagsList.map(item => (
						<div key={item.id} className="tag">
							{item.name}
							<button onClick={e => this.removeTag(item.id)} className="remove-tag">x</button>
						</div>
					))}
				</div>
			</div>
		);
	}
}