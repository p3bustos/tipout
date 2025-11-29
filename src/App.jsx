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
        <footer className="footer">
          <p>{t('footerText')} <a href="http://github.com/p3bustos" target="_blank" rel="noopener noreferrer">p3bustos</a></p>
        </footer>
      </div>
    </div>
  );
}

export default App;