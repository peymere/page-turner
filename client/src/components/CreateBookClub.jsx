import {useState, useEffect, useContext} from "react"
import { useParams, useNavigate } from "react-router-dom"
import {useFormik} from 'formik'
import * as Yup from 'yup'

// local imports
import { OutletContext } from './App'
import { Form } from "react-bootstrap"

function CreateBookClub() {
    const { id } = useParams();
    const navigate = useNavigate()
    const { loggedInUser, bookClubs } = useContext(OutletContext)

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            avatar_url: '',
            owner_id: loggedInUser?.id
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
        onSubmit: (values, {resetForm}) => {
            fetch('/bookclubs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            }).then((r) => {
                if (r.ok) {
                    r.json().then((bookClub) => {
                        console.log("Book Club created successfully", bookClub)
                        resetForm()
                        navigate(`/bookclubs/${bookClub.id}`)
                    })
                } else {
                    r.json().then((err) => {
                        console.log(err)
                    })
                }
            })
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
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter image URL" 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.avatar_url}
                    />
                    {formik.touched.avatar_url && formik.errors.avatar_url ? (
                        <div>{formik.errors.avatar_url}</div>
                    ) : null}
                </Form.Group>
                {loggedInUser ? (
                    <button type="submit">Submit</button>
                ) : (
                    <div>You must be <a href='/login'>logged in</a> to create a book club</div>
                ) }
                
            </Form>
        </div>
    )
}

export default CreateBookClub