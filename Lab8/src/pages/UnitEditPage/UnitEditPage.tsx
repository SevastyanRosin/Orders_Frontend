import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Button, Col, Container, Row} from "reactstrap";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {
    deleteUnit,
    fetchUnit,
    removeSelectedUnit,
    updateUnit,
    updateUnitImage
} from "store/slices/unitsSlice.ts";
import UploadButton from "components/UploadButton/UploadButton.tsx";
import CustomInput from "components/CustomInput/CustomInput.tsx";
import CustomTextarea from "components/CustomTextarea/CustomTextarea.tsx";

const UnitEditPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const {unit} = useAppSelector((state) => state.units)

    const {is_superuser} = useAppSelector((state) => state.user)

    const [name, setName] = useState<string>(unit?.name)

    const [description, setDescription] = useState<string>(unit?.description)

    const [phone, setPhone] = useState<number>(unit?.phone)

    useEffect(() => {
        if (!is_superuser) {
            navigate("/403/")
        }
    }, [is_superuser]);

    const navigate = useNavigate()

    const [imgFile, setImgFile] = useState<File>()
    const [imgURL, setImgURL] = useState<string>(unit?.image)

    const handleFileChange = (e) => {
        if (e.target.files) {
            const file = e.target?.files[0]
            setImgFile(file)
            setImgURL(URL.createObjectURL(file))
        }
    }

    const saveUnit = async() => {
        if (imgFile) {
            const form_data = new FormData()
            form_data.append('image', imgFile, imgFile.name)
            await dispatch(updateUnitImage({
                unit_id: unit.id,
                data: form_data
            }))
        }

        const data = {
            name,
            description,
            phone
        }

        await dispatch(updateUnit({
            unit_id: unit.id,
            data
        }))

        navigate("/units-table/")
    }

    useEffect(() => {
        dispatch(fetchUnit(id))
        return () => dispatch(removeSelectedUnit())
    }, []);

    useEffect(() => {
        setName(unit?.name)
        setDescription(unit?.description)
        setPhone(unit?.phone)
        setImgURL(unit?.image)
    }, [unit]);

    const handleDeleteUnit = async () => {
        await dispatch(deleteUnit(id))
        navigate("/units-table/")
    }

    if (!unit) {
        return (
            <div>

            </div>
        )
    }

    return (
        <Container>
            <Row>
                <Col md={6}>
                    <img src={imgURL} alt="" className="w-100"/>
                    <Container className="mt-3 d-flex justify-content-center">
                        <UploadButton handleFileChange={handleFileChange} />
                    </Container>
                </Col>
                <Col md={6}>
                    <CustomInput label="Название" placeholder="Введите название" value={name} setValue={setName}/>
                    <CustomTextarea label="Описание" placeholder="Введите описание" value={description} setValue={setDescription}/>
                    <CustomInput label="Телефон" placeholder="Введите телефон" value={phone} setValue={setPhone}/>
                    <Col className="d-flex justify-content-center gap-5 mt-5">
                        <Button color="success" className="fs-4" onClick={saveUnit}>Сохранить</Button>
                        <Button color="danger" className="fs-4" onClick={handleDeleteUnit}>Удалить</Button>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
};

export default UnitEditPage