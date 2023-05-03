import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dropzone from '../Dropzone';
import Progress from '../Progress';
import { Input } from '../Input';
import { setVerifyModal } from '../../actions/modalActions';

class Verify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            qrFiles: [],
            uploading: false,
            uploadProgress: {},
            successfullUploaded: false,
            name: '',
            ssn: '',
            res: {
                recieved: false,
                verified: false,
            },
            errors: {
                nameErrors: '',
                ssnErrors: '',
            },
            loading: false,
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

    onQRFilesAdded(files) {
        this.setState((prevState) => ({
            qrFiles: prevState.qrFiles.concat(files),
        }));
    }

    onInput(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    async uploadFiles(obj) {
        const { files, qrFiles } = this.state;
        this.setState({ uploadProgress: {}, uploading: true });
        const promises = [];
        promises.push(this.sendRequest(files, qrFiles, obj));
        // console.log('hello?')
        try {
            const ver = await Promise.all(promises);
            this.setState({
                successfullUploaded: true,
                uploading: false,
                res: {
                    recieved: true,
                    verified: ver[0].verified,
                },
                loading: false,
            });
        } catch (e) {
            // Not Production ready! Do some error handling here instead...
            this.setState({ successfullUploaded: true, uploading: false });
        }
    }

    sendRequest(files, qrFiles, obj) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();

            // eslint-disable-next-line func-names
            req.onload = function () {
                const res = JSON.parse(req.response);
                resolve(res);
            };

            req.upload.addEventListener('error', () => {
                reject(req.response);
            });

            const formData = new FormData();
            const entries = Object.entries(obj);
            for (const [name, value] of entries) {
                formData.append(name, value);
            }
            qrFiles.forEach((file) => {
                formData.append('file', file, `qrFile${file.name}`);
            });
            files.forEach((file) => {
                formData.append('file', file, file.name);
            });
            // console.log(qrFiles)
            req.open('POST', '/api/verify');
            req.send(formData);
        });
    }

    uploadData(e) {
        e.preventDefault();
        const {
            name, ssn, successfullUploaded,
        } = this.state;
        if (successfullUploaded) {
            this.setState({
                files: [],
                name: '',
                ssn: '',
                qrFiles: [],
                errors: {
                    nameErrors: '',
                    emailErrors: '',
                    otherErrors: '',
                    ssnErrors: '',
                },
                res: {
                    recieved: false,
                    verified: false,
                },
                successfullUploaded: false,
            });
        } else {
            this.setState({ loading: true });
            const errors = {};
            if (name === '') { errors.nameErrors = 'Name is required'; }
            if (ssn === '') { errors.ssnErrors = 'SSN is required'; }
            const obj = { name, ssn };
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

    renderVerify() {
        const { res, loading } = this.state;

        if (res.recieved) {
            if (res.verified) {
                return (
                    <div>
                        <span>Verified this payload is in chain</span>
                        <CheckCircleIcon className="true_icon" />

                    </div>
                );
            }
            return (
                <div>
                    <span>Not verified! This payload was not found in chain</span>
                    <CloseIcon className="false_icon" />
                </div>
            );
        }
        if (loading) {
            return (
                <CircularProgress style={{ width: '100px', height: '100px' }} />
            );
        }
        return (
            <></>
        );
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
            ssn,
            errors,
            uploading,
            successfullUploaded,
            qrFiles,
            files,
        } = this.state;
        const {
            verifyModal, setVerifyModalR,
        } = this.props;
        return (
            <Modal
                show={verifyModal}
                onHide={() => setVerifyModalR(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="verify_modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Verify
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="VerifyFormContainer">
                        <div className="Upload">
                            <Dropzone
                                onFilesAdded={(file) => this.onQRFilesAdded(file)}
                                disabled={uploading || successfullUploaded}
                                files={qrFiles}
                                renderProgress={(file) => this.renderProgress(file)}
                                renderActions={() => this.renderActions()}
                                infoText="Drag/select qr code file here"
                            />
                        </div>
                        <div className="Upload">
                            <Dropzone
                                onFilesAdded={this.onFilesAdded}
                                disabled={uploading || successfullUploaded}
                                files={files}
                                renderProgress={(file) => this.renderProgress(file)}
                                renderActions={() => this.renderActions()}
                                infoText="Drag/select files to verify here"
                            />
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
                                    {/* <input
                                type="submit"
                                value="Submit"
                                className="btn btn-primary"
                                style={{ float: 'right', marginTop: '10' }}
                            /> */}
                                </div>
                            </form>

                            {this.renderVerify()}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        );
    }
}

Verify.propTypes = {
    verifyModal: PropTypes.bool.isRequired,
    setVerifyModalR: PropTypes.func.isRequired,
};

const mapStateToProps = (reduxStoreState) => ({
    verifyModal: reduxStoreState.modal.showVerifyModal,
});

export default connect(mapStateToProps, { setVerifyModalR: setVerifyModal })(Verify);
