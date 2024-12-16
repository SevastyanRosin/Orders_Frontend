import Header from "components/Header";
import Breadcrumbs from "components/Breadcrumbs";
import UnitPage from "pages/UnitPage";
import UnitsListPage from "pages/UnitsListPage";
import {Route, Routes} from "react-router-dom";
import {Container, Row} from "reactstrap";
import HomePage from "pages/HomePage";
import {useState} from "react";
import {T_Unit} from "modules/types.ts";

function App() {

    const [units, setUnits] = useState<T_Unit[]>([])

    const [selectedUnit, setSelectedUnit] = useState<T_Unit | null>(null)

    const [isMock, setIsMock] = useState(false);

    return (
        <>
            <Header/>
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs selectedUnit={selectedUnit}/>
                </Row>
                <Row>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/units/" element={<UnitsListPage units={units} setUnits={setUnits} isMock={isMock} setIsMock={setIsMock} />} />
                        <Route path="/units/:id" element={<UnitPage selectedUnit={selectedUnit} setSelectedUnit={setSelectedUnit} isMock={isMock} setIsMock={setIsMock} />} />
                    </Routes>
                </Row>
            </Container>
        </>
    )
}

export default App
