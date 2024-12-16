import * as React from 'react';
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {CardImg, Col, Container, Row} from "reactstrap";
import mockImage from "assets/mock.png";
import {T_Unit} from "modules/types.ts";
import {UnitMocks} from "modules/mocks.ts";

type Props = {
    selectedUnit: T_Unit | null,
    setSelectedUnit: React.Dispatch<React.SetStateAction<T_Unit | null>>,
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
}

const UnitPage = ({selectedUnit, setSelectedUnit, isMock, setIsMock}: Props) => {
    const { id } = useParams<{id: string}>();

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/units/${id}`)
            const data = await response.json()
            setSelectedUnit(data)
        } catch {
            createMock()
        }
    }

    const createMock = () => {
        setIsMock(true)
        setSelectedUnit(UnitMocks.find(unit => unit?.id == parseInt(id as string)) as T_Unit)
    }

    useEffect(() => {
        if (!isMock) {
            fetchData()
        } else {
            createMock()
        }

        return () => setSelectedUnit(null)
    }, []);

    if (!selectedUnit) {
        return (
            <div>

            </div>
        )
    }

    return (
        <Container>
            <Row>
                <Col md="6">
                    <CardImg src={isMock ? mockImage as string : selectedUnit.image} className="mb-3" />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{selectedUnit.name}</h1>
                    <pre className="fs-5" style={{whiteSpace: "pre-wrap"}}>Описание: {selectedUnit.description}</pre>
                    <p className="fs-5">Телефон: {selectedUnit.phone} </p>
                </Col>
            </Row>
        </Container>
    );
};

export default UnitPage