import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {Col, Container, Row} from "reactstrap";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchUnit, removeSelectedUnit} from "store/slices/unitsSlice.ts";

const UnitPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const {unit} = useAppSelector((state) => state.units)

    useEffect(() => {
        dispatch(fetchUnit(id))
        return () => dispatch(removeSelectedUnit())
    }, []);

    if (!unit) {
        return (
            <div>

            </div>
        )
    }

    return (
        <Container>
            <Row>
                <Col md="6">
                    <img
                        alt=""
                        src={unit.image}
                        className="w-100"
                    />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{unit.name}</h1>
                    <pre className="fs-5" style={{whiteSpace: "pre-wrap"}}>Описание:<br/> {unit.description}</pre>
                    <p className="fs-5">Телефон: {unit.phone} </p>
                </Col>
            </Row>
        </Container>
    );
};

export default UnitPage