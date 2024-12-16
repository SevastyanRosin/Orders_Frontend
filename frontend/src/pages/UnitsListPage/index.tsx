import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {T_Unit} from "src/modules/types.ts";
import UnitCard from "components/UnitCard";
import {UnitMocks} from "src/modules/mocks.ts";
import {FormEvent, useEffect} from "react";
import * as React from "react";

type Props = {
    units: T_Unit[],
    setUnits: React.Dispatch<React.SetStateAction<T_Unit[]>>
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
    unitName: string,
    setUnitName: React.Dispatch<React.SetStateAction<string>>
}

const UnitsListPage = ({units, setUnits, isMock, setIsMock, unitName, setUnitName}:Props) => {

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/units/?unit_name=${unitName.toLowerCase()}`)
            const data = await response.json()
            setUnits(data.units)
            setIsMock(false)
        } catch {
            createMocks()
        }
    }

    const createMocks = () => {
        setIsMock(true)
        setUnits(UnitMocks.filter(unit => unit.name.toLowerCase().includes(unitName.toLowerCase())))
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        if (isMock) {
            createMocks()
        } else {
            await fetchData()
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <Container>
            <Row className="mb-5">
                <Col md="6">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md="8">
                                <Input value={unitName} onChange={(e) => setUnitName(e.target.value)} placeholder="Поиск..."></Input>
                            </Col>
                            <Col>
                                <Button color="primary" className="w-100 search-btn">Поиск</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row>
                {units?.map(unit => (
                    <Col key={unit.id} xs="4">
                        <UnitCard unit={unit} isMock={isMock} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default UnitsListPage