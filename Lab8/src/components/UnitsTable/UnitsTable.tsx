import {useNavigate} from "react-router-dom";
import {useMemo} from "react";
import {Button} from "reactstrap";
import {T_Unit} from "modules/types.ts";
import CustomTable from "components/CustomTable/CustomTable.tsx";
import {deleteUnit} from "store/slices/unitsSlice.ts";
import {useAppDispatch} from "store/store.ts";

type Props = {
    units:T_Unit[]
}

const UnitsTable = ({units}:Props) => {

    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const handleClick = (unit_id) => {
        navigate(`/units/${unit_id}`)
    }

    const openUnitEditPage = (unit_id) => {
        navigate(`/units/${unit_id}/edit`)
    }

    const handleDeleteUnit = async (unit_id) => {
        dispatch(deleteUnit(unit_id))
    }

    const columns = useMemo(
        () => [
            {
                Header: '№',
                accessor: 'id',
            },
            {
                Header: 'Название',
                accessor: 'name',
                Cell: ({ value }) => value
            },
            {
                Header: 'Телефон',
                accessor: 'phone',
                Cell: ({ value }) => value
            },
            {
                Header: "Действие",
                accessor: "edit_button",
                Cell: ({ cell }) => (
                    <Button color="primary" onClick={() => openUnitEditPage(cell.row.values.id)}>Редактировать</Button>
                )
            },
            {
                Header: "Удалить",
                accessor: "delete_button",
                Cell: ({ cell }) => (
                    <Button color="danger" onClick={() => handleDeleteUnit(cell.row.values.id)}>Удалить</Button>
                )
            }
        ],
        []
    )

    if (!units.length) {
        return (
            <></>
        )
    }

    return (
        <CustomTable columns={columns} data={units} onClick={handleClick} />
    )
};

export default UnitsTable