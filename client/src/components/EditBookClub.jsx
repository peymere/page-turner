import { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// local imports
import ClubContext from './ClubContext';
import { OutletContext } from './App';
import styles from '../stylesheets/ClubProfile.module.css';


function EditBookClub() {
    const {id} = useParams();
    const club = useContext(ClubContext);
    const { loggedInUser } = useContext(OutletContext)
    const [formErrors, setFormErrors] = useState(null);
    const [editedClub, setEditedClub] = useState(null);
    const navigate = useNavigate();

    console.log(club)

    // Edit Club Schema
    const editClubSchema = Yup.object().shape({
        name: Yup.string()
            .trim("Name cannot include leading or trailing spaces or tabs")
            .min(3, "Name must be between 3 and 15 characters")
            .max(15, "Name must be between 3 and 15 characters")
            .notRequired(),
        description: Yup.string()
            .trim("Name cannot include leading or trailing spaces or tabs")
            .min(2, "Description must be at least 2 characters")
            .max(300, "Description must be less than 300 characters")
            .notRequired(),
        avatar_url: Yup.string()
            .matches(/(http(s?):)([/|.|\w|\s|-])*\.(?:png|jpg|gif|jpeg|svg)/, "Must be a valid URL")
            .notRequired(),
    }).test('atLeastOneField', 'Must update at least one field', (values) => {
        const {name, description, avatar_url} = values;
        const atLeastOneField = 
            name !== formik.initialValues.name ||
            description !== formik.initialValues.description ||
            avatar_url !== formik.initialValues.avatar_url;
        return atLeastOneField;
    })

    // Edit Club Formik
    const formik = useFormik({
        initialValues: {
            name: club?.name,
            description: club?.description,
            avatar_url: club?.avatar_url,
        },
        validationSchema: editClubSchema,
        onSubmit: (values, {resetForm, setStatus}) => {
            const isClubOwner = club.owner_id === loggedInUser?.id;
            const isNewValues = 
                values.name !== club.name ||
                values.description !== club.description ||
                values.avatar_url !== club.avatar_url;

            if (!isClubOwner) {
                setStatus('Must be the owner of the club to edit it');
                return;
            }

            if (!isNewValues) {
                setStatus('Must provide a new value to update the club');
                return;
            }
            fetch(`/bookclubs/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            }).then((r) => {
                if (!r.ok) {
                    r.json().then(({error}) => {
                        setFormErrors(error)
                    }); 
                } else {
                    resetForm()
                    r.json().then((updatedClub) => {
                        setEditedClub(updatedClub);
                        setFormErrors(null);
                        navigate(`/bookclubs/${updatedClub.id}`)
                        console.log('Club updated successfully', updatedClub);
                    });
                }
            })
        },
    })

    
    return (
        <div className={styles.edit_form_component}>
            <h3 className={styles.edit_title}>Edit Book Club</h3>
            {formErrors ? <div className={styles.edit_form_errors}>{formErrors}</div> : null}
            <Form onSubmit={formik.handleSubmit} className={styles.edit_form}>
                <div className={styles.edit_form_inputs}>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="name" className={styles.flex_container}>
                            <Form.Label className={styles.edit_form_label}>Book Club Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Enter a new club name"
                                className={`form-control input-placeholder-custom ${styles.formControl}`}
                                onChange={formik.handleChange}
                                value={formik.values.name}
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <div>{formik.errors.name}</div>
                            ) : null}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="avatar_url" className={styles.flex_container}>
                            <Form.Label className={styles.edit_form_label}>Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                name="avatar_url"
                                placeholder="Enter a new image URL"
                                className={`form-control input-placeholder-custom ${styles.formControl}`}
                                onChange={formik.handleChange}
                                value={formik.values.avatar_url}
                            />
                            {formik.touched.avatar_url && formik.errors.avatar_url ? (
                                <div>{formik.errors.avatar_url}</div>
                            ) : null}
                        </Form.Group>
                    </Col>
                    <Col className={styles.desc_col}>
                        <div>
                        <Form.Group controlId="description" className={styles.full_width}>
                            <Form.Label className={styles.edit_form_label}>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                rows={3}
                                className={`form-control input-placeholder-custom ${styles.formControl}`}
                                placeholder="Enter your club's description"
                                onChange={formik.handleChange}
                                value={formik.values.description}
                            />
                            {formik.touched.description && formik.errors.description ? (
                                <div>{formik.errors.description}</div>
                            ) : null}
                        </Form.Group>
                        </div>
                    </Col>
                </Row>
                </div>
                {formik.errors.atLeastOneField && <div>{formik.errors.atLeastOneField}</div>}
                {formik.status && <div className={styles.edit_form_errors}>{formik.status}</div>}
                <Button className={styles.edit_form_btn} type="submit">Submit</Button>
            </Form>
        </div>
    )
}

export default EditBookClub