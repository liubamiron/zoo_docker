import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Modal, Form } from "react-bootstrap";
import {createTagsData, deleteTagsById, getAllTags, updateTagsData} from "../../utils/apiCalls.js";

const Tags = () => {
    const [tags, setTags] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTag, setCurrentTag] = useState(null);
    const [formData, setFormData] = useState({ name_ru: '', name_ro: '', name_en: '' });

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await getAllTags();
                setTags(data);
            } catch (error) {
                console.error('Error fetching Type tags data:', error);
            }
        };

        getData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteTagsById(id);
            setTags((prevData) => prevData.filter(item => item.id !== id));
            console.log('Type tag deleted successfully');
        } catch (error) {
            console.error('Error deleting Type tag:', error);
        }
    };

    const handleCreateOrUpdate = async (event) => {
        event.preventDefault();
        try {
            if (isEditing) {
                await updateTagsData(currentTag.id, formData);
                setTags((prevData) => prevData.map(item => item.id === currentTag.id ? { ...item, ...formData } : item));
            } else {
                await createTagsData(formData);
                setTags((prevData) => [...prevData, { ...formData, id: Date.now() }]);
            }
            setShowModal(false);
            setFormData({ name_ru: '', name_ro: '', name_en: '' });
        } catch (error) {
            console.error('Error saving Type tag:', error);
        }
    };

    const handleEdit = (tag) => {
        setCurrentTag(tag);
        setFormData({ name_ru: tag.name_ru, name_ro: tag.name_ro, name_en: tag.name_en });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleCreate = () => {
        setCurrentTag(null);
        setFormData({ name_ru: '', name_ro: '', name_en: '' });
        setIsEditing(false);
        setShowModal(true);
    };

    return (
        <Container>
            <div className={'d-flex justify-content-between mt-4'}>
                <h2>Tag List</h2>
                <Button variant={'outline-success'} onClick={handleCreate}>
                    Create New Tag
                </Button>
            </div>
            <div className="mt-4"
                 style={{ background: 'lightcyan', padding: '15px', borderRadius: '8px' }}>
                <Row className="align-items-center" style={{ color: 'gray', fontWeight: 'bold' }}>
                    <Col>Tag RO</Col>
                    <Col>Tag RU</Col>
                    <Col>Tag EN</Col>
                    <Col>&nbsp;</Col>
                </Row>
                {tags.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            border: '1px solid white',
                            borderRadius: '8px',
                            padding: '10px',
                            marginBottom: '10px'
                        }}>
                        <Row className="align-items-center">
                            <Col>
                                <div
                                    className="me-2"
                                    onClick={() => handleEdit(item)}
                                    style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                    {item.name_ro}
                                    <img
                                        src={'/icons/pencil.svg'}
                                        alt="Edit"
                                        style={{ width: '20px', marginLeft: '10px', cursor: 'pointer' }}
                                    />
                                </div>
                            </Col>
                            <Col>
                                <div
                                    className="me-2"
                                    onClick={() => handleEdit(item)}
                                    style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                    {item.name_ru}
                                </div>
                            </Col>
                            <Col>
                                <div
                                    className="me-2"
                                    onClick={() => handleEdit(item)}
                                    style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                    {item.name_en}
                                </div>
                            </Col>
                            <Col className="text-end">
                                <Button
                                    variant={'outline-danger'}
                                    onClick={() => handleDelete(item.id)}
                                    style={{ borderRadius: '50%', padding: '5px' }}>
                                    <img src={'/icons/trash.svg'} alt="Delete" style={{ width: '20px' }} />
                                </Button>
                            </Col>
                        </Row>
                    </div>
                ))}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Type tag' : 'Create New Type tag'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateOrUpdate}>
                        <Form.Group controlId="name_ru" className="mb-3">
                            <Form.Label>Name RO</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name_ro}
                                onChange={(e) => setFormData({ ...formData, name_ro: e.target.value })}
                                placeholder="Enter Name RO"
                            />
                        </Form.Group>
                        <Form.Group controlId="name_ru" className="mb-3">
                            <Form.Label>Name RU</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name_ru}
                                onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                                placeholder="Enter Name RU"
                            />
                        </Form.Group>
                        <Form.Group controlId="name_en" className="mb-3">
                            <Form.Label>Name EN</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name_en}
                                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                                placeholder="Enter Name EN"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {isEditing ? 'Update Tag' : 'Create Tag'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Tags;
