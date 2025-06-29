# EndoConnect Admin Panel

Modern admin dashboard for managing EndoConnect platform users, consent, clinical data, and educational content. Built with Next.js 15, TypeScript, and Ant Design.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EndoConnect_admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or  
   pnpm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - If port 3000 is in use, Next.js will automatically use port 3001
   - Network access available at `http://<your-ip>:3001`

## 🏗️ Project Structure

```
EndoConnect_admin/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout with AntD setup
│   │   ├── page.tsx           # Main admin dashboard
│   │   ├── globals.css        # Global styles
│   │   └── favicon.ico        # App icon
│   └── components/            # React components
│       ├── SERPDashboard.tsx     # Symptom, Engagement & Risk Profile dashboard
│       ├── UserManagement.tsx   # User management with LGPD consent
│       ├── TeamMemberManagement.tsx # Team member admin
│       ├── EducationalModules.tsx   # Educational content management
│       ├── FeedbackForms.tsx        # Screening questions management
│       ├── ClinicalDataManagement.tsx # Clinical data & feedback
│       └── WarningSupressor.tsx     # Development warnings handler
├── public/                    # Static assets
├── package.json              # Dependencies and scripts
├── next.config.ts            # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── .eslintrc.json           # ESLint configuration
```

## 👥 User Roles & Access

### Current User Profile
- **Name**: Pavlo (Dev)
- **Role**: Coordenador Técnico (Technical Coordinator)
- **Access Level**: Full admin access to all modules

### Role Hierarchy
- **Coordenador Técnico**: Full system access
- **Pesquisador**: Research data access
- **Desenvolvedor**: Technical management
- **Analista**: Data analysis access

## 📊 Available Modules

### 1. 🎯 SERP Dashboard
**Symptom, Engagement & Risk Profile monitoring**
- Real-time user metrics (156 total users, 98 active)
- Symptom distribution analysis
- Engagement scoring (73.5/100 average)
- Risk assessment alerts
- Weekly triage tracking (47 screenings)

### 2. 👤 User Management  
**LGPD-compliant user administration**
- Anonymous user profiles (ANON-XXXXXX)
- Consent status tracking (`ativo`, `revogado`, `pendente`)
- Risk level assessment (`baixo`, `medio`, `alto`)
- Symptom profile categorization
- Educational module progress tracking
- One-click consent revocation with audit trail

### 3. 👥 Team Member Management
**Administrative team control**
- Team member invitation system
- Role-based permission management
- Access level configuration
- Activity tracking and audit logs
- Department organization

### 4. 📝 Screening Questions
**Clinical questionnaire management**
- Dynamic screening form builder
- Question flow logic
- Response analytics
- Risk scoring algorithms
- Multi-language support ready

### 5. 📚 Educational Modules
**Content management system**
- Module creation and editing
- Progress tracking
- Engagement analytics
- Content categorization
- Interactive learning materials

### 6. 📈 Clinical Data & Feedback
**Research data management**
- Clinical data aggregation
- Feedback form responses
- Statistical analysis tools
- Data export capabilities
- Research compliance tracking

## 🔐 Authentication & Security

### Current Setup
- Mock authentication system (development)
- Role-based access control implemented
- LGPD compliance features built-in

### LGPD Compliance Features
- ✅ Consent version tracking
- ✅ User rights management
- ✅ Data portability support
- ✅ Right to deletion
- ✅ Consent revocation
- ✅ Audit trail logging
- ✅ IP address tracking
- ✅ Anonymous user identification

### Security Headers
- CSRF protection ready
- Secure cookie configuration
- Content Security Policy headers

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint checks

# Code Quality
npx tsc --noEmit     # TypeScript type checking
npm run lint --fix   # Auto-fix linting issues
```

### Technology Stack

- **Frontend**: Next.js 15.3.3, React 18.3.1, TypeScript 5
- **UI Library**: Ant Design 5.25.4 with custom theming
- **Styling**: CSS Modules + Ant Design tokens
- **State Management**: React hooks (useState, useEffect)
- **Icons**: Ant Design Icons 6.0.0
- **Date Handling**: Day.js 1.11.13

### Development Guidelines

1. **Code Style**: Follow ESLint configuration
2. **Components**: Use functional components with hooks
3. **Naming**: Use descriptive names (camelCase for variables, PascalCase for components)
4. **Types**: Prefer explicit TypeScript interfaces over `any`
5. **Imports**: Clean up unused imports before commits

## 🐛 Known Issues & Fixes

### Current Lint Warnings (51 total)
- **Unused imports**: Clean up unused Ant Design components
- **Unused variables**: Remove unused form handlers and state
- **TypeScript**: Replace `any` types with specific interfaces
- **Error handling**: Implement proper error logging

### Quick Fixes
```bash
# Auto-fix many linting issues
npm run lint -- --fix

# Remove unused imports (manual review recommended)
# Check each component for unused imports and variables
```

## 🚀 Deployment

### Build Process
```bash
npm run build        # Creates optimized production build
npm run start        # Serves production build locally
```

### Environment Setup
- **Development**: Auto-reloading, detailed errors
- **Production**: Optimized bundles, error boundaries
- **Network Access**: Configurable via Next.js settings

### Deployment Checklist
- [ ] Run `npm run build` successfully
- [ ] Fix all TypeScript errors
- [ ] Address critical ESLint warnings
- [ ] Test all module functionality
- [ ] Verify LGPD consent flows
- [ ] Check responsive design
- [ ] Configure production environment variables

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Follow existing code patterns
2. Update documentation for new features
3. Test consent management thoroughly
4. Maintain LGPD compliance
5. Use semantic commit messages

## 📞 Support

For technical issues or questions:
- Review component documentation in source files
- Check browser console for development errors
- Verify all dependencies are installed correctly

---

**Last Updated**: January 2024  
**Version**: 0.1.0  
**License**: Private - EndoConnect Platform
