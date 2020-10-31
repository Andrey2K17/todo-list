import React, {useState} from "react";
import {Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';

export default function AddElement({name, save, setName, onClickAdd, isAdd, isModal, tittleButton}) {
    return (
        <Form onSubmit={save} className="add-element">
            {
                isAdd ? (
                    <Button onClick={onClickAdd}>
                        {tittleButton}
                    </Button>
                ) : (
                    !isModal && (
                        <>
                            <Form.Control
                                type="text"
                                name="nameCategory"
                                placeholder="Ввести заголовок элемента"
                                onChange={setName}
                                value={name}
                            />
                            <Button variant="success" type="submit">
                                Добавить элемент
                            </Button>
                            <CloseIcon
                                className="category-components-icon"
                                onClick={onClickAdd}
                            />
                        </>
                    )
                )
            }
        </Form>
    )
}

AddElement.propTypes = {
    name: PropTypes.string,
    save: PropTypes.func,
    setName: PropTypes.func,
    onClickAdd: PropTypes.func.isRequired,
    isAdd: PropTypes.bool.isRequired,
    body: PropTypes.object,
    isModal: PropTypes.bool,
    tittleButton: PropTypes.string,
}

AddElement.defaultProps = {
    isModal: false,
    tittleButton: 'Добавить еще один элемент'
}
