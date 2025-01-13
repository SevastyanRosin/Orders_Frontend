import * as React from 'react';
import {Breadcrumb, BreadcrumbItem} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {useAppSelector} from "store/store.ts";

const Breadcrumbs = () => {

    const location = useLocation()

    const unit = useAppSelector((state) => state.units.unit)

    const decree = useAppSelector((state) => state.decrees.decree)

    const {is_superuser} = useAppSelector((state) => state.user)

    const crumbs = () => {

        if (location.pathname == '/') {
            return (
                <>
                    <BreadcrumbItem>
                        <Link to="/">
                            Главная
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (location.pathname == '/units/') {
            return (
                <>
                    <BreadcrumbItem>
                        <Link to={location.pathname}>
                            Подразделения
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (location.pathname == '/units-table/') {
            return (
                <>
                    <BreadcrumbItem>
                        <Link to={location.pathname}>
                            Таблица подразделений
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (location.pathname == '/units/add') {
            return (
                <>
                    <BreadcrumbItem>
                        <Link to={is_superuser ? "/units-table/" : "/units/"}>
                            Подразделения
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <Link to={location.pathname}>
                            Добавление подразделения
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (unit) {
            return (
                <>
                    <BreadcrumbItem>
                        <Link to={is_superuser ? "/units-table/" : "/units/"}>
                            Подразделения
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        <Link to={location.pathname}>
                            {unit.name}
                        </Link>
                    </BreadcrumbItem>
                </>
            )
        }

        if (decree) {
            return (
                <>
                    <BreadcrumbItem active>
                        <Link to="/decrees/">
                            Приказы
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        <Link to={location.pathname}>
                            Приказ №{decree?.id}
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (location.pathname == '/decrees/') {
            return (
                <>
                    <BreadcrumbItem active>
                        <Link to={location.pathname}>
                            Приказы
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (location.pathname == '/login/') {
            return (
                <>
                    <BreadcrumbItem active>
                        <Link to={location.pathname}>
                            Вход
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (location.pathname == '/register/') {
            return (
                <>
                    <BreadcrumbItem active>
                        <Link to={location.pathname}>
                            Регистрация
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (location.pathname == '/profile/') {
            return (
                <>
                    <BreadcrumbItem>
                        <Link to="/profile/">
                            Личный кабинет
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        return (
            <>
                <BreadcrumbItem>
                    <Link to="/">
                        Главная
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem></BreadcrumbItem>
            </>
        )
    };

    return (
        <Breadcrumb className="fs-5">
            {crumbs()}
        </Breadcrumb>
    );
};

export default Breadcrumbs