import {Button, Card, CardBody, CardText, CardTitle, Col, Row} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {T_Unit} from "modules/types.ts";
import {useEffect, useState} from "react";
import CustomInput from "components/CustomInput/CustomInput.tsx";
import {addUnitToDecree, fetchUnits} from "store/slices/unitsSlice.ts";
import {removeUnitFromDraftDecree, updateUnitValue} from "store/slices/decreesSlice.ts";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.tsx";

type Props = {
    unit: T_Unit,
    showAddBtn?: boolean,
    showRemoveBtn?: boolean,
    editMM?: boolean,
}

const UnitCard = ({unit,  showAddBtn=false, showRemoveBtn=false, editMM=false}:Props) => {

    const dispatch = useAppDispatch()

    const {is_superuser} = useAppSelector((state) => state.user)

    const {save_mm} = useAppSelector(state => state.decrees)

    const [local_meeting, setLocal_meeting] = useState(unit.meeting)
    
    const location = useLocation()

    const isDecreePage = location.pathname.includes("decrees")

    const handeAddToDraftDecree = async () => {
        await dispatch(addUnitToDecree(unit.id))
        await dispatch(fetchUnits())
    }

    const handleRemoveFromDraftDecree = async () => {
        await dispatch(removeUnitFromDraftDecree(unit.id))
    }

    useEffect(() => {
        save_mm && updateValue()
    }, [save_mm]);

    const updateValue = async () => {
        dispatch(updateUnitValue({
            unit_id: unit.id,
            meeting: local_meeting
        }))
    }

    const options = {
        false: "Нет",
        true: "Да"
    }

    if (isDecreePage) {
        return (
            <Card key={unit.id}>
                <Row>
                    <Col>
                        <img
                            alt=""
                            src={unit.image}
                            style={{"width": "100%"}}
                        />
                    </Col>
                    <Col md={8}>
                        <CardBody>
                            <CardTitle tag="h5">
                                {unit.name}
                            </CardTitle>
                            <CardText>
                                Телефон: {unit.phone} 
                            </CardText>
                            <div className="w-25 mb-3">
                                <CustomDropdown label="Нужно совещание?" options={options} selectedItem={local_meeting as number} setSelectedItem={setLocal_meeting} disabled={!editMM || is_superuser} className={"w-100"}/>
                            </div>
                            <Col className="d-flex gap-5">
                                <Link to={`/units/${unit.id}`}>
                                    <Button color="primary" type="button">
                                        Открыть
                                    </Button>
                                </Link>
                                {showRemoveBtn &&
                                    <Button color="danger" onClick={handleRemoveFromDraftDecree}>
                                        Удалить
                                    </Button>
                                }
                            </Col>
                        </CardBody>
                    </Col>
                </Row>
            </Card>
        );
    }

    return (
        <Card key={unit.id} style={{width: '18rem' }}>
            <img
                alt=""
                src={unit.image}
                style={{"height": "200px"}}
            />
            <CardBody>
                <CardTitle tag="h5">
                    {unit.name}
                </CardTitle>
                <CardText>
                    Телефон: {unit.phone} 
                </CardText>
                <Col className="d-flex justify-content-between">
                    <Link to={`/units/${unit.id}`}>
                        <Button color="primary" type="button">
                            Открыть
                        </Button>
                    </Link>
                    {showAddBtn &&
                        <Button color="secondary" onClick={handeAddToDraftDecree}>
                            Добавить
                        </Button>
                    }
                </Col>
            </CardBody>
        </Card>
    );
};

export default UnitCard