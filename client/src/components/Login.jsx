import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { EyeSlash } from 'react-bootstrap-icons';
import { Eye } from 'react-bootstrap-icons';

// local imports
import styles from '../stylesheets/Login.module.css'
import { OutletContext } from './App'

function Login() {
    const { setLoggedInUser } = useContext(OutletContext)
    const navigate = useNavigate()

    
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
        })

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
                        setLoggedInUser(user)
                        console.log(user)
                        // navigate into site
                        navigate('/home')
                    })
                } else { 
                    
                    console.log('errors? handle them')
                }
            })
        }
    })


    return (
        <div className={styles.login_container}>
        <div className={styles.components_container}>
            <div 
            className={styles.img_container}
            >
                <img className={styles.book_img} src="/src_images/login-books-in-hand.jpg" alt="stack of books in a hand"
                style={{

                }}
                />
            </div>
            <div className={styles.form_signin}>
            <div className={styles.form_header}>
            <h1>Login</h1>
            <h2>Welcome Back!</h2>
            </div>
            
            <Form onSubmit={formik.handleSubmit} className={styles.form_input_container}>
                <Form.Group className="" controlId="formBasicUsername" >
                    <Form.Control 
                    type="text" 
                    placeholder="Username" 
                    name='username' 
                    value={formik.values.username} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`form_control input-placeholder-custom ${styles.form_control}`}
                    />
                    {formik.touched.username && formik.errors.username && (
                    <div className="error">{formik.errors.username}</div>
                    )}
                </Form.Group>

                <Form.Group className="" controlId="formBasicPassword">
                    <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    name='password' 
                    value={formik.values.password} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`form_control input-placeholder-custom ${styles.form_control}`}
                    />
                    {formik.touched.password && formik.errors.password && (
                    <div className="error">{formik.errors.password}</div>
                    )}
                </Form.Group>
                <div className={styles.button_container}>
                <Button 
                variant="primary"
                disabled={!formik.isValid}
                className={styles.custom_btn} 
                type="submit">
                    Login
                </Button>
                </div>
            </Form>
            
            <p>
                Need an account?{' '}
                <NavLink to='/signup' style={{ color: '#929984' }}>
                    Sign Up!
                </NavLink>
            </p>
            </div>
        </div>
        </div>
    )
}


export default Login