import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useOutletContext,  } from 'react-router-dom'
import { useState } from 'react';

function Login() {
    const setUser = useOutletContext()
    

    const loginSchema = Yup.object({
            email: Yup.string().email('Invalid Email Address'),
            username: Yup.string()
                .min(3, "Username must be between 3 and 15 characters")
                .max(15, "Username must be between 3 and 15 characters")
                .required('Username Required'),
            firstName: Yup.string()
                .min(2, "First Name must be at least 2 characters")
                ,
            lastName: Yup.string()
                .min(2, "Last name must be at least 2 characters")
                ,
        }
    )
    const passwordValidationSchema = Yup.object().shape({
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .max(20, 'Password must not exceed 20 characters')
            .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            ,
        });

    const combinedSchema = Yup.object().shape({
        ...loginSchema.fields,
        ...passwordValidationSchema.fields,
    });
    
    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: combinedSchema,
        onSubmit: (values, {resetForm}) => {
            console.log(values)
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            }).then((resp) => {
                if (resp.ok) {
                    console.log('submitted')
                    
                    resetForm({values: ''})
                    resp.json().then(({ user }) => {
                        setUser(user)
                        console.log(user)
                        // navigate into site
                    })
                } else { 
                    
                    console.log('errors? handle them')
                }
            })
        }
    })


    return (
        <div>
            <h1>Login</h1>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername" >
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Username" 
                    name='username' 
                    value={formik.values.username} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}/>
                    {formik.touched.username && formik.errors.username && (
                    <div className="error">{formik.errors.username}</div>
                    )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    name='password' 
                    value={formik.values.password} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}/>
                    {formik.touched.password && formik.errors.password && (
                    <div className="error">{formik.errors.password}</div>
                    )}
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </div>
    )
}

export default Login