-- KwaBhunu Auto Parts Management System Database Schema

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle types table (e.g., Nissan Caravan 2020)
CREATE TABLE IF NOT EXISTS vehicle_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  licence_plate_no TEXT NOT NULL UNIQUE,
  owner_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  vehicle_type_id UUID NOT NULL REFERENCES vehicle_types(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Motor parts table
CREATE TABLE IF NOT EXISTS motor_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oem_part_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase receipts table
CREATE TABLE IF NOT EXISTS purchase_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase receipt items (junction table for motor parts sold)
CREATE TABLE IF NOT EXISTS purchase_receipt_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id UUID NOT NULL REFERENCES purchase_receipts(id) ON DELETE CASCADE,
  motor_part_id UUID NOT NULL REFERENCES motor_parts(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Next maintenance table
CREATE TABLE IF NOT EXISTS next_maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  current_mileage INTEGER NOT NULL,
  date_of_next_maintenance DATE NOT NULL,
  date_actually_maintained DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification types enum table for extensibility (email, whatsapp, sms, etc.)
CREATE TABLE IF NOT EXISTS notification_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification log table to track sent notifications
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  maintenance_id UUID NOT NULL REFERENCES next_maintenance(id) ON DELETE CASCADE,
  notification_type_id UUID NOT NULL REFERENCES notification_types(id) ON DELETE RESTRICT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending',
  days_before INTEGER NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default notification types
INSERT INTO notification_types (name, is_active) VALUES 
  ('email', TRUE),
  ('whatsapp', FALSE),
  ('sms', FALSE)
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vehicles_owner_id ON vehicles(owner_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_driver_id ON vehicles(driver_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_vehicle_type_id ON vehicles(vehicle_type_id);
CREATE INDEX IF NOT EXISTS idx_purchase_receipts_vehicle_id ON purchase_receipts(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_purchase_receipt_items_receipt_id ON purchase_receipt_items(receipt_id);
CREATE INDEX IF NOT EXISTS idx_next_maintenance_vehicle_id ON next_maintenance(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_next_maintenance_date ON next_maintenance(date_of_next_maintenance);
CREATE INDEX IF NOT EXISTS idx_notification_logs_maintenance_id ON notification_logs(maintenance_id);
