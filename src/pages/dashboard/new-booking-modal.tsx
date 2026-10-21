import { ClockCircleOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Modal, TimePicker } from "antd";
import type { NewBookingValues } from "./types";

type NewBookingModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (values: NewBookingValues) => void;
};

export function NewBookingModal({ open, onClose, onCreate }: NewBookingModalProps) {
  const [form] = Form.useForm<NewBookingValues>();

  function submit(values: NewBookingValues) {
    onCreate(values);
    form.resetFields();
  }

  return (
    <Modal title="ثبت رزرو جدید" open={open} onCancel={onClose} footer={null} destroyOnHidden>
      <Form form={form} layout="vertical" onFinish={submit} className="pt-3">
        <Form.Item label="نام مشتری" name="customer" rules={[{ required: true, message: "نام مشتری را وارد کنید" }]}>
          <Input placeholder="مثلاً نگار احمدی" />
        </Form.Item>
        <Form.Item label="شماره تماس" name="phone" rules={[{ required: true, message: "شماره تماس را وارد کنید" }]}>
          <Input inputMode="tel" placeholder="۰۹۱۲ ۱۲۳ ۴۵۶۷" />
        </Form.Item>
        <Form.Item label="نوع خدمت" name="service" rules={[{ required: true, message: "نوع خدمت را وارد کنید" }]}>
          <Input placeholder="مثلاً مشاوره پوست" />
        </Form.Item>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item label="تاریخ" name="date" rules={[{ required: true, message: "تاریخ را انتخاب کنید" }]}>
            <DatePicker className="w-full" placeholder="انتخاب تاریخ" />
          </Form.Item>
          <Form.Item label="ساعت" name="time" rules={[{ required: true, message: "ساعت را انتخاب کنید" }]}>
            <TimePicker className="w-full" format="HH:mm" placeholder="انتخاب ساعت" />
          </Form.Item>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={onClose}>انصراف</Button>
          <Button type="primary" htmlType="submit" icon={<ClockCircleOutlined />}>
            ثبت رزرو
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
