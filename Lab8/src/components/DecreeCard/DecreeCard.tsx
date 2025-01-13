import {Button, Card, Col, Row} from "reactstrap";
import {E_DecreeStatus, T_Decree} from "modules/types.ts";
import {formatDate} from "utils/utils.ts";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {acceptDecree, fetchDecrees, rejectDecree} from "store/slices/decreesSlice.ts";

type Props = {
    decree: T_Decree
    index: number
}

const DecreeCard = ({decree, index}:Props) => {

    const {is_superuser} = useAppSelector((state) => state.user)

    const dispatch = useAppDispatch()

    const handleAcceptDecree = async (decree_id) => {
        await dispatch(acceptDecree(decree_id))
        await dispatch(fetchDecrees())
    }

    const handleRejectDecree = async (decree_id) => {
        await dispatch(rejectDecree(decree_id))
        await dispatch(fetchDecrees())
    }

    const navigate = useNavigate()

    const openDecreePage = () => {
        navigate(`/decrees/${decree.id}`)
    }

    const STATUSES = {
        1: "Введен",
        2: "В работе",
        3: "Завершен",
        4: "Отменён",
        5: "Удалён"
    }

    return (
        <Card style={{padding: "10px"}}>
            <Row>
                <Col md={1}>
                    {index + 1}
                </Col>
                <Col md={1}>
                    {STATUSES[decree.status]}
                </Col>
                <Col md={1}>
                    {formatDate(decree.date)}
                </Col>
                <Col>
                    {formatDate(decree.date_created)}
                </Col>
                <Col>
                    {formatDate(decree.date_formation)}
                </Col>
                <Col>
                    {formatDate(decree.date_complete)}
                </Col>
                {!is_superuser &&
                    <Col>
                        <Button color="primary" onClick={openDecreePage}>Открыть</Button>
                    </Col>
                }
                {is_superuser &&
                    <>
                        <Col>
                            {decree.owner}
                        </Col>
                        <Col>
                            {decree.status == E_DecreeStatus.InWork && <Button color="primary" onClick={() => handleAcceptDecree(decree.id)}>Принять</Button>}
                        </Col>
                        <Col>
                            {decree.status == E_DecreeStatus.InWork && <Button color="danger" onClick={() => handleRejectDecree(decree.id)}>Отклонить</Button>}
                        </Col>
                    </>
                }
            </Row>
        </Card>
    )
}

export default DecreeCard