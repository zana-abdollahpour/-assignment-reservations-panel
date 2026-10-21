import {
  cloneElement,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Modal, TimePicker } from "antd";
import { reservationSchema, zodFieldRule } from "./reservation-validation";
import type { NewBookingValues } from "./types";
import { toPersianDigits } from "@/utils/numbers.utils";

function persianizePickerContent(node: ReactNode): ReactNode {
  if (typeof node === "string" || typeof node === "number") {
    return toPersianDigits(String(node));
  }

  if (Array.isArray(node)) {
    return node.map(persianizePickerContent);
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return cloneElement(
      node as ReactElement<{ children?: ReactNode }>,
      undefined,
      persianizePickerContent(node.props.children),
    );
  }

  return node;
}

type NewBookingModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (values: NewBookingValues) => void;
};

export function NewBookingModal({
  open,
  onClose,
  onCreate,
}: NewBookingModalProps) {
  const [form] = Form.useForm<NewBookingValues>();
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  function submit(values: NewBookingValues) {
    onCreate(values);
    form.resetFields();
    setHasAttemptedSubmit(false);
  }

  function close() {
    form.resetFields();
    setHasAttemptedSubmit(false);
    onClose();
  }

  return (
    <Modal
      title="ثبت رزرو جدید"
      open={open}
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
          <Input placeholder="مثلاً نگار احمدی" />
        </Form.Item>
        <Form.Item
          label="شماره تماس"
          name="phone"
          required
          rules={[zodFieldRule(reservationSchema.shape.phone)]}
        >
          <Input inputMode="tel" placeholder="۰۹۱۰۱۲۳۴۵۶۷" />
        </Form.Item>
        <Form.Item
          label="نوع خدمت"
          name="service"
          required
          rules={[zodFieldRule(reservationSchema.shape.service)]}
        >
          <Input placeholder="مثلاً مشاوره پوست" />
        </Form.Item>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            label="تاریخ"
            name="date"
            required
            rules={[zodFieldRule(reservationSchema.shape.date)]}
          >
            <DatePicker
              className="w-full"
              cellRender={(_, info) => persianizePickerContent(info.originNode)}
              format={[
                (date) => toPersianDigits(date.format("YYYY/MM/DD")),
                "YYYY/MM/DD",
              ]}
              placeholder="انتخاب تاریخ"
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
              placeholder="انتخاب ساعت"
            />
          </Form.Item>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={close}>انصراف</Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<ClockCircleOutlined />}
          >
            ثبت رزرو
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
