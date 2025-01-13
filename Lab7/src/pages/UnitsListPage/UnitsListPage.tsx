import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchUnits, updateUnitName} from "store/slices/unitsSlice.ts";
import UnitCard from "components/UnitCard/UnitCard.tsx";
import Bin from "components/Bin/Bin.tsx";

const UnitsListPage = () => {

    const dispatch = useAppDispatch()

    const {units, unit_name} = useAppSelector((state) => state.units)

    const {is_authenticated} = useAppSelector((state) => state.user)

    const {draft_decree_id, units_count} = useAppSelector((state) => state.decrees)

    const hasDraft = draft_decree_id != null

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateUnitName(e.target.value))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(fetchUnits())
    }

    useEffect(() => {
        dispatch(fetchUnits())
    }, [])

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
                {is_authenticated &&
                    <Col className="d-flex flex-row justify-content-end" md="6">
                        <Bin isActive={hasDraft} draft_decree_id={draft_decree_id} units_count={units_count} />
                    </Col>
                }
            </Row>
            <Row className="mt-5 d-flex">
                {units?.map(unit => (
                    <Col key={unit.id} className="mb-5 d-flex justify-content-center" sm="12" md="6" lg="4">
                        <UnitCard unit={unit} showAddBtn={is_authenticated} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default UnitsListPage