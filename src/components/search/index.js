import React, { Component } from 'react';

//images
import iconSearch from '../../assets/img/icons/icon-search.png';

export default class Search extends Component {
	componentDidMount() {
	}

	render() {
		return (
			<form data-component="search" onSubmit={this.props.onSubmit}>
				<input
					name="search"
					type="text"
					placeholder={this.props.placeholder}
					value={this.props.value}
					onChange={this.props.onChange}
				/>
				
				<button type="submit" className="btn-serach"><img src={iconSearch} alt="Icon search"/></button>
			</form>
		)
	};
}