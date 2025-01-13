import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchUnits, updateUnitName} from "store/slices/unitsSlice.ts";
import {Link, useNavigate} from "react-router-dom";
import UnitsTable from "components/UnitsTable/UnitsTable.tsx";

const UnitsTablePage = () => {

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const {is_authenticated, is_superuser} = useAppSelector((state) => state.user)

    const {units, unit_name} = useAppSelector((state) => state.units)

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

    useEffect(() => {
        if (!is_superuser) {
            navigate("/403/")
        }
    }, [is_authenticated, is_superuser]);

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
                <Col className="d-flex flex-row justify-content-end" md="6">
                    <Link to="/units/add">
                        <Button color="primary">Создать подразделение</Button>
                    </Link>
                </Col>
            </Row>
            <Row className="mt-5 d-flex">
                {units.length > 0 ? <UnitsTable units={units} fetchUnits={fetchUnits}/> : <h3 className="text-center mt-5">Подразделения не найдены</h3>}
            </Row>
        </Container>
    );
};

export default UnitsTablePage