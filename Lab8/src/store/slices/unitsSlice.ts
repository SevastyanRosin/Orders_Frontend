import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {T_Unit, T_UnitAddData, T_UnitsListResponse} from "modules/types.ts";
import {api} from "modules/api.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AxiosResponse} from "axios";
import {saveDecree} from "store/slices/decreesSlice.ts";
import {Unit} from "src/api/Api.ts";

type T_UnitsSlice = {
    unit_name: string
    unit: null | T_Unit
    units: T_Unit[]
}

const initialState:T_UnitsSlice = {
    unit_name: "",
    unit: null,
    units: []
}

export const fetchUnit = createAsyncThunk<T_Unit, string, AsyncThunkConfig>(
    "fetch_unit",
    async function(id) {
        const response = await api.units.unitsRead(id) as AxiosResponse<T_Unit>
        return response.data
    }
)

export const fetchUnits = createAsyncThunk<T_Unit[], object, AsyncThunkConfig>(
    "fetch_units",
    async function(_, thunkAPI) {
        const state = thunkAPI.getState();
        const response = await api.units.unitsList({
            unit_name: state.units.unit_name
        }) as AxiosResponse<T_UnitsListResponse>

        thunkAPI.dispatch(saveDecree({
            draft_decree_id: response.data.draft_decree_id,
            units_count: response.data.units_count
        }))

        return response.data.units
    }
)

export const addUnitToDecree = createAsyncThunk<void, string, AsyncThunkConfig>(
    "units/add_unit_to_decree",
    async function(unit_id) {
        await api.units.unitsAddToDecreeCreate(unit_id)
    }
)

export const deleteUnit = createAsyncThunk<T_Unit[], string, AsyncThunkConfig>(
    "delete_unit",
    async function(unit_id) {
        const response = await api.units.unitsDeleteDelete(unit_id) as AxiosResponse<T_Unit[]>
        return response.data
    }
)

export const updateUnit = createAsyncThunk<void, object, AsyncThunkConfig>(
    "update_unit",
    async function({unit_id, data}) {
        await api.units.unitsUpdateUpdate(unit_id as string, data as Unit)
    }
)

export const updateUnitImage = createAsyncThunk<void, object, AsyncThunkConfig>(
    "update_unit_image",
    async function({unit_id, data}) {
        await api.units.unitsUpdateImageCreate(unit_id as string, data as {image?: File})
    }
)

export const createUnit = createAsyncThunk<void, T_UnitAddData, AsyncThunkConfig>(
    "update_unit",
    async function(data) {
        await api.units.unitsCreateCreate(data)
    }
)

const unitsSlice = createSlice({
    name: 'units',
    initialState: initialState,
    reducers: {
        updateUnitName: (state, action) => {
            state.unit_name = action.payload
        },
        removeSelectedUnit: (state) => {
            state.unit = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUnits.fulfilled, (state:T_UnitsSlice, action: PayloadAction<T_Unit[]>) => {
            state.units = action.payload
        });
        builder.addCase(fetchUnit.fulfilled, (state:T_UnitsSlice, action: PayloadAction<T_Unit>) => {
            state.unit = action.payload
        });
        builder.addCase(deleteUnit.fulfilled, (state:T_UnitsSlice, action: PayloadAction<T_Unit[]>) => {
            state.units = action.payload
        });
    }
})

export const { updateUnitName, removeSelectedUnit} = unitsSlice.actions;

export default unitsSlice.reducer