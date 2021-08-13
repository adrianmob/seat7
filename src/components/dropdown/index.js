import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import api from '../../services/api';

//images
import iconSearch from '../../assets/img/icons/icon-search.png';

export default class Dropdown extends Component {
	componentDidMount() {
	}

	render() {
		return (
			<div data-component="dropdown">
				<p className="dropdown-text"> {this.props.filter} </p>
				<div className="dropdown-submenu">
					<button className="link" onClick={() => this.changeFilter("All")}>All</button>
					<button className="link" onClick={() => this.changeFilter("Avaliable")}>Avaliable</button>
					<button className="link" onClick={() => this.changeFilter("Unaliable")}>Unaliable</button>
					<button className="link" onClick={() => this.changeFilter("New requests")}>New Requests </button>
				</div>
			</div>
		)
	};
}