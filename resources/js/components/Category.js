import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import {Form} from "react-bootstrap";
import PropTypes from 'prop-types';
import ListGroup from "react-bootstrap/ListGroup";
import AddElement from "./AddElement";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import Button from "react-bootstrap/Button";
import CloseIcon from "@material-ui/icons/Close";

export default class Category extends Component {
    constructor() {
        super();
        this.state = {
            isShowEditHeaderForm: false,
            nameHeader: '',
        }
    }

    onClickChangeName = () => {
        this.setState({isShowEditHeaderForm: !this.state.isShowEditHeaderForm});
    }

    onChangeName = (e) => {
        this.setState({nameHeader: e.target.value});
    }

    header = (category) => {
        const {isShowEditHeaderForm, nameHeader} = this.state;
        const { onSaveName } = this.props;
        const name = nameHeader === '' ? category.name : nameHeader;
        return (
            isShowEditHeaderForm ? (
                    <>
                        <Form.Control
                            type="text"
                            name="name"
                            onChange={this.onChangeName}
                            value={name}
                        />
                        <Button variant="success" onClick={(e) => {onSaveName(e, name, category.id); this.onClickChangeName()}}>
                            Сохранить
                        </Button>
                        <CloseIcon
                            className="category-components-icon"
                            onClick={this.onClickChangeName}
                        />
                    </>
                )
                : (<div>
                        <h5>{name}</h5>
                        <EditIcon onClick={this.onClickChangeName}/>
                    </div>
                )
        )
    }

    render() {
        const {
            category,
            onClick,
            isShowModal,
            onDelete,
        } = this.props;

        return (
            <Card bg="Secondary">
                <Card.Header as="h5">{this.header(category)}</Card.Header>
                <Card.Body>
                    <ListGroup>
                        {
                            category.tasks && (category.tasks.map(task =>
                                <ListGroup.Item
                                    key={task.id}
                                    action
                                    onClick={() => onClick(task, category.id)}
                                >
                                    {task.date}
                                </ListGroup.Item>))
                        }
                    </ListGroup>
                    <div className="category-components-inline">
                        <AddElement
                            save={this.saveCategory}
                            setName={this.onChangeName}
                            onClickAdd={() => onClick({}, category.id)}
                            isAdd={!isShowModal}
                            tittleButton="Добавить задачу"
                            isModal
                        />
                        <DeleteForeverIcon onClick={() => onDelete(category.id)}/>
                    </div>
                </Card.Body>
            </Card>
        )
    }
}

Category.propTypes = {
    category: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        tasks: PropTypes.array,
    }),
    title: PropTypes.string,
    body: PropTypes.object,
    size: PropTypes.string,
    onClick: PropTypes.func,
    isShowModal: PropTypes.bool.isRequired,
    task: PropTypes.object,
    onDelete: PropTypes.func.isRequired,
    onSaveName: PropTypes.func.isRequired,
}

Category.defaultProps = {
    title: 'Добавить элемент',
    size: 'lg',
}
