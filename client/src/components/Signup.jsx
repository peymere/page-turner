import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useOutletContext, useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom';
import { EyeSlash } from 'react-bootstrap-icons';
import { Eye } from 'react-bootstrap-icons';

// local imports
import styles from '../stylesheets/Signup.module.css'
import { OutletContext } from './App'

function Signup() {
    const { setLoggedInUser } = useContext(OutletContext)
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(<Eye/>);
    const navigate = useNavigate()

    const handlePwViewToggle = () => {
        setType((prevType) => (prevType === 'password' ? 'text' : 'password'));
    };

    const signupSchema = Yup.object({
            email: Yup.string()
            .email('Invalid Email Address')
            .trim("Name cannot include leading or trailing spaces or tabs")
            .required('Email Required'),
            username: Yup.string()
                .min(3, "Username must be between 3 and 15 characters")
                .max(15, "Username must be between 3 and 15 characters")
                .trim("Name cannot include leading or trailing spaces or tabs")
                .required('Username Required'),
            firstName: Yup.string()
                .min(2, "First Name must be at least 2 characters")
                .trim("Name cannot include leading or trailing spaces or tabs")
                .required('First Name Required'),
            lastName: Yup.string()
                .min(2, "Last name must be at least 2 characters")
                .trim("Name cannot include leading or trailing spaces or tabs")
                .required('Last name Required'),
        }
    )
    const passwordValidationSchema = Yup.object().shape({
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .max(20, 'Password must not exceed 20 characters')
            .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]/,
            'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Must confirm your password'),
        });

    const combinedSchema = Yup.object().shape({
        ...signupSchema.fields,
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
            fetch('/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            }).then((r) => {
                console.log(values)
                if (r.ok) {
                    resetForm({values: ''})
                    r.json().then(({user}) => {
                        setLoggedInUser(user)
                        //navigate into site
                        navigate('/home')
                    })
                } else {
                    console.log('Error creating user')
                }
            })
        }
    })

    return (
        <div className={styles.signup_container}>
        <body>
            <main className={`${styles.formSignin} ${styles.bgGradient}`}>
                <h1>Create an Account</h1>
                <h2>Find Your Next Escape</h2>
                <Form onSubmit={formik.handleSubmit}>
                <Container className=''>
                    <Row className='mb-7'>
                    <Col md={6}>
                        <Form.Group 
                        className={styles.formGroup} 
                        controlId="formFirstName"
                        >
                            <Form.Control
                                type="text"
                                placeholder="First name"
                                name='firstName'
                                className={`form-control input-placeholder-custom ${styles.formControl}`}
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                tabIndex={1}
                                style={{
                                marginRight: '100px',
                                marginLeft: '-40px'
                            }}
                            />
                            {formik.touched.firstName && formik.errors.firstName && (
                                <div 
                                className="error"
                                style={{
                                    color: '#F0DAAE',
                                    fontFamily: 'Questrial, sans-serif',
                                    fontSize: '15px',
                                    marginLeft: '-30px',
                                    marginTop: '-12px',
                                }}>{formik.errors.firstName}</div>
                            )}
                        </Form.Group>

                        <Form.Group 
                        className={styles.formGroup} 
                        controlId="formUsername">
                        <Form.Control
                            type="text"
                            placeholder="Username"
                            name='username'
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control input-placeholder-custom ${styles.formControl}`}
                            tabIndex={3}
                            style={{
                                marginRight: '100px',
                                marginLeft: '-40px'
                            }}
                        />
                        {formik.touched.username && formik.errors.username && (
                            <div className="error"
                            style={{
                                color: '#F0DAAE',
                                fontFamily: 'Questrial, sans-serif',
                                fontSize: '16px',
                                marginLeft: '-30px',
                                marginTop: '-12px',
                            }}
                            >{formik.errors.username}</div>
                        )}
                        </Form.Group>
                        
                        <Form.Group 
                        className={styles.formGroup} 
                        controlId="formPassword">
                        
                            <div className={styles.relativePosition}>
                                <Form.Control
                                    type={type}
                                    placeholder="Password"
                                    name='password'
                                    dataToggle="password"
                                    className={`form-control input-placeholder-custom ${styles.formControl} ${styles.pwFormControl}`}
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                        marginRight: '100px',
                                    }}
                                    tabIndex={5}
                                />
                                <span className={styles.eyeIcon} style={{ color: '#F0DAAE' }} onClick={handlePwViewToggle}>
                                    {type === 'password' ? <Eye /> : <EyeSlash />}
                                </span>
                            </div>
                        
                        {formik.touched.password && formik.errors.password && (
                            <div className="error"
                            style={{
                                color: '#F0DAAE',
                                fontFamily: 'Questrial, sans-serif',
                                fontSize: '15px',
                                marginLeft: '-30px',
                                marginTop: '-12px',
                                width: '140%'
                            }}
                            >{formik.errors.password}</div>
                        )}
                        </Form.Group>

                    </Col>

                    <Col md={6}>
                        <Form.Group 
                        className={styles.formGroup} 
                        controlId="formLastName">
                            <Form.Control
                                type="text"
                                placeholder="Last Name"
                                name='lastName'
                                className={`form-control input-placeholder-custom ${styles.formControl}`}
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                tabIndex={2}
                                style={{marginLeft: '10px'}}
                            />
                            {formik.touched.lastName && formik.errors.lastName && (
                                <div className="error"
                                style={{
                                    color: '#F0DAAE',
                                    fontFamily: 'Questrial, sans-serif',
                                    fontSize: '16px',
                                    marginLeft: '17px',
                                    marginTop: '-12px',
                                }}
                                >{formik.errors.lastName}</div>
                            )}
                        </Form.Group>

                        <Form.Group 
                        className={styles.formGroup} 
                        controlId="formBasicEmail">
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name='email'
                                className={`form-control input-placeholder-custom ${styles.formControl}`}
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                tabIndex={4}
                                style={{marginLeft: '10px'}}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="error"
                                style={{
                                    color: '#F0DAAE',
                                    fontFamily: 'Questrial, sans-serif',
                                    fontSize: '16px',
                                    marginLeft: '17px',
                                    marginTop: '-12px',
                                }}
                                >{formik.errors.email}</div>
                            )}
                        </Form.Group>

                        <Form.Group 
                        className={styles.formGroup} 
                        controlId="formConfirmPassword">
                            <Form.Control
                                type="password"
                                placeholder="Confirm Password"
                                name='confirmPassword'
                                className={`form-control input-placeholder-custom ${styles.formControl}`}
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                tabIndex={6}
                                style={{
                                    marginLeft: '10px'
                                }}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <div className="error"
                                style={{
                                    color: '#F0DAAE',
                                    fontFamily: 'Questrial, sans-serif',
                                    fontSize: '15px',
                                    marginLeft: '17px',
                                    marginTop: '-12px',
                                    marginBottom: '20px',
                                    width: '140%'
                                }}
                                >{formik.errors.confirmPassword}</div>
                            )}
                        </Form.Group>
                    </Col>
                    </Row>
                </Container>

                <Button 
                variant="primary" 
                type="submit" 
                disabled={!formik.isValid}
                className={styles.custom_btn} >
                    Submit
                </Button>
                </Form>
                <p>
                Already have an account?{' '}
                <NavLink to='/login' className={styles.login_link} style={{ color: '#929984' }}>
                    Login
                </NavLink>
                </p>
            </main>
            
        </body>
    </div>

            





    );
}

export default Signup;



//         // <div className={styles.signup_container}>
        //     <main className='form-signin bg-opacity-25'>
        //         <h1>Create an Account</h1>
        //         <h2>Find Your Next Escape</h2>
        //         <Form onSubmit={formik.handleSubmit}>
        //             <div className='form-container'>
        //                 <Form.Group className="form-group" controlId="formFirstName">
        //                     <Form.Control 
        //                     type="text" 
        //                     placeholder="First name" 
        //                     name='firstName'
        //                     value={formik.values.firstName} 
        //                     onChange={formik.handleChange}
        //                     onBlur={formik.handleBlur}/>
        //                     {formik.touched.firstName && formik.errors.firstName && (
        //                     <div className="error">{formik.errors.firstName}</div>
        //                     )}
        //                 </Form.Group>

        //                 <Form.Group className="form-group" controlId="formLastName">
                            
        //                     <Form.Control 
        //                     type="text" 
        //                     placeholder="Last Name" 
        //                     name='lastName'
        //                     value={formik.values.lastName} 
        //                     onChange={formik.handleChange}
        //                     onBlur={formik.handleBlur}/>
        //                     {formik.touched.lastName && formik.errors.lastName && (
        //                     <div className="error">{formik.errors.lastName}</div>
        //                     )}
        //                 </Form.Group>

        //                 <Form.Group className="form-group" controlId="formUsername">
                            
        //                     <Form.Control 
        //                     type="text" 
        //                     placeholder="Username" 
        //                     name='username'
        //                     value={formik.values.username} 
        //                     onChange={formik.handleChange}
        //                     onBlur={formik.handleBlur}/>
        //                     {formik.touched.username && formik.errors.username && (
        //                     <div className="error">{formik.errors.username}</div>
        //                     )}
        //                 </Form.Group>

        //                 <Form.Group className="form-group" controlId="formBasicEmail">
                            
        //                     <Form.Control 
        //                     type="email" 
        //                     placeholder="Enter email" 
        //                     name='email'
        //                     value={formik.values.email} 
        //                     onChange={formik.handleChange} 
        //                     onBlur={formik.handleBlur}
        //                     />
        //                     {formik.touched.email && formik.errors.email && (
        //                     <div className="error">{formik.errors.email}</div>
        //                     )}
        //                 </Form.Group>

        //                 <Form.Group className="form-group" controlId="formPassword">
                            
        //                     <Form.Control 
        //                     type="password" 
        //                     placeholder="Password" 
        //                     name='password'
        //                     value={formik.values.password} 
        //                     onChange={formik.handleChange}
        //                     onBlur={formik.handleBlur}/>
        //                     {formik.touched.password && formik.errors.password && (
        //                     <div className="error">{formik.errors.password}</div>
        //                     )}
        //                 </Form.Group>
        //                 <Form.Group className="form-group" controlId="formConfirmPassword">
                            
        //                     <Form.Control 
        //                     type="password" 
        //                     placeholder="Confirm Password" 
        //                     name='confirmPassword' 
        //                     value={formik.values.confirmPassword}
        //                     onChange={formik.handleChange}
        //                     onBlur={formik.handleBlur}/>
        //                     {formik.touched.confirmPassword && formik.errors.confirmPassword && (
        //                     <div className="error">{formik.errors.confirmPassword}</div>
        //                     )}
        //                 </Form.Group>
        //             </div>

        //             <Button variant="primary" type="submit" disabled={!formik.isValid}>
        //                 Submit
        //             </Button>
        //         </Form>
        //         <p>Already have an account? <NavLink to='/login' style={{ color: '#929984' }}>Login</NavLink></p>
        //     </main>
        // </div>