import React, { Component } from 'react';

export default class TitlePage extends Component {
	render() {
		return (
			<div className="container-fluid" data-component="title-page">
				<div className="container">
					<h1 className="title">{this.props.title}</h1>
				</div>
			</div>
		)
	};
}
