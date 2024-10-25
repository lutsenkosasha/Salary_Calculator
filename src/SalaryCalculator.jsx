import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './SalaryCalculator.css'

const SalaryCalculator = () => {
    const [data, setData] = useState([]);
  
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
        processFileData(sheetData);
      };
  
      reader.readAsBinaryString(file);
    };
  
    const processFileData = (sheetData) => {
      const processedData = {};
      let currentName = '';
  
      sheetData.forEach((row, index) => {
        if (index === 0) return;
  
        const [name, year, month, salary] = row;
  
        if (name) {
          currentName = name;
        }
  
        // Инициализируем данные для нового сотрудника
        if (!processedData[currentName]) {
          processedData[currentName] = {
            totalSalary: 0,
            vacationPay: 0,
          };
        }
  
        // Суммируем зарплату
        processedData[currentName].totalSalary += salary;
      });
  
      // Рассчитываем отпускные
      const result = Object.keys(processedData).map((name) => {
        const totalSalary = processedData[name].totalSalary;
        const halfYearlySalary = totalSalary / 2;
        const vacationPay = halfYearlySalary * 0.10; // 10% от полугодовой зарплаты
  
        return {
          name,
          totalSalary,
          vacationPay,
        };
      });
  
      setData(result);
    };

  return (
    <div>
      <h1>Загрузка файла с зарплатами</h1>
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />
      
      {data.length > 0 && (
        <table className="TableSalary" border="1">
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Общий заработок</th>
              <th>Отпускные</th>
            </tr>
          </thead>
          <tbody>
            {data.map((person, index) => (
              <tr key={index}>
                <td width="300px">{person.name}</td>
                <td>{person.totalSalary}</td>
                <td>{person.vacationPay.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SalaryCalculator;