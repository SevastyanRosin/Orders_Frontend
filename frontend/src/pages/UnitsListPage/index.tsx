import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import UnitCard from "components/UnitCard";
import {ChangeEvent, FormEvent, useEffect} from "react";
import * as React from "react";
import {useAppSelector} from "src/store/store.ts";
import {updateUnitName} from "src/store/slices/unitsSlice.ts";
import {T_Unit} from "modules/types.ts";
import {UnitMocks} from "modules/mocks.ts";
import {useDispatch} from "react-redux";

type Props = {
    units: T_Unit[],
    setUnits: React.Dispatch<React.SetStateAction<T_Unit[]>>
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
}

const UnitsListPage = ({units, setUnits, isMock, setIsMock}:Props) => {

    const dispatch = useDispatch()

    const {unit_name} = useAppSelector((state) => state.units)

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateUnitName(e.target.value))
    }

    const createMocks = () => {
        setIsMock(true)
        setUnits(UnitMocks.filter(unit => unit.name.toLowerCase().includes(unit_name.toLowerCase())))
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        await fetchUnits()
    }

    const fetchUnits = async () => {
        try {
            const env = await import.meta.env;
            const response = await fetch(`${env.VITE_API_URL}/api/units/?unit_name=${unit_name.toLowerCase()}`)
            const data = await response.json()
            setUnits(data.units)
            setIsMock(false)
        } catch {
            createMocks()
        }
    }

    useEffect(() => {
        fetchUnits()
    }, []);

    return (
        <Container>
            <Row className="mb-5">
                <Col md="6">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs="8">
                                <Input value={unit_name} onChange={handleChange} placeholder="Поиск..."></Input>
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
                    <Col key={unit.id} sm="12" md="6" lg="4">
                        <UnitCard unit={unit} isMock={isMock} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default UnitsListPage