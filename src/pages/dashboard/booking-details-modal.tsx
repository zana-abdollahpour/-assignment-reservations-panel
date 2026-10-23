import { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import "jalaliday";

import { reservationSchema, zodFieldRule } from "./reservation.validation";
import type { Booking, BookingStatus, NewBookingValues } from "./types";
import { toEnglishDigits, toPersianDigits } from "@/utils/numbers.utils";
import { persianizePickerContent } from "@/utils/persian-picker.utils";

type BookingFormValues = NewBookingValues & { status: BookingStatus };

const statusOptions: { value: BookingStatus; label: string }[] = [
  { value: "تأییدشده", label: "تأییدشده" },
  { value: "در انتظار تأیید", label: "در انتظار تأیید" },
  { value: "لغوشده", label: "لغوشده" },
];

type Props = {
  booking: Booking | null;
  loading: boolean;
  onClose: () => void;
  onSave: (id: number, values: BookingFormValues) => Promise<void>;
};

export function BookingDetailsModal({
  booking,
  loading,
  onClose,
  onSave,
}: Props) {
  const [form] = Form.useForm<BookingFormValues>();
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (!booking) return;
    form.setFieldsValue({
      customer: booking.customer,
      phone: toPersianDigits(booking.phone),
      service: booking.service,
      date: dayjs(booking.date).calendar("jalali"),
      time: dayjs(`2000-01-01T${toEnglishDigits(booking.time)}`),
      status: booking.status,
    });
    setHasAttemptedSubmit(false);
  }, [booking, form]);

  function close() {
    form.resetFields();
    setHasAttemptedSubmit(false);
    onClose();
  }

  async function submit(values: BookingFormValues) {
    try {
      if (booking) await onSave(booking.id, values);
      form.resetFields();
      setHasAttemptedSubmit(false);
    } catch {
      // Keep the form open so the user can retry after a failed request.
    }
  }

  return (
    <Modal
      title="جزئیات رزرو"
      open={booking !== null}
      onCancel={close}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={submit}
        onFinishFailed={() => setHasAttemptedSubmit(true)}
        validateTrigger={hasAttemptedSubmit ? "onChange" : []}
        className="pt-3"
      >
        <Form.Item
          label="نام مشتری"
          name="customer"
          required
          rules={[zodFieldRule(reservationSchema.shape.customer)]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="شماره تماس"
          name="phone"
          required
          rules={[zodFieldRule(reservationSchema.shape.phone)]}
        >
          <Input inputMode="tel" />
        </Form.Item>
        <Form.Item
          label="نوع خدمت"
          name="service"
          required
          rules={[zodFieldRule(reservationSchema.shape.service)]}
        >
          <Input />
        </Form.Item>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            label="تاریخ"
            name="date"
            required
            rules={[{ required: true, message: "تاریخ را انتخاب کنید" }]}
          >
            <DatePicker
              className="w-full"
              cellRender={(_, info) => persianizePickerContent(info.originNode)}
              format={[
                (date) => toPersianDigits(date.format("YYYY/MM/DD")),
                "YYYY/MM/DD",
              ]}
            />
          </Form.Item>
          <Form.Item
            label="ساعت"
            name="time"
            required
            rules={[zodFieldRule(reservationSchema.shape.time)]}
          >
            <TimePicker
              className="w-full"
              format={[
                (time) => toPersianDigits(time.format("HH:mm")),
                "HH:mm",
              ]}
              showSecond={false}
              cellRender={(_, info) => persianizePickerContent(info.originNode)}
            />
          </Form.Item>
        </div>
        <Form.Item
          label="وضعیت"
          name="status"
          required
          rules={[{ required: true }]}
        >
          <Select options={statusOptions} />
        </Form.Item>
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={close}>{"انصراف"}</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {"ذخیره تغییرات"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
