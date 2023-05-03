import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from '../Dropzone';
import Progress from '../Progress';
import { Input } from '../Input';
import { getPayloads } from '../../actions/payloadActions';

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            uploading: false,
            uploadProgress: {},
            successfullUploaded: false,
            name: '',
            email: '',
            other: '',
            ssn: '',
            errors: {
                nameErrors: '',
                emailErrors: '',
                otherErrors: '',
                ssnErrors: '',
            },
        };

        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
        this.renderActions = this.renderActions.bind(this);
    }

    onFilesAdded(files) {
        this.setState((prevState) => ({
            files: prevState.files.concat(files),
        }));
    }

    onInput(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    // eslint-disable-next-line class-methods-use-this
    sendRequest(files, obj) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();

            req.upload.addEventListener('load', () => {
                resolve(req.response);
            });

            req.upload.addEventListener('error', () => {
                reject(req.response);
            });

            const formData = new FormData();
            const entries = Object.entries(obj);
            for (const [name, value] of entries) {
                formData.append(name, value);
            }
            // console.log(formData);
            files.forEach((file) => {
                formData.append('file', file, file.name);
            });
            req.open('POST', '/api/payloads');
            req.send(formData);
        });
    }

    async uploadFiles(obj) {
        const {
            files,
        } = this.state;
        const {
            getPayloadsR,
        } = this.props;
        this.setState({ uploadProgress: {}, uploading: true });
        const promises = [];
        promises.push(this.sendRequest(files, obj));
        try {
            await Promise.all(promises);
            getPayloadsR(obj.user_id);
            this.setState({ successfullUploaded: true, uploading: false });
        } catch (e) {
            // Not Production ready! Do some error handling here instead...
            this.setState({ successfullUploaded: true, uploading: false });
        }
    }

    uploadData(e) {
        e.preventDefault();
        const {
            name, email, other, ssn, successfullUploaded,
        } = this.state;
        if (successfullUploaded) {
            this.setState({
                files: [],
                name: '',
                email: '',
                other: '',
                ssn: '',
                errors: {
                    nameErrors: '',
                    emailErrors: '',
                    otherErrors: '',
                    ssnErrors: '',
                },
                successfullUploaded: false,
            });
        } else {
            const {
                user,
            } = this.props;
            const errors = {};
            if (name === '') { errors.nameErrors = 'Name is required'; }
            if (email === '') { errors.emailErrors = 'Email is required'; }
            if (ssn === '') { errors.ssnErrors = 'SSN is required'; }
            const obj = {
                user_id: user.user_id, name, email, other, ssn, init_date: new Date().toISOString(),
            };
            if (Object.keys(errors).length > 0) {
                /* eslint-disable */
                this.setState({ ...this.state.errors, errors });
                /* eslint-enable */
            } else {
                this.uploadFiles(obj);
            }
        }
    }

    renderProgress(file) {
        const { uploadProgress, uploading, successfullUploaded } = this.state;
        const fileUploadProgress = uploadProgress[file.name];
        if (uploading || successfullUploaded) {
            return (
                <div className="ProgressWrapper">
                    <Progress progress={fileUploadProgress ? fileUploadProgress.percentage : 0} />
                    <img
                        className="CheckIcon"
                        alt="done"
                        src="baseline-check_circle_outline-24px.svg"
                        style={{
                            opacity:
                                fileUploadProgress && fileUploadProgress.state === 'done' ? 0.5 : 0,
                        }}
                    />
                </div>
            );
        }
        return (<></>);
    }

    renderActions() {
        const { successfullUploaded } = this.state;
        if (successfullUploaded) {
            return (
                <input
                    type="submit"
                    value="Clear"
                    className="btn btn-primary"
                    style={{ float: 'right', marginTop: '10' }}
                />
            );
        }
        return (
            <input
                type="submit"
                value="Submit"
                className="btn btn-primary"
                style={{ float: 'right', marginTop: '10' }}
            />
        );
    }

    render() {
        const {
            name,
            email,
            other,
            ssn,
            errors,
            uploading,
            successfullUploaded,
            files,
        } = this.state;
        return (
            <div className="UploadFormContainer">
                <div className="Upload">
                    <Dropzone
                        onFilesAdded={this.onFilesAdded}
                        disabled={uploading || successfullUploaded}
                        files={files}
                        renderProgress={(file) => this.renderProgress(file)}
                        renderActions={() => this.renderActions()}
                        infoText="Select files to upload"
                    />
                    {/* <div className="Actions">{this.renderActions()}</div> */}
                </div>
                <div className="MyForm">
                    <form onSubmit={(e) => this.uploadData(e)} className="form form-horizontal">
                        <Input
                            type="text"
                            value={name}
                            name="name"
                            htmlId="name"
                            label="Name"
                            size="small"
                            errorMessage={errors.nameErrors}
                            onInput={(e) => this.onInput(e)}
                        />
                        <Input
                            type="email"
                            value={email}
                            name="email"
                            htmlId="email"
                            label="Email"
                            size="small"
                            errorMessage={errors.emailErrors}
                            onInput={(e) => this.onInput(e)}
                        />
                        <Input
                            type="text"
                            value={other}
                            name="other"
                            htmlId="other"
                            label="Other"
                            size="small"
                            errorMessage={errors.otherErrors}
                            onInput={(e) => this.onInput(e)}
                        />
                        <div className="SsnContainer">
                            <Input
                                type="number"
                                value={ssn}
                                name="ssn"
                                htmlId="ssn"
                                label="ssn"
                                size="small"
                                errorMessage={errors.ssnErrors}
                                onInput={(e) => this.onInput(e)}
                            />

                            <div className="Actions">{this.renderActions()}</div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

Upload.defaultProps = {
    user: {},
};

Upload.propTypes = {
    user: PropTypes.shape(),
    getPayloadsR: PropTypes.func.isRequired,
};

const mapStateToProps = (reduxStoreState) => ({
    user: reduxStoreState.user.user,
});

export default connect(mapStateToProps, {
    getPayloadsR: getPayloads,
})(Upload);
