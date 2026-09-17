#!/usr/bin/env bash
# ==============================================================================
# APEXX // Cyberpunk Life OS & Goal Engine - Environment Bootstrap Script
# ==============================================================================
set -e

echo "============================================================"
echo "   APEXX .OS // INITIALIZING REPOSITORY BOOTSTRAP PROTOCOL  "
echo "============================================================"

# 1. Create Core Project Directory Structure
echo "--> Creating APEXX directory hierarchy..."
mkdir -p src/app/command-center
mkdir -p src/app/character
mkdir -p src/app/habits
mkdir -p src/app/focus
mkdir -p src/app/analytics
mkdir -p src/app/settings
mkdir -p src/app/coach
mkdir -p src/app/api/ai/generate-quests

mkdir -p src/components/layout
mkdir -p src/components/dashboard
mkdir -p src/components/habits
mkdir -p src/components/focus
mkdir -p src/components/analytics
mkdir -p src/components/canvas
mkdir -p src/components/character
mkdir -p src/components/coach
mkdir -p src/components/goals
mkdir -p src/components/settings
mkdir -p src/components/common

mkdir -p src/lib
mkdir -p src/store
mkdir -p src/types
mkdir -p prisma

echo "✓ Directories created successfully."

# 2. Install Production & Development Dependencies
echo "--> Installing core production and UI dependencies..."
npm install \
  lucide-react \
  framer-motion \
  zustand \
  clsx \
  tailwind-merge \
  recharts \
  @react-three/fiber \
  @react-three/drei \
  three \
  @types/three \
  @google/genai \
  zod \
  @prisma/client

echo "--> Installing development dependencies..."
npm install -D \
  prisma \
  @types/node \
  @types/react \
  @types/react-dom \
  typescript

echo "✓ All npm packages installed cleanly."

# 3. Create .env.example Boilerplate
echo "--> Generating environment configuration boilerplate (.env.example)..."
cat << 'EOF' > .env.example
# PostgreSQL Database Connection String for Prisma ORM
DATABASE_URL="postgresql://apexx_user:apexx_password@localhost:5432/apexx_db?schema=public"

# Google Gemini AI LLM API Key (BYOK)
GEMINI_API_KEY="AIzaSy...Your_Gemini_API_Key_Here"
EOF

if [ ! -f .env ]; then
  cp .env.example .env
  echo "✓ Created .env file from .env.example."
fi

# 4. Generate Prisma Client
echo "--> Initializing Prisma Schema Validation..."
if [ -f prisma/schema.prisma ]; then
  npx prisma generate
fi

echo "============================================================"
echo "   APEXX .OS BOOTSTRAP COMPLETE! SYSTEM READY FOR RUNTIME  "
echo "   Run 'npm run dev' to launch local development server.    "
echo "============================================================"
