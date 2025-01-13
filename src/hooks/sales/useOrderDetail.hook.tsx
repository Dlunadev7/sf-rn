// useOrderDetails.ts

import { useState, useCallback } from 'react';
import dayjs from 'dayjs';

interface OrderDetail {
  id: string;
  title: string;
  price: number;
  quantity: number;
  discount: number;
  type: string;
}

interface FormData {
  id: string;
  productsInOrder: unknown[];
}

interface UseOrderDetailsProps {
  setFormData: React.Dispatch<React.SetStateAction<FormData[]>>;
  setCounters: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setOpenCalendars: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setSelectedDetails: React.Dispatch<React.SetStateAction<OrderDetail[]>>;
  selectedDetails: OrderDetail[];
  counters: Record<string, number>;
  setFormDates: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const useOrderDetails = ({
  setFormData,
  setCounters,
  setOpenCalendars,
  setSelectedDetails,
  selectedDetails,
  counters,
  setFormDates,
}: UseOrderDetailsProps) => {
  // Handle selecting details (adding or updating)
  const handleDetailSelect = useCallback(
    ({ title, price, quantity, discount, type, id }: OrderDetail) => {
      const existingIndex = selectedDetails.findIndex((detail) => detail.id === id);
      if (existingIndex !== -1) {
        const updatedDetails = [...selectedDetails];
        updatedDetails[existingIndex] = {
          ...updatedDetails[existingIndex],
          quantity,
          discount,
        };
        setSelectedDetails(updatedDetails);
      } else {
        const newDetail = { id, title, price, quantity, discount, type };
        setSelectedDetails([...selectedDetails, newDetail]);
      }
    },
    [selectedDetails, setSelectedDetails],
  );

  // Handle removing details
  const removeDetail = useCallback(
    (id: string) => {
      setSelectedDetails((prevDetails) => {
        const updatedDetails = prevDetails.filter((item) => item.id !== id);

        setFormData((prevFormData) => prevFormData.filter((item) => item.id !== id));

        setCounters((prevCounters) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [id]: _, ...restCounters } = prevCounters;
          return restCounters;
        });

        return updatedDetails;
      });
    },
    [setFormData, setCounters, setSelectedDetails],
  );

  // Handle date change
  const onDateChange = useCallback(
    (date: Date, setFieldValue: (field: string, value: unknown) => void, formId: string) => {
      const formattedDate = dayjs(date).format('DD/MM/YYYY');
      setFormDates((prevDates) => ({
        ...prevDates,
        [formId]: formattedDate,
      }));

      setFieldValue('saleDate', formattedDate);
      setOpenCalendars((prevCalendars) => ({
        ...prevCalendars,
        [formId]: false,
      }));
    },
    [setFormDates, setOpenCalendars],
  );

  // Handle toggling the calendar
  const toggleCalendar = useCallback(
    (formId: string) => {
      setOpenCalendars((prev) => ({ ...prev, [formId]: !prev[formId] }));
    },
    [setOpenCalendars],
  );

  // Handle counter change (quantity)
  const handleCounterChange = useCallback(
    (newValue: number, detail: OrderDetail) => {
      const valueToSet = newValue > 0 ? newValue : 1;

      setCounters((prevCounters) => ({
        ...prevCounters,
        [detail.id]: valueToSet,
      }));

      const existingIndex = selectedDetails.findIndex((selectedDetail) => selectedDetail.id === detail.id);

      if (existingIndex !== -1) {
        const updatedDetails = [...selectedDetails];
        updatedDetails[existingIndex].quantity = valueToSet;
        setSelectedDetails(updatedDetails);
      } else {
        const newDetail = {
          id: detail.id,
          title: detail.title,
          price: detail.price,
          type: detail.type,
          quantity: valueToSet,
          discount: detail.discount,
        };
        setSelectedDetails([...selectedDetails, newDetail]);
      }
    },
    [selectedDetails, setCounters, setSelectedDetails],
  );

  // Handle discount change
  const handleChangeDiscount = useCallback(
    (value: string, detail: OrderDetail) => {
      if (value.length <= 3) {
        const updatedDetails = selectedDetails.map((item) => {
          if (item.id === detail.id) {
            return {
              ...item,
              discount: parseFloat(value) || 0,
            };
          }
          return item;
        });

        setSelectedDetails(updatedDetails);
      }
    },
    [selectedDetails, setSelectedDetails],
  );

  // Toggle accordion
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({});
  const toggleAccordion = useCallback((key: string) => {
    setOpenAccordions((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  }, []);

  return {
    handleDetailSelect,
    removeDetail,
    onDateChange,
    toggleCalendar,
    handleCounterChange,
    handleChangeDiscount,
    toggleAccordion,
    openAccordions,
  };
};

export default useOrderDetails;
