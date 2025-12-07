import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, DollarSign, Users, Clock, History, Trash2, Globe } from 'lucide-react';
import './App.css';
import { track } from '@vercel/analytics';

function App() {
  const { t, i18n} = useTranslation();
  const [totalTips, setTotalTips] = useState('');
  const [calculationMethod, setCalculationMethod] = useState('equal');
  const [employees, setEmployees] = useState([
    { id: 1, name: '', hours: '', percentage: '' }
  ]);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('tipoutHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('tipoutHistory', JSON.stringify(history));
    }
  }, [history]);

  const addEmployee = () => {
    track('add_employee', { currentCount: employees.length });
    setEmployees([
      ...employees,
      { id: Date.now(), name: '', hours: '', percentage: '' }
    ]);
  };

  const removeEmployee = (id) => {
    if (employees.length > 1) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const updateEmployee = (id, field, value) => {
    setEmployees(employees.map(emp =>
      emp.id === id ? { ...emp, [field]: value } : emp
    ));
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const calculateTipout = () => {
    const tips = parseFloat(totalTips);
    if (isNaN(tips) || tips <= 0) {
      alert(t('validTipsAmount'));
      return;
    }

    track('calculation', {
      method: calculationMethod,
      employeeCount: employees.length,
      totalTips: tips
    });

    let calculatedResults = [];

    switch (calculationMethod) {
      case 'equal':
        const perPerson = tips / employees.length;
        calculatedResults = employees.map(emp => ({
          name: emp.name || 'Unnamed Employee',
          amount: perPerson,
          details: `Split equally among ${employees.length} people`
        }));
        break;

      case 'hours':
        const validEmployees = employees.filter(emp => 
          emp.name && emp.hours && parseFloat(emp.hours) > 0
        );
        
        if (validEmployees.length === 0) {
          alert(t('validHours'));
          return;
        }

        const totalHours = validEmployees.reduce((sum, emp) => 
          sum + parseFloat(emp.hours), 0
        );
        const perHour = tips / totalHours;

        calculatedResults = validEmployees.map(emp => {
          const hours = parseFloat(emp.hours);
          return {
            name: emp.name,
            amount: perHour * hours,
            details: t('hoursWorked', { hours: hours, rate: perHour.toFixed(2) })
          };
        });
        break;

      case 'percentage':
        const validPercentages = employees.filter(emp => 
          emp.name && emp.percentage && parseFloat(emp.percentage) > 0
        );
        
        if (validPercentages.length === 0) {
          alert(t('validPercentages'));
          return;
        }

        const totalPercentage = validPercentages.reduce((sum, emp) => 
          sum + parseFloat(emp.percentage), 0
        );

        if (Math.abs(totalPercentage - 100) > 0.01) {
          alert(t('percentageWarning', { total: totalPercentage.toFixed(1) }));
          return
        }

        calculatedResults = validPercentages.map(emp => {
          const percentage = parseFloat(emp.percentage);
          return {
            name: emp.name,
            amount: (tips * percentage) / 100,
            details: t('percentageOfTotal', { percentage: percentage.toFixed(1) })
          };
        });
        break;

      default:
        break;
    }

    setResults(calculatedResults);

    // Add to history
    const newHistoryEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      totalTips: tips,
      method: calculationMethod,
      results: calculatedResults
    };
    setHistory([newHistoryEntry, ...history].slice(0, 10)); // Keep last 10
  };

  const clearHistory = () => {
    track('clear_history');
    if (window.confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
      localStorage.removeItem('tipoutHistory');
    }
  };

  const loadFromHistory = (entry) => {
    track('load_history', { entryId: entry.id });
    setTotalTips(entry.totalTips.toString());
    setCalculationMethod(entry.method);
    setResults(entry.results);
    setShowHistory(false);
  };

  const resetForm = () => {
    setTotalTips('');
    setEmployees([{ id: 1, name: '', hours: '', percentage: '' }]);
    setResults(null);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="header-content">
            <Calculator className="header-icon" size={32} />
            <h1>{t('appTitle')}</h1>
          </div>
          <p className="subtitle">{t('appSubtitle')}</p>
          <div className="language-selector">
            <Globe size={18} />
            <button 
              className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
              onClick={() => changeLanguage('en')}
            >
              EN
            </button>
            <button
              className={`lang-btn ${i18n.language === 'es' ? 'active' : ''}`}
              onClick={() => changeLanguage('es')}
            >
              ES
            </button>
          </div>
        </header>
        <div className="main-content">
          <div className="card">
            <div className="card-header">
              <DollarSign size={20} />
              <h2>{t('totalTips')}</h2>
            </div>
            <input
              type="number"
              className="input-large"
              placeholder={t('enterTotalTips')}
              value={totalTips}
              onChange={(e) => setTotalTips(e.target.value)}
              step="0.01"
              min="0"
            />
          </div>

          <div className="card">
            <div className="card-header">
              <Calculator size={20} />
              <h2>{t('calculationMethod')}</h2>
            </div>
            <div className="method-buttons">
              <button
                className={`method-btn ${calculationMethod === 'equal' ? 'active' : ''}`}
                onClick={() => setCalculationMethod('equal')}
              >
                <Users size={18} />
                {t('equalSplit')} 
              </button>
              <button
                className={`method-btn ${calculationMethod === 'hours' ? 'active' : ''}`}
                onClick={() => setCalculationMethod('hours')}
              >
                <Clock size={18} />
                {t('byHours')}
              </button>
              <button
                className={`method-btn ${calculationMethod === 'percentage' ? 'active' : ''}`}
                onClick={() => setCalculationMethod('percentage')}
              >
                <DollarSign size={18} />
                {t('byPercentage')}
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <Users size={20} />
              <h2>{t('employees')}</h2>
            </div>
            <div className="employees-list">
              {employees.map((emp, index) => (
                <div key={emp.id} className="employee-row">
                  <input
                    type="text"
                    className="input"
                    placeholder={t('employeeName', { number: index + 1 })}
                    value={emp.name}
                    onChange={(e) => updateEmployee(emp.id, 'name', e.target.value)}
                  />
                  {calculationMethod === 'hours' && (
                    <input
                      type="number"
                      className="input input-small"
                      placeholder={t('hours')}
                      value={emp.hours}
                      onChange={(e) => updateEmployee(emp.id, 'hours', e.target.value)}
                      step="0.5"
                      min="0"
                    />
                  )}
                  {calculationMethod === 'percentage' && (
                    <input
                      type="number"
                      className="input input-small"
                      placeholder={t('percentage')}
                      value={emp.percentage}
                      onChange={(e) => updateEmployee(emp.id, 'percentage', e.target.value)}
                      step="1"
                      min="0"
                      max="100"
                    />
                  )}
                  {employees.length > 1 && (
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => removeEmployee(emp.id)}
                      title={t('removeEmployee')}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button className="btn-secondary" onClick={addEmployee}>
              {t('addEmployee')}
            </button>
          </div>

          <div className="action-buttons">
            <button className="btn-primary" onClick={calculateTipout}>
              {t('calculate')}
            </button>
            <button className="btn-secondary" onClick={resetForm}>
              {t('reset')}
            </button>
            <button 
              className="btn-secondary"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History size={18} />
              {showHistory ? t('hideHistory') : t('showHistory')}
            </button>
          </div>

          {results && (
            <div className="card results-card">
              <div className="card-header">
                <DollarSign size={20} />
                <h2>{t('tipOutResults')}</h2>
              </div>
              <div className="results-list">
                {results.map((result, index) => (
                  <div key={index} className="result-item">
                    <div className="result-info">
                      <div className="result-name">{result.name}</div>
                      <div className="result-details">{result.details}</div>
                    </div>
                    <div className="result-amount">
                      ${result.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="results-total">
                <span>{t('totalDistributed')}:</span>
                <span className="total-amount">
                  ${results.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {showHistory && history.length > 0 && (
            <div className="card">
              <div className="card-header">
                <History size={20} />
                <h2>{t('calculationHistory')}</h2>
                <button className="btn-icon btn-danger" onClick={clearHistory}>
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="history-list">
                {history.map((entry) => (
                  <div 
                    key={entry.id} 
                    className="history-item"
                    onClick={() => loadFromHistory(entry)}
                  >
                    <div className="history-info">
                      <div className="history-date">
                        {new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString()}
                      </div>
                      <div className="history-details">
                        ${entry.totalTips.toFixed(2)} • {entry.method} • {entry.results.length} employees
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <section className="faq-section" id="faq">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>How do I calculate tip out for servers?</h3>
              <p>Enter the total tips collected, select your calculation method (equal split, by hours, or by percentage), add your team members, and click Calculate. The calculator will show each person's fair share.</p>
            </div>
            <div className="faq-item">
              <h3>Is this tip calculator free to use?</h3>
              <p>Yes! This tip out calculator is completely free with no registration required. Use it unlimited times, and your calculation history is saved locally on your device.</p>
            </div>
            <div className="faq-item">
              <h3>Does the tip calculator work offline?</h3>
              <p>Yes! After your first visit, the calculator works offline. Your history is saved locally on your device, so you can access it even without internet connection.</p>
            </div>
            <div className="faq-item">
              <h3>Which tip calculation method should I use?</h3>
              <p>Use Equal Split for teams with similar roles and hours. Use By Hours for mixed part-time and full-time staff. Use By Percentage when different roles receive different tip percentages (e.g., servers vs. bussers).</p>
            </div>
            <div className="faq-item">
              <h3>Can I use this for bar tip outs?</h3>
              <p>Absolutely! This calculator works for restaurants, bars, cafes, and any service industry where tips need to be distributed among staff members.</p>
            </div>
            <div className="faq-item">
              <h3>Is my tip calculation data private?</h3>
              <p>Yes! All calculations are done in your browser. Nothing is sent to a server. Your history is stored only on your device.</p>
            </div>
          </div>
        </section>
        <footer className="footer">
          <p>{t('footerText')} <a href="http://github.com/p3bustos" target="_blank" rel="noopener noreferrer">p3bustos</a></p>
            <div className="footer-seo">
          <h3>About Tip Out Calculator</h3>
          <p>
            Free online tip calculator designed for restaurant workers, servers, bartenders,
            and service industry professionals. Calculate fair tip distribution using three methods:
            equal split among all staff, proportional distribution based on hours worked, or
            custom percentage allocation. No login required, works offline, and saves your
            calculation history locally for quick reference during busy shifts.
          </p>
          <p>
            <strong>Keywords:</strong> tip calculator, tipout calculator, tip distribution,
            restaurant tips, server tips, tip pooling, gratuity calculator, tip sharing calculator,
            fair tip split, tip out sheet, tip distribution calculator
          </p>
        </div>

          <div className="disclaimer">
            <h4>⚠️ Legal Disclaimer</h4>
            <p>
              This tip calculator is provided "as is" for informational and convenience purposes only. 
              While we strive for accuracy, we make no warranties or guarantees regarding the calculations, 
              results, or suitability for any particular purpose.
            </p>
            <p>
              <strong>Use at Your Own Risk:</strong> By using this calculator, you acknowledge that you are 
              solely responsible for verifying all calculations and results. The creator and operators of 
              this tool assume no liability for any errors, omissions, losses, damages, or disputes arising 
              from the use of this calculator.
            </p>
            <p>
              This tool does not constitute financial, legal, or professional advice. Always verify tip 
              distribution calculations with your employer's policies and applicable labor laws in your 
              jurisdiction. For official tip distribution matters, consult with your manager, HR department, 
              or a qualified professional.
            </p>
            <p className="disclaimer-emphasis">
              <strong>No Responsibility:</strong> The creator accepts no responsibility for any consequences, 
              financial or otherwise, resulting from the use of this calculator. All calculations should be 
              independently verified before implementation.
            </p>
          </div>
          <p className="footer-copyright">
            © {new Date().getFullYear()} Tip Out Calculator. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;