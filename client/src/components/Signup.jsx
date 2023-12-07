import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';
import * as Yup from 'yup'

function Signup() {

    const signupSchema = Yup.object({
            email: Yup.string().email('Invalid Email Address').required('Email Required'),
            username: Yup.string()
                .min(3, "Username must be between 3 and 15 characters")
                .max(15, "Username must be between 3 and 15 characters")
                .required('Username Required'),
            firstName: Yup.string()
                .min(2, "First Name must be at least 2 characters")
                .required('First Name Required'),
            lastName: Yup.string()
                .min(2, "Last name must be at least 2 characters")
                .required('Last name Required'),
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
            .required('Must confirm your password'),
        });

    const combinedSchema = signupSchema.concat(passwordValidationSchema)

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
        
        onSubmit: (values) => {
            console.log(values)}
    })

    return (
        <div>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsername">
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
                <Form.Group className="mb-3" controlId="formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="First name" 
                    name='firstName'
                    value={formik.values.firstName} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}/>
                    {formik.touched.firstName && formik.errors.firstName && (
                    <div className="error">{formik.errors.firstName}</div>
                    )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Last Name" 
                    name='lastName'
                    value={formik.values.lastName} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}/>
                    {formik.touched.lastName && formik.errors.lastName && (
                    <div className="error">{formik.errors.lastName}</div>
                    )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control 
                    type="email" 
                    placeholder="Enter email" 
                    name='email'
                    value={formik.values.email} 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                    <div className="error">{formik.errors.email}</div>
                    )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
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
                <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control 
                    type="password" 
                    placeholder="Confirm Password" 
                    name='confirmPassword' 
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}/>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className="error">{formik.errors.confirmPassword}</div>
                    )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={!formik.isValid}>
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default Signup;