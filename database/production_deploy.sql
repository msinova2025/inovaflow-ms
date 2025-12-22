-- MS INOVA MAIS - Production Deployment Script
-- Includes:
-- 1. Full Database Schema (Tables, Types, Triggers)
-- 2. Initial Data (Geral settings, Admin User)
-- 3. Access Permissions (GRANTS) for Application Users

-- ==================================================================================
-- PART 1: SCHEMA AND DATA
-- ==================================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom Types (Enums)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('challenger', 'solver', 'admin', 'advanced');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived', 'open', 'in_progress', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users / Profiles (Unified for local auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255), -- For local JWT Auth
  full_name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'solver',
  cpf_cnpj VARCHAR(20),
  phone VARCHAR(20),
  organization VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  axis TEXT NOT NULL, -- Core innovation axis
  modality TEXT, -- Modality of participation
  proposer TEXT, -- Name of the proposing entity
  contact_phone TEXT,
  contact_email TEXT,
  relationship_type TEXT, 
  start_date DATE,
  end_date DATE,
  deadline TIMESTAMP WITH TIME ZONE,
  expected_results TEXT,
  benefits TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  status content_status NOT NULL DEFAULT 'draft',
  banner_url TEXT,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Solution Statuses table
CREATE TABLE IF NOT EXISTS solution_statuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  message TEXT, -- Message for WhatsApp/Email
  color VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Solutions table
CREATE TABLE IF NOT EXISTS solutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  submitted_by UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  axis TEXT,
  benefits TEXT,
  team_name TEXT,
  participant_type TEXT,
  problem_solved TEXT,
  contribution_objectives TEXT,
  direct_beneficiaries TEXT,
  detailed_operation TEXT,
  solution_differentials TEXT,
  territory_replication TEXT,
  required_resources TEXT,
  validation_prototyping TEXT,
  success_indicators TEXT,
  established_partnerships TEXT,
  solution_continuity TEXT,
  linkedin_link TEXT,
  instagram_link TEXT,
  portfolio_link TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  document_1_url TEXT,
  document_2_url TEXT,
  document_3_url TEXT,
  status_id UUID REFERENCES solution_statuses(id),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- News table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  author UUID REFERENCES users(id),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Site Settings (Geral)
CREATE TABLE IF NOT EXISTS geral (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_phone TEXT NOT NULL DEFAULT '(67) 3318-3500',
  facebook_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  youtube_url TEXT,
  ouvidoria_url TEXT,
  transparencia_url TEXT,
  servicos_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Program Info table
CREATE TABLE IF NOT EXISTS program_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  section TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- How to Participate table
CREATE TABLE IF NOT EXISTS how_to_participate (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ BEGIN
    CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_solutions_updated_at BEFORE UPDATE ON solutions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_geral_updated_at BEFORE UPDATE ON geral FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_program_info_updated_at BEFORE UPDATE ON program_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_how_to_participate_updated_at BEFORE UPDATE ON how_to_participate FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_solution_statuses_updated_at BEFORE UPDATE ON solution_statuses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Initial Data
INSERT INTO geral (id, contact_phone) 
VALUES (uuid_generate_v4(), '(67) 3318-3500')
ON CONFLICT DO NOTHING;

-- Initial Admin User (password: admin123)
-- Hash generated via bcrypt: $2b$10$NxlmvzymhqkHuAsy0MTW8OzuYElwfEUUbtCYDChFbIgoGBgz1w8PC
INSERT INTO users (id, email, password, full_name, role, organization)
VALUES (
    uuid_generate_v4(), 
    'admin@ms.gov.br', 
    '$2b$10$NxlmvzymhqkHuAsy0MTW8OzuYElwfEUUbtCYDChFbIgoGBgz1w8PC', 
    'Administrador do Sistema', 
    'admin', 
    'Governo MS'
) ON CONFLICT (email) DO NOTHING;


-- ==================================================================================
-- PART 2: PERMISSIONS (EXECUTE BASED ON ENVIRONMENT)
-- ==================================================================================

DO $$ 
BEGIN
    -- Grant permissions for PRODUCTION user if it exists
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'user_inova_prd') THEN
        GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO user_inova_prd;
        GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO user_inova_prd;
        GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO user_inova_prd;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO user_inova_prd;
        RAISE NOTICE 'Permissions granted to user_inova_prd';
    END IF;

    -- Grant permissions for HOMOLOGATION user if it exists
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'user_inova_hml') THEN
        GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO user_inova_hml;
        GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO user_inova_hml;
        GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO user_inova_hml;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO user_inova_hml;
        RAISE NOTICE 'Permissions granted to user_inova_hml';
    END IF;
END $$;
