import React, { Component } from 'react';

export default class ListUsers extends Component {
	state = {
		totalPages: this.props.totalPages,
		currentPage: this.props.page
	}

	render() {
		const totalPages = this.state.totalPages;
		const currentPage = this.state.currentPage;
		let listPages = [];

		if((currentPage > 0 && currentPage < 3) || totalPages < 5) {
			for (var a = 1; a < totalPages; a++) {
				if(a < 6)
					listPages.push(a);
			};
		} else if(totalPages > 5) {
			if(currentPage <= totalPages-2) {
				listPages.push(currentPage-2);
				listPages.push(currentPage-1);
				listPages.push(currentPage);
				listPages.push(currentPage+1);
				listPages.push(currentPage+2);
			} else if(currentPage <= totalPages-1) {
				listPages.push(currentPage-3);
				listPages.push(currentPage-2);
				listPages.push(currentPage-1);
				listPages.push(currentPage);
				listPages.push(currentPage+1);
			} else if(currentPage <= totalPages) {
				listPages.push(currentPage-4);
				listPages.push(currentPage-3);
				listPages.push(currentPage-2);
				listPages.push(currentPage-1);
				listPages.push(currentPage);
			}
		}

		return (
			<div data-component="pagination">
				<button className="link" onClick={() =>this.props.onClick(1)}>First page</button>
				{listPages.map(page => (
					<button key={page} className={`link ${page === this.state.currentPage}`} onClick={() =>this.props.onClick(page)}>{page}</button>
				))}
				<button className="link" onClick={() =>this.props.onClick(this.state.totalPages)}>Last page</button>
			</div>
		)
	};
}