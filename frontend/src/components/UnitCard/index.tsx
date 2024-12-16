import {Button, Card, CardBody, CardImg, CardText, CardTitle} from "reactstrap";
import mockImage from "assets/mock.png";
import {Link} from "react-router-dom";
import {T_Unit} from "modules/types.ts";

interface UnitCardProps {
    unit: T_Unit,
    isMock: boolean
}

const UnitCard = ({unit, isMock}: UnitCardProps) => {
    return (
        <Card key={unit.id} style={{width: '18rem', margin: "0 auto 50px", height: "calc(100% - 50px)" }}>
            <CardImg
                src={isMock ? mockImage as string : unit.image}
                style={{"height": "200px"}}
            />
            <CardBody className="d-flex flex-column justify-content-between">
                <CardTitle tag="h5">
                    {unit.name}
                </CardTitle>
                <CardText>
                    Телефон: {unit.phone} 
                </CardText>
                <Link to={`/units/${unit.id}`}>
                    <Button color="primary">
                        Открыть
                    </Button>
                </Link>
            </CardBody>
        </Card>
    );
};

export default UnitCard