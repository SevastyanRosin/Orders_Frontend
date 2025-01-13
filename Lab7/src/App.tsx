import {Route, Routes} from "react-router-dom";
import {Container, Row} from "reactstrap";
import "./styles.css"
import HomePage from "pages/HomePage/HomePage.tsx";
import LoginPage from "pages/LoginPage/LoginPage.tsx";
import RegisterPage from "pages/RegisterPage/RegisterPage.tsx";
import UnitsListPage from "pages/UnitsListPage/UnitsListPage.tsx";
import UnitPage from "pages/UnitPage/UnitPage.tsx";
import DecreesPage from "pages/DecreesPage/DecreesPage.tsx";
import DecreePage from "pages/DecreePage/DecreePage.tsx";
import ProfilePage from "pages/ProfilePage/ProfilePage.tsx";
import Header from "components/Header/Header.tsx";
import Breadcrumbs from "components/Breadcrumbs/Breadcrumbs.tsx";

function App() {
    return (
        <div>
            <Header />
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs />
                </Row>
                <Row>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login/" element={<LoginPage />} />
                        <Route path="/register/" element={<RegisterPage />} />
                        <Route path="/units/" element={<UnitsListPage />} />
                        <Route path="/units/:id/" element={<UnitPage />} />
                        <Route path="/decrees/" element={<DecreesPage />} />
                        <Route path="/decrees/:id/" element={<DecreePage />} />
                        <Route path="/profile/" element={<ProfilePage />} />
                    </Routes>
                </Row>
            </Container>
        </div>
    )
}

export default App
