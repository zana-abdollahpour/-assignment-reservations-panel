import { cloneElement, isValidElement, useEffect, useState, type ReactElement, type ReactNode } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, TimePicker } from "antd";
import dayjs from "dayjs";
import "jalaliday";

import { reservationSchema, zodFieldRule } from "./reservation-validation";
import { initialBookings } from "./mock-data";
import type { Booking, BookingStatus, NewBookingValues } from "./types";
import { toEnglishDigits, toPersianDigits } from "@/utils/numbers.utils";

type BookingFormValues = NewBookingValues & { status: BookingStatus };

const statusOptions: { value: BookingStatus; label: string }[] = Array.from(
  new Set(initialBookings.map((booking) => booking.status)),
).map((status, index) => ({
  value: status,
  label: [
    "تأییدشده",
    "در انتظار تأیید",
    "لغوشده",
  ][index] ?? status,
}));

function persianizePickerContent(node: ReactNode): ReactNode {
  if (typeof node === "string" || typeof node === "number") {
    return toPersianDigits(String(node));
  }
  if (Array.isArray(node)) return node.map(persianizePickerContent);
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return cloneElement(
      node as ReactElement<{ children?: ReactNode }>,
      undefined,
      persianizePickerContent(node.props.children),
    );
  }
  return node;
}

type Props = {
  booking: Booking | null;
  onClose: () => void;
  onSave: (id: number, values: BookingFormValues) => void;
};

export function BookingDetailsModal({ booking, onClose, onSave }: Props) {
  const [form] = Form.useForm<BookingFormValues>();
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (!booking) return;
    form.setFieldsValue({
      customer: booking.customer,
      phone: booking.phone,
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

  function submit(values: BookingFormValues) {
    if (booking) onSave(booking.id, values);
    form.resetFields();
    setHasAttemptedSubmit(false);
  }

  return (
    <Modal title="جزئیات رزرو" open={booking !== null} onCancel={close} footer={null} destroyOnHidden>
      <Form form={form} layout="vertical" onFinish={submit} onFinishFailed={() => setHasAttemptedSubmit(true)} validateTrigger={hasAttemptedSubmit ? "onChange" : []} className="pt-3">
        <Form.Item label="نام مشتری" name="customer" required rules={[zodFieldRule(reservationSchema.shape.customer)]}><Input /></Form.Item>
        <Form.Item label="شماره تماس" name="phone" required rules={[zodFieldRule(reservationSchema.shape.phone)]}><Input inputMode="tel" /></Form.Item>
        <Form.Item label="نوع خدمت" name="service" required rules={[zodFieldRule(reservationSchema.shape.service)]}><Input /></Form.Item>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            label="تاریخ"
            name="date"
            required
            rules={[{ required: true, message: "تاریخ را انتخاب کنید" }]}
          >
            <DatePicker className="w-full" cellRender={(_, info) => persianizePickerContent(info.originNode)} format={[(date) => toPersianDigits(date.format("YYYY/MM/DD")), "YYYY/MM/DD"]} />
          </Form.Item>
          <Form.Item label="ساعت" name="time" required rules={[zodFieldRule(reservationSchema.shape.time)]}>
            <TimePicker className="w-full" format={[(time) => toPersianDigits(time.format("HH:mm")), "HH:mm"]} showSecond={false} cellRender={(_, info) => persianizePickerContent(info.originNode)} />
          </Form.Item>
        </div>
        <Form.Item label="وضعیت" name="status" required rules={[{ required: true }]}><Select options={statusOptions} /></Form.Item>
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={close}>{"انصراف"}</Button>
          <Button type="primary" htmlType="submit">{"ذخیره تغییرات"}</Button>
        </div>
      </Form>
    </Modal>
  );
}
