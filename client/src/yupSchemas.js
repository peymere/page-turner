import * as Yup from 'yup';

export const passwordValidationSchema = Yup.object().shape({
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

export const editPasswordValidationSchema = Yup.object().shape({
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(20, 'Password must not exceed 20 characters')
        .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]/,
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
        ),
    confirmPassword: Yup.string()
        .when('password', {
        is: password => password && password.length > 0,
        then: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Must confirm your password'),
        otherwise: Yup.string(),
        }),
});

export const signupSchema = Yup.object({
        email: Yup.string().email('Invalid Email Address').required ('Email Required'),
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
});

export const loginSchema = Yup.object({
        email: Yup.string().email('Invalid Email Address'),
        username: Yup.string()
            .min(3, "Username must be between 3 and 15 characters")
            .max(15, "Username must be between 3 and 15 characters")
            .required('Username Required'),
        firstName: Yup.string()
            .min(2, "First Name must be at least 2 characters"),
        lastName: Yup.string()
            .min(2, "Last name must be at least 2 characters"),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .max(20, 'Password must not exceed 20 characters')
            .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
});

export const editProfileSchema = Yup.object({
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
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .max(20, 'Password must not exceed 20 characters')
            .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]/,
            'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
        profile_pic: Yup.string()
            .url('Must be a valid URL'),
        about_me: Yup.string()
            .max(200, 'Must be less than 200 characters')
}); 