import React, { useState, useRef } from 'react';
import * as ExcelJS from 'exceljs';

interface ExcelImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
}

const ExcelImport: React.FC<ExcelImportProps> = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) {
    return null;
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleReset = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.getWorksheet(1);
      if (!worksheet) {
        alert('Excel dosyasında sayfa bulunamadı');
        return;
      }

      const data: any[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
        
        const rowData: any = {};
        row.eachCell((cell, colNumber) => {
          const columnHeaders = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
          const header = columnHeaders[colNumber - 1];
          rowData[header] = cell.text || cell.value;
        });
        
        if (Object.values(rowData).some(value => value && value.toString().trim() !== '')) {
          data.push(rowData);
        }
      });

      onImport(data);
      onClose();
    } catch (error) {
      console.error('Excel okuma hatası:', error);
      alert('Excel dosyası okunurken hata oluştu');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      <div style={{
        backgroundColor: 'white',
        width: '500px',
        height: 'auto',
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '15px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            Excel İçe Aktar
          </h2>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'rgba(0, 0, 0, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'normal',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.color = '#333';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.color = '#666';
            }}
          >
            ×
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          style={{
            border: `2px dashed ${isDragging ? '#007bff' : file ? '#28a745' : '#ccc'}`,
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: isDragging ? '#f8f9fa' : file ? '#f8fff8' : '#fafafa',
            transition: 'all 0.2s ease',
            margin: '20px 0'
          }}
        >
          {!file ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{
                margin: '0 0 10px 0',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Dosyayı buraya sürükleyin
              </p>
              <p style={{
                margin: '0 0 15px 0',
                fontSize: '14px',
                color: '#666'
              }}>
                veya seçmek için tıklayın
              </p>
              <div style={{
                marginTop: '15px',
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Dosya Seç
              </div>
              <p style={{
                margin: '10px 0 0 0',
                fontSize: '12px',
                color: '#999'
              }}>
                Excel (.xlsx, .xls) dosyaları desteklenir
              </p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <p style={{
                margin: '0 0 10px 0',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#28a745'
              }}>
                Dosya Yüklendi
              </p>
              <p style={{
                margin: '0 0 15px 0',
                fontSize: '14px',
                color: '#666'
              }}>
                {file.name}
              </p>
              <button
                onClick={handleReset}
                style={{
                  marginTop: '10px',
                  border: '1px solid #dc3545',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: '#f8f9fa',
                  color: '#dc3545',
                  fontSize: '12px',
                  padding: '5px 10px'
                }}
              >
                Farklı Dosya Seç
              </button>
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '10px',
          marginTop: '20px'
        }}>
          <button
            onClick={() => {
              setFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            style={{
              flex: '1',
              padding: '10px 20px',
              border: '1px solid #6c757d',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: '#f8f9fa',
              color: '#6c757d',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Sıfırla
          </button>
          {file && (
            <button
              onClick={handleImport}
              style={{
                flex: '1',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: '#007bff',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              İçe Aktar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExcelImport;