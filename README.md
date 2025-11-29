# 💰 Tip-Out Calculator

A modern, mobile-first React application for calculating fair tip distribution among restaurant and service industry workers. Built to solve a real-world problem while demonstrating production-ready development practices.

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple)](https://vitejs.dev/)

## 🌐 Live Demo

**Visit the live application:** [https://tipout-nine.vercel.app](https://tipout-nine.vercel.app)

## 📱 Overview

This single-page application (SPA) helps restaurant workers quickly and fairly calculate tip distribution using three different methods:

- **Equal Split** - Divide tips equally among all staff
- **By Hours Worked** - Proportional distribution based on hours
- **By Percentage** - Custom allocation per role or position

### Key Features

✅ **Mobile-First Design** - Optimized for phone use during busy shifts  
✅ **Offline Capable** - Works without internet after initial load  
✅ **History Tracking** - Saves last 10 calculations locally  
✅ **Real-Time Validation** - Immediate feedback on input errors  
✅ **Responsive UI** - Works seamlessly on any device  
✅ **Zero Backend** - Client-side only, no server required  

## 🎯 Development Principles Demonstrated

### 1. **Mobile-First Design**
- Started with mobile layout as the base
- Progressive enhancement for larger screens
- Responsive typography and flexible layouts
- Tested across multiple device sizes


### 2. **Modern React Patterns**
- **Functional Components** - No class components, modern hooks-based approach
- **useState** - Local state management for UI and form data
- **useEffect** - Side effects for localStorage persistence
- **Component Composition** - Single responsibility, reusable patterns
- **Controlled Components** - React manages all form state

### 3. **Performance Optimization**
- **Code Splitting** - Vite automatically splits vendor bundles
- **Tree Shaking** - Only imports used icon components
- **Lazy Loading** - Icons loaded on demand
- **Minimal Re-renders** - Optimized state updates
- **Small Bundle Size** - ~150KB total (gzipped)

### 4. **User Experience (UX)**
- **Immediate Feedback** - Real-time validation and error messages
- **Error Prevention** - Input validation before calculation
- **Clear Visual Hierarchy** - Important actions stand out
- **Accessibility** - Semantic HTML, keyboard navigation
- **Loading States** - Visual feedback for all actions

### 5. **Clean Code Practices**
- **Descriptive Naming** - Clear, self-documenting variable/function names
- **Single Responsibility** - Each function does one thing well
- **DRY Principle** - No repeated logic
- **Consistent Formatting** - ESLint configuration enforced
- **Comments** - Only where necessary, code is self-explanatory

### 6. **DevOps & CI/CD**
- **Version Control** - Git with semantic commits
- **Continuous Deployment** - Automatic deploys on git push
- **Zero-Downtime Deploys** - Vercel handles rollouts

### 7. **Data Persistence Strategy**
- **Client-Side Storage** - localStorage for history
- **Data Serialization** - JSON for structured data
- **Storage Limits** - Maintains only last 10 calculations
- **Graceful Degradation** - Works without localStorage
- **Privacy First** - All data stays on user's device

### 8. **Responsive Design Patterns**
- **Flexbox & CSS Grid** - Modern layout techniques
- **Fluid Typography** - rem units for scalability
- **CSS Custom Properties** - Centralized theming
- **Mobile Breakpoints** - 640px, 768px, 1024px

## 🛠️ Tech Stack

| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **React 18.2** | UI Framework | Modern hooks, excellent performance, industry standard |
| **Vite 5.0** | Build Tool | Lightning-fast HMR, optimized builds, better DX than CRA |
| **Lucide React** | Icons | Lightweight (tree-shakeable), consistent design, MIT license |
| **CSS3** | Styling | No framework overhead, full control, smaller bundle |
| **LocalStorage API** | Data Persistence | No backend needed, instant load, privacy-friendly |
| **Vercel** | Hosting | Free tier, global CDN, automatic HTTPS, zero-config |


## 💡 How It Works

### Equal Split Calculation
```javascript
const perPerson = totalTips / numberOfEmployees;
```

### Hours-Based Calculation
```javascript
const totalHours = employees.reduce((sum, emp) => sum + emp.hours, 0);
const perHour = totalTips / totalHours;
const employeeShare = perHour * employeeHours;
```

### Percentage-Based Calculation
```javascript
const employeeShare = (totalTips * percentage) / 100;
```

## 🎨 Design System

### Color Palette
```css
--primary: #2563eb        /* Primary Blue */
--primary-dark: #1e40af   /* Hover State */
--success: #10b981        /* Success Green */
--danger: #ef4444         /* Error Red */
--surface: #ffffff        /* Card Background */
--background: #f8fafc     /* Page Background */
```
### Typography
- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI)
- **Headings**: 2rem → 1.5rem (desktop → mobile)
- **Body**: 1rem base with 1.6 line height
- **Inputs**: 1.5rem for easy reading


## 🔒 Privacy & Security
- **No Backend** - All calculations happen client-side
- **No Data Collection** - History stored locally only
- **No Authentication** - No personal data required
- **HTTPS Only** - Encrypted connection enforced

## 🤝 Use Cases

### For Workers
- Calculate complex tip distributions
- Track historical distributions
- Works offline after initial load

## 📈 Future Enhancements

Potential features for Phase 2:

- [ ] **Backend API** - Save calculations to database
- [ ] **User Accounts** - Track history across devices
- [ ] **Team Management** - Manage regular employee rosters
- [ ] **Export Features** - PDF/CSV export of results
- [ ] **Multi-Currency** - Support for different currencies
- [ ] **Tax Calculations** - Automatic tax withholding
- [ ] **Email Receipts** - Send results via email
- [X] **Analytics Dashboard** - Usage statistics and trends
- [ ] **PWA** - Full offline mode with service worker
- [X] **Multi-Language** - i18n support

## 🐛 Known Issues

None currently. Report issues via GitHub Issues.

## 📝 License

**All Rights Reserved - No License**

Copyright © 2025 Patricio B. All rights reserved.

This project is provided for **demonstration and portfolio purposes only**.

⚠️ **USE AT YOUR OWN RISK**

- This software is provided "as is" without warranty of any kind
- The author is not liable for any damages or issues arising from use
- No support or maintenance is guaranteed

🚫 **DO NOT COPY**

- This code may NOT be copied, modified, or distributed
- This code may NOT be used in other projects without explicit written permission
- Viewing for educational purposes only

For inquiries about using this code, please contact the author.

## 👤 Author

**Patricio B.**
- Software Engineering Manager
- 15+ years software engineering experience
- Platform Engineering & Cloud Architecture specialist
- GitHub: [@p3bustos](https://github.com/p3bustos)
- LinkedIn: [p3bustos](https://linkedin.com/in/p3bustos)


## 🙏 Acknowledgments
- Inspired by family member's needs in the service industry

## 📞 Contact

Questions or suggestions? Open an issue or reach out!

---

**Built with ❤️ to make tip distribution fair and easy**