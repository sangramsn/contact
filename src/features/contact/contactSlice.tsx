import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Contact {
  first_name: string;
  last_name: string;
  job: string;
  description: string;
}

export interface addContact {
  contact: Contact;
}

export interface ContactUpdate {
  id:string,
  first_name: string;
  last_name: string;
  job: string;
  description: string;
}

export interface updateContact {
  info: ContactUpdate;
}


export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async () => {
    const response = await axios.get("http://localhost:4000/api/contacts"); // Replace with your API endpoint
    return response.data;
  }
);

export const addContact = createAsyncThunk<Contact, { contact: Contact }>(
  "contacts/addContact",
  async (contactData) => {
    const contact: addContact = {
      contact: {
        first_name: contactData.contact.first_name,
        last_name: contactData.contact.last_name,
        job: contactData.contact.job,
        description: contactData.contact.description,
      },
    };

    debugger;

    const response = await axios.post<Contact>(
      "http://localhost:4000/api/contacts",
      contact
    );
    return response.data;
  }
);

export const editContact = createAsyncThunk<ContactUpdate, { contact: ContactUpdate }>(
  "contacts/addContact",
  async (contactData:any) => {
    const editContact = {
      info : contactData.contact
    }
    const response = await axios.patch<ContactUpdate>(
      `http://localhost:4000/api/contacts/${editContact.info.id}`,
      editContact
    );
    return response.data;
  }
);

export const deleteContact = createAsyncThunk<ContactUpdate, { id:any }>(
  "contacts/addContact",
  async (id:any) => {
    const response = await axios.delete<ContactUpdate>(
      `http://localhost:4000/api/contacts/${id}`
    );
    return response.data;
  }
);



const contactSlice = createSlice({
  name: "contacts",
  initialState: {
    contacts: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.contacts = action.payload.data;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = "failed";
        // state.error = action.error.message ?? 'An error occurred';
      });
  },
});

export default contactSlice.reducer;
