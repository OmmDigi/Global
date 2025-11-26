import { create } from "zustand";

interface ISelectedFormids {
  form_ids: number[];
  addNewFormid: (formid: number | number[]) => void;
  removeFormid: (formid: number) => void;
  clear: () => void;
}

export const useSelectedFormIds = create<ISelectedFormids>((set) => ({
  form_ids: [],

  addNewFormid: (formid) => {
    if (Array.isArray(formid)) {
      return set((state) => ({
        form_ids: [...new Set([...state.form_ids, ...formid])],
      }));
    } else {
      return set((state) => ({
        form_ids: [...new Set([...state.form_ids, formid])],
      }));
    }
  },
  removeFormid: (formid) =>
    set((state) => ({
      form_ids: state.form_ids.filter((item) => item !== formid),
    })),

  clear: () => set((_) => ({ form_ids: [] })),
}));
