import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import PropTypes from 'prop-types';

export default class EditModal extends Component {
    render() {
        const {
            isShowModal,
            body,
            title,
            size,
        } = this.props;

        return (
            <Modal show={isShowModal} size={size}>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {body}
                </Modal.Body>
            </Modal>
        )
    }
}

EditModal.propTypes = {
    isShowModal: PropTypes.bool.isRequired,
    title: PropTypes.string,
    body: PropTypes.object.isRequired,
    size: PropTypes.string,
}

EditModal.defaultProps = {
    title: 'Добавить элемент',
    size: 'lg',
}
