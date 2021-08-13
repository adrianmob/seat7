import React, { Component } from 'react';
import { TimelineMax } from 'gsap';
// import api from '../../services/api';

export default class Teste extends Component {
	constructor (props) {
		super (props);
		
		this.state= {
			stateIndex: 0
		};
		
		this.updateState = this.updateState.bind(this);
		this.rerunAnimation = this.rerunAnimation.bind(this);
	}
			
	componentDidMount () {
		const boxes = this.container.querySelectorAll('.box');
		this.animation = new TimelineMax();
		this.animation.staggerFrom(boxes, 1, { scale: 0, rotation: 360 }, 0.3);
		this.animation.play();
	}
			
	rerunAnimation () {
		this.animation.progress(0).play();
	}
			
	updateState () {
		this.setState({ stateLabel: this.state.stateIndex++ })
	}

	render() {
		const { stateIndex } = this.state;

		return (
			<div className="body" ref={ el => { this.container = el; } }>
				<div className="box__container">
					<div className={ `box box-${stateIndex + 1}` }>Box { stateIndex + 1 }</div>
					<div className={ `box box-${stateIndex + 2}` }>Box { stateIndex + 2 }</div>
					<div className={ `box box-${stateIndex + 3}` }>Box { stateIndex + 3 }</div>
				</div>
				<button onClick={ this.rerunAnimation }>Rerun animation</button>
				<button onClick={ this.updateState }>Trigger state update</button>
				<p>Current state index: { stateIndex }</p>
			</div>
		);
	}
}

// React is loaded and is available as React and ReactDOM
// imports should NOT be used
// const CommentList = (props) => {
//   let list = [];

//   const hendleSubmit = async (e) => {
// 		e.preventDefault();

// 		const val = document.querySelector("input[type='text']").value;

// 		list.push({
// 			id: list.length,
// 			text: val
// 		})
// 	}

//   return (<div>
//       <form onSubmit={this.hendleSubmit()}>
//         <input type="text"/>
//         <input type="button" value="Post" />
//       </form>

//       <ul>
//         { list.map(item => (
//           <li key={item.id}>{item.text}</li>
//         ))}
//       </ul>
//     </div>);
// }

// document.body.innerHTML = "<div id='root'> </div>";
  
// const rootElement = document.getElementById("root");
// ReactDOM.render(<CommentList />, rootElement);
                
// var input = document.querySelector("input[type='text']");
// input.value = "test";
// input._valueTracker.setValue("");
// input.dispatchEvent(new Event('change', { bubbles: true }));

// document.querySelector("input[type='button']").click();
// console.log(document.getElementsByTagName("ul")[0].innerHTML);