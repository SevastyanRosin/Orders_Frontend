import {useState} from "react";
import Header from "components/Header";
import Breadcrumbs from "components/Breadcrumbs";
import UnitPage from "pages/UnitPage";
import UnitsListPage from "pages/UnitsListPage";
import {Route, Routes} from "react-router-dom";
import {T_Unit} from "src/modules/types.ts";
import {Container, Row} from "reactstrap";
import HomePage from "pages/HomePage";
import "./styles.css"

function App() {

    const [units, setUnits] = useState<T_Unit[]>([])

    const [selectedUnit, setSelectedUnit] = useState<T_Unit | null>(null)

    const [isMock, setIsMock] = useState(false);

    const [unitName, setUnitName] = useState<string>("")

    return (
        <div>
            <Header/>
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs selectedUnit={selectedUnit} />
                </Row>
                <Row>
                    <Routes>
						<Route path="/" element={<HomePage />} />
                        <Route path="/units/" element={<UnitsListPage units={units} setUnits={setUnits} isMock={isMock} setIsMock={setIsMock} unitName={unitName} setUnitName={setUnitName}/>} />
                        <Route path="/units/:id" element={<UnitPage selectedUnit={selectedUnit} setSelectedUnit={setSelectedUnit} isMock={isMock} setIsMock={setIsMock}/>} />
                    </Routes>
                </Row>
            </Container>
        </div>
    )
}

export default App
