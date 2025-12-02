export interface Client {
  id: string
  full_name: string
  email: string
  phone_number: string
  address: string
  created_at: string
  updated_at: string
}

export interface VehicleType {
  id: string
  name: string
  model: string
  year: number
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: string
  licence_plate_no: string
  owner_id: string
  driver_id: string | null
  vehicle_type_id: string
  created_at: string
  updated_at: string
  owner?: Client
  driver?: Client
  vehicle_type?: VehicleType
}

export interface MotorPart {
  id: string
  oem_part_number: string
  name: string
  description: string | null
  price: number
  created_at: string
  updated_at: string
}

export interface PurchaseReceipt {
  id: string
  vehicle_id: string
  total_amount: number
  created_at: string
  updated_at: string
  vehicle?: Vehicle
  items?: PurchaseReceiptItem[]
}

export interface PurchaseReceiptItem {
  id: string
  receipt_id: string
  motor_part_id: string
  quantity: number
  unit_price: number
  created_at: string
  motor_part?: MotorPart
}

export interface NextMaintenance {
  id: string
  vehicle_id: string
  current_mileage: number
  date_of_next_maintenance: string
  date_actually_maintained: string | null
  created_at: string
  updated_at: string
  vehicle?: Vehicle
}

export interface NotificationType {
  id: string
  name: string
  is_active: boolean
  created_at: string
}

export interface NotificationLog {
  id: string
  maintenance_id: string
  notification_type_id: string
  sent_at: string
  status: string
  days_before: number
  message: string | null
  created_at: string
}
