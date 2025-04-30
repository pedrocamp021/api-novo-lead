/*
  # Create leads table with updated schema

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `nome` (text, not null)
      - `telefone` (text, not null, unique)
      - `status` (text, not null)
      - `origem` (text)
      - `etapa_funil` (text)
      - `qualificacao` (text)
      - `notes` (text)
      - `entry_date` (timestamptz, not null)
      - `last_updated` (timestamptz, not null)
      - `is_new` (boolean, not null)

  2. Security
    - Enable RLS on `leads` table
    - Add policies for authenticated users to:
      - Read all leads
      - Insert new leads
      - Update existing leads
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  telefone text NOT NULL UNIQUE,
  status text NOT NULL,
  origem text,
  etapa_funil text,
  qualificacao text,
  notes text DEFAULT '',
  entry_date timestamptz NOT NULL,
  last_updated timestamptz NOT NULL,
  is_new boolean NOT NULL DEFAULT true
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all leads
CREATE POLICY "Users can read all leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert new leads
CREATE POLICY "Users can insert leads"
  ON leads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update leads
CREATE POLICY "Users can update leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (true);