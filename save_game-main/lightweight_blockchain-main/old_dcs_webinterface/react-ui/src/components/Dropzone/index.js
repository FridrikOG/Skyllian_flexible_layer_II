import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UploadIcon from '../../assests/upload-icon.svg';

class Dropzone extends Component {
    constructor(props) {
        super(props);
        this.state = { hightlight: false };
        this.fileInputRef = React.createRef();

        this.openFileDialog = this.openFileDialog.bind(this);
        // this.onFilesAdded = this.onFilesAdded.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    onFilesAdded(evt) {
        // console.log('I am in onFilesAdded')
        const { disabled, onFilesAdded } = this.props;
        if (disabled) return;
        const { files } = evt.target;
        if (onFilesAdded) {
            const array = this.fileListToArray(files);
            onFilesAdded(array);
        }
    }

    onDragOver(event) {
        // console.log('I am in onDragOver')
        const { disabled } = this.props;
        event.preventDefault();
        if (disabled) return;
        this.setState({ hightlight: true });
    }

    onDragLeave() {
        // console.log('I am in onDragLeave')
        this.setState({ hightlight: false });
    }

    onDrop(event) {
        // console.log('I am in onDrop')
        const { disabled, onFilesAdded } = this.props;
        event.preventDefault();
        if (disabled) return;
        const { files } = event.dataTransfer;
        if (onFilesAdded) {
            const array = this.fileListToArray(files);
            onFilesAdded(array);
        }
        this.setState({ hightlight: false });
    }

    openFileDialog() {
        // console.log('I am in openFileDialog')
        // if (this.props.disabled) return;
        this.fileInputRef.current.click();
    }

    // eslint-disable-next-line class-methods-use-this
    fileListToArray(list) {
        // console.log('I am in fileListToArray')
        const array = [];
        for (let i = 0; i < list.length; i += 1) {
            array.push(list.item(i));
        }
        return array;
    }

    render() {
        const { hightlight } = this.state;
        const {
            disabled, files, renderProgress, infoText,
        } = this.props;
        return (
            <div
                className={`Dropzone ${hightlight ? 'Highlight' : ''}`}
                onDragOver={this.onDragOver}
                onDragLeave={this.onDragLeave}
                onDrop={this.onDrop}
                onClick={this.openFileDialog}
                style={{ cursor: disabled ? 'default' : 'pointer' }}
                role="button"
                tabIndex="-1"
            >
                <input
                    ref={this.fileInputRef}
                    className="FileInput"
                    type="file"
                    multiple
                    onChange={(e) => this.onFilesAdded(e)}
                    onClick={(event) => {
                        // eslint-disable-next-line no-param-reassign
                        event.target.value = null;
                    }}
                />
                <img
                    alt="upload"
                    className="Icon"
                    src={UploadIcon}
                />
                <div className="Files">
                    {
                        files.length > 0
                            ? files.map((file) => (
                                <div key={file.name} className="Row">
                                    <span className="Filename">{file.name}</span>
                                    {renderProgress(file)}
                                </div>
                            ))
                            : (
                                <span className="Filename">
                                    {infoText}
                                </span>
                            )
                    }
                </div>
            </div>
        );
    }
}

Dropzone.defaultProps = {
    files: [],
};

Dropzone.propTypes = {
    disabled: PropTypes.bool.isRequired,
    files: PropTypes.arrayOf(
        PropTypes.shape(),
    ),
    onFilesAdded: PropTypes.func.isRequired,
    renderProgress: PropTypes.func.isRequired,
    infoText: PropTypes.string.isRequired,
};

export default Dropzone;
