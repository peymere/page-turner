import { useEffect, useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// local imports
import { createEditProfileSchema } from '../yupSchemas';

const EditProfile = ({ loggedInUser, user, setUser, editedUser, setEditedUser }) => {
    // console.log(loggedInUser)
    // console.log("User:", user)
    const { id } = useParams();
    const [formErrors, setFormErrors] = useState(null);
    const [isNewPassword, setIsNewPassword] = useState(false);

    const handlePasswordChange = (e) => {
        formik.handleChange(e);
        setIsNewPassword(true);
    }

    const editProfileSchema = Yup.object().shape({
            email: Yup.string().email('Invalid Email Address'),
            username: Yup.string()
                .min(3, "Username must be between 3 and 15 characters")
                .max(15, "Username must be between 3 and 15 characters"),
            firstName: Yup.string()
                .min(2, "First Name must be at least 2 characters")
                .max(30, "First Name must be less than 30 characters"),
            lastName: Yup.string()
                .min(2, "Last name must be at least 2 characters")
                .max(30, "Last name must be less than 30 characters"),
            profile_pic: Yup.string()
                .url('Must be a valid URL'),
            about_me: Yup.string()
                .max(500, 'Must be less than 500 characters'),
            
    })

    const passwordValidationSchema = Yup.object({
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .max(20, 'Password must not exceed 20 characters')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]/,
                'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
            ),
        confirmPassword: isNewPassword ? Yup.string().required('Confirm password is required').oneOf([Yup.ref('password')], 'Passwords must match') : Yup.string()
    });

    const combinedSchema = Yup.object().shape({
        ...editProfileSchema.fields,
        ...passwordValidationSchema.fields,
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            profile_pic: '',
            about_me: '',
        },
        validationSchema: combinedSchema,
        onSubmit: (values, {resetForm, setStatus}) => {
            const isLoggedInUser = loggedInUser.id === user.id;
            const isNewValues = 
                values.email !== loggedInUser.email ||
                values.username !== loggedInUser.username ||
                values.firstName !== loggedInUser.first_name ||
                values.lastName !== loggedInUser.last_name ||
                values.profile_pic !== loggedInUser.profile_pic ||
                values.about_me !== loggedInUser.about_me;
            
            if (!isLoggedInUser) {
                setStatus('You can only edit your own profile');
                return;
            }

            if (!isNewValues) {
                setStatus('Must provide changes to update your profile');
                return;
            }

            fetch(`/users/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            }).then((r) => {
                if (!r.ok) {
                    r.json().then((data) => {
                    console.log('Server response:', data);
                    setFormErrors(data.error);
                });
                } else {
                    resetForm()
                    r.json().then((updatedUser) => {
                        setEditedUser(updatedUser);
                        setFormErrors(null);
                        console.log('User updated successfully', updatedUser);
                    });
                }
            })
            .catch((err) => {
                console.log('Error updating user:', err);
            });
        },
    });
    
    return(
        <div>
                <h3>Edit Profile</h3>
                {formErrors ? <div>{formErrors}</div> : null}
                <Form onSubmit={formik.handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} >
                            <Form.Label visuallyHidden>First Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder={`${user['first_name']}`} 
                                name="firstName"
                                onChange={formik.handleChange}
                                value={formik.values.firstName}
                            />
                            {formik.touched.firstName && formik.errors.firstName ? (
                                <div>{formik.errors.firstName}</div>
                            ) : null}
                        </Form.Group>

                        <Form.Group as={Col} >
                            <Form.Label visuallyHidden>Last Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder={`${user['last_name']}`}
                                name="lastName"
                                onChange={formik.handleChange}
                                value={formik.values.lastName} 
                            />
                            {formik.touched.lastName && formik.errors.lastName ? (
                                <div>{formik.errors.lastName}</div>
                            ) : null}
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} >
                            <Form.Label visuallyHidden>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder={`${user.email}`}
                                name="email" 
                                onChange={formik.handleChange}
                                value={formik.values.email}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div>{formik.errors.email}</div>
                            ) : null}
                        </Form.Group>

                        <InputGroup as={Col} >
                            <Form.Label visuallyHidden>Username</Form.Label>
                            <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                            <Form.Control 
                                type="text" 
                                placeholder={`${user.username}`} 
                                name="username"
                                onChange={formik.handleChange}
                                value={formik.values.username}
                            />
                            {formik.touched.username && formik.errors.username ? (
                                <div>{formik.errors.username}</div>
                            ) : null}
                        </InputGroup>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} >
                        <Form.Label visuallyHidden>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="New password" 
                            name="password"
                            onChange={handlePasswordChange}
                            value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div>{formik.errors.password}</div>
                        ) : null}
                        </Form.Group>

                        <Form.Group as={Col} >
                        <Form.Label visuallyHidden>Confirm password</Form.Label>
                        <Form.Control 
                        type="password" 
                        placeholder="Confirm new password"
                        name="confirmPassword" 
                        onChange={formik.handleChange}
                        value={formik.values.confirmPassword} />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                            <div>{formik.errors.confirmPassword}</div>
                        ) : null}
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" >
                        <Form.Label visuallyHidden>Profile Picture</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter image URL" 
                            name="profile_pic"
                            onChange={formik.handleChange}
                            value={formik.values.profile_pic}
                        />
                        {formik.touched.profile_pic && formik.errors.profile_pic ? (
                            <div>{formik.errors.profile_pic}</div>
                        ) : null}
                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Label visuallyHidden>About Me</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            placeholder="Tell us about yourself..."
                            name="about_me"
                            onChange={formik.handleChange}
                            value={formik.values.about_me}    
                        />
                        {formik.touched.about_me && formik.errors.about_me ? (
                            <div>{formik.errors.about_me}</div>
                        ) : null}
                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Check type="checkbox" label="Confirm Changes" required />
                    </Form.Group>
                    {formik.status && <div>{formik.status}</div>}
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
    )
}

export default EditProfile;