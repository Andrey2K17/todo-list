import React from 'react';
import {FieldArray, Formik} from 'formik';
import Button from "react-bootstrap/Button";
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import EditText from "./EditText";
import {Form, InputGroup, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";

const Performers = ({values}) => (
    <FieldArray
        name="performers"
        render={arrayHelpers => (
            <div className="performers-array">
                {values.performers && values.performers.length > 0 ? (
                    values.performers.map((performer, index) => (
                        <div
                            key={index}
                        >
                            <EditText
                                name={`performers.${index}.name`}
                                type="text"
                            />
                            <RemoveIcon
                                onClick={() => arrayHelpers.remove(index)}
                            />
                            <AddIcon
                                onClick={() => arrayHelpers.insert(index, '')}
                            />
                        </div>
                    ))
                ) : (
                    <Button className="margin-bottom" type="success" onClick={() => arrayHelpers.push('')}>
                        Добавить исполнителя
                    </Button>
                )}
            </div>
        )}
    />
)

const PerformerAction = ({values, handleChange}) => {

    return (
        <FieldArray
            name="performerActions"
            render={arrayHelpers => (
                <div>
                    {values.performerActions && values.performerActions.length > 0 ? (
                        values.performerActions.map((performerAction, index) => (
                            <div
                                key={index}
                            >
                                <Form.Row>
                                    <Form.Group as={Col} md="2">
                                        <Form.Control
                                            name={`performerActions.${index}.startTime`}
                                            type="time"
                                            value={performerAction.startTime}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="2">
                                        <Form.Control
                                            type="time"
                                            name={`performerActions.${index}.endTime`}
                                            value={performerAction.endTime}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="6">
                                        <Form.Control
                                            type="text"
                                            name={`performerActions.${index}.action`}
                                            value={performerAction.action}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="1">
                                        <Form.Check
                                            id={`performerActions.${index}.isCompleted`}
                                            name={`performerActions.${index}.isCompleted`}
                                            type="checkbox"
                                            checked={performerAction.isCompleted}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="1">
                                        <div className="flex-end">
                                            <InputGroup
                                                as={() => (
                                                    <RemoveIcon
                                                        onClick={() => arrayHelpers.remove(index)}
                                                    />
                                                )}
                                            />
                                            <InputGroup
                                                as={() => (
                                                    <AddIcon
                                                        onClick={() => arrayHelpers
                                                            .push({
                                                                startTime: '',
                                                                endTime: '',
                                                                action: '',
                                                                isCompleted: false
                                                            })
                                                        }
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Form.Group>
                                </Form.Row>
                            </div>
                        ))
                    ) : (
                        <Button
                            className="margin-bottom"
                            type="success"
                            onClick={() => arrayHelpers.push(
                                {startTime: '', endTime: '', action: '', isCompleted: false}
                            )
                            }>
                            Добавить действие
                        </Button>
                    )}
                </div>
            )}
        />
    )
};

const EditTaskForm = ({initValues, handleSubmit, onDelete, onExit}) => {

    return (
        <Formik
            initialValues={initValues}
            onSubmit={handleSubmit}
            render={({values, handleSubmit, handleChange}) => {

                return (
                    <Form
                        onSubmit={handleSubmit}
                    >
                        <Form.Row>
                            <Form.Group as={Col} md="4">
                                <Form.Label>Дата выполения</Form.Label>
                                <Form.Control
                                    name="date"
                                    type="date"
                                    onChange={handleChange}
                                    value={values.date}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md="8">
                                <Form.Label>Исполнители</Form.Label>
                                <Performers values={values}/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row className="without-margin-bottom">
                            <Form.Group as={Col} md="2">
                                <Form.Label>Начало</Form.Label>
                            </Form.Group>
                            <Form.Group as={Col} md="2">
                                <Form.Label>Окончание</Form.Label>
                            </Form.Group>
                            <Form.Group as={Col} md="6">
                                <Form.Label>Действие</Form.Label>
                            </Form.Group>
                            <Form.Group as={Col} md="2">
                                <Form.Label>Выполнение</Form.Label>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row></Form.Row>
                        <PerformerAction name="performerActions" values={values} handleChange={handleChange}/>
                        <div className="flex-center">
                            <Button type="submit">Сохранить</Button>
                            <Button variant="secondary" onClick={onExit}>Отмена</Button>
                            {initValues.id && (
                                <Button variant="danger" onClick={() => onDelete(initValues)}>Удалить</Button>
                            )}
                        </div>
                    </Form>
                )
            }}
        />
    )
};

export default EditTaskForm;
