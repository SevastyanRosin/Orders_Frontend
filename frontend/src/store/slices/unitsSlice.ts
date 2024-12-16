import {createSlice} from "@reduxjs/toolkit";

type T_UnitsSlice = {
    unit_name: string
}

const initialState:T_UnitsSlice = {
    unit_name: "",
}


const unitsSlice = createSlice({
    name: 'units',
    initialState: initialState,
    reducers: {
        updateUnitName: (state, action) => {
            state.unit_name = action.payload
        }
    }
})

export const { updateUnitName} = unitsSlice.actions;

export default unitsSlice.reducer