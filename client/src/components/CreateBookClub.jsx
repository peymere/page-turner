import {useState, useEffect, useContext} from "react"
import { useParams } from "react-router-dom"
import {useFormik} from 'formik'
import * as Yup from 'yup'

// local imports
import { OutletContext } from './App'
import { Form } from "react-bootstrap"

function CreateBookClub() {
    const { id } = useParams();
    const { loggedInUser, bookClubs } = useContext(OutletContext)

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            avatar_url: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(3, "Name must be between 3 and 15 characters")
                .max(15, "Name must be between 3 and 15 characters")
                .required('Name Required'),
            description: Yup.string()
                .min(2, "Description must be at least 2 characters")
                .max(300, "Description must be less than 300 characters"),
            avatar_url: Yup.string()
                .url("Must be a valid URL")
                ,
        }),
        onSubmit: (values) => {
            console.log(values)
        }
    
    })

    return (
        <div>
            <h1>Create a Book Club</h1>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter name" 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <div>{formik.errors.name}</div>
                    ) : null}
                </Form.Group>
                <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter description" 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                    />
                    {formik.touched.description && formik.errors.description ? (
                        <div>{formik.errors.description}</div>
                    ) : null}
                </Form.Group>
                <Form.Group className="mb-3" controlId="avatar_url">
                    <Form.Label>Avatar URL</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter avatar URL" 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.avatar_url}
                    />
                    {formik.touched.avatar_url && formik.errors.avatar_url ? (
                        <div>{formik.errors.avatar_url}</div>
                    ) : null}
                </Form.Group>
                <button type="submit">Submit</button>
            </Form>
        </div>
    )
}

export default CreateBookClub