import { create } from "zustand";

interface INonSelectedFormIdState {
  form_ids: number[];
  addNewFormid: (formid: number) => void;
  removeFormid: (formid: number) => void;
}

export const useNonSelectedFormids = create<INonSelectedFormIdState>((set) => ({
  form_ids: [],

  addNewFormid: (formid) =>
    set((state) => ({
      form_ids: [...state.form_ids, formid],
    })),

  removeFormid: (formid) =>
    set((state) => ({
      form_ids: state.form_ids.filter((item) => item !== formid),
    })),
}));
