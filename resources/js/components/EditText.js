import { useField } from 'formik';
import React from 'react';
import Form from 'react-bootstrap/Form';

const EditText = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <Form.Control
            {...field}
            {...props}
            isInvalid={meta.touched && meta.error}
        />
    );
};

export default EditText;
