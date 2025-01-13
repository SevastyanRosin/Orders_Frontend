import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {
    deleteDraftDecree,
    fetchDecree,
    removeDecree, sendDraftDecree,
    triggerUpdateMM, updateDecree
} from "store/slices/decreesSlice.ts";
import {Button, Col, Form, Row} from "reactstrap";
import {E_DecreeStatus, T_Unit} from "modules/types.ts";
import UnitCard from "components/UnitCard/UnitCard.tsx";
import CustomInput from "components/CustomInput/CustomInput.tsx";
import {formatDate} from "utils/utils.ts";
import CustomTextarea from "components/CustomTextarea/CustomTextarea.tsx";

const DecreePage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const {is_authenticated, is_superuser} = useAppSelector((state) => state.user)

    const decree = useAppSelector((state) => state.decrees.decree)

    const [name, setName] = useState<string>(decree?.name)

    const [description, setDescription] = useState<string>(decree?.description)

    const [date, setDate] = useState<string>(decree?.date)

    useEffect(() => {
        if (!is_authenticated) {
            navigate("/403/")
        }
    }, [is_authenticated]);

    useEffect(() => {
        is_authenticated && dispatch(fetchDecree(id))
        return () => dispatch(removeDecree())
    }, []);

    useEffect(() => {
        setName(decree?.name)
        setDescription(decree?.description)
        setDate(decree?.date)
    }, [decree]);

    const sendDecree = async (e) => {
        e.preventDefault()

        await saveDecree()

        await dispatch(sendDraftDecree())

        navigate("/decrees/")
    }

    const saveDecree = async (e?) => {
        e?.preventDefault()

        const data = {
            name,
            description
        }

        await dispatch(updateDecree(data))
        await dispatch(triggerUpdateMM())
        await dispatch(triggerUpdateMM())
    }

    const deleteDecree = async () => {
        await dispatch(deleteDraftDecree())
        navigate("/units/")
    }

    if (!decree) {
        return (
            <></>
        )
    }

    const isDraft = decree.status == E_DecreeStatus.Draft
    const isCompleted = decree.status == E_DecreeStatus.Completed

    return (
        <Form onSubmit={sendDecree} className="pb-5">
            <h2 className="mb-5">{isDraft ? "Черновой приказ" : `Приказ №${id}` }</h2>
            <Row className="mb-5 fs-5 w-25">
                <CustomInput label="Название" placeholder="Введите название" value={name} setValue={setName} disabled={!isDraft || is_superuser}/>
                <CustomTextarea label="Описание" placeholder="Введите описание" value={description} setValue={setDescription} disabled={!isDraft}/>
                {isCompleted && <CustomInput label="Дата" value={formatDate(date)} disabled={true}/>}
            </Row>
            <Row>
                {decree.units.length > 0 ? decree.units.map((unit:T_Unit) => (
                    <Row key={unit.id} className="d-flex justify-content-center mb-5">
                        <UnitCard unit={unit} showRemoveBtn={isDraft} editMM={isDraft}/>
                    </Row>
                )) :
                    <h3 className="text-center">Подразделения не добавлены</h3>
                }
            </Row>
            {isDraft && !is_superuser &&
                <Row className="mt-5">
                    <Col className="d-flex gap-5 justify-content-center">
                        <Button color="success" className="fs-4" onClick={saveDecree}>Сохранить</Button>
                        <Button color="primary" className="fs-4" type="submit">Отправить</Button>
                        <Button color="danger" className="fs-4" onClick={deleteDecree}>Удалить</Button>
                    </Col>
                </Row>
            }
        </Form>
    );
};

export default DecreePage