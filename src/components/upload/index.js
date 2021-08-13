import React, { Component } from 'react';

//images
import iconFile from '../../assets/img/icons/icon-upload-file.png';

export default class Upload extends Component {
  constructor(props){
    super(props)
    this.state = {
			saved: false,
			file: null,
			fileName: "Choose a image"
    }
    this.handleChange = this.handleChange.bind(this)
	}

  handleChange(event) {
		if(event.target.files[0]) {
			this.setState({
				saved: true,
				file: URL.createObjectURL(event.target.files[0]),
				fileName: event.target.files[0].name
			})
			
			this.props.handleClick(URL.createObjectURL(event.target.files[0]), event.target.files[0]);
		}
	}

  render() {
		let imgPreview;
		if (this.props.imgPreview) {
			imgPreview = <img src={this.props.imgPreview} alt="Imagem preview"/>
		}

		// if(this.props.imgSaved === true && this.state.saved) {
		// 	this.setState({
		// 		saved: false,
		// 		file: null,
		// 		fileName: 'Choose a image'
		// 	})
		// }

    return (
      <div className="label input-file" data-component="upload-image">
				<p className="label-text">{this.props.title}</p>

        <input
					type="file"
					id={this.props.id}
					name={this.props.id}
					onChange={this.handleChange}
					accept="image/png, image/jpeg"
				/>

				<label htmlFor={this.props.id} className="upload-image-label">
					<div className={`input-file-image ${this.props.imgPreview ? "active" : ""}`} data-size={this.props.size}>
						{imgPreview}
					</div>

					<div className="input-file-content">
						<img className="input-file-icon" src={iconFile} alt="icon file"/>
						<span className="text">
							{ this.props.imgPreview &&
								this.state.fileName
							}
							{ !this.props.imgPreview &&
								"Choose a image"
							}
						</span>
					</div>
				</label>
      </div>
    );
  }
}