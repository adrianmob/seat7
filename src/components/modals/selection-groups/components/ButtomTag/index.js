import React, { Component } from "react";

export default class ButtomTag extends Component {
	state = {
		tagId: 0,
		name: "",
		selectedTags: []
	}

	componentDidMount () {
		this.setState({
			tagId: this.props.tagId,
			name: this.props.name,
			selectedTags: this.props.selectedTags
		})
	}

	render() {
		return (
			<button
				className={this.state.selectedTags.indexOf(this.state.tagId) >= 0 ? "active" : ""}
				onClick={e => this.props.selectTag(this.state.tagId)}
			>
				{this.state.name}
			</button>
		);
	}
}