import {useAppSelector} from "store/store.ts";
import {Card, Col, Row} from "reactstrap";
import DecreeCard from "components/DecreeCard/DecreeCard.tsx";
import {T_Decree} from "modules/types.ts";
import "./DecreeTable.css"

type Props = {
    decrees:T_Decree[]
}

const DecreesTable = ({decrees}:Props) => {

    const {is_superuser} = useAppSelector((state) => state.user)

    return (
        <div className="mb-5">
            <div className="mb-2" style={{fontWeight: "bold"}}>
                <Card style={{padding: "10px"}}>
                    <Row>
                        <Col md={1}>
                            №
                        </Col>
                        <Col md={1}>
                            Статус
                        </Col>
                        <Col md={1}>
                            Дата
                        </Col>
                        <Col>
                            Дата создания
                        </Col>
                        <Col>
                            Дата формирования
                        </Col>
                        <Col>
                            Дата завершения
                        </Col>
                        {!is_superuser &&
                            <Col>
                                Действие
                            </Col>
                        }
                        {is_superuser &&
                            <>
                                <Col>
                                    Пользователь
                                </Col>
                                <Col>
                                    Действие
                                </Col>
                                <Col>
                                    Действие
                                </Col>
                            </>
                        }
                    </Row>
                </Card>
            </div>
            <div className="d-flex flex-column gap-2">
                {decrees.map((decree, index) => (
                    <DecreeCard decree={decree} index={index} key={index}/>
                ))}
            </div>
        </div>
    )
};

export default DecreesTable