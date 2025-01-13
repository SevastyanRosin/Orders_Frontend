import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {T_Decree, T_DecreesFilters, T_Unit} from "modules/types.ts";
import {NEXT_MONTH, PREV_MONTH} from "modules/consts.ts";
import {api} from "modules/api.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AxiosResponse} from "axios";

type T_DecreesSlice = {
    draft_decree_id: number | null,
    units_count: number | null,
    decree: T_Decree | null,
    decrees: T_Decree[],
    filters: T_DecreesFilters,
    save_mm: boolean
}

const initialState:T_DecreesSlice = {
    draft_decree_id: null,
    units_count: null,
    decree: null,
    decrees: [],
    filters: {
        status: 0,
        date_formation_start: PREV_MONTH.toISOString().split('T')[0],
        date_formation_end: NEXT_MONTH.toISOString().split('T')[0]
    },
    save_mm: false
}

export const fetchDecree = createAsyncThunk<T_Decree, string, AsyncThunkConfig>(
    "decrees/decree",
    async function(decree_id) {
        const response = await api.decrees.decreesRead(decree_id) as AxiosResponse<T_Decree>
        return response.data
    }
)

export const fetchDecrees = createAsyncThunk<T_Decree[], object, AsyncThunkConfig>(
    "decrees/decrees",
    async function(_, thunkAPI) {
        const state = thunkAPI.getState()

        const response = await api.decrees.decreesList({
            status: state.decrees.filters.status,
            date_formation_start: state.decrees.filters.date_formation_start,
            date_formation_end: state.decrees.filters.date_formation_end
        }) as AxiosResponse<T_Decree[]>
        return response.data
    }
)

export const removeUnitFromDraftDecree = createAsyncThunk<T_Unit[], string, AsyncThunkConfig>(
    "decrees/remove_unit",
    async function(unit_id, thunkAPI) {
        const state = thunkAPI.getState()
        const response = await api.decrees.decreesDeleteUnitDelete(state.decrees.decree.id, unit_id) as AxiosResponse<T_Unit[]>
        return response.data
    }
)

export const deleteDraftDecree = createAsyncThunk<void, object, AsyncThunkConfig>(
    "decrees/delete_draft_decree",
    async function(_, {getState}) {
        const state = getState()
        await api.decrees.decreesDeleteDelete(state.decrees.decree.id)
    }
)

export const sendDraftDecree = createAsyncThunk<void, object, AsyncThunkConfig>(
    "decrees/send_draft_decree",
    async function(_, {getState}) {
        const state = getState()
        await api.decrees.decreesUpdateStatusUserUpdate(state.decrees.decree.id)
    }
)

export const updateDecree = createAsyncThunk<void, object, AsyncThunkConfig>(
    "decrees/update_decree",
    async function(data, {getState}) {
        const state = getState()
        await api.decrees.decreesUpdateUpdate(state.decrees.decree.id, {
            ...data
        })
    }
)

export const updateUnitValue = createAsyncThunk<void, object, AsyncThunkConfig>(
    "decrees/update_mm_value",
    async function({unit_id, meeting},thunkAPI) {
        const state = thunkAPI.getState()
        await api.decrees.decreesUpdateUnitUpdate(state.decrees.decree.id, unit_id, {meeting})
    }
)

const decreesSlice = createSlice({
    name: 'decrees',
    initialState: initialState,
    reducers: {
        saveDecree: (state, action) => {
            state.draft_decree_id = action.payload.draft_decree_id
            state.units_count = action.payload.units_count
        },
        removeDecree: (state) => {
            state.decree = null
        },
        triggerUpdateMM: (state) => {
            state.save_mm = !state.save_mm
        },
        updateFilters: (state, action) => {
            state.filters = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchDecree.fulfilled, (state:T_DecreesSlice, action: PayloadAction<T_Decree>) => {
            state.decree = action.payload
        });
        builder.addCase(fetchDecrees.fulfilled, (state:T_DecreesSlice, action: PayloadAction<T_Decree[]>) => {
            state.decrees = action.payload
        });
        builder.addCase(removeUnitFromDraftDecree.rejected, (state:T_DecreesSlice) => {
            state.decree = null
        });
        builder.addCase(removeUnitFromDraftDecree.fulfilled, (state:T_DecreesSlice, action: PayloadAction<T_Unit[]>) => {
            if (state.decree) {
                state.decree.units = action.payload as T_Unit[]
            }
        });
        builder.addCase(sendDraftDecree.fulfilled, (state:T_DecreesSlice) => {
            state.decree = null
        });
    }
})

export const { saveDecree, removeDecree, triggerUpdateMM, updateFilters } = decreesSlice.actions;

export default decreesSlice.reducer