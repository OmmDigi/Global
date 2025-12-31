import { create } from "zustand";

export interface ISelectedFormData {
  form_id: number;
  student_id: number;
}

interface ISelectedFormids {
  form_ids: number[];
  student_ids: number[];
  data: ISelectedFormData[];
  addItem: (data: ISelectedFormData | ISelectedFormData[]) => void;
  removeItem: (data: ISelectedFormData) => void;
  clear: () => void;
}

export const useSelectedForms = create<ISelectedFormids>((set) => ({
  form_ids: [],
  student_ids: [],
  data: [],

  addItem: (data) => {
    return set((state) => {
      if (Array.isArray(data))
        return { data: [...new Set([...state.data, ...data])] };
      return { data: [...new Set([...state.data, data])] };
    });
  },
  removeItem: (data: ISelectedFormData) =>
    set((state) => ({
      data: state.data.filter(
        (item) =>
          item.student_id != data.student_id && item.form_id !== data.form_id
      ),
    })),

  clear: () => set((_) => ({ data: [] })),
}));
