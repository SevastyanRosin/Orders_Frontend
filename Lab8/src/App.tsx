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
import AccessDeniedPage from "pages/AccessDeniedPage/AccessDeniedPage.tsx";
import NotFoundPage from "pages/NotFoundPage/NotFoundPage.tsx";
import Header from "components/Header/Header.tsx";
import Breadcrumbs from "components/Breadcrumbs/Breadcrumbs.tsx";
import UnitsTablePage from "pages/UnitsTablePage/UnitsTablePage.tsx";
import UnitEditPage from "pages/UnitEditPage/UnitEditPage.tsx";
import UnitAddPage from "pages/UnitAddPage/UnitAddPage.tsx";

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
                        <Route path="/units-table/" element={<UnitsTablePage />} />
                        <Route path="/units/:id/" element={<UnitPage />} />
                        <Route path="/units/:id/edit" element={<UnitEditPage />} />
                        <Route path="/units/add" element={<UnitAddPage />} />
                        <Route path="/decrees/" element={<DecreesPage />} />
                        <Route path="/decrees/:id/" element={<DecreePage />} />
                        <Route path="/profile/" element={<ProfilePage />} />
                        <Route path="/403/" element={<AccessDeniedPage />} />
                        <Route path="/404/" element={<NotFoundPage />} />
                        <Route path='*' element={<NotFoundPage />} />
                    </Routes>
                </Row>
            </Container>
        </div>
    )
}

export default App
