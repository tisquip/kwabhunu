-- Enable Row Level Security on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE motor_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_receipt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authenticated admins
-- Clients
CREATE POLICY "Admins can view all clients" ON clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert clients" ON clients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update clients" ON clients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete clients" ON clients FOR DELETE TO authenticated USING (true);

-- Vehicle Types
CREATE POLICY "Admins can view all vehicle types" ON vehicle_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert vehicle types" ON vehicle_types FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update vehicle types" ON vehicle_types FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete vehicle types" ON vehicle_types FOR DELETE TO authenticated USING (true);

-- Vehicles
CREATE POLICY "Admins can view all vehicles" ON vehicles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert vehicles" ON vehicles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update vehicles" ON vehicles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete vehicles" ON vehicles FOR DELETE TO authenticated USING (true);

-- Motor Parts
CREATE POLICY "Admins can view all motor parts" ON motor_parts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert motor parts" ON motor_parts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update motor parts" ON motor_parts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete motor parts" ON motor_parts FOR DELETE TO authenticated USING (true);

-- Purchase Receipts
CREATE POLICY "Admins can view all purchase receipts" ON purchase_receipts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert purchase receipts" ON purchase_receipts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update purchase receipts" ON purchase_receipts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete purchase receipts" ON purchase_receipts FOR DELETE TO authenticated USING (true);

-- Purchase Receipt Items
CREATE POLICY "Admins can view all receipt items" ON purchase_receipt_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert receipt items" ON purchase_receipt_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update receipt items" ON purchase_receipt_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete receipt items" ON purchase_receipt_items FOR DELETE TO authenticated USING (true);

-- Next Maintenance
CREATE POLICY "Admins can view all maintenance" ON next_maintenance FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert maintenance" ON next_maintenance FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update maintenance" ON next_maintenance FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete maintenance" ON next_maintenance FOR DELETE TO authenticated USING (true);

-- Notification Types
CREATE POLICY "Admins can view notification types" ON notification_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert notification types" ON notification_types FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update notification types" ON notification_types FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete notification types" ON notification_types FOR DELETE TO authenticated USING (true);

-- Notification Logs
CREATE POLICY "Admins can view notification logs" ON notification_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert notification logs" ON notification_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update notification logs" ON notification_logs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete notification logs" ON notification_logs FOR DELETE TO authenticated USING (true);
