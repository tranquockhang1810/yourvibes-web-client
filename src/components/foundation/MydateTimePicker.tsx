import { useAuth } from '@/context/auth/useAuth';
import { DatePicker, Modal } from 'antd';
import { on } from 'events';
import React, { useState } from 'react'
import dayjs from 'dayjs';

const MydateTimePicker = ({
    value,
    onCancel,
    show,
    onSubmit,
    maxDate,
    minDate,
  }: {
    value: Date;
    onCancel: () => void;
    onSubmit: (date: Date) => void;
    show: boolean;
    maxDate?: Date;
    minDate?: Date;
  }) => {
    const [date, setDate] = useState<Date>(value);
    const { localStrings } = useAuth();
    const [showDatePicker, setShowDatePicker] = useState(show);
    const handleChanged = (event: any, selecteđate?: Date) => {
        if(event.type === 'set'){
            const chosenDate = selecteđate || date;
            setDate(chosenDate);
            onSubmit(chosenDate);
        }else{
            onCancel();
        }};


    return (
    <div>
        <Modal
            open={showDatePicker}
            onCancel={handleChanged}
            onOk={handleChanged}
        >
            <DatePicker
                value={date}
                onChange={(date) => setDate(date)}
                showTime
                disabledDate={(current) => {
                    if (maxDate && current) {
                        return current > dayjs(maxDate);
                    }
                    if (minDate && current) {
                        return current < dayjs(minDate);
                    }
                    return false;
                }}
                minDate={minDate ? dayjs(minDate) : undefined}
            />
        </Modal>
    </div>
  )
}

export default MydateTimePicker